import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    // Existing fields (keep for backward compatibility)
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {},
    },

    // Profile fields
    fullName: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'suspended', 'deleted'],
    },

    memberSince: {
      type: Date,
      default: () => new Date(),
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },

    // Security/audit fields
    passwordLastChangedAt: {
      type: Date,
      default: null,
    },

    loginHistory: {
      type: [
        {
          at: { type: Date, required: true },
          ip: { type: String, default: '' },
          userAgent: { type: String, default: '' },
          device: { type: String, default: '' },
          success: { type: Boolean, default: true },
        },
      ],
      default: [],
    },

    activeDevices: {
      type: [
        {
          deviceId: { type: String, required: true },
          lastSeenAt: { type: Date, required: true },
          userAgent: { type: String, default: '' },
          ip: { type: String, default: '' },
        },
      ],
      default: [],
    },

    // Password reset flow
    resetPasswordTokenHash: {
      type: String,
      default: '',
    },
    resetPasswordExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { minimize: false }
)

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel

