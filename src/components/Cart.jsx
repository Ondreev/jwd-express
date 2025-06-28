// ✅ Обновлённая корзина и форма заказа — единый стиль, корректное расстояние, поля ввода количества, корректные скидки
import React from 'react'

export function Cart({ cart = [], discountRules = [], updateQuantity }) {
  if (!Array.isArray(cart) || cart.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const totalOriginal = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const discount = totalOriginal - total
  const discountPercent = Math.round((discount / totalOriginal) * 100)

  return (
    <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg mb-4">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      {cart.map((item) => (
        <div key={item.id} className="flex items-center justify-between mb-2">
          <span className="font-semibold">{item.name}</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 appearance-none"
            />
            <span className="text-sm">
              {formatPrice(item.price)} × {item.quantity} ={' '}
              <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
            </span>
          </div>
        </div>
      ))}
      <hr className="my-2 border-gray-700" />
      {discount > 0 && (
        <div className="text-yellow-400 font-semibold mb-2">
          Вы сэкономили {discountPercent}% / {formatPrice(discount)}
        </div>
      )}
      <div className="text-lg font-bold">Итого: {formatPrice(total)}</div>
    </div>
  )
}
