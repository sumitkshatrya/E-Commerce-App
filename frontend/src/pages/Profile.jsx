import { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import ProfileAvatarUpload from '../components/ProfileAvatarUpload'

const SkeletonRow = ({ className = '' }) => (
  <div className={`h-4 ${className} shimmer rounded-lg`} />
)

const SkeletonBlock = ({ className = '' }) => (
  <div className={`shimmer rounded-xl ${className}`} />
)

const Profile = () => {
  const { token, backendUrl } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'user',
    avatarUrl: '',
    memberSince: null,
    lastLoginAt: null,
    status: 'active',
    emailVerified: false,
  })

  const [savingProfile, setSavingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ fullName: '', email: '', phone: '' })

  const [savingPassword, setSavingPassword] = useState(false)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pwStrength, setPwStrength] = useState(0)

  const canSubmitProfile = useMemo(() => {
    return profileForm.fullName.trim().length >= 2 && profileForm.email.trim().length > 3
  }, [profileForm])

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        if (!token) return

        const res = await axios.get(backendUrl + '/api/user/profile', { headers: { token } })
        if (res.data?.success) {
          const u = res.data.user
          setProfile(u)
          setProfileForm({
            fullName: u.fullName || u.name || '',
            email: u.email || '',
            phone: u.phone || '',
          })
        } else {
          toast.error(res.data?.message || 'Failed to load profile')
        }
      } catch (e) {
        toast.error(e?.response?.data?.message || e.message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [token, backendUrl])

  useEffect(() => {
    const p = pwForm.newPassword
    let s = 0
    if (p.length >= 8) s += 1
    if (p.length >= 12) s += 1
    if (/[A-Z]/.test(p)) s += 1
    if (/[0-9]/.test(p)) s += 1
    if (/[^A-Za-z0-9]/.test(p)) s += 1
    setPwStrength(Math.min(5, s))
  }, [pwForm.newPassword])

  const onSaveProfile = async (e) => {
    e.preventDefault()
    if (!token) return
    if (!canSubmitProfile) {
      toast.error('Please enter a valid full name and email')
      return
    }

    try {
      setSavingProfile(true)
      const res = await axios.put(backendUrl + '/api/user/profile', profileForm, { headers: { token } })
      if (res.data?.success) {
        setProfile(res.data.user)
        setProfileForm({
          fullName: res.data.user.fullName || '',
          email: res.data.user.email || '',
          phone: res.data.user.phone || '',
        })
        toast.success('Profile updated')
      } else {
        toast.error(res.data?.message || 'Failed to update profile')
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (e) => {
    e.preventDefault()
    if (!token) return

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New password and confirmation do not match')
      return
    }
    if (pwForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }

    try {
      setSavingPassword(true)
      const res = await axios.put(
        backendUrl + '/api/user/change-password',
        {
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
          confirmPassword: pwForm.confirmPassword,
        },
        { headers: { token } }
      )

      if (res.data?.success) {
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        toast.success('Password changed successfully')
      } else {
        toast.error(res.data?.message || 'Failed to change password')
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message)
    } finally {
      setSavingPassword(false)
    }
  }

  const formatDate = (d) => {
    try {
      if (!d) return ''
      return new Date(d).toLocaleString()
    } catch {
      return ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <SkeletonBlock className="h-60" />
              <div className="mt-4 space-y-3">
                <SkeletonRow />
                <SkeletonRow className="w-3/4" />
                <SkeletonRow className="w-1/2" />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <SkeletonBlock className="h-72" />
              <SkeletonBlock className="h-72" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] py-10 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-premium-card border-premium rounded-2xl p-6 shadow-premium">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border border-premium overflow-hidden bg-bg-card">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-premium-muted text-sm">—</div>
                )}
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-semibold">{profile.fullName || '—'}</div>
                <div className="text-sm text-premium-muted">{profile.email || '—'}</div>
                {profile.phone ? <div className="text-sm text-premium-muted">{profile.phone}</div> : null}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <div className="p-3 rounded-xl bg-bg-muted/40 border border-premium">
                <div className="text-xs text-premium-muted">Role</div>
                <div className="text-sm font-medium">{profile.role}</div>
              </div>
              <div className="p-3 rounded-xl bg-bg-muted/40 border border-premium">
                <div className="text-xs text-premium-muted">Member Since</div>
                <div className="text-sm font-medium">{formatDate(profile.memberSince)}</div>
              </div>
              <div className="p-3 rounded-xl bg-bg-muted/40 border border-premium col-span-2 sm:col-span-1">
                <div className="text-xs text-premium-muted">Status</div>
                <div className="text-sm font-medium">{profile.status}</div>
              </div>
              <div className="p-3 rounded-xl bg-bg-muted/40 border border-premium col-span-2 sm:col-span-1">
                <div className="text-xs text-premium-muted">Last Login</div>
                <div className="text-sm font-medium">{formatDate(profile.lastLoginAt)}</div>
              </div>
              <div className="p-3 rounded-xl bg-bg-muted/40 border border-premium col-span-2">
                <div className="text-xs text-premium-muted">Email Verification</div>
                <div className="text-sm font-medium">{profile.emailVerified ? 'Verified' : 'Not verified'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-premium-card border-premium rounded-2xl p-6 shadow-premium">
              <div className="font-semibold text-lg mb-4">Profile Photo</div>
              <ProfileAvatarUpload
                token={token}
                backendUrl={backendUrl}
                currentAvatarUrl={profile.avatarUrl}
                onUploaded={(u) => setProfile((p) => ({ ...p, avatarUrl: u.avatarUrl }))}
                onRemoved={() => setProfile((p) => ({ ...p, avatarUrl: '' }))}
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-premium-card border-premium rounded-2xl p-6 shadow-premium">
              <div className="font-semibold text-lg">Edit Profile</div>
              <form onSubmit={onSaveProfile} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-premium-muted uppercase tracking-wide" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-premium-muted uppercase tracking-wide" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-premium-muted uppercase tracking-wide" htmlFor="phone">
                    Phone Number (optional)
                  </label>
                  <input
                    id="phone"
                    className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+1 555 0100"
                    inputMode="tel"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 uppercase cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className="bg-premium-card border-premium rounded-2xl p-6 shadow-premium">
              <div className="font-semibold text-lg">Change Password</div>
              <div className="text-sm text-premium-muted">Strength indicator included.</div>

              <form onSubmit={onChangePassword} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-premium-muted uppercase tracking-wide" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    type={showCurrent ? 'text' : 'password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="text-xs underline underline-offset-4 hover:text-black dark:hover:text-white"
                    aria-label="Toggle current password visibility"
                  >
                    {showCurrent ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-premium-muted uppercase tracking-wide" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
                    type={showNew ? 'text' : 'password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="text-xs underline underline-offset-4 hover:text-black dark:hover:text-white"
                    aria-label="Toggle new password visibility"
                  >
                    {showNew ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="mt-2">
                  <div className="text-xs text-premium-muted mb-1">Strength</div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i <= pwStrength ? 'bg-black dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-premium-muted uppercase tracking-wide" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    className="w-full px-4 py-3 rounded-xl border border-premium bg-transparent text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    type={showConfirm ? 'text' : 'password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="text-xs underline underline-offset-4 hover:text-black dark:hover:text-white"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 uppercase cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>

                <div className="text-xs text-premium-muted">
                  Need to reset instead?{' '}
                  <a className="underline underline-offset-4 hover:text-black dark:hover:text-white" href="/forgot-password">
                    Forgot password
                  </a>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-premium-card border-premium rounded-2xl p-6 shadow-premium">
                <div className="font-semibold text-lg">Account Settings</div>
                <div className="mt-3 space-y-3">
                  <div className="text-sm text-premium-muted">Theme Preference</div>
                  <div className="text-sm">Uses your existing app theme toggle.</div>
                </div>
              </div>
              <div className="bg-premium-card border-premium rounded-2xl p-6 shadow-premium">
                <div className="font-semibold text-lg">Security Settings</div>
                <div className="mt-3 space-y-3">
                  <div className="text-sm text-premium-muted">Login history / devices</div>
                  <div className="text-sm">Not yet fully wired in UI; core profile + password flows are implemented.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

