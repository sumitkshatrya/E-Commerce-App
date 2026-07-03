import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const localeCopy = {
  en: {
    title: 'AI Support',
    subtitle: 'Orders, payments, returns, and account help',
    welcome:
      'Hi, I am your AI support assistant. Ask me about orders, checkout, payment failures, login issues, or refunds.',
    inputPlaceholder: 'Describe your issue...',
    send: 'Send',
    createTicket: 'Create ticket',
    ticketTitle: 'Need human help?',
    ticketDescription:
      'Create a support ticket and include this conversation so the team can continue from here.',
    email: 'Email',
    subject: 'Subject',
    category: 'Category',
    priority: 'Priority',
    submitTicket: 'Submit Ticket',
    feedbackQuestion: 'Did this solve your problem?',
    feedbackSaved: 'Thanks for the feedback.',
    askScreenshot: 'Add a screenshot or file',
    language: 'Language',
    attachmentHint: 'PNG, JPG, PDF, or text files up to 3 MB',
    open: 'Support',
    minimize: 'Minimize',
  },
  hi: {
    title: 'AI सहायता',
    subtitle: 'Orders, payments, returns और account help',
    welcome:
      'नमस्ते, मैं आपका AI support assistant हूँ। Orders, checkout, payment failures, login issues या refunds के बारे में पूछिए।',
    inputPlaceholder: 'अपनी समस्या लिखें...',
    send: 'भेजें',
    createTicket: 'टिकट बनाएं',
    ticketTitle: 'क्या इंसानी सहायता चाहिए?',
    ticketDescription:
      'एक support ticket बनाइए ताकि हमारी टीम इसी conversation से आगे मदद कर सके।',
    email: 'ईमेल',
    subject: 'विषय',
    category: 'श्रेणी',
    priority: 'प्राथमिकता',
    submitTicket: 'टिकट भेजें',
    feedbackQuestion: 'क्या इससे आपकी समस्या हल हुई?',
    feedbackSaved: 'Feedback के लिए धन्यवाद।',
    askScreenshot: 'Screenshot या file जोड़ें',
    language: 'भाषा',
    attachmentHint: 'PNG, JPG, PDF, या text files, अधिकतम 3 MB',
    open: 'सहायता',
    minimize: 'छोटा करें',
  },
}

const suggestedPrompts = {
  en: [
    'Where is my order?',
    'My payment failed',
    'I forgot my password',
    'Suggest best sellers for me',
  ],
  hi: ['मेरा ऑर्डर कहाँ है?', 'मेरी payment fail हो गई', 'मैं पासवर्ड भूल गया हूँ', 'Best sellers बताओ'],
}

const issueCategories = ['Orders', 'Payments', 'Account', 'Shopping', 'Returns', 'General']
const priorities = ['low', 'medium', 'high', 'urgent']

const collectTicketAttachments = (messages = [], currentAttachments = []) => {
  const seen = new Set()
  const combined = [...currentAttachments]

  messages.forEach((message) => {
    if (Array.isArray(message.attachments)) {
      combined.push(...message.attachments)
    }
  })

  return combined.filter((file) => {
    const key = `${file.name}-${file.size}-${file.type}`
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

const buildClientInfo = () => {
  const agent = navigator.userAgent || ''
  const operatingSystem = /windows/i.test(agent)
    ? 'Windows'
    : /mac/i.test(agent)
      ? 'macOS'
      : /android/i.test(agent)
        ? 'Android'
        : /iphone|ipad/i.test(agent)
          ? 'iOS'
          : 'Unknown'

  const browser = /chrome/i.test(agent)
    ? 'Chrome'
    : /safari/i.test(agent)
      ? 'Safari'
      : /firefox/i.test(agent)
        ? 'Firefox'
        : 'Unknown'

  const device = /mobile/i.test(agent) ? 'Mobile' : 'Desktop'

  return { browser, device, operatingSystem }
}

const formatMessageSegments = (content = '') => {
  const segments = []
  const parts = content.split('```')

  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      segments.push({ type: 'code', value: part.trim() })
      return
    }

    part
      .split('\n\n')
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .forEach((chunk) => {
        if (chunk.startsWith('- ')) {
          segments.push({ type: 'list', value: chunk.split('\n').map((line) => line.replace(/^- /, '').trim()) })
        } else {
          segments.push({ type: 'text', value: chunk })
        }
      })
  })

  return segments
}

