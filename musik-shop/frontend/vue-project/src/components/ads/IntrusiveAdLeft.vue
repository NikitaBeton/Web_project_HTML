<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const CLOSE_DELAY_MS = 5000

const AD_URL =
  'https://www.google.com/aclk?sa=L&ai=DChsSEwiGtMXk69-UAxVNsoMHHd76OB0YACICCAEQABoCZWY&co=1&gclid=CjwKCAjw8uTQBhAdEiwAVvtJyu8JBOsYaDQYJd3Gn0K0Gkpo3HcYpviUFBNURRSLT15n0S8FnJZo2hoCGV4QAvD_BwE&cid=CAASuwHkaCVHC0yZllFYJQC0VfD1mWsE4XdZBIYm9LJXJkM0UceuLFFIawYe8rUdJbb45UUg4-u39VEqHaL7sLZ3LHBdKvyeNFcTDB-L1VGZ0tHeSvZEOwyWQzKKeoKsONPO0wtsXVH8fpagmK3K2K1r-oKIY3alH8p_nNnvUhM2-__6F1JVOsmr5Iu-rIR9s7bJvcjDWcicvOKJ0_rpFagq3jUCSIlRUvRgJzTh2aLr3XY3mPXkbEZrYrpFxkVb&cce=2&sig=AOD64_04iq6wZA9CzDQhVabngO7hUdLnfQ&q&adurl&ved=2ahUKEwjb1b3k69-UAxWL_rsIHWBBDJgQ0Qx6BAgNEAE'

const adImageSrc = `${import.meta.env.BASE_URL}images/ad2.jpg`

const route = useRoute()
const dismissed = ref(false)
const canClose = ref(false)
const secondsLeft = ref(Math.ceil(CLOSE_DELAY_MS / 1000))

let unlockTimer = null
let countdownInterval = null

const isHome = computed(() => route.name === 'home')
const visible = computed(() => isHome.value && !dismissed.value)

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

function closeAd() {
  if (!canClose.value) return
  dismissed.value = true
  clearTimers()
}

function resetAd() {
  dismissed.value = false
  startCloseCountdown()
}

watch(
  () => route.name,
  (name, prev) => {
    if (name === 'home' && prev && prev !== 'home') {
      resetAd()
    }
    if (name !== 'home') {
      clearTimers()
    }
  },
)

watch(visible, (show) => {
  if (show) {
    startCloseCountdown()
  } else {
    clearTimers()
  }
})

onMounted(() => {
  if (visible.value) startCloseCountdown()
})

onUnmounted(() => {
  clearTimers()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="intrusive-ad-left" role="dialog" aria-label="Реклама">
      <div class="intrusive-ad-left__frame">
        <button
          type="button"
          class="intrusive-ad-left__close"
          :class="{ 'intrusive-ad-left__close--locked': !canClose }"
          :disabled="!canClose"
          :aria-label="canClose ? 'Закрыть рекламу' : `Закрыть через ${secondsLeft} сек.`"
          :title="canClose ? 'Закрыть' : `Можно закрыть через ${secondsLeft} сек.`"
          @click.stop="closeAd"
        >
          <span v-if="!canClose" class="intrusive-ad-left__countdown">{{ secondsLeft }}</span>
          <span v-else aria-hidden="true">×</span>
        </button>

        <a
          :href="AD_URL"
          class="intrusive-ad-left__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="adImageSrc" alt="Реклама" class="intrusive-ad-left__img" />
        </a>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.intrusive-ad-left {
  position: fixed;
  z-index: 9999;
  bottom: 1rem;
  left: 1rem;
  width: 220px;
  height: 140px;
  pointer-events: auto;
}

.intrusive-ad-left__frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(196, 30, 58, 0.45);
  background: #fff;
  box-sizing: border-box;
}

.intrusive-ad-left__close {
  position: absolute;
  z-index: 10;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  padding: 0;
  font-size: 20px;
  line-height: 1;
  background: rgba(255, 255, 255, 0.92);
  color: #444;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.85;
  transition:
    opacity 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;
}

.intrusive-ad-left__close--locked {
  cursor: not-allowed;
  opacity: 1;
  color: var(--color-accent);
  font-weight: 700;
  font-size: 0.85rem;
}

.intrusive-ad-left__close:not(:disabled):hover {
  opacity: 1;
  color: var(--color-accent);
}

.intrusive-ad-left__countdown {
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.intrusive-ad-left__link {
  display: block;
  width: 100%;
  height: 100%;
}

.intrusive-ad-left__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #fff;
}

@media (max-width: 768px) {
  .intrusive-ad-left {
    width: 168px;
    height: 104px;
    bottom: 0.75rem;
    left: 0.75rem;
  }

  .intrusive-ad-left__close {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    font-size: 22px;
  }

  .intrusive-ad-left__close--locked {
    font-size: 0.75rem;
  }
}
</style>
