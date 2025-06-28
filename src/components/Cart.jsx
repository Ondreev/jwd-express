// ✅ Обновлённая корзина с редактируемым количеством и корректной логикой скидок
import React from 'react'

export function Cart({ cart = [], discountRules = [], updateQuantity }) {
  if (!Array.isArray(cart) || cart.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const totalOriginal = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = totalOriginal - total
  const discountPercent = Math.round((discount / totalOriginal) * 100)

  return (
    <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      <div className="space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="font-semibold w-1/3 truncate">{item.name}</div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 text-center focus:outline-none"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                updateQuantity(item.id, isNaN(val) ? 1 : val)
              }}
            />
            <div className="text-sm text-right w-1/3">
              {formatPrice(item.price)} × {item.quantity} ={' '}
              <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
            </div>
          </div>
        ))}
      </div>
      <hr className="my-4 border-gray-700" />
      {discount > 0 && (
        <div className="text-yellow-400 font-bold mb-2">
          Вы сэкономили {discountPercent}% / {formatPrice(discount)}
        </div>
      )}
      <div className="text-lg font-bold">Итого: {formatPrice(total)}</div>
    </div>
  )
}
