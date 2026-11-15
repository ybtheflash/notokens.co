<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Shield,
  Zap,
  ArrowLeft,
  FileText,
  Search,
  Sun,
  Moon,
  X,
  Eye,
  EyeOff,
  Mic,
  Check,
  ChevronDown,
  Clock,
  Bell,
  BookOpen,
  Edit3,
  Sliders,
  Calendar,
  Layers,
  Cloud,
  Smile,
  Globe
} from 'lucide-vue-next'

// Keyboard interactive widget state - Defaults to Paper theme
const keyboardTheme = ref<'dark' | 'light'>('light')
const activeInputText = ref('We have exam at 5 PM?')
const isAiDrawerOpen = ref(false)
const isVoxDrawerOpen = ref(false)
const isVoxMenuOpen = ref(false)
const isIncognito = ref(false)
const contextToast = ref<string | null>(null)
let toastTimer: number | null = null
let voxHoldTimer: number | null = null
let isHoldTriggered = false

// Pricing plan state
const billingCycle = ref<'yearly' | 'monthly'>('yearly')

const triggerRestore = () => {
  if (toastTimer) clearTimeout(toastTimer)
  contextToast.value = 'Checking Google Play subscriptions and Keystore licenses...'
  toastTimer = window.setTimeout(() => {
    contextToast.value = null
  }, 3500)
}

const triggerGetPro = () => {
  if (toastTimer) clearTimeout(toastTimer)
  const price = billingCycle.value === 'yearly' ? '₹3,372 / year (₹281/mo)' : '₹299 / month'
  contextToast.value = `Monolog Pro · Selected ${billingCycle.value} billing at ${price}`
  toastTimer = window.setTimeout(() => {
    contextToast.value = null
  }, 3500)
}

const toggleIncognito = () => {
  isIncognito.value = !isIncognito.value
  if (toastTimer) clearTimeout(toastTimer)
  if (isIncognito.value) {
    contextToast.value = 'Incognito active · Memory capture paused for 15 minutes'
  } else {
    contextToast.value = 'Memory capture resumed · Sensitive-input filtering active'
  }
  toastTimer = window.setTimeout(() => {
    contextToast.value = null
  }, 3500)
}

const suggestions = [
  'Set 5 PM exam reminder',
  'Call Amma at 6',
  'Summarize my day',
  'What did I order?'
]

const currentSugIndex = ref(0)
const currentSuggestion = computed(() => suggestions[currentSugIndex.value])

const cycleSuggestion = () => {
  currentSugIndex.value = (currentSugIndex.value + 1) % suggestions.length
  applySuggestion(suggestions[currentSugIndex.value])
}

const applySuggestion = (s: string) => {
  activeInputText.value = s
  if (s.includes('reminder') || s.includes('Set 5 PM')) {
    if (toastTimer) clearTimeout(toastTimer)
    contextToast.value = 'Intent parsed: "Exam reminder at 5:00 PM" · Ready for Android AlarmManager'
    toastTimer = window.setTimeout(() => {
      contextToast.value = null
    }, 3500)
  }
}

const toggleAiDrawer = () => {
  isAiDrawerOpen.value = !isAiDrawerOpen.value
  if (isAiDrawerOpen.value) {
    isVoxDrawerOpen.value = false
    isVoxMenuOpen.value = false
  }
}

const handleVoxMouseDown = () => {
  isHoldTriggered = false
  voxHoldTimer = window.setTimeout(() => {
    isHoldTriggered = true
    isVoxMenuOpen.value = true
    if (toastTimer) clearTimeout(toastTimer)
    contextToast.value = 'Quick Actions open · Choose Reminder, Alarm, or Journal'
    toastTimer = window.setTimeout(() => { contextToast.value = null }, 3000)
  }, 320)
}

const handleVoxMouseUp = () => {
  if (voxHoldTimer) {
    clearTimeout(voxHoldTimer)
    voxHoldTimer = null
  }
}

const handleVoxClick = () => {
  if (!isHoldTriggered) {
    isVoxMenuOpen.value = !isVoxMenuOpen.value
    if (isVoxMenuOpen.value) {
      isAiDrawerOpen.value = false
      isVoxDrawerOpen.value = false
    }
  }
  isHoldTriggered = false
}

const selectVoxAction = (action: 'reminder' | 'alarm' | 'journal' | 'vox') => {
  isVoxMenuOpen.value = false
  if (action === 'reminder') {
    activeInputText.value = 'Remind me to study at 5 PM'
    if (toastTimer) clearTimeout(toastTimer)
    contextToast.value = 'Reminder intent parsed: "Study at 5:00 PM" · Ready for Android AlarmManager'
    toastTimer = window.setTimeout(() => { contextToast.value = null }, 3500)
  } else if (action === 'alarm') {
    activeInputText.value = 'Set alarm for 7:00 AM'
    if (toastTimer) clearTimeout(toastTimer)
    contextToast.value = 'Alarm intent parsed: "Alarm at 7:00 AM" · Android Clock ready'
    toastTimer = window.setTimeout(() => { contextToast.value = null }, 3500)
  } else if (action === 'journal') {
    activeInputText.value = 'Journal reflection: Great day with team, slides finished'
    if (toastTimer) clearTimeout(toastTimer)
    contextToast.value = 'Opening Monolog Journal · Daily timeline and encrypted reflection'
    toastTimer = window.setTimeout(() => { contextToast.value = null }, 3500)
  } else if (action === 'vox') {
    toggleVoxMode()
  }
}

const toggleVoxMode = () => {
  isVoxDrawerOpen.value = !isVoxDrawerOpen.value
  if (isVoxDrawerOpen.value) {
    isAiDrawerOpen.value = false
    isVoxMenuOpen.value = false
    if (toastTimer) clearTimeout(toastTimer)
    contextToast.value = 'Vox mode active · On-device Gemma speech formatting ready'
    toastTimer = window.setTimeout(() => {
      contextToast.value = null
    }, 3200)
  }
}

const triggerContextButton = () => {
  if (toastTimer) clearTimeout(toastTimer)
  contextToast.value = 'Screen context captured · Voice memo ready to attach'
  toastTimer = window.setTimeout(() => {
    contextToast.value = null
  }, 3500)
}

// Interface design boards tab
const activeDesignTab = ref<'dual' | 'vox' | 'ink' | 'flow'>('dual')
const selectedImageModal = ref<string | null>(null)

// Flow screens from the latest Figma/Canva designs
const journalFlowScreens = [
  {
    num: '01',
    title: '01 · Context Diary Shortcut',
    sub: 'Quick launcher for Reminders, Alarms & Monolog Journal triggered directly from the context key',
    image: '/monolog/01-context-journal-shortcut.png'
  },
  {
    num: '02',
    title: '02 · Journal & Timeline',
    sub: 'Daily reflections, photos, and structured memories organized in a chronological timeline',
    image: '/monolog/02-journal-timeline.png'
  },
  {
    num: '03',
    title: '03 · Expanded Daily View',
    sub: 'Detailed breakdown of reflections, timetable snapshots, and action reminders for the day',
    image: '/monolog/03-expanded-day.png'
  },
  {
    num: '04',
    title: '04 · Narrative Nostalgia Recap (NNN)',
    sub: 'Monthly story synthesis (NNN Recap) capturing your journey, thoughts, and memories beyond deadlines',
    image: '/monolog/04-nnn-november-recap.png'
  }
]

// 4 Features showcase
const activeFeatureIndex = ref(0)
const reminderSubTab = ref<'dialog' | 'suggestion'>('dialog')
const aiSearchThemeTab = ref<'paper' | 'ink'>('paper')
const inkSubTab = ref<'keyboard' | 'ai'>('keyboard')

const currentInkImage = computed(() => {
  return inkSubTab.value === 'keyboard' 
    ? '/monolog/ink-theme-amoled.png' 
    : '/monolog/ink-theme-ai-mode.png'
})

const featureList = [
  {
    title: 'Daily Memory & Journal',
    tag: 'ROOM + KEYSTORE ENCRYPTED',
    subtitle: 'Everyday typing synthesized into reflections without manual diary writing',
    image: '/monolog/01-journal-home.png',
    desc: 'Weather via Maps Platform, daily typing synthesized into Room reflections, reminders, and "Narrative Nostalgia" monthly recaps. Keys protected by Android Keystore.'
  },
  {
    title: 'Picture-in-Picture AI Search',
    tag: 'GEMINI FLASH + SEARCH GROUNDING',
    subtitle: 'Long-press lightning spacebar to search without switching apps',
    image: '/monolog/03-ai-search.png',
    desc: 'Floating AI drawer above WhatsApp, Slack, or Chrome. Ask questions, view web citations with Google Search grounding, or attach selected screenshots without leaving your conversation.'
  },
  {
    title: 'The Context Key',
    isKeyFeature: true,
    tag: 'ML KIT OCR + MULTIMODAL',
    subtitle: 'One-tap screen capture and voice note archive',
    image: '/monolog/04-context-library.png',
    desc: 'Screen capture with Android permission. ML Kit text recognition extracts on-screen text into your searchable local memory library alongside text notes and transcribed voice notes.'
  },
  {
    title: 'Phone Actions & Quick Shortcuts',
    tag: 'STRUCTURED FUNCTION CALLING',
    subtitle: 'Locally validated requests turned into confirmed Android intents',
    image: '/monolog/02-reminders.png',
    desc: 'Type “Remind me to call Amma at 6 PM”. Gemini parses structured intent parameters, which you review before executing Android reminders, alarms, notifications, or quick shortcuts.'
  }
]

const currentFeatureImage = computed(() => {
  if (activeFeatureIndex.value === 1) {
    return aiSearchThemeTab.value === 'ink'
      ? '/monolog/ink-theme-ai-mode.png'
      : '/monolog/03-ai-search.png'
  }
  if (activeFeatureIndex.value === 3) {
    return reminderSubTab.value === 'dialog' 
      ? '/monolog/02-reminders.png' 
      : '/monolog/02-reminder-suggestion.png'
  }
  return featureList[activeFeatureIndex.value].image
})

const openModal = (src: string) => {
  selectedImageModal.value = src
}

const closeModal = () => {
  selectedImageModal.value = null
}
</script>

<template>
  <div class="monolog-page">
    <!-- Immersive Animated Orange Aurora & Gradient Glass Background System -->
    <div class="aurora-stage" aria-hidden="true">
      <div class="aurora-glow glow-corner-tl"></div>
      <div class="aurora-glow glow-corner-tr"></div>
      <div class="aurora-glow glow-corner-bl"></div>
      <div class="aurora-glow glow-corner-br"></div>
      <div class="aurora-glow glow-mid-center"></div>
      <div class="aurora-ribbon"></div>
      <div class="glass-noise-overlay"></div>
    </div>

    <!-- Minimalist Frosted Glass Navbar -->
    <header class="navbar-wrapper">
      <div class="container navbar">
        <div class="nav-left">
          <router-link to="/" class="brand-logo" aria-label="No Tokens Home" title="Back to NoTokens HQ">
            <svg class="brand-symbol" viewBox="0 0 40 32" width="38" height="30" fill="none" stroke="var(--color-accent)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <path class="circle-half left-half" d="M 11 7 A 9 9 0 0 0 11 25"/>
              <line class="slash-line" x1="23" y1="1" x2="17" y2="31"/>
              <path class="circle-half right-half" d="M 29 7 A 9 9 0 0 1 29 25"/>
            </svg>
          </router-link>
          <span class="nav-slash">/</span>
          <div class="nav-monolog-branding">
            <img src="/monolog/monolog-logo.svg" alt="Monolog Logo" class="nav-monolog-logo" />
            <span class="nav-path">monolog</span>
          </div>
        </div>

        <div class="nav-right">
          <a 
            href="https://startupbuildathon.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="nav-pill buildathon-pill"
            title="Startup Buildathon India 2026 Submission"
          >
            <span class="pill-dot"></span>
            <span>Buildathon '26 ↗</span>
          </a>

          <router-link to="/" class="nav-pill back-pill">
            <ArrowLeft :size="13" />
            <span>Back to HQ</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="main-content container">
      <!-- Hero Section (Frosted Glass & Ambient Aurora) -->
      <section class="hero-section">
        <div class="hero-grid">
          <!-- Left: Hero text and Clean Chips -->
          <div class="hero-left">
            <div class="hero-eyebrow">// STARTUP BUILDATHON INDIA 2026 SUBMISSION</div>
            
            <div class="hero-title-wrap">
              <img src="/monolog/monolog-logo.svg" alt="Monolog Official Logo" class="hero-logo-badge" />
              <h1 class="hero-title">monolog<span class="terminal-dot">.</span></h1>
            </div>

            <p class="hero-tagline">
              <span class="tagline-brand">monolog</span> combines an AI-powered Android keyboard, natural voice typing and a private, searchable journal. Stay in the moment with seamless typing and instant actions while capturing your side of the day.
            </p>

            <!-- Metadata Chips -->
            <div class="hero-chips">
              <span class="chip">Android IME</span>
              <span class="chip">Gemma On-Device</span>
              <span class="chip">Gemini Cloud</span>
              <span class="chip">Room + Keystore</span>
              <span class="chip">Google Stack</span>
            </div>

            <!-- Outbound Links -->
            <div class="hero-links">
              <a 
                href="https://startupbuildathon.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="meta-link-btn"
              >
                <span>startupbuildathon.com</span>
                <span class="arrow">↗</span>
              </a>
              <a 
                href="https://docs.google.com/presentation/d/1lAddxoSqFzeH3-FaXEhxkfMJ__UAF07P0fq48K10kQ0" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="meta-link-btn deck-btn"
              >
                <FileText :size="13" />
                <span>Submission Deck</span>
                <span class="arrow">↗</span>
              </a>
            </div>
          </div>

          <!-- Right: Interactive Realistic Monolog Mobile Phone Keyboard Mockup -->
          <div class="hero-right">
            <div class="phone-device-chassis" :class="[keyboardTheme]">
              <!-- Realistic Android Status Bar -->
              <div class="phone-status-bar">
                <span class="status-time">9:41</span>
                <div class="camera-punch-hole"></div>
                <div class="status-right-icons">
                  <div class="theme-toggle-micro">
                    <button 
                      class="theme-micro-btn" 
                      :class="{ active: keyboardTheme === 'dark' }"
                      @click="keyboardTheme = 'dark'"
                      title="Ink Theme (Dark AMOLED)"
                    >
                      <Moon :size="10" />
                      <span>Ink</span>
                    </button>
                    <button 
                      class="theme-micro-btn" 
                      :class="{ active: keyboardTheme === 'light' }"
                      @click="keyboardTheme = 'light'"
                      title="Paper Theme (Light Aurora)"
                    >
                      <Sun :size="10" />
                      <span>Paper</span>
                    </button>
                  </div>
                  <span class="network-badge">5G</span>
                  <span class="battery-text">100%</span>
                  <div class="battery-icon-pill">
                    <div class="battery-level"></div>
                  </div>
                </div>
              </div>

              <!-- Simulated Host App Header (Google Messages / Chat) -->
              <div class="sim-chat-header">
                <div class="chat-contact-info">
                  <span class="chat-back-arrow">←</span>
                  <div class="chat-avatar">S</div>
                  <div class="chat-name-col">
                    <span class="chat-contact-name">Sam</span>
                  </div>
                </div>
                <span class="chat-more-dots">⋮</span>
              </div>

              <!-- Simulated Host Chat Messages -->
              <div class="sim-chat-conversation">
                <span class="chat-date-pill">TODAY</span>
                <div class="chat-bubble bubble-received">
                  <span>Did you check the timetable?</span>
                </div>
                <div class="chat-bubble bubble-sent">
                  <span>Yes, just checked.</span>
                </div>
              </div>

              <!-- Simulated Host Chat Input Field -->
              <div class="sim-chat-input-bar">
                <button class="chat-attach-btn" title="Add attachment">+</button>
                <div class="chat-input-capsule">
                  <span class="chat-input-text">{{ activeInputText }}</span>
                  <span class="cursor-blink">|</span>
                </div>
                <button 
                  class="chat-send-btn" 
                  title="Send message"
                  @click="triggerContextButton"
                >
                  ↑
                </button>
              </div>

              <!-- Floating Picture-in-Picture AI Drawer (Matches AI Mode.png) -->
              <Transition name="slide-pip">
                <div v-if="isAiDrawerOpen" class="pip-ai-drawer">
                  <div class="pip-header">
                    <div class="pip-title">
                      <Zap :size="13" class="text-orange" />
                      <span>Monolog AI</span>
                    </div>
                    <div class="pip-actions">
                      <span class="pip-expand-icon">⤢</span>
                      <button class="pip-close" @click="isAiDrawerOpen = false" aria-label="Close">
                        <X :size="13" />
                      </button>
                    </div>
                  </div>
                  <div class="pip-search-box">
                    <Search :size="13" class="search-icon" />
                    <span>What should I pack for a day hike?</span>
                  </div>
                  <div class="pip-answer-card">
                    <h5 class="pip-answer-heading">Pack light. Cover the essentials.</h5>
                    <ul class="pip-answer-bullets">
                      <li>Water and snacks</li>
                      <li>Sun protection</li>
                      <li>A light jacket</li>
                    </ul>
                    <div class="pip-sources-row">
                      <span class="sources-link">View sources ↗</span>
                      <button 
                        class="pip-insert-btn" 
                        @click="activeInputText = 'Packing water, snacks, sun protection and a jacket for our hike!'; isAiDrawerOpen = false"
                      >
                        Insert into chat
                      </button>
                    </div>
                  </div>
                  <div class="pip-followup-bar">
                    <span class="followup-placeholder">Ask a follow-up...</span>
                    <div class="followup-icons">
                      <Mic :size="12" class="f-mic" />
                      <span class="f-send">↑</span>
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Floating Vox Mode Drawer (Matches monolog-vox-mode.png) -->
              <Transition name="slide-pip">
                <div v-if="isVoxDrawerOpen" class="vox-mode-drawer">
                  <div class="vox-header">
                    <div class="vox-title">
                      <span class="vox-kb-icon">⌨</span>
                      <span class="vox-divider">|</span>
                      <span>Vox mode</span>
                    </div>
                    <button class="pip-close" @click="isVoxDrawerOpen = false" aria-label="Close">
                      <X :size="13" />
                    </button>
                  </div>
                  <div class="vox-body">
                    <div class="vox-status">
                      <span class="vox-live-dot"></span>
                      <span>Listening...</span>
                    </div>
                    <!-- Audio Waveform Visualizer -->
                    <div class="vox-waveform">
                      <span v-for="i in 22" :key="i" class="wave-bar" :style="{ animationDelay: `${(i % 7) * 0.11}s` }"></span>
                    </div>
                    <p class="vox-copy">
                      Speak naturally. Words appear as you talk.<br>Punctuation and formatting, handled.
                    </p>
                    <div class="vox-controls">
                      <span class="vox-lang-tag">English ▾</span>
                      <button class="vox-pause-btn" title="Pause recording">⏸</button>
                      <button 
                        class="vox-done-btn" 
                        @click="activeInputText = 'Let\'s meet at the library at four. I\'ll bring the notes.'; isVoxDrawerOpen = false"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Toast Notification for Context Trigger -->
              <Transition name="fade">
                <div v-if="contextToast" class="context-toast">
                  {{ contextToast }}
                </div>
              </Transition>

              <!-- The Realistic Borderless Aurora Keyboard -->
              <div class="borderless-keyboard">
                <!-- Toolbar Row: Suggestions & Action Buttons -->
                <div class="kb-toolbar">
                  <!-- Collapse Keyboard Chevron -->
                  <button class="kb-chevron-btn" title="Hide keyboard">
                    <ChevronDown :size="16" />
                  </button>

                  <!-- Active Suggestion Capsule -->
                  <div 
                    class="kb-suggestion-capsule" 
                    @click="cycleSuggestion"
                    title="Tap to cycle smart action suggestions"
                  >
                    <Clock :size="13" class="sug-clock-icon" />
                    <span class="sug-text">{{ currentSuggestion }}</span>
                  </div>

                  <!-- Vox Key Container with Floating Quick Shortcuts Popup -->
                  <div class="vox-key-container">
                    <Transition name="slide-pip">
                      <div v-if="isVoxMenuOpen" class="vox-shortcuts-popup" @click.stop>
                        <div class="vox-pop-header">
                          <span class="vox-pop-title">Quick Actions</span>
                          <button class="vox-pop-close" @click="isVoxMenuOpen = false" aria-label="Close">
                            <X :size="11" />
                          </button>
                        </div>
                        <div class="vox-pop-items">
                          <button class="vox-pop-item" @click="selectVoxAction('reminder')">
                            <Clock :size="13" class="pop-icon" />
                            <span>Set Reminder</span>
                          </button>
                          <button class="vox-pop-item" @click="selectVoxAction('alarm')">
                            <Bell :size="13" class="pop-icon" />
                            <span>Set Alarm</span>
                          </button>
                          <button class="vox-pop-item" @click="selectVoxAction('journal')">
                            <BookOpen :size="13" class="pop-icon" />
                            <span>Open Journal</span>
                          </button>
                          <button class="vox-pop-item vox-dictate-opt" @click="selectVoxAction('vox')">
                            <Mic :size="13" class="pop-icon" />
                            <span>Voice Typing (Vox)</span>
                          </button>
                        </div>
                      </div>
                    </Transition>

                    <button 
                      class="kb-tool-btn vox-mic-btn" 
                      :class="{ active: isVoxDrawerOpen || isVoxMenuOpen }"
                      @mousedown="handleVoxMouseDown"
                      @mouseup="handleVoxMouseUp"
                      @touchstart="handleVoxMouseDown"
                      @touchend="handleVoxMouseUp"
                      @click="handleVoxClick" 
                      title="Hold Vox Key for quick shortcuts (Reminder, Alarm, Journal) or tap for dictation"
                    >
                      <Mic :size="15" />
                      <span v-if="isVoxDrawerOpen" class="vox-pulse-dot"></span>
                    </button>
                  </div>

                  <!-- M Context Diary Key (The Monolog Signature 3D White Button) -->
                  <button 
                    class="kb-tool-btn m-signature-btn" 
                    @click="triggerContextButton" 
                    title="Tap M key to snapshot screen context and voice note"
                  >
                    <img src="/monolog/monolog-logo.svg" alt="M Diary Key" class="m-signature-logo" />
                  </button>
                </div>

                <!-- Borderless QWERTY Letter Grid (Uppercase, Clean Spacing) -->
                <div class="kb-keys-grid">
                  <!-- Row 1: Q W E R T Y U I O P -->
                  <div class="kb-row">
                    <span 
                      v-for="k in ['Q','W','E','R','T','Y','U','I','O','P']" 
                      :key="k" 
                      class="borderless-key"
                      @click="activeInputText += k.toLowerCase()"
                    >
                      {{ k }}
                    </span>
                  </div>

                  <!-- Row 2: A S D F G H J K L (Staggered indent) -->
                  <div class="kb-row indent-row">
                    <span 
                      v-for="k in ['A','S','D','F','G','H','J','K','L']" 
                      :key="k" 
                      class="borderless-key"
                      @click="activeInputText += k.toLowerCase()"
                    >
                      {{ k }}
                    </span>
                  </div>

                  <!-- Row 3: Shift, Z X C V B N M, Backspace -->
                  <div class="kb-row action-row-3">
                    <button class="borderless-key mod-key shift-key" title="Shift">
                      ↑
                    </button>
                    <span 
                      v-for="k in ['Z','X','C','V','B','N','M']" 
                      :key="k" 
                      class="borderless-key"
                      @click="activeInputText += k.toLowerCase()"
                    >
                      {{ k }}
                    </span>
                    <button 
                      class="borderless-key mod-key backspace-key" 
                      title="Backspace"
                      @click="activeInputText = activeInputText.slice(0, -1)"
                    >
                      ⌫
                    </button>
                  </div>

                  <!-- Row 4 (Bottom Bar): ?123, Emoji/Globe, Spacebar (English), Incognito, Return -->
                  <div class="kb-row bottom-controls-row">
                    <button class="borderless-key mod-pill num-pill">
                      ?123
                    </button>
                    <button class="borderless-key mod-pill emoji-globe-pill" title="Emoji & Language">
                      <Smile :size="14" />
                      <Globe :size="13" class="globe-symbol" />
                    </button>
                    <button 
                      class="spacebar-capsule" 
                      @click="toggleAiDrawer"
                      title="Hold or tap spacebar for Picture-in-Picture AI search"
                    >
                      <span>English</span>
                      <Zap :size="12" class="space-lightning-icon" />
                    </button>
                    <button 
                      class="borderless-key mod-pill incognito-period-key" 
                      :class="{ 'incognito-active': isIncognito }"
                      @click="toggleIncognito"
                      title="Tap or hold period to toggle Incognito (pauses memory capture)"
                    >
                      <EyeOff :size="12" class="incognito-eye-icon" />
                      <span class="period-dot">.</span>
                    </button>
                    <button 
                      class="enter-action-key" 
                      title="Return"
                      @click="activeInputText += '\n'"
                    >
                      ↵
                    </button>
                  </div>
                </div>

                <!-- Android Home Indicator Line -->
                <div class="android-home-bar-wrap">
                  <div class="android-home-indicator"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: // previews -->
      <section class="section-block" id="designs">
        <div class="section-header-row">
          <h2 class="section-title">// previews</h2>
          <div class="design-meta-badge">
            <span class="mcp-dot"></span>
            <span>Ink &amp; Paper Systems</span>
          </div>
        </div>

        <div class="design-card frosted-glass-panel">
          <!-- Subtabs for Previews -->
          <div class="design-tab-bar">
            <button 
              class="d-tab" 
              :class="{ active: activeDesignTab === 'dual' }"
              @click="activeDesignTab = 'dual'"
            >
              Ink &amp; Paper Dual System
            </button>
            <button 
              class="d-tab" 
              :class="{ active: activeDesignTab === 'vox' }"
              @click="activeDesignTab = 'vox'"
            >
              Vox Mode · Voice Typing
            </button>
            <button 
              class="d-tab" 
              :class="{ active: activeDesignTab === 'ink' }"
              @click="activeDesignTab = 'ink'"
            >
              Ink Theme · AMOLED IME
            </button>
            <button 
              class="d-tab" 
              :class="{ active: activeDesignTab === 'flow' }"
              @click="activeDesignTab = 'flow'"
            >
              Journal Experience Flow (1–4)
            </button>
          </div>

          <!-- Tab Content 1: Dual Themes -->
          <div v-show="activeDesignTab === 'dual'" class="board-viewport" @click="openModal('/monolog/monolog-aurora-themes.png')">
            <img 
              src="/monolog/monolog-aurora-themes.png" 
              alt="Monolog Frosted Aurora Light and Dark Themes" 
              class="board-image"
            />
            <div class="board-overlay">
              <Eye :size="16" />
              <span>Click to inspect 1512 × 1140 Design Board</span>
            </div>
          </div>

          <!-- Tab Content 2: Vox Mode Voice Typing -->
          <div v-show="activeDesignTab === 'vox'" class="board-viewport phone-viewport" @click="openModal('/monolog/monolog-vox-mode.png')">
            <img 
              src="/monolog/monolog-vox-mode.png" 
              alt="Monolog Vox Mode On-Device Voice Typing" 
              class="board-image phone-board-image"
            />
            <div class="board-overlay">
              <Eye :size="16" />
              <span>Click to inspect 1024 × 1536 Vox Mode Screen</span>
            </div>
          </div>

          <!-- Tab Content 3: Ink Theme AMOLED -->
          <div v-show="activeDesignTab === 'ink'" class="ink-tab-container">
            <div class="ink-sub-switch">
              <button 
                class="sub-switch-btn" 
                :class="{ active: inkSubTab === 'keyboard' }"
                @click.stop="inkSubTab = 'keyboard'"
              >
                AMOLED IME Typing
              </button>
              <button 
                class="sub-switch-btn" 
                :class="{ active: inkSubTab === 'ai' }"
                @click.stop="inkSubTab = 'ai'"
              >
                AMOLED AI Search Mode
              </button>
            </div>

            <div class="board-viewport phone-viewport" @click="openModal(currentInkImage)">
              <img 
                :src="currentInkImage" 
                :alt="inkSubTab === 'keyboard' ? 'Monolog Ink Theme AMOLED Dark Keyboard' : 'Monolog Ink Theme AI Mode'" 
                class="board-image phone-board-image"
              />
              <div class="board-overlay">
                <Eye :size="16" />
                <span>Click to inspect {{ inkSubTab === 'keyboard' ? '1024 × 1536 AMOLED Ink Keyboard' : '1024 × 1536 AMOLED AI Search' }}</span>
              </div>
            </div>
          </div>

          <!-- Tab Content 3: Journal Experience Flow (1–4) -->
          <div v-show="activeDesignTab === 'flow'" class="wireframes-grid">
            <div 
              v-for="(screen, sIdx) in journalFlowScreens" 
              :key="sIdx" 
              class="wf-card" 
              @click="openModal(screen.image)"
            >
              <div class="wf-img-wrap">
                <img :src="screen.image" :alt="screen.title" class="wf-img" />
              </div>
              <div class="wf-info">
                <span class="wf-title">{{ screen.title }}</span>
                <p class="wf-desc">{{ screen.sub }}</p>
              </div>
            </div>
          </div>

          <!-- Design Footer -->
          <div class="board-footer-bar">
            <span class="board-caption">
              Frosted translucent keys with soft pastel aurora edge blooms (icy cyan, lavender, soft mint) against deep ink charcoal.
            </span>
          </div>
        </div>
      </section>

      <!-- Section: // the 4 core interactions -->
      <section class="section-block" id="features">
        <div class="section-header-row">
          <h2 class="section-title">// the interactions · 4 pillars</h2>
          <span class="section-meta-tag">Core Architecture</span>
        </div>

        <div class="features-split-grid">
          <!-- Left: 4 Minimalist Feature Selector Cards -->
          <div class="features-menu">
            <div 
              v-for="(f, idx) in featureList" 
              :key="idx" 
              class="feat-item-card frosted-glass-panel"
              :class="{ 'is-active': activeFeatureIndex === idx }"
              @click="activeFeatureIndex = idx"
            >
              <div class="feat-card-top">
                <span class="feat-number font-mono">0{{ idx + 1 }}</span>
                <span class="feat-tag font-mono">{{ f.tag }}</span>
              </div>
              <h3 class="feat-title">
                <template v-if="f.isKeyFeature">
                  The <img src="/monolog/monolog-logo.svg" alt="Context Key" class="inline-feat-logo" /> Context Key
                </template>
                <template v-else>
                  {{ f.title }}
                </template>
              </h3>
              <p class="feat-sub">{{ f.subtitle }}</p>
              <p class="feat-desc">
                <template v-if="f.isKeyFeature">
                  Inspired by Essential Notes. Tap the <img src="/monolog/monolog-logo.svg" alt="Context Key" class="inline-desc-logo" /> diary key on the top toolbar to snapshot the active screen with permission, record a memo, and search it anytime.
                </template>
                <template v-else>
                  {{ f.desc }}
                </template>
              </p>
            </div>
          </div>

          <!-- Right: Mobile Device Frame with Monolog Screen -->
          <div class="features-preview-col">
            <!-- Sub-view switcher for AI Search (Feature 2) -->
            <div v-if="activeFeatureIndex === 1" class="preview-sub-switch">
              <button 
                class="sub-switch-btn" 
                :class="{ active: aiSearchThemeTab === 'paper' }"
                @click.stop="aiSearchThemeTab = 'paper'"
              >
                Paper Mode
              </button>
              <button 
                class="sub-switch-btn" 
                :class="{ active: aiSearchThemeTab === 'ink' }"
                @click.stop="aiSearchThemeTab = 'ink'"
              >
                Ink Mode (AMOLED)
              </button>
            </div>

            <!-- Sub-view switcher for Reminders & Phone Actions (Feature 4) -->
            <div v-if="activeFeatureIndex === 3" class="preview-sub-switch">
              <button 
                class="sub-switch-btn" 
                :class="{ active: reminderSubTab === 'dialog' }"
                @click.stop="reminderSubTab = 'dialog'"
              >
                Structured Intent Dialog
              </button>
              <button 
                class="sub-switch-btn" 
                :class="{ active: reminderSubTab === 'suggestion' }"
                @click.stop="reminderSubTab = 'suggestion'"
              >
                Inline Smart Suggestion
              </button>
            </div>

            <div class="device-frame frosted-glass-panel" @click="openModal(currentFeatureImage)">
              <img 
                :src="currentFeatureImage" 
                :alt="featureList[activeFeatureIndex].title" 
                class="device-screen"
              />
              <div class="device-zoom-pill">
                <Eye :size="14" />
                <span>Zoom Screen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: // zero-keylogger privacy guarantee -->
      <section class="section-block" id="privacy">
        <div class="section-header-row">
          <h2 class="section-title">// privacy boundary · zero keylogger</h2>
          <span class="section-meta-tag">Keystore Encrypted</span>
        </div>

        <div class="privacy-card frosted-glass-panel">
          <div class="privacy-lead">
            <Shield :size="24" class="text-orange" />
            <div class="privacy-lead-text">
              <span class="privacy-heading">A keylogger steals your keystrokes. Monolog keeps them in your pocket.</span>
              <p class="privacy-sub">
                Consent and sensitive-input checks ensure raw typing never leaves your device. Keystrokes are encrypted with hardware-backed Android Keystore keys before persisting into Room.
              </p>
            </div>
          </div>

          <div class="privacy-pillars-grid">
            <div class="pillar-box">
              <span class="p-num font-mono">01</span>
              <h4>Hardware Keystore &amp; Room</h4>
              <p>Encrypted Room records and app-private media, with AES keys protected by Android Keystore hardware security.</p>
            </div>
            <div class="pillar-box">
              <span class="p-num font-mono">02</span>
              <h4>Sensitive-Input Checks</h4>
              <p>Automatic consent and input checks switch immediately to Incognito on passwords, OTPs, PINs, and banking fields.</p>
            </div>
            <div class="pillar-box">
              <span class="p-num font-mono">03</span>
              <h4>Configurable Incognito</h4>
              <p>Manual incognito pauses memory capture and learning for a configurable duration, defaulting to 15 minutes.</p>
            </div>
            <div class="pillar-box">
              <span class="p-num font-mono">04</span>
              <h4>Cloud AI Isolation</h4>
              <p>Firebase AI Logic + App Check. Only explicit user questions and selected context leave the phone; daily journaling is 100% on-device.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: // the google stack -->
      <section class="section-block" id="google-stack">
        <div class="section-header-row">
          <h2 class="section-title">// the google stack · buildathon submission</h2>
          <span class="section-meta-tag">100% Google Stack</span>
        </div>

        <div class="stack-grid-clean">
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">KEYBOARD &amp; APP</span>
            <h4>Android IME + Jetpack Compose</h4>
            <p>Familiar borderless keyboard, contextual suggestions, floating AI panel, and journal interface.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">PRIVATE MEMORY</span>
            <h4>Encrypted Room + Keystore</h4>
            <p>Consent and sensitive-input checks → encrypted Room records and app-private media protected by Android Keystore.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">VOICE TYPING</span>
            <h4>Microphone + On-Device ASR</h4>
            <p>On-device speech recognition with Gemma-assisted punctuation, formatting, and direct insertion into current app.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">CONTEXT CAPTURE</span>
            <h4>Screen Capture + ML Kit OCR</h4>
            <p>Screen capture with Android permission → ML Kit text recognition. Screenshots and voice notes join local memory.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">ON-DEVICE AI</span>
            <h4>Gemma · Google AI Edge / LiteRT-LM</h4>
            <p>Writing assistance, dictation cleanup, contextual suggestions, daily summaries, and monthly narrative recaps.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">CLOUD INTELLIGENCE</span>
            <h4>Firebase AI Logic + Gemini</h4>
            <p>Explicit user requests via Firebase App Check to Gemini for Google Search grounding, screenshot reasoning, and actions.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">PHONE ACTIONS</span>
            <h4>Validated Android Intents</h4>
            <p>Locally validated requests and required user confirmation for reminders, alarms, notifications, and quick shortcuts.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">WEATHER &amp; BACKUP</span>
            <h4>Maps Weather &amp; Drive Sync</h4>
            <p>Google Maps Platform Weather API conditions and optional encrypted backups to Google Drive appDataFolder with key recovery.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">DEVELOPMENT TOOLS</span>
            <h4>AI Studio + Antigravity + Skills</h4>
            <p>Google AI Studio for prompt/model testing, Google Antigravity for IDE development, and Agent Skills for testing workflows.</p>
          </div>
          <div class="stack-item frosted-glass-panel">
            <span class="s-category">DEPLOYMENT</span>
            <h4>On-Device APK + Firebase / Cloud Run</h4>
            <p>Android app runs locally on user phone, backed by Firebase and Google Cloud with Cloud Run available for custom services.</p>
          </div>
        </div>
      </section>

      <!-- Section: // pricing & plans -->
      <section class="section-block" id="pricing">
        <div class="section-header-row">
          <h2 class="section-title">// plans &amp; pricing · transparent &amp; private</h2>
          <span class="section-meta-tag">Simple Pricing</span>
        </div>

        <div class="pricing-showcase-container">
          <div class="pricing-header-wrap">
            <div class="pricing-badge-row">
              <img src="/monolog/monolog-logo.svg" alt="Monolog" class="pricing-logo-icon" />
              <span class="pricing-badge-text">MONOLOG PLANS</span>
            </div>
            <h3 class="pricing-main-title">More voice. Better words.</h3>
            <p class="pricing-sub-title">Choose your Monolog plan. The core keyboard, on-device Gemma speech formatting, and encrypted local journal are always free.</p>
          </div>

          <div class="pricing-split-layout">
            <!-- Left: Interactive Mobile Screen Recreation -->
            <div class="pricing-phone-card frosted-glass-panel">
              <!-- Top bar inside phone card -->
              <div class="plan-phone-header">
                <button class="plan-back-btn" aria-label="Back">
                  <ArrowLeft :size="16" />
                </button>
                <div class="plan-brand-pill">
                  <img src="/monolog/monolog-logo.svg" alt="Monolog" class="plan-logo-img" />
                  <span class="plan-brand-name">monolog</span>
                </div>
                <button class="plan-restore-btn" @click="triggerRestore">Restore</button>
              </div>

              <!-- Title inside phone card -->
              <div class="plan-phone-headline">
                <h4>More voice. Better words.</h4>
                <p>Choose your Monolog plan.</p>
              </div>

              <!-- Plan 1: Free -->
              <div class="plan-tier-card free-tier">
                <div class="plan-tier-header">
                  <span class="plan-name">Free</span>
                  <span class="plan-price">₹0</span>
                </div>
                <ul class="plan-feature-list">
                  <li>
                    <span class="feat-icon">
                      <svg class="feat-icon-svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="14" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>
                    </span>
                    <span>Keyboard, local journals &amp; basic search</span>
                  </li>
                  <li>
                    <span class="feat-icon"><Mic :size="15" /></span>
                    <span>Basic voice typing &amp; grammar correction</span>
                  </li>
                  <li>
                    <span class="feat-icon"><Cloud :size="15" /></span>
                    <span>Limited monthly Vox &amp; cloud AI pool</span>
                  </li>
                </ul>
              </div>

              <!-- Plan 2: Monolog Pro (Featured) -->
              <div class="plan-tier-card pro-tier">
                <div class="plan-tier-header">
                  <div class="pro-title-wrap">
                    <span class="plan-name">Monolog Pro</span>
                    <span class="plan-badge">FEATURED</span>
                  </div>
                  <span class="pro-lead-text">Everything in Free, plus</span>
                </div>

                <ul class="plan-feature-list pro-list">
                  <li>
                    <span class="feat-icon"><Mic :size="15" /></span>
                    <div class="feat-text">
                      <strong>Vox Pro</strong>
                      <small>More voice typing, smart punctuation &amp; vocabulary</small>
                    </div>
                  </li>
                  <li>
                    <span class="feat-icon"><Edit3 :size="15" /></span>
                    <div class="feat-text">
                      <strong>Write with confidence</strong>
                      <small>Grammar fixes, rewrites &amp; tone suggestions</small>
                    </div>
                  </li>
                  <li>
                    <span class="feat-icon"><Sliders :size="15" /></span>
                    <div class="feat-text">
                      <strong>Make it sound like you</strong>
                      <small>Saved writing styles &amp; reusable instructions</small>
                    </div>
                  </li>
                  <li>
                    <span class="feat-icon"><Search :size="15" /></span>
                    <div class="feat-text">
                      <strong>AI, without switching apps</strong>
                      <small>More search, screenshot questions &amp; follow-ups</small>
                    </div>
                  </li>
                  <li>
                    <span class="feat-icon"><BookOpen :size="15" /></span>
                    <div class="feat-text">
                      <strong>Ask your memories</strong>
                      <small>Find answers across journals, notes &amp; context</small>
                    </div>
                  </li>
                  <li>
                    <span class="feat-icon"><Calendar :size="15" /></span>
                    <div class="feat-text">
                      <strong>Relive your month</strong>
                      <small>Weekly summaries &amp; NNN monthly recaps</small>
                    </div>
                  </li>
                  <li>
                    <span class="feat-icon"><Layers :size="15" /></span>
                    <div class="feat-text">
                      <strong>Do more, effortlessly</strong>
                      <small>Multi-step routines &amp; beautifully formatted exports</small>
                    </div>
                  </li>
                </ul>

                <!-- Billing Cycle Selector (Monthly / Yearly) -->
                <div class="plan-billing-selector">
                  <!-- Monthly Option -->
                  <div 
                    class="billing-option-box" 
                    :class="{ active: billingCycle === 'monthly' }"
                    @click="billingCycle = 'monthly'"
                  >
                    <div class="b-details">
                      <span class="b-label">Monthly</span>
                      <span class="b-price">₹299</span>
                      <span class="b-sub">per month</span>
                    </div>
                    <div class="b-radio-circle">
                      <span v-if="billingCycle === 'monthly'" class="b-radio-dot"></span>
                    </div>
                  </div>

                  <!-- Yearly Option -->
                  <div 
                    class="billing-option-box" 
                    :class="{ active: billingCycle === 'yearly' }"
                    @click="billingCycle = 'yearly'"
                  >
                    <div class="b-badge-wrap">
                      <span class="b-savings-badge">Save 6%</span>
                    </div>
                    <div class="b-details">
                      <span class="b-label">Yearly</span>
                      <div class="b-price-row">
                        <span class="b-price">₹281</span>
                        <span class="b-sub">/ month</span>
                      </div>
                      <span class="b-billed-note">₹3,372 billed yearly</span>
                    </div>
                    <div class="b-radio-circle checked">
                      <Check v-if="billingCycle === 'yearly'" :size="13" />
                    </div>
                  </div>
                </div>

                <!-- Savings Banner -->
                <div class="plan-savings-banner">
                  <span v-if="billingCycle === 'yearly'">Save ₹216 a year compared with monthly billing.</span>
                  <span v-else>Billed monthly at ₹299. Switch to Yearly to save ₹216 / year.</span>
                </div>

                <!-- Always Free Privacy Guarantee -->
                <div class="plan-privacy-guarantee">
                  <Shield :size="14" class="guarantee-shield" />
                  <span>Encryption, incognito &amp; data control — always free.</span>
                </div>

                <!-- CTA Actions -->
                <div class="plan-cta-wrap">
                  <button class="plan-primary-cta" @click="triggerGetPro">
                    <span>Get Monolog Pro</span>
                  </button>
                  <button class="plan-secondary-cta" @click="contextToast = 'Continuing with Monolog Free · Offline Gemma and local journal active'">
                    Continue with Free
                  </button>
                </div>

                <!-- Footer Disclaimer -->
                <div class="plan-footer-disclaimer">
                  <p>Renews automatically. Cancel anytime.</p>
                  <div class="plan-legal-links">
                    <span>Terms</span>
                    <span class="dot-sep">•</span>
                    <span>Privacy</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Real High-Res Phone Mockup Showcase (Click to Expand) -->
            <div class="pricing-asset-showcase">
              <div class="pricing-mockup-wrapper" @click="openModal('/monolog/pricing-plan.png')">
                <img 
                  src="/monolog/pricing-plan.png" 
                  alt="Monolog Pro Subscription Screen" 
                  class="pricing-mockup-img" 
                />
                <div class="mockup-hover-hint">
                  <Search :size="14" />
                  <span>Click to Inspect 1:1 Mobile Render ↗</span>
                </div>
              </div>
              <div class="pricing-caption-note">
                <span class="caption-title">Monolog Pro Subscription Screen</span>
                <p class="caption-desc">Designed with Google Material 3 tactile components and local Keystore tier checks. On-device AI features remain 100% free forever.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>

    <!-- Lightbox Modal for High-Res Inspection -->
    <Transition name="fade">
      <div v-if="selectedImageModal" class="modal-backdrop" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal" aria-label="Close">✕</button>
          <img :src="selectedImageModal" alt="Preview" class="modal-img" />
          <div class="modal-caption">
            <span>Design Board Inspection</span>
            <a :href="selectedImageModal" target="_blank" download class="modal-raw">Open Raw Asset ↗</a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Glassmorphic Terminal Window Footer (Matching NoTokens HQ) -->
    <footer class="footer-wrapper">
      <div class="abyss-container">
        <div class="abyss-glow"></div>
      </div>

      <div class="container footer-container">
        <div class="terminal-footer frosted-glass-panel">
          <div class="terminal-header">
            <div class="terminal-controls">
              <span class="t-dot t-red"></span>
              <span class="t-dot t-yellow"></span>
              <span class="t-dot t-green"></span>
            </div>
            <div class="terminal-title">notokens.co — zsh</div>
            <div class="terminal-status">
              <span class="status-indicator live"></span>
              <span class="status-label">STATUS: ONLINE</span>
            </div>
          </div>

          <div class="terminal-body">
            <div class="terminal-row">
              <span class="prompt-symbol">&gt;</span>
              <span class="cmd-text">© 2026 No Tokens. Built for Startup Buildathon India 2026 submission.</span>
            </div>
            <div class="terminal-quote-side">
              There's no AI without <em>I</em> in it.
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.monolog-page {
  width: 100%;
  min-height: 100vh;
  background-color: #08090d;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  transition: background-color 0.4s ease, color 0.4s ease;
}

