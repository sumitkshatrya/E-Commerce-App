import mongoose from 'mongoose'
import orderModel from '../models/orderModel.js'
import productModel from '../models/productModel.js'
import supportConversationModel from '../models/supportConversationModel.js'
import supportFeedbackModel from '../models/supportFeedbackModel.js'
import supportTicketModel from '../models/supportTicketModel.js'
import userModel from '../models/userModel.js'
import { searchKnowledge } from '../data/supportKnowledge.js'

const MAX_MESSAGE_LENGTH = 1500

const localizedText = {
  en: {
    fallback: `I can help with orders, payments, account access, cart issues, returns, and support tickets.

Tell me what happened in one sentence and, if this is about an order, include your order ID.`,
    askOrderId: 'Please share your order ID so I can check the latest order status securely.',
    loginNeededForOrder:
      'Please sign in to your account before I look up a specific order. That keeps order details private.',
    orderNotFound:
      'I could not find an order with that ID for your account. Please double-check the order ID from your Orders page.',
    askPaymentMethod:
      'Which payment method caused the issue: UPI, Card, Wallet, COD, Razorpay, Stripe, or Net Banking?',
    ticketPrompt:
      'If this still is not resolved, I can create a support ticket with this conversation. Reply with "create ticket" or tap the ticket button.',
    ticketCreated: 'Your support ticket has been created successfully.',
  },
  hi: {
    fallback: `मैं orders, payments, login, cart, returns और support tickets में मदद कर सकता हूँ।

अपनी समस्या एक वाक्य में बताइए। अगर issue order से जुड़ा है, तो order ID भी भेजें।`,
    askOrderId: 'कृपया अपना order ID साझा करें ताकि मैं order status सुरक्षित तरीके से देख सकूँ।',
    loginNeededForOrder:
      'किसी specific order की जानकारी देखने के लिए पहले sign in करें। इससे order details सुरक्षित रहती हैं।',
    orderNotFound:
      'आपके account के लिए इस ID का order नहीं मिला। Orders page से order ID फिर से check करें।',
    askPaymentMethod:
      'कौन सा payment method fail हुआ था: UPI, Card, Wallet, COD, Razorpay, Stripe, या Net Banking?',
    ticketPrompt:
      'अगर issue अभी भी resolve नहीं हुई है, तो मैं इस conversation से support ticket बना सकता हूँ।',
    ticketCreated: 'आपका support ticket सफलतापूर्वक बन गया है।',
  },
}

const detectLocale = (locale = 'en') => (locale === 'hi' ? 'hi' : 'en')

const normalizeText = (value = '') => value.toLowerCase()

const detectIntent = (message = '') => {
  const text = normalizeText(message)

  if (/(order|track|tracking|shipment|delivery|where is my order|parcel)/.test(text)) {
    return 'order'
  }

  if (/(payment|upi|card|wallet|razorpay|stripe|cod|refund|debited)/.test(text)) {
    return 'payment'
  }

  if (/(login|signup|sign up|sign in|password|otp|verification|account locked)/.test(text)) {
    return 'account'
  }

  if (/(cart|checkout|coupon|address|wishlist)/.test(text)) {
    return 'shopping'
  }

  if (/(cancel|return|refund|exchange)/.test(text)) {
    return 'returns'
  }

  return 'general'
}

const extractOrderId = (message = '') => {
  const match = message.match(/\b[a-f0-9]{24}\b/i)
  return match ? match[0] : ''
}

const detectPaymentMethod = (message = '') => {
  const text = normalizeText(message)
  const methods = ['upi', 'card', 'wallet', 'cod', 'razorpay', 'stripe', 'net banking']
  return methods.find((method) => text.includes(method)) || ''
}

const sanitizeAttachments = (attachments = []) =>
  attachments
    .filter((file) => file && typeof file.name === 'string')
    .slice(0, 4)
    .map((file) => ({
      name: file.name.slice(0, 120),
      type: `${file.type || ''}`.slice(0, 80),
      size: Number(file.size || 0),
      previewUrl: `${file.previewUrl || ''}`.slice(0, 4000),
    }))

