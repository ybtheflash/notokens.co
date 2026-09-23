import { adminAuth } from './adminAuth'

export interface NoteContext {
  title: string
  content: string
  author_name?: string
  author_key?: string
  site_key?: string
  site_name?: string
  priority?: string
}

export interface GenerateAiOptions {
  prompt: string
  note: NoteContext
  selectedText?: string
}

export interface AiResult {
  text: string
  html: string
}

function base() {
  return (import.meta.env.VITE_SUPABASE_URL as string || '').replace(/\/$/, '')
}

function anonKey() {
  return (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''
}

function formatInline(str: string): string {
  return str
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-white/10 text-amber-300 font-mono text-xs">$1</code>')
}

export function cleanMarkdownToHtml(md: string): string {
  let text = md.trim()
  text = text.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/i, '')

  if (/<(p|h[1-6]|ul|ol|li|div|blockquote)[\s>]/i.test(text)) {
    return text
  }

  const lines = text.split('\n')
  const result: string[] = []
  let inList = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      if (inList) {
        result.push('</ul>')
        inList = false
      }
      continue
    }

    if (line.startsWith('# ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h2>${formatInline(line.slice(2))}</h2>`)
    } else if (line.startsWith('## ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h3>${formatInline(line.slice(3))}</h3>`)
    } else if (line.startsWith('### ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h4>${formatInline(line.slice(4))}</h4>`)
    } else if (/^[-*•]\s+/.test(line)) {
      if (!inList) {
        result.push('<ul>')
        inList = true
      }
      result.push(`<li>${formatInline(line.replace(/^[-*•]\s+/, ''))}</li>`)
    } else if (/^\d+\.\s+/.test(line)) {
      if (!inList) {
        result.push('<ul>')
        inList = true
      }
      result.push(`<li>${formatInline(line.replace(/^\d+\.\s+/, ''))}</li>`)
    } else {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<p>${formatInline(line)}</p>`)
    }
  }

  if (inList) result.push('</ul>')
  return result.join('')
}

/**
 * Call the Supabase Edge Function `admin-ai`.
 * The GEMINI_API_KEY lives strictly in Supabase Edge Secrets (server-side only)
 * and is never exposed to the client.
 */
export async function generateNoteAi(options: GenerateAiOptions): Promise<AiResult> {
  const token = adminAuth.getToken()

  const res = await fetch(`${base()}/functions/v1/admin-ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey(),
      Authorization: `Bearer ${token || anonKey()}`,
    },
    body: JSON.stringify({
      prompt: options.prompt,
      note: options.note,
      selected_text: options.selectedText,
    }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok || !data.ok) {
    throw new Error(data.error || `AI request failed (${res.status})`)
  }

  return {
    text: data.text,
    html: data.html || cleanMarkdownToHtml(data.text),
  }
}