/* ==========================================================================
   PAPER LIGHT THEME MODE (Ultra-High Contrast, Tactile & Eye-Friendly)
   ========================================================================== */
.monolog-page.theme-light-active {
  background-color: #f8fafc; /* Crisp, eye-friendly Slate-50 base */
  color: #0f172a;
}

/* Light Mode Aurora Background (Soft warm amber bloom, no blinding white glare) */
.monolog-page.theme-light-active .aurora-stage {
  background: #f8fafc;
}

.monolog-page.theme-light-active .aurora-glow {
  opacity: 0.22;
  mix-blend-mode: normal;
  filter: blur(90px);
}

.monolog-page.theme-light-active .glow-corner-tl,
.monolog-page.theme-light-active .glow-corner-tr {
  background: radial-gradient(
    circle at center,
    rgba(251, 146, 60, 0.35) 0%,
    rgba(253, 186, 116, 0.18) 35%,
    transparent 70%
  );
}

.monolog-page.theme-light-active .glow-corner-bl,
.monolog-page.theme-light-active .glow-corner-br {
  background: radial-gradient(
    circle at center,
    rgba(251, 146, 60, 0.28) 0%,
    rgba(253, 186, 116, 0.14) 35%,
    transparent 70%
  );
}

.monolog-page.theme-light-active .glow-mid-center {
  background: radial-gradient(
    ellipse at center,
    rgba(251, 146, 60, 0.22) 0%,
    rgba(253, 186, 116, 0.10) 40%,
    transparent 75%
  );
  opacity: 0.20;
}

