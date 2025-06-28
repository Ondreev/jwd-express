// ✅ Cart.jsx с исправленным визуалом и скидками из таблицы
import React from 'react'

export function Cart({ cart = [], discountRules = [], onQuantityChange }) {
  if (!Array.isArray(cart) || cart.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const totalOriginal = cart.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  )
  const totalWithPromo = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const discountRule = [...discountRules].reverse().find((rule) => totalWithPromo >= rule.min)
  const discountPercent = discountRule ? discountRule.percent : 0
  const discountAmount = Math.floor((totalWithPromo * discountPercent) / 100)
  const finalTotal = totalWithPromo - discountAmount

  return (
    <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      {cart.map((item) => (
        <div key={item.id} className="mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold whitespace-nowrap">{item.name}</span>
            <span className="text-lg font-bold">×</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
              className="w-16 text-center bg-gray-800 border border-gray-700 rounded-md text-white px-2 py-1"
            />
            <span className="font-semibold whitespace-nowrap">
              = {formatPrice(item.price * item.quantity)}
            </span>
          </div>
          <div className="text-sm text-gray-400 ml-1">
            {formatPrice(item.price)} × {item.quantity}
          </div>
        </div>
      ))}

      <hr className="my-4 border-gray-700" />

      {discountPercent > 0 && (
        <div className="text-yellow-400 font-semibold mb-2">
          Вы сэкономили {discountPercent}% / {formatPrice(discountAmount)}
        </div>
      )}
      <div className="text-lg font-bold">Итого: {formatPrice(finalTotal)}</div>
    </div>
  )
}
