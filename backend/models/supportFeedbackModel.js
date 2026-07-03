import mongoose from 'mongoose'

const supportFeedbackSchema = new mongoose.Schema(
  {
    conversationId: { type: String, default: '' },
    userId: { type: String, default: '' },
    rating: { type: Number, required: true },
    feedback: { type: String, default: '' },
    suggestions: { type: String, default: '' },
    createdAt: { type: Number, required: true },
  },
  { minimize: false }
)

const supportFeedbackModel =
  mongoose.models.supportFeedback || mongoose.model('supportFeedback', supportFeedbackSchema)

export default supportFeedbackModel
