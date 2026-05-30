<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const EXPAND_DELAY_MS = 3000

const AD_URL =
  'https://www.google.com/aclk?sa=L&ai=DChsSEwiGtMXk69-UAxVNsoMHHd76OB0YACICCAEQABoCZWY&co=1&gclid=CjwKCAjw8uTQBhAdEiwAVvtJyu8JBOsYaDQYJd3Gn0K0Gkpo3HcYpviUFBNURRSLT15n0S8FnJZo2hoCGV4QAvD_BwE&cid=CAASuwHkaCVHC0yZllFYJQC0VfD1mWsE4XdZBIYm9LJXJkM0UceuLFFIawYe8rUdJbb45UUg4-u39VEqHaL7sLZ3LHBdKvyeNFcTDB-L1VGZ0tHeSvZEOwyWQzKKeoKsONPO0wtsXVH8fpagmK3K2K1r-oKIY3alH8p_nNnvUhM2-__6F1JVOsmr5Iu-rIR9s7bJvcjDWcicvOKJ0_rpFagq3jUCSIlRUvRgJzTh2aLr3XY3mPXkbEZrYrpFxkVb&cce=2&sig=AOD64_04iq6wZA9CzDQhVabngO7hUdLnfQ&q&adurl&ved=2ahUKEwjb1b3k69-UAxWL_rsIHWBBDJgQ0Qx6BAgNEAE'

const adImageSrc = `${import.meta.env.BASE_URL}images/ad.png`

const route = useRoute()
const dismissed = ref(false)
const phase = ref('mini')
let expandTimer = null

const isHome = computed(() => route.name === 'home')
const visible = computed(() => isHome.value && !dismissed.value)

function clearExpandTimer() {
  if (expandTimer) {
    clearTimeout(expandTimer)
    expandTimer = null
  }
}

function scheduleExpand() {
  clearExpandTimer()
  if (!visible.value) return

  expandTimer = setTimeout(() => {
    if (visible.value && phase.value === 'mini') {
      phase.value = 'expanding'
    }
  }, EXPAND_DELAY_MS)
}

function closeAd() {
  dismissed.value = true
  clearExpandTimer()
}

function onTransitionEnd(event) {
  if (phase.value !== 'expanding') return
  if (event.target !== event.currentTarget) return
  if (event.propertyName !== 'width') return
  phase.value = 'fullscreen'
}

watch(
  () => route.name,
  (name, prev) => {
    if (name === 'home' && prev && prev !== 'home') {
      dismissed.value = false
      phase.value = 'mini'
      scheduleExpand()
    }
    if (name !== 'home') {
      clearExpandTimer()
      phase.value = 'mini'
    }
  },
)

watch(visible, (show) => {
  if (show) {
    phase.value = 'mini'
    scheduleExpand()
  } else {
    clearExpandTimer()
  }
})

onMounted(() => {
  scheduleExpand()
})

onUnmounted(() => {
  clearExpandTimer()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="intrusive-ad"
      :class="`intrusive-ad--${phase}`"
      role="dialog"
      aria-label="Реклама"
      @transitionend="onTransitionEnd"
    >
      <div class="intrusive-ad__frame">
        <button
          type="button"
          class="intrusive-ad__close"
          aria-label="Закрыть рекламу"
          title="Закрыть"
          @click.stop="closeAd"
        >
          ×
        </button>

        <a
          :href="AD_URL"
          class="intrusive-ad__link"
          target="_blank"
          rel="noopener noreferrer"
          @click="closeAd"
        >
          <img :src="adImageSrc" alt="Реклама" class="intrusive-ad__img" width="1512" height="828" />
        </a>

        <p v-if="phase === 'fullscreen'" class="intrusive-ad__hint">
          Специальное предложение — только сегодня!
        </p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.intrusive-ad {
  position: fixed;
  z-index: 10000;
  bottom: 1rem;
  right: 1rem;
  width: 220px;
  height: 140px;
  transform-origin: bottom right;
  overflow: hidden;
  background: transparent;
  pointer-events: auto;
  transition:
    width 2.8s cubic-bezier(0.22, 1, 0.36, 1),
    height 2.8s cubic-bezier(0.22, 1, 0.36, 1),
    bottom 2.8s cubic-bezier(0.22, 1, 0.36, 1),
    right 2.8s cubic-bezier(0.22, 1, 0.36, 1),
    background 1.2s ease 0.4s;
}

.intrusive-ad--expanding,
.intrusive-ad--fullscreen {
  width: 100vw;
  height: 100vh;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
}

.intrusive-ad__frame {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.intrusive-ad--mini .intrusive-ad__frame {
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(196, 30, 58, 0.45);
  background: #fff;
}

.intrusive-ad--expanding .intrusive-ad__frame {
  width: 100%;
  height: 100%;
  border-radius: 0;
  box-shadow: none;
  background: #fff;
}

.intrusive-ad--fullscreen .intrusive-ad__frame {
  width: min(95vw, 1200px);
  height: min(85vh, 820px);
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
  animation: ad-pulse 0.8s ease-in-out infinite alternate;
}

@keyframes ad-pulse {
  from {
    transform: scale(0.98);
  }
  to {
    transform: scale(1.02);
  }
}

.intrusive-ad__close {
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
  transition: opacity 0.15s ease, color 0.15s ease;
}

.intrusive-ad--fullscreen .intrusive-ad__close,
.intrusive-ad--expanding .intrusive-ad__close {
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  font-size: 24px;
}

.intrusive-ad__close:hover {
  opacity: 1;
  color: var(--color-accent);
}

.intrusive-ad__link {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.intrusive-ad--mini .intrusive-ad__link {
  flex: 1;
}

.intrusive-ad__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #fff;
}

.intrusive-ad--expanding .intrusive-ad__img,
.intrusive-ad--fullscreen .intrusive-ad__img {
  object-fit: contain;
}

.intrusive-ad__hint {
  position: absolute;
  bottom: 0.75rem;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0 1rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  pointer-events: none;
  animation: ad-blink 1s step-end infinite;
}

@media (max-width: 768px) {
  .intrusive-ad {
    width: 168px;
    height: 104px;
    bottom: 0.75rem;
    right: 0.75rem;
  }

  .intrusive-ad--expanding,
  .intrusive-ad--fullscreen {
    width: 100vw;
    height: 100vh;
    bottom: 0;
    right: 0;
  }

  .intrusive-ad__close {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    font-size: 22px;
  }

  .intrusive-ad--fullscreen .intrusive-ad__close,
  .intrusive-ad--expanding .intrusive-ad__close {
    top: max(12px, env(safe-area-inset-top, 12px));
    right: max(12px, env(safe-area-inset-right, 12px));
  }

  .intrusive-ad__hint {
    font-size: 0.85rem;
    bottom: max(0.5rem, env(safe-area-inset-bottom, 0.5rem));
  }
}

@media (prefers-reduced-motion: reduce) {
  .intrusive-ad {
    transition-duration: 0.01ms !important;
  }

  .intrusive-ad--fullscreen .intrusive-ad__frame {
    animation: none;
  }

  .intrusive-ad__hint {
    animation: none;
  }
}

@keyframes ad-blink {
  50% {
    opacity: 0.3;
  }
}
</style>
