import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from '@supabase/supabase-js'
import { supabase } from './supabaseService'

export interface AdminNoteAttachment {
  path: string
  name: string
  mime_type: string
  size: number
}

interface UploadResponse {
  attachment: AdminNoteAttachment
  signed_url: string
}

interface SignedUrlResponse {
  signed_url: string
}

const getFunctionErrorMessage = async (error: unknown) => {
  if (error instanceof FunctionsHttpError) {
    try {
      const payload = (await error.context.json()) as { error?: unknown; message?: unknown }
      if (typeof payload.error === 'string') return payload.error
      if (typeof payload.message === 'string') return payload.message
    } catch {
      return `Storage function failed with status ${error.context?.status || 'unknown'}`
    }
  }
  if (error instanceof FunctionsRelayError) return 'Storage function relay failed'
  if (error instanceof FunctionsFetchError) return 'Could not reach the storage function'
  return error instanceof Error ? error.message : 'Storage request failed'
}

const invokeStorage = async <T>(body: FormData | Record<string, unknown>): Promise<T> => {
  const { data, error } = await supabase.functions.invoke('admin-notes-storage', { body })
  if (error) throw new Error(await getFunctionErrorMessage(error))
  if (!data || typeof data !== 'object') throw new Error('Invalid storage response')
  if ('error' in data && typeof data.error === 'string') throw new Error(data.error)
  return data as T
}

export const adminNoteStorageService = {
  async upload(noteId: string, file: File, siteKey?: string, siteName?: string) {
    const form = new FormData()
    form.append('note_id', noteId)
    form.append('file', file)
    if (siteKey) form.append('site_key', siteKey)
    if (siteName) form.append('site_name', siteName)
    return invokeStorage<UploadResponse>(form)
  },

  async createSignedUrl(path: string) {
    return invokeStorage<SignedUrlResponse>({ action: 'sign', path })
  },

  async remove(paths: string[]) {
    if (paths.length === 0) return
    await invokeStorage<{ deleted: number }>({ action: 'delete', paths })
  },

  async ensureSite(siteKey: string, siteName: string) {
    return invokeStorage<{ ok: boolean; folder: string }>({
      action: 'ensure-site',
      site_key: siteKey,
      site_name: siteName,
    })
  },
}
