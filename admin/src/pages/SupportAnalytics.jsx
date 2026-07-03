import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../constants/adminConstants'


const StatCard = ({ label, value, accent }) => (
  <div className={`rounded-3xl p-5 border shadow-sm ${accent}`}>
    <p className="text-xs uppercase tracking-[0.2em] opacity-70">{label}</p>
    <p className="text-3xl font-bold mt-3">{value}</p>
  </div>
)

const SupportAnalytics = ({ token }) => {
  const [dashboard, setDashboard] = useState(null)

  const loadDashboard = async () => {
    if (!token) {
      return
    }

    try {
      const response = await axios.post(`${backendUrl}/api/support/admin/dashboard`, {}, { headers: { token } })
      if (response.data.success) {
        setDashboard(response.data)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [token])


  if (!dashboard) {
    return <div className="p-6 md:p-10 bg-gray-50 min-h-screen text-gray-500">Loading support analytics...</div>
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen space-y-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">AI conversations, ticket trends, satisfaction, and operational health.</p>
        </div>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Open Tickets" value={dashboard.summary.openTickets} accent="bg-white border-gray-200 text-gray-900" />
        <StatCard label="Pending Tickets" value={dashboard.summary.pendingTickets} accent="bg-amber-50 border-amber-200 text-amber-900" />
        <StatCard label="Resolved Tickets" value={dashboard.summary.resolvedTickets} accent="bg-emerald-50 border-emerald-200 text-emerald-900" />
        <StatCard label="CSAT" value={`${dashboard.summary.customerSatisfaction} / 5`} accent="bg-sky-50 border-sky-200 text-sky-900" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customer Problems</h2>
          <div className="space-y-3">
            {dashboard.topIssues.length > 0 ? (
              dashboard.topIssues.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_auto] gap-4 items-center">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{ width: `${Math.max(12, item.count * 14)}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-600">{item.count}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No ticket data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation Intents</h2>
          <div className="space-y-3">
            {dashboard.topConversationIntents.length > 0 ? (
              dashboard.topConversationIntents.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl bg-gray-50 border border-gray-200 p-4">
                  <p className="font-medium text-gray-800 capitalize">{item.name}</p>
                  <p className="text-sm font-semibold text-gray-500">{item.count}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No conversation data yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Operational Snapshot</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Total AI Conversations</span>
              <strong className="text-gray-900">{dashboard.summary.totalConversations}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Resolution Time</span>
              <strong className="text-gray-900">{dashboard.summary.averageResolutionTimeHours} hrs</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>User Activity</span>
              <strong className="text-gray-900">{dashboard.summary.userActivity}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 xl:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Conversations</h2>
          <div className="space-y-3 max-h-[340px] overflow-y-auto">
            {dashboard.conversations.length > 0 ? (
              dashboard.conversations.map((conversation) => (
                <div key={conversation._id} className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-gray-900 capitalize">{conversation.lastIntent || 'general'}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">{conversation.locale}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {conversation.messages?.[0]?.content || 'No messages captured.'}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">{conversation.messages?.length || 0} messages</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No conversations yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportAnalytics
