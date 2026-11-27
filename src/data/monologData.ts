import type { ScreenPreviewMode } from '@/components/monolog/MonologScreenPreview.vue'

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
    caption: 'Paper (pearl-white with subtle aurora corners) and Ink AMOLED (#08090B) share one borderless layout across all controls.',
  },
  {
    id: 'vox',
    label: 'VOX Voice Mode',
    layout: 'live',
    caption: 'Speak through natural pauses. Review punctuation and Smart Filter cleanup before inserting your words.',
  },
  {
    id: 'ai',
    label: 'AI Ask in Place',
    layout: 'live',
    caption: 'Search your personal journal or toggle Web answers, check cited sources, and insert directly into your draft.',
  },
  {
    id: 'ink',
    label: 'All 6 Keyboard Themes',
    layout: 'live',
    caption: 'Go borderless or enable frosted key borders, pick Paper, Ink, Iris, Ocean, Terracotta, or Photo, and switch one-handed layouts.',
  },
  {
    id: 'privacy',
    label: 'Privacy & Incognito',
    layout: 'live',
    caption: 'Choose what gets saved, pause memory with 15m manual incognito, and keep sensitive fields protected automatically.',
  },
  {
    id: 'shortcuts',
    label: 'm Key & Quick Shortcuts',
    layout: 'live',
    caption: 'Open the m key menu for Reminder, Alarm, Journal, and + Save a note — always reviewed by you first.',
  },
  {
    id: 'flow',
    label: 'Journal & Context Library',
    layout: 'live',
    caption: 'Today dashboard, reverse-chronological Journal (Timeline · Calendar · Gallery), Context Library, and Narrative Nostalgia November.',
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
    title: 'Everyday Typing',
    tag: '6 THEMES · BORDERLESS & KEY-BORDERED',
    subtitle: 'Familiar keys first, a whole new feeling',
    desc: 'Go borderless or enable frosted key borders across Paper, Ink, Iris, Ocean, Terracotta, and Photo, with optional clipboard history (1h auto-expiry) and one-handed Left/Right placement.',
    previewMode: 'ink',
    defaultVariant: 'paper',
    altVariant: 'ink',
    altLabel: 'Ink AMOLED',
  },
  {
    num: '02',
    title: 'VOX Voice Typing',
    tag: 'LESS THUMB · MORE YOU',
    subtitle: 'Speak the way you think',
    desc: 'Hold the mic to open VOX. Speak through natural pauses, strip filler words with Smart Filter, switch English, English (India), Hindi, or Spanish, and review your transcript before inserting.',
    previewMode: 'vox',
    defaultVariant: 'default',
  },
  {
    num: '03',
    title: 'AI Ask in Place',
    tag: 'HOLD SPACEBAR · PERSONAL + WEB',
    subtitle: 'Keep the chat. Find the answer.',
    desc: 'Ask, search, rewrite, or follow a thought right above your keyboard. Toggle Personal journal memory or Web answers, inspect cited sources, and insert directly into your draft.',
    previewMode: 'ai',
    defaultVariant: 'paper',
    altVariant: 'ink',
    altLabel: 'Ink AMOLED',
  },
  {
    num: '04',
    title: 'Quick Shortcuts & m Key',
    tag: 'FROM “I SHOULD” TO “IT’S DONE”',
    subtitle: 'A reminder, an alarm, a note for later',
    desc: 'Open the m key menu for Reminder, Alarm, Journal, and + Save a note — or catch inline suggestions like “Set 5:00 PM reminder” right as you type. You review. You decide.',
    previewMode: 'shortcuts',
    defaultVariant: 'menu',
    altVariant: 'reminder',
    altLabel: 'Inline Reminder',
  },
  {
    num: '05',
    title: 'Your Journal & Context Library',
    tag: 'TODAY · TIMELINE · CONTEXT LIBRARY',
    subtitle: 'Your day. In your words.',
    desc: 'Brings together consented drafts, photos, screenshots with local ML Kit OCR, and spoken voice notes with waveforms into Today, Timeline, Calendar, Gallery, and Narrative Nostalgia November.',
    previewMode: 'flow',
    defaultVariant: 'today',
    altVariant: 'timeline',
    altLabel: 'Journal Timeline',
  },
]

export const THREE_NEEDS = [
  {
    need: 'Speak',
    experience: 'VOX voice typing — Less thumb. More you.',
    outcome: 'Turn spoken thoughts into clear, naturally punctuated words, right where you’re writing.',
  },
  {
    need: 'Ask',
    experience: 'AI Ask · Floating panel — Keep the chat. Find the answer.',
    outcome: 'Search personal memories or cited web answers directly above your keyboard.',
  },
  {
    need: 'Act & Remember',
    experience: 'Quick shortcuts, Journal & Context Library',
    outcome: 'Catch reminders while they’re still in the conversation, then revisit your side of the day anytime.',
  },
]

export const PRIVACY_STATES = [
  {
    num: '01',
    state: 'Memory Off',
    capture: 'Zero drafts or typing saved',
    aiBehavior: 'Explicit local or opt-in requests only',
    uiCue: 'Clean baseline keyboard + Settings control',
  },
  {
    num: '02',
    state: 'On Your Terms (Memory On)',
    capture: 'Memory starts with your consent — review, edit, export or delete anytime',
    aiBehavior: 'Local typing suggestions, writing help & journal search stay on-device',
    uiCue: 'Active theme + encrypted SQLite Room storage',
  },
  {
    num: '03',
    state: 'Pause Whenever (Manual Incognito)',
    capture: 'Hold the period key or toggle Incognito to pause capture (15:00 default)',
    aiBehavior: 'Private typing is never silently saved or processed',
    uiCue: 'Incognito strip + countdown timer + glowing period icon',
  },
  {
    num: '04',
    state: 'Local & Protected Fields',
    capture: 'Automatic boundary on passwords, PINs, and sensitive banking logins (e.g. pine-bank.example)',
    aiBehavior: 'Voice, AI Ask & m key paused automatically while protected input is focused',
    uiCue: '“Incognito · Memory paused for this field”',
  },
]

export const JOURNAL_BENEFITS = [
  {
    title: 'Zero-Friction Reflection',
    tag: 'Effortless habit',
    desc: 'No blank-page guilt. As you type messages, take voice notes on your commute, and save screenshots, Monolog organizes your consensual highlights into a calm reflection.',
  },
  {
    title: 'Conversational Recall',
    tag: 'Your second brain',
    desc: 'Ask your memories in plain language: “Where was that cafe I visited with Sam?” or “What did I plan for Sunday?” Search your saved memories with on-device AI.',
  },
  {
    title: 'Emotional Grounding',
    tag: 'Mindful living',
    desc: 'Reconnect with quiet moments that usually vanish in the weekly rush — an encouraging chat, a coffee walk, or a small breakthrough at work.',
  },
  {
    title: 'Private by Design',
    tag: '100% on-device',
    desc: 'Your journal is stored on your phone. You can review, edit, or delete what you save at any time.',
  },
]

export const SITE_FEATURES_GRID = [
  { title: 'Everyday typing', desc: 'Go borderless or enable frosted key borders, pick Paper, Ink, Iris, Ocean, Terracotta, or Photo, and switch one-handed layouts.' },
  { title: 'VOX voice typing', desc: 'Speak through natural pauses. Review punctuation and Smart Filter cleanup before inserting your words.' },
  { title: 'Rewrite with control', desc: 'Pick Polish, Shorten, Friendly, or Professional, review the change, and keep the phrasing that sounds like you.' },
  { title: 'AI Ask in place', desc: 'Search your personal journal or toggle Web answers, check cited sources, and insert directly into your draft.' },
  { title: 'Quick shortcuts', desc: 'Open the m key menu to act on a plan or save a thought (Reminder, Alarm, Journal, + Save a note).' },
  { title: 'One Context Library', desc: 'Give saved screenshots, photos, text, and Audio Notes one searchable home.' },
  { title: 'Remember your side', desc: 'Find the source of a small detail and review a monthly story before sharing it.' },
  { title: 'Privacy by choice', desc: 'Choose what gets saved, pause memory with incognito, and keep sensitive fields protected.' },
]

export const PRICING_DATA = {
  eyebrow: 'Room to start. Space to grow.',
  title: 'A little more. On your terms.',
  subtitle: 'The essentials stay free. Pro gives your voice, words and memories a little more room.',
  footnote: 'Proposed launch pricing. Final allowances and release availability will be confirmed before launch.',
  free: {
    name: 'Monolog Free',
    price: '₹0',
    period: 'to get started',
    desc: 'Your everyday keyboard. Your personal journal. Your privacy, always included.',
    features: [
      'Paper, Ink, Iris, Ocean, Terracotta & Photo themes + key borders',
      'Local journals and basic memory search',
      'Basic voice typing and writing help',
      'VOX and on-device writing assistance',
      'Incognito, encryption and data controls',
    ],
    cta: 'Keep me in the loop',
  },
  pro: {
    name: 'Monolog Pro',
    badge: 'A little extra possibility',
    monthlyReferencePrice: '₹599',
    monthlyPrice: '₹299',
    monthlyPeriod: 'per month',
    monthlyNote: 'Individual Pro pilot price.',
    yearlyPrice: '₹3,372',
    yearlyPeriod: 'per year',
    yearlyNote: '₹281/month, billed yearly. Save ₹216 versus 12 months at the pilot rate.',
    discountTag: '−6%',
    desc: 'Expanded VOX, writing tools, natural-language AI Ask search, and richer monthly recaps.',
    features: [
      'Expanded VOX and writing tools',
      'Rewrites, tone changes and saved styles',
      'AI Ask natural-language memory & web search',
      'Richer recaps and formatted exports',
      'Advanced routines and writing assistance',
    ],
    cta: "Let's talk Pro",
  },
  team: {
    name: 'Team Plan',
    price: '₹1,299',
    period: 'per month for 5 Pro seats',
    note: '* Proposed monthly price after the free team pilot.',
    contact: 'mailto:monolog@notokens.co?subject=Monolog%20Customised%20Package',
    cta: 'Contact us for a customised package',
  },
}

export const VERIFIED_CHECKS = [
  { metric: 'Android 15', label: 'ARM64 debug APK built' },
  { metric: '53 / 53', label: 'Unit tests passed on build' },
  { metric: '16 KB', label: 'ZIP alignment verified' },
  { metric: 'Pending', label: 'Physical-device battery & RAM testing' },
]

export const TECH_STACK = [
  {
    category: 'ANDROID APP & IME',
    title: 'Kotlin, Jetpack Compose & IME',
    desc: 'Android 12+ InputMethodService and companion Compose app (Today · Journal · Context Library) with WorkManager background scheduling.',
  },
  {
    category: 'ON-DEVICE AI ENGINE',
    title: 'Gemma 3 270M IT & LiteRT-LM',
    desc: 'On-device writing suggestions, rewrites, and local journal assistance via TF Lite / LiteRT-LM with downloaded voice/model packs.',
  },
  {
    category: 'LOCAL MEMORY & SECURITY',
    title: 'SQLite Room + Keystore AES-256',
    desc: 'Hardware-backed encryption keeps drafts, journals, notes, and reminders on your phone. ML Kit usage diagnostics upload is disabled.',
  },
  {
    category: 'VISION & VOICE',
    title: 'ML Kit OCR, Speech & Accessibility',
    desc: 'On-device ML Kit text recognition extracts readable text from screenshots in Context Library while Quick Capture respects protected fields.',
  },
  {
    category: 'ONLINE SEARCH (OPT-IN)',
    title: 'Wikipedia & External Intents',
    desc: 'When you request web results in AI Ask, Monolog queries Wikipedia or configured web providers with citations; typing/journals never train models.',
  },
  {
    category: 'WEATHER & DRIVE BACKUP',
    title: 'MET Norway + Google Drive App Data',
    desc: 'Rounded location coordinates query MET Norway weather forecasts when enabled. Optional Drive backup encrypts journal content on-device first.',
  },
]

export const FAQ_ITEMS = [
  {
    q: 'How does Monolog differ from its competitors?',
    a: 'Monolog connects your keyboard, voice input, AI assistance and personal journal in one experience. It helps you communicate and act in the app you’re already using, then revisit the thoughts and context you choose to keep — your side of the day.',
  },
  {
    q: 'What gets added to my journal?',
    a: 'Memory capture requires your consent. Eligible, non-sensitive input and the notes, screenshots or voice notes you choose to save can contribute to your journal. You can review, edit and delete entries. A typed draft does not prove that a message was sent or an event happened.',
  },
  {
    q: 'Does it read other people’s messages?',
    a: 'Monolog’s keyboard works with the text you type or dictate and has no direct access to incoming messages. With Android’s permission, you can separately choose to save screen context, subject to the app’s restrictions.',
  },
  {
    q: 'Can I use it offline?',
    a: 'Everyday typing, local journals and basic search are designed to work offline. Voice recognition and local AI depend on device support. Web results, downloads and optional backup require an internet connection.',
  },
  {
    q: 'When can I get Monolog?',
    a: 'Monolog is in development. This website is an interactive product preview; the keyboard, journal and AI features shown describe the intended product. Join the waitlist at monolog.notokens.co/#waitlist for Android launch updates.',
  },
]
