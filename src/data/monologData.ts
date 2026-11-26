export type KeyboardThemeId = 'paper' | 'ink' | 'iris' | 'ocean' | 'terracotta' | 'photo'

export interface ThemeOption {
  id: KeyboardThemeId
  label: string
  swatch: string
  isDark: boolean
}

export const KEYBOARD_THEMES: ThemeOption[] = [
  {
    id: 'paper',
    label: 'Paper',
    swatch: 'linear-gradient(135deg, #ffffff 30%, #dce8f7 70%, #f2eafe 100%)',
    isDark: false,
  },
  {
    id: 'ink',
    label: 'Ink',
    swatch: 'linear-gradient(135deg, #08090b 35%, #2a223b 100%)',
    isDark: true,
  },
  {
    id: 'iris',
    label: 'Iris',
    swatch: 'linear-gradient(135deg, #eef0fc 25%, #c5cbe8 100%)',
    isDark: false,
  },
  {
    id: 'ocean',
    label: 'Ocean',
    swatch: 'linear-gradient(135deg, #e8f5f2 25%, #8ecfd6 100%)',
    isDark: false,
  },
  {
    id: 'terracotta',
    label: 'Terracotta',
    swatch: 'linear-gradient(135deg, #fff1e5 25%, #f3cfc5 100%)',
    isDark: false,
  },
  {
    id: 'photo',
    label: 'Photo',
    swatch: 'linear-gradient(135deg, #212636 20%, #8b5cf6 100%)',
    isDark: true,
  },
]

export const EXTERNAL_LINKS = {
  showcase: 'https://monolog.notokens.co/',
  demo: 'https://monolog.notokens.co/demo',
  monologWeb: 'https://web.monolog.notokens.co/',
  waitlist: 'https://monolog.notokens.co/#waitlist',
  privacyLive: 'https://monolog.notokens.co/privacy',
  tosLive: 'https://monolog.notokens.co/tos',
  buildathon: 'https://startupbuildathon.com/',
  deckPdf: '/monolog/Monolog%20-%20Startup%20Buildathon%20Final%20Prototype%20Submission.pdf',
  email: 'mailto:monolog@notokens.co',
}

import type { ScreenPreviewMode } from '@/components/monolog/MonologScreenPreview.vue'

export interface PreviewBoardTab {
  id: ScreenPreviewMode | 'artwork'
  label: string
  caption: string
  layout: 'live' | 'artwork'
}

export const PREVIEW_TABS: PreviewBoardTab[] = [
  {
    id: 'dual',
    label: 'Paper & Ink Dual System',
    layout: 'live',
    caption: 'Interactive dual-theme keyboard: Paper (pearl-white with subtle aurora corners) and Ink AMOLED (#08090B) sharing one borderless layout.',
  },
  {
    id: 'vox',
    label: 'Vox Voice Mode',
    layout: 'live',
    caption: 'Live Vox dictation canvas: press Play dictation to watch Smart Filter clean fillers (“uh”) in real time, toggle languages, and insert.',
  },
  {
    id: 'ai',
    label: 'AI Ask Panel',
    layout: 'live',
    caption: 'Interactive AI Ask panel floating above the keys: toggle Personal memory or Wikipedia web search, pick questions, and insert cited answers.',
  },
  {
    id: 'ink',
    label: 'All 6 Keyboard Themes',
    layout: 'live',
    caption: 'Switch between Paper, Ink AMOLED, Iris, Ocean, Terracotta, and Photo themes with borderless or frosted keys and one-handed Left/Right layouts.',
  },
  {
    id: 'privacy',
    label: 'Protected Field · Banking',
    layout: 'live',
    caption: 'Automatic protection engages on passwords, PINs, and banking fields (Pine Bank): capture pauses, m key locks, and manual Incognito stays 1 tap away.',
  },
  {
    id: 'shortcuts',
    label: 'm Key & Reminders',
    layout: 'live',
    caption: 'Interactive Quick Shortcuts (Reminder, Alarm, Journal, Save a note) alongside the contextual inline “Set 5:00 PM reminder” confirmation flow.',
  },
  {
    id: 'flow',
    label: 'Today · Journal · Library (1–4)',
    layout: 'live',
    caption: 'Live 4-screen companion walkthrough: Today dashboard (MET Norway weather), Journal timeline, Context Library (OCR & playable voice note), and NNN Recap.',
  },
  {
    id: 'artwork',
    label: '3D Key Sculptures',
    layout: 'artwork',
    caption: 'Original ceramic key constellation and memory-unfolding key sculptures created for Monolog.',
  },
]

export const ARTWORK_SCREENS = [
  {
    title: 'Key Constellation · Hero Sculpture',
    sub: 'Tactile ceramic and crystal key arrangement for Monolog’s expressive input identity.',
    image: '/monolog/artwork/key-constellation.webp',
  },
  {
    title: 'Memory Unfolding · Journal Key',
    sub: 'A single keyboard key unfolding into delicate journal pages — used on the Photo theme & Journal intro.',
    image: '/monolog/artwork/memory-unfolding.webp',
  },
]

export interface PillarItem {
  num: string
  title: string
  tag: string
  subtitle: string
  desc: string
  previewMode: ScreenPreviewMode
  defaultVariant?: string
  altVariant?: string
  altLabel?: string
}

export const FIVE_PILLARS: PillarItem[] = [
  {
    num: '01',
    title: 'Everyday Keyboard',
    tag: '6 THEMES · BORDERLESS & KEY-BORDERED',
    subtitle: 'Familiar keys first, customizable without clutter',
    desc: 'Fast QWERTY typing across Paper, Ink, Iris, Ocean, Terracotta, and Photo themes. Choose borderless keys by default or frosted key borders, clipboard history (1h auto-expiry), and one-handed Left/Right layouts.',
    previewMode: 'ink',
    defaultVariant: 'paper',
    altVariant: 'ink',
    altLabel: 'Ink AMOLED',
  },
  {
    num: '02',
    title: 'Vox Voice Typing',
    tag: 'HOLD MIC · SMART FILTER',
    subtitle: 'Sustained hands-free speech that pauses with you',
    desc: 'Hold the toolbar microphone to open the docked Vox surface. Pause-tolerant recognition cleans punctuation, strips fillers (“uh”, “umm”) with Smart Filter, and supports English, English (India), Hindi, and Spanish — keeping drafts editable.',
    previewMode: 'vox',
    defaultVariant: 'default',
  },
  {
    num: '03',
    title: 'Floating AI Ask Panel',
    tag: 'HOLD SPACEBAR · GEMINI 1.5 FLASH (OPT-IN)',
    subtitle: 'Search your memory or cite the web without leaving chat',
    desc: 'Long-press the lightning spacebar to summon AI Ask directly above your keyboard. Query your encrypted personal journal locally, toggle Web Search for cited answers, or refine drafts before choosing Insert answer.',
    previewMode: 'ai',
    defaultVariant: 'paper',
    altVariant: 'ink',
    altLabel: 'Ink AMOLED',
  },
  {
    num: '04',
    title: 'Context Engine & Quick Shortcuts',
    tag: 'THE LOWERCASE m KEY · ML KIT OCR',
    subtitle: 'Capture the visible screen or trigger verified phone intents',
    desc: 'Tap m to capture, crop/redact, and attach a text or voice note into Context Library. Hold m for Quick Shortcuts — Reminder, Alarm, Journal (opens Monolog), and Save a note. All reminders and alarms require explicit review.',
    previewMode: 'shortcuts',
    defaultVariant: 'menu',
    altVariant: 'reminder',
    altLabel: 'Inline Reminder Pill',
  },
  {
    num: '05',
    title: 'Companion Journal & Memory',
    tag: 'TODAY · JOURNAL · CONTEXT LIBRARY',
    subtitle: 'Your side of the day, kept privately on your device',
    desc: 'With explicit consent, eligible drafts and captures flow into Today, Journal (Timeline · Calendar · Gallery), and Context Library. Revisit daily timelines and Narrative Nostalgia November recaps with source links.',
    previewMode: 'flow',
    defaultVariant: 'today',
    altVariant: 'timeline',
    altLabel: 'Journal Timeline',
  },
]

export const THREE_NEEDS = [
  {
    need: 'Express',
    experience: 'Familiar typing, Vox voice input, grammar & rewriting',
    outcome: 'Communicate naturally and clearly without leaving your app',
  },
  {
    need: 'Act',
    experience: 'Contextual suggestions, AI Ask search, reminders & alarms',
    outcome: 'Complete small tasks without losing the current conversation',
  },
  {
    need: 'Remember',
    experience: 'Private journals, saved context, daily summaries & monthly recaps',
    outcome: 'Retrieve details and revisit your side of the day anytime',
  },
]

export const PRIVACY_STATES = [
  {
    num: '01',
    state: 'Memory Off',
    capture: 'Zero keystrokes or drafts saved',
    aiBehavior: 'Explicit local or opt-in requests only',
    uiCue: 'Clean baseline keyboard + Settings link',
  },
  {
    num: '02',
    state: 'Memory On',
    capture: 'Consented, eligible drafts only → encrypted SQLite Room DB (AES-256-GCM TEE/StrongBox)',
    aiBehavior: 'Local Gemma assistance; explicit selected-context cloud queries',
    uiCue: 'Active theme + discoverable memory status',
  },
  {
    num: '03',
    state: 'Manual Incognito',
    capture: 'Capture & learning paused (15 min default, configurable in Settings)',
    aiBehavior: 'Private typing is never silently processed',
    uiCue: 'Incognito strip + countdown timer + active period icon',
  },
  {
    num: '04',
    state: 'Protected Input',
    capture: 'Automatic bypass on passwords, PINs, OTPs & excluded apps (e.g. banking logins)',
    aiBehavior: 'Voice, AI Ask & m key locked; cannot expire while field is active',
    uiCue: '“Incognito is on · Automatic · Memory paused for this field”',
  },
]

export const VERIFIED_CHECKS = [
  { metric: 'Android 15', label: 'ARM64 debug APK built' },
  { metric: '53 / 53', label: 'Unit tests passed on build' },
  { metric: '16 KB', label: 'ZIP alignment verified' },
  { metric: 'Pending', label: 'Field latency, battery & RAM testing' },
]

export const TECH_STACK = [
  {
    category: 'ANDROID APP & IME',
    title: 'Kotlin, Jetpack Compose & IME',
    desc: 'Native Android 12+ InputMethodService and companion Compose app (Today · Journal · Library) with WorkManager scheduled tasks.',
  },
  {
    category: 'ON-DEVICE AI ENGINE',
    title: 'Gemma 3 270M IT & LiteRT-LM',
    desc: 'Local writing assistance, punctuation polish, and question previews via TF Lite / LiteRT-LM (weights download separately on supported phones; Gemini Nano is future evaluation).',
  },
  {
    category: 'LOCAL MEMORY & SECURITY',
    title: 'SQLite Room + Keystore AES-256',
    desc: 'Hardware-backed AES-256-GCM keys (TEE/StrongBox) protect Room records, saved notes, and media. Usage/performance diagnostics uploads are disabled in ML Kit SDK components.',
  },
  {
    category: 'VISION & SPEECH',
    title: 'ML Kit OCR, Speech & Accessibility',
    desc: 'On-device ML Kit text recognition, image labels, and object detection extract searchable evidence from screenshots; permission-gated Quick Capture respects protected screens.',
  },
  {
    category: 'CLOUD AI & SEARCH (OPT-IN)',
    title: 'Firebase AI Logic + Gemini 1.5 Flash',
    desc: 'Explicit user triggers send only the active question & selected context. Web search queries route to Wikipedia or configured providers with source citations.',
  },
  {
    category: 'WEATHER & ENCRYPTED BACKUP',
    title: 'MET Norway + Drive API v3',
    desc: 'Rounded coordinates query MET Norway forecasts while Android resolves place names. Optional Credential Manager + Drive appDataFolder sync uses client-side recovery keys.',
  },
]

export const FAQ_ITEMS = [
  {
    q: 'How does Monolog differ from its competitors?',
    a: 'Monolog connects your keyboard, voice input, AI assistance, and personal journal in one experience. It helps you communicate and act in the app you’re already using, then revisit the thoughts and context you choose to keep — your side of the day.',
  },
  {
    q: 'What gets added to my journal?',
    a: 'Memory capture requires your consent. Eligible, non-sensitive drafts and the notes, screenshots, or voice notes you choose to save can contribute to your journal. You can review, edit, and delete entries at any time — and a typed draft never proves a message was sent or an event occurred.',
  },
  {
    q: 'Does it read other people’s messages?',
    a: 'No. Monolog’s keyboard works strictly with the text you type or dictate and has no direct access to incoming messages from another person. With Android’s permission, you can separately choose to save a screen capture, subject to app restrictions.',
  },
  {
    q: 'Can I use it offline?',
    a: 'Everyday typing, local journals, and basic memory search are designed to work offline. Voice recognition and local AI (Gemma via LiteRT-LM) depend on device support and downloaded models. Web results, downloads, MET Norway weather, and optional Drive backup require internet access.',
  },
  {
    q: 'When can I get Monolog?',
    a: 'Monolog is in active development following the Android 15 ARM64 prototype build (53 unit tests verified). This showcase previews the intended product experience — join the launch waitlist at monolog.notokens.co/#waitlist for Android rollout updates.',
  },
]
