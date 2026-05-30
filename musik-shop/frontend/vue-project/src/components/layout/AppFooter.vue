<script setup>
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()

const footerLinks = [
  { label: 'Каталог', to: '/catalog' },
  { label: 'О нас', to: '/about' },
  { label: 'Корзина', to: '/cart' },
  { label: 'Поиск', to: '/search' },
]

const socials = [
  { label: 'Telegram', href: 'https://t.me/mweb4ik' },
  { label: 'YouTube', href: 'https://youtu.be/dQw4w9WgXcQ?si=xAYa5X_DTc2WYorf' },
]
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <p class="footer__logo">Musik Shop</p>
        <p class="footer__tagline">
          Музыкальные инструменты и студийное оборудование для любителей и профессионалов.
        </p>
      </div>

      <nav class="footer__nav" aria-label="Разделы сайта">
        <p class="footer__heading">Разделы</p>
        <ul class="footer__list">
          <li v-for="link in footerLinks" :key="link.to">
            <RouterLink :to="link.to">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="footer__contact">
        <p class="footer__heading">Контакты</p>
        <p><a href="mailto:info@musik-shop.by">info@musik-shop.by</a></p>
        <p><a href="tel:+375292323423">+375 (29) 232-34-23</a></p>
        <p>Брест, ул. Орловская, 4</p>
      </div>

      <div class="footer__social">
        <p class="footer__heading">Соцсети</p>
        <ul class="footer__social-list">
          <li v-for="s in socials" :key="s.label">
            <a :href="s.href" target="_blank" rel="noopener noreferrer">{{ s.label }}</a>
          </li>
        </ul>
      </div>
    </div>

    <p class="footer__copy">© {{ year }} Musik Shop. Тестовая страница проекта.</p>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 4rem;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.footer__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2.5rem 1.25rem 1.5rem;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 2rem;
}

.footer__logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.footer__tagline {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  max-width: 280px;
}

.footer__heading {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.footer__list,
.footer__social-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.footer__list a,
.footer__social-list a {
  color: var(--color-text);
  font-size: 0.95rem;
  transition: color 0.2s;
}

.footer__list a:hover,
.footer__social-list a:hover {
  color: var(--color-accent);
}

.footer__contact p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.footer__contact a {
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.footer__contact a:hover {
  color: var(--color-accent);
}

.footer__copy {
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .footer {
    margin-top: 2.5rem;
  }

  .footer__inner {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 2rem var(--page-padding-x) 1.25rem;
  }

  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer__inner {
    grid-template-columns: 1fr;
  }
}
</style>
