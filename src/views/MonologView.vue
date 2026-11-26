<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Shield,
  ArrowLeft,
  FileText,
  Search,
  Eye,
  Mic,
  BookOpen,
  Edit3,
  Sliders,
  Calendar,
  Layers,
  Cloud,
  Globe,
  ExternalLink,
  CheckCircle2,
  Play,
  ChevronDown,
  Mail,
} from 'lucide-vue-next'
import MonologPhonePlayground from '@/components/monolog/MonologPhonePlayground.vue'
import MonologJournalExplorer from '@/components/monolog/MonologJournalExplorer.vue'
import MonologScreenPreview from '@/components/monolog/MonologScreenPreview.vue'
import {
  EXTERNAL_LINKS,
  PREVIEW_TABS,
  ARTWORK_SCREENS,
  FIVE_PILLARS,
  THREE_NEEDS,
  PRIVACY_STATES,
  VERIFIED_CHECKS,
  TECH_STACK,
  FAQ_ITEMS,
  type PreviewBoardTab,
} from '@/data/monologData'

// Previews subtabs
const activeDesignTab = ref<PreviewBoardTab['id']>('dual')
const currentPreviewTab = computed(
  () => PREVIEW_TABS.find((t) => t.id === activeDesignTab.value) || PREVIEW_TABS[0]
)

// Five Pillars selector
const activePillarIndex = ref(0)
const showAltPillarImage = ref(false)
const activePillar = computed(() => FIVE_PILLARS[activePillarIndex.value])

const selectPillar = (idx: number) => {
  activePillarIndex.value = idx
  showAltPillarImage.value = false
}

