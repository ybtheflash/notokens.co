<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Image,
  Loader2,
  Paperclip,
  Pin,
  Plus,
  Redo2,
  RefreshCw,
  Sparkles,
  StickyNote,
  Trash2,
  Undo2,
  X,
} from 'lucide-vue-next'
import NoteAiPrompt from '@/components/admin/NoteAiPrompt.vue'
import type { NoteContext } from '@/services/aiNoteService'
import { toast } from '@/composables/useToast'
import { supabase, NOTES_SITE_KEY, NOTES_SITE_NAME } from '@/services/supabaseService'
import { adminAuth } from '@/services/adminAuth'
import { useConfirm } from '@/composables/useConfirm'
import {
  adminNoteStorageService,
  type AdminNoteAttachment,
} from '@/services/adminNoteStorageService'

const props = defineProps<{ refreshKey?: number }>()
const emit = defineEmits<{ changed: [] }>()

type AuthorKey = 'justysss' | 'ybtheflash'
type NotePriority = 'red' | 'orange' | 'green'
type AttachmentImageStatus = 'loading' | 'loaded' | 'error'

type NoteAttachment = AdminNoteAttachment

interface AdminNote {
  id: string
  title: string
  content: string
  color: string
  is_pinned: boolean
  created_by: string
  author_name: string
  author_key: AuthorKey
  site_key: string
  site_name: string
  priority: NotePriority
  attachments: NoteAttachment[]
  created_at: string
  updated_at: string
}

interface NoteDraft {
  title: string
  content: string
  is_pinned: boolean
  author_key: AuthorKey
  priority: NotePriority
  attachments: NoteAttachment[]
}

const JUSTYSSS_AUTHOR = {
  key: 'justysss' as const,
  label: 'Justysss',
  fullName: 'Sourish Bose',
  avatar: 'https://github.com/justysssss.png',
}
const YBTHEFLASH_AUTHOR = {
  key: 'ybtheflash' as const,
  label: 'YBTHEFLASH',
  fullName: 'Yubaraj Biswas',
  avatar: 'https://github.com/ybtheflash.png',
}
const AUTHORS = [JUSTYSSS_AUTHOR, YBTHEFLASH_AUTHOR]

const DEFAULT_SITE_KEY = NOTES_SITE_KEY
const DEFAULT_SITE_NAME = NOTES_SITE_NAME

const RED_PRIORITY = { value: 'red' as const, label: 'Crucial', dot: 'bg-red-400' }
const ORANGE_PRIORITY = { value: 'orange' as const, label: 'Important', dot: 'bg-orange-400' }
const GREEN_PRIORITY = { value: 'green' as const, label: 'Normal', dot: 'bg-emerald-400' }
const PRIORITIES = [RED_PRIORITY, ORANGE_PRIORITY, GREEN_PRIORITY]

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'text/plain',
  'text/markdown',
  'application/json',
])

const getStoredWriter = (): AuthorKey => {
  const value = localStorage.getItem('admin-notes-writer')
  return value === 'ybtheflash' ? 'ybtheflash' : 'justysss'
}

const defaultWriter = ref<AuthorKey>(getStoredWriter())
const emptyDraft = (): NoteDraft => ({
  title: '',
  content: '',
  is_pinned: false,
  author_key: defaultWriter.value,
  priority: 'green',
  attachments: [],
})

const notes = ref<AdminNote[]>([])
const selectedNoteId = ref<string | null>(null)
const noteDraft = ref<NoteDraft>(emptyDraft())
const signedUrls = ref<Record<string, string>>({})
const attachmentImageStatuses = ref<Record<string, AttachmentImageStatus>>({})
const pendingImageUploads = ref<Array<{ id: number; name: string }>>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isLoading = ref(false)
const isCreating = ref(false)
const isUploading = ref(false)
const saveState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const currentUserId = ref('')
const history = ref<NoteDraft[]>([])
const historyIndex = ref(-1)

let saveTimer: ReturnType<typeof setTimeout> | null = null
let historyTimer: ReturnType<typeof setTimeout> | null = null
let saveRevision = 0
let pendingUploadId = 0

const currentWriterKey = computed(() =>
  selectedNoteId.value ? noteDraft.value.author_key : defaultWriter.value,
)

const sortedNotes = computed(() =>
  [...notes.value].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  }),
)

const selectedNote = computed(() =>
  notes.value.find((note) => note.id === selectedNoteId.value),
)

const selectedSiteFilter = ref<string>('all')

const knownSites = [
  { site_key: 'notokens', site_name: 'NoTokens' },
  { site_key: 'otterspeak', site_name: 'OtterSpeak' },
]

const availableSites = computed(() => {
  const map = new Map<string, { site_key: string; site_name: string; count: number }>()
  for (const s of knownSites) {
    map.set(s.site_key, { ...s, count: 0 })
  }
  for (const n of notes.value) {
    const key = n.site_key || 'notokens'
    const name = n.site_name || (key === 'otterspeak' ? 'OtterSpeak' : 'NoTokens')
    if (!map.has(key)) {
      map.set(key, { site_key: key, site_name: name, count: 0 })
    }
    map.get(key)!.count++
  }
  return Array.from(map.values())
})