.monolog-page.theme-light-active .aurora-ribbon {
  display: none;
}

.monolog-page.theme-light-active .glass-noise-overlay {
  opacity: 0.03;
  mix-blend-mode: multiply;
}

/* High-Contrast Frosted Glass Panels in Light Mode */
.monolog-page.theme-light-active .frosted-glass-panel {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.04) !important;
  color: #0f172a !important;
}

.monolog-page.theme-light-active .frosted-glass-panel:hover {
  border-color: #ea580c !important;
  box-shadow: 0 12px 30px rgba(234, 88, 12, 0.10), 0 2px 6px rgba(15, 23, 42, 0.06) !important;
}

/* Navbar in Light Mode */
.monolog-page.theme-light-active .navbar-wrapper {
  background: rgba(248, 250, 252, 0.94);
  border-bottom: 1px solid #cbd5e1;
}

.monolog-page.theme-light-active .nav-slash {
  color: #94a3b8;
}

.monolog-page.theme-light-active .nav-path {
  color: #0f172a !important;
  font-weight: 700;
}

.monolog-page.theme-light-active .nav-pill {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
}

.monolog-page.theme-light-active .buildathon-pill {
  background: #fff7ed !important;
  border-color: #fdba74 !important;
  color: #c2410c !important;
  font-weight: 700;
}

.monolog-page.theme-light-active .back-pill {
  color: #334155 !important;
  font-weight: 600;
}

/* Hero Section in Light Mode */
.monolog-page.theme-light-active .hero-eyebrow {
  color: #c2410c !important;
  font-weight: 800;
}

.monolog-page.theme-light-active .hero-title {
  color: #0f172a !important;
  text-shadow: none !important;
}

.monolog-page.theme-light-active .hero-tagline {
  color: #1e293b !important;
  font-weight: 450;
}

.monolog-page.theme-light-active .chip {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
}

.monolog-page.theme-light-active .meta-link-btn {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
  font-weight: 600;
}

.monolog-page.theme-light-active .meta-link-btn:hover {
  border-color: #ea580c !important;
  color: #ea580c !important;
  background: #fff7ed !important;
}

.monolog-page.theme-light-active .deck-btn {
  background: #fefce8 !important;
  border-color: #fde047 !important;
  color: #854d0e !important;
}

/* Section Headings in Light Mode */
.monolog-page.theme-light-active .section-title {
  color: #0f172a !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .section-meta-tag {
  color: #c2410c !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .design-meta-badge {
  color: #c2410c !important;
  font-weight: 700 !important;
}

/* Interface Design Tab Bar & Showcase */
.monolog-page.theme-light-active .design-card {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.monolog-page.theme-light-active .d-tab {
  background: #f1f5f9 !important;
  border: 1px solid #cbd5e1 !important;
  color: #1e293b !important;
  font-weight: 600 !important;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
}

.monolog-page.theme-light-active .d-tab:hover {
  background: #e2e8f0 !important;
  color: #0f172a !important;
  border-color: #94a3b8 !important;
}

.monolog-page.theme-light-active .d-tab.active {
  background: #ea580c !important;
  border-color: #c2410c !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.30) !important;
  text-shadow: none !important;
}

.monolog-page.theme-light-active .board-viewport {
  background: #f8fafc !important;
  border: 1px solid #cbd5e1 !important;
}

.monolog-page.theme-light-active .board-overlay {
  background: rgba(15, 23, 42, 0.88) !important;
  color: #ffffff !important;
}

.monolog-page.theme-light-active .wf-card {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05) !important;
}

.monolog-page.theme-light-active .wf-img-wrap {
  background: #f1f5f9 !important;
}

.monolog-page.theme-light-active .wf-title {
  color: #0f172a !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .wf-desc {
  color: #475569 !important;
}

.monolog-page.theme-light-active .board-caption {
  color: #0f172a !important;
  font-weight: 500 !important;
}

.monolog-page.theme-light-active .board-footer-bar {
  border-top-color: #e2e8f0 !important;
}

.monolog-page.theme-light-active .sub-switch-btn {
  background: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #475569 !important;
}

.monolog-page.theme-light-active .sub-switch-btn:hover {
  background: #f1f5f9 !important;
  color: #0f172a !important;
}

.monolog-page.theme-light-active .sub-switch-btn.active {
  background: #fff7ed !important;
  border-color: #ea580c !important;
  color: #ea580c !important;
  font-weight: 700 !important;
}

/* 4 Interactions Feature Menu in Light Mode */
.monolog-page.theme-light-active .feat-item-card {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.monolog-page.theme-light-active .feat-item-card.is-active {
  background: linear-gradient(180deg, #ffffff 0%, #fff7ed 100%) !important;
  border-color: #ea580c !important;
  box-shadow: 0 6px 20px rgba(234, 88, 12, 0.15) !important;
}

.monolog-page.theme-light-active .feat-number {
  color: #ea580c !important;
  font-weight: 800 !important;
}

.monolog-page.theme-light-active .feat-tag {
  background: #f1f5f9 !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .feat-title {
  color: #0f172a !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .feat-sub {
  color: #334155 !important;
  font-weight: 500 !important;
}

.monolog-page.theme-light-active .feat-desc {
  color: #475569 !important;
}

.monolog-page.theme-light-active .device-frame {
  border-color: #cbd5e1 !important;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12) !important;
}

.monolog-page.theme-light-active .device-zoom-pill {
  background: rgba(15, 23, 42, 0.88) !important;
  color: #ffffff !important;
}

/* Privacy Section in Light Mode */
.monolog-page.theme-light-active .privacy-card {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.monolog-page.theme-light-active .privacy-heading {
  color: #0f172a !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .privacy-sub {
  color: #334155 !important;
}

.monolog-page.theme-light-active .pillar-box {
  background: #f8fafc !important;
  border: 1px solid #cbd5e1 !important;
}

.monolog-page.theme-light-active .pillar-box .p-num {
  color: #ea580c !important;
  font-weight: 800 !important;
}

.monolog-page.theme-light-active .pillar-box h4 {
  color: #0f172a !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .pillar-box p {
  color: #334155 !important;
}

/* Google Stack in Light Mode */
.monolog-page.theme-light-active .stack-item {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}

.monolog-page.theme-light-active .stack-item .s-category {
  color: #ea580c !important;
  font-weight: 800 !important;
}

.monolog-page.theme-light-active .stack-item h4 {
  color: #0f172a !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .stack-item p {
  color: #334155 !important;
}

/* Terminal Footer in Light Mode (High Contrast & Clear Readability) */
.monolog-page.theme-light-active .terminal-footer {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08) !important;
}

.monolog-page.theme-light-active .terminal-header {
  background: #f1f5f9 !important;
  border-bottom: 1px solid #cbd5e1 !important;
}

.monolog-page.theme-light-active .terminal-title {
  color: #334155 !important;
  font-weight: 600 !important;
}

.monolog-page.theme-light-active .status-label {
  color: #15803d !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .status-indicator.live {
  background: #16a34a !important;
  box-shadow: 0 0 6px rgba(22, 163, 74, 0.5) !important;
}

.monolog-page.theme-light-active .terminal-body {
  background: #ffffff !important;
}

.monolog-page.theme-light-active .prompt-symbol {
  color: #ea580c !important;
  font-weight: 700 !important;
}

.monolog-page.theme-light-active .cmd-text {
  color: #0f172a !important;
  font-weight: 600 !important;
}

.monolog-page.theme-light-active .terminal-quote-side {
  color: #0f172a !important;
  font-weight: 800 !important;
  text-shadow: none !important;
}

.monolog-page.theme-light-active .terminal-quote-side em {
  color: #ea580c !important;
  font-weight: 800 !important;
}

/* Light Mode Abyss Glow (Soft warm halo that never bleeds over or washes out text) */
.monolog-page.theme-light-active .abyss-glow {
  background: radial-gradient(
    ellipse 60% 70% at 50% 100%,
    rgba(249, 115, 22, 0.16) 0%,
    rgba(251, 146, 60, 0.08) 35%,
    transparent 75%
  ) !important;
  filter: blur(50px) !important;
  opacity: 0.5 !important;
}

/* Immersive Dynamic Orange Aurora & Gradient Glass Background (Viewport Fixed) */
.aurora-stage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.aurora-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(95px);
  pointer-events: none;
  will-change: transform, opacity;
}

/* Top-Left Corner Orange Aurora */
.glow-corner-tl {
  top: -15vh;
  left: -12vw;
  width: 58vw;
  height: 58vw;
  max-width: 820px;
  max-height: 820px;
  background: radial-gradient(
    circle at center,
    rgba(255, 152, 56, 0.38) 0%,
    rgba(249, 115, 22, 0.28) 32%,
    rgba(249, 115, 22, 0.10) 58%,
    transparent 78%
  );
  animation: aurora-float-tl 18s ease-in-out infinite alternate;
}

/* Top-Right Corner Orange Aurora */
.glow-corner-tr {
  top: -15vh;
  right: -12vw;
  width: 58vw;
  height: 58vw;
  max-width: 820px;
  max-height: 820px;
  background: radial-gradient(
    circle at center,
    rgba(255, 152, 56, 0.36) 0%,
    rgba(249, 115, 22, 0.26) 32%,
    rgba(249, 115, 22, 0.09) 58%,
    transparent 78%
  );
  animation: aurora-float-tr 22s ease-in-out infinite alternate;
}

/* Bottom-Left Corner Orange Aurora */
.glow-corner-bl {
  bottom: -18vh;
  left: -12vw;
  width: 52vw;
  height: 52vw;
  max-width: 740px;
  max-height: 740px;
  background: radial-gradient(
    circle at center,
    rgba(249, 115, 22, 0.30) 0%,
    rgba(255, 152, 56, 0.18) 35%,
    rgba(249, 115, 22, 0.06) 62%,
    transparent 78%
  );
  animation: aurora-float-bl 20s ease-in-out infinite alternate;
}

/* Bottom-Right Corner Orange Aurora */
.glow-corner-br {
  bottom: -18vh;
  right: -12vw;
  width: 52vw;
  height: 52vw;
  max-width: 740px;
  max-height: 740px;
  background: radial-gradient(
    circle at center,
    rgba(249, 115, 22, 0.30) 0%,
    rgba(255, 152, 56, 0.18) 35%,
    rgba(249, 115, 22, 0.06) 62%,
    transparent 78%
  );
  animation: aurora-float-br 24s ease-in-out infinite alternate;
}

/* Mid-Center Orange Aurora */
.glow-mid-center {
  top: 45vh;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vw;
  height: 55vw;
  max-width: 920px;
  max-height: 700px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 152, 56, 0.24) 0%,
    rgba(249, 115, 22, 0.16) 35%,
    rgba(249, 115, 22, 0.05) 65%,
    transparent 82%
  );
  animation: aurora-pulse-center 16s ease-in-out infinite alternate;
}

/* Atmospheric Orange Aurora Ribbon (Soft Diagonal Glow Bleed) */
.aurora-ribbon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(249, 115, 22, 0.12) 0%,
    transparent 30%,
    rgba(255, 152, 56, 0.08) 50%,
    transparent 70%,
    rgba(249, 115, 22, 0.12) 100%
  );
  mix-blend-mode: screen;
  filter: blur(55px);
  pointer-events: none;
}

/* Tactile Frosted Glass Stipple Overlay */
.glass-noise-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.038'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.85;
}

/* Motion Keyframes for Ambient Corner & Center Floating */
@keyframes aurora-float-tl {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(45px, 35px) scale(1.08); }
  100% { transform: translate(-25px, 45px) scale(0.96); }
}

@keyframes aurora-float-tr {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-45px, 40px) scale(1.10); }
  100% { transform: translate(30px, -25px) scale(0.95); }
}

@keyframes aurora-float-bl {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -35px) scale(1.07); }
  100% { transform: translate(-30px, 25px) scale(0.97); }
}

@keyframes aurora-float-br {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, -30px) scale(1.09); }
  100% { transform: translate(35px, 25px) scale(0.95); }
}

@keyframes aurora-pulse-center {
  0% { transform: translate(-50%, -50%) scale(0.94); opacity: 0.8; }
  50% { transform: translate(-50%, -46%) scale(1.10); opacity: 1; }
  100% { transform: translate(-50%, -52%) scale(1.02); opacity: 0.88; }
}