const inspectProtectedBanking = () => {
  activeDesignTab.value = 'privacy'
  const el = document.getElementById('designs')
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Pricing billing state
const billingCycle = ref<'yearly' | 'monthly'>('yearly')
const billingNoteText = ref<string | null>(null)

const handleRestoreToast = () => {
  billingNoteText.value = 'Subscriptions launch via Google Play · Privacy & core local journals remain free forever.'
  window.setTimeout(() => {
    billingNoteText.value = null
  }, 4000)
}

// Lightbox modal
const selectedImageModal = ref<string | null>(null)
const openModal = (src: string) => {
  selectedImageModal.value = src
}
const closeModal = () => {
  selectedImageModal.value = null
}
</script>

<template>
  <div class="monolog-page">
    <!-- Ambient Orange & Subtle Indigo Aurora Background -->
    <div class="aurora-stage" aria-hidden="true">
      <div class="aurora-glow glow-tl"></div>
      <div class="aurora-glow glow-tr"></div>
      <div class="aurora-glow glow-center"></div>
      <div class="glass-noise-overlay"></div>
    </div>

    <!-- Frosted Glass Navbar -->
    <header class="navbar-wrapper">
      <div class="container navbar">
        <div class="nav-left">
          <router-link to="/" class="brand-logo" aria-label="No Tokens Home" title="Back to NoTokens HQ">
            <svg class="brand-symbol" viewBox="0 0 40 32" width="38" height="30" fill="none" stroke="var(--color-accent)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M 11 7 A 9 9 0 0 0 11 25" />
              <line x1="23" y1="1" x2="17" y2="31" />
              <path d="M 29 7 A 9 9 0 0 1 29 25" />
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
            :href="EXTERNAL_LINKS.showcase"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-pill live-site-pill"
            title="Visit the official Monolog standalone showcase"
          >
            <span class="pill-dot live-dot"></span>
            <span class="nav-pill-desktop">monolog.notokens.co ↗</span>
            <span class="nav-pill-mobile">Live Site ↗</span>
          </a>

          <a
            :href="EXTERNAL_LINKS.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-pill"
            title="Launch 14-Scene Interactive Buildathon Demo"
          >
            <Play :size="11" />
            <span>Demo ↗</span>
          </a>

          <a
            :href="EXTERNAL_LINKS.monologWeb"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-pill"
            title="Monolog Web — Your side of the day."
          >
            <span>Monolog Web ↗</span>
          </a>

          <router-link to="/" class="nav-pill back-pill">
            <ArrowLeft :size="13" />
            <span>Back to HQ</span>
          </router-link>
        </div>
      </div>
    </header>

    <main class="main-content container">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="hero-grid">
          <div class="hero-left">
            <div class="hero-eyebrow font-mono">// GOOGLE STARTUP BUILDATHON INDIA 2026 FINALIST</div>

            <div class="hero-title-wrap">
              <img src="/monolog/monolog-logo.svg" alt="Monolog Official Logo" class="hero-logo-badge" />
              <h1 class="hero-title">monolog<span class="terminal-dot">.</span></h1>
            </div>

            <h2 class="hero-sub-headline">A keyboard. With a memory.</h2>

            <p class="hero-tagline">
              <strong>Type. Speak. Act. Remember your side of the day.</strong>
              <span class="tagline-brand"> monolog</span> is an Android-first AI keyboard and companion journal combining borderless typing across 6 themes, natural Vox dictation, floating AI Ask search, quick actions, and private encrypted local memory.
            </p>

            <!-- Chips -->
            <div class="hero-chips">
              <span class="chip">Android 12+ · Kotlin IME</span>
              <span class="chip">6 Themes</span>
              <span class="chip">Gemma 3 270M IT / LiteRT-LM</span>
              <span class="chip">Gemini 1.5 Flash (Opt-In)</span>
              <span class="chip">Keystore AES-256</span>
            </div>

            <!-- Showcase Referral & Action Links -->
            <div class="hero-links">
              <a
                :href="EXTERNAL_LINKS.showcase"
                target="_blank"
                rel="noopener noreferrer"
                class="meta-link-btn primary-showcase-btn"
              >
                <Globe :size="14" />
                <span>Explore Live Showcase · monolog.notokens.co</span>
                <span class="arrow">↗</span>
              </a>

              <a
                :href="EXTERNAL_LINKS.demo"
                target="_blank"
                rel="noopener noreferrer"
                class="meta-link-btn"
              >
                <Play :size="13" />
                <span>14-Scene Buildathon Demo</span>
                <span class="arrow">↗</span>
              </a>

              <a
                :href="EXTERNAL_LINKS.monologWeb"
                target="_blank"
                rel="noopener noreferrer"
                class="meta-link-btn"
              >
                <ExternalLink :size="13" />
                <span>Monolog Web</span>
                <span class="arrow">↗</span>
              </a>

              <a
                :href="EXTERNAL_LINKS.deckPdf"
                target="_blank"
                rel="noopener noreferrer"
                class="meta-link-btn deck-btn"
                title="Open Final Prototype Submission Deck (PDF)"
              >
                <FileText :size="13" />
                <span>Final Prototype Deck (PDF)</span>
                <span class="arrow">↗</span>
              </a>

              <a
                :href="EXTERNAL_LINKS.waitlist"
                target="_blank"
                rel="noopener noreferrer"
                class="meta-link-btn"
              >
                <Mail :size="13" />
                <span>Join Launch Waitlist</span>
                <span class="arrow">↗</span>
              </a>
            </div>
          </div>

          <!-- Right: Upgraded 6-Theme Interactive Keyboard Playground -->
          <div class="hero-right">
            <MonologPhonePlayground />
          </div>
        </div>

        <!-- Three Connected Needs Strip -->
        <div class="needs-strip">
          <div v-for="item in THREE_NEEDS" :key="item.need" class="need-card frosted-glass-panel">
            <span class="need-label font-mono">{{ item.need.toUpperCase() }}</span>
            <strong>{{ item.experience }}</strong>
            <p>{{ item.outcome }}</p>
          </div>
        </div>
      </section>

      <!-- SECTION: // PREVIEWS & UI SYSTEMS -->
      <section class="section-block" id="designs">
        <div class="section-header-row">
          <h2 class="section-title">// previews &amp; design system</h2>
          <div class="design-meta-badge font-mono">
            <span class="mcp-dot"></span>
            <span>Paper · Ink · Iris · Ocean · Terracotta · Photo</span>
          </div>
        </div>

        <div class="design-card frosted-glass-panel">
          <div class="design-tab-bar" role="tablist" aria-label="Monolog UI previews">
            <button
              v-for="tab in PREVIEW_TABS"
              :key="tab.id"
              class="d-tab"
              :class="{ active: activeDesignTab === tab.id }"
              @click="activeDesignTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Live Interactive UI Previews (Zero static mockup images) -->
          <div v-if="currentPreviewTab.layout === 'live'" class="live-preview-stage">
            <MonologScreenPreview :mode="(activeDesignTab as any)" />
          </div>

          <!-- 3D Key Sculptures (Original rendered WebP artwork) -->
          <div v-else-if="activeDesignTab === 'artwork'" class="artwork-grid">
            <div v-for="art in ARTWORK_SCREENS" :key="art.title" class="art-card" @click="openModal(art.image)">
              <div class="art-img-wrap">
                <img :src="art.image" :alt="art.title" class="art-img" />
              </div>
              <div class="wf-info">
                <span class="wf-title">{{ art.title }}</span>
                <p class="wf-desc">{{ art.sub }}</p>
              </div>
            </div>
          </div>

          <div class="board-footer-bar">
            <span class="board-caption">{{ currentPreviewTab.caption }}</span>
          </div>
        </div>
      </section>

      <!-- SECTION: // THE FIVE PILLARS & COMPANION EXPLORER -->
      <section class="section-block" id="features">
        <div class="section-header-row">
          <h2 class="section-title">// the 5 pillars · keyboard to journal</h2>
          <span class="section-meta-tag font-mono">Design Specification v1.0</span>
        </div>

        <div class="features-split-grid">
          <div class="features-menu">
            <button
              v-for="(pillar, idx) in FIVE_PILLARS"
              :key="pillar.num"
              class="feature-menu-item frosted-glass-panel"
              :class="{ active: activePillarIndex === idx }"
              @click="selectPillar(idx)"
            >
              <div class="f-menu-top">
                <span class="f-num font-mono">{{ pillar.num }}</span>
                <span class="f-tag font-mono">{{ pillar.tag }}</span>
              </div>
              <h3 class="f-title">{{ pillar.title }}</h3>
              <p class="f-subtitle">{{ pillar.subtitle }}</p>
            </button>
          </div>

          <div class="features-preview-col frosted-glass-panel">
            <div class="preview-details-top">
              <div class="preview-details-head">
                <span class="f-tag font-mono">{{ activePillar.tag }}</span>
                <button
                  v-if="activePillar.altVariant"
                  class="alt-toggle-btn font-mono"
                  @click="showAltPillarImage = !showAltPillarImage"
                >
                  {{ showAltPillarImage ? 'Show Default' : `Switch to ${activePillar.altLabel}` }}
                </button>
              </div>
              <h3 class="preview-p-title">{{ activePillar.title }}</h3>
              <p class="preview-p-desc">{{ activePillar.desc }}</p>
            </div>

            <div class="live-pillar-stage">
              <MonologScreenPreview
                :mode="activePillar.previewMode"
                :variant="showAltPillarImage && activePillar.altVariant ? activePillar.altVariant : activePillar.defaultVariant"
                compact
              />
            </div>
          </div>
        </div>

        <!-- Interactive Today / Journal / Context Library Simulator -->
        <div class="explorer-container frosted-glass-panel">
          <MonologJournalExplorer />
        </div>
      </section>

      <!-- SECTION: // COMPETITIVE ADVANTAGE & POSITIONING -->
      <section class="section-block" id="positioning">
        <div class="section-header-row">
          <h2 class="section-title">// competitive advantage · 1 unified workflow</h2>
          <span class="section-meta-tag font-mono">Replaces 4–6 Apps</span>
        </div>

        <div class="positioning-container frosted-glass-panel">
          <div class="pos-hero-block">
            <div class="pos-badge-pill font-mono">
              <span class="p-dot-live"></span>
              <span>Express · Act · Remember Inside Your Current App</span>
            </div>
            <h3 class="pos-main-headline">One keyboard workflow. Less app-switching friction.</h3>
            <p class="pos-lead-body">
              Monolog brings together jobs users typically split across <strong>Gboard / SwiftKey</strong> (typing), <strong>Wispr Flow / Typeless</strong> (AI voice), <strong>Grammarly</strong> (rewrites), and <strong>Day One</strong> (journaling). Instead of switching apps 30–50 times a day and losing focus, users dictate with Vox, query AI Ask above the keys, confirm reminders, and keep their side of the day organized privately on-device.
            </p>
          </div>

          <div class="comp-matrix-grid">
            <div class="comp-card">
              <span class="comp-category-tag font-mono">TYPING IME</span>
              <div class="comp-target-app">Gboard / SwiftKey</div>
              <div class="comp-vs-arrow font-mono">↓ Unified in Monolog</div>
              <h4>Borderless 6-Theme IME</h4>
              <p>Familiar QWERTY across Paper, Ink, Iris, Ocean, Terracotta &amp; Photo with hardware-encrypted storage.</p>
            </div>
            <div class="comp-card">
              <span class="comp-category-tag font-mono">AI VOICE</span>
              <div class="comp-target-app">Wispr Flow / Typeless</div>
              <div class="comp-vs-arrow font-mono">↓ Unified in Monolog</div>
              <h4>Vox Pause-Tolerant Mode</h4>
              <p>Docked voice canvas with Smart Filter cleanup, regional languages, and preserved draft context.</p>
            </div>
            <div class="comp-card">
              <span class="comp-category-tag font-mono">WRITING AID</span>
              <div class="comp-target-app">Grammarly</div>
              <div class="comp-vs-arrow font-mono">↓ Unified in Monolog</div>
              <h4>Polish, Shorten &amp; Tone</h4>
              <p>On-device Gemma 3 270M IT / LiteRT-LM rewrites with preview and undo — keeping drafts local.</p>
            </div>
            <div class="comp-card">
              <span class="comp-category-tag font-mono">PERSONAL MEMORY</span>
              <div class="comp-target-app">Day One / Notes</div>
              <div class="comp-vs-arrow font-mono">↓ Unified in Monolog</div>
              <h4>Journal &amp; Context Library</h4>
              <p>Consented captures, ML Kit OCR screenshots, voice notes, and Narrative Nostalgia November recaps.</p>
            </div>
          </div>

          <div class="pos-split-row">
            <div class="venn-card">
              <div class="venn-header">
                <span class="venn-badge font-mono">A BROADER EVERYDAY USE</span>
                <h4>Express + Act + Remember</h4>
                <p>Demand proven by Wispr Flow (~20% reported paid conversion) and Typeless (500K+ Android downloads) expanded into everyday memory &amp; action.</p>
              </div>
              <div class="venn-diagram-wrap">
                <div class="venn-circle circle-type">
                  <span class="c-title">EXPRESS</span>
                  <small>Keyboard + Vox</small>
                </div>
                <div class="venn-circle circle-action">
                  <span class="c-title">ACT</span>
                  <small>Reminders + AI Ask</small>
                </div>
                <div class="venn-circle circle-remember">
                  <span class="c-title">REMEMBER</span>
                  <small>Journal + Library</small>
                </div>
                <div class="venn-center-badge">
                  <img src="/monolog/monolog-logo.svg" alt="Monolog" class="v-center-logo" />
                  <span>monolog</span>
                </div>
              </div>
            </div>

            <div class="target-market-card">
              <div class="tm-top-info">
                <span class="tm-audience-badge font-mono">FIRST TARGET USERS</span>
                <h4>Android students &amp; young professionals</h4>
                <p>People who message, dictate, set reminders, and save context throughout the day.</p>
              </div>
              <div class="tm-channels-grid">
                <div class="tm-channel-item">
                  <span class="tm-c-num font-mono">01</span>
                  <div>
                    <strong>Honest Evidence Model</strong>
                    <small>Separates typed drafts from sent messages; captures your available side without inventing replies.</small>
                  </div>
                </div>
                <div class="tm-channel-item">
                  <span class="tm-c-num font-mono">02</span>
                  <div>
                    <strong>Campus &amp; Creator Demos</strong>
                    <small>Real everyday flows: speaking messages with Vox, setting 5 PM reminders, and recalling timetables.</small>
                  </div>
                </div>
                <div class="tm-channel-item">
                  <span class="tm-c-num font-mono">03</span>
                  <div>
                    <strong>Interactive 14-Scene Pitch</strong>
                    <small>
                      Step through Justysss &amp; ybtheflash’s Buildathon finals walkthrough at
                      <a :href="EXTERNAL_LINKS.demo" target="_blank" rel="noopener noreferrer" class="inline-orange-link">monolog.notokens.co/demo ↗</a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: // FOUR-STATE PRIVACY MODEL -->
      <section class="section-block" id="privacy">
        <div class="section-header-row">
          <h2 class="section-title">// privacy model · 4 explicit states</h2>
          <span class="section-meta-tag font-mono">Keystore AES-256-GCM</span>
        </div>

        <div class="privacy-card frosted-glass-panel">
          <div class="privacy-lead">
            <Shield :size="24" class="text-orange" />
            <div class="privacy-lead-text">
              <span class="privacy-heading">Personal. In every sense. Privacy isn’t a paid feature.</span>
              <p class="privacy-sub">
                Memory requires explicit consent. Local records are encrypted in SQLite Room with hardware-backed Android Keystore AES-256-GCM (TEE/StrongBox) keys, ML Kit diagnostics uploads are disabled, and typing, voice recordings, and journals are never used to train models.
              </p>
            </div>
          </div>

          <div class="privacy-pillars-grid">
            <div v-for="st in PRIVACY_STATES" :key="st.num" class="pillar-box">
              <span class="p-num font-mono">{{ st.num }}</span>
              <h4>{{ st.state }}</h4>
              <p>{{ st.capture }}</p>
              <span class="p-behavior font-mono">{{ st.uiCue }}</span>
            </div>
          </div>

          <div class="privacy-actions-row">
            <button class="inspect-incognito-link" @click="inspectProtectedBanking">
              <Eye :size="14" />
              <span>Inspect Live Protected Banking Screen ↑</span>
            </button>
            <router-link to="/monolog/privacy" class="policy-route-link">
              Read Full Privacy Policy (Updated 26 Nov 2026) →
            </router-link>
            <router-link to="/monolog/tos" class="policy-route-link">
              Terms of Use (Updated 23 Nov 2026) →
            </router-link>
          </div>
        </div>
      </section>

      <!-- SECTION: // VERIFIED PROTOTYPE & TECH STACK -->
      <section class="section-block" id="google-stack">
        <div class="section-header-row">
          <h2 class="section-title">// prototype verification &amp; stack</h2>
          <span class="section-meta-tag font-mono">Buildathon Finalist Build</span>
        </div>

        <div class="verified-strip">
          <div v-for="v in VERIFIED_CHECKS" :key="v.label" class="verified-box frosted-glass-panel">
            <CheckCircle2 :size="15" class="text-orange" />
            <div>
              <strong>{{ v.metric }}</strong>
              <small>{{ v.label }}</small>
            </div>
          </div>
        </div>

        <div class="stack-grid-clean">
          <div v-for="item in TECH_STACK" :key="item.title" class="stack-item frosted-glass-panel">
            <span class="s-category font-mono">{{ item.category }}</span>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </section>

      <!-- SECTION: // PLANS, PRICING & FAQ -->
      <section class="section-block" id="pricing">
        <div class="section-header-row">
          <h2 class="section-title">// plans &amp; proposed launch pricing</h2>
          <span class="section-meta-tag font-mono">Privacy Always Free</span>
        </div>

        <div class="pricing-showcase-container">
          <div class="pricing-compact-header">
            <div class="pricing-title-col">
              <div class="pricing-badge-row">
                <img src="/monolog/monolog-logo.svg" alt="Monolog" class="pricing-logo-icon" />
                <span class="pricing-badge-text font-mono">MONOLOG PLANS</span>
              </div>
              <h3 class="pricing-main-title">A little more. On your terms.</h3>
              <p class="pricing-sub-title">
                The essentials stay free. Proposed India launch pricing for Monolog Pro — no payment is taken on the showcase website, and exhausting any quota never loses a draft or locks your journal.
              </p>
            </div>

            <div class="pricing-header-actions">
              <div class="billing-switch-pills">
                <button
                  class="b-pill-btn"
                  :class="{ active: billingCycle === 'monthly' }"
                  @click="billingCycle = 'monthly'"
                >
                  <span>Monthly</span>
                  <span class="b-pill-rate">₹299/mo</span>
                </button>
                <button
                  class="b-pill-btn"
                  :class="{ active: billingCycle === 'yearly' }"
                  @click="billingCycle = 'yearly'"
                >
                  <span class="b-save-tag">Save 6%</span>
                  <span>Yearly</span>
                  <span class="b-pill-rate">₹281/mo</span>
                </button>
              </div>
              <button class="plan-restore-link" @click="handleRestoreToast">Billing info</button>
            </div>
          </div>

          <p v-if="billingNoteText" class="billing-toast font-mono">{{ billingNoteText }}</p>

          <div class="pricing-wide-grid">
            <!-- Free Card -->
            <div class="plan-card-wide free-card frosted-glass-panel">
              <div class="p-card-top">
                <div class="p-tier-badge-row">
                  <span class="p-tier-name">Monolog Free</span>
                  <span class="p-tier-tag font-mono">FOREVER</span>
                </div>
                <div class="p-price-block">
                  <span class="p-price-val">₹0</span>
                  <span class="p-price-period">to get started</span>
                </div>
                <p class="p-card-desc">Your everyday keyboard across all 6 themes, private local journal, and full data protections.</p>
              </div>

              <div class="p-features-block">
                <span class="p-features-label font-mono">ALWAYS INCLUDED</span>
                <ul class="p-feat-list">
                  <li>
                    <span class="feat-icon"><Sliders :size="15" /></span>
                    <span>Paper, Ink, Iris, Ocean, Terracotta &amp; Photo themes + key borders</span>
                  </li>
                  <li>
                    <span class="feat-icon"><BookOpen :size="15" /></span>
                    <span>Local journals and basic memory search</span>
                  </li>
                  <li>
                    <span class="feat-icon"><Mic :size="15" /></span>
                    <span>Basic Vox &amp; on-device writing assistance pool</span>
                  </li>
                  <li>
                    <span class="feat-icon"><Shield :size="15" /></span>
                    <span>Incognito, Keystore encryption, export &amp; banking shield</span>
                  </li>
                </ul>
              </div>

              <div class="p-card-footer">
                <a :href="EXTERNAL_LINKS.waitlist" target="_blank" rel="noopener noreferrer" class="plan-ghost-btn">
                  Join Waitlist for Free Launch ↗
                </a>
              </div>
            </div>

            <!-- Pro Card -->
            <div class="plan-card-wide pro-card frosted-glass-panel">
              <div class="pro-aurora-glow-bg"></div>

              <div class="p-card-top">
                <div class="p-tier-badge-row">
                  <div class="pro-title-inline">
                    <span class="p-tier-name pro-name">Monolog Pro</span>
                    <span class="pro-highlight-badge font-mono">PROPOSED LAUNCH</span>
                  </div>
                  <span v-if="billingCycle === 'yearly'" class="pro-savings-inline font-mono">Save ₹216 / year (~6%)</span>
                </div>

                <div class="p-price-block">
                  <div class="p-price-main">
                    <span class="p-price-val">{{ billingCycle === 'yearly' ? '₹281' : '₹299' }}</span>
                    <span class="p-price-period">/ month</span>
                  </div>
                  <span class="p-billed-sub">
                    {{ billingCycle === 'yearly' ? '₹3,372 billed yearly · Cancel anytime' : 'Billed monthly via Google Play when available' }}
                  </span>
                </div>
                <p class="p-card-desc">Expanded 10× Vox &amp; AI Ask allowances, saved writing styles, deep memory questions, and richer monthly recaps.</p>
              </div>

              <div class="p-features-block">
                <span class="p-features-label pro-features-label font-mono">EVERYTHING IN FREE, PLUS:</span>
                <div class="pro-features-2col">
                  <div class="p-feat-col">
                    <div class="p-feat-item">
                      <span class="feat-icon pro-icon"><Mic :size="15" /></span>
                      <div class="feat-copy">
                        <strong>10× Vox &amp; AI Ask Pool</strong>
                        <small>Expanded voice dictation, Smart Filter &amp; custom vocabulary</small>
                      </div>
                    </div>
                    <div class="p-feat-item">
                      <span class="feat-icon pro-icon"><Edit3 :size="15" /></span>
                      <div class="feat-copy">
                        <strong>Saved Styles &amp; Rewrites</strong>
                        <small>Polish, shorten, tone shifts, and reusable writing rules</small>
                      </div>
                    </div>
                    <div class="p-feat-item">
                      <span class="feat-icon pro-icon"><Search :size="15" /></span>
                      <div class="feat-copy">
                        <strong>AI Ask Memory &amp; Web Search</strong>
                        <small>Natural-language questions across journals, OCR &amp; citations</small>
                      </div>
                    </div>
                  </div>
                  <div class="p-feat-col">
                    <div class="p-feat-item">
                      <span class="feat-icon pro-icon"><Calendar :size="15" /></span>
                      <div class="feat-copy">
                        <strong>Richer Narrative Recaps</strong>
                        <small>Weekly summaries, Narrative Nostalgia recaps &amp; formatted exports</small>
                      </div>
                    </div>
                    <div class="p-feat-item">
                      <span class="feat-icon pro-icon"><Layers :size="15" /></span>
                      <div class="feat-copy">
                        <strong>Unlimited Pins &amp; Routines</strong>
                        <small>Supported multi-step routines &amp; priority Gemma model updates</small>
                      </div>
                    </div>
                    <div class="p-feat-item">
                      <span class="feat-icon pro-icon"><Cloud :size="15" /></span>
                      <div class="feat-copy">
                        <strong>Encrypted Drive Backup</strong>
                        <small>Optional Drive appDataFolder sync with recovery key + founder support</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-card-footer pro-footer">
                <a
                  :href="`mailto:monolog@notokens.co?subject=Monolog%20Pro%20${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`"
                  class="plan-primary-cta"
                >
                  <span>Let’s talk Pro</span>
                  <span class="arrow">↗</span>
                </a>
                <span class="savings-text-note">Canceling returns safely to Free without deleting existing memories.</span>
              </div>
            </div>
          </div>

          <div class="pricing-bottom-bar">
            <div class="p-trust-item">
              <Shield :size="14" class="text-orange" />
              <span>Privacy controls, data export, and banking protection are always free.</span>
            </div>
            <div class="p-trust-legal">
              <a :href="EXTERNAL_LINKS.showcase" target="_blank" rel="noopener noreferrer" class="pricing-live-link">
                monolog.notokens.co ↗
              </a>
              <span class="dot-sep">•</span>
              <router-link to="/monolog/tos">Terms of Use</router-link>
              <span class="dot-sep">•</span>
              <router-link to="/monolog/privacy">Privacy Policy</router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: // FAQ & OFFICIAL SHOWCASE REFERRAL -->
      <section class="section-block" id="faq">
        <div class="section-header-row">
          <h2 class="section-title">// frequently asked questions</h2>
          <a href="mailto:monolog@notokens.co" class="section-meta-tag font-mono">monolog@notokens.co ↗</a>
        </div>

        <div class="faq-list">
          <details v-for="item in FAQ_ITEMS" :key="item.q" class="faq-item frosted-glass-panel">
            <summary>
              <span>{{ item.q }}</span>
              <ChevronDown :size="16" class="faq-chev" />
            </summary>
            <p>{{ item.a }}</p>
          </details>
        </div>

        <!-- Bottom Showcase Referral Card -->
        <div class="showcase-cta-banner frosted-glass-panel">
          <div class="cta-banner-copy">
            <span class="pos-badge-pill font-mono">OFFICIAL MONOLOG SHOWCASE</span>
            <h3>Experience the full standalone site &amp; interactive walkthrough</h3>
            <p>
              Visit <strong>monolog.notokens.co</strong> for the full scroll-driven story, 3D rotatable phone demo, and live Android launch waitlist — or jump directly into the 14-scene Buildathon pitch walkthrough or Monolog Web.
            </p>
          </div>
          <div class="cta-banner-actions">
            <a :href="EXTERNAL_LINKS.showcase" target="_blank" rel="noopener noreferrer" class="plan-primary-cta">
              <span>Visit monolog.notokens.co</span>
              <span>↗</span>
            </a>
            <a :href="EXTERNAL_LINKS.demo" target="_blank" rel="noopener noreferrer" class="meta-link-btn">
              <span>Interactive /demo</span>
              <span>↗</span>
            </a>
            <a :href="EXTERNAL_LINKS.monologWeb" target="_blank" rel="noopener noreferrer" class="meta-link-btn">
              <span>Monolog Web</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>

    <!-- Lightbox Modal -->
    <Transition name="fade">
      <div v-if="selectedImageModal" class="modal-backdrop" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeModal" aria-label="Close">✕</button>
          <img :src="selectedImageModal" alt="Monolog Screen Preview" class="modal-img" />
          <div class="modal-caption">
            <span>Monolog Screen Inspection</span>
            <a :href="selectedImageModal" target="_blank" download class="modal-raw">Open Raw Asset ↗</a>
          </div>
        </div>
      </div>
    </Transition>

    <!-- NoTokens Terminal Window Footer -->
    <footer class="footer-wrapper">
      <div class="container footer-container">
        <div class="terminal-footer frosted-glass-panel">
          <div class="terminal-header">
            <div class="terminal-controls">
              <span class="t-dot t-red"></span>
              <span class="t-dot t-yellow"></span>
              <span class="t-dot t-green"></span>
            </div>
            <div class="terminal-title font-mono">notokens.co / monolog — zsh</div>
            <div class="terminal-status font-mono">
              <span class="status-indicator live"></span>
              <span>FINALIST '26</span>
            </div>
          </div>

          <div class="terminal-body">
            <div class="terminal-links-bar font-mono">
              <a :href="EXTERNAL_LINKS.showcase" target="_blank" rel="noopener noreferrer">monolog.notokens.co ↗</a>
              <a :href="EXTERNAL_LINKS.demo" target="_blank" rel="noopener noreferrer">/demo ↗</a>
              <a :href="EXTERNAL_LINKS.monologWeb" target="_blank" rel="noopener noreferrer">web.monolog.notokens.co ↗</a>
              <router-link to="/monolog/privacy">Privacy Policy</router-link>
              <router-link to="/monolog/tos">Terms of Use</router-link>
              <a :href="EXTERNAL_LINKS.email">monolog@notokens.co</a>
            </div>
            <div class="terminal-bottom-row">
              <span class="font-mono">© {{ new Date().getFullYear() }} NoTokens · Android-first · Type. Speak. Act. Remember.</span>
              <span class="terminal-quote-side">There's no AI without <em>I</em> in it.</span>
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
}

.aurora-stage {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.aurora-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  opacity: 0.28;
}

.glow-tl {
  top: -15%;
  left: -10%;
  width: 55vw;
  height: 55vh;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.35), transparent 70%);
}

.glow-tr {
  top: -10%;
  right: -10%;
  width: 48vw;
  height: 48vh;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.28), transparent 70%);
}

.glow-center {
  bottom: 10%;
  left: 25%;
  width: 50vw;
  height: 45vh;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.16), transparent 75%);
}

.glass-noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: radial-gradient(#ffffff 0.6px, transparent 0.6px);
  background-size: 18px 18px;
}

.frosted-glass-panel {
  background: rgba(24, 24, 29, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
}

.text-orange {
  color: var(--color-accent);
}

/* Navbar */
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(8, 9, 13, 0.85);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.85rem 0;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.brand-symbol {
  display: block;
}

.nav-slash {
  color: rgba(255, 255, 255, 0.25);
  font-family: var(--font-mono);
}

.nav-monolog-branding {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.nav-monolog-logo {
  width: 24px;
  height: 24px;
}

.nav-path {
  font-family: var(--font-cursive);
  font-size: 1.35rem;
  color: #f8fafc;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.38rem;
  padding: 0.34rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #d1d5db;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  transition: all 0.2s ease;
}

.nav-pill:hover {
  border-color: var(--color-accent);
  color: #ffffff;
}

.live-site-pill {
  border-color: rgba(249, 115, 22, 0.45);
  background: rgba(249, 115, 22, 0.12);
  color: #ffedd5;
  font-weight: 600;
}

.pill-dot.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent);
}

