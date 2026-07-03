import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import transporter from '../config/mail.js'

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

const getUserIdFromReq = (req) => req.userId

const sanitizeUser = (user) => {
  if (!user) return null
  const obj = user.toObject ? user.toObject() : user
  return {
    id: obj._id,
    fullName: obj.fullName || obj.name || '',
    name: obj.name || obj.fullName || '',
    email: obj.email,
    phone: obj.phone || '',
    role: obj.role || 'user',
    avatarUrl: obj.avatarUrl || '',
    memberSince: obj.memberSince,
    lastLoginAt: obj.lastLoginAt,
    status: obj.status || 'active',
    emailVerified: obj.emailVerified || false,
  }
}

const validateEmailUpdate = (email) => {
  if (!validator.isEmail(email || '')) return 'Please enter a valid email'
  return null
}

const validatePhone = (phone) => {
  if (!phone) return null
  const cleaned = String(phone).trim()
  if (cleaned.length > 0 && !/^[0-9+\-\s()]{6,20}$/.test(cleaned)) {
    return 'Please enter a valid phone number'
  }
  return null
}

const passwordStrength = (password) => {
  let score = 0
  if (!password) return 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return Math.min(6, score)
}

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ message: "User doesn't exist", success: false })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      // Track login audit (best-effort)
      try {
        await userModel.findByIdAndUpdate(user._id, {
          lastLoginAt: new Date(),
          $push: {
            loginHistory: {
              at: new Date(),
              ip: req.ip || '',
              userAgent: req.headers['user-agent'] || '',
              device: req.headers['sec-ch-ua'] || '',
              success: true,
            },
          },
        })
      } catch (_) {}

      const token = createToken(user._id)
      return res.json({ success: true, token })
    }

    return res.json({ success: false, message: 'Invalid creadentials' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// Route for user Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exists = await userModel.findOne({ email })
    if (exists) {
      return res.json({ success: false, message: 'User already exists' })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid  email' })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      fullName: name,
      email,
      password: hashedPassword,
      memberSince: new Date(),
      emailVerified: false,
      status: 'active',
      role: 'user',
    })

    const user = await newUser.save()
    const token = createToken(user._id)

    return res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: 'error.message' })
  }
}

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      return res.json({ success: true, token })
    }

    return res.json({ success: false, message: 'Invalid Credentials' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: 'error.message' })
  }
}

// ===================== Profile / Security =====================

const getUserProfile = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req)
    const user = await userModel.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    return res.json({ success: true, user: sanitizeUser(user) })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req)
    const { fullName, email, phone } = req.body

    if (!fullName || String(fullName).trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Please enter a valid full name' })
    }

    const update = {
      fullName: String(fullName).trim(),
      name: String(fullName).trim(),
    }

    if (email !== undefined) {
      const emailErr = validateEmailUpdate(email)
      if (emailErr) return res.status(400).json({ success: false, message: emailErr })

      const duplicate = await userModel.findOne({ email: String(email).trim().toLowerCase(), _id: { $ne: userId } })
      if (duplicate) return res.status(409).json({ success: false, message: 'Email already in use' })

      update.email = String(email).trim().toLowerCase()
    }

    if (phone !== undefined) {
      const phoneErr = validatePhone(phone)
      if (phoneErr) return res.status(400).json({ success: false, message: phoneErr })

      update.phone = phone ? String(phone).trim() : ''
    }

    const updated = await userModel.findByIdAndUpdate(userId, update, { new: true })
    return res.json({ success: true, message: 'Profile updated', user: sanitizeUser(updated) })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

const changePassword = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req)
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please fill all fields' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' })
    }

    const strength = passwordStrength(newPassword)
    if (strength < 3) {
      return res.status(400).json({ success: false, message: 'Please choose a stronger password' })
    }

    const user = await userModel.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      passwordLastChangedAt: new Date(),
      resetPasswordTokenHash: '',
      resetPasswordExpiresAt: null,
    })

    return res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!validator.isEmail(email || '')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' })
    }

    const user = await userModel.findOne({ email: String(email).trim().toLowerCase() })

    // Avoid user enumeration
    if (!user) {
      return res.json({ success: true, message: 'If your email exists, a reset link will be sent' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes

    await userModel.findByIdAndUpdate(user._id, {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: expiresAt,
    })

    const frontendUrl = process.env.FRONTEND_URL || ''
    const resetUrl = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_EMAIL,
      to: user.email,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 30 minutes.</p>
      `,
    })

    return res.json({ success: true, message: 'Reset email sent' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword, confirmPassword } = req.body

    if (!token || !email) return res.status(400).json({ success: false, message: 'Invalid request' })

    if (!newPassword || newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' })
    }

    const strength = passwordStrength(newPassword)
    if (strength < 3) {
      return res.status(400).json({ success: false, message: 'Please choose a stronger password' })
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const user = await userModel.findOne({
      email: String(email).trim().toLowerCase(),
      resetPasswordTokenHash: resetTokenHash,
    })

    if (!user || !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'Reset token expired or invalid' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Prevent token reuse
    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      passwordLastChangedAt: new Date(),
      resetPasswordTokenHash: '',
      resetPasswordExpiresAt: null,
    })

    return res.json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

const uploadAvatar = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req)

    if (!req.files || !req.files.avatar || !req.files.avatar[0]) {
      return res.status(400).json({ success: false, message: 'Avatar file is required' })
    }

    const file = req.files.avatar[0]

    const allowedMime = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedMime.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Invalid image type' })
    }

    const maxBytes = 3 * 1024 * 1024
    if (file.size > maxBytes) {
      return res.status(400).json({ success: false, message: 'Image too large (max 3MB)' })
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: 'image',
      folder: 'avatars',
      transformation: [
        { width: 512, height: 512, crop: 'limit' },
        { quality: 'auto:best' },
        { fetch_format: 'auto' },
      ],
    })

    const updated = await userModel.findByIdAndUpdate(userId, { avatarUrl: uploadResult.secure_url }, { new: true })

    return res.json({ success: true, message: 'Avatar updated', user: sanitizeUser(updated) })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  uploadAvatar,
}