/* Gradient Glass Panel Styling */
.frosted-glass-panel {
  background: linear-gradient(180deg, rgba(24, 24, 28, 0.72) 0%, rgba(20, 20, 24, 0.60) 100%);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.frosted-glass-panel:hover {
  border-color: rgba(249, 115, 22, 0.38);
  border-top-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(249, 115, 22, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.16);
  background: linear-gradient(180deg, rgba(28, 28, 34, 0.78) 0%, rgba(22, 22, 28, 0.68) 100%);
}

/* Navbar Wrapper */
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 30;
  width: 100%;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  background: rgba(8, 9, 13, 0.6);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.monolog-page.theme-light-active .navbar-wrapper {
  background: rgba(246, 248, 251, 0.7);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease;
}

.brand-logo:hover {
  transform: scale(1.08);
  filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.65));
}

.nav-slash {
  color: rgba(255, 255, 255, 0.25);
  font-family: var(--font-mono);
  font-size: 1.1rem;
}

.nav-path {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--color-accent);
  font-weight: 600;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-pill {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
  padding: 0.32rem 0.72rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-pill:hover {
  background: rgba(249, 115, 22, 0.12);
  color: var(--color-accent);
  border-color: rgba(249, 115, 22, 0.45);
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.18);
  transform: translateY(-1px);
}

.buildathon-pill {
  border-color: rgba(249, 115, 22, 0.35);
  background: rgba(249, 115, 22, 0.08);
  color: #ffedd5;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 6px var(--color-accent);
}

.back-pill {
  color: var(--color-text-muted);
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5rem;
  padding-top: 1.5rem;
  padding-bottom: 4rem;
}

/* Hero Section */
.hero-section {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 3.5rem;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-accent);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.hero-title {
  font-family: var(--font-cursive);
  font-size: clamp(2.4rem, 6vw, 4.6rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.25;
  color: var(--color-hero-font);
  margin-bottom: 0.5rem;
  text-shadow: 0 0 35px rgba(249, 115, 22, 0.25);
}

.terminal-dot {
  font-family: var(--font-mono);
  color: var(--color-accent);
  animation: terminalBlink 1.1s steps(2, start) infinite;
  display: inline-block;
  font-weight: 700;
  margin-left: 6px;
}

@keyframes terminalBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.hero-tagline {
  font-family: var(--font-sans);
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  font-weight: 350;
  color: var(--color-text-muted);
  line-height: 1.65;
  max-width: 580px;
}

.tagline-brand {
  font-family: var(--font-cursive);
  font-size: 1.18em;
  color: var(--color-accent);
  letter-spacing: 0.02em;
}

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.25rem;
}

.chip {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d1d5db;
  backdrop-filter: blur(10px);
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.meta-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-accent);
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.meta-link-btn:hover {
  background: rgba(249, 115, 22, 0.18);
  border-color: rgba(249, 115, 22, 0.5);
  transform: translateY(-1px);
}

.deck-btn {
  color: #fde047;
  border-color: rgba(250, 204, 21, 0.35);
  background: rgba(250, 204, 21, 0.08);
}

.deck-btn:hover {
  background: rgba(250, 204, 21, 0.18);
  border-color: rgba(250, 204, 21, 0.6);
}



/* ==========================================================================
   REALISTIC MONOLOG MOBILE PHONE & BORDERLESS KEYBOARD
   (Faithfully matching Canva / Figma high-res phone mockups)
   ========================================================================== */
.hero-right {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Smartphone Device Chassis */
.phone-device-chassis {
  width: 100%;
  max-width: 410px;
  background: #050505;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 40px;
  padding: 1.15rem 1.15rem 0.85rem 1.15rem;
  box-shadow: 
    0 25px 70px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: relative;
  overflow: hidden;
  transition: all 0.35s ease;
}

.phone-device-chassis.light {
  background: #ffffff;
  border-color: rgba(15, 23, 42, 0.12);
  box-shadow: 
    0 25px 60px rgba(15, 23, 42, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  color: #0f172a;
}

/* Android Status Bar */
.phone-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.4rem 0.15rem 0.4rem;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  color: #e2e8f0;
}

.phone-device-chassis.light .phone-status-bar {
  color: #0f172a;
}

.status-time {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.camera-punch-hole {
  width: 10px;
  height: 10px;
  background: #111;
  border-radius: 50%;
  border: 1.5px solid #222;
  box-shadow: inset 0 0 3px rgba(0,0,0,0.8);
}

.phone-device-chassis.light .camera-punch-hole {
  background: #1e293b;
  border-color: #334155;
}

.status-right-icons {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.theme-toggle-micro {
  display: flex;
  gap: 2px;
  background: rgba(255, 255, 255, 0.08);
  padding: 2px;
  border-radius: 9999px;
  margin-right: 0.2rem;
}

.phone-device-chassis.light .theme-toggle-micro {
  background: rgba(0, 0, 0, 0.06);
}

.theme-micro-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-micro-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.phone-device-chassis.light .theme-micro-btn.active {
  background: #0f172a;
  color: #ffffff;
}

.network-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.battery-text {
  font-size: 0.65rem;
}

.battery-icon-pill {
  width: 18px;
  height: 9px;
  border: 1.2px solid currentColor;
  border-radius: 2.5px;
  padding: 1px;
  display: flex;
  align-items: center;
  position: relative;
}

.battery-icon-pill::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 2px;
  width: 1.5px;
  height: 3px;
  background: currentColor;
  border-radius: 0 1px 1px 0;
}

.battery-level {
  width: 100%;
  height: 100%;
  background: currentColor;
  border-radius: 1px;
}

/* Simulated Host Chat Header */
.sim-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.2rem;
}

.chat-contact-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.chat-back-arrow {
  font-size: 1rem;
  color: #94a3b8;
  cursor: pointer;
}

.chat-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #334155;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.phone-device-chassis.light .chat-avatar {
  background: #e2e8f0;
  color: #334155;
}

.chat-contact-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #f8fafc;
}

.phone-device-chassis.light .chat-contact-name {
  color: #0f172a;
}

.chat-more-dots {
  color: #94a3b8;
  font-size: 1.1rem;
  cursor: pointer;
}

/* Chat Conversation Flow */
.sim-chat-conversation {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.2rem 0.1rem;
}

.chat-date-pill {
  align-self: center;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.05em;
  color: #64748b;
  text-transform: uppercase;
}

.chat-bubble {
  max-width: 78%;
  padding: 0.55rem 0.85rem;
  border-radius: 18px;
  font-size: 0.82rem;
  line-height: 1.4;
}

.bubble-received {
  align-self: flex-start;
  background: #1d1d1f;
  color: #f1f5f9;
  border-bottom-left-radius: 4px;
}

.phone-device-chassis.light .bubble-received {
  background: #f4f5f8;
  color: #0f172a;
}

.bubble-sent {
  align-self: flex-end;
  background: #ffffff;
  color: #050505;
  font-weight: 500;
  border-bottom-right-radius: 4px;
}

.phone-device-chassis.light .bubble-sent {
  background: #1d1d1f;
  color: #ffffff;
}

/* Host Input Field */
.sim-chat-input-bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.1rem 0;
}

.chat-attach-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.phone-device-chassis.light .chat-attach-btn {
  background: #f1f5f9;
  color: #475569;
}

.chat-input-capsule {
  flex: 1;
  background: #1d1d1f;
  border-radius: 9999px;
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.phone-device-chassis.light .chat-input-capsule {
  background: #f4f5f8;
  color: #0f172a;
}

.chat-input-text {
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-send-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #f8fafc;
  color: #050505;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.chat-send-btn:hover {
  transform: scale(1.06);
}

.phone-device-chassis.light .chat-send-btn {
  background: #0f172a;
  color: #ffffff;
}

/* Picture-in-Picture AI Drawer (Matches AI Mode.png) */
.pip-ai-drawer {
  background: #161618;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
}

.phone-device-chassis.light .pip-ai-drawer {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 16px 40px rgba(100, 116, 139, 0.18);
}

.pip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pip-title {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #f8fafc;
}

.phone-device-chassis.light .pip-title {
  color: #0f172a;
}

.pip-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pip-expand-icon {
  font-size: 0.8rem;
  color: #94a3b8;
  cursor: pointer;
}

.pip-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.pip-search-box {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.45rem 0.65rem;
  font-size: 0.76rem;
  color: #cbd5e1;
}

.phone-device-chassis.light .pip-search-box {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #334155;
}

.pip-answer-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 0.65rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.phone-device-chassis.light .pip-answer-card {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.pip-answer-heading {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: #f8fafc;
}

.phone-device-chassis.light .pip-answer-heading {
  color: #0f172a;
}

.pip-answer-bullets {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.74rem;
  color: #94a3b8;
  line-height: 1.45;
}

.phone-device-chassis.light .pip-answer-bullets {
  color: #475569;
}

.pip-sources-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.2rem;
}

.sources-link {
  font-size: 0.68rem;
  color: #38bdf8;
  cursor: pointer;
}

.pip-insert-btn {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  background: rgba(249, 115, 22, 0.16);
  color: var(--color-accent);
  border: 1px solid rgba(249, 115, 22, 0.35);
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pip-insert-btn:hover {
  background: var(--color-accent);
  color: #ffffff;
}

.pip-followup-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 9999px;
  padding: 0.4rem 0.75rem;
  font-size: 0.74rem;
  color: #64748b;
}

.phone-device-chassis.light .pip-followup-bar {
  background: #f1f5f9;
  color: #64748b;
}

.followup-icons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
}

/* Floating Vox Mode Drawer (Matches monolog-vox-mode.png) */
.vox-mode-drawer {
  background: #14131d;
  border: 1px solid rgba(192, 132, 252, 0.45);
  border-radius: 22px;
  padding: 0.95rem;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(192, 132, 252, 0.18);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.phone-device-chassis.light .vox-mode-drawer {
  background: #ffffff;
  border-color: rgba(147, 51, 234, 0.35);
  box-shadow: 0 16px 45px rgba(100, 116, 139, 0.15), 0 0 20px rgba(147, 51, 234, 0.1);
}

.vox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vox-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #c084fc;
}

.phone-device-chassis.light .vox-title {
  color: #7e22ce;
}

.vox-kb-icon {
  font-size: 0.9rem;
  color: #94a3b8;
}

.vox-divider {
  color: #475569;
}

.vox-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.vox-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #f1f5f9;
}

.phone-device-chassis.light .vox-status {
  color: #1e293b;
}

.vox-live-dot {
  width: 7px;
  height: 7px;
  background: #c084fc;
  border-radius: 50%;
  box-shadow: 0 0 8px #c084fc;
  animation: pulse-glow 1.2s infinite;
}

.vox-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3.5px;
  height: 42px;
  width: 100%;
}

.wave-bar {
  width: 3px;
  height: 8px;
  background: linear-gradient(180deg, #c084fc 0%, #60a5fa 100%);
  border-radius: 9999px;
  animation: wave-bounce 1.1s ease-in-out infinite alternate;
}

@keyframes wave-bounce {
  0% { height: 6px; opacity: 0.35; }
  100% { height: 36px; opacity: 1; }
}

.vox-copy {
  font-size: 0.74rem;
  color: #94a3b8;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

.phone-device-chassis.light .vox-copy {
  color: #475569;
}

.vox-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 0.2rem;
}

.vox-lang-tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.25rem 0.55rem;
  border-radius: 8px;
}

.phone-device-chassis.light .vox-lang-tag {
  background: #f1f5f9;
  color: #334155;
}

.vox-pause-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  color: #050505;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.phone-device-chassis.light .vox-pause-btn {
  background: #0f172a;
  color: #ffffff;
}

