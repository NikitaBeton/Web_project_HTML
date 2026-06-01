<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const AD_URL = 'https://fonbet.by/'
const adImageSrc = `${import.meta.env.BASE_URL}images/ad3.jpg`
const CLOSE_DELAY_MS = 8000
const AD_WIDTH = 300
const AD_HEIGHT = 169
const AD_WIDTH_MOBILE = 220
const AD_HEIGHT_MOBILE = 124
const MAX_SPEED = 3.8

const dismissed = ref(false)
const canClose = ref(false)
const isHovered = ref(false)
const secondsLeft = ref(Math.ceil(CLOSE_DELAY_MS / 1000))
const posX = ref(80)
const posY = ref(120)
const velX = ref(1.6)
const velY = ref(1.2)

let rafId = null
let unlockTimer = null
let countdownInterval = null
let reducedMotion = false

const adStyle = computed(() => {
  if (reducedMotion) return {}
  return { transform: `translate3d(${posX.value}px, ${posY.value}px, 0)` }
})

function getAdSize() {
  if (window.innerWidth <= 768) {
    return { width: AD_WIDTH_MOBILE, height: AD_HEIGHT_MOBILE }
  }
  return { width: AD_WIDTH, height: AD_HEIGHT }
}

function clearTimers() {
  if (unlockTimer) {
    clearTimeout(unlockTimer)
    unlockTimer = null
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

function startCloseCountdown() {
  clearTimers()
  canClose.value = false
  secondsLeft.value = Math.ceil(CLOSE_DELAY_MS / 1000)
  const startedAt = Date.now()

  countdownInterval = setInterval(() => {
    const remaining = CLOSE_DELAY_MS - (Date.now() - startedAt)
    secondsLeft.value = Math.max(0, Math.ceil(remaining / 1000))
    if (remaining <= 0) {
      canClose.value = true
      clearInterval(countdownInterval)
      countdownInterval = null
    }
  }, 200)

  unlockTimer = setTimeout(() => {
    canClose.value = true
    secondsLeft.value = 0
    clearTimers()
  }, CLOSE_DELAY_MS)
}

function getBounds() {
  const margin = 8
  const { width, height } = getAdSize()
  return {
    minX: margin,
    minY: margin,
    maxX: Math.max(margin, window.innerWidth - width - margin),
    maxY: Math.max(margin, window.innerHeight - height - margin),
  }
}

function clampPosition(bounds) {
  posX.value = Math.max(bounds.minX, Math.min(bounds.maxX, posX.value))
  posY.value = Math.max(bounds.minY, Math.min(bounds.maxY, posY.value))
}

function animate() {
  if (dismissed.value || reducedMotion) {
    rafId = null
    return
  }

  if (isHovered.value || canClose.value) {
    rafId = requestAnimationFrame(animate)
    return
  }

  const bounds = getBounds()
  const speed = Math.hypot(velX.value, velY.value)

  if (speed > MAX_SPEED) {
    velX.value = (velX.value / speed) * MAX_SPEED
    velY.value = (velY.value / speed) * MAX_SPEED
  } else if (speed < 0.8) {
    velX.value = (velX.value / (speed || 1)) * 0.8
    velY.value = (velY.value / (speed || 1)) * 0.8
  }

  posX.value += velX.value
  posY.value += velY.value

  if (posX.value <= bounds.minX) {
    posX.value = bounds.minX
    velX.value = Math.abs(velX.value)
  } else if (posX.value >= bounds.maxX) {
    posX.value = bounds.maxX
    velX.value = -Math.abs(velX.value)
  }

  if (posY.value <= bounds.minY) {
    posY.value = bounds.minY
    velY.value = Math.abs(velY.value)
  } else if (posY.value >= bounds.maxY) {
    posY.value = bounds.maxY
    velY.value = -Math.abs(velY.value)
  }

  clampPosition(bounds)
  rafId = requestAnimationFrame(animate)
}

function onResize() {
  clampPosition(getBounds())
}

function closeAd() {
  if (!canClose.value) return
  dismissed.value = true
  clearTimers()
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function onPointerEnter() {
  isHovered.value = true
}

function onPointerLeave() {
  isHovered.value = false
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  posX.value = Math.min(window.innerWidth * 0.55, getBounds().maxX)
  posY.value = Math.min(window.innerHeight * 0.35, getBounds().maxY)
  startCloseCountdown()
  window.addEventListener('resize', onResize, { passive: true })
  if (!reducedMotion) {
    rafId = requestAnimationFrame(animate)
  }
})

onUnmounted(() => {
  clearTimers()
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="!dismissed"
      class="intrusive-ad-flying"
      :class="{ 'intrusive-ad-flying--paused': isHovered || canClose }"
      :style="adStyle"
      role="dialog"
      aria-label="Реклама"
      @pointerenter="onPointerEnter"
      @pointerleave="onPointerLeave"
    >
      <div class="intrusive-ad-flying__frame">
        <button
          type="button"
          class="intrusive-ad-flying__close"
          :class="{ 'intrusive-ad-flying__close--locked': !canClose }"
          :aria-disabled="!canClose"
          :aria-label="canClose ? 'Закрыть рекламу' : `Закрыть через ${secondsLeft} сек.`"
          :title="canClose ? 'Закрыть' : `Можно закрыть через ${secondsLeft} сек.`"
          @click.stop.prevent="closeAd"
        >
          <span v-if="!canClose" class="intrusive-ad-flying__countdown">{{ secondsLeft }}</span>
          <span v-else aria-hidden="true">×</span>
        </button>

        <a
          :href="AD_URL"
          class="intrusive-ad-flying__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            :src="adImageSrc"
            alt="Реклама"
            class="intrusive-ad-flying__img"
            width="686"
            height="386"
            draggable="false"
          />
        </a>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.intrusive-ad-flying {
  position: fixed;
  z-index: 10001;
  top: 0;
  left: 0;
  width: 300px;
  height: 169px;
  pointer-events: auto;
  will-change: transform;
}

.intrusive-ad-flying__frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(196, 30, 58, 0.4);
  background: #fff;
}

.intrusive-ad-flying--paused .intrusive-ad-flying__frame {
  box-shadow: 0 12px 32px rgba(196, 30, 58, 0.55);
}

.intrusive-ad-flying__close {
  position: absolute;
  z-index: 20;
  top: 6px;
  right: 6px;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  font-size: 20px;
  line-height: 1;
  background: rgba(255, 255, 255, 0.95);
  color: #555;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 1;
  pointer-events: auto;
  touch-action: manipulation;
  transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.intrusive-ad-flying__close--locked {
  cursor: not-allowed;
  color: var(--color-accent);
  font-weight: 700;
  font-size: 0.7rem;
}

.intrusive-ad-flying__close:not(.intrusive-ad-flying__close--locked):hover {
  color: var(--color-accent);
  background: #fff;
}

.intrusive-ad-flying__countdown {
  font-size: 0.62rem;
  font-variant-numeric: tabular-nums;
}

.intrusive-ad-flying__link {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
}

.intrusive-ad-flying__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #fff;
  user-select: none;
}

@media (max-width: 768px) {
  .intrusive-ad-flying {
    width: 220px;
    height: 124px;
  }

  .intrusive-ad-flying__close {
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    font-size: 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .intrusive-ad-flying {
    top: auto;
    left: auto;
    bottom: 5rem;
    right: 1rem;
    transform: none !important;
  }
}
</style>
