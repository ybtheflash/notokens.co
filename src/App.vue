<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TokenPieChart from './components/TokenPieChart.vue'
import OtterLogo from './components/OtterLogo.vue'

// Main view state
const activeView = ref<'home' | 'projects'>('home')

// Interactive card state: 'yubaraj' | 'sourish' | null
const activeFounder = ref<'yubaraj' | 'sourish' | null>(null)

const setActive = (founder: 'yubaraj' | 'sourish') => {
  activeFounder.value = founder
}

const clearActive = () => {
  activeFounder.value = null
}

// OtterSpeak 3-second slideshow & tap-to-change
const currentSlide = ref(0)
const otterSlides = ['/otterspeak-1.webp', '/otterspeak-2.webp']
let slideTimer: number | null = null

const startSlideTimer = () => {
  if (slideTimer !== null) clearInterval(slideTimer)
  slideTimer = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % otterSlides.length
  }, 3000)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % otterSlides.length
  startSlideTimer()
}

onMounted(() => {
  startSlideTimer()
})

onUnmounted(() => {
  if (slideTimer !== null) {
    clearInterval(slideTimer)
  }
})

// Clean, reduced particle set to prevent overlapping
const bubbleParticles = [
  { id: 1, left: '15%', delay: '0s', duration: '2.4s', size: '2rem', drift: '-10px' },
  { id: 2, left: '40%', delay: '0.6s', duration: '2.6s', size: '2.2rem', drift: '12px' },
  { id: 3, left: '65%', delay: '0.2s', duration: '2.5s', size: '2.1rem', drift: '-8px' },
  { id: 4, left: '85%', delay: '0.8s', duration: '2.7s', size: '1.9rem', drift: '10px' }
]
</script>

<template>
  <div class="app-wrapper">
    <!-- Navbar -->
    <header class="navbar-wrapper">
      <div class="container navbar">
        <div class="nav-left">
          <a href="/" class="brand-logo" aria-label="No Tokens Home" title="No Tokens">
            <svg class="brand-symbol" viewBox="0 0 40 32" width="38" height="30" fill="none" stroke="var(--color-accent)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <!-- Left true 50/50 semi-circle -->
              <path class="circle-half left-half" d="M 11 7 A 9 9 0 0 0 11 25"/>
              <!-- Slightly tilted, longer middle slash with clean separation -->
              <line class="slash-line" x1="23" y1="1" x2="17" y2="31"/>
              <!-- Right true 50/50 semi-circle -->
              <path class="circle-half right-half" d="M 29 7 A 9 9 0 0 1 29 25"/>
            </svg>
          </a>
        </div>
        <div class="nav-right">
          <a href="mailto:hello@notokens.co" class="contact-link">
            <svg class="mail-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            <span>hello@notokens.co</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content Transition -->
    <Transition name="swipe-fade" mode="out-in">
      <main v-if="activeView === 'home'" key="home-view" class="main-content container">
        <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-grid">
          <!-- Left: Hero text and Tagline -->
          <div class="hero-left">
            <h1 class="hero-title">No_Tokens<span class="terminal-dot">.</span></h1>
            <p class="hero-tagline">
              Using AI the right way—Drive the AI, don't let the AI be <span class="tagline-highlight">YOU</span>.
            </p>
          </div>

          <!-- Right: Large Pie Chart & Limit Text under it -->
          <div class="hero-right">
            <TokenPieChart class="hero-pie-chart" />
            <p class="pie-limit-text">
              You have used some of your 5-hour limit, it will fully refresh in 3 hours, 09 minutes.
            </p>
          </div>
        </div>
      </section>

      <!-- Builders Section with Interactive Abyss Push -->
      <section class="founders-section" @mouseleave="clearActive">
        <div class="section-header">
          <h2 class="section-title">// the builders</h2>
        </div>

        <div class="founders-grid">
          <!-- Founder 1: Yubaraj Biswas -->
          <div class="card-outer-wrapper">
            <div 
              class="founder-card"
              :class="{
                'is-active': activeFounder === 'yubaraj',
                'is-victim': activeFounder === 'sourish'
              }"
              @mouseenter="setActive('yubaraj')"
              @click="setActive('yubaraj')"
            >
              <!-- Mobile cancel cross button -->
              <button 
                v-if="activeFounder === 'yubaraj'" 
                class="mobile-cross-btn" 
                @click.stop="clearActive" 
                aria-label="Cancel"
              >
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <!-- Card Inner Content (fades/blurs on victim) -->
              <div class="card-inner-body" :class="{ 'is-victim-body': activeFounder === 'sourish' }">
                <Transition name="morph-view" mode="out-in">
                  <!-- Base View -->
                  <div v-if="activeFounder !== 'yubaraj'" key="yb-base" class="base-view">
                    <div class="card-top anim-item anim-1">
                      <div class="founder-title-row">
                        <h3 class="founder-name">Yubaraj Biswas</h3>
                        <span class="founder-username">ybtheflash</span>
                      </div>
                      <div class="founder-location">
                        <svg class="location-pin" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>Kolkata, India</span>
                      </div>
                      <p class="founder-quote">"me cook food. code cook me."</p>
                    </div>
                    <div class="founder-links anim-item anim-2">
                      <a href="https://ybtheflash.in" target="_blank" rel="noopener noreferrer" class="social-btn">
                        <span>ybtheflash.in</span>
                      </a>
                      <a href="https://github.com/ybtheflash" target="_blank" rel="noopener noreferrer" class="social-btn icon-only" aria-label="GitHub" title="GitHub">
                        <svg class="icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <!-- Expanded Bio View (Faded in on hover) -->
                  <div v-else key="yb-bio" class="bio-view">
                    <div class="bio-header anim-item anim-1">
                      <span class="bio-tag">&lt;co-founder /&gt;</span>
                      <div class="founder-title-row">
                        <h3 class="founder-name bio-name">Yubaraj Biswas</h3>
                        <span class="founder-username">ybtheflash</span>
                      </div>
                      <div class="founder-location">
                        <svg class="location-pin" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>Kolkata, India</span>
                      </div>
                    </div>
                    <p class="bio-description anim-item anim-2">
                      Making wrong choices since '02. Certified corporate majdoor, ts pmo icl on everything—VALORANT is saving all my tokens cause I'm too busy. Also hungry bro.
                    </p>
                    <div class="founder-links anim-item anim-3">
                      <a href="https://ybtheflash.in" target="_blank" rel="noopener noreferrer" class="social-btn">
                        <span>ybtheflash.in</span>
                      </a>
                      <a href="https://github.com/ybtheflash" target="_blank" rel="noopener noreferrer" class="social-btn icon-only" aria-label="GitHub" title="GitHub">
                        <svg class="icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Victim Bubbling Emojis (🥰 for Yubaraj when Sourish is active) -->
            <div v-if="activeFounder === 'sourish'" class="emoji-bubble-overlay">
              <span 
                v-for="p in bubbleParticles" 
                :key="'y-em-'+p.id" 
                class="bubble-emoji"
                :style="{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  fontSize: p.size,
                  '--drift': p.drift
                }"
              >
                🥰
              </span>
            </div>
          </div>

          <!-- Founder 2: Sourish Bose -->
          <div class="card-outer-wrapper">
            <div 
              class="founder-card"
              :class="{
                'is-active': activeFounder === 'sourish',
                'is-victim': activeFounder === 'yubaraj'
              }"
              @mouseenter="setActive('sourish')"
              @click="setActive('sourish')"
            >
              <!-- Mobile cancel cross button -->
              <button 
                v-if="activeFounder === 'sourish'" 
                class="mobile-cross-btn" 
                @click.stop="clearActive" 
                aria-label="Cancel"
              >
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <!-- Card Inner Content (fades/blurs on victim) -->
              <div class="card-inner-body" :class="{ 'is-victim-body': activeFounder === 'yubaraj' }">
                <Transition name="morph-view" mode="out-in">
                  <!-- Base View -->
                  <div v-if="activeFounder !== 'sourish'" key="sb-base" class="base-view">
                    <div class="card-top anim-item anim-1">
                      <div class="founder-title-row">
                        <h3 class="founder-name">Sourish Bose</h3>
                        <span class="founder-username">justysss</span>
                      </div>
                      <div class="founder-location">
                        <svg class="location-pin" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>Kolkata, India</span>
                      </div>
                      <p class="founder-quote">"Building what outlives luck."</p>
                    </div>
                    <div class="founder-links anim-item anim-2">
                      <a href="https://sourishbose.com" target="_blank" rel="noopener noreferrer" class="social-btn">
                        <span>sourishbose.com</span>
                      </a>
                      <a href="https://github.com/justysss" target="_blank" rel="noopener noreferrer" class="social-btn icon-only" aria-label="GitHub" title="GitHub">
                        <svg class="icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <!-- Expanded Bio View (Faded in on hover) -->
                  <div v-else key="sb-bio" class="bio-view">
                    <div class="bio-header anim-item anim-1">
                      <span class="bio-tag">&lt;co-founder /&gt;</span>
                      <div class="founder-title-row">
                        <h3 class="founder-name bio-name">Sourish Bose</h3>
                        <span class="founder-username">justysss</span>
                      </div>
                      <div class="founder-location">
                        <svg class="location-pin" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>Kolkata, India</span>
                      </div>
                    </div>
                    <p class="bio-description anim-item anim-2">
                      Corporate SWE & video editor shipping cool AI tools between 9-to-5 sprint syncs. Surviving LeetCode by day, clutching Valorant by night.
                    </p>
                    <div class="founder-links anim-item anim-3">
                      <a href="https://sourishbose.com" target="_blank" rel="noopener noreferrer" class="social-btn">
                        <span>sourishbose.com</span>
                      </a>
                      <a href="https://github.com/justysss" target="_blank" rel="noopener noreferrer" class="social-btn icon-only" aria-label="GitHub" title="GitHub">
                        <svg class="icon-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- Victim Bubbling Emojis (🤨 for Sourish when Yubaraj is active) -->
            <div v-if="activeFounder === 'yubaraj'" class="emoji-bubble-overlay">
              <span 
                v-for="p in bubbleParticles" 
                :key="'s-em-'+p.id" 
                class="bubble-emoji"
                :style="{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  fontSize: p.size,
                  '--drift': p.drift
                }"
              >
                🤨
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects Trigger Button -->
      <div class="projects-trigger-container">
        <button class="projects-trigger-btn" @click="activeView = 'projects'">
          What we building? 
          <span class="animated-arrows">
            <span class="traffic-arrow arrow-1">&gt;</span>
            <span class="traffic-arrow arrow-2">&gt;</span>
            <span class="traffic-arrow arrow-3">&gt;</span>
          </span>
        </button>
      </div>
    </main>

    <main v-else key="projects-view" class="main-content container projects-content">
      <div class="projects-header">
        <button class="back-trigger-btn" @click="activeView = 'home'">
          <span class="arrows">&lt;&lt;&lt;</span> Back to HQ
        </button>
        <div class="building-status anim-item anim-1">Currently building</div>
      </div>

      <div class="project-card anim-item anim-2">
        <div class="project-card-header">
          <div class="otterspeak-branding">
            <div class="otterspeak-logo-container">
              <OtterLogo class="otterspeak-svg" />
              <h1 class="otterspeak-text">otterspeak</h1>
            </div>
            <div class="otterspeak-beta">beta</div>
          </div>
          <div class="project-url-container">
            <a href="https://otterspeak.com" target="_blank" rel="noopener noreferrer" class="project-url">
              otterspeak.com
            </a>
            <div class="project-preview-popup">
              <div class="preview-browser-header">
                <div class="preview-traffic-dots">
                  <span class="preview-dot p-close"></span>
                  <span class="preview-dot p-min"></span>
                  <span class="preview-dot p-max"></span>
                </div>
                <div class="preview-url-pill">
                  <svg class="preview-lock-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>otterspeak.com</span>
                </div>
                <span class="preview-badge-live">LIVE</span>
              </div>
              <div class="preview-viewport">
                <img 
                  v-for="(slide, idx) in otterSlides" 
                  :key="slide"
                  :src="slide" 
                  :alt="`OtterSpeak Preview ${idx + 1}`" 
                  class="preview-image"
                  :class="{ 'active-slide': currentSlide === idx }"
                />
                <div class="preview-slide-indicators">
                  <span 
                    v-for="(_, idx) in otterSlides" 
                    :key="idx" 
                    class="slide-pip" 
                    :class="{ active: currentSlide === idx }"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Inline Slideshow (Visible on mobile screens, 3s interval + tap to change) -->
        <div class="mobile-slideshow-container" @click="nextSlide" title="Tap to switch screenshot">
          <div class="mobile-viewport">
            <img 
              v-for="(slide, idx) in otterSlides" 
              :key="'mobile-'+slide"
              :src="slide" 
              :alt="`OtterSpeak App Preview ${idx + 1}`" 
              class="mobile-slide-image"
              :class="{ 'active-slide': currentSlide === idx }"
            />
            <div class="mobile-slide-indicators">
              <span 
                v-for="(_, idx) in otterSlides" 
                :key="'m-pip-'+idx" 
                class="mobile-pip" 
                :class="{ active: currentSlide === idx }"
              ></span>
            </div>
            <div class="tap-hint">
              <span>tap to switch</span>
            </div>
          </div>
        </div>

        <p class="project-description anim-item anim-4">
          OtterSpeak is an AI-powered platform designed to help you improve your reading speed, pronunciation, and fluency. Using advanced speech recognition, RSVP reading techniques and the OtterBrain AI, it provides real-time feedback on your reading sessions.
        </p>
      </div>
    </main>
    </Transition>

    <!-- Glassmorphic Terminal Window Footer -->
    <footer class="footer-wrapper">
      <!-- Seamless Soft Orange Abyss Glow (Rendered first for GPU compositing) -->
      <div class="abyss-container">
        <div class="abyss-glow"></div>
      </div>

      <div class="container footer-container">
        <!-- Terminal Window Card -->
        <div class="terminal-footer">
          <!-- Terminal Title Bar -->
          <div class="terminal-header">
            <div class="terminal-controls">
              <span class="control-dot close"></span>
              <span class="control-dot minimize"></span>
              <span class="control-dot maximize"></span>
            </div>
            <div class="terminal-title">notokens.co ~ zsh</div>
            <div class="terminal-status">
              <span class="status-default">STATUS: ONLINE</span>
              <span class="status-hover">STATUS: DON'T TOUCH ME</span>
            </div>
          </div>

          <!-- Terminal Content Body -->
          <div class="terminal-body">
            <!-- Left: Copyright with prompt -->
            <div class="footer-left">
              <span class="terminal-prompt">&gt;</span>
              <p class="copyright-text">&copy; {{ new Date().getFullYear() }} No Tokens. All rights reserved.</p>
            </div>

            <!-- Right: Quote -->
            <div class="footer-right">
              <p class="footer-quote">
                There's no AI <span class="quote-break"><br/></span>without <span class="quote-highlight">I</span> in it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-color: var(--color-bg);
}

/* Navbar */
.navbar-wrapper {
  width: 100%;
  padding-top: 2.25rem;
  padding-bottom: 1.5rem;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 10px;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease;
}

.brand-logo:hover {
  transform: scale(1.08);
  filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.65));
}

.brand-symbol {
  display: block;
}

.circle-half,
.slash-line {
  stroke: var(--color-accent);
  transition: stroke 0.25s ease, filter 0.25s ease;
}

.brand-logo:hover .circle-half,
.brand-logo:hover .slash-line {
  stroke: #ffa54c;
}

.contact-link {
  font-family: var(--font-mono);
  font-size: clamp(0.92rem, 2vw, 1.05rem);
  font-weight: 600;
  color: var(--color-text);
  padding: 0.55rem 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  letter-spacing: 0.02em;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.mail-icon {
  color: var(--color-accent);
  opacity: 0.9;
  transition: transform 0.25s ease, opacity 0.25s ease;
  flex-shrink: 0;
}

.contact-link:hover {
  background: rgba(249, 115, 22, 0.08);
  color: var(--color-accent);
  border-color: rgba(249, 115, 22, 0.45);
  box-shadow: 0 0 25px rgba(249, 115, 22, 0.14);
}

.contact-link:hover .mail-icon {
  animation: carIndicatorBlink 0.62s infinite;
}

@keyframes carIndicatorBlink {
  0%, 48% {
    opacity: 1;
    color: var(--color-accent);
  }
  50%, 98% {
    opacity: 0.15;
    color: var(--color-accent);
  }
}

/* Main Content Area */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  padding-bottom: 0;
}