const buildOrderSnapshot = (order) => {
  const createdAt = new Date(order.date)
  const estimatedDelivery = new Date(order.date + 5 * 24 * 60 * 60 * 1000)
  let currentLocation = 'Warehouse'
  let courier = 'Standard courier'
  let trackingNumber = `ZT-${order._id.toString().slice(-8).toUpperCase()}`

  switch ((order.status || '').toLowerCase()) {
    case 'packing':
      currentLocation = 'Packing facility'
      break
    case 'shipped':
      currentLocation = 'In transit'
      courier = order.paymentMethod === 'COD' ? 'COD logistics partner' : 'Express courier'
      break
    case 'out for delivery':
      currentLocation = 'Local delivery hub'
      courier = 'Last-mile delivery partner'
      break
    case 'delivered':
      currentLocation = 'Delivered to destination'
      break
    default:
      currentLocation = 'Order processing queue'
  }

  return {
    orderId: order._id,
    status: order.status,
    courier,
    trackingNumber,
    estimatedDelivery: estimatedDelivery.toDateString(),
    currentLocation,
    orderDate: createdAt.toDateString(),
  }
}

const buildRecommendations = async (message = '') => {
  const text = normalizeText(message)
  const filter = text.includes('shirt')
    ? { subCategory: /men/.test(text) ? 'Topwear' : 'Topwear' }
    : text.includes('shoe')
      ? { category: 'Footwear' }
      : {}

  const products = await productModel
    .find(filter)
    .sort({ bestSeller: -1, date: -1 })
    .limit(3)
    .select('name price image category subCategory')

  return products.map((product) => ({
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.image?.[0] || '',
    category: product.category,
    subCategory: product.subCategory,
  }))
}

const shouldOfferTicket = (message = '', history = []) => {
  const text = normalizeText(message)
  return (
    history.length >= 6 ||
    /(angry|frustrated|not solved|unresolved|complaint|ticket|agent|human|refund now)/.test(text)
  )
}

const buildCategoryFromIntent = (intent = 'general') => {
  const map = {
    account: 'Account',
    payment: 'Payments',
    order: 'Orders',
    shopping: 'Shopping',
    returns: 'Returns',
    general: 'General',
  }

  return map[intent] || 'General'
}

const formatTicketId = async () => {
  const year = new Date().getFullYear()
  const count = await supportTicketModel.countDocuments()
  return `SUP-${year}-${String(count + 1).padStart(6, '0')}`
}

const saveConversation = async ({
  conversationId,
  locale,
  userId,
  email,
  lastIntent,
  userMessage,
  assistantMessage,
  escalationOffered,
}) => {
  const now = Date.now()
  const messageEntries = [
    { role: 'user', content: userMessage, timestamp: now },
    { role: 'assistant', content: assistantMessage, timestamp: now + 1 },
  ]

  if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
    const updated = await supportConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $set: { updatedAt: now, lastIntent, escalationOffered, locale },
        $push: { messages: { $each: messageEntries } },
      },
      { new: true }
    )

    if (updated) {
      return updated
    }
  }

  const created = await supportConversationModel.create({
    userId: userId || '',
    email: email || '',
    locale,
    lastIntent,
    escalationOffered,
    messages: messageEntries,
    createdAt: now,
    updatedAt: now,
  })

  return created
}

const chatSupport = async (req, res) => {
  try {
    const locale = detectLocale(req.body.locale)
    const copy = localizedText[locale]
    const message = `${req.body.message || ''}`.trim().slice(0, MAX_MESSAGE_LENGTH)
    const email = `${req.body.email || ''}`.trim().slice(0, 120)
    const history = Array.isArray(req.body.history) ? req.body.history.slice(-12) : []
    const intent = detectIntent(message)
    const knowledge = searchKnowledge(message, locale)
    const attachments = sanitizeAttachments(req.body.attachments)

    if (!message) {
      return res.json({ success: false, message: 'A message is required.' })
    }

    let answer = copy.fallback
    let orderSnapshot = null
    let recommendations = []
    let suggestions = knowledge[0]?.suggestions?.[locale] || knowledge[0]?.suggestions?.en || []

    if (intent === 'order') {
      const orderId = extractOrderId(message)

      if (!req.userId) {
        answer = copy.loginNeededForOrder
      } else if (!orderId) {
        answer = copy.askOrderId
      } else {
        const order = await orderModel.findOne({ _id: orderId, userId: req.userId })

        if (!order) {
          answer = copy.orderNotFound
        } else {
          orderSnapshot = buildOrderSnapshot(order)
          answer =
            locale === 'hi'
              ? `मुझे आपका order मिल गया।

- Status: ${orderSnapshot.status}
- Courier: ${orderSnapshot.courier}
- Tracking Number: ${orderSnapshot.trackingNumber}
- Estimated Delivery: ${orderSnapshot.estimatedDelivery}
- Current Location: ${orderSnapshot.currentLocation}

Order date: ${orderSnapshot.orderDate}`
              : `I found your order.

- Status: ${orderSnapshot.status}
- Courier: ${orderSnapshot.courier}
- Tracking Number: ${orderSnapshot.trackingNumber}
- Estimated Delivery: ${orderSnapshot.estimatedDelivery}
- Current Location: ${orderSnapshot.currentLocation}

Order date: ${orderSnapshot.orderDate}`
        }
      }
    } else if (intent === 'payment') {
      const method = detectPaymentMethod(message)

      if (!method) {
        answer = copy.askPaymentMethod
      } else {
        const paymentArticle = knowledge[0]
        answer = `${paymentArticle?.content?.[locale] || paymentArticle?.content?.en || copy.fallback}

Detected payment method: ${method.toUpperCase()}`
      }
    } else if (knowledge.length > 0) {
      answer = knowledge
        .map((article) => `**${article.title[locale] || article.title.en}**\n\n${article.content[locale] || article.content.en}`)
        .join('\n\n')
    }

    if (/(recommend|suggest|best seller|trending|gift)/i.test(message)) {
      recommendations = await buildRecommendations(message)
      if (recommendations.length > 0) {
        answer += `\n\n${locale === 'hi' ? 'यहाँ कुछ suggested products हैं:' : 'Here are a few suggested products:'}`
      }
    }

    const offerTicket = shouldOfferTicket(message, history)

    if (offerTicket) {
      answer += `\n\n${copy.ticketPrompt}`
    }

    const conversation = await saveConversation({
      conversationId: req.body.conversationId,
      locale,
      userId: req.userId || '',
      email,
      lastIntent: intent,
      userMessage: message,
      assistantMessage: answer,
      escalationOffered: offerTicket,
    })

    return res.json({
      success: true,
      conversationId: conversation._id,
      message: answer,
      citations: knowledge.map((article) => ({
        id: article.id,
        title: article.title[locale] || article.title.en,
        category: article.category,
      })),
      suggestions,
      orderSnapshot,
      recommendations,
      shouldOfferTicket: offerTicket,
      ticketPrefill: {
        email,
        issueCategory: buildCategoryFromIntent(intent),
        priority: offerTicket ? 'high' : 'medium',
        attachments,
      },
    })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const createSupportTicket = async (req, res) => {
  try {
    const email = `${req.body.email || ''}`.trim().slice(0, 120)
    const subject = `${req.body.subject || ''}`.trim().slice(0, 160)
    const issueCategory = `${req.body.issueCategory || 'General'}`.trim().slice(0, 80)
    const priority = ['low', 'medium', 'high', 'urgent'].includes(req.body.priority)
      ? req.body.priority
      : 'medium'

    if (!email || !subject) {
      return res.json({ success: false, message: 'Email and subject are required.' })
    }

    const ticketId = await formatTicketId()
    const chatHistory = Array.isArray(req.body.chatHistory)
      ? req.body.chatHistory
          .slice(-20)
          .map((item) => ({
            role: `${item.role || 'user'}`.slice(0, 20),
            content: `${item.content || ''}`.slice(0, 2000),
            timestamp: Number(item.timestamp || Date.now()),
          }))
      : []
    const attachments = sanitizeAttachments(req.body.attachments)
    const now = Date.now()

    const aiSummary = `${issueCategory} issue raised from ${req.body.sourcePage || 'support assistant'} with ${chatHistory.length} transcript messages.`

    const ticket = await supportTicketModel.create({
      ticketId,
      userId: req.userId || '',
      email,
      subject,
      issueCategory,
      priority,
      locale: detectLocale(req.body.locale),
      browser: `${req.body.browser || ''}`.slice(0, 120),
      device: `${req.body.device || ''}`.slice(0, 120),
      operatingSystem: `${req.body.operatingSystem || ''}`.slice(0, 120),
      sourcePage: `${req.body.sourcePage || ''}`.slice(0, 240),
      attachments,
      chatHistory,
      aiSummary,
      createdAt: now,
      updatedAt: now,
    })

    return res.json({ success: true, ticket })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const submitSupportFeedback = async (req, res) => {
  try {
    const rating = Number(req.body.rating)

    if (!rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'A rating between 1 and 5 is required.' })
    }

    await supportFeedbackModel.create({
      conversationId: `${req.body.conversationId || ''}`,
      userId: req.userId || '',
      rating,
      feedback: `${req.body.feedback || ''}`.slice(0, 1200),
      suggestions: `${req.body.suggestions || ''}`.slice(0, 1200),
      createdAt: Date.now(),
    })

    return res.json({ success: true, message: 'Feedback saved.' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const getSupportDashboard = async (req, res) => {
  try {
    const [tickets, conversations, feedback, users] = await Promise.all([
      supportTicketModel.find({}).sort({ updatedAt: -1 }),
      supportConversationModel.find({}).sort({ updatedAt: -1 }).limit(100),
      supportFeedbackModel.find({}).sort({ createdAt: -1 }),
      userModel.countDocuments(),
    ])

    const openTickets = tickets.filter((ticket) => ticket.status === 'open').length
    const pendingTickets = tickets.filter((ticket) => ticket.status === 'pending').length
    const resolvedTickets = tickets.filter((ticket) => ticket.status === 'resolved').length
    const avgRating =
      feedback.length > 0
        ? (
            feedback.reduce((total, item) => total + Number(item.rating || 0), 0) / feedback.length
          ).toFixed(1)
        : '0.0'
    const avgResolutionTimeHours =
      tickets.filter((ticket) => ticket.status === 'resolved').length > 0
        ? (
            tickets
              .filter((ticket) => ticket.status === 'resolved')
              .reduce((total, ticket) => total + (ticket.updatedAt - ticket.createdAt), 0) /
            Math.max(tickets.filter((ticket) => ticket.status === 'resolved').length, 1) /
            (1000 * 60 * 60)
          ).toFixed(1)
        : '0.0'

    const issueCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.issueCategory] = (acc[ticket.issueCategory] || 0) + 1
      return acc
    }, {})

    const conversationIntentCounts = conversations.reduce((acc, item) => {
      acc[item.lastIntent || 'general'] = (acc[item.lastIntent || 'general'] || 0) + 1
      return acc
    }, {})

    return res.json({
      success: true,
      summary: {
        openTickets,
        pendingTickets,
        resolvedTickets,
        totalConversations: conversations.length,
        customerSatisfaction: avgRating,
        averageResolutionTimeHours: avgResolutionTimeHours,
        userActivity: users,
      },
      topIssues: Object.entries(issueCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      topConversationIntents: Object.entries(conversationIntentCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      tickets,
      conversations,
      feedback,
    })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const updateSupportTicket = async (req, res) => {
  try {
    const { ticketId, status, priority, assignedTo, message, resolutionNotes } = req.body
    const ticket = await supportTicketModel.findOne({ ticketId })

    if (!ticket) {
      return res.json({ success: false, message: 'Ticket not found.' })
    }

    if (status) {
      ticket.status = status
    }

    if (priority) {
      ticket.priority = priority
    }

    if (assignedTo !== undefined) {
      ticket.assignedTo = `${assignedTo}`.slice(0, 120)
    }

    if (resolutionNotes !== undefined) {
      ticket.resolutionNotes = `${resolutionNotes}`.slice(0, 1200)
    }

    if (message) {
      ticket.replies.push({
        authorType: 'admin',
        message: `${message}`.slice(0, 2000),
        timestamp: Date.now(),
      })
    }

    ticket.updatedAt = Date.now()
    await ticket.save()

    return res.json({ success: true, ticket })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const getSupportTickets = async (req, res) => {
  try {
    const tickets = await supportTicketModel.find({}).sort({ updatedAt: -1 })
    return res.json({ success: true, tickets })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

export {
  chatSupport,
  createSupportTicket,
  getSupportDashboard,
  getSupportTickets,
  submitSupportFeedback,
  updateSupportTicket,
}
