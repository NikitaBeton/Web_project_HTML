const pool = require('./db')

const REVIEWS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_product_user (product_id, user_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
  )
`

async function ensureSchema() {
  const [usernameCol] = await pool.query("SHOW COLUMNS FROM users LIKE 'username'")
  if (usernameCol.length) {
    await pool.query(
      'ALTER TABLE users CHANGE COLUMN username name VARCHAR(100) NOT NULL UNIQUE',
    )
    console.log('Миграция: users.username → users.name')
  }

  await pool.query(REVIEWS_TABLE_SQL)

  const [removed] = await pool.query(
    `DELETE FROM products
     WHERE id > 4
        OR LOWER(name) LIKE '%тест%'
        OR LOWER(name) LIKE '%test%'`,
  )
  if (removed.affectedRows > 0) {
    console.log(`Удалено тестовых товаров: ${removed.affectedRows}`)
  }
}

module.exports = { ensureSchema }
