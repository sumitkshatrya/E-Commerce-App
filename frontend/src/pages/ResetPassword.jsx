import { useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import { useLocation, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()
  const { search } = useLocation()

  const params = useMemo(() => new URLSearchParams(search), [search])
  const token = params.get('token') || ''
  const email = params.get('email') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const submit = async (e) => {
    e.preventDefault()

    if (!token || !email) {
      toast.error('Invalid or missing reset token')
      return
    }

    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(backendUrl + '/api/user/reset-password', {
        token,
        email,
        newPassword,
        confirmPassword,
      })

      if (res.data?.success) {
        toast.success('Password reset successful')
        navigate('/login')
      } else {
        toast.error(res.data?.message || 'Reset failed')
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
          <h2 className="font-semibold text-2xl">Reset Password</h2>
          <p className="text-sm text-premium-muted">Set a new password. Your reset link may expire.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide" htmlFor="newPassword">
            New Password
          </label>
          <div className="flex items-center gap-2">
            <input
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              type={showNew ? 'text' : 'password'}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="px-3 py-3 rounded-xl border border-premium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm"
              aria-label="Toggle new password visibility"
            >
              {showNew ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="flex items-center gap-2">
            <input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              type={showConfirm ? 'text' : 'password'}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="px-3 py-3 rounded-xl border border-premium hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 uppercase cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
          aria-label="Reset password"
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>

        <div className="text-xs text-premium-muted">
          Want to retry?{' '}
          <button
            type="button"
            className="underline underline-offset-4 hover:text-black dark:hover:text-white"
            onClick={() => navigate('/forgot-password')}
          >
            Request a new link
          </button>
        </div>
      </form>
    </div>
  )
}

export default ResetPassword