.vox-done-btn {
  background: #c084fc;
  color: #050505;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  border-radius: 9999px;
  padding: 0.35rem 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vox-done-btn:hover {
  background: #d8b4fe;
  transform: scale(1.03);
}

/* Toast for Context Trigger */
.context-toast {
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(249, 115, 22, 0.45);
  backdrop-filter: blur(16px);
  color: #ffedd5;
  font-size: 0.74rem;
  padding: 0.55rem 0.85rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.phone-device-chassis.light .context-toast {
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* ==========================================================================
   THE REALISTIC BORDERLESS AURORA KEYBOARD UI
   ========================================================================== */
.borderless-keyboard {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 0.35rem;
  background: 
    radial-gradient(circle at 85% 95%, rgba(139, 92, 246, 0.20) 0%, rgba(99, 102, 241, 0.10) 35%, transparent 70%),
    radial-gradient(circle at 15% 90%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
    #050505;
  border-radius: 28px;
  padding: 0.6rem 0.4rem 0.3rem 0.4rem;
  transition: background 0.35s ease;
}

.phone-device-chassis.light .borderless-keyboard {
  background: 
    radial-gradient(circle at 85% 95%, rgba(242, 234, 254, 0.9) 0%, rgba(232, 237, 255, 0.6) 40%, transparent 75%),
    #ffffff;
}

/* Keyboard Toolbar */
.kb-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
  padding: 0 0.25rem 0.2rem 0.25rem;
}

.kb-chevron-btn {
  background: none;
  border: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 6px;
  transition: color 0.15s ease;
}

.kb-chevron-btn:hover {
  color: #f1f5f9;
}

.phone-device-chassis.light .kb-chevron-btn:hover {
  color: #0f172a;
}

.kb-suggestion-capsule {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #1d1d1f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  color: #f1f5f9;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kb-suggestion-capsule:hover {
  background: #2a2a2e;
  border-color: rgba(255, 255, 255, 0.18);
}

.phone-device-chassis.light .kb-suggestion-capsule {
  background: #f4f5f8;
  border-color: rgba(0, 0, 0, 0.06);
  color: #1e293b;
}

.phone-device-chassis.light .kb-suggestion-capsule:hover {
  background: #e9ecf2;
}

.sug-clock-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.sug-text {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Vox Key */
.vox-key-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vox-shortcuts-popup {
  position: absolute;
  bottom: calc(100% + 10px);
  right: -20px;
  width: 175px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 0.5rem;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04);
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  animation: popUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.phone-device-chassis:not(.light) .vox-shortcuts-popup {
  background: #18181b;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75);
}

.vox-pop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.15rem 0.35rem 0.3rem 0.35rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.phone-device-chassis:not(.light) .vox-pop-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.vox-pop-title {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  font-weight: 700;
}

.phone-device-chassis:not(.light) .vox-pop-title {
  color: #94a3b8;
}

.vox-pop-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.vox-pop-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vox-pop-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.4rem 0.55rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 0.76rem;
  font-weight: 500;
  color: #0f172a;
  cursor: pointer;
  text-align: left;
  transition: all 0.12s ease;
}

.phone-device-chassis:not(.light) .vox-pop-item {
  color: #f1f5f9;
}

.vox-pop-item:hover {
  background: #f1f5f9;
  color: #ea580c;
}

.phone-device-chassis:not(.light) .vox-pop-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fb923c;
}

.pop-icon {
  flex-shrink: 0;
  color: #64748b;
}

.vox-pop-item:hover .pop-icon {
  color: currentColor;
}

.vox-dictate-opt {
  margin-top: 2px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 0.45rem;
  color: #7c3aed;
  font-weight: 600;
}

.phone-device-chassis:not(.light) .vox-dictate-opt {
  border-top-color: rgba(255, 255, 255, 0.08);
  color: #c084fc;
}

.vox-mic-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.vox-mic-btn:hover {
  color: #c084fc;
}

.vox-mic-btn.active {
  background: rgba(192, 132, 252, 0.22);
  color: #e9d5ff;
  box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.25);
}

.phone-device-chassis.light .vox-mic-btn {
  color: #334155;
}

.phone-device-chassis.light .vox-mic-btn.active {
  background: #f3e8ff;
  color: #7e22ce;
  box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.15);
}

.vox-pulse-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  background: #c084fc;
  border-radius: 50%;
  box-shadow: 0 0 6px #c084fc;
  animation: pulse-glow 1.4s infinite;
}

/* M Signature Key (3D White Tactile Button) */
.m-signature-btn {
  width: 33px;
  height: 33px;
  border-radius: 10px;
  border: none;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  flex-shrink: 0;
}

.m-signature-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.45);
}

.m-signature-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.phone-device-chassis.light .m-signature-btn {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.m-signature-logo {
  width: 22px;
  height: 22px;
  display: block;
}

/* Borderless QWERTY Grid */
.kb-keys-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0.1rem 0;
}

.kb-row {
  display: flex;
  justify-content: center;
  gap: 2px;
  width: 100%;
}

.indent-row {
  padding: 0 4.5%;
}

.action-row-3 {
  display: flex;
  align-items: center;
}

/* Borderless Keycaps */
.borderless-key {
  flex: 1;
  max-width: 36px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", sans-serif;
  font-size: 1.12rem;
  font-weight: 450;
  color: #ffffff;
  user-select: none;
  cursor: pointer;
  border-radius: 7px;
  background: transparent;
  border: none;
  transition: background 0.12s ease;
}

.borderless-key:hover {
  background: rgba(255, 255, 255, 0.10);
}

.borderless-key:active {
  background: rgba(255, 255, 255, 0.20);
  transform: scale(0.96);
}

.phone-device-chassis.light .borderless-key {
  color: #0f172a;
}

.phone-device-chassis.light .borderless-key:hover {
  background: rgba(0, 0, 0, 0.06);
}

.phone-device-chassis.light .borderless-key:active {
  background: rgba(0, 0, 0, 0.12);
}

.mod-key {
  font-size: 1.1rem;
  color: #94a3b8;
  max-width: 44px;
}

.phone-device-chassis.light .mod-key {
  color: #475569;
}

/* Bottom Controls Row */
.bottom-controls-row {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-top: 2px;
}

.mod-pill {
  font-size: 0.85rem;
  color: #cbd5e1;
  max-width: 46px;
}

.emoji-globe-pill {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.95rem;
}

.globe-symbol {
  font-size: 0.8rem;
  opacity: 0.75;
}

/* Spacebar Capsule */
.spacebar-capsule {
  flex: 3.5;
  height: 38px;
  border-radius: 9999px;
  background: #1d1d1f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.15s ease;
}

.spacebar-capsule:hover {
  background: #2a2a2e;
  border-color: rgba(255, 255, 255, 0.18);
}

.space-lightning-icon {
  color: var(--color-accent);
}

.phone-device-chassis.light .spacebar-capsule {
  background: #e8edff;
  border-color: rgba(0, 0, 0, 0.05);
  color: #1e293b;
}

.phone-device-chassis.light .spacebar-capsule:hover {
  background: #dfe6ff;
}

/* Incognito Period Key */
.incognito-period-key {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
  gap: 1px;
}

.incognito-eye-icon {
  opacity: 0.75;
  color: #94a3b8;
  transition: all 0.15s ease;
}

.phone-device-chassis.light .incognito-eye-icon {
  color: #64748b;
}

.incognito-period-key.incognito-active .incognito-eye-icon {
  opacity: 1;
  color: var(--color-accent);
  filter: drop-shadow(0 0 4px rgba(249, 115, 22, 0.5));
}

.period-dot {
  font-size: 1.1rem;
  margin-top: -3px;
}