const MessageBubble = ({ message }) => {
  const segments = useMemo(() => formatMessageSegments(message.content), [message.content])

  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role !== 'user' && (
        <div className="w-9 h-9 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-sm font-semibold shrink-0 shadow-lg">
          AI
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-[22px] px-4 py-3 shadow-sm border ${
          message.role === 'user'
            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
            : 'bg-white/90 dark:bg-[#111827]/90 text-gray-800 dark:text-gray-100 border-white/70 dark:border-white/10'
        }`}
      >
        <div className="space-y-3 text-sm leading-6">
          {segments.map((segment, index) => {
            if (segment.type === 'code') {
              return (
                <pre
                  key={index}
                  className="bg-gray-950 text-gray-100 rounded-2xl p-3 overflow-x-auto text-xs leading-5 border border-white/10"
                >
                  <code>{segment.value}</code>
                </pre>
              )
            }

            if (segment.type === 'list') {
              return (
                <ul key={index} className="space-y-1">
                  {segment.value.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )
            }

            return <p key={index}>{segment.value.replace(/\*\*/g, '')}</p>
          })}
        </div>

        {message.attachments?.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {message.attachments.map((file) => (
              <div
                key={file.name}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-2 text-xs"
              >
                {file.previewUrl && file.type.startsWith('image/') ? (
                  <img src={file.previewUrl} alt={file.name} className="w-full h-20 object-cover rounded-xl mb-2" />
                ) : null}
                <p className="font-medium truncate">{file.name}</p>
                <p className="opacity-70">{Math.max(1, Math.round(file.size / 1024))} KB</p>
              </div>
            ))}
          </div>
        )}

        {message.orderSnapshot ? (
          <div className="mt-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 p-3 text-xs space-y-1">
            <p><span className="font-semibold">Status:</span> {message.orderSnapshot.status}</p>
            <p><span className="font-semibold">Courier:</span> {message.orderSnapshot.courier}</p>
            <p><span className="font-semibold">Tracking:</span> {message.orderSnapshot.trackingNumber}</p>
            <p><span className="font-semibold">ETA:</span> {message.orderSnapshot.estimatedDelivery}</p>
            <p><span className="font-semibold">Location:</span> {message.orderSnapshot.currentLocation}</p>
          </div>
        ) : null}

        {message.recommendations?.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {message.recommendations.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-2 hover:border-black/20 dark:hover:border-white/20 transition"
              >
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs opacity-70">{product.category} • ${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {message.citations?.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.citations.map((citation) => (
              <span
                key={citation.id}
                className="px-2.5 py-1 rounded-full border border-black/10 dark:border-white/10 text-[11px] uppercase tracking-[0.18em] opacity-75"
              >
                {citation.category}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {message.role === 'user' && (
        <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-sm font-semibold shrink-0 shadow-lg">
          U
        </div>
      )}
    </div>
  )
}

const SupportAssistant = () => {
  const { backendUrl, token } = useContext(ShopContext)
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [locale, setLocale] = useState(localStorage.getItem('support-locale') === 'hi' ? 'hi' : 'en')
  const [conversationId, setConversationId] = useState(localStorage.getItem('support-conversation-id') || '')
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', content: localeCopy[locale].welcome, timestamp: Date.now() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [ticketPrefill, setTicketPrefill] = useState({ issueCategory: 'General', priority: 'medium' })
  const [ticketForm, setTicketForm] = useState({
    email: '',
    subject: '',
    issueCategory: 'General',
    priority: 'medium',
  })
  const [attachments, setAttachments] = useState([])
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [lastAssistantMessageId, setLastAssistantMessageId] = useState('welcome')
  const listRef = useRef(null)
  const copy = localeCopy[locale]

  useEffect(() => {
    localStorage.setItem('support-locale', locale)
  }, [locale])

  useEffect(() => {
    localStorage.setItem('support-conversation-id', conversationId)
  }, [conversationId])

  useEffect(() => {
    setMessages([{ id: 'welcome', role: 'assistant', content: localeCopy[locale].welcome, timestamp: Date.now() }])
    setConversationId('')
    setFeedbackSent(false)
    setShowTicketForm(false)
    setAttachments([])
  }, [locale])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isTyping, showTicketForm])

  const canCreateTicket = messages.length > 1

  const onAttachFiles = (event) => {
    const files = Array.from(event.target.files || [])
    const valid = []

    files.forEach((file) => {
      const isAllowed =
        file.type.startsWith('image/') ||
        file.type === 'application/pdf' ||
        file.type.startsWith('text/')

      if (!isAllowed || file.size > 3 * 1024 * 1024) {
        toast.error(`${file.name} is not supported.`)
        return
      }

      valid.push({
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      })
    })

    setAttachments((current) => [...current, ...valid].slice(0, 4))
    event.target.value = ''
  }

  const sendMessage = async (messageText) => {
    const trimmed = messageText.trim()

    if (!trimmed) {
      return
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      attachments,
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsTyping(true)

    try {
      const response = await axios.post(
        `${backendUrl}/api/support/chat`,
        {
          conversationId,
          locale,
          message: trimmed,
          history: nextMessages.map((item) => ({
            role: item.role,
            content: item.content,
            timestamp: item.timestamp,
          })),
          attachments,
          pageContext: location.pathname,
        },
        token ? { headers: { token } } : undefined
      )

      if (!response.data.success) {
        toast.error(response.data.message)
        return
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.data.message,
        timestamp: Date.now() + 1,
        citations: response.data.citations || [],
        orderSnapshot: response.data.orderSnapshot || null,
        recommendations: response.data.recommendations || [],
      }

      setMessages((current) => [...current, assistantMessage])
      setLastAssistantMessageId(assistantMessage.id)
      setConversationId(response.data.conversationId || '')
      setTicketPrefill(response.data.ticketPrefill || { issueCategory: 'General', priority: 'medium' })
      setTicketForm((current) => ({
        ...current,
        email: response.data.ticketPrefill?.email || current.email,
        issueCategory: response.data.ticketPrefill?.issueCategory || current.issueCategory,
        priority: response.data.ticketPrefill?.priority || current.priority,
      }))

      if (response.data.shouldOfferTicket) {
        setShowTicketForm(true)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setAttachments([])
      setIsTyping(false)
    }
  }

  const submitFeedback = async (rating) => {
    try {
      const payload = {
        conversationId,
        rating,
        feedback: rating >= 4 ? 'Resolved in assistant.' : 'Needs improvement.',
      }

      await axios.post(`${backendUrl}/api/support/feedback`, payload, token ? { headers: { token } } : undefined)
      setFeedbackSent(true)
      toast.success(copy.feedbackSaved)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const createTicket = async (event) => {
    event.preventDefault()

    try {
      const clientInfo = buildClientInfo()
      const ticketAttachments = collectTicketAttachments(messages, attachments)
      const response = await axios.post(
        `${backendUrl}/api/support/ticket`,
        {
          ...ticketForm,
          locale,
          browser: clientInfo.browser,
          device: clientInfo.device,
          operatingSystem: clientInfo.operatingSystem,
          sourcePage: location.pathname,
          attachments: ticketAttachments,
          chatHistory: messages.map((message) => ({
            role: message.role,
            content: message.content,
            timestamp: message.timestamp,
          })),
        },
        token ? { headers: { token } } : undefined
      )

      if (!response.data.success) {
        toast.error(response.data.message)
        return
      }

      toast.success(`Ticket ${response.data.ticket.ticketId} created`)
      setShowTicketForm(false)
      setAttachments([])
      setMessages((current) => [
        ...current,
        {
          id: `assistant-ticket-${Date.now()}`,
          role: 'assistant',
          content: `Your ticket is ready: ${response.data.ticket.ticketId}\n\nOur team can now continue from this conversation.`,
          timestamp: Date.now(),
        },
      ])
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3">
        {isOpen ? (
          <div className="w-[min(92vw,420px)] h-[min(78vh,720px)] rounded-[30px] overflow-hidden border border-white/25 dark:border-white/10 shadow-[0_24px_80px_rgba(15,23,42,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.98))] dark:bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(15,23,42,0.98))] backdrop-blur-xl">
            <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 bg-black text-white dark:bg-white dark:text-black">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold tracking-wide">{copy.title}</p>
                  <p className="text-xs opacity-80 truncate">{copy.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={locale}
                    onChange={(event) => setLocale(event.target.value)}
                    className="rounded-xl text-xs px-2 py-1 bg-white/15 dark:bg-black/10 border border-white/20 dark:border-black/10 outline-none"
                    aria-label={copy.language}
                  >
                    <option value="en">EN</option>
                    <option value="hi">HI</option>
                  </select>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-xl bg-white/15 dark:bg-black/10"
                    aria-label={copy.minimize}
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            <div ref={listRef} className="h-[calc(100%-215px)] overflow-y-auto px-4 py-4 space-y-4 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(248,250,252,0.75))] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.10),transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.25),rgba(2,6,23,0.8))]">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isTyping ? (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-sm font-semibold shrink-0 shadow-lg">
                    AI
                  </div>
                  <div className="rounded-[22px] px-4 py-3 bg-white/90 dark:bg-[#111827]/90 border border-white/70 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:120ms]" />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              ) : null}

              {messages.length <= 1 ? (
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts[locale].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="px-3 py-2 rounded-full text-xs font-medium border border-black/10 dark:border-white/10 bg-white/90 dark:bg-white/5 hover:border-black/20 dark:hover:border-white/20 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              ) : null}

              {showTicketForm && canCreateTicket ? (
                <form onSubmit={createTicket} className="rounded-[26px] border border-black/8 dark:border-white/10 bg-white/85 dark:bg-[#0f172a]/85 p-4 space-y-3 shadow-sm">
                  <div>
                    <p className="font-semibold">{copy.ticketTitle}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{copy.ticketDescription}</p>
                  </div>
                  <input
                    required
                    type="email"
                    placeholder={copy.email}
                    value={ticketForm.email}
                    onChange={(event) => setTicketForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded-2xl px-4 py-3 border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none"
                  />
                  <input
                    required
                    type="text"
                    placeholder={copy.subject}
                    value={ticketForm.subject}
                    onChange={(event) => setTicketForm((current) => ({ ...current, subject: event.target.value }))}
                    className="w-full rounded-2xl px-4 py-3 border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={ticketForm.issueCategory}
                      onChange={(event) => setTicketForm((current) => ({ ...current, issueCategory: event.target.value }))}
                      className="rounded-2xl px-4 py-3 border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none"
                    >
                      {issueCategories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <select
                      value={ticketForm.priority}
                      onChange={(event) => setTicketForm((current) => ({ ...current, priority: event.target.value }))}
                      className="rounded-2xl px-4 py-3 border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-black text-white dark:bg-white dark:text-black py-3 text-sm font-semibold"
                  >
                    {copy.submitTicket}
                  </button>
                </form>
              ) : null}
            </div>

            <div className="border-t border-black/5 dark:border-white/10 bg-white/85 dark:bg-[#020617]/90 px-4 py-3 space-y-3">
              {attachments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file) => (
                    <span
                      key={file.name}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                    >
                      {file.name}
                      <button
                        onClick={() => setAttachments((current) => current.filter((item) => item.name !== file.name))}
                        type="button"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="flex items-end gap-2">
                <label className="shrink-0 w-11 h-11 rounded-2xl border border-black/10 dark:border-white/10 flex items-center justify-center cursor-pointer bg-black/5 dark:bg-white/5">
                  <input type="file" multiple className="hidden" onChange={onAttachFiles} />
                  +
                </label>
                <textarea
                  rows={1}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      sendMessage(input)
                    }
                  }}
                  placeholder={copy.inputPlaceholder}
                  className="flex-1 rounded-[24px] px-4 py-3 max-h-32 border border-black/10 dark:border-white/10 bg-transparent text-sm outline-none resize-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  type="button"
                  className="shrink-0 px-4 h-11 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-sm font-semibold"
                >
                  {copy.send}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{copy.attachmentHint}</p>
                <div className="flex items-center gap-2">
                  {canCreateTicket ? (
                    <button
                      onClick={() => setShowTicketForm((current) => !current)}
                      type="button"
                      className="text-[11px] px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10"
                    >
                      {copy.createTicket}
                    </button>
                  ) : null}
                  {conversationId && !feedbackSent ? (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">{copy.feedbackQuestion}</span>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => submitFeedback(rating)}
                          type="button"
                          className={`transition ${lastAssistantMessageId ? 'opacity-100' : 'opacity-50'}`}
                          aria-label={`Rate ${rating}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <button
          onClick={() => setIsOpen((current) => !current)}
          className="group flex items-center gap-3 rounded-full bg-black text-white dark:bg-white dark:text-black pl-4 pr-5 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.28)] hover:translate-y-[-2px] transition-all"
          aria-label={copy.open}
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 dark:bg-black/10">
            <span className="absolute inset-0 rounded-full animate-ping bg-white/15 dark:bg-black/10" />
            <span className="relative text-lg">✦</span>
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold">{copy.open}</span>
            <span className="block text-[11px] opacity-75">{copy.subtitle}</span>
          </span>
        </button>
      </div>
    </>
  )
}

export default SupportAssistant
