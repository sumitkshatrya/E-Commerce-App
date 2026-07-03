import express from 'express'
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, changePassword, forgotPassword, resetPassword, uploadAvatar } from '../controllers/userController.js'
import authUser from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router();

// Auth
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)

// Profile (authenticated)
userRouter.get('/profile', authUser, getUserProfile)
userRouter.put('/profile', authUser, updateUserProfile)
userRouter.put('/change-password', authUser, changePassword)
userRouter.post('/upload-avatar', authUser, upload.fields([{ name: 'avatar', maxCount: 1 }]), uploadAvatar)

// Password reset (public)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

export default userRouter;

