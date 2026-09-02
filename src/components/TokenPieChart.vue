<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const tokensRemaining = ref(69)
const circumference = 251.3274 // 2 * Math.PI * 40
const isReady = ref(false)

let animationFrameId: number | null = null

function animateValue(target: number, duration = 1800) {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  const start = tokensRemaining.value
  const startTime = performance.now()

  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Smooth cubic easeInOut
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    tokensRemaining.value = start + (target - start) * ease

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step)
    } else {
      tokensRemaining.value = target
      animationFrameId = null
    }
  }

  animationFrameId = requestAnimationFrame(step)
}

const onHover = () => {
  if (!isReady.value) return
  animateValue(3, 1800)
}

const onLeave = () => {
  if (!isReady.value) return
  animateValue(69, 1800)
}

onMounted(() => {
  // Prevent immediate auto-trigger on page reload if cursor rests on pie
  setTimeout(() => {
    isReady.value = true
  }, 600)
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div 
    class="pie-wrapper" 
    @mouseenter="onHover" 
    @mouseleave="onLeave" 
    role="img" 
    aria-label="Tokens remaining pie chart. Hover to deplete tokens."
  >
    <svg class="pie-chart" viewBox="0 0 100 100">
      <!-- Background track -->
      <circle 
        class="pie-bg" 
        cx="50" 
        cy="50" 
        r="40" 
        fill="none" 
        stroke="#26262d" 
        stroke-width="10" 
      />
      <!-- Active orange token value stroke -->
      <circle 
        class="pie-value" 
        cx="50" 
        cy="50" 
        r="40" 
        fill="none" 
        stroke="#f97316" 
        stroke-width="10" 
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="circumference - (tokensRemaining / 100) * circumference"
      />
    </svg>
    <div class="token-value-display">
      <span class="number">{{ Math.round(tokensRemaining) }}</span><span class="percent">%</span>
    </div>
  </div>
</template>

<style scoped>
.pie-wrapper {
  position: relative;
  width: clamp(120px, 16vw, 175px);
  height: clamp(120px, 16vw, 175px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;
  transition: transform 0.25s ease;
  background: transparent;
}

.pie-wrapper:hover {
  transform: scale(1.02);
}

.pie-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  overflow: visible;
}

.pie-bg {
  stroke: #26262d;
}

.pie-value {
  stroke: #f97316;
}

.token-value-display {
  position: absolute;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--color-text, #f3f4f6);
  display: flex;
  align-items: baseline;
  justify-content: center;
  pointer-events: none;
}

.number {
  font-size: clamp(1.75rem, 3vw, 2.7rem);
  line-height: 1;
}

.percent {
  font-size: clamp(0.95rem, 1.5vw, 1.35rem);
  color: #f97316;
  margin-left: 2px;
}
</style>
