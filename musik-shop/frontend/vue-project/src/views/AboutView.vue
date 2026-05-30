<script setup>
import PageLayout from '@/components/layout/PageLayout.vue'

const partners = ['Martin®', 'Fender®', 'Boss®', 'Cord®', 'Bibson®', 'Goland®', 'Casico®']

const team = [
  {
    name: 'Поляк Илья',
    role: 'Основатель, подбор инструментов, еврей',
    bio: 'Гитарист и звукорежиссёр с 15-летним опытом. Помогает новичкам выбрать первый инструмент.',
  },
  {
    name: 'Стасюк Артем',
    role: 'Менеджер студийного отдела',
    bio: 'Консультирует по микрофонам, мониторам и педалям эффектов для домашней и профессиональной студии. Имеет большой алмазный дом',
  },
  {
    name: 'Кулик Кирилл',
    role: 'Сервис и логистика',
    bio: 'Отвечает за доставку по Беларуси, проверку комплектации и связь с поставщиками.',
  },
]
</script>

<template>
  <PageLayout>
    <div class="about">
      <header class="about__hero">
        <img src="/images/logo.png" alt="Musik Shop" class="about__logo" width="72" height="72" />
        <h1>О нас</h1>
        <p class="about__lead">
          Musik Shop — интернет-магазин музыкального оборудования для любителей и профессионалов.
        </p>
      </header>

      <section class="about__block">
        <h2>О магазине</h2>
        <p>
          Мы помогаем находить инструменты и студийную технику по приемлемым ценам: от первой гитары
          до продвинутого оборудования для записи. В каталоге — гитары, бас, педали, микрофоны и
          сопутствующие товары с подробными описаниями и реальными фотографиями.
        </p>
        <p>
          Наша цель — упростить покупку: удобный каталог с фильтрами, корзина, личный кабинет и
          поддержка на русском языке. Работаем с проверенными брендами и следим за наличием на складе.
        </p>
      </section>

      <section class="about__block">
        <h2>Команда</h2>
        <ul class="team-grid">
          <li v-for="member in team" :key="member.name" class="team-card">
            <div class="team-card__avatar" aria-hidden="true">{{ member.name.charAt(0) }}</div>
            <h3>{{ member.name }}</h3>
            <p class="team-card__role">{{ member.role }}</p>
            <p class="team-card__bio">{{ member.bio }}</p>
          </li>
        </ul>
      </section>

      <section class="about__block">
        <h2>Партнёры и бренды</h2>
        <p>
          Сотрудничаем с ведущими производителями музыкального оборудования. Поставляем оригинальную
          продукцию и консультируем по совместимости и назначению товаров.
        </p>
        <ul class="partners-list">
          <li v-for="brand in partners" :key="brand">{{ brand }}</li>
        </ul>
      </section>

      <section class="about__block about__contacts">
        <h2>Контакты</h2>
        <dl class="contacts-grid">
          <div>
            <dt>Адрес</dt>
            <dd>Брест, ул. Орловская, 4</dd>
          </div>
          <div>
            <dt>Телефон</dt>
            <dd>+375 (29) 232-34-23</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>info@musik-shop.by</dd>
          </div>
          <div>
            <dt>Режим работы</dt>
            <dd>Пн–Сб: 10:00–20:00</dd>
          </div>
        </dl>
      </section>
    </div>
  </PageLayout>
</template>

<style scoped>
.about {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.about__hero {
  text-align: center;
  margin-bottom: 3rem;
}

.about__logo {
  margin: 0 auto 1rem;
  object-fit: contain;
}

.about__hero h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.about__lead {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 560px;
  margin: 0 auto;
}

.about__block {
  margin-bottom: 2.5rem;
}

.about__block h2 {
  font-size: 1.35rem;
  margin-bottom: 1rem;
  color: var(--color-accent);
}

.about__block p {
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.team-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

.team-card {
  padding: 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.team-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-on-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.team-card h3 {
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
}

.team-card__role {
  font-size: 0.85rem;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.team-card__bio {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.partners-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  margin-top: 1rem;
}

.partners-list li {
  padding: 0.4rem 0.85rem;
  background: rgba(196, 30, 58, 0.08);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-weight: 600;
  color: var(--color-text);
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
}

.contacts-grid dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.contacts-grid dd {
  font-size: 1rem;
}
</style>
