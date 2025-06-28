// ✅ Cart.jsx с тёмным дизайном и яркой надписью о скидке
import React from 'react'

export function Cart({ cart = [], discountRules = [] }) {
  if (cart.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const grouped = cart.reduce((acc, item) => {
    const key = item.name
    acc[key] = acc[key] || { ...item, quantity: 0 }
    acc[key].quantity += 1
    return acc
  }, {})

  const uniqueItems = Object.values(grouped)
  const totalOriginal = uniqueItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  let discount = 0
  let discountPercent = 0
  for (const rule of discountRules) {
    if (totalOriginal >= rule.minTotal) {
      discount = rule.discountAmount || (totalOriginal * rule.discountPercent) / 100
      discountPercent = rule.discountPercent
    }
  }

  const totalWithDiscount = totalOriginal - discount

  return (
    <div className="bg-gray-800 text-white rounded-2xl p-4 shadow-xl max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      <ul className="mb-4 border-b border-gray-600 pb-2">
        {uniqueItems.map((item) => (
          <li key={item.name} className="flex justify-between mb-1">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      {discount > 0 && (
        <p className="text-yellow-400 text-sm font-semibold mb-2">
          Вы сэкономили {discountPercent}% / {formatPrice(discount)}
        </p>
      )}

      <div className="flex justify-between text-lg font-bold">
        <span>Итого:</span>
        <span>{formatPrice(totalWithDiscount)}</span>
      </div>
    </div>
  )
}
