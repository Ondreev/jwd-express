// ✅ Обновлённый Cart.jsx — красивый и рабочий, со скидкой из таблицы и компактным полем
import React from 'react'

export function Cart({ cart = [], discountRules = [], updateQuantity }) {
  if (!cart.length) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const totalOriginal = cart.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  )
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const discount = totalOriginal - total
  const discountPercent = totalOriginal ? Math.round((discount / totalOriginal) * 100) : 0

  return (
    <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg mt-4">
      <h2 className="text-xl font-bold mb-3">Корзина</h2>
      {cart.map((item) => (
        <div key={item.id} className="mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{item.name}</span>
            <span>*</span>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              className="w-12 text-center bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-white text-sm"
            />
            <span>=</span>
            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
          </div>
          <div className="text-xs text-gray-400 ml-1">
            {formatPrice(item.price)} × {item.quantity}
          </div>
        </div>
      ))}

      <hr className="my-3 border-gray-600" />

      {discount > 0 && (
        <div className="text-yellow-400 font-semibold mb-2">
          Вы сэкономили {discountPercent}% / {formatPrice(discount)}
        </div>
      )}

      <div className="text-lg font-bold">Итого: {formatPrice(total)}</div>
    </div>
  )
}
