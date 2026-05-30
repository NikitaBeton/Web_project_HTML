export function formatPrice(value) {
  return new Intl.NumberFormat('ru-BY', {
    style: 'currency',
    currency: 'BYN',
    maximumFractionDigits: 2,
  }).format(value)
}
