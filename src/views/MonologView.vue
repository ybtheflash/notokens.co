<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Shield,
  Zap,
  Sparkles,
  ArrowLeft,
  FileText,
  Search,
  Sun,
  Moon,
  X,
  Eye,
  Mic
} from 'lucide-vue-next'

// Keyboard interactive widget state
const keyboardTheme = ref<'dark' | 'light'>('dark')
const activeInputText = ref('Meeting with team at 4 PM, need to finalize the slides')
const isAiDrawerOpen = ref(false)
const contextToast = ref<string | null>(null)
let toastTimer: number | null = null

const suggestions = [
  'call Amma at 6',
  'summarize my day',
  'what did I order?'
]

const applySuggestion = (s: string) => {
  activeInputText.value = s
}

const isVoxDrawerOpen = ref(false)

const toggleAiDrawer = () => {
  isAiDrawerOpen.value = !isAiDrawerOpen.value
  if (isAiDrawerOpen.value) isVoxDrawerOpen.value = false
}

const toggleVoxMode = () => {
  isVoxDrawerOpen.value = !isVoxDrawerOpen.value
  if (isVoxDrawerOpen.value) {
    isAiDrawerOpen.value = false
    if (toastTimer) clearTimeout(toastTimer)
    contextToast.value = '🎙️ Vox mode active · On-device Gemma speech formatting ready'
    toastTimer = window.setTimeout(() => {
      contextToast.value = null
    }, 3200)
  }
}

const triggerContextButton = () => {
  if (toastTimer) clearTimeout(toastTimer)
  contextToast.value = '📸 Screen context captured & voice memo ready to attach'
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
  <div class="monolog-page" :class="{ 'theme-light-active': keyboardTheme === 'light' }">
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
              <span class="chip">100% Google Stack</span>
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

          <!-- Right: Interactive Frosted Aurora Keyboard Mockup -->
          <div class="hero-right">
            <div class="keyboard-preview-wrapper" :class="[keyboardTheme]">
              <!-- Widget Top Control Bar -->
              <div class="widget-top-bar">
                <div class="widget-dots">
                  <span class="w-dot w-red"></span>
                  <span class="w-dot w-yellow"></span>
                  <span class="w-dot w-green"></span>
                </div>
                
                <div class="theme-toggle-pills">
                  <button 
                    class="theme-btn" 
                    :class="{ active: keyboardTheme === 'dark' }"
                    @click="keyboardTheme = 'dark'"
                    title="Ink Theme (Dark Aurora)"
                  >
                    <Moon :size="12" />
                    <span>Ink</span>
                  </button>
                  <button 
                    class="theme-btn" 
                    :class="{ active: keyboardTheme === 'light' }"
                    @click="keyboardTheme = 'light'"
                    title="Paper Theme (Light Aurora)"
                  >
                    <Sun :size="12" />
                    <span>Paper</span>
                  </button>
                </div>
              </div>

              <!-- Host App Input Field (Simulating WhatsApp / Chat typing) -->
              <div class="sim-host-input-wrap">
                <span class="input-label">Active Host App:</span>
                <div class="sim-host-input">
                  <span>{{ activeInputText }}</span>
                  <span class="cursor-blink">|</span>
                </div>
              </div>

              <!-- Floating Picture-in-Picture AI Drawer (Triggered by spacebar or lightning) -->
              <Transition name="slide-pip">
                <div v-if="isAiDrawerOpen" class="pip-ai-drawer">
                  <div class="pip-header">
                    <div class="pip-title">
                      <Sparkles :size="14" class="text-cyan" />
                      <span>Gemini Flash · Picture-in-Picture</span>
                    </div>
                    <button class="pip-close" @click="isAiDrawerOpen = false" aria-label="Close">
                      <X :size="13" />
                    </button>
                  </div>
                  <div class="pip-body">
                    <div class="pip-query">
                      <Search :size="12" class="text-muted" />
                      <span>"Flight details from Kolkata to Bengaluru tomorrow"</span>
                    </div>
                    <div class="pip-answer">
                      Found 3 non-stop flights via Google Search grounding. Lowest fare ₹4,290 on 6E-6184.
                    </div>
                    <div class="pip-sources">
                      <span class="source-tag">google.com/travel</span>
                      <span class="source-tag">indigo.in</span>
                      <button class="pip-paste-btn" @click="activeInputText = 'Flight 6E-6184 Kolkata to Bengaluru at ₹4,290'; isAiDrawerOpen = false">
                        Copy into chat
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Floating Vox Mode Drawer (Triggered by Vox Key / Microphone) -->
              <Transition name="slide-pip">
                <div v-if="isVoxDrawerOpen" class="vox-mode-drawer">
                  <div class="vox-header">
                    <div class="vox-title">
                      <Mic :size="14" class="text-purple" />
                      <span>Vox Mode · On-Device Dictation</span>
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
                      <span v-for="i in 18" :key="i" class="wave-bar" :style="{ animationDelay: `${(i % 6) * 0.12}s` }"></span>
                    </div>
                    <p class="vox-copy">
                      Speak naturally. Words appear as you talk. Punctuation and formatting, handled.
                    </p>
                    <div class="vox-controls">
                      <span class="vox-lang-tag">English ▾</span>
                      <button class="vox-done-btn" @click="activeInputText = 'Let\'s meet at the library at four. I\'ll bring the notes.'; isVoxDrawerOpen = false">
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Toast for Context Trigger -->
              <Transition name="fade">
                <div v-if="contextToast" class="context-toast">
                  {{ contextToast }}
                </div>
              </Transition>

              <!-- The Monolog Frosted Aurora Keyboard -->
              <div class="frosted-keyboard">
                <!-- Toolbar Row: Suggestions & Action Buttons -->
                <div class="kb-toolbar">
                  <!-- Lightning AI Button -->
                  <button 
                    class="kb-tool-btn ai-lightning-btn" 
                    @click="toggleAiDrawer" 
                    title="Tap or hold for AI Mode"
                  >
                    <Zap :size="14" />
                  </button>

                  <!-- Suggestions Stream -->
                  <div class="kb-suggestions">
                    <button 
                      v-for="(sug, idx) in suggestions" 
                      :key="idx" 
                      class="sug-chip"
                      @click="applySuggestion(sug)"
                    >
                      {{ sug }}
                    </button>
                  </div>

                  <!-- Vox Key (Microphone / Vox Mode) -->
                  <button 
                    class="kb-tool-btn vox-mic-btn" 
                    :class="{ active: isVoxDrawerOpen }"
                    @click="toggleVoxMode" 
                    title="Vox Key · Tap for voice typing, hold to enter Vox mode"
                  >
                    <Mic :size="14" />
                    <span v-if="isVoxDrawerOpen" class="vox-pulse-dot"></span>
                  </button>

                  <!-- M Context Diary Key (The Monolog Signature) -->
                  <button 
                    class="kb-tool-btn m-diary-btn" 
                    @click="triggerContextButton" 
                    title="Tap M key to capture screen context & voice note"
                  >
                    <img src="/monolog/monolog-logo.svg" alt="M Diary Key" class="m-key-icon" />
                    <span class="m-aurora-pip"></span>
                  </button>
                </div>

                <!-- Keycap Rows (Frosted Glass QWERTY) -->
                <div class="kb-keys-grid">
                  <!-- Row 1 -->
                  <div class="kb-row">
                    <span v-for="k in ['q','w','e','r','t','y','u','i','o','p']" :key="k" class="keycap">{{ k }}</span>
                  </div>

                  <!-- Row 2 -->
                  <div class="kb-row indent-1">
                    <span v-for="k in ['a','s','d','f','g','h','j','k','l']" :key="k" class="keycap">{{ k }}</span>
                  </div>

                  <!-- Row 3 -->
                  <div class="kb-row">
                    <span class="keycap key-mod">⇧</span>
                    <span v-for="k in ['z','x','c','v','b','n','m']" :key="k" class="keycap">{{ k }}</span>
                    <span class="keycap key-mod">⌫</span>
                  </div>

                  <!-- Row 4 -->
                  <div class="kb-row row-spacebar">
                    <span class="keycap key-mod">?123</span>
                    <span class="keycap key-mod">,</span>
                    <button 
                      class="keycap key-spacebar" 
                      @click="toggleAiDrawer"
                      title="Hold spacebar for AI Search drawer"
                    >
                      <Zap :size="12" class="space-icon" />
                      <span>monolog</span>
                    </button>
                    <span class="keycap key-mod">.</span>
                    <span class="keycap key-action">↵</span>
                  </div>
                </div>

                <!-- Footer Hint -->
                <div class="kb-hint-footer">
                  <span>Hold spacebar for AI · Tap Vox <Mic :size="11" class="inline-vox-icon" /> to dictate · Tap <img src="/monolog/monolog-logo.svg" alt="Context Key" class="inline-hint-logo" /> for context</span>
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



/* Interactive Keyboard Widget (True Frosted Glass) */
.hero-right {
  display: flex;
  justify-content: center;
}

.keyboard-preview-wrapper {
  width: 100%;
  max-width: 440px;
  background: rgba(15, 17, 26, 0.65);
  backdrop-filter: blur(36px) saturate(190%);
  -webkit-backdrop-filter: blur(36px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-top: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 26px;
  padding: 1.35rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  transition: all 0.3s ease;
}

.keyboard-preview-wrapper.light {
  background: #ffffff;
  border-color: rgba(15, 23, 42, 0.16);
  color: #0f172a;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.10), 0 0 30px rgba(249, 115, 22, 0.08);
}

.widget-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.keyboard-preview-wrapper.light .widget-top-bar {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.widget-dots {
  display: flex;
  gap: 6px;
}

.w-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.w-red { background: #ef4444; }
.w-yellow { background: #eab308; }
.w-green { background: #22c55e; }

.theme-toggle-pills {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.06);
  padding: 3px;
  border-radius: 9999px;
  backdrop-filter: blur(10px);
}

.keyboard-preview-wrapper.light .theme-toggle-pills {
  background: rgba(0, 0, 0, 0.05);
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-btn.active {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.keyboard-preview-wrapper.light .theme-btn.active {
  background: #fff;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Sim Host Input Field */
.sim-host-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.sim-host-input {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  color: #f3f4f6;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.keyboard-preview-wrapper.light .sim-host-input {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.1);
  color: #0f172a;
}

.cursor-blink {
  color: var(--color-accent);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Picture-in-Picture AI Drawer */
.pip-ai-drawer {
  background: rgba(18, 18, 24, 0.92);
  border: 1px solid rgba(249, 115, 22, 0.45);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 16px;
  padding: 0.95rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.65), 0 0 25px rgba(249, 115, 22, 0.20);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.keyboard-preview-wrapper.light .pip-ai-drawer {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(249, 115, 22, 0.45);
  box-shadow: 0 12px 30px rgba(100, 116, 139, 0.15);
}

.pip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pip-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-accent);
}

.pip-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
}

.pip-query {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: #9ca3af;
  font-style: italic;
}

.pip-answer {
  font-size: 0.82rem;
  color: #f3f4f6;
  line-height: 1.4;
}

.keyboard-preview-wrapper.light .pip-answer {
  color: #1e293b;
}

.pip-sources {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.source-tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  padding: 0.15rem 0.45rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: #9ca3af;
}

.pip-paste-btn {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  background: rgba(249, 115, 22, 0.16);
  color: var(--color-accent);
  border: 1px solid rgba(249, 115, 22, 0.35);
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  cursor: pointer;
}

/* Floating Vox Mode Drawer */
.vox-mode-drawer {
  background: rgba(18, 16, 26, 0.94);
  border: 1px solid rgba(192, 132, 252, 0.45);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7), 0 0 30px rgba(192, 132, 252, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.keyboard-preview-wrapper.light .vox-mode-drawer {
  background: rgba(255, 255, 255, 0.96);
  border-color: rgba(147, 51, 234, 0.4);
  box-shadow: 0 12px 30px rgba(100, 116, 139, 0.15), 0 0 20px rgba(147, 51, 234, 0.1);
}

.vox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vox-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: #c084fc;
}

.keyboard-preview-wrapper.light .vox-title {
  color: #7e22ce;
}

.vox-body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: center;
}

.vox-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #cbd5e1;
}

.keyboard-preview-wrapper.light .vox-status {
  color: #334155;
  font-weight: 600;
}

.vox-live-dot {
  width: 7px;
  height: 7px;
  background: #c084fc;
  border-radius: 50%;
  box-shadow: 0 0 8px #c084fc;
  animation: pulse-glow 1.2s infinite;
}

/* Soundwave Waveform Animation */
.vox-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 38px;
  width: 100%;
  padding: 0.2rem 0;
}

.wave-bar {
  width: 3.5px;
  height: 8px;
  background: linear-gradient(180deg, #c084fc 0%, #818cf8 100%);
  border-radius: 9999px;
  animation: wave-bounce 1.1s ease-in-out infinite alternate;
}

@keyframes wave-bounce {
  0% { height: 6px; opacity: 0.4; }
  100% { height: 32px; opacity: 1; }
}

.vox-copy {
  font-size: 0.76rem;
  color: #94a3b8;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

.keyboard-preview-wrapper.light .vox-copy {
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
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
}

.keyboard-preview-wrapper.light .vox-lang-tag {
  background: #f1f5f9;
  color: #334155;
}

.vox-done-btn {
  background: #c084fc;
  color: #090a0d;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vox-done-btn:hover {
  background: #d8b4fe;
  transform: scale(1.03);
}

.inline-vox-icon {
  display: inline-block;
  vertical-align: middle;
  color: #c084fc;
  margin: 0 1px;
}

/* Context Toast */
.context-toast {
  background: rgba(249, 115, 22, 0.16);
  border: 1px solid rgba(249, 115, 22, 0.45);
  backdrop-filter: blur(12px);
  color: #ffedd5;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  text-align: center;
}

/* The Frosted Keyboard UI */
.frosted-keyboard {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding-top: 0.25rem;
}

/* Toolbar Row */
.kb-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.kb-tool-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #d1d5db;
  transition: all 0.2s ease;
}

.keyboard-preview-wrapper.light .kb-tool-btn {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
  color: #475569;
}

.ai-lightning-btn {
  color: var(--color-accent);
  border-color: rgba(249, 115, 22, 0.35);
}

.ai-lightning-btn:hover {
  background: rgba(249, 115, 22, 0.2);
  box-shadow: 0 0 10px rgba(249, 115, 22, 0.3);
}

.vox-mic-btn {
  position: relative;
  color: #c084fc;
  border-color: rgba(192, 132, 252, 0.4);
}

.vox-mic-btn:hover,
.vox-mic-btn.active {
  background: rgba(192, 132, 252, 0.22);
  border-color: rgba(192, 132, 252, 0.7);
  box-shadow: 0 0 12px rgba(192, 132, 252, 0.45);
  color: #e9d5ff;
}

.keyboard-preview-wrapper.light .vox-mic-btn {
  color: #9333ea;
  border-color: rgba(147, 51, 234, 0.35);
}

.keyboard-preview-wrapper.light .vox-mic-btn.active {
  background: #f5f3ff;
  border-color: #9333ea;
  color: #7e22ce;
}

.vox-pulse-dot {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  background: #c084fc;
  border-radius: 50%;
  box-shadow: 0 0 6px #c084fc;
  animation: pulse-glow 1.4s infinite;
}

.m-diary-btn {
  position: relative;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--color-accent);
  border-color: rgba(249, 115, 22, 0.4);
}

.m-diary-btn:hover {
  background: rgba(249, 115, 22, 0.2);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.4);
}

.m-aurora-pip {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent);
}

.kb-suggestions {
  display: flex;
  gap: 0.35rem;
  flex: 1;
  overflow-x: auto;
  justify-content: center;
}

.sug-chip {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sug-chip:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f3f4f6;
}

.keyboard-preview-wrapper.light .sug-chip {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.06);
  color: #64748b;
}