/* Hero Section */
.hero-section {
  width: 100%;
  margin-bottom: 4.5rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 3rem;
  align-items: center;
}

@media (max-width: 800px) {
  .hero-grid {
    grid-template-columns: 1.15fr 0.95fr;
    gap: 1.5rem;
  }

  .hero-section {
    margin-bottom: 3rem;
  }
}

@media (max-width: 480px) {
  .hero-grid {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 1.25rem;
  }
}

.hero-left {
  text-align: left;
}

.hero-title {
  font-family: var(--font-mono);
  font-size: clamp(2.4rem, 6.5vw, 5.4rem);
  font-weight: 800;
  color: var(--color-hero-font);
  letter-spacing: -0.05em;
  line-height: 1.05;
  margin-bottom: 1.25rem;
  text-shadow: 0 0 45px rgba(255, 237, 213, 0.12);
}

/* Blinking terminal dot */
.terminal-dot {
  color: var(--color-accent);
  animation: terminalBlink 1.1s steps(2, start) infinite;
  display: inline-block;
  font-weight: 700;
  margin-left: 2px;
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
  font-size: clamp(0.95rem, 1.8vw, 1.3rem);
  font-weight: 300;
  color: var(--color-text-muted);
  line-height: 1.5;
  max-width: 520px;
}

.tagline-highlight {
  font-family: var(--font-mono);
  color: var(--color-accent);
  font-style: italic;
  font-weight: 600;
}

.hero-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 1rem;
}

.pie-limit-text {
  font-family: var(--font-sans);
  font-size: clamp(0.78rem, 1.3vw, 0.88rem);
  color: var(--color-text-muted);
  text-align: right;
  margin: 0;
  max-width: 250px;
  line-height: 1.45;
  font-weight: 400;
}

/* Builders Section */
.founders-section {
  width: 100%;
  text-align: left;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.75rem;
}

.section-title {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--color-text-muted);
  font-weight: 400;
  letter-spacing: 0.05em;
}

.founders-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.25rem;
  width: 100%;
  align-items: start;
}

@media (max-width: 768px) {
  .founders-grid {
    grid-template-columns: 1fr;
  }
}

/* Card Outer Wrapper for Absolute Overlays */
.card-outer-wrapper {
  position: relative;
  width: 100%;
}

/* Founder Cards & Abyss Push Physics */
.founder-card {
  position: relative;
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 18px;
  padding: 1.85rem 2rem;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  transition: 
    height 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  overflow: hidden;
}

/* Active Card State: Smoothly expands size & container morphs with radiant ambient halo */
.founder-card.is-active {
  height: 295px;
  border-color: rgba(249, 115, 22, 0.45);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55), 0 0 30px rgba(249, 115, 22, 0.12);
  transform: translateY(-5px) scale(1.02);
  background: linear-gradient(150deg, #1e1e24 0%, #141418 100%);
  z-index: 10;
}

/* Victim Card State: Sinks into abyss */
.founder-card.is-victim {
  transform: translateY(35px) scale(0.92);
  border-color: rgba(255, 255, 255, 0.03);
  box-shadow: none;
}

@media (max-width: 768px) {
  .founder-card {
    height: 230px;
  }
  .founder-card.is-active {
    height: 315px;
  }
}

.card-inner-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: opacity 0.55s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.card-inner-body.is-victim-body {
  opacity: 0.1;
  filter: blur(6px) grayscale(0.9);
  pointer-events: none;
}

/* Smooth Morph View Transition (Crossfade with subtle lift) */
.morph-view-enter-active,
.morph-view-leave-active {
  transition: opacity 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.morph-view-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.morph-view-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Staggered Line-by-Line Cascade Animations */
.bio-view .anim-item,
.base-view .anim-item {
  animation: lineCascade 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.anim-1 {
  animation-delay: 0.03s !important;
}

.anim-2 {
  animation-delay: 0.1s !important;
}

.anim-3 {
  animation-delay: 0.17s !important;
}

@keyframes lineCascade {
  0% {
    opacity: 0;
    transform: translateY(7px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Cross button - hidden on desktop, visible ONLY in mobile screens */
.mobile-cross-btn {
  display: none;
}

@media (max-width: 768px) {
  .mobile-cross-btn {
    position: absolute;
    top: 1.1rem;
    right: 1.1rem;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: var(--color-text-muted);
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 20;
  }

  .mobile-cross-btn svg {
    display: block;
    pointer-events: none;
  }

  .mobile-cross-btn:hover {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #fff;
  }
}

.base-view, .bio-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 1.25rem;
}

.founder-title-row {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;
}

.founder-name {
  font-family: var(--font-sans);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0;
}

.founder-username {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-accent);
  opacity: 0.75;
  letter-spacing: 0.02em;
}

.founder-location {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-muted);
  opacity: 0.55;
  letter-spacing: 0.02em;
  margin-top: 0.15rem;
  margin-bottom: 0.45rem;
}

.location-pin {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.founder-quote {
  font-size: 0.95rem;
  font-style: italic;
  color: var(--color-text-muted);
}

.bio-header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.bio-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
  letter-spacing: 0.1em;
}

.bio-name {
  color: var(--color-hero-font);
}

.bio-description {
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.5;
}

.founder-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-btn,
.social-btn:visited,
.social-btn:active,
.social-btn:focus {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.4rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.social-btn.icon-only {
  padding: 0.42rem 0.55rem;
}

.social-btn.icon-only svg {
  display: block;
}

.social-btn:hover {
  color: var(--color-accent) !important;
  border-color: rgba(249, 115, 22, 0.45);
  background: rgba(249, 115, 22, 0.08);
}

/* Floating Emoji Bubbles on Victim Card - Reduced count & no overlap */
.emoji-bubble-overlay {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 50;
}

.bubble-emoji {
  position: absolute;
  bottom: 20px;
  animation: floatBubble infinite cubic-bezier(0.2, 0.8, 0.2, 1);
  user-select: none;
  filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.75)) drop-shadow(0 0 4px rgba(0, 0, 0, 0.9));
  transform-origin: center center;
}

@keyframes floatBubble {
  0% {
    transform: translate(0, 35px) scale(0.2);
    opacity: 0;
  }
  18% {
    opacity: 1;
    transform: translate(calc(var(--drift) * 0.2), 0px) scale(1.2);
  }
  45% {
    opacity: 1;
    transform: translate(calc(var(--drift) * 0.6), -45px) scale(1.25);
  }
  75% {
    opacity: 0.9;
    transform: translate(calc(var(--drift) * 0.9), -95px) scale(1.05);
  }
  100% {
    transform: translate(var(--drift), -150px) scale(0.4);
    opacity: 0;
  }
}

/* Footer Section with Glassmorphic Terminal Window */
.footer-wrapper {
  position: relative;
  width: 100%;
  padding-top: 0;
  padding-bottom: 2.5rem;
  background: transparent;
  isolation: isolate;
  margin-top: auto;
}

.footer-container {
  position: relative;
  z-index: 5;
  margin-bottom: 0.5rem;
}

/* Glassmorphic Terminal Window */
.terminal-footer {
  width: 100%;
  background: linear-gradient(180deg, rgba(20, 20, 26, 0.85) 0%, rgba(26, 20, 18, 0.72) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(249, 115, 22, 0.1);
  overflow: hidden;
}

/* Terminal Title Bar */
.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.terminal-controls {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.control-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.control-dot.close {
  background-color: #ff5f56;
  box-shadow: 0 0 6px rgba(255, 95, 86, 0.4);
}

.control-dot.minimize {
  background-color: #ffbd2e;
  box-shadow: 0 0 6px rgba(255, 189, 46, 0.4);
}

.control-dot.maximize {
  background-color: #27c93f;
  box-shadow: 0 0 6px rgba(39, 201, 63, 0.4);
}

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-text-muted);
  opacity: 0.8;
  letter-spacing: 0.03em;
}

.terminal-status {
  position: relative;
  display: inline-grid;
  grid-template-areas: "status";
  align-items: center;
  justify-items: end;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-accent);
  letter-spacing: 0.08em;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.terminal-status .status-default,
.terminal-status .status-hover {
  grid-area: status;
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.35s ease;
  white-space: nowrap;
}

.terminal-status .status-default {
  opacity: 1;
  transform: translateY(0);
}

.terminal-status .status-hover {
  opacity: 0;
  transform: translateY(4px);
  color: #ff5f56;
  pointer-events: none;
}

.terminal-status:hover .status-default {
  opacity: 0;
  transform: translateY(-4px);
  pointer-events: none;
}

.terminal-status:hover .status-hover {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Terminal Content Body */
.terminal-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.85rem 2rem;
  gap: 1.5rem;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.terminal-prompt {
  font-family: var(--font-mono);
  color: var(--color-accent);
  font-weight: 700;
  font-size: 1rem;
}

.copyright-text {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.footer-right {
  text-align: right;
}

.footer-quote {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.quote-highlight {
  font-family: var(--font-mono);
  color: var(--color-accent);
  font-style: italic;
}

@media (max-width: 768px) {
  .terminal-body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    padding: 1.35rem 1.25rem;
  }

  .footer-right {
    order: 1;
    text-align: right;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .footer-left {
    order: 2;
    text-align: left;
    width: 100%;
    justify-content: flex-start;
  }

  .footer-quote {
    font-size: clamp(0.92rem, 3.8vw, 1.15rem);
    white-space: nowrap;
    text-align: right;
  }

  .quote-break {
    display: none;
  }

  .copyright-text {
    font-size: 0.78rem;
  }
}

/* Pure Natural Radial Abyss - Rich vibrant holy light orange, zero box cutoffs */
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

/* Transition for main content swipe fade */
.swipe-fade-enter-active,
.swipe-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.swipe-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.swipe-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Projects Trigger Button */
.projects-trigger-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  margin: 0;
}
.projects-trigger-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.85rem 2rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.projects-trigger-btn:hover {
  color: var(--color-hero-font);
  background: rgba(249, 115, 22, 0.08);
  border-color: rgba(249, 115, 22, 0.45);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
.back-trigger-btn {
  background: transparent;
  border: none;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  transition: color 0.3s ease, transform 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}
.projects-trigger-btn:hover,
.back-trigger-btn:hover {
  color: var(--color-accent);
  transform: scale(1.02);
}
.back-trigger-btn .arrows {
  color: var(--color-accent);
  letter-spacing: -2px;
  transition: transform 0.3s ease;
}
.back-trigger-btn:hover .arrows {
  transform: translateX(-6px);
}
.animated-arrows {
  display: inline-flex;
  gap: 0.2rem;
  color: var(--color-accent);
}
.traffic-arrow {
  animation: traffic-blink 1.2s infinite;
  opacity: 0.2;
}
.traffic-arrow.arrow-1 { animation-delay: 0s; }
.traffic-arrow.arrow-2 { animation-delay: 0.2s; }
.traffic-arrow.arrow-3 { animation-delay: 0.4s; }

@keyframes traffic-blink {
  0% { opacity: 0.2; transform: scale(1); }
  25% { opacity: 1; text-shadow: 0 0 10px var(--color-accent); transform: scale(1.1); }
  50% { opacity: 0.2; transform: scale(1); }
  100% { opacity: 0.2; transform: scale(1); }
}

/* Projects View */
.projects-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 2rem;
}
.projects-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}
.back-trigger-btn {
  padding: 0.5rem 0;
}
.building-status {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.project-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 18px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  position: relative;
  overflow: visible;
  transition: border-color 0.4s ease;
}

.project-card:hover {
  border-color: rgba(249, 115, 22, 0.25);
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.otterspeak-branding {
  position: relative;
  display: inline-flex;
}
.otterspeak-logo-container {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.otterspeak-svg {
  height: 3rem;
  width: auto;
  color: #2dd4bf;
}
.otterspeak-text {
  font-family: 'Roboto Mono', monospace;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  color: var(--color-hero-font);
  margin: 0;
  line-height: 1;
}
.otterspeak-beta {
  position: absolute;
  top: -0.75rem;
  right: -2.25rem;
  font-family: 'Outfit', sans-serif;
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.project-url-container {
  position: relative;
}

.project-url {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--color-accent);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(249, 115, 22, 0.08);
  transition: all 0.25s ease;
  display: inline-flex;
}

.project-url:hover {
  background: rgba(249, 115, 22, 0.15);
  transform: translateY(-2px);
}

.project-preview-popup {
  position: absolute;
  top: calc(100% + 0.85rem);
  right: 0;
  width: 500px;
  height: 320px;
  background: #111116;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(45, 212, 191, 0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px) scale(0.98);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.project-url-container:hover .project-preview-popup {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.preview-browser-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.85rem;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.preview-traffic-dots {
  display: flex;
  gap: 0.35rem;
}

.preview-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.preview-dot.p-close { background-color: #ff5f56; }
.preview-dot.p-min { background-color: #ffbd2e; }
.preview-dot.p-max { background-color: #27c93f; }

.preview-url-pill {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 0.15rem 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.preview-lock-icon {
  color: #2dd4bf;
}

.preview-badge-live {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: #2dd4bf;
  letter-spacing: 0.05em;
}

.preview-viewport {
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #09090b;
}

.preview-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  opacity: 0;
  transition: opacity 0.75s ease-in-out;
  display: block;
}

.preview-image.active-slide {
  opacity: 1;
}

.preview-slide-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slide-pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transition: all 0.35s ease;
}

.slide-pip.active {
  width: 16px;
  border-radius: 4px;
  background: #2dd4bf;
  box-shadow: 0 0 8px rgba(45, 212, 191, 0.7);
}



/* Mobile Inline Slideshow */
.mobile-slideshow-container {
  display: none;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(45, 212, 191, 0.08);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.mobile-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #09090b;
  overflow: hidden;
}

.mobile-slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  display: block;
}

.mobile-slide-image.active-slide {
  opacity: 1;
}

.mobile-slide-indicators {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 5;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-pip {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  transition: all 0.3s ease;
}

.mobile-pip.active {
  width: 14px;
  border-radius: 3px;
  background: #2dd4bf;
  box-shadow: 0 0 6px rgba(45, 212, 191, 0.7);
}

.tap-hint {
  position: absolute;
  top: 8px;
  right: 8px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
}

.project-description {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--color-text-muted);
  max-width: 800px;
  margin: 0;
}

@media (max-width: 768px) {
  .project-preview-popup {
    display: none;
  }
  .mobile-slideshow-container {
    display: block;
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .project-card {
    padding: 1.5rem;
    gap: 1.25rem;
  }
  .otterspeak-text {
    font-size: 1.75rem;
  }
  .otterspeak-svg {
    height: 1.75rem;
  }
  .otterspeak-beta {
    top: -0.5rem;
    right: -1.75rem;
  }
}
</style>
