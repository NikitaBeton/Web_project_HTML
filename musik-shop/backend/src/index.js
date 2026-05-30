require('dotenv').config()

const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')

const app = express()
const PORT = process.env.PORT || 3000

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET не задан — используется значение по умолчанию (только для разработки)')
  process.env.JWT_SECRET = 'dev-secret-change-me'
}

function corsOrigin(origin, callback) {
  const allowed = process.env.CORS_ORIGIN || 'http://localhost:5173'
  if (!origin) return callback(null, true)
  if (origin === allowed) return callback(null, true)
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true)
  if (/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/.test(origin)) return callback(null, true)
  if (/^https?:\/\/[\w-]+\.loca\.lt$/.test(origin)) return callback(null, true)
  callback(new Error('Not allowed by CORS'))
}

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

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

app.listen(PORT, HOST, () => {
  console.log(`API: http://localhost:${PORT}`)
  if (HOST === '0.0.0.0') {
    console.log('      (доступен в локальной сети по IP этого компьютера)')
  }
})