const filteredNotes = computed(() => {
  if (selectedSiteFilter.value === 'all') return sortedNotes.value
  return sortedNotes.value.filter(
    (note) => (note.site_key || 'notokens') === selectedSiteFilter.value,
  )
})

const changeNoteSite = async (newSiteKey: string) => {
  if (!selectedNoteId.value) return
  const site = availableSites.value.find((s) => s.site_key === newSiteKey)
  const newSiteName = site?.site_name || (newSiteKey === 'otterspeak' ? 'OtterSpeak' : 'NoTokens')
  const note = notes.value.find((n) => n.id === selectedNoteId.value)
  if (note) {
    note.site_key = newSiteKey
    note.site_name = newSiteName
  }
  try {
    await supabase
      .from('admin_notes')
      .update({
        site_key: newSiteKey,
        site_name: newSiteName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedNoteId.value)
    toast.success(`Note moved to ${newSiteName}`)
  } catch {
    toast.error('Failed to change website for note')
  }
}

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(
  () => historyIndex.value >= 0 && historyIndex.value < history.value.length - 1,
)

const getAuthor = (key: AuthorKey) =>
  key === 'ybtheflash' ? YBTHEFLASH_AUTHOR : JUSTYSSS_AUTHOR
const getPriority = (priority: NotePriority) => {
  if (priority === 'red') return RED_PRIORITY
  if (priority === 'orange') return ORANGE_PRIORITY
  return GREEN_PRIORITY
}

const getAttachmentImageStatus = (path: string): AttachmentImageStatus =>
  attachmentImageStatuses.value[path] ?? 'loading'

const setAttachmentImageStatus = (path: string, status: AttachmentImageStatus) => {
  attachmentImageStatuses.value[path] = status
}

const priorityCardClass = (priority: NotePriority) =>
  ({
    red: 'border-red-500/25 hover:border-red-400/50 bg-red-500/[0.035]',
    orange: 'border-orange-500/25 hover:border-orange-400/50 bg-orange-500/[0.035]',
    green: 'border-emerald-500/20 hover:border-emerald-400/45 bg-emerald-500/[0.025]',
  })[priority]

const cloneDraft = (): NoteDraft => ({
  ...noteDraft.value,
  attachments: noteDraft.value.attachments.map((attachment) => ({ ...attachment })),
})

const draftsMatch = (a: NoteDraft, b: NoteDraft) => JSON.stringify(a) === JSON.stringify(b)

const plainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

const formatUpdatedAt = (value: string) => {
  const date = new Date(value)
  const diffMinutes = Math.round((date.getTime() - Date.now()) / 60000)
  if (Math.abs(diffMinutes) < 1) return 'just now'
  if (Math.abs(diffMinutes) < 60) {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffMinutes, 'minute')
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const normalizeNote = (note: Record<string, unknown>): AdminNote => ({
  ...(note as unknown as AdminNote),
  author_key: note.author_key === 'ybtheflash' ? 'ybtheflash' : 'justysss',
  site_key:
    typeof note.site_key === 'string' && note.site_key ? note.site_key : DEFAULT_SITE_KEY,
  site_name:
    typeof note.site_name === 'string' && note.site_name ? note.site_name : DEFAULT_SITE_NAME,
  priority: ['red', 'orange', 'green'].includes(String(note.priority))
    ? (note.priority as NotePriority)
    : 'green',
  attachments: Array.isArray(note.attachments) ? (note.attachments as NoteAttachment[]) : [],
})

const ensureSignedUrl = async (attachment: NoteAttachment) => {
  if (signedUrls.value[attachment.path]) return
  if (attachment.mime_type.startsWith('image/')) {
    setAttachmentImageStatus(attachment.path, 'loading')
  }
  try {
    const data = await adminNoteStorageService.createSignedUrl(attachment.path)
    signedUrls.value[attachment.path] = data.signed_url
  } catch {
    if (attachment.mime_type.startsWith('image/')) {
      setAttachmentImageStatus(attachment.path, 'error')
    }
  }
}

const hydrateAttachmentUrls = async (items: AdminNote[]) => {
  const attachments = Array.from(
    new Map(
      items.flatMap((note) => note.attachments).map((attachment) => [attachment.path, attachment]),
    ).values(),
  )
  for (const attachment of attachments) await ensureSignedUrl(attachment)
}

const loadSession = async () => {
  const profile = adminAuth.getProfile() || (await adminAuth.restore())
  if (!profile) throw new Error('Your admin session has expired')
  currentUserId.value = profile.id
}

const loadNotes = async () => {
  isLoading.value = true
  try {
    if (!currentUserId.value) await loadSession()
    const { data, error } = await supabase
      .from('admin_notes')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('updated_at', { ascending: false })
    if (error) throw error
    notes.value = ((data || []) as Record<string, unknown>[]).map(normalizeNote)
    void hydrateAttachmentUrls(notes.value)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to load shared notes')
  } finally {
    isLoading.value = false
  }
}

const commitHistorySnapshot = () => {
  const snapshot = cloneDraft()
  const current = history.value[historyIndex.value]
  if (current && draftsMatch(current, snapshot)) return
  history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(snapshot)
  historyIndex.value = history.value.length - 1
}

const saveDraft = async () => {
  const noteId = selectedNoteId.value
  if (!noteId) return false

  const revision = ++saveRevision
  const author = getAuthor(noteDraft.value.author_key)
  const payload = {
    ...cloneDraft(),
    author_name: author.label,
    updated_at: new Date().toISOString(),
  }

  saveState.value = 'saving'
  const { error } = await supabase.from('admin_notes').update(payload).eq('id', noteId)
  if (revision !== saveRevision) return !error
  if (error) {
    saveState.value = 'error'
    toast.error('Could not autosave this note')
    return false
  }

  const note = notes.value.find((item) => item.id === noteId)
  if (note) Object.assign(note, payload)
  saveState.value = 'saved'
  emit('changed')
  return true
}

const queueAutosave = () => {
  if (!selectedNoteId.value) return
  saveState.value = 'saving'
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = null
    void saveDraft()
  }, 650)
}

