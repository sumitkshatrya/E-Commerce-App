import { toast } from 'react-toastify'
import profilePlaceholder from '../assets/profile_icon.png'
import { useState } from 'react'
import axios from 'axios'
import { useMemo } from 'react'

const allowed = ['image/jpeg', 'image/png', 'image/webp']
const maxBytes = 3 * 1024 * 1024

const compressToWebp = async (file) => {
  const img = document.createElement('img')
  const url = URL.createObjectURL(file)

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })

  URL.revokeObjectURL(url)

  const scale = Math.min(1, 512 / Math.max(img.width, img.height))
  const targetW = Math.max(1, Math.round(img.width * scale))
  const targetH = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, targetW, targetH)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
  return new File([blob], 'avatar.webp', { type: 'image/webp' })
}

const ProfileAvatarUpload = ({ token, backendUrl, currentAvatarUrl, onUploaded, onRemoved }) => {
  const [previewUrl, setPreviewUrl] = useState(currentAvatarUrl || '')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const hasAvatar = useMemo(() => Boolean(currentAvatarUrl))

  const validateFile = (file) => {
    if (!file) return 'No file selected'
    if (!allowed.includes(file.type)) return 'Invalid image type. Allowed: JPG, JPEG, PNG, WEBP'
    if (file.size > maxBytes) return 'Image too large. Max 3MB'
    return null
  }

  const onPick = (e) => {
    const file = e.target.files?.[0]
    const err = validateFile(file)
    if (err) {
      toast.error(err)
      e.target.value = ''
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const uploadAvatarFile = async (file) => {
    const err = validateFile(file)
    if (err) throw new Error(err)

    const compressed = await compressToWebp(file)
    const fd = new FormData()
    fd.append('avatar', compressed)

    const res = await axios.post(backendUrl + '/api/user/upload-avatar', fd, {
      headers: { token, 'Content-Type': 'multipart/form-data' },
    })

    if (!res.data?.success) {
      throw new Error(res.data?.message || 'Upload failed')
    }

    return res.data.user
  }

  const onUpload = async () => {
    if (!token) {
      toast.error('Login required')
      return
    }
    if (!selectedFile) {
      toast.error('Select an image first')
      return
    }

    try {
      setUploading(true)
      const user = await uploadAvatarFile(selectedFile)
      onUploaded?.(user)
      setSelectedFile(null)
      setPreviewUrl(user?.avatarUrl || '')
      toast.success('Profile photo updated')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  const onResetToPlaceholder = async () => {
    if (!token) {
      toast.error('Login required')
      return
    }

    try {
      setUploading(true)
      const resp = await fetch(profilePlaceholder)
      const blob = await resp.blob()
      const file = new File([blob], 'avatar.png', { type: blob.type || 'image/png' })

      const user = await uploadAvatarFile(file)
      onRemoved?.()
      onUploaded?.(user)
      setSelectedFile(null)
      setPreviewUrl(user?.avatarUrl || '')
      toast.success('Profile photo removed')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl border border-premium overflow-hidden bg-bg-muted/40">
          <img src={previewUrl || profilePlaceholder} alt="Avatar preview" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-premium-muted">Accepted: JPG, JPEG, PNG, WEBP (max 3MB)</div>
          <div className="text-xs text-premium-muted mt-1">Preview updates instantly before upload.</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-premium-muted uppercase tracking-wide" htmlFor="avatar">
          Upload / Replace
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onPick}
          className="w-full"
          aria-label="Upload avatar"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onUpload}
          disabled={!selectedFile || uploading}
          className="flex-1 bg-black dark:bg-white text-white dark:text-black font-semibold tracking-wider text-sm py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 uppercase cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
          aria-label="Upload avatar"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        <button
          type="button"
          onClick={onResetToPlaceholder}
          disabled={uploading || !hasAvatar}
          className="flex-1 bg-premium-card text-gray-700 dark:text-gray-200 font-semibold border border-premium tracking-wider text-sm py-3 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 uppercase cursor-pointer disabled:opacity-60 disabled:hover:scale-100"
          aria-label="Remove avatar"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default ProfileAvatarUpload

