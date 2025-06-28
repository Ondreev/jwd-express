// ✅ Обновлённый Cart.jsx: поддержка ручного ввода количества + тёмный стиль
import React from 'react'

export function Cart({ cart = [], discountRules = [], updateQuantity }) {
  if (cart.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const totalOriginal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const matchedRule = discountRules
    .slice()
    .reverse()
    .find((rule) => totalOriginal >= rule.min)

  const discountPercent = matchedRule ? matchedRule.percent : 0
  const discountAmount = Math.floor((totalOriginal * discountPercent) / 100)
  const total = totalOriginal - discountAmount

  return (
    <div className="bg-gray-800 text-white p-4 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-3">Корзина</h2>
      <div className="space-y-1 mb-2">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-sm bg-gray-700 rounded p-1 px-2"
          >
            <span className="truncate w-2/5">{item.name}</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              className="bg-gray-600 w-12 text-center rounded mx-2 text-white no-spinner"
            />
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      {discountPercent > 0 && (
        <div className="text-yellow-400 text-sm font-medium mb-2">
          Вы сэкономили {discountPercent}% / {formatPrice(discountAmount)}
        </div>
      )}
      <div className="text-lg font-bold">
        Итого: <span>{formatPrice(total)}</span>
      </div>
    </div>
  )
}
