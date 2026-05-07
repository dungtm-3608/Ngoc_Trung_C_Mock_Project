export function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

export function getOriginalPrice(price: number, discount = 0) {
  if (!discount) return price
  return Math.round(price / (1 - discount / 100))
}

export function getDiscountedPrice(price: number, discount = 0) {
  if (!discount) return price
  return Math.round(price * (1 - discount / 100))
}
