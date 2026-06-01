const express = require('express')
const bcrypt = require('bcryptjs')
const { body } = require('express-validator')
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')
const { handleValidation } = require('../utils/validation')
const { formatUser } = require('../utils/user')
const { validateRecoveryKeyword } = require('../utils/recoveryKeyword')

const router = express.Router()

router.use(authMiddleware)

router.get('/me', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, email, name, recovery_keyword_hash, created_at FROM users WHERE id = ? LIMIT 1',
    [req.user.userId],
  )

  if (!rows.length) {
    return res.status(404).json({ message: 'Пользователь не найден' })
  }

  res.json({ user: formatUser(rows[0]) })
})

router.put(
  '/recovery-keyword',
  body('password').notEmpty().withMessage('Введите текущий пароль'),
  body('recoveryKeyword')
    .trim()
    .notEmpty()
    .withMessage('Укажите ключевое слово')
    .custom((value) => {
      const { valid, errors } = validateRecoveryKeyword(value)
      if (!valid) {
        throw new Error(errors.join('. '))
      }
      return true
    }),
  body('currentRecoveryKeyword')
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (!value) return true
      const { valid, errors } = validateRecoveryKeyword(value)
      if (!valid) {
        throw new Error(errors.join('. '))
      }
      return true
    }),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const [rows] = await pool.query(
      'SELECT password_hash, recovery_keyword_hash FROM users WHERE id = ? LIMIT 1',
      [req.user.userId],
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    const row = rows[0]
    const passwordValid = await bcrypt.compare(req.body.password, row.password_hash)
    if (!passwordValid) {
      return res.status(400).json({ message: 'Неверный текущий пароль' })
    }

    const { normalized: recoveryKeyword } = validateRecoveryKeyword(req.body.recoveryKeyword)

    if (row.recovery_keyword_hash) {
      const currentKeyword = req.body.currentRecoveryKeyword
      if (!currentKeyword) {
        return res.status(400).json({
          message: 'Ошибка валидации',
          errors: [{ field: 'currentRecoveryKeyword', message: 'Укажите текущее ключевое слово' }],
        })
      }

      const { normalized: currentNormalized } = validateRecoveryKeyword(currentKeyword)
      const currentValid = await bcrypt.compare(currentNormalized, row.recovery_keyword_hash)
      if (!currentValid) {
        return res.status(400).json({ message: 'Неверное текущее ключевое слово' })
      }
    }

    const recoveryKeywordHash = await bcrypt.hash(recoveryKeyword, 10)
    await pool.query('UPDATE users SET recovery_keyword_hash = ? WHERE id = ?', [
      recoveryKeywordHash,
      req.user.userId,
    ])

    res.json({ message: 'Ключевое слово сохранено' })
  },
)

module.exports = router