const handleDraftInput = () => {
  if (historyTimer) clearTimeout(historyTimer)
  historyTimer = setTimeout(() => {
    historyTimer = null
    commitHistorySnapshot()
  }, 250)
  queueAutosave()
}

const flushAutosave = async () => {
  if (!saveTimer) return
  clearTimeout(saveTimer)
  saveTimer = null
  commitHistorySnapshot()
  await saveDraft()
}

const refreshNotes = async () => {
  await flushAutosave()
  await loadNotes()
}

const selectWriter = (key: AuthorKey) => {
  defaultWriter.value = key
  localStorage.setItem('admin-notes-writer', key)
  if (selectedNoteId.value) {
    noteDraft.value.author_key = key
    commitHistorySnapshot()
    queueAutosave()
  }
}

const setPriority = (priority: NotePriority) => {
  noteDraft.value.priority = priority
  commitHistorySnapshot()
  queueAutosave()
}

const openNote = async (note: AdminNote) => {
  if (selectedNoteId.value === note.id) return
  await flushAutosave()
  selectedNoteId.value = note.id
  noteDraft.value = {
    title: note.title,
    content: note.content,
    is_pinned: note.is_pinned,
    author_key: note.author_key,
    priority: note.priority,
    attachments: note.attachments.map((attachment) => ({ ...attachment })),
  }
  history.value = [cloneDraft()]
  historyIndex.value = 0
  saveState.value = 'saved'
}

const closeEditor = async () => {
  await flushAutosave()
  selectedNoteId.value = null
  noteDraft.value = emptyDraft()
  history.value = []
  historyIndex.value = -1
  saveState.value = 'idle'
}

const createNote = async () => {
  if (isCreating.value) return
  await flushAutosave()
  isCreating.value = true
  try {
    if (!currentUserId.value) await loadSession()
    const author = getAuthor(defaultWriter.value)
    const targetSiteKey =
      selectedSiteFilter.value !== 'all' ? selectedSiteFilter.value : DEFAULT_SITE_KEY
    const targetSiteName =
      availableSites.value.find((s) => s.site_key === targetSiteKey)?.site_name ||
      (targetSiteKey === 'otterspeak' ? 'OtterSpeak' : DEFAULT_SITE_NAME)

    // First note from this site creates the dev-notes/<site_key>/ folder
    await adminNoteStorageService.ensureSite(targetSiteKey, targetSiteName)
    const { data, error } = await supabase
      .from('admin_notes')
      .insert({
        title: '',
        content: '',
        color: 'slate',
        is_pinned: false,
        created_by: currentUserId.value,
        author_name: author.label,
        author_key: author.key,
        site_key: targetSiteKey,
        site_name: targetSiteName,
        priority: 'green',
        attachments: [],
      })
      .select('*')
      .single()
    if (error) throw error
    const note = normalizeNote(data as Record<string, unknown>)
    notes.value.unshift(note)
    await openNote(note)
    emit('changed')
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to create note')
  } finally {
    isCreating.value = false
  }
}

const { confirm: confirmDialog } = useConfirm()

const deleteNote = async (noteId: string) => {
  const ok = await confirmDialog({
    title: 'Delete Shared Note',
    message: 'Delete this shared note? This cannot be undone.',
    confirmText: 'Delete Note',
    type: 'danger',
  })
  if (!ok) return
  const note = notes.value.find((item) => item.id === noteId)

  if (note?.attachments.length) {
    try {
      await adminNoteStorageService.remove(note.attachments.map((attachment) => attachment.path))
    } catch {
      return toast.error('Could not remove this note’s attachments')
    }
  }

  if (selectedNoteId.value === noteId) {
    if (saveTimer) clearTimeout(saveTimer)
    if (historyTimer) clearTimeout(historyTimer)
    saveTimer = null
    historyTimer = null
  }

  const { error } = await supabase.from('admin_notes').delete().eq('id', noteId)
  if (error) return toast.error('Failed to delete note')

  notes.value = notes.value.filter((item) => item.id !== noteId)
  if (selectedNoteId.value === noteId) {
    selectedNoteId.value = null
    noteDraft.value = emptyDraft()
    history.value = []
    historyIndex.value = -1
    saveState.value = 'idle'
  }
  emit('changed')
  toast.success('Note deleted')
}

const toggleNotePin = async (note: AdminNote) => {
  const nextPinned = !note.is_pinned
  note.is_pinned = nextPinned
  if (selectedNoteId.value === note.id) {
    noteDraft.value.is_pinned = nextPinned
    commitHistorySnapshot()
    queueAutosave()
    return
  }
  const { error } = await supabase
    .from('admin_notes')
    .update({ is_pinned: nextPinned, updated_at: new Date().toISOString() })
    .eq('id', note.id)
  if (error) {
    note.is_pinned = !nextPinned
    toast.error('Failed to update pin')
  } else {
    emit('changed')
  }
}

const toggleDraftPin = () => {
  noteDraft.value.is_pinned = !noteDraft.value.is_pinned
  commitHistorySnapshot()
  queueAutosave()
}

const undo = () => {
  commitHistorySnapshot()
  if (!canUndo.value) return
  historyIndex.value -= 1
  noteDraft.value = { ...history.value[historyIndex.value]! }
  queueAutosave()
}

const redo = () => {
  commitHistorySnapshot()
  if (!canRedo.value) return
  historyIndex.value += 1
  noteDraft.value = { ...history.value[historyIndex.value]! }
  queueAutosave()
}

const resolveMimeType = (file: File) => {
  if (file.type) return file.type
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension === 'md') return 'text/markdown'
  if (extension === 'json') return 'application/json'
  return 'text/plain'
}

const uploadAttachments = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  if (!selectedNoteId.value || files.length === 0) return

  isUploading.value = true
  try {
    for (const file of files) {
      const mimeType = resolveMimeType(file)
      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        toast.error(`${file.name} is not a supported image or text file`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 10 MB`)
        continue
      }

      const uploadFile =
        file.type === mimeType ? file : new File([file], file.name, { type: mimeType })
      const pendingImage = mimeType.startsWith('image/')
        ? { id: ++pendingUploadId, name: file.name }
        : null

      if (pendingImage) pendingImageUploads.value.push(pendingImage)

      try {
        const siteKey = selectedNote.value?.site_key || DEFAULT_SITE_KEY
        const siteName = selectedNote.value?.site_name || DEFAULT_SITE_NAME
        const { attachment, signed_url: signedUrl } = await adminNoteStorageService.upload(
          selectedNoteId.value,
          uploadFile,
          siteKey,
          siteName,
        )
        noteDraft.value.attachments.push(attachment)
        signedUrls.value[attachment.path] = signedUrl
        if (mimeType.startsWith('image/')) {
          setAttachmentImageStatus(attachment.path, 'loading')
        }
      } finally {
        if (pendingImage) {
          pendingImageUploads.value = pendingImageUploads.value.filter(
            (item) => item.id !== pendingImage.id,
          )
        }
      }
    }
    commitHistorySnapshot()
    await saveDraft()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Attachment upload failed')
  } finally {
    isUploading.value = false
  }
}

const removeAttachment = async (attachment: NoteAttachment) => {
  try {
    await adminNoteStorageService.remove([attachment.path])
  } catch {
    return toast.error('Failed to remove attachment')
  }
  noteDraft.value.attachments = noteDraft.value.attachments.filter(
    (item) => item.path !== attachment.path,
  )
  delete signedUrls.value[attachment.path]
  delete attachmentImageStatuses.value[attachment.path]
  commitHistorySnapshot()
  await saveDraft()
}

const openAttachment = (attachment: NoteAttachment) => {
  const url = signedUrls.value[attachment.path]
  if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

// ── AI Context & /ai Slash Command handling ────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillInstance: any = null

const isAiOpen = ref(false)
const aiInitialPrompt = ref('')
const aiSelectedText = ref('')
const slashMenuVisible = ref(false)
const slashMenuPos = ref({ top: 30, left: 20 })
let slashTriggerIndex = -1

const slashQuickPrompts = [
  { label: '⚡ Continue writing', prompt: 'Continue writing the next logical paragraphs based on the note context and tone.' },
  { label: '📝 Summarize note', prompt: 'Provide a concise, high-impact executive summary and key takeaways of this note.' },
  { label: '📋 Action items checklist', prompt: 'Extract or generate an actionable checklist / to-do list from this note.' },
  { label: '🪄 Fix grammar & polish', prompt: 'Improve the clarity, grammar, and readability of the note.' },
]

const activeNoteContext = computed<NoteContext>(() => ({
  title: noteDraft.value.title,
  content: noteDraft.value.content,
  author_key: noteDraft.value.author_key,
  author_name: getAuthor(noteDraft.value.author_key).label,
  site_key: selectedNote.value?.site_key || DEFAULT_SITE_KEY,
  site_name: selectedNote.value?.site_name || DEFAULT_SITE_NAME,
  priority: noteDraft.value.priority,
}))

const openAiPrompt = (initialPrompt = '') => {
  slashMenuVisible.value = false
  if (quillInstance) {
    const sel = quillInstance.getSelection()
    if (sel && sel.length > 0) {
      aiSelectedText.value = quillInstance.getText(sel.index, sel.length).trim()
    } else {
      aiSelectedText.value = ''
    }
  }
  aiInitialPrompt.value = initialPrompt
  isAiOpen.value = true
}

const openAiFromSlash = () => {
  if (quillInstance && slashTriggerIndex >= 0) {
    const sel = quillInstance.getSelection()
    const curIndex = sel ? sel.index : slashTriggerIndex + 1
    const lenToDelete = Math.max(1, curIndex - slashTriggerIndex)
    quillInstance.deleteText(slashTriggerIndex, lenToDelete)
  }
  slashMenuVisible.value = false
  openAiPrompt()
}

const openAiWithPrompt = (prompt: string) => {
  if (quillInstance && slashTriggerIndex >= 0) {
    const sel = quillInstance.getSelection()
    const curIndex = sel ? sel.index : slashTriggerIndex + 1
    const lenToDelete = Math.max(1, curIndex - slashTriggerIndex)
    quillInstance.deleteText(slashTriggerIndex, lenToDelete)
  }
  slashMenuVisible.value = false
  openAiPrompt(prompt)
}

const checkSlashTrigger = () => {
  if (!quillInstance) return
  const sel = quillInstance.getSelection()
  if (!sel) {
    slashMenuVisible.value = false
    return
  }
  const textBefore = quillInstance.getText(0, sel.index)
  const lastSlashIndex = textBefore.lastIndexOf('/')

  if (lastSlashIndex !== -1 && sel.index - lastSlashIndex <= 5) {
    const triggerWord = textBefore.slice(lastSlashIndex, sel.index)
    if (/^\/(ai)?$/i.test(triggerWord)) {
      slashTriggerIndex = lastSlashIndex
      try {
        const bounds = quillInstance.getBounds(sel.index)
        if (bounds) {
          slashMenuPos.value = {
            top: bounds.bottom + 8,
            left: Math.max(16, Math.min(bounds.left, 420)),
          }
        }
      } catch {
        slashMenuPos.value = { top: 40, left: 20 }
      }
      slashMenuVisible.value = true
      return
    }
  }
  slashMenuVisible.value = false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onQuillReady = (quill: any) => {
  quillInstance = quill

  quill.on('text-change', () => {
    setTimeout(checkSlashTrigger, 15)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quill.on('selection-change', (range: any) => {
    if (!range) {
      slashMenuVisible.value = false
    } else {
      setTimeout(checkSlashTrigger, 15)
    }
  })

  quill.root.addEventListener('keydown', (e: KeyboardEvent) => {
    if (slashMenuVisible.value && (e.key === 'Enter' || e.key === 'Tab')) {
      e.preventDefault()
      e.stopPropagation()
      openAiFromSlash()
      return
    }

    if (e.key === 'Escape') {
      slashMenuVisible.value = false
      return
    }

    if (e.key === 'Enter') {
      const sel = quill.getSelection()
      if (sel) {
        const textBefore = quill.getText(0, sel.index)
        const lastLine = textBefore.split('\n').pop() || ''
        const match = lastLine.match(/^\/ai(?:\s+(.*))?$/i)
        if (match) {
          e.preventDefault()
          e.stopPropagation()
          slashMenuVisible.value = false
          const lineStart = sel.index - lastLine.length
          quill.deleteText(lineStart, lastLine.length)
          openAiPrompt(match[1] || '')
          return
        }
      }
    }

    if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === '/')) {
      e.preventDefault()
      openAiPrompt()
    }
  })
}

const onAiInsert = (html: string, mode: 'cursor' | 'replace' | 'append') => {
  if (!quillInstance) return
  commitHistorySnapshot()

  const sel = quillInstance.getSelection()
  let insertIndex = quillInstance.getLength() - 1

  if (mode === 'replace' && sel && sel.length > 0) {
    quillInstance.deleteText(sel.index, sel.length)
    insertIndex = sel.index
  } else if (mode === 'cursor' && sel) {
    insertIndex = sel.index
  }

  quillInstance.clipboard.dangerouslyPasteHTML(insertIndex, html)
  handleDraftInput()
  void saveDraft()
  toast.success('Inserted AI content into note')
}

watch(
  () => props.refreshKey,
  () => void refreshNotes(),
)
onMounted(() => void loadNotes())
onUnmounted(() => {
  if (historyTimer) clearTimeout(historyTimer)
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
    void saveDraft()
  }
})
</script>

<template>
  <section class="max-w-6xl mx-auto space-y-4">
    <!-- Header Controls Bar -->
    <div
      class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-white/[0.07]"
    >
      <div class="flex items-center gap-3">
        <span
          class="w-9 h-9 rounded-xl bg-amber-300/10 border border-amber-300/20 flex items-center justify-center"
        >
          <StickyNote class="w-4.5 h-4.5 text-amber-300" />
        </span>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold text-white">Shared notes</h3>
            <span class="text-[9px] font-mono text-gray-500">{{ notes.length }}</span>
          </div>
          <p class="text-[11px] text-gray-500">Choose a writer, leave a note, and it autosaves.</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Author Picker Pill -->
        <div class="flex items-center gap-1 p-1 rounded-xl bg-black/20 border border-white/[0.08]">
          <button
            v-for="author in AUTHORS"
            :key="author.key"
            type="button"
            class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            :class="
              currentWriterKey === author.key
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-300'
            "
            :title="author.fullName"
            @click="selectWriter(author.key)"
          >
            <img :src="author.avatar" :alt="author.label" class="w-5 h-5 rounded-full object-cover" />
            {{ author.label }}
          </button>
        </div>

        <!-- Refresh Button -->
        <button
          type="button"
          :disabled="isLoading"
          class="p-2 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
          title="Refresh notes"
          @click="refreshNotes"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
        </button>

        <!-- New Note Action -->
        <button
          type="button"
          :disabled="isCreating"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-300 text-[#17130a] text-xs font-bold hover:bg-amber-200 disabled:opacity-50 transition-colors"
          @click="createNote"
        >
          <Loader2 v-if="isCreating" class="w-3.5 h-3.5 animate-spin" />
          <Plus v-else class="w-3.5 h-3.5" />
          New note
        </button>
      </div>
    </div>

    <!-- Active Note Editor Surface -->
    <div
      v-if="selectedNoteId"
      class="max-w-3xl mx-auto rounded-2xl border bg-[#11151d] shadow-2xl overflow-hidden"
      :class="priorityCardClass(noteDraft.priority)"
    >
      <!-- Editor Top Bar -->
      <div
        class="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-white/[0.07] bg-black/10"
      >
        <div class="flex items-center gap-2">
          <div v-if="selectedNote" class="relative flex items-center">
            <select
              :value="selectedNote.site_key || 'notokens'"
              class="appearance-none pl-2 pr-5 py-1 rounded-md border border-sky-400/30 bg-sky-400/[0.08] text-[9px] font-mono uppercase tracking-wider text-sky-300 hover:bg-sky-400/15 cursor-pointer focus:outline-none transition-colors"
              title="Change website for this note"
              @change="changeNoteSite(($event.target as HTMLSelectElement).value)"
            >
              <option
                v-for="site in availableSites"
                :key="site.site_key"
                :value="site.site_key"
                class="bg-[#11151d] text-white"
              >
                {{ site.site_name }}
              </option>
            </select>
            <ChevronDown class="w-2.5 h-2.5 text-sky-300 pointer-events-none absolute right-1.5" />
          </div>
          <div class="flex items-center gap-1">
            <button
              v-for="priority in PRIORITIES"
              :key="priority.value"
              type="button"
              class="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-colors"
              :class="
                noteDraft.priority === priority.value
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              "
              @click="setPriority(priority.value)"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="priority.dot"></span>
              {{ priority.label }}
            </button>
          </div>
        </div>

        <!-- Action Tools -->
        <div class="flex items-center gap-0.5">
          <button type="button" class="note-tool" title="Undo" :disabled="!canUndo" @click="undo">
            <Undo2 class="w-3.5 h-3.5" />
          </button>
          <button type="button" class="note-tool" title="Redo" :disabled="!canRedo" @click="redo">
            <Redo2 class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            class="note-tool"
            :class="{ 'text-amber-300 bg-amber-300/10': noteDraft.is_pinned }"
            title="Pin note"
            @click="toggleDraftPin"
          >
            <Pin class="w-3.5 h-3.5" :class="{ 'fill-current': noteDraft.is_pinned }" />
          </button>
          <button
            type="button"
            class="note-tool"
            title="Attach file"
            :disabled="isUploading"
            @click="fileInput?.click()"
          >
            <Loader2 v-if="isUploading" class="w-3.5 h-3.5 animate-spin" />
            <Paperclip v-else class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            class="note-tool hover:!text-red-400"
            title="Delete note"
            @click="deleteNote(selectedNoteId)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
          <button type="button" class="note-tool" title="Close" @click="closeEditor">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Hidden File Picker -->
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,.txt,.md,.json,text/plain,text/markdown,application/json"
        class="hidden"
        @change="uploadAttachments"
      />

      <!-- Title Input -->
      <input
        v-model="noteDraft.title"
        maxlength="120"
        placeholder="Note title"
        class="w-full px-5 pt-4 pb-2 bg-transparent text-lg font-bold text-white placeholder-gray-600 outline-none"
        @input="handleDraftInput"
      />

      <!-- Rich Text Area with Slash Command Popover -->
      <div class="relative">
        <QuillEditor
          v-model:content="noteDraft.content"
          content-type="html"
          theme="snow"
          :toolbar="[['bold', 'italic']]"
          @update:content="handleDraftInput"
          @ready="onQuillReady"
        />

        <!-- Floating Slash Command Dropdown -->
        <div
          v-if="slashMenuVisible"
          class="absolute z-30 rounded-xl bg-[#12151f] border border-amber-300/40 shadow-2xl shadow-black/80 py-1.5 px-1 min-w-[240px] text-xs animate-fade-in"
          :style="{ top: `${slashMenuPos.top}px`, left: `${slashMenuPos.left}px` }"
        >
          <div
            class="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-amber-300/80 border-b border-white/5 mb-1 flex items-center justify-between"
          >
            <span>Commands (/)</span>
            <span class="text-[9px] text-gray-500 font-mono">Esc to close</span>
          </div>

          <button
            type="button"
            class="w-full px-2.5 py-2 rounded-lg bg-amber-400/15 text-amber-200 font-semibold flex items-center justify-between hover:bg-amber-400/25 transition-colors"
            @click="openAiFromSlash"
          >
            <div class="flex items-center gap-2">
              <Sparkles class="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>/ai — Ask Gemini Flash</span>
            </div>
            <span class="text-[10px] font-mono text-gray-400">Enter</span>
          </button>

          <div class="pt-1 mt-1 border-t border-white/5 space-y-0.5">
            <button
              v-for="item in slashQuickPrompts"
              :key="item.label"
              type="button"
              class="w-full px-2.5 py-1.5 rounded-lg text-left text-gray-300 hover:text-white hover:bg-white/5 text-[11px] flex items-center justify-between transition-colors"
              @click="openAiWithPrompt(item.prompt)"
            >
              <span>{{ item.label }}</span>
              <ChevronRight class="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <!-- Attachments Gallery -->
      <div
        v-if="noteDraft.attachments.length || pendingImageUploads.length"
        class="grid grid-cols-2 sm:grid-cols-3 gap-2 px-4 pb-3"
      >
        <div
          v-for="attachment in noteDraft.attachments"
          :key="attachment.path"
          class="group/attachment relative h-20 rounded-lg border border-white/10 bg-black/20 overflow-hidden"
        >
          <template v-if="attachment.mime_type.startsWith('image/')">
            <div
              v-if="!signedUrls[attachment.path] && getAttachmentImageStatus(attachment.path) !== 'error'"
              class="attachment-skeleton absolute inset-0"
              role="status"
              :aria-label="`Loading ${attachment.name}`"
            ></div>
            <img
              v-if="signedUrls[attachment.path] && getAttachmentImageStatus(attachment.path) !== 'error'"
              :src="signedUrls[attachment.path]"
              :alt="attachment.name"
              class="w-full h-full object-cover cursor-pointer"
              @error="setAttachmentImageStatus(attachment.path, 'error')"
              @click="openAttachment(attachment)"
            />
            <button
              v-if="getAttachmentImageStatus(attachment.path) === 'error'"
              type="button"
              class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[10px] text-gray-500"
              @click="openAttachment(attachment)"
            >
              <Image class="w-5 h-5" />
              Preview unavailable
            </button>
          </template>
          <button
            v-else
            type="button"
            class="w-full h-full px-3 flex items-center gap-2 text-left text-xs text-gray-300"
            @click="openAttachment(attachment)"
          >
            <FileText class="w-5 h-5 text-sky-400 shrink-0" />
            <span class="truncate">{{ attachment.name }}</span>
          </button>
          <button
            type="button"
            class="absolute z-10 top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-gray-300 opacity-0 group-hover/attachment:opacity-100 hover:text-red-400 transition-all"
            title="Remove attachment"
            @click="removeAttachment(attachment)"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- In-flight Upload Skeleton Placeholders -->
        <div
          v-for="pendingImage in pendingImageUploads"
          :key="pendingImage.id"
          class="attachment-skeleton relative h-20 rounded-lg border border-white/10 overflow-hidden"
          role="status"
          :aria-label="`Uploading ${pendingImage.name}`"
        >
          <span class="sr-only">Uploading {{ pendingImage.name }}</span>
        </div>
      </div>

      <!-- Editor Bottom Meta Bar -->
      <div
        class="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.07] text-[10px] text-gray-500"
      >
        <div class="flex items-center gap-2">
          <img
            :src="getAuthor(noteDraft.author_key).avatar"
            :alt="getAuthor(noteDraft.author_key).label"
            class="w-5 h-5 rounded-full"
          />
          <span>{{ getAuthor(noteDraft.author_key).label }}</span>
          <button
            type="button"
            class="flex items-center gap-1.5 px-2 py-0.5 ml-1 rounded-md bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-medium transition-colors"
            title="Ask Gemini AI with full note context (type / in note)"
            @click="openAiPrompt()"
          >
            <Sparkles class="w-3 h-3" />
            <span>Ask AI</span>
            <kbd class="px-1 py-0.2 bg-black/40 rounded border border-amber-400/20 text-[9px] font-mono text-amber-400/80">/</kbd>
          </button>
        </div>
        <span
          class="flex items-center gap-1.5 font-mono uppercase tracking-wider"
          :class="saveState === 'error' ? 'text-red-400' : ''"
        >
          <Loader2 v-if="saveState === 'saving'" class="w-3 h-3 animate-spin" />
          <Check v-else-if="saveState === 'saved'" class="w-3 h-3 text-emerald-400" />
          {{
            saveState === 'saving'
              ? 'Saving'
              : saveState === 'error'
                ? 'Save failed'
                : 'Autosaved'
          }}
        </span>
      </div>
    </div>

    <!-- Empty Loading Spinner -->
    <div v-if="isLoading && notes.length === 0" class="flex justify-center py-14">
      <Loader2 class="w-6 h-6 text-amber-300 animate-spin" />
    </div>

    <!-- Zero State Hero Card -->
    <button
      v-else-if="notes.length === 0"
      type="button"
      class="w-full max-w-3xl mx-auto block py-12 rounded-2xl border border-dashed border-white/10 hover:border-amber-300/30 bg-white/[0.015] text-center group transition-colors"
      @click="createNote"
    >
      <StickyNote class="w-7 h-7 text-gray-600 group-hover:text-amber-300 mx-auto mb-2 transition-colors" />
      <span class="block text-sm font-semibold text-gray-300">Start the founders’ notebook</span>
      <span class="block text-[11px] text-gray-600 mt-1">Create the first shared note</span>
    </button>

    <!-- Website Filter Tabs -->
    <div v-if="notes.length > 0" class="flex flex-wrap items-center gap-1.5 py-1">
      <button
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        :class="
          selectedSiteFilter === 'all'
            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 shadow-sm'
            : 'text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]'
        "
        @click="selectedSiteFilter = 'all'"
      >
        <span>🌐 All Websites</span>
        <span
          class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
          :class="selectedSiteFilter === 'all' ? 'bg-amber-400/30 text-amber-200' : 'bg-white/10 text-gray-400'"
        >
          {{ notes.length }}
        </span>
      </button>
      <button
        v-for="site in availableSites"
        :key="site.site_key"
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        :class="
          selectedSiteFilter === site.site_key
            ? 'bg-sky-400/20 text-sky-300 border border-sky-400/30 shadow-sm'
            : 'text-gray-400 hover:text-white bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]'
        "
        @click="selectedSiteFilter = site.site_key"
      >
        <span>{{ site.site_name }}</span>
        <span
          class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
          :class="selectedSiteFilter === site.site_key ? 'bg-sky-400/30 text-sky-200' : 'bg-white/10 text-gray-400'"
        >
          {{ site.count }}
        </span>
      </button>
    </div>

    <!-- Empty filtered state -->
    <div
      v-if="notes.length > 0 && filteredNotes.length === 0"
      class="w-full max-w-3xl mx-auto py-12 rounded-2xl border border-dashed border-white/10 text-center"
    >
      <p class="text-sm text-gray-400">No notes found for this website.</p>
      <button
        type="button"
        class="mt-2 text-xs font-semibold text-amber-300 hover:text-amber-200"
        @click="createNote"
      >
        + Create note for {{ availableSites.find(s => s.site_key === selectedSiteFilter)?.site_name || 'this site' }}
      </button>
    </div>

    <!-- Notes Masonry Grid -->
    <div v-else-if="filteredNotes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
      <article
        v-for="note in filteredNotes"
        :key="note.id"
        class="group relative rounded-xl border p-3.5 min-h-32 cursor-pointer transition-all hover:-translate-y-0.5"
        :class="[
          priorityCardClass(note.priority),
          selectedNoteId === note.id ? 'ring-1 ring-white/25' : '',
        ]"
        @click="openNote(note)"
      >
        <div class="flex items-start gap-2.5">
          <img
            :src="getAuthor(note.author_key).avatar"
            :alt="getAuthor(note.author_key).label"
            class="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="text-[10px] font-semibold text-gray-400">{{
                  getAuthor(note.author_key).label
                }}</span>
                <span
                  class="px-1.5 py-0.5 rounded border border-sky-400/20 bg-sky-400/[0.07] text-[8px] font-mono uppercase tracking-wider text-sky-300 truncate"
                  title="Source site"
                >
                  {{ note.site_name }}
                </span>
              </div>
              <button
                type="button"
                class="p-1 rounded transition-colors"
                :class="
                  note.is_pinned
                    ? 'text-amber-300'
                    : 'text-gray-600 opacity-0 group-hover:opacity-100 hover:text-white'
                "
                title="Toggle pin"
                @click.stop="toggleNotePin(note)"
              >
                <Pin class="w-3 h-3" :class="{ 'fill-current': note.is_pinned }" />
              </button>
            </div>
            <h4 class="mt-1 text-sm font-semibold text-white truncate">
              {{ note.title || 'Untitled note' }}
            </h4>
          </div>
        </div>

        <p class="mt-2.5 text-xs leading-5 text-gray-400 line-clamp-3">
          {{ plainText(note.content) || 'Empty note' }}
        </p>

        <div
          v-if="note.attachments.length"
          class="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500"
        >
          <Image
            v-if="note.attachments.some((item) => item.mime_type.startsWith('image/'))"
            class="w-3 h-3"
          />
          <Paperclip class="w-3 h-3" />
          {{ note.attachments.length }} attachment{{ note.attachments.length === 1 ? '' : 's' }}
        </div>

        <div
          class="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-[9px] text-gray-600"
        >
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full" :class="getPriority(note.priority).dot"></span>
            {{ getPriority(note.priority).label }}
          </span>
          <div class="flex items-center gap-2">
            <span>{{ formatUpdatedAt(note.updated_at) }}</span>
            <button
              type="button"
              class="p-1 rounded opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
              title="Delete note"
              @click.stop="deleteNote(note.id)"
            >
              <Trash2 class="w-3 h-3" />
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Gemini AI Note Prompt Modal -->
    <NoteAiPrompt
      :is-open="isAiOpen"
      :note="activeNoteContext"
      :selected-text="aiSelectedText"
      :initial-prompt="aiInitialPrompt"
      @close="isAiOpen = false"
      @insert="onAiInsert"
    />
  </section>
</template>

<style scoped>
.note-tool {
  padding: 0.375rem;
  border-radius: 0.375rem;
  color: #6b7280;
  transition:
    color 150ms ease,
    background-color 150ms ease,
    opacity 150ms ease;
}

.note-tool:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.note-tool:disabled {
  opacity: 0.25;
}

.attachment-skeleton {
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0.035) 20%,
    rgba(255, 255, 255, 0.11) 38%,
    rgba(255, 255, 255, 0.035) 56%
  );
  background-size: 220% 100%;
  animation: attachment-shimmer 1.25s ease-in-out infinite;
}

@keyframes attachment-shimmer {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -120% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .attachment-skeleton {
    animation: none;
  }
}
</style>
