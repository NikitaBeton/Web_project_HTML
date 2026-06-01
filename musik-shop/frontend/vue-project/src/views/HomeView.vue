<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageLayout from '@/components/layout/PageLayout.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import IntrusiveAd from '@/components/ads/IntrusiveAd.vue'
import IntrusiveAdLeft from '@/components/ads/IntrusiveAdLeft.vue'
import { fetchProducts } from '@/api/products'

const products = ref([])

onMounted(async () => {
  try {
    const { data } = await fetchProducts({ badge: 'Новинка' })
    products.value = data.products.length ? data.products : (await fetchProducts()).data.products
  } catch {
    products.value = []
  }
})
</script>

<template>
  <PageLayout>
    <section class="hero" aria-label="Новинки каталога">
      <div class="hero__content">
        <img src="/images/logo.png" alt="Musik Shop" class="hero__logo" width="80" height="80" />
        <h1 class="hero__title">Новинки каталога</h1>
        <p class="hero__text">
          Свежие поступления: гитары, педали и бас — смотрите полный ассортимент в каталоге
        </p>
        <RouterLink to="/catalog" class="hero__cta">Смотреть новинки</RouterLink>
      </div>
    </section>

    <section class="catalog-preview">
      <div class="catalog-preview__head">
        <h2 class="section-title">Новинки</h2>
        <p class="section-subtitle">Актуальные товары из нашего каталога</p>
      </div>

      <ul v-if="products.length" class="product-grid">
        <li v-for="product in products" :key="product.id">
          <ProductCard :product="product" />
        </li>
      </ul>
      <p v-else class="catalog-preview__empty">
        <RouterLink to="/catalog">Перейти в каталог</RouterLink>
      </p>
    </section>

    <section class="brands">
      <p class="brands__label">Партнёры магазина</p>
      <ul class="brands__list">
        <li>Martin®</li>
        <li>Fender®</li>
        <li>Boss®</li>
        <li>Cord®</li>
      </ul>
    </section>
  </PageLayout>
  <IntrusiveAd />
  <IntrusiveAdLeft />
</template>

<style scoped>
.hero {
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.25rem;
  background: linear-gradient(135deg, var(--color-accent) 0%, #8b1528 50%, var(--color-accent) 100%);
  color: var(--color-on-accent);
}

.hero__content {
  max-width: var(--max-width);
  width: 100%;
  text-align: center;
}

.hero__logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 auto 1rem;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.hero__title {
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.hero__text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 520px;
  margin: 0 auto 1.5rem;
}

.hero__cta {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background: var(--color-bg);
  color: var(--color-accent);
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  transition: background 0.2s, transform 0.15s;
}

.hero__cta:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.catalog-preview {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 3rem 1.25rem;
}

.catalog-preview__head {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.75rem;
  margin-bottom: 0.35rem;
}

.section-subtitle {
  color: var(--color-text-muted);
  font-size: 1rem;
}

.catalog-preview__empty {
  text-align: center;
  padding: 2rem;
}

.catalog-preview__empty a {
  color: var(--color-accent);
  font-weight: 600;
}

.brands {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.25rem 2rem;
  text-align: center;
}

.brands__label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.brands__list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .hero {
    min-height: 240px;
    padding: 2rem var(--page-padding-x);
  }

  .hero__text {
    font-size: 1rem;
  }

  .catalog-preview {
    padding: 2rem var(--page-padding-x);
  }

  .brands {
    padding: 0 var(--page-padding-x) 1.5rem;
  }

  .brands__list {
    gap: 1rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
