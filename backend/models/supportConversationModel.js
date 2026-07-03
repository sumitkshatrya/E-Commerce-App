import mongoose from 'mongoose'

const supportConversationMessageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, required: true },
  },
  { _id: false }
)

const supportConversationSchema = new mongoose.Schema(
  {
    userId: { type: String, default: '' },
    email: { type: String, default: '' },
    locale: { type: String, default: 'en' },
    messages: { type: [supportConversationMessageSchema], default: [] },
    lastIntent: { type: String, default: 'general' },
    resolved: { type: Boolean, default: false },
    escalationOffered: { type: Boolean, default: false },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
  },
  { minimize: false }
)

const supportConversationModel =
  mongoose.models.supportConversation ||
  mongoose.model('supportConversation', supportConversationSchema)

export default supportConversationModel
