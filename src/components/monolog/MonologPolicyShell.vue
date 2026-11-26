<script setup lang="ts">
import { ArrowLeft, ExternalLink } from 'lucide-vue-next'

defineProps<{
  title: string
  updatedLabel: string
  updatedDatetime: string
  canonicalUrl: string
  alternateLabel: string
  alternateTo: string
}>()
</script>

<template>
  <div class="monolog-policy-page">
    <div class="policy-aurora" aria-hidden="true"></div>

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
          <router-link to="/monolog" class="nav-monolog-branding">
            <img src="/monolog/monolog-logo.svg" alt="Monolog Logo" class="nav-monolog-logo" />
            <span class="nav-path">monolog</span>
          </router-link>
        </div>

        <div class="nav-right">
          <router-link :to="alternateTo" class="nav-pill">{{ alternateLabel }}</router-link>
          <a
            :href="canonicalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-pill live-pill"
          >
            <span>monolog.notokens.co</span>
            <ExternalLink :size="12" />
          </a>
          <router-link to="/monolog" class="nav-pill back-pill">
            <ArrowLeft :size="13" />
            <span>Back to Monolog</span>
          </router-link>
        </div>
      </div>
    </header>

    <main class="container policy-main">
      <article class="policy-card">
        <div class="policy-eyebrow font-mono">// MONOLOG LEGAL &amp; PRIVACY ARCHITECTURE</div>
        <h1 class="policy-title">{{ title }}</h1>
        <p class="policy-date font-mono">
          <time :datetime="updatedDatetime">{{ updatedLabel }}</time>
          <span class="dot-sep">·</span>
          <a :href="canonicalUrl" target="_blank" rel="noopener noreferrer">Official mirror at monolog.notokens.co ↗</a>
        </p>

        <div class="policy-body">
          <slot />
        </div>
      </article>
    </main>

    <footer class="container policy-footer">
      <div class="footer-links">
        <router-link to="/monolog">Monolog Overview</router-link>
        <router-link to="/monolog/privacy">Privacy Policy</router-link>
        <router-link to="/monolog/tos">Terms of Use</router-link>
        <a href="https://monolog.notokens.co/" target="_blank" rel="noopener noreferrer">monolog.notokens.co ↗</a>
        <a href="https://web.monolog.notokens.co/" target="_blank" rel="noopener noreferrer">Monolog Web ↗</a>
        <a href="mailto:monolog@notokens.co">monolog@notokens.co</a>
      </div>
      <span class="font-mono copyright">© {{ new Date().getFullYear() }} NoTokens</span>
    </footer>
  </div>
</template>

<style scoped>
.monolog-policy-page {
  min-height: 100vh;
  background-color: #08090d;
  color: #e5e7eb;
  position: relative;
  display: flex;
  flex-direction: column;
}

.policy-aurora {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 12% 10%, rgba(249, 115, 22, 0.14), transparent 42%),
    radial-gradient(circle at 88% 15%, rgba(192, 132, 252, 0.12), transparent 45%);
  pointer-events: none;
  z-index: 0;
}

.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(8, 9, 13, 0.84);
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
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.nav-monolog-logo {
  width: 22px;
  height: 22px;
}

.nav-path {
  font-family: var(--font-cursive);
  font-size: 1.25rem;
  color: #f8fafc;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.nav-pill:hover {
  border-color: var(--color-accent);
  color: #ffffff;
}

.live-pill {
  border-color: rgba(249, 115, 22, 0.4);
  color: #ffedd5;
}

.policy-main {
  position: relative;
  z-index: 1;
  flex: 1;
  padding-top: 2.5rem;
  padding-bottom: 3rem;
}

.policy-card {
  max-width: 820px;
  margin: 0 auto;
  background: rgba(24, 24, 28, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 24px;
  padding: 2.5rem clamp(1.25rem, 4vw, 3rem);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55);
}

.policy-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  margin-bottom: 0.6rem;
}

.policy-title {
  font-size: clamp(1.9rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #ffedd5;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 0.65rem;
}

.policy-date {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.78rem;
  color: #9ca3af;
  padding-bottom: 1.5rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.policy-date a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.policy-body :deep(h2) {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f8fafc;
  margin: 2rem 0 0.6rem;
  letter-spacing: -0.01em;
}

.policy-body :deep(p) {
  font-size: 0.94rem;
  color: #cbd5e1;
  line-height: 1.72;
  margin: 0 0 0.9rem;
}

.policy-body :deep(a) {
  color: #fb923c;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.policy-body :deep(a:hover) {
  color: #ffedd5;
}

.policy-footer {
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.5rem;
  padding-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.15rem;
}

.footer-links a:hover {
  color: var(--color-accent);
}

.copyright {
  color: #64748b;
  font-size: 0.75rem;
}
</style>
