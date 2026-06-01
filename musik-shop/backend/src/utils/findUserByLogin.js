const pool = require('../config/db')

async function findUserByLogin({ email, name, username }) {
  const loginEmail = email?.trim().toLowerCase()
  const loginName = (name || username || '').trim()

  if (!loginEmail && !loginName) {
    return null
  }

  let rows
  if (loginEmail) {
    ;[rows] = await pool.query(
      `SELECT id, email, name, password_hash, recovery_keyword_hash, created_at
       FROM users WHERE email = ? LIMIT 1`,
      [loginEmail],
    )
  } else {
    ;[rows] = await pool.query(
      `SELECT id, email, name, password_hash, recovery_keyword_hash, created_at
       FROM users WHERE name = ? LIMIT 1`,
      [loginName],
    )
  }

  return rows[0] ?? null
}

module.exports = { findUserByLogin }
