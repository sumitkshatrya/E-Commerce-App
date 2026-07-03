import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import optionalAuth from '../middleware/optionalAuth.js'
import {
  chatSupport,
  createSupportTicket,
  getSupportDashboard,
  getSupportTickets,
  submitSupportFeedback,
  updateSupportTicket,
} from '../controllers/supportController.js'

const supportRouter = express.Router()

supportRouter.post('/chat', optionalAuth, chatSupport)
supportRouter.post('/ticket', optionalAuth, createSupportTicket)
supportRouter.post('/feedback', optionalAuth, submitSupportFeedback)

supportRouter.post('/admin/dashboard', adminAuth, getSupportDashboard)
supportRouter.post('/admin/tickets', adminAuth, getSupportTickets)
supportRouter.post('/admin/ticket/update', adminAuth, updateSupportTicket)

export default supportRouter
