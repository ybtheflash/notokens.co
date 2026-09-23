export interface FounderProfile {
  id: string
  username: 'justysss' | 'ybtheflash'
  display_name: string
  author_key: 'justysss' | 'ybtheflash'
  avatar_url: string
}

const TOKEN_KEY = 'founder-notes-token'
const PROFILE_KEY = 'founder-notes-profile'

function readProfile(): FounderProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? (JSON.parse(raw) as FounderProfile) : null
  } catch {
    return null
  }
}

function base() {
  return (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/, '')
}

function anonKey() {
  return (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''
}

async function postAdminAuth(body: Record<string, unknown>, token?: string) {
  const authToken = token || anonKey()
  const res = await fetch(`${base()}/functions/v1/admin-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey(),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const adminAuth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getProfile(): FounderProfile | null {
    if (!this.getToken()) {
      this.logout()
      return null
    }
    return readProfile()
  },

  setProfile(profile: FounderProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  },

  async login(password: string): Promise<FounderProfile> {
    const data = await postAdminAuth({ password })
    if (!data.token || !data.profile) throw new Error(data.error || 'Invalid password')
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile))
    return data.profile as FounderProfile
  },

  async restore(): Promise<FounderProfile | null> {
    const token = this.getToken()
    if (!token) {
      this.logout()
      return null
    }
    try {
      const data = await postAdminAuth({ action: 'session', token }, token)
      if (!data.profile) {
        this.logout()
        return null
      }
      this.setProfile(data.profile as FounderProfile)
      return data.profile as FounderProfile
    } catch {
      this.logout()
      return null
    }
  },

  async updateProfile(patch: {
    display_name?: string
    avatar_url?: string
  }): Promise<FounderProfile> {
    const token = this.getToken()
    if (!token) throw new Error('Not signed in')
    const data = await postAdminAuth({ action: 'update-profile', token, ...patch }, token)
    if (data.profile) this.setProfile(data.profile as FounderProfile)
    return data.profile as FounderProfile
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(PROFILE_KEY)
  },
}

/** Resolve avatar: remote URL as-is, storage path → temporary signed URL. */
export async function resolveAvatarUrl(avatarUrl: string): Promise<string> {
  if (!avatarUrl) return ''
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) return avatarUrl
  const token = adminAuth.getToken()
  if (!token) return ''
  try {
    const res = await fetch(`${base()}/functions/v1/admin-notes-storage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: 'sign', path: avatarUrl }),
    })
    const data = await res.json().catch(() => ({}))
    return typeof data.signed_url === 'string' ? data.signed_url : ''
  } catch {
    return ''
  }
}

/** Convert any image File to WebP before avatar upload. */
export async function convertToWebp(file: File, quality = 0.9): Promise<File> {
  if (file.type === 'image/webp') return file
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close?.()
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('WebP conversion failed'))),
      'image/webp',
      quality,
    )
  })
  return new File([blob], `${file.name.replace(/\.\w+$/, '')}.webp`, { type: 'image/webp' })
}

/** Upload avatar to dev-notes root: avatars/<author_key>.webp */
export async function uploadAvatar(file: File): Promise<{ avatar_url: string; signed_url: string }> {
  const token = adminAuth.getToken()
  if (!token) throw new Error('Not signed in')
  const webp = await convertToWebp(file)
  const form = new FormData()
  form.append('purpose', 'avatar')
  form.append('file', webp)
  const res = await fetch(`${base()}/functions/v1/admin-notes-storage`, {
    method: 'POST',
    headers: {
      apikey: anonKey(),
      Authorization: `Bearer ${token}`,
    },
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.avatar_url) throw new Error(data.error || 'Avatar upload failed')
  return data
}
