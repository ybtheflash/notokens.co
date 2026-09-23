import { createClient } from '@supabase/supabase-js'
import { adminAuth } from './adminAuth'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  accessToken: async () => adminAuth.getToken(),
})

export const NOTES_SITE_KEY = (import.meta.env.VITE_NOTES_SITE_KEY as string) || 'notokens'
export const NOTES_SITE_NAME = (import.meta.env.VITE_NOTES_SITE_NAME as string) || 'NoTokens'
