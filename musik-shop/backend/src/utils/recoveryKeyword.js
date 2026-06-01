const RECOVERY_KEYWORD_MIN_LENGTH = 2
const RECOVERY_KEYWORD_MAX_LENGTH = 100

function normalizeRecoveryKeyword(value) {
  return String(value ?? '').trim().toLowerCase()
}

function validateRecoveryKeyword(value) {
  const normalized = normalizeRecoveryKeyword(value)

  if (normalized.length < RECOVERY_KEYWORD_MIN_LENGTH) {
    return {
      valid: false,
      errors: [`Ключевое слово: минимум ${RECOVERY_KEYWORD_MIN_LENGTH} символа`],
    }
  }

  if (normalized.length > RECOVERY_KEYWORD_MAX_LENGTH) {
    return {
      valid: false,
      errors: [`Ключевое слово: не более ${RECOVERY_KEYWORD_MAX_LENGTH} символов`],
    }
  }

  return { valid: true, errors: [], normalized }
}

module.exports = {
  RECOVERY_KEYWORD_MIN_LENGTH,
  RECOVERY_KEYWORD_MAX_LENGTH,
  normalizeRecoveryKeyword,
  validateRecoveryKeyword,
}
