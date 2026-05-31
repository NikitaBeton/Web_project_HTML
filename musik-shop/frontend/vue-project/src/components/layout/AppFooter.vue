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
  { label: 'Telegram', href: 'https://t.me/mweb4ik', icon: 'telegram' },
  { label: 'YouTube', href: 'https://youtu.be/dQw4w9WgXcQ?si=xAYa5X_DTc2WYorf', icon: 'youtube' },
]
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__brand-row">
          <div class="footer__brand-text">
            <p class="footer__logo">Musik Shop</p>
            <p class="footer__tagline">
              Музыкальные инструменты и студийное оборудование для любителей и профессионалов.
            </p>
          </div>

          <ul class="footer__social-icons" aria-label="Соцсети">
            <li v-for="s in socials" :key="s.label">
              <a :href="s.href" target="_blank" rel="noopener noreferrer" :aria-label="s.label">
                <svg
                  v-if="s.icon === 'telegram'"
                  class="footer__icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M9.78 15.29 9.5 19.8c.55 0 .79-.24 1.08-.53l2.59-2.49 5.38 3.95c.99.55 1.69.26 1.96-.92l3.54-16.62h.01c.32-1.49-.54-2.07-1.52-1.71L2.3 9.52c-1.46.57-1.44 1.39-.25 1.75l4.9 1.53 11.38-7.18c.54-.35 1.03-.16.63.22"
                  />
                </svg>
                <svg
                  v-else
                  class="footer__icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M21.8 8.001a2.749 2.749 0 0 0-1.938-1.951C18.08 5.667 12 5.667 12 5.667s-6.08 0-7.862.383A2.749 2.749 0 0 0 2.2 8.001 28.62 28.62 0 0 0 1.818 12a28.7 28.7 0 0 0 .382 3.999 2.749 2.749 0 0 0 1.938 1.951C5.92 18.333 12 18.333 12 18.333s6.08 0 7.862-.383a2.749 2.749 0 0 0 1.938-1.951A28.62 28.62 0 0 0 22.182 12a28.7 28.7 0 0 0-.382-3.999zM9.955 14.963V9.037L15.818 12l-5.863 2.963z"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </div>
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

.footer__brand-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.footer__social-icons {
  list-style: none;
  display: none;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.footer__social-icons a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  color: var(--color-text-muted);
  background: var(--color-surface-elevated);
  transition: color 0.2s, background 0.2s;
}

.footer__social-icons a:hover {
  color: var(--color-accent);
  background: rgba(196, 30, 58, 0.1);
}

.footer__icon {
  width: 1.15rem;
  height: 1.15rem;
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

  .footer__social-icons {
    display: flex;
  }

  .footer__social {
    display: none;
  }

  .footer__contact {
    text-align: right;
  }
}

@media (max-width: 480px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
  }

  .footer__nav {
    grid-column: 1;
  }

  .footer__contact {
    grid-column: 2;
  }
}
</style>