/* Return Action Key */
.enter-action-key {
  width: 44px;
  height: 38px;
  border-radius: 9999px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.enter-action-key:hover {
  background: rgba(255, 255, 255, 0.16);
}

.phone-device-chassis.light .enter-action-key {
  background: #0f172a;
  color: #ffffff;
}

.phone-device-chassis.light .enter-action-key:hover {
  background: #1e293b;
}

/* Android Home Navigation Line */
.android-home-bar-wrap {
  display: flex;
  justify-content: center;
  padding-top: 0.45rem;
}

.android-home-indicator {
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 9999px;
}

.phone-device-chassis.light .android-home-indicator {
  background: rgba(0, 0, 0, 0.3);
}

/* Monolog Official Logo Elements */
.nav-monolog-branding {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.nav-monolog-logo {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  display: block;
}

.hero-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.hero-logo-badge {
  width: clamp(44px, 5.5vw, 58px);
  height: clamp(44px, 5.5vw, 58px);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.45);
  flex-shrink: 0;
  display: block;
  transition: transform 0.25s ease;
}

.hero-logo-badge:hover {
  transform: scale(1.06) rotate(-2deg);
}

.m-key-icon {
  width: 19px;
  height: 19px;
  border-radius: 4px;
  pointer-events: none;
  display: block;
}

.inline-feat-logo {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  vertical-align: -3px;
  margin: 0 4px;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
}

.inline-desc-logo {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  vertical-align: -2px;
  margin: 0 3px;
  display: inline-block;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.inline-hint-logo {
  width: 15px;
  height: 15px;
  border-radius: 3px;
  vertical-align: -2px;
  margin: 0 3px;
  display: inline-block;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Sections Common Structure */
.section-block {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.section-title {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  color: var(--color-text-muted);
  font-weight: 500;
  letter-spacing: -0.01em;
}

.section-meta-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
}

.design-meta-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.mcp-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 6px var(--color-accent);
}

/* Section: Design Card (Interface Showcase) */
.design-card {
  border-radius: 20px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.design-tab-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.d-tab {
  padding: 0.45rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.d-tab:hover {
  color: #f3f4f6;
  background: rgba(255, 255, 255, 0.08);
}

.d-tab.active {
  background: rgba(249, 115, 22, 0.16);
  border-color: rgba(249, 115, 22, 0.45);
  color: #ffedd5;
}

.board-viewport {
  position: relative;
  width: 100%;
  max-height: 520px;
  background: #090a0d;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.board-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.phone-viewport {
  padding: 1.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, rgba(9, 10, 13, 0.95) 70%);
}

.phone-board-image {
  max-height: 480px;
  width: auto;
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.board-viewport:hover .board-image {
  transform: scale(1.01);
}

.board-overlay {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(17, 19, 27, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.wireframes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.wf-card {
  background: #090a0d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: all 0.25s ease;
}

.wf-card:hover {
  border-color: rgba(255, 107, 0, 0.45);
  transform: translateY(-2px);
}

.wf-img-wrap {
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-radius: 8px;
  background: #050608;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wf-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.wf-card:hover .wf-img {
  transform: scale(1.04);
}

.wf-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.wf-title {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: #f1f5f9;
}

.wf-desc {
  font-size: 0.74rem;
  color: #94a3b8;
  line-height: 1.4;
  margin: 0;
}

.board-footer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.board-caption {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  max-width: 600px;
}



/* Section: 4 Features Split Grid */
.features-split-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 2rem;
  align-items: center;
}

.features-menu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.feat-item-card {
  border-radius: 16px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  cursor: pointer;
}

.feat-item-card.is-active {
  border-color: rgba(249, 115, 22, 0.45);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(249, 115, 22, 0.16);
  background: linear-gradient(180deg, rgba(30, 26, 24, 0.75) 0%, rgba(24, 20, 20, 0.65) 100%);
}

.feat-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feat-number {
  font-size: 0.75rem;
  color: var(--color-accent);
}

.feat-tag {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.06);
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
}

.feat-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f3f4f6;
  margin-top: 0.2rem;
}

.feat-sub {
  font-size: 0.8rem;
  color: #9ca3af;
  line-height: 1.4;
}

.feat-desc {
  font-size: 0.78rem;
  color: #6b7280;
  line-height: 1.4;
  margin-top: 0.2rem;
}

.features-preview-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.preview-sub-switch,
.ink-sub-switch {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 0.85rem;
  width: 100%;
}

.ink-tab-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.sub-switch-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  padding: 0.4rem 0.85rem;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sub-switch-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
}

.sub-switch-btn.active {
  background: rgba(255, 107, 0, 0.16);
  border-color: rgba(255, 107, 0, 0.5);
  color: #ff8c37;
  font-weight: 600;
}

.device-frame {
  position: relative;
  width: 100%;
  max-width: 320px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(249, 115, 22, 0.12);
  transition: transform 0.3s ease;
}

.device-frame:hover {
  transform: translateY(-4px) scale(1.02);
}

.device-screen {
  width: 100%;
  height: auto;
  display: block;
}

.device-zoom-pill {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(17, 19, 27, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

/* Privacy Section */
.privacy-card {
  border-radius: 20px;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.privacy-lead {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
}

.privacy-lead-text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.privacy-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-hero-font);
}

.privacy-sub {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.privacy-pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.pillar-box {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.p-num {
  font-size: 0.75rem;
  color: var(--color-accent);
}

.pillar-box h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f3f4f6;
}

.pillar-box p {
  font-size: 0.82rem;
  color: #9ca3af;
  line-height: 1.5;
}

/* Stack Grid */
.stack-grid-clean {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.stack-item {
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.s-category {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-accent);
}

.stack-item h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-hero-font);
}

.stack-item p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}



/* Modal Lightbox */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(4, 5, 8, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-close {
  position: absolute;
  top: -2.5rem;
  right: 0;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
}

.modal-img {
  max-width: 100%;
  max-height: 82vh;
  object-fit: contain;
  border-radius: 14px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.modal-caption {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: #9ca3af;
}

.modal-raw {
  color: var(--color-accent);
  text-decoration: underline;
}

/* Terminal Footer */
.footer-wrapper {
  position: relative;
  margin-top: auto;
  padding-bottom: 2.5rem;
}

.abyss-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 280px;
  pointer-events: none;
  z-index: 1;
  transform: translateZ(0);
  overflow: hidden;
}

.abyss-glow {
  position: absolute;
  bottom: -30px;
  left: 0;
  width: 100%;
  height: calc(100% + 30px);
  background: radial-gradient(
    ellipse 50% 75% at 50% 100%,
    #ff9838 0%,
    #f97316 25%,
    rgba(249, 115, 22, 0.75) 50%,
    rgba(249, 115, 22, 0.25) 72%,
    transparent 92%
  );
  filter: blur(24px);
  transform: translateZ(0);
}

.footer-container {
  position: relative;
  z-index: 1;
}

.terminal-footer {
  border-radius: 18px;
  overflow: hidden;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.terminal-controls {
  display: flex;
  gap: 6px;
}

.t-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.t-red { background: #ef4444; }
.t-yellow { background: #eab308; }
.t-green { background: #22c55e; }

.terminal-title {
  color: var(--color-text-muted);
}

.terminal-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.status-indicator.live {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
}

.status-label {
  color: #22c55e;
  font-weight: 700;
}

.terminal-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.terminal-row {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.prompt-symbol {
  color: var(--color-accent);
}

.cmd-text {
  color: #9ca3af;
}

.terminal-quote-side {
  color: #f3f4f6;
  font-weight: 700;
  font-size: 0.95rem;
}

.terminal-quote-side em {
  color: var(--color-accent);
  font-style: normal;
}

/* Transitions & Media Queries */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-pip-enter-active, .slide-pip-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-pip-enter-from, .slide-pip-leave-to { opacity: 0; transform: translateY(-8px); }

/* ==========================================================================
   PRICING & PLANS SECTION (100% Faithful to Monolog Pro Mobile Screen)
   ========================================================================== */
.pricing-showcase-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-top: 1rem;
}

.pricing-header-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.pricing-badge-row {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  width: fit-content;
}

.pricing-logo-icon {
  width: 14px;
  height: 14px;
}

.pricing-badge-text {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}

.pricing-main-title {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: var(--color-hero-font);
  letter-spacing: -0.02em;
  margin: 0;
}

.pricing-sub-title {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 680px;
  line-height: 1.55;
  margin: 0;
}

.pricing-split-layout {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 3rem;
  align-items: start;
}

/* Recreated Interactive Mobile Subscription Screen */
.pricing-phone-card {
  border-radius: 36px;
  padding: 1.85rem 1.65rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: rgba(18, 19, 26, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  position: relative;
  overflow: hidden;
}

.monolog-page.theme-light-active .pricing-phone-card,
.pricing-phone-card.theme-paper {
  background: #ffffff;
  border-color: rgba(15, 23, 42, 0.12);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.plan-phone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.25rem;
}

.plan-back-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.2rem;
}

.plan-brand-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.plan-logo-img {
  width: 18px;
  height: 18px;
}

.plan-brand-name {
  font-family: var(--font-cursive);
  font-size: 1.15rem;
  color: #050505;
  font-weight: 400;
}

.plan-restore-btn {
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.15s ease;
}

.plan-restore-btn:hover {
  color: #f1f5f9;
}

.monolog-page.theme-light-active .plan-restore-btn:hover,
.pricing-phone-card.theme-paper .plan-restore-btn:hover {
  color: #0f172a;
}

.plan-phone-headline {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.plan-phone-headline h4 {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
  letter-spacing: -0.01em;
}

.monolog-page.theme-light-active .plan-phone-headline h4,
.pricing-phone-card.theme-paper .plan-phone-headline h4 {
  color: #0f172a;
}

.plan-phone-headline p {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0;
}

/* Tier Cards */
.plan-tier-card {
  border-radius: 20px;
  padding: 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.free-tier {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.monolog-page.theme-light-active .free-tier,
.pricing-phone-card.theme-paper .free-tier {
  background: #f8fafc;
  border-color: rgba(0, 0, 0, 0.06);
}

.pro-tier {
  background: 
    radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 0% 100%, rgba(56, 189, 248, 0.10) 0%, transparent 60%),
    rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(192, 132, 252, 0.35);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.monolog-page.theme-light-active .pro-tier,
.pricing-phone-card.theme-paper .pro-tier {
  background: 
    radial-gradient(circle at 100% 0%, rgba(242, 234, 254, 0.8) 0%, transparent 60%),
    radial-gradient(circle at 0% 100%, rgba(232, 237, 255, 0.8) 0%, transparent 60%),
    #ffffff;
  border-color: rgba(147, 51, 234, 0.25);
  box-shadow: 0 10px 30px rgba(147, 51, 234, 0.06);
}

.plan-tier-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.plan-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f8fafc;
}

.monolog-page.theme-light-active .plan-name,
.pricing-phone-card.theme-paper .plan-name {
  color: #0f172a;
}

.plan-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
}

.monolog-page.theme-light-active .plan-price,
.pricing-phone-card.theme-paper .plan-price {
  color: #0f172a;
}

.pro-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.plan-badge {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  padding: 0.15rem 0.45rem;
  background: rgba(192, 132, 252, 0.2);
  border: 1px solid rgba(192, 132, 252, 0.4);
  color: #c084fc;
  border-radius: 9999px;
  font-weight: 700;
}

.pro-lead-text {
  font-size: 0.76rem;
  color: #94a3b8;
}

/* Feature Lists */
.plan-feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.plan-feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.4;
}

.monolog-page.theme-light-active .plan-feature-list li,
.pricing-phone-card.theme-paper .plan-feature-list li {
  color: #334155;
}

.feat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  color: #64748b;
}

.monolog-page.theme-light-active .feat-icon,
.pricing-phone-card.theme-paper .feat-icon {
  color: #475569;
}

.pro-tier .feat-icon {
  color: #c084fc;
}

.monolog-page.theme-light-active .pro-tier .feat-icon,
.pricing-phone-card.theme-paper .pro-tier .feat-icon {
  color: #7c3aed;
}

.feat-icon-svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
}

.pro-list {
  gap: 0.65rem;
}

.feat-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.feat-text strong {
  font-size: 0.8rem;
  font-weight: 600;
  color: #f8fafc;
}

.monolog-page.theme-light-active .feat-text strong,
.pricing-phone-card.theme-paper .feat-text strong {
  color: #0f172a;
}

.feat-text small {
  font-size: 0.72rem;
  color: #94a3b8;
  line-height: 1.35;
}

.monolog-page.theme-light-active .feat-text small,
.pricing-phone-card.theme-paper .feat-text small {
  color: #64748b;
}

/* Billing Selector */
.plan-billing-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
  margin-top: 0.35rem;
}

.billing-option-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 0.75rem 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.billing-option-box:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.22);
}

.billing-option-box.active {
  background: rgba(255, 255, 255, 0.09);
  border-color: #f8fafc;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.monolog-page.theme-light-active .billing-option-box,
.pricing-phone-card.theme-paper .billing-option-box {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.monolog-page.theme-light-active .billing-option-box.active,
.pricing-phone-card.theme-paper .billing-option-box.active {
  background: #ffffff;
  border-color: #0f172a;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
}

.b-badge-wrap {
  position: absolute;
  top: -10px;
  left: 10px;
}

.b-savings-badge {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  background: #c084fc;
  color: #050505;
  border-radius: 9999px;
}

.b-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.b-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
}

.monolog-page.theme-light-active .b-label,
.pricing-phone-card.theme-paper .b-label {
  color: #475569;
}

.b-price-row {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
}

.b-price {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
}

.monolog-page.theme-light-active .b-price,
.pricing-phone-card.theme-paper .b-price {
  color: #0f172a;
}

.b-sub {
  font-size: 0.7rem;
  color: #94a3b8;
}

.b-billed-note {
  font-size: 0.65rem;
  color: #94a3b8;
  white-space: nowrap;
}

.b-radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.billing-option-box.active .b-radio-circle {
  border-color: #f8fafc;
}

.b-radio-circle.checked {
  background: #f8fafc;
  color: #050505;
  border-color: #f8fafc;
}

.monolog-page.theme-light-active .b-radio-circle,
.pricing-phone-card.theme-paper .b-radio-circle {
  border-color: #cbd5e1;
}

.monolog-page.theme-light-active .b-radio-circle.checked,
.pricing-phone-card.theme-paper .b-radio-circle.checked {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

.b-radio-dot {
  width: 8px;
  height: 8px;
  background: #f8fafc;
  border-radius: 50%;
}

.monolog-page.theme-light-active .b-radio-dot,
.pricing-phone-card.theme-paper .b-radio-dot {
  background: #0f172a;
}

/* Savings & Privacy Banners */
.plan-savings-banner {
  text-align: center;
  font-size: 0.72rem;
  color: #94a3b8;
  padding: 0.2rem 0;
}

.plan-privacy-guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-size: 0.74rem;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.04);
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
}

.monolog-page.theme-light-active .plan-privacy-guarantee,
.pricing-phone-card.theme-paper .plan-privacy-guarantee {
  background: #f1f5f9;
  color: #334155;
}

.guarantee-shield {
  color: var(--color-accent);
}

/* CTA Actions */
.plan-cta-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 0.25rem;
}

.plan-primary-cta {
  background: #f8fafc;
  color: #050505;
  border: none;
  border-radius: 9999px;
  padding: 0.85rem 1.25rem;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plan-primary-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255, 255, 255, 0.25);
}

.monolog-page.theme-light-active .plan-primary-cta,
.pricing-phone-card.theme-paper .plan-primary-cta {
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.15);
}

.monolog-page.theme-light-active .plan-primary-cta:hover,
.pricing-phone-card.theme-paper .plan-primary-cta:hover {
  background: #1e293b;
}

.plan-secondary-cta {
  background: transparent;
  color: #94a3b8;
  border: none;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.4rem;
  transition: color 0.15s ease;
}

.plan-secondary-cta:hover {
  color: #f1f5f9;
}

.monolog-page.theme-light-active .plan-secondary-cta:hover,
.pricing-phone-card.theme-paper .plan-secondary-cta:hover {
  color: #0f172a;
}

/* Footer Disclaimer */
.plan-footer-disclaimer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.68rem;
  color: #64748b;
  margin-top: -0.2rem;
}

.plan-footer-disclaimer p {
  margin: 0;
}

.plan-legal-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.dot-sep {
  opacity: 0.5;
}

/* Right: High-Res Phone Mockup Showcase */
.pricing-asset-showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.pricing-mockup-wrapper {
  position: relative;
  width: 100%;
  max-width: 380px;
  border-radius: 36px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.75), 0 0 40px rgba(192, 132, 252, 0.12);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pricing-mockup-wrapper:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.85), 0 0 50px rgba(192, 132, 252, 0.22);
}

.pricing-mockup-img {
  width: 100%;
  height: auto;
  display: block;
}

.mockup-hover-hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  pointer-events: none;
}

.pricing-caption-note {
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
}

.caption-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #f8fafc;
}

.monolog-page.theme-light-active .caption-title {
  color: #0f172a;
}

.caption-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0;
}

@media (max-width: 960px) {
  .pricing-split-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 960px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .features-split-grid {
    grid-template-columns: 1fr;
  }
  .features-menu {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.3rem;
  }
  .nav-pill {
    padding: 0.24rem 0.52rem;
    font-size: 0.72rem;
    gap: 0.3rem;
  }
}
</style>