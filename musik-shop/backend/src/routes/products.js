const express = require('express')
const { body, param } = require('express-validator')
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')
const { handleValidation } = require('../utils/validation')

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

const productBodyValidators = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Название: от 3 до 100 символов'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Описание: не более 2000 символов'),
  body('price').isFloat({ min: 0.01 }).withMessage('Цена должна быть больше 0'),
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Категория: от 2 до 50 символов'),
  body('brand')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Бренд: от 2 до 50 символов'),
  body('badge')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Метка: не более 20 символов'),
  body('stock').isInt({ min: 0 }).withMessage('Остаток: целое число от 0'),
  body('imageUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 512 })
    .withMessage('URL изображения: не более 512 символов'),
  body('images').optional().isArray().withMessage('images должен быть массивом'),
  body('images.*')
    .optional()
    .trim()
    .isLength({ max: 512 })
    .withMessage('URL в галерее: не более 512 символов'),
]

const productPatchValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Название: от 3 до 100 символов'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Описание: не более 2000 символов'),
  body('price').optional().isFloat({ min: 0.01 }).withMessage('Цена должна быть больше 0'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Категория: от 2 до 50 символов'),
  body('brand')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Бренд: от 2 до 50 символов'),
  body('badge')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Метка: не более 20 символов'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Остаток: целое число от 0'),
  body('imageUrl')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 512 })
    .withMessage('URL изображения: не более 512 символов'),
  body('images').optional().isArray().withMessage('images должен быть массивом'),
  body('images.*')
    .optional()
    .trim()
    .isLength({ max: 512 })
    .withMessage('URL в галерее: не более 512 символов'),
]

function normalizeProductInput(body) {
  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : []
  const imageUrl = body.imageUrl?.trim() || images[0] || null
  const gallery = images.length ? JSON.stringify(images) : imageUrl ? JSON.stringify([imageUrl]) : null

  return {
    name: body.name.trim(),
    description: body.description?.trim() || null,
    price: Number(body.price),
    category: body.category.trim(),
    brand: body.brand.trim(),
    badge: body.badge?.trim() || null,
    stock: Number(body.stock),
    image_url: imageUrl,
    gallery,
  }
}

router.get('/filters', async (_req, res) => {
  const [brands] = await pool.query('SELECT DISTINCT brand FROM products ORDER BY brand')
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

router.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('Некорректный id товара'),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
      req.params.id,
    ])

    if (!rows.length) {
      return res.status(404).json({ message: 'Товар не найден' })
    }

    res.json({ product: formatProduct(rows[0]) })
  },
)

router.post('/', authMiddleware, productBodyValidators, async (req, res) => {
  if (handleValidation(req, res)) return

  const data = normalizeProductInput(req.body)

  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, image_url, gallery, category, brand, badge, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.description,
      data.price,
      data.image_url,
      data.gallery,
      data.category,
      data.brand,
      data.badge,
      data.stock,
    ],
  )

  const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [result.insertId])
  res.status(201).json({ product: formatProduct(rows[0]) })
})

router.patch(
  '/:id',
  authMiddleware,
  param('id').isInt({ min: 1 }).withMessage('Некорректный id товара'),
  productPatchValidators,
  async (req, res) => {
    if (handleValidation(req, res)) return

    const [existing] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [
      req.params.id,
    ])
    if (!existing.length) {
      return res.status(404).json({ message: 'Товар не найден' })
    }

    const current = existing[0]
    const merged = {
      name: req.body.name ?? current.name,
      description: req.body.description ?? current.description,
      price: req.body.price ?? current.price,
      category: req.body.category ?? current.category,
      brand: req.body.brand ?? current.brand,
      badge: req.body.badge ?? current.badge,
      stock: req.body.stock ?? current.stock,
      imageUrl: req.body.imageUrl ?? current.image_url,
      images: req.body.images ?? parseGallery(current),
    }

    const data = normalizeProductInput(merged)

    await pool.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, image_url = ?, gallery = ?,
           category = ?, brand = ?, badge = ?, stock = ?
       WHERE id = ?`,
      [
        data.name,
        data.description,
        data.price,
        data.image_url,
        data.gallery,
        data.category,
        data.brand,
        data.badge,
        data.stock,
        req.params.id,
      ],
    )

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [req.params.id])
    res.json({ product: formatProduct(rows[0]) })
  },
)

router.delete(
  '/:id',
  authMiddleware,
  param('id').isInt({ min: 1 }).withMessage('Некорректный id товара'),
  async (req, res) => {
    if (handleValidation(req, res)) return

    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Товар не найден' })
    }

    res.json({ message: 'Товар удалён' })
  },
)

module.exports = router
