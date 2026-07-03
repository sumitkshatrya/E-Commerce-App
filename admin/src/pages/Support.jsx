import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../constants/adminConstants'


const statusOptions = ['open', 'pending', 'resolved', 'closed']
const priorityOptions = ['low', 'medium', 'high', 'urgent']

const Support = ({ token }) => {
  const [tickets, setTickets] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState('')
  const [replyMessage, setReplyMessage] = useState('')

  const loadTickets = async () => {
    if (!token) {
      return
    }

    try {
      const response = await axios.post(`${backendUrl}/api/support/admin/tickets`, {}, { headers: { token } })
      if (response.data.success) {
        setTickets(response.data.tickets)
        if (!selectedTicketId && response.data.tickets[0]) {
          setSelectedTicketId(response.data.tickets[0].ticketId)
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const id = setTimeout(() => {
      loadTickets();
    }, 0);

    return () => clearTimeout(id);
  }, [token]);



  const selectedTicket = tickets.find((ticket) => ticket.ticketId === selectedTicketId) || tickets[0]

  const updateTicket = async (ticketId, payload) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/support/admin/ticket/update`,
        { ticketId, ...payload },
        { headers: { token } }
      )

      if (response.data.success) {
        await loadTickets()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const sendReply = async (event) => {
    event.preventDefault()

    if (!selectedTicket || !replyMessage.trim()) {
      return
    }

    await updateTicket(selectedTicket.ticketId, { message: replyMessage })
    setReplyMessage('')
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Inbox</h1>
          <p className="text-sm text-gray-500 mt-1">Review AI escalations, reply to customers, and close tickets.</p>
        </div>
        <button
          onClick={loadTickets}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-6">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Open Conversations</h2>
          </div>
          <div className="max-h-[75vh] overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No support tickets yet.</div>
            ) : (
              tickets.map((ticket) => (
                <button
                  key={ticket.ticketId}
                  onClick={() => setSelectedTicketId(ticket.ticketId)}
                  className={`w-full text-left p-5 border-b border-gray-100 transition ${
                    selectedTicket?.ticketId === ticket.ticketId ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{ticket.ticketId}</p>
                    <span className="text-[11px] uppercase tracking-[0.2em] opacity-70">{ticket.priority}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{ticket.subject}</p>
                  <p className="mt-1 text-xs opacity-70">{ticket.email}</p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
                    <span>{ticket.issueCategory}</span>
                    <span>•</span>
                    <span>{ticket.status}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm min-h-[75vh]">
          {selectedTicket ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-xs uppercase tracking-[0.2em] text-gray-600">
                      {selectedTicket.ticketId}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{selectedTicket.email}</p>
                  <p className="text-sm text-gray-600 max-w-3xl">{selectedTicket.aiSummary}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                  <select
                    value={selectedTicket.status}
                    onChange={(event) => updateTicket(selectedTicket.ticketId, { status: event.target.value })}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <select
                    value={selectedTicket.priority}
                    onChange={(event) => updateTicket(selectedTicket.ticketId, { priority: event.target.value })}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                  <input
                    value={selectedTicket.assignedTo || ''}
                    onChange={(event) =>
                      setTickets((current) =>
                        current.map((ticket) =>
                          ticket.ticketId === selectedTicket.ticketId ? { ...ticket, assignedTo: event.target.value } : ticket
                        )
                      )
                    }
                    onBlur={(event) => updateTicket(selectedTicket.ticketId, { assignedTo: event.target.value })}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
                    placeholder="Assign owner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0 flex-1">
                <div className="p-6 border-r border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Chat History</h3>
                  <div className="space-y-3 max-h-[48vh] overflow-y-auto pr-2">
                    {selectedTicket.chatHistory.length > 0 ? (
                      selectedTicket.chatHistory.map((entry, index) => (
                        <div
                          key={`${entry.timestamp}-${index}`}
                          className={`rounded-2xl p-4 border ${
                            entry.role === 'assistant' ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">{entry.role}</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No transcript captured.</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Reply</h3>
                    <form onSubmit={sendReply} className="space-y-3">
                      <textarea
                        value={replyMessage}
                        onChange={(event) => setReplyMessage(event.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        placeholder="Write a support response..."
                      />
                      <button
                        type="submit"
                        className="px-5 py-3 rounded-2xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                      >
                        Send Reply
                      </button>
                    </form>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Ticket Metadata</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Category</p>
                        <p>{selectedTicket.issueCategory}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Environment</p>
                        <p>{selectedTicket.browser || 'Unknown'} • {selectedTicket.device || 'Unknown'} • {selectedTicket.operatingSystem || 'Unknown'}</p>
                      </div>
                      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Source Page</p>
                        <p>{selectedTicket.sourcePage || '/'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Admin Notes</h3>
                    <textarea
                      defaultValue={selectedTicket.resolutionNotes || ''}
                      onBlur={(event) => updateTicket(selectedTicket.ticketId, { resolutionNotes: event.target.value })}
                      rows={6}
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                      placeholder="Add resolution notes, next steps, or export-ready details..."
                    />
                  </div>

                  {selectedTicket.attachments?.length > 0 ? (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
                      <div className="space-y-3">
                        {selectedTicket.attachments.map((file) => (
                          <div key={file.name} className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                            <p className="font-medium text-sm text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{file.type || 'file'} • {Math.max(1, Math.round((file.size || 0) / 1024))} KB</p>
                            {file.previewUrl ? (
                              <img src={file.previewUrl} alt={file.name} className="mt-3 w-full h-40 object-cover rounded-xl border border-gray-200" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {selectedTicket.replies?.length > 0 ? (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Replies</h3>
                      <div className="space-y-3">
                        {selectedTicket.replies.map((reply, index) => (
                          <div key={`${reply.timestamp}-${index}`} className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">{reply.authorType}</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-sm text-gray-500">Select a ticket to inspect the full support context.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Support
