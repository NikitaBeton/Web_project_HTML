require('dotenv').config()

const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const { ensureSchema } = require('./config/ensureSchema')
const { API_PREFIX, API_ROUTES } = require('./config/paths')
const authRoutes = require('./routes/auth')
const accountRoutes = require('./routes/account')
const productRoutes = require('./routes/products')

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_DIST = path.join(__dirname, '../../frontend/vue-project/dist')
const SERVE_FRONTEND = process.env.SERVE_FRONTEND === 'true' || process.env.SERVE_FRONTEND === '1'

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET не задан — используется значение по умолчанию (только для разработки)')
  process.env.JWT_SECRET = 'dev-secret-change-me'
}

function corsOrigin(origin, callback) {
  if (!origin) return callback(null, true)

  const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (!allowedOrigins.length || allowedOrigins.includes(origin)) {
    return callback(null, true)
  }

  callback(new Error('Not allowed by CORS'))
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())

app.get(API_ROUTES.health, (_req, res) => {
  res.json({ status: 'ok' })
})

app.use(API_ROUTES.auth.base, authRoutes)
app.use(API_ROUTES.account.base, accountRoutes)
app.use(API_ROUTES.products.base, productRoutes)

if (SERVE_FRONTEND && fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST))

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'))
  })
}

app.use((err, _req, res, _next) => {
  console.error(err)
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      message: 'Не удалось подключиться к базе данных. Проверьте настройки MySQL.',
    })
  }
  res.status(500).json({ message: 'Внутренняя ошибка сервера' })
})

const HOST = process.env.HOST || '0.0.0.0'

function logEndpoints() {
  console.log(`API (${API_PREFIX}):`)
  console.log(`  GET  ${API_ROUTES.health}`)
  console.log(`  POST ${API_ROUTES.auth.register}`)
  console.log(`  POST ${API_ROUTES.auth.login}`)
  console.log(`  GET  ${API_ROUTES.account.me}  (авторизация)`)
  console.log(`  GET  ${API_ROUTES.products.list}`)
  console.log(`  GET  ${API_ROUTES.products.filters}`)
  console.log(`  POST ${API_ROUTES.products.base}  (авторизация)`)
  console.log(`  PATCH ${API_ROUTES.products.base}/:id  (авторизация)`)
  console.log(`  DELETE ${API_ROUTES.products.base}/:id  (авторизация)`)

  if (SERVE_FRONTEND && fs.existsSync(FRONTEND_DIST)) {
    console.log('Фронтенд: /  (статика из dist)')
  } else if (SERVE_FRONTEND) {
    console.warn('SERVE_FRONTEND включён, но dist не найден — выполните npm run build')
  } else {
    console.log('Фронтенд в dev: /  (Vite), API через /api')
  }
}

async function start() {
  try {
    await ensureSchema()
  } catch (err) {
    console.warn('Не удалось проверить схему БД:', err.message)
  }

  app.listen(PORT, HOST, () => {
    console.log(`Сервер: порт ${PORT}`)
    logEndpoints()
  })
}

start()
