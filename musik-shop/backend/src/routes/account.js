const express = require('express')
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')
const { formatUser } = require('../utils/user')

const router = express.Router()

router.use(authMiddleware)

router.get('/me', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, email, name, created_at FROM users WHERE id = ? LIMIT 1',
    [req.user.userId],
  )

  if (!rows.length) {
    return res.status(404).json({ message: 'Пользователь не найден' })
  }

  res.json({ user: formatUser(rows[0]) })
})

module.exports = router
