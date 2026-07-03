import mongoose from 'mongoose'

const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    size: { type: Number, default: 0 },
    previewUrl: { type: String, default: '' },
  },
  { _id: false }
)

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Number, required: true },
  },
  { _id: false }
)

const ticketReplySchema = new mongoose.Schema(
  {
    authorType: { type: String, enum: ['admin', 'assistant', 'user'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Number, required: true },
  },
  { _id: false }
)

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    userId: { type: String, default: '' },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    issueCategory: { type: String, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved', 'closed'],
      default: 'open',
    },
    locale: { type: String, default: 'en' },
    browser: { type: String, default: '' },
    device: { type: String, default: '' },
    operatingSystem: { type: String, default: '' },
    sourcePage: { type: String, default: '' },
    attachments: { type: [attachmentSchema], default: [] },
    chatHistory: { type: [chatMessageSchema], default: [] },
    replies: { type: [ticketReplySchema], default: [] },
    assignedTo: { type: String, default: '' },
    resolutionNotes: { type: String, default: '' },
    aiSummary: { type: String, default: '' },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
  },
  { minimize: false }
)

const supportTicketModel =
  mongoose.models.supportTicket || mongoose.model('supportTicket', supportTicketSchema)

export default supportTicketModel