.nav-pill-mobile {
  display: none;
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4.5rem;
  padding-top: 2.5rem;
  padding-bottom: 4rem;
}

/* Hero Section */
.hero-section {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 2.5rem;
  align-items: center;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.hero-eyebrow {
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  color: var(--color-accent);
}

.hero-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.hero-logo-badge {
  width: 48px;
  height: 48px;
}

.hero-title {
  font-family: var(--font-cursive);
  font-size: clamp(2.6rem, 6vw, 4.4rem);
  font-weight: 400;
  color: var(--color-hero-font);
  line-height: 1.15;
}

.terminal-dot {
  font-family: var(--font-mono);
  color: var(--color-accent);
  animation: blink 1.1s steps(2, start) infinite;
  margin-left: 4px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-sub-headline {
  font-size: clamp(1.25rem, 2.5vw, 1.65rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
}

.hero-tagline {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.65;
  max-width: 580px;
}

.hero-tagline strong {
  color: #f8fafc;
}

.tagline-brand {
  font-family: var(--font-cursive);
  color: var(--color-accent);
  font-size: 1.12em;
}

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.3rem 0.72rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
}

.hero-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 0.35rem;
}

.meta-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.95rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.meta-link-btn:hover {
  border-color: var(--color-accent);
  color: #ffffff;
  transform: translateY(-1px);
}

.primary-showcase-btn {
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-color: #fb923c;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
}

.primary-showcase-btn:hover {
  background: linear-gradient(135deg, #fb923c, #f97316);
  color: #ffffff;
}

.deck-btn {
  border-color: rgba(250, 204, 21, 0.35);
  color: #fef08a;
}

.hero-right {
  display: flex;
  justify-content: center;
}

/* Three Needs Strip */
.needs-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.15rem;
}

.need-card {
  border-radius: 18px;
  padding: 1.25rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
}

.need-label {
  font-size: 0.68rem;
  color: var(--color-accent);
  letter-spacing: 0.08em;
  font-weight: 700;
}

.need-card strong {
  font-size: 0.95rem;
  color: #f8fafc;
}

.need-card p {
  font-size: 0.82rem;
  color: #9ca3af;
  margin: 0;
}

/* Section Headers */
.section-block {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.section-header-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-title {
  font-family: var(--font-mono);
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-weight: 600;
  color: #f3f4f6;
}

.section-meta-tag,
.design-meta-badge {
  font-size: 0.75rem;
  color: var(--color-accent);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.mcp-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
}

/* Previews Board */
.design-card {
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.design-tab-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.d-tab {
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: #9ca3af;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.d-tab.active,
.d-tab:hover {
  background: rgba(249, 115, 22, 0.15);
  border-color: rgba(249, 115, 22, 0.5);
  color: #ffedd5;
}

.art-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.art-card:hover {
  transform: translateY(-3px);
  border-color: rgba(249, 115, 22, 0.45);
}

.artwork-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.art-img-wrap {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  overflow: hidden;
  background: #050505;
}

.art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wf-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.wf-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #f8fafc;
}

.wf-desc {
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0;
}

.board-footer-bar {
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.board-caption {
  font-size: 0.84rem;
  color: #9ca3af;
}

/* Five Pillars Section */
.features-split-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
}

.features-menu {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.feature-menu-item {
  text-align: left;
  border-radius: 18px;
  padding: 1rem 1.2rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.feature-menu-item:hover,
.feature-menu-item.active {
  border-color: rgba(249, 115, 22, 0.5);
  background: rgba(249, 115, 22, 0.09);
}

.f-menu-top {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.f-num {
  font-size: 0.75rem;
  color: var(--color-accent);
  font-weight: 700;
}

.f-tag {
  font-size: 0.65rem;
  color: #9ca3af;
  letter-spacing: 0.05em;
}

.f-title {
  font-size: 1rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}

.f-subtitle {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

.features-preview-col {
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  align-items: center;
}

.preview-details-top {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.preview-details-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.alt-toggle-btn {
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid rgba(249, 115, 22, 0.4);
  background: rgba(249, 115, 22, 0.14);
  color: #ffedd5;
  font-size: 0.7rem;
  cursor: pointer;
}

.preview-p-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.preview-p-desc {
  font-size: 0.86rem;
  color: #cbd5e1;
  line-height: 1.55;
  margin: 0;
}

.live-preview-stage {
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.35) 0%, rgba(9, 10, 13, 0.88) 80%);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.live-pillar-stage {
  width: 100%;
  display: flex;
  justify-content: center;
}

.explorer-container {
  border-radius: 26px;
  padding: 2rem;
}

/* Positioning */
.positioning-container {
  border-radius: 26px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.pos-hero-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 900px;
}

.pos-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.35);
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 700;
  width: fit-content;
}

.p-dot-live {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.pos-main-headline {
  font-size: clamp(1.35rem, 2.8vw, 2rem);
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
}

.pos-lead-body {
  font-size: 0.94rem;
  color: #cbd5e1;
  line-height: 1.65;
  margin: 0;
}

.comp-matrix-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.comp-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.comp-category-tag {
  font-size: 0.64rem;
  color: #9ca3af;
}

.comp-target-app {
  font-size: 0.95rem;
  font-weight: 700;
  color: #64748b;
  text-decoration: line-through;
}

.comp-vs-arrow {
  font-size: 0.68rem;
  color: var(--color-accent);
  font-weight: 700;
}

.comp-card h4 {
  font-size: 0.92rem;
  color: #f8fafc;
  margin: 0;
}

.comp-card p {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.45;
}

.pos-split-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.venn-card,
.target-market-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.venn-badge,
.tm-audience-badge {
  font-size: 0.65rem;
  color: #c084fc;
  font-weight: 700;
}

.venn-header h4,
.tm-top-info h4 {
  font-size: 1.1rem;
  color: #f8fafc;
  margin: 0.25rem 0;
}

.venn-header p,
.tm-top-info p {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

.venn-diagram-wrap {
  position: relative;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.venn-circle {
  position: absolute;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.5rem;
}

.circle-type {
  top: 8px;
  left: calc(50% - 105px);
  background: rgba(56, 189, 248, 0.16);
  border: 1.5px solid rgba(56, 189, 248, 0.45);
  color: #7dd3fc;
}

.circle-action {
  top: 8px;
  right: calc(50% - 105px);
  background: rgba(192, 132, 252, 0.16);
  border: 1.5px solid rgba(192, 132, 252, 0.45);
  color: #d8b4fe;
}

.circle-remember {
  bottom: 8px;
  left: calc(50% - 66px);
  background: rgba(52, 211, 153, 0.16);
  border: 1.5px solid rgba(52, 211, 153, 0.45);
  color: #6ee7b7;
}

.c-title {
  font-size: 0.72rem;
  font-weight: 800;
}

.venn-circle small {
  font-size: 0.62rem;
  opacity: 0.88;
}

.venn-center-badge {
  position: relative;
  z-index: 5;
  background: #0f172a;
  border: 1px solid #f8fafc;
  border-radius: 9999px;
  padding: 0.25rem 0.65rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-cursive);
  font-size: 0.9rem;
}

.v-center-logo {
  width: 14px;
  height: 14px;
}

.tm-channels-grid {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.tm-channel-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 0.65rem 0.85rem;
}

.tm-c-num {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--color-accent);
  background: rgba(249, 115, 22, 0.14);
  padding: 0.12rem 0.45rem;
  border-radius: 9999px;
}

.tm-channel-item strong {
  display: block;
  font-size: 0.84rem;
  color: #f8fafc;
}

.tm-channel-item small {
  font-size: 0.74rem;
  color: #9ca3af;
}

.inline-orange-link {
  color: var(--color-accent);
  text-decoration: underline;
}

/* Privacy Section */
.privacy-card {
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.privacy-lead {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.privacy-heading {
  display: block;
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.35rem;
}

.privacy-sub {
  font-size: 0.88rem;
  color: #cbd5e1;
  margin: 0;
  line-height: 1.6;
}

.privacy-pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.pillar-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.p-num {
  font-size: 0.72rem;
  color: var(--color-accent);
  font-weight: 700;
}

.pillar-box h4 {
  font-size: 0.94rem;
  color: #ffffff;
  margin: 0;
}

.pillar-box p {
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0;
  line-height: 1.45;
  flex: 1;
}

.p-behavior {
  font-size: 0.68rem;
  color: #c084fc;
}

.privacy-actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.inspect-incognito-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(192, 132, 252, 0.14);
  border: 1px solid rgba(192, 132, 252, 0.4);
  color: #e9d5ff;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  padding: 0.42rem 0.8rem;
  border-radius: 10px;
  cursor: pointer;
}

.policy-route-link {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Stack & Prototype Checks */
.verified-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.verified-box {
  border-radius: 16px;
  padding: 0.95rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.verified-box strong {
  display: block;
  font-size: 0.95rem;
  color: #ffffff;
}

.verified-box small {
  font-size: 0.74rem;
  color: #9ca3af;
}

.stack-grid-clean {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stack-item {
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.s-category {
  font-size: 0.65rem;
  color: var(--color-accent);
  font-weight: 700;
}

.stack-item h4 {
  font-size: 0.96rem;
  color: #f8fafc;
  margin: 0;
}

.stack-item p {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
  line-height: 1.5;
}

/* Pricing Section */
.pricing-showcase-container {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.pricing-compact-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.pricing-title-col {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-width: 650px;
}

.pricing-badge-row {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  width: fit-content;
}

.pricing-logo-icon {
  width: 14px;
  height: 14px;
}

.pricing-badge-text {
  font-size: 0.66rem;
  color: var(--color-accent);
}

.pricing-main-title {
  font-size: clamp(1.65rem, 3vw, 2.3rem);
  font-weight: 800;
  color: var(--color-hero-font);
  margin: 0;
}

.pricing-sub-title {
  font-size: 0.9rem;
  color: #9ca3af;
  margin: 0;
}

.pricing-header-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.45rem;
}

.billing-switch-pills {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  padding: 4px;
  gap: 4px;
}

.b-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.9rem;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.b-pill-btn.active {
  background: #f8fafc;
  color: #050505;
}

.b-pill-rate {
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.b-save-tag {
  background: #c084fc;
  color: #050505;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.08rem 0.38rem;
  border-radius: 9999px;
}

.plan-restore-link {
  background: none;
  border: none;
  color: #64748b;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  cursor: pointer;
  text-decoration: underline;
}

.billing-toast {
  font-size: 0.78rem;
  color: #ffedd5;
  background: rgba(249, 115, 22, 0.14);
  border: 1px solid rgba(249, 115, 22, 0.35);
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
}

.pricing-wide-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.25rem;
}

.plan-card-wide {
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.15rem;
  position: relative;
  overflow: hidden;
}

.pro-card {
  border-color: rgba(192, 132, 252, 0.35);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.45);
}

.pro-aurora-glow-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 90% 10%, rgba(139, 92, 246, 0.14), transparent 60%);
  pointer-events: none;
}

.p-card-top {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.p-tier-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.p-tier-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #ffffff;
}

.p-tier-tag,
.pro-highlight-badge {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.14rem 0.48rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.pro-title-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pro-highlight-badge {
  background: rgba(192, 132, 252, 0.18);
  color: #d8b4fe;
}

.pro-savings-inline {
  font-size: 0.72rem;
  color: #34d399;
}

.p-price-block {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.p-price-val {
  font-size: 1.9rem;
  font-weight: 800;
  color: #ffffff;
}

.p-price-period,
.p-billed-sub,
.p-card-desc {
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

.p-features-block {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.p-features-label {
  font-size: 0.64rem;
  color: #64748b;
}

.pro-features-label {
  color: #c084fc;
}

.p-feat-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.p-feat-list li,
.p-feat-item {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.8rem;
  color: #d1d5db;
}

.feat-icon {
  color: #64748b;
  flex-shrink: 0;
  margin-top: 2px;
}

.pro-icon {
  color: #c084fc;
}

.pro-features-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem 1.25rem;
}

.p-feat-col {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.feat-copy strong {
  display: block;
  font-size: 0.82rem;
  color: #f8fafc;
}

.feat-copy small {
  font-size: 0.72rem;
  color: #9ca3af;
}

.plan-ghost-btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 0.7rem 1.1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: #f3f4f6;
  font-size: 0.82rem;
  font-weight: 600;
}

.pro-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.plan-primary-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.75rem 1.45rem;
  border-radius: 9999px;
  background: #f8fafc;
  color: #050505;
  font-size: 0.86rem;
  font-weight: 700;
  transition: transform 0.2s ease;
}

.plan-primary-cta:hover {
  transform: translateY(-2px);
}

.savings-text-note {
  font-size: 0.75rem;
  color: #9ca3af;
}

.pricing-bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.75rem 1.15rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.75rem;
  color: #94a3b8;
}

.p-trust-item,
.p-trust-legal {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pricing-live-link,
.p-trust-legal a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* FAQ & Banner */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  border-radius: 16px;
  padding: 1rem 1.25rem;
}

.faq-item summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 0.96rem;
  font-weight: 700;
  color: #f8fafc;
}

.faq-item[open] .faq-chev {
  transform: rotate(180deg);
}

.faq-chev {
  transition: transform 0.2s ease;
  color: var(--color-accent);
}

.faq-item p {
  margin: 0.7rem 0 0;
  font-size: 0.86rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.showcase-cta-banner {
  border-radius: 24px;
  padding: 1.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.cta-banner-copy {
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.cta-banner-copy h3 {
  font-size: 1.25rem;
  color: #ffffff;
  margin: 0;
}

.cta-banner-copy p {
  font-size: 0.86rem;
  color: #cbd5e1;
  margin: 0;
}

.cta-banner-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
}

/* Lightbox Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(5, 6, 10, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-content {
  position: relative;
  max-width: 900px;
  max-height: 90vh;
  background: #14151b;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  cursor: pointer;
}

.modal-img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 12px;
}

.modal-caption {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #9ca3af;
}

.modal-raw {
  color: var(--color-accent);
  text-decoration: underline;
}

/* Terminal Footer */
.footer-wrapper {
  position: relative;
  z-index: 1;
  padding-bottom: 3rem;
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
  font-size: 0.72rem;
}

.terminal-controls {
  display: flex;
  gap: 6px;
}

.t-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.t-red { background: #ef4444; }
.t-yellow { background: #eab308; }
.t-green { background: #22c55e; }

.terminal-status {
  color: #34d399;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.status-indicator.live {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
}

.terminal-body {
  padding: 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.terminal-links-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1rem;
  font-size: 0.78rem;
  color: var(--color-accent);
}

.terminal-links-bar a:hover {
  text-decoration: underline;
}

.terminal-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.76rem;
  color: #9ca3af;
}

.terminal-quote-side {
  color: #f3f4f6;
}

.terminal-quote-side em {
  color: var(--color-accent);
}

@media (max-width: 960px) {
  .hero-grid,
  .features-split-grid,
  .pos-split-row,
  .pricing-wide-grid,
  .artwork-grid {
    grid-template-columns: 1fr;
  }

  .comp-matrix-grid,
  .privacy-pillars-grid,
  .verified-strip {
    grid-template-columns: repeat(2, 1fr);
  }

  .stack-grid-clean,
  .needs-strip {
    grid-template-columns: 1fr;
  }

  .pro-features-2col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .nav-pill-desktop {
    display: none;
  }

  .nav-pill-mobile {
    display: inline;
  }

  .comp-matrix-grid,
  .privacy-pillars-grid,
  .verified-strip {
    grid-template-columns: 1fr;
  }
}
</style>
