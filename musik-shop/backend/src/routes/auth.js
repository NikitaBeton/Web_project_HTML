const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, query, validationResult } = require('express-validator')
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

function formatUser(row) {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    createdAt: row.created_at,
  }
}

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
}

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Ошибка валидации',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
    return true
  }
  return false
}

router.get(
  '/check-email',
  query('email').isEmail().withMessage('Укажите корректный email'),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const email = req.query.email.trim().toLowerCase()
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
    res.json({ available: rows.length === 0 })
  },
)

router.get('/me', authMiddleware, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, email, username, created_at FROM users WHERE id = ? LIMIT 1',
    [req.user.userId],
  )

  if (!rows.length) {
    return res.status(404).json({ message: 'Пользователь не найден' })
  }

  res.json({ user: formatUser(rows[0]) })
})

router.post(
  '/register',
  body('email').isEmail().withMessage('Укажите корректный email'),
  body('username')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Логин: от 2 до 100 символов'),
  body('password').isLength({ min: 6 }).withMessage('Пароль: минимум 6 символов'),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const email = req.body.email.trim().toLowerCase()
    const username = req.body.username.trim()
    const password = req.body.password

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
      [email, username],
    )
    if (existing.length) {
      return res.status(409).json({ message: 'Пользователь с таким email или логином уже существует' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
      [email, username, passwordHash],
    )

    const user = { id: result.insertId, email, username }
    const token = signToken(user)

    res.status(201).json({ token, user })
  },
)

router.post(
  '/login',
  body('username')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Укажите логин'),
  body('password').notEmpty().withMessage('Введите пароль'),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const username = req.body.username.trim()
    const password = req.body.password

    const [rows] = await pool.query(
      'SELECT id, email, username, password_hash, created_at FROM users WHERE username = ? LIMIT 1',
      [username],
    )

    if (!rows.length) {
      return res.status(401).json({ message: 'Неверный логин или пароль' })
    }

    const row = rows[0]
    const valid = await bcrypt.compare(password, row.password_hash)
    if (!valid) {
      return res.status(401).json({ message: 'Неверный логин или пароль' })
    }

    const user = formatUser(row)
    const token = signToken(user)

    res.json({ token, user })
  },
)

router.post('/logout', (_req, res) => {
  res.json({ message: 'Вы вышли из аккаунта' })
})

module.exports = router
