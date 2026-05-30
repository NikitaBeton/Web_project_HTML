const express = require('express')
const pool = require('../config/db')

const router = express.Router()

function parseGallery(row) {
  if (row.gallery) {
    if (Array.isArray(row.gallery)) return row.gallery
    try {
      return JSON.parse(row.gallery)
    } catch {
      /* fall through */
    }
  }
  return row.image_url ? [row.image_url] : []
}

function formatProduct(row) {
  const images = parseGallery(row)
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.image_url || images[0] || null,
    images,
    category: row.category,
    brand: row.brand,
    badge: row.badge,
    stock: row.stock,
  }
}

router.get('/filters', async (_req, res) => {
  const [brands] = await pool.query(
    'SELECT DISTINCT brand FROM products ORDER BY brand',
  )
  const [categories] = await pool.query(
    'SELECT DISTINCT category FROM products ORDER BY category',
  )

  res.json({
    brands: brands.map((r) => r.brand),
    categories: categories.map((r) => r.category),
  })
})

router.get('/', async (req, res) => {
  const { brand, category, search, badge, limit } = req.query
  let sql = 'SELECT * FROM products WHERE 1=1'
  const params = []

  if (brand) {
    sql += ' AND brand = ?'
    params.push(brand)
  }
  if (category) {
    sql += ' AND category = ?'
    params.push(category)
  }
  if (badge) {
    sql += ' AND badge = ?'
    params.push(badge)
  }
  if (search?.trim()) {
    sql += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR category LIKE ?)'
    const term = `%${search.trim()}%`
    params.push(term, term, term, term)
  }

  sql += ' ORDER BY id'

  if (limit) {
    sql += ' LIMIT ?'
    params.push(Number(limit))
  }

  const [rows] = await pool.query(sql, params)
  res.json({ products: rows.map(formatProduct) })
})

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
    req.params.id,
  ])

  if (!rows.length) {
    return res.status(404).json({ message: 'Товар не найден' })
  }

  res.json({ product: formatProduct(rows[0]) })
})

module.exports = router
