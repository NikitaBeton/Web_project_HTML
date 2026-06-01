const express = require('express')
const { body, param } = require('express-validator')
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')
const { handleValidation } = require('../utils/validation')

const router = express.Router({ mergeParams: true })

function formatReview(row) {
  return {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    rating: row.rating,
    body: row.body,
    createdAt: row.created_at,
    author: {
      id: row.user_id,
      username: row.author_name,
    },
  }
}

router.get(
  '/',
  param('productId').isInt({ min: 1 }).withMessage('Некорректный id товара'),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const productId = req.params.productId

    const [productRows] = await pool.query('SELECT id FROM products WHERE id = ? LIMIT 1', [
      productId,
    ])
    if (!productRows.length) {
      return res.status(404).json({ message: 'Товар не найден' })
    }

    const [rows] = await pool.query(
      `SELECT r.*, u.name AS author_name
       FROM product_reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId],
    )

    const [statsRows] = await pool.query(
      `SELECT AVG(rating) AS avgRating, COUNT(*) AS count
       FROM product_reviews
       WHERE product_id = ?`,
      [productId],
    )

    const count = Number(statsRows[0].count)
    const avgRating = count ? Number(Number(statsRows[0].avgRating).toFixed(1)) : null

    res.json({
      reviews: rows.map(formatReview),
      summary: { avgRating, count },
    })
  },
)

router.post(
  '/',
  authMiddleware,
  param('productId').isInt({ min: 1 }).withMessage('Некорректный id товара'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Оценка: от 1 до 5'),
  body('body')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Текст отзыва: не более 2000 символов'),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const productId = req.params.productId
    const userId = req.user.userId
    const rating = Number(req.body.rating)
    const text = req.body.body?.trim() || null

    const [productRows] = await pool.query('SELECT id FROM products WHERE id = ? LIMIT 1', [
      productId,
    ])
    if (!productRows.length) {
      return res.status(404).json({ message: 'Товар не найден' })
    }

    await pool.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, body)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), body = VALUES(body)`,
      [productId, userId, rating, text],
    )

    const [rows] = await pool.query(
      `SELECT r.*, u.name AS author_name
       FROM product_reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = ? AND r.user_id = ?
       LIMIT 1`,
      [productId, userId],
    )

    res.status(201).json({ review: formatReview(rows[0]) })
  },
)

router.delete(
  '/mine',
  authMiddleware,
  param('productId').isInt({ min: 1 }).withMessage('Некорректный id товара'),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const [result] = await pool.query(
      'DELETE FROM product_reviews WHERE product_id = ? AND user_id = ?',
      [req.params.productId, req.user.userId],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Отзыв не найден' })
    }

    res.json({ message: 'Отзыв удалён' })
  },
)

module.exports = router
