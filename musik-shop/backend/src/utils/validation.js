const { validationResult } = require('express-validator')

function handleValidation(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Ошибка валидации',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
    return true
  }
  return false
}

module.exports = { handleValidation }
