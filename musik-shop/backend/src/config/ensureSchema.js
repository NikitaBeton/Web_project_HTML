const pool = require('./db')

async function ensureSchema() {
  const [usernameCol] = await pool.query("SHOW COLUMNS FROM users LIKE 'username'")
  if (usernameCol.length) {
    await pool.query(
      'ALTER TABLE users CHANGE COLUMN username name VARCHAR(100) NOT NULL UNIQUE',
    )
    console.log('Миграция: users.username → users.name')
  }
}

module.exports = { ensureSchema }
