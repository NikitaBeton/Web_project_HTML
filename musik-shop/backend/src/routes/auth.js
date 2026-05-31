const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, query } = require('express-validator')
const pool = require('../config/db')
const { handleValidation } = require('../utils/validation')
const { formatUser } = require('../utils/user')
const { validatePassword } = require('../utils/password')

const router = express.Router()

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )
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

router.post(
  '/register',
  body('email').isEmail().withMessage('Укажите корректный email'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Имя: от 2 до 100 символов'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Имя: от 2 до 100 символов'),
  body('password').custom((value) => {
    const { valid, errors } = validatePassword(value)
    if (!valid) {
      throw new Error(errors.join('. '))
    }
    return true
  }),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const email = req.body.email.trim().toLowerCase()
    const name = (req.body.name || req.body.username || '').trim()

    if (!name) {
      return res.status(400).json({
        message: 'Ошибка валидации',
        errors: [{ field: 'name', message: 'Укажите имя пользователя' }],
      })
    }

    const password = req.body.password

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR name = ? LIMIT 1',
      [email, name],
    )
    if (existing.length) {
      return res.status(409).json({ message: 'Пользователь с таким email или именем уже существует' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
      [email, name, passwordHash],
    )

    const user = { id: result.insertId, email, name }
    const token = signToken(user)

    res.status(201).json({ token, user: formatUser({ ...user, created_at: new Date() }) })
  },
)

router.post(
  '/login',
  body('password').notEmpty().withMessage('Введите пароль'),
  body('email').optional().isEmail().withMessage('Укажите корректный email'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('username').optional().trim().isLength({ min: 2, max: 100 }),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const password = req.body.password
    const email = req.body.email?.trim().toLowerCase()
    const name = (req.body.name || req.body.username || '').trim()

    if (!email && !name) {
      return res.status(400).json({
        message: 'Ошибка валидации',
        errors: [{ field: 'email', message: 'Укажите email или имя пользователя' }],
      })
    }

    let rows
    if (email) {
      ;[rows] = await pool.query(
        'SELECT id, email, name, password_hash, created_at FROM users WHERE email = ? LIMIT 1',
        [email],
      )
    } else {
      ;[rows] = await pool.query(
        'SELECT id, email, name, password_hash, created_at FROM users WHERE name = ? LIMIT 1',
        [name],
      )
    }

    if (!rows.length) {
      return res.status(401).json({ message: 'Неверный email, имя или пароль' })
    }

    const row = rows[0]
    const valid = await bcrypt.compare(password, row.password_hash)
    if (!valid) {
      return res.status(401).json({ message: 'Неверный email, имя или пароль' })
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
