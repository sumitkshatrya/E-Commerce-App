import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(backendUrl + '/api/user/forgot-password', { email })
      if (res.data?.success) {
        toast.success('Check your email for the reset link')
        navigate('/login')
      } else {
        toast.error(res.data?.message || 'Failed to send reset email')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10 text-gray-900 dark:text-gray-100">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-premium-card border-premium rounded-2xl p-8 sm:p-10 shadow-premium animate-fade-in space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="font-semibold text-2xl">Forgot Password</h2>
          <p className="text-sm text-premium-muted">Enter your email and we’ll send a secure reset link.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            type="email"
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 uppercase cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
          aria-label="Send reset email"
        >
          {loading ? 'Sending...' : 'Send Reset Email'}
        </button>

        <div className="text-xs text-premium-muted">
          Remembered it?{' '}
          <button
            type="button"
            className="underline underline-offset-4 hover:text-black dark:hover:text-white"
            onClick={() => navigate('/login')}
          >
            Back to login
          </button>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword

