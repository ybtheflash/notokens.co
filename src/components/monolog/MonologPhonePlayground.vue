<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  Shield,
  Zap,
  Search,
  X,
  EyeOff,
  Mic,
  ChevronDown,
  Clock,
  Bell,
  BookOpen,
  Smile,
  Globe,
  Lock,
  Sparkles,
  Plus,
  RotateCcw,
  Play,
  Pause,
} from 'lucide-vue-next'
import { KEYBOARD_THEMES, type KeyboardThemeId } from '@/data/monologData'

type PrivacyMode = 'off' | 'manual' | 'protected'
type LayoutMode = 'full' | 'left' | 'right'

const theme = ref<KeyboardThemeId>('ink')
const keyBorders = ref(false)
const layoutMode = ref<LayoutMode>('full')
const privacyMode = ref<PrivacyMode>('off')
const isShifted = ref(false)
const isSymbols = ref(false)

// 3D rotation & flip state
const phoneSide = ref<'front' | 'rear'>('front')
const phoneYaw = ref(-6)
const phonePitch = ref(2)
const isDraggingPhone = ref(false)
let dragStart = { x: 0, y: 0, yaw: -6, pitch: 2 }

const flipPhone = () => {
  autoplayEnabled.value = false
  if (phoneSide.value === 'front') {
    phoneSide.value = 'rear'
    phoneYaw.value = 180
    phonePitch.value = 2
  } else {
    phoneSide.value = 'front'
    phoneYaw.value = -6
    phonePitch.value = 2
  }
}

const onStagePointerDown = (e: PointerEvent) => {
  const target = e.target as HTMLElement | null
  if (!e.isPrimary || e.button !== 0 || target?.closest('button, input, textarea, a')) return
  isDraggingPhone.value = true
  dragStart = { x: e.clientX, y: e.clientY, yaw: phoneYaw.value, pitch: phonePitch.value }
  ;(e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId)
}

const onStagePointerMove = (e: PointerEvent) => {
  if (!isDraggingPhone.value) return
  const dx = e.clientX - dragStart.x
  const dy = e.clientY - dragStart.y
  const nextYaw = dragStart.yaw + dx * 0.45
  const baseYaw = phoneSide.value === 'rear' ? 180 : 0
  phoneYaw.value = Math.max(baseYaw - 32, Math.min(baseYaw + 32, nextYaw))
  phonePitch.value = Math.max(-14, Math.min(14, dragStart.pitch - dy * 0.25))
}

const onStagePointerUp = () => {
  if (!isDraggingPhone.value) return
  isDraggingPhone.value = false
}

const onRearLogoClick = () => {
  theme.value = theme.value === 'ink' ? 'paper' : 'ink'
  showToast(`Switched finish to ${theme.value === 'ink' ? 'Ink AMOLED' : 'Paper'}`)
}

const messages = ref([
  { id: 1, from: 'them', text: 'Did you check the timetable?' },
  { id: 2, from: 'me', text: 'Yes, just checked.' },
])

const activeInputText = ref("let's meet at the library at 5 pm")
const activePanel = ref<'none' | 'ai' | 'vox' | 'shortcuts' | 'note'>('none')
const quickNoteText = ref('')
const toastMessage = ref<string | null>(null)
let toastTimer: number | null = null

// Vox voice simulation state
const smartFilter = ref(true)
const voxPaused = ref(false)
const voxLangIndex = ref(0)
const voxLanguages = ['English', 'English (India)', 'Hindi', 'Spanish']
const voxRaw = 'I’ll take the, uh, bus and be there by four.'
const voxClean = 'I’ll take the bus and be there by four.'

// AI Ask simulation state
const aiQuery = ref('When does the study room close?')
const aiPersonal = ref(true)
const aiWeb = ref(false)
const aiSamples = [
  {
    key: 'library',
    prompt: 'Study room hours?',
    query: 'When does the study room close?',
    answer: 'The study room closes at 8:00 PM. Last entry is at 7:30 PM.',
    source: 'Sample source · Riverside Library hours',
  },
  {
    key: 'coffee',
    prompt: 'Coffee with Sam?',
    query: 'What did I note about coffee with Sam?',
    answer: 'Coffee with Sam is saved in your journal entry for 15 November.',
    source: 'Personal memory · 15 November',
  },
  {
    key: 'hotel',
    prompt: 'Hotel check-in?',
    query: 'Hotel Namba check-in time',
    answer: 'Check-in at Hotel Namba is at 3:00 PM (HND → ITM screenshot).',
    source: 'Context Library · OCR extraction',
  },
]

const showToast = (msg: string) => {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toastMessage.value = null
  }, 3200)
}

const isPrivate = computed(() => privacyMode.value !== 'off')

const setPrivacy = (mode: PrivacyMode) => {
  privacyMode.value = mode
  if (mode !== 'off') {
    activePanel.value = 'none'
    showToast(
      mode === 'protected'
        ? 'Protected input (Pine Bank) · Memory paused for this field'
        : 'Manual incognito active · Pauses memory capture for 15:00'
    )
  } else {
    showToast('Memory on · Consented drafts encrypted locally')
  }
}

const letterRows = [
  [
    { k: 'q', sub: '1' },
    { k: 'w', sub: '2' },
    { k: 'e', sub: '3' },
    { k: 'r', sub: '4' },
    { k: 't', sub: '5' },
    { k: 'y', sub: '6' },
    { k: 'u', sub: '7' },
    { k: 'i', sub: '8' },
    { k: 'o', sub: '9' },
    { k: 'p', sub: '0' },
  ],
  [
    { k: 'a', sub: '@' },
    { k: 's', sub: '#' },
    { k: 'd', sub: '£' },
    { k: 'f', sub: '_' },
    { k: 'g', sub: '&' },
    { k: 'h', sub: '-' },
    { k: 'j', sub: '+' },
    { k: 'k', sub: '(' },
    { k: 'l', sub: ')' },
  ],
  [
    { k: 'z', sub: '*' },
    { k: 'x', sub: '"' },
    { k: 'c', sub: "'" },
    { k: 'v', sub: ':' },
    { k: 'b', sub: ';' },
    { k: 'n', sub: '!' },
    { k: 'm', sub: '?' },
  ],
]

const symbolRows = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((k) => ({ k, sub: '' })),
  ['@', '#', '$', '%', '&', '-', '+', '(', ')'].map((k) => ({ k, sub: '' })),
  ['*', '"', "'", ':', ';', '!', '?'].map((k) => ({ k, sub: '' })),
]

const visibleRows = computed(() => (isSymbols.value ? symbolRows : letterRows))

const suggestionChip = computed(() => {
  if (privacyMode.value === 'protected') return { kind: 'privacy', label: 'Memory paused · Protected' }
  if (privacyMode.value === 'manual') return { kind: 'privacy', label: 'Memory paused · Incognito' }
  const txt = activeInputText.value.trim()
  if (/\b(exam|5\s*pm|remind|alarm|meeting)\b/i.test(txt)) {
    return { kind: 'reminder', label: 'Set 5 PM reminder' }
  }
  if (txt.length >= 10 && (/^[a-z]/.test(txt) || !/[.!?]$/.test(txt))) {
    return { kind: 'rewrite', label: 'Rewrite this draft' }
  }
  return { kind: 'ai', label: 'Ask' }
})

const polishDraft = () => {
  if (isPrivate.value) return
  let txt = activeInputText.value.trim()
  if (!txt) {
    txt = 'Let’s meet at the library at 5 PM.'
  } else {
    txt = txt
      .replace(/\blets\b/gi, "let's")
      .replace(/\bim\b/gi, "I'm")
      .replace(/\bi\b/g, 'I')
    txt = txt.charAt(0).toUpperCase() + txt.slice(1)
    if (!/[.!?]$/.test(txt)) txt += '.'
  }
  activeInputText.value = txt
  showToast('Draft polished locally · Punctuation & capitalization checked')
}

const onSuggestionClick = () => {
  const kind = suggestionChip.value.kind
  if (kind === 'privacy') return
  if (kind === 'rewrite') polishDraft()
  else if (kind === 'reminder') showToast('Preview reminder: 5:00 PM today · Requires your confirmation')
  else activePanel.value = activePanel.value === 'ai' ? 'none' : 'ai'
}

const tapKey = (char: string) => {
  const out = !isSymbols.value && isShifted.value ? char.toUpperCase() : char
  activeInputText.value += out
  if (isShifted.value) isShifted.value = false
}

const sendChat = () => {
  const txt = activeInputText.value.trim()
  if (!txt) return
  messages.value.push({ id: Date.now(), from: 'me', text: txt })
  activeInputText.value = ''
  showToast(
    isPrivate.value
      ? 'Sent cleanly · Private field bypassed memory'
      : 'Message placed in demo thread · Eligible draft noted'
  )
}

const matchedAiResult = computed(() => {
  const q = aiQuery.value.toLowerCase()
  return (
    aiSamples.find(
      (s) =>
        (q.includes('library') || q.includes('study')) && s.key === 'library'
        || (q.includes('coffee') || q.includes('sam')) && s.key === 'coffee'
        || (q.includes('hotel') || q.includes('namba')) && s.key === 'hotel'
    ) || aiSamples[0]
  )
})

const insertAiAnswer = () => {
  activeInputText.value = matchedAiResult.value.answer
  activePanel.value = 'none'
  showToast('Inserted AI Ask answer into draft')
}

const insertVoxTranscript = () => {
  activeInputText.value = smartFilter.value ? voxClean : voxRaw
  activePanel.value = 'none'
  showToast('Inserted Vox transcript into active field')
}

const saveQuickNote = () => {
  const txt = quickNoteText.value.trim()
  if (!txt) return
  quickNoteText.value = ''
  activePanel.value = 'none'
  showToast(`Saved note locally: “${txt}”`)
}

const toggleShortcuts = () => {
  if (isPrivate.value) {
    showToast('Context key m is locked while memory capture is paused')
    return
  }
  activePanel.value = activePanel.value === 'shortcuts' ? 'none' : 'shortcuts'
}

const selectShortcut = (action: 'Reminder' | 'Alarm' | 'Journal' | 'Note') => {
  if (action === 'Note') {
    activePanel.value = 'note'
    return
  }
  activePanel.value = 'none'
  if (action === 'Reminder') showToast('Reminder preview: Today at 5:00 PM · Review before saving')
  else if (action === 'Alarm') showToast('Alarm preview: 7:00 AM tomorrow · Android Clock ready')
  else showToast('Journal action · Scroll to Companion Journal explorer below')
}

const cycleThemeLabel = computed(() => KEYBOARD_THEMES.find((t) => t.id === theme.value)?.label || 'Paper')

// Guided Autoplay Walkthrough (yields cleanly to user interaction)
const autoplayEnabled = ref(false)
const autoplayStepLabel = ref<string | null>(null)
let autoplayTimer: number | null = null
let autoplayIdx = 0

const stopAutoplay = () => {
  autoplayEnabled.value = false
  autoplayStepLabel.value = null
  if (autoplayTimer) {
    clearTimeout(autoplayTimer)
    autoplayTimer = null
  }
}

const pauseOnUserInteract = () => {
  if (autoplayEnabled.value) stopAutoplay()
}

const autoplayScript: Array<{ delay: number; run: () => void }> = [
  {
    delay: 1400,
    run: () => {
      phoneSide.value = 'front'
      phoneYaw.value = -10
      privacyMode.value = 'off'
      activePanel.value = 'none'
      activeInputText.value = 'lets meet at the library around four'
      autoplayStepLabel.value = 'Step 1 · Natural draft'
    },
  },
  {
    delay: 1500,
    run: () => {
      polishDraft()
      autoplayStepLabel.value = 'Step 2 · Local polish & punctuation'
    },
  },
  {
    delay: 1600,
    run: () => {
      activeInputText.value = 'Exam at 5 PM today'
      autoplayStepLabel.value = 'Step 3 · Contextual 5 PM reminder pill'
    },
  },
  {
    delay: 1600,
    run: () => {
      activePanel.value = 'ai'
      aiQuery.value = 'When does the study room close?'
      autoplayStepLabel.value = 'Step 4 · Floating AI Ask'
    },
  },
  {
    delay: 1900,
    run: () => {
      activePanel.value = 'none'
      setPrivacy('protected')
      phoneYaw.value = 8
      autoplayStepLabel.value = 'Step 5 · Pine Bank Auto-Incognito'
    },
  },
  {
    delay: 1900,
    run: () => {
      setPrivacy('off')
      activePanel.value = 'vox'
      smartFilter.value = true
      phoneYaw.value = -6
      autoplayStepLabel.value = 'Step 6 · Vox Smart Filter voice typing'
    },
  },
  {
    delay: 2000,
    run: () => {
      activePanel.value = 'shortcuts'
      autoplayStepLabel.value = 'Step 7 · Hold m for Quick Shortcuts'
    },
  },
]

const scheduleNextDemoStep = () => {
  if (!autoplayEnabled.value) return
  const step = autoplayScript[autoplayIdx % autoplayScript.length]
  autoplayIdx += 1
  step.run()
  autoplayTimer = window.setTimeout(scheduleNextDemoStep, step.delay)
}

const toggleAutoplay = () => {
  if (autoplayEnabled.value) {
    stopAutoplay()
  } else {
    autoplayEnabled.value = true
    scheduleNextDemoStep()
  }
}

onMounted(() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!reduced) {
    autoplayTimer = window.setTimeout(() => {
      autoplayEnabled.value = true
      scheduleNextDemoStep()
    }, 900)
  }
})

onBeforeUnmount(() => {
  if (autoplayTimer) clearTimeout(autoplayTimer)
})
</script>

<template>
  <div class="playground-wrapper">
    <!-- Controls Bar above Phone -->
    <div class="pg-controls-card" @click.capture="pauseOnUserInteract">
      <div class="pg-control-row">
        <span class="pg-control-label font-mono">6 THEMES</span>
        <div class="theme-pills-wrap" role="group" aria-label="Keyboard themes">
          <button
            v-for="t in KEYBOARD_THEMES"
            :key="t.id"
            class="theme-swatch-btn"
            :class="{ active: theme === t.id }"
            @click="theme = t.id"
          >
            <span class="swatch-dot" :style="{ background: t.swatch }"></span>
            <span>{{ t.label }}</span>
          </button>
        </div>
      </div>

      <div class="pg-control-row pg-row-split">
        <div class="pg-sub-group">
          <span class="pg-control-label font-mono">STYLE</span>
          <button
            class="pg-chip-btn"
            :class="{ active: keyBorders }"
            @click="keyBorders = !keyBorders"
          >
            Key borders: {{ keyBorders ? 'On' : 'Off' }}
          </button>
          <div class="layout-seg" role="group" aria-label="One-handed placement">
            <button
              v-for="mode in (['full', 'left', 'right'] as LayoutMode[])"
              :key="mode"
              class="seg-btn"
              :class="{ active: layoutMode === mode }"
              @click="layoutMode = mode"
            >
              {{ mode }}
            </button>
          </div>
        </div>

        <div class="pg-sub-group">
          <span class="pg-control-label font-mono">PRIVACY</span>
          <button
            class="pg-chip-btn"
            :class="{ active: privacyMode === 'off' }"
            @click="setPrivacy('off')"
          >
            Messages · Sam
          </button>
          <button
            class="pg-chip-btn"
            :class="{ active: privacyMode === 'manual' }"
            @click="setPrivacy('manual')"
          >
            Incognito 15m
          </button>
          <button
            class="pg-chip-btn bank-btn"
            :class="{ active: privacyMode === 'protected' }"
            @click="setPrivacy('protected')"
          >
            <Shield :size="11" />
            <span>Pine Bank</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3D Flip & Guided Walkthrough Toolbar -->
    <div class="pg-3d-toolbar">
      <div class="pg-3d-left">
        <span class="font-mono pg-hint-text">6.7" Interactive Phone · {{ autoplayStepLabel || 'Tap or drag edge to tilt' }}</span>
      </div>
      <div class="pg-3d-actions">
        <button class="pg-3d-btn" :class="{ running: autoplayEnabled }" @click="toggleAutoplay">
          <Pause v-if="autoplayEnabled" :size="11" />
          <Play v-else :size="11" />
          <span>{{ autoplayEnabled ? 'Pause Demo' : 'Play Demo' }}</span>
        </button>
        <button class="pg-3d-btn" @click="flipPhone">
          <RotateCcw :size="11" />
          <span>{{ phoneSide === 'front' ? 'View back' : 'View front' }}</span>
        </button>
      </div>
    </div>

    <!-- Realistic 3D Flippable Smartphone Chassis -->
    <div
      class="phone-3d-stage"
      :class="{ dragging: isDraggingPhone }"
      @pointerdown="onStagePointerDown"
      @pointermove="onStagePointerMove"
      @pointerup="onStagePointerUp"
      @pointercancel="onStagePointerUp"
    >
      <div
        class="phone-3d-body"
        :style="{
          transform: `rotateX(${phonePitch}deg) rotateY(${phoneYaw}deg)`
        }"
      >
        <div
          class="phone-chassis phone-face-front"
          :class="{ 'is-inert': phoneSide === 'rear' }"
          :data-theme="theme"
          :data-borders="String(keyBorders)"
          :data-layout="layoutMode"
          :data-privacy="privacyMode"
          @click.capture="pauseOnUserInteract"
        >
      <!-- Status Bar -->
      <div class="phone-status-bar">
        <span class="status-time">9:41</span>
        <div class="camera-punch-hole"></div>
        <div class="status-right">
          <span class="theme-status-tag font-mono">{{ cycleThemeLabel }}</span>
          <span class="net-tag">5G</span>
          <div class="battery-pill"><div class="battery-fill"></div></div>
        </div>
      </div>

      <!-- Screen A: Host Messages App -->
      <div v-if="privacyMode !== 'protected'" class="host-chat-area">
        <div class="host-chat-head">
          <div class="peer-left">
            <div class="peer-avatar">S</div>
            <div>
              <strong class="peer-name">Sam</strong>
              <small class="peer-sub">Messages · Demo preview</small>
            </div>
          </div>
          <button class="polish-head-btn" @click="polishDraft" title="Polish draft">
            <Sparkles :size="12" />
            <span>Polish</span>
          </button>
        </div>

        <div class="chat-stream">
          <div
            v-for="msg in messages.slice(-2)"
            :key="msg.id"
            class="chat-msg"
            :class="msg.from === 'me' ? 'sent' : 'recv'"
          >
            {{ msg.text }}
          </div>
        </div>

        <div class="host-composer">
          <input
            v-model="activeInputText"
            type="text"
            maxlength="160"
            class="composer-input"
            aria-label="Try typing in Monolog demo"
            placeholder="Type a message..."
          />
          <button class="composer-clear" @click="activeInputText = ''" title="Clear">×</button>
          <button class="composer-send" @click="sendChat" title="Send">↑</button>
        </div>
      </div>

      <!-- Screen B: Protected Input (Pine Bank Password Field) -->
      <div v-else class="host-bank-area">
        <div class="bank-head">
          <Lock :size="13" />
          <strong>Pine Bank · Sign in securely</strong>
        </div>
        <div class="bank-card">
          <div class="bank-field">
            <label>Customer ID</label>
            <div class="bank-val font-mono">•••• 4821</div>
          </div>
          <div class="bank-field is-focused">
            <label>Password (Protected field)</label>
            <div class="bank-val font-mono">
              <span>••••••••••••</span>
              <EyeOff :size="12" />
            </div>
          </div>
          <div class="bank-auto-note">
            <Shield :size="11" />
            <span>Memory paused for this field · Automatic</span>
          </div>
        </div>
      </div>

      <!-- Floating Panel: AI Ask -->
      <Transition name="pop">
        <div v-if="activePanel === 'ai'" class="floating-drawer">
          <div class="drawer-head">
            <div class="drawer-title">
              <Zap :size="12" class="accent-bolt" />
              <span>AI Ask</span>
              <span class="mode-tag">{{ aiWeb ? 'Personal + Web' : 'Personal · Offline' }}</span>
            </div>
            <button class="drawer-close" @click="activePanel = 'none'" aria-label="Close AI Ask">
              <X :size="13" />
            </button>
          </div>

          <div class="ai-input-row">
            <Search :size="12" />
            <input v-model="aiQuery" type="text" class="ai-q-input" aria-label="AI Ask query" />
          </div>

          <div class="ai-toggles-row">
            <button class="mini-pill" :class="{ on: aiPersonal }" @click="aiPersonal = !aiPersonal">
              Personal
            </button>
            <button class="mini-pill" :class="{ on: aiWeb }" @click="aiWeb = !aiWeb">
              {{ aiWeb ? 'Web on (Wikipedia)' : 'Web off' }}
            </button>
            <button
              v-for="s in aiSamples"
              :key="s.key"
              class="mini-pill sample"
              @click="aiQuery = s.query"
            >
              {{ s.prompt }}
            </button>
          </div>

          <div class="ai-answer-card">
            <p class="ai-answer-text">{{ matchedAiResult.answer }}</p>
            <div class="ai-answer-foot">
              <small>{{ matchedAiResult.source }}</small>
              <button class="insert-ans-btn" @click="insertAiAnswer">Insert answer</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Floating Panel: Vox Voice Mode -->
      <Transition name="pop">
        <div v-if="activePanel === 'vox'" class="floating-drawer vox-drawer">
          <div class="drawer-head">
            <div class="drawer-title">
              <Mic :size="12" class="accent-mic" />
              <strong>VOX</strong>
              <span class="mode-tag">{{ voxPaused ? 'Paused' : 'Listening…' }}</span>
            </div>
            <button class="drawer-close" @click="activePanel = 'none'" aria-label="Close Vox">
              <X :size="13" />
            </button>
          </div>

          <div class="vox-wave-row" :class="{ paused: voxPaused }">
            <span v-for="n in 20" :key="n" class="v-bar" :style="{ '--i': n }"></span>
          </div>

          <p class="vox-live-text">“{{ smartFilter ? voxClean : voxRaw }}”</p>
          <span class="vox-subnote">Smart Filter {{ smartFilter ? 'on (strips “uh”)' : 'off (raw)' }} · Pause-tolerant</span>

          <div class="vox-actions-row">
            <button
              class="mini-pill"
              @click="voxLangIndex = (voxLangIndex + 1) % voxLanguages.length"
            >
              {{ voxLanguages[voxLangIndex] }} ⌄
            </button>
            <button class="mini-pill" :class="{ on: smartFilter }" @click="smartFilter = !smartFilter">
              Smart Filter
            </button>
            <button class="mini-pill" @click="voxPaused = !voxPaused">
              {{ voxPaused ? 'Resume' : 'Pause' }}
            </button>
            <button class="insert-ans-btn" @click="insertVoxTranscript">Done</button>
          </div>
        </div>
      </Transition>

      <!-- Floating Panel: Quick Shortcuts (Hold / Tap m) -->
      <Transition name="pop">
        <div v-if="activePanel === 'shortcuts'" class="floating-drawer shortcuts-drawer">
          <div class="drawer-head">
            <div class="drawer-title">
              <strong>Quick shortcuts</strong>
              <span class="mode-tag">From m key</span>
            </div>
            <button class="drawer-close" @click="activePanel = 'none'">
              <X :size="13" />
            </button>
          </div>
          <div class="shortcuts-grid-4">
            <button class="sc-item" @click="selectShortcut('Reminder')">
              <Clock :size="15" />
              <span>Reminder</span>
            </button>
            <button class="sc-item" @click="selectShortcut('Alarm')">
              <Bell :size="15" />
              <span>Alarm</span>
            </button>
            <button class="sc-item" @click="selectShortcut('Journal')">
              <BookOpen :size="15" />
              <span>Journal</span>
            </button>
            <button class="sc-item" @click="selectShortcut('Note')">
              <Plus :size="15" />
              <span>Save a note</span>
            </button>
          </div>
        </div>
      </Transition>

      <!-- Floating Panel: Add Quick Note -->
      <Transition name="pop">
        <div v-if="activePanel === 'note'" class="floating-drawer">
          <div class="drawer-head">
            <div class="drawer-title"><strong>Save note to Context Library</strong></div>
            <button class="drawer-close" @click="activePanel = 'none'">
              <X :size="13" />
            </button>
          </div>
          <textarea
            v-model="quickNoteText"
            rows="2"
            maxlength="140"
            class="quick-note-box"
            placeholder="What would you like to keep?"
          ></textarea>
          <div class="ai-answer-foot">
            <small>Encrypted locally in Room</small>
            <button class="insert-ans-btn" @click="saveQuickNote">Save note</button>
          </div>
        </div>
      </Transition>

      <!-- Toast Feedback -->
      <Transition name="fade">
        <div v-if="toastMessage" class="demo-toast">{{ toastMessage }}</div>
      </Transition>

      <!-- Keyboard Surface -->
      <div class="keyboard-surface">
        <!-- Incognito / Protected Banner Strip -->
        <div v-if="isPrivate" class="incognito-strip">
          <div class="inc-left">
            <svg class="hat-svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 10h20" />
              <path d="M5 10a7 7 0 0 1 14 0" />
              <circle cx="7" cy="16" r="3" />
              <circle cx="17" cy="16" r="3" />
              <path d="M10 16h4" />
            </svg>
            <span>
              {{ privacyMode === 'protected' ? 'Incognito is on · Memory paused for this field' : 'Incognito · Nothing saved' }}
            </span>
          </div>
          <span class="inc-badge font-mono">
            {{ privacyMode === 'protected' ? 'Automatic' : '15:00' }}
          </span>
        </div>

        <!-- Keyboard Toolbar -->
        <div class="kb-toolbar">
          <button
            class="kb-tool-icon"
            title="Toggle tools / dismiss"
            @click="activePanel = 'none'"
          >
            <ChevronDown :size="15" />
          </button>

          <button
            class="kb-suggestion-pill"
            :class="{ disabled: suggestionChip.kind === 'privacy' }"
            @click="onSuggestionClick"
          >
            <Clock v-if="suggestionChip.kind === 'reminder'" :size="12" />
            <Lock v-else-if="suggestionChip.kind === 'privacy'" :size="12" />
            <span>{{ suggestionChip.label }}</span>
          </button>

          <button
            class="kb-tool-icon mic-btn"
            :class="{ active: activePanel === 'vox' }"
            :disabled="isPrivate"
            @click="activePanel = activePanel === 'vox' ? 'none' : 'vox'"
            title="Tap or hold for Vox voice typing"
          >
            <Mic :size="15" />
          </button>

          <button
            class="kb-m-key"
            :class="{ locked: isPrivate, open: activePanel === 'shortcuts' }"
            @click="toggleShortcuts"
            title="Tap or hold m for Quick Shortcuts"
          >
            <img src="/monolog/images/monolog-icon.png" alt="m key" />
            <span v-if="isPrivate" class="m-lock"><Lock :size="8" /></span>
          </button>
        </div>

        <!-- Key Grid (supports Full / Left / Right & Key Borders) -->
        <div class="kb-keys-wrap">
          <div class="kb-row">
            <button
              v-for="item in visibleRows[0]"
              :key="item.k"
              class="kb-key"
              @click="tapKey(item.k)"
            >
              <span v-if="item.sub" class="k-sub">{{ item.sub }}</span>
              <span>{{ !isSymbols && isShifted ? item.k.toUpperCase() : item.k }}</span>
            </button>
          </div>

          <div class="kb-row mid-row">
            <button
              v-for="item in visibleRows[1]"
              :key="item.k"
              class="kb-key"
              @click="tapKey(item.k)"
            >
              <span v-if="item.sub" class="k-sub">{{ item.sub }}</span>
              <span>{{ !isSymbols && isShifted ? item.k.toUpperCase() : item.k }}</span>
            </button>
          </div>

          <div class="kb-row">
            <button
              class="kb-key mod-key"
              :class="{ shifted: isShifted }"
              @click="isShifted = !isShifted"
              aria-label="Shift"
            >
              ↑
            </button>
            <button
              v-for="item in visibleRows[2]"
              :key="item.k"
              class="kb-key"
              @click="tapKey(item.k)"
            >
              <span v-if="item.sub" class="k-sub">{{ item.sub }}</span>
              <span>{{ !isSymbols && isShifted ? item.k.toUpperCase() : item.k }}</span>
            </button>
            <button
              class="kb-key mod-key"
              @click="activeInputText = activeInputText.slice(0, -1)"
              aria-label="Backspace"
            >
              ⌫
            </button>
          </div>

          <div class="kb-row bottom-row">
            <button class="kb-key mod-pill" @click="isSymbols = !isSymbols">
              {{ isSymbols ? 'ABC' : '?123' }}
            </button>
            <button class="kb-key mod-pill icon-pair" title="Emoji & Language" @click="activeInputText += ' '">
              <Smile :size="13" />
              <Globe :size="12" />
            </button>
            <button
              class="kb-spacebar"
              :class="{ 'ai-open': activePanel === 'ai' }"
              @click="isPrivate ? activeInputText += ' ' : (activePanel = activePanel === 'ai' ? 'none' : 'ai')"
              title="Tap for AI Ask or insert space"
            >
              <span>{{ activePanel === 'ai' ? 'AI Ask' : 'English' }}</span>
              <Zap v-if="!isPrivate" :size="11" class="space-bolt" />
            </button>
            <button
              class="kb-key mod-pill incognito-dot-key"
              :class="{ glow: isPrivate }"
              @click="setPrivacy(privacyMode === 'manual' ? 'off' : 'manual')"
              title="Tap or hold period to toggle Incognito"
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 10h20" />
                <path d="M5 10a7 7 0 0 1 14 0" />
                <circle cx="7" cy="16" r="3" />
                <circle cx="17" cy="16" r="3" />
                <path d="M10 16h4" />
              </svg>
              <span class="dot-char">.</span>
            </button>
            <button class="kb-enter" @click="sendChat" aria-label="Enter / Send">↵</button>
          </div>
        </div>

          <div class="home-pill-bar"><span></span></div>
        </div>
        </div>

        <!-- Rear Metal Chassis Face -->
        <div
          class="phone-face-rear"
          :class="[`rear-${theme}`, { 'is-inert': phoneSide === 'front' }]"
          :data-theme="theme"
        >
          <div class="rear-camera-bar">
            <span class="rear-lens"></span>
            <span class="rear-lens"></span>
            <span class="rear-flash"></span>
          </div>

          <button
            class="rear-logo-btn"
            type="button"
            :aria-label="theme === 'ink' ? 'Switch phone to Paper' : 'Switch phone to Ink'"
            @click="onRearLogoClick"
          >
            <img src="/monolog/monolog-logo.svg" alt="Monolog Emblem" class="rear-emblem" />
            <span class="rear-emblem-caption font-mono">Tap m to switch Paper / Ink</span>
          </button>

          <span class="rear-brand-foot font-mono">MONOLOG · NOTOKENS</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground-wrapper {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  align-items: center;
}

.pg-controls-card {
  width: 100%;
  background: rgba(24, 24, 28, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0.65rem 0.8rem;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.pg-control-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pg-row-split {
  justify-content: space-between;
}

.pg-sub-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.pg-control-label {
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: #9ca3af;
  font-weight: 600;
}

.theme-pills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.theme-swatch-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.22rem 0.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
}

.theme-swatch-btn.active {
  border-color: var(--color-accent);
  background: rgba(249, 115, 22, 0.16);
  color: #ffffff;
}

.swatch-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.pg-chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  padding: 0.2rem 0.52rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-size: 0.66rem;
  font-weight: 600;
  cursor: pointer;
}

.pg-chip-btn.active {
  background: #ffffff;
  color: #08090b;
  border-color: #ffffff;
}

.pg-chip-btn.bank-btn.active {
  background: #c084fc;
  border-color: #c084fc;
  color: #08090b;
}

.layout-seg {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 9999px;
  padding: 2px;
}

.seg-btn {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.64rem;
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.15rem 0.42rem;
  border-radius: 9999px;
  cursor: pointer;
}

.seg-btn.active {
  background: rgba(249, 115, 22, 0.28);
  color: #ffedd5;
}

/* ==========================================================================
   PHONE CHASSIS & 6-THEME TOKEN SYSTEM
   ========================================================================== */
.phone-chassis {
  --screen-bg: #ffffff;
  --screen-ink: #151823;
  --screen-muted: #535b6b;
  --bubble-recv: #f1f2f6;
  --bubble-sent: #151823;
  --bubble-sent-ink: #ffffff;
  --kb-bg: radial-gradient(ellipse at 15% 85%, #dce8f7 0%, transparent 58%), radial-gradient(ellipse at 86% 80%, #e8e2f3 0%, transparent 60%), #ffffff;
  --kb-key-bg: rgba(255, 255, 255, 0.88);
  --kb-key-border: rgba(21, 24, 35, 0.09);
  --kb-pill: rgba(21, 24, 35, 0.06);

  width: 100%;
  max-width: 400px;
  border-radius: 40px;
  border: 2px solid rgba(255, 255, 255, 0.18);
  background: var(--screen-bg);
  color: var(--screen-ink);
  padding: 0.9rem 0.9rem 0.65rem;
  box-shadow: 0 28px 75px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  position: relative;
  overflow: hidden;
}

.phone-chassis[data-theme='ink'] {
  --screen-bg: #08090b;
  --screen-ink: #f7f8fc;
  --screen-muted: #b9bfcc;
  --bubble-recv: #1d1e26;
  --bubble-sent: #f7f8fc;
  --bubble-sent-ink: #08090b;
  --kb-bg: radial-gradient(ellipse at 0% 68%, rgba(54, 47, 74, 0.85), transparent 58%), radial-gradient(ellipse at 100% 67%, rgba(69, 42, 59, 0.85), transparent 58%), linear-gradient(145deg, #08090b, #18191d 60%, #25262c);
  --kb-key-bg: rgba(34, 37, 48, 0.9);
  --kb-key-border: rgba(255, 255, 255, 0.14);
  --kb-pill: rgba(255, 255, 255, 0.12);
}

.phone-chassis[data-theme='iris'] {
  --screen-bg: #f6f7fe;
  --screen-ink: #161b2e;
  --screen-muted: #4e5674;
  --bubble-recv: #e6e9fa;
  --bubble-sent: #404f91;
  --bubble-sent-ink: #ffffff;
  --kb-bg: radial-gradient(ellipse at 30% 30%, #dde2fb, transparent 70%), #ececf9;
  --kb-key-bg: rgba(255, 255, 255, 0.86);
  --kb-key-border: rgba(64, 79, 145, 0.14);
  --kb-pill: rgba(64, 79, 145, 0.1);
}

.phone-chassis[data-theme='ocean'] {
  --screen-bg: #eff8f7;
  --screen-ink: #102b33;
  --screen-muted: #3d646e;
  --bubble-recv: #d5eef0;
  --bubble-sent: #185f73;
  --bubble-sent-ink: #ffffff;
  --kb-bg: radial-gradient(ellipse at 40% 35%, #cbe9ed, transparent 70%), #dff2f0;
  --kb-key-bg: rgba(255, 255, 255, 0.86);
  --kb-key-border: rgba(24, 95, 115, 0.14);
  --kb-pill: rgba(24, 95, 115, 0.1);
}

.phone-chassis[data-theme='terracotta'] {
  --screen-bg: #fdf5ef;
  --screen-ink: #2f1b17;
  --screen-muted: #6d4d46;
  --bubble-recv: #f4e2d9;
  --bubble-sent: #863e35;
  --bubble-sent-ink: #ffffff;
  --kb-bg: radial-gradient(ellipse at 14% 22%, rgba(243, 207, 197, 0.85), transparent 58%), linear-gradient(150deg, #fff1e5, #f3cfc5 56%, #efdae9);
  --kb-key-bg: rgba(255, 255, 255, 0.86);
  --kb-key-border: rgba(134, 62, 53, 0.15);
  --kb-pill: rgba(134, 62, 53, 0.1);
}

.phone-chassis[data-theme='photo'] {
  --screen-bg: #121520;
  --screen-ink: #f7f8fc;
  --screen-muted: #cbd2e6;
  --bubble-recv: rgba(34, 38, 56, 0.9);
  --bubble-sent: #c3c9ff;
  --bubble-sent-ink: #121521;
  --kb-bg: linear-gradient(rgba(10, 12, 20, 0.62), rgba(10, 12, 20, 0.62)), url('/monolog/artwork/memory-unfolding.webp') center / cover no-repeat;
  --kb-key-bg: rgba(22, 25, 38, 0.66);
  --kb-key-border: rgba(255, 255, 255, 0.2);
  --kb-pill: rgba(255, 255, 255, 0.14);
}

.phone-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
}

.camera-punch-hole {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #111;
  border: 1.5px solid rgba(128, 128, 128, 0.4);
}

.status-right {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.theme-status-tag {
  font-size: 0.62rem;
  color: var(--screen-muted);
}

.net-tag {
  font-size: 0.66rem;
}

.battery-pill {
  width: 16px;
  height: 9px;
  border: 1px solid currentColor;
  border-radius: 2px;
  padding: 1px;
}

.battery-fill {
  width: 100%;
  height: 100%;
  background: currentColor;
  border-radius: 1px;
}

/* Host App Screens */
.host-chat-area,
.host-bank-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.host-chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.peer-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.peer-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bubble-recv);
  color: var(--screen-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.peer-name {
  display: block;
  font-size: 0.85rem;
  line-height: 1.1;
}

.peer-sub {
  font-size: 0.66rem;
  color: var(--screen-muted);
}

.polish-head-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
  padding: 0.24rem 0.55rem;
  border-radius: 9999px;
  border: 1px solid var(--kb-key-border);
  background: var(--kb-pill);
  color: var(--screen-ink);
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
}

.chat-stream {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.25rem 0;
}

.chat-msg {
  max-width: 82%;
  padding: 0.45rem 0.75rem;
  border-radius: 14px;
  font-size: 0.78rem;
  line-height: 1.35;
}

.chat-msg.recv {
  align-self: flex-start;
  background: var(--bubble-recv);
  color: var(--screen-ink);
  border-bottom-left-radius: 4px;
}

.chat-msg.sent {
  align-self: flex-end;
  background: var(--bubble-sent);
  color: var(--bubble-sent-ink);
  border-bottom-right-radius: 4px;
}

.host-composer {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--bubble-recv);
  border-radius: 9999px;
  padding: 0.28rem 0.32rem 0.28rem 0.75rem;
}

.composer-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--screen-ink);
  font-size: 0.78rem;
  outline: none;
  min-width: 0;
}

.composer-clear {
  border: none;
  background: transparent;
  color: var(--screen-muted);
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0 0.25rem;
}

.composer-send {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: var(--bubble-sent);
  color: var(--bubble-sent-ink);
  font-weight: 700;
  cursor: pointer;
}

/* Pine Bank Protected Field */
.bank-head {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.84rem;
}

.bank-card {
  background: var(--bubble-recv);
  border-radius: 16px;
  padding: 0.7rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.bank-field label {
  display: block;
  font-size: 0.64rem;
  color: var(--screen-muted);
  margin-bottom: 0.15rem;
}

.bank-val {
  background: var(--screen-bg);
  border: 1px solid var(--kb-key-border);
  border-radius: 8px;
  padding: 0.35rem 0.55rem;
  font-size: 0.76rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bank-field.is-focused .bank-val {
  border-color: #7c3aed;
}

.bank-auto-note {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: #7c3aed;
}

/* Floating Drawers (AI Ask / Vox / Quick Shortcuts) */
.floating-drawer {
  background: var(--screen-bg);
  border: 1px solid var(--kb-key-border);
  border-radius: 18px;
  padding: 0.65rem 0.75rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.mode-tag {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--screen-muted);
  background: var(--kb-pill);
  padding: 0.1rem 0.42rem;
  border-radius: 9999px;
}

.drawer-close {
  border: none;
  background: var(--kb-pill);
  color: var(--screen-ink);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ai-input-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bubble-recv);
  border-radius: 10px;
  padding: 0.32rem 0.55rem;
}

.ai-q-input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--screen-ink);
  font-size: 0.74rem;
  outline: none;
}

.ai-toggles-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.mini-pill {
  padding: 0.18rem 0.48rem;
  border-radius: 9999px;
  border: 1px solid var(--kb-key-border);
  background: var(--kb-pill);
  color: var(--screen-ink);
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
}

.mini-pill.on {
  background: var(--bubble-sent);
  color: var(--bubble-sent-ink);
}

.ai-answer-card {
  background: var(--bubble-recv);
  border-radius: 12px;
  padding: 0.5rem 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ai-answer-text {
  font-size: 0.74rem;
  line-height: 1.4;
  margin: 0;
}

.ai-answer-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.ai-answer-foot small {
  font-size: 0.64rem;
  color: var(--screen-muted);
}

.insert-ans-btn {
  border: none;
  border-radius: 9999px;
  background: var(--bubble-sent);
  color: var(--bubble-sent-ink);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.24rem 0.62rem;
  cursor: pointer;
}

/* Vox Drawer */
.vox-wave-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 26px;
}

.v-bar {
  width: 3px;
  height: 8px;
  background: #8b5cf6;
  border-radius: 999px;
  animation: waveBar 1.1s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.07s);
}

.vox-wave-row.paused .v-bar {
  animation-play-state: paused;
  height: 5px;
  opacity: 0.5;
}

@keyframes waveBar {
  0%, 100% { height: 6px; }
  50% { height: 22px; }
}

.vox-live-text {
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
}

.vox-subnote {
  font-size: 0.64rem;
  color: var(--screen-muted);
  text-align: center;
}

.vox-actions-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.3rem;
  flex-wrap: wrap;
}

/* Quick Shortcuts Grid */
.shortcuts-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
}

.sc-item {
  border: 1px solid var(--kb-key-border);
  background: var(--bubble-recv);
  color: var(--screen-ink);
  border-radius: 12px;
  padding: 0.5rem 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.28rem;
  font-size: 0.66rem;
  font-weight: 600;
  cursor: pointer;
}

.sc-item:hover {
  border-color: var(--color-accent);
}

.quick-note-box {
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--kb-key-border);
  background: var(--bubble-recv);
  color: var(--screen-ink);
  padding: 0.45rem;
  font-size: 0.75rem;
  resize: none;
  outline: none;
}

.demo-toast {
  background: rgba(15, 23, 42, 0.92);
  color: #f8fafc;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  padding: 0.38rem 0.65rem;
  border-radius: 10px;
  text-align: center;
}

/* Keyboard Surface */
.keyboard-surface {
  background: var(--kb-bg);
  border-radius: 26px;
  padding: 0.5rem 0.35rem 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
}

.incognito-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(24, 24, 34, 0.92);
  color: #f8fafc;
  border-radius: 12px;
  padding: 0.35rem 0.65rem;
  font-size: 0.7rem;
  font-weight: 600;
}

.inc-left {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.inc-badge {
  font-size: 0.62rem;
  background: rgba(255, 255, 255, 0.14);
  padding: 0.1rem 0.42rem;
  border-radius: 9999px;
}

.kb-toolbar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0 0.25rem;
}

.kb-tool-icon {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--screen-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.kb-tool-icon.active {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
}

.kb-tool-icon:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.kb-suggestion-pill {
  flex: 1;
  border: 1px solid var(--kb-key-border);
  background: var(--kb-pill);
  color: var(--screen-ink);
  border-radius: 9999px;
  padding: 0.28rem 0.65rem;
  font-size: 0.72rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.32rem;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kb-m-key {
  position: relative;
  width: 30px;
  height: 30px;
  border: 1px solid var(--kb-key-border);
  border-radius: 9px;
  background: #ffffff;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}

.kb-m-key img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.kb-m-key.locked {
  opacity: 0.6;
}

.m-lock {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #0f172a;
  color: #c084fc;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* One-handed layouts */
.kb-keys-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  transition: width 0.25s ease;
}

.phone-chassis[data-layout='left'] .kb-keys-wrap {
  width: 86%;
  margin-right: auto;
}

.phone-chassis[data-layout='right'] .kb-keys-wrap {
  width: 86%;
  margin-left: auto;
}

.kb-row {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.mid-row {
  padding: 0 4%;
}

.kb-key {
  position: relative;
  flex: 1;
  height: 38px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--screen-ink);
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kb-key:hover {
  background: var(--kb-pill);
}

.phone-chassis[data-borders='true'] .kb-key,
.phone-chassis[data-borders='true'] .kb-spacebar {
  background: var(--kb-key-bg);
  border-color: var(--kb-key-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.k-sub {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 0.54rem;
  color: var(--screen-muted);
  opacity: 0.75;
}

.mod-key {
  max-width: 44px;
  font-size: 0.92rem;
}

.mod-key.shifted {
  background: var(--kb-pill);
  color: var(--color-accent);
}

.mod-pill {
  max-width: 48px;
  font-size: 0.72rem;
  font-weight: 600;
  background: var(--kb-pill);
  border-radius: 9999px;
}

.icon-pair {
  gap: 3px;
}

.kb-spacebar {
  flex: 2.8;
  height: 36px;
  border: 1px solid transparent;
  background: var(--kb-pill);
  color: var(--screen-ink);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  cursor: pointer;
}

.kb-spacebar.ai-open {
  border-color: var(--color-accent);
}

.space-bolt {
  color: var(--color-accent);
}

.incognito-dot-key {
  gap: 2px;
}

.incognito-dot-key.glow {
  border: 1.5px solid #c084fc !important;
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.55);
  color: #c084fc;
}

.dot-char {
  font-weight: 800;
}

.kb-enter {
  width: 44px;
  height: 36px;
  border: none;
  border-radius: 9999px;
  background: var(--bubble-sent);
  color: var(--bubble-sent-ink);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.home-pill-bar {
  display: flex;
  justify-content: center;
  padding-top: 0.2rem;
}

.home-pill-bar span {
  width: 96px;
  height: 3.5px;
  border-radius: 9999px;
  background: var(--screen-muted);
  opacity: 0.4;
}

/* 3D Toolbar & Perspective Stage */
.pg-3d-toolbar {
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pg-hint-text {
  font-size: 0.64rem;
  color: #9ca3af;
}

.pg-3d-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.pg-3d-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.24rem 0.62rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
}

.pg-3d-btn:hover,
.pg-3d-btn.running {
  border-color: var(--color-accent);
  background: rgba(249, 115, 22, 0.2);
  color: #ffffff;
}

.phone-3d-stage {
  width: 100%;
  max-width: 400px;
  perspective: 1300px;
  cursor: grab;
  user-select: none;
}

.phone-3d-stage.dragging {
  cursor: grabbing;
}

.phone-3d-body {
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.22, 0.72, 0.24, 1);
}

.phone-3d-stage.dragging .phone-3d-body {
  transition: none;
}

.phone-face-front {
  position: relative;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.phone-face-front.is-inert,
.phone-face-rear.is-inert {
  pointer-events: none;
}

.phone-face-rear {
  position: absolute;
  inset: 0;
  border-radius: 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: rotateY(180deg);
  background: linear-gradient(150deg, #faf9fc, #e6e2ee);
  color: #3f3b4a;
  box-shadow: 0 28px 75px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.65);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.35rem;
}

.phone-face-rear[data-theme='ink'],
.phone-face-rear[data-theme='photo'] {
  background: linear-gradient(150deg, #2b2934, #14131a 60%, #1c1b24);
  color: #cbd5e1;
  box-shadow: 0 28px 75px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.phone-face-rear[data-theme='iris'] {
  background: linear-gradient(150deg, #f3f5ff, #cfd6f4);
}

.phone-face-rear[data-theme='ocean'] {
  background: linear-gradient(150deg, #effbfa, #b9dce0);
}

.phone-face-rear[data-theme='terracotta'] {
  background: linear-gradient(150deg, #fff6ee, #e8c7be);
}

.rear-camera-bar {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 9px;
  border-radius: 999px;
  border: 1px solid rgba(128, 128, 128, 0.35);
  background: rgba(15, 16, 22, 0.28);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

.rear-lens {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(180, 180, 200, 0.45);
  background: radial-gradient(circle at 42% 38%, #64748b 0%, #1e293b 25%, #090a0f 65%);
}

.rear-flash {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: radial-gradient(circle, #fef3c7, #d97706);
}

.rear-logo-btn {
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  color: inherit;
  padding: 1rem;
  border-radius: 20px;
}

.rear-logo-btn:hover {
  background: rgba(128, 128, 128, 0.12);
}

.rear-emblem {
  width: 58px;
  height: 58px;
  opacity: 0.88;
}

.rear-emblem-caption {
  font-size: 0.64rem;
  opacity: 0.72;
}

.rear-brand-foot {
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  opacity: 0.52;
}
</style>
