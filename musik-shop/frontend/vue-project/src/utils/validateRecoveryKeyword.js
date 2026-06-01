const RECOVERY_KEYWORD_MIN_LENGTH = 2
const RECOVERY_KEYWORD_MAX_LENGTH = 100

export function normalizeRecoveryKeyword(value) {
  return String(value ?? '').trim().toLowerCase()
}

export function validateRecoveryKeyword(value) {
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

  return { valid: true, errors: [] }
}
