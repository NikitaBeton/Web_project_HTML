function formatUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    username: row.name,
    createdAt: row.created_at,
    hasRecoveryKeyword: Boolean(row.recovery_keyword_hash),
  }
}

module.exports = { formatUser }
