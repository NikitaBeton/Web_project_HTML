const PASSWORD_MIN_LENGTH = 8

const PASSWORD_RULES = [
  {
    id: 'length',
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
    message: `Минимум ${PASSWORD_MIN_LENGTH} символов`,
  },
  {
    id: 'lower',
    test: (password) => /[a-zа-яё]/.test(password),
    message: 'Строчная буква',
  },
  {
    id: 'upper',
    test: (password) => /[A-ZА-ЯЁ]/.test(password),
    message: 'Заглавная буква',
  },
  {
    id: 'digit',
    test: (password) => /\d/.test(password),
    message: 'Цифра',
  },
]

function validatePassword(password) {
  const value = password ?? ''
  const failed = PASSWORD_RULES.filter((rule) => !rule.test(value))

  return {
    valid: failed.length === 0,
    errors: failed.map((rule) => `Пароль: ${rule.message.toLowerCase()}`),
    rules: PASSWORD_RULES.map((rule) => ({
      id: rule.id,
      message: rule.message,
      passed: rule.test(value),
    })),
  }
}

module.exports = { PASSWORD_MIN_LENGTH, PASSWORD_RULES, validatePassword }