/* Frosted Glass Keycaps Grid */
.kb-keys-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kb-row {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.kb-row.indent-1 {
  padding: 0 10px;
}

.keycap {
  flex: 1;
  max-width: 36px;
  height: 38px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-top: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  color: #f3f4f6;
  user-select: none;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.15s ease;
}

.keycap:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

.keyboard-preview-wrapper.light .keycap {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-bottom: 2px solid #94a3b8;
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.keyboard-preview-wrapper.light .keycap:hover {
  background: #f8fafc;
  border-color: #ea580c;
}

.key-mod {
  max-width: 46px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.keyboard-preview-wrapper.light .key-mod {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-bottom: 2px solid #94a3b8;
  color: #0f172a;
  font-weight: 700;
}

.key-action {
  max-width: 46px;
  background: rgba(249, 115, 22, 0.18);
  border-color: rgba(249, 115, 22, 0.45);
  color: var(--color-accent);
}

.keyboard-preview-wrapper.light .key-action {
  background: #ea580c;
  border-color: #c2410c;
  color: #ffffff;
}

.key-spacebar {
  flex: 4;
  max-width: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #9ca3af;
}

.keyboard-preview-wrapper.light .key-spacebar {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-bottom: 2px solid #94a3b8;
  color: #0f172a;
  font-weight: 700;
}

.space-icon {
  color: var(--color-accent);
}

.kb-hint-footer {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.keyboard-preview-wrapper.light .kb-hint-footer {
  color: #334155;
  font-weight: 600;
  opacity: 1;
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