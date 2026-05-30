<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'musik_shop_ad_dismissed'

const AD_URL =
  'https://www.google.com/aclk?sa=L&ai=DChsSEwiGtMXk69-UAxVNsoMHHd76OB0YACICCAEQABoCZWY&co=1&gclid=CjwKCAjw8uTQBhAdEiwAVvtJyu8JBOsYaDQYJd3Gn0K0Gkpo3HcYpviUFBNURRSLT15n0S8FnJZo2hoCGV4QAvD_BwE&cid=CAASuwHkaCVHC0yZllFYJQC0VfD1mWsE4XdZBIYm9LJXJkM0UceuLFFIawYe8rUdJbb45UUg4-u39VEqHaL7sLZ3LHBdKvyeNFcTDB-L1VGZ0tHeSvZEOwyWQzKKeoKsONPO0wtsXVH8fpagmK3K2K1r-oKIY3alH8p_nNnvUhM2-__6F1JVOsmr5Iu-rIR9s7bJvcjDWcicvOKJ0_rpFagq3jUCSIlRUvRgJzTh2aLr3XY3mPXkbEZrYrpFxkVb&cce=2&sig=AOD64_04iq6wZA9CzDQhVabngO7hUdLnfQ&q&adurl&ved=2ahUKEwjb1b3k69-UAxWL_rsIHWBBDJgQ0Qx6BAgNEAE'

const visible = ref(!sessionStorage.getItem(STORAGE_KEY))
const phase = ref('mini')
let expandTimer = null

function closeAd() {
  visible.value = false
  sessionStorage.setItem(STORAGE_KEY, '1')
}

onMounted(() => {
  if (!visible.value) return

  expandTimer = setTimeout(() => {
    phase.value = 'expanding'
    setTimeout(() => {
      phase.value = 'fullscreen'
    }, 1200)
  }, 3000)
})

onUnmounted(() => {
  if (expandTimer) clearTimeout(expandTimer)
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
    >
      <div class="intrusive-ad__frame">
        <button
          type="button"
          class="intrusive-ad__close"
          aria-label="Закрыть рекламу"
          title="Закрыть"
          @click="closeAd"
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
          <img src="/images/ad.png" alt="Реклама" class="intrusive-ad__img" />
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
  z-index: 9999;
  transition:
    top 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    left 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    width 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    height 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.6s ease;
}

.intrusive-ad--mini {
  bottom: 1rem;
  right: 1rem;
  top: auto;
  left: auto;
  width: 220px;
  height: 140px;
  background: transparent;
}

.intrusive-ad--expanding,
.intrusive-ad--fullscreen {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

.intrusive-ad__frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.intrusive-ad--mini .intrusive-ad__frame {
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(196, 30, 58, 0.45);
  background: #fff;
}

.intrusive-ad--expanding .intrusive-ad__frame,
.intrusive-ad--fullscreen .intrusive-ad__frame {
  max-width: 95vw;
  max-height: 95vh;
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
  top: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  min-width: 14px;
  min-height: 14px;
  padding: 0;
  font-size: 8px;
  line-height: 1;
  background: rgba(255, 255, 255, 0.7);
  color: #888;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  opacity: 0.5;
}

.intrusive-ad--fullscreen .intrusive-ad__close {
  top: 12px;
  right: 12px;
}

.intrusive-ad__close:hover {
  opacity: 0.8;
  color: var(--color-accent);
}

.intrusive-ad__link {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.intrusive-ad__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.intrusive-ad--fullscreen .intrusive-ad__img {
  max-width: 90vw;
  max-height: 80vh;
}

.intrusive-ad__hint {
  position: absolute;
  bottom: 1.5rem;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: ad-blink 1s step-end infinite;
}

@media (max-width: 768px) {
  .intrusive-ad--mini {
    width: 160px;
    height: 100px;
    bottom: 0.75rem;
    right: 0.75rem;
  }

  .intrusive-ad__close {
    width: 28px;
    height: 28px;
    min-width: 28px;
    min-height: 28px;
    font-size: 18px;
    top: 6px;
    right: 6px;
    opacity: 0.85;
  }

  .intrusive-ad--fullscreen .intrusive-ad__close {
    top: max(12px, env(safe-area-inset-top, 12px));
    right: max(12px, env(safe-area-inset-right, 12px));
    width: 36px;
    height: 36px;
    min-width: 36px;
    min-height: 36px;
    font-size: 22px;
  }

  .intrusive-ad__hint {
    font-size: 0.9rem;
    bottom: max(1rem, env(safe-area-inset-bottom, 1rem));
    padding: 0 1rem;
    text-align: center;
  }
}

@keyframes ad-blink {
  50% {
    opacity: 0.3;
  }
}
</style>
