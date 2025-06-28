// 🔧 Cart.jsx — усиление визуального акцента на скидке
import React from 'react'

export function Cart({ cart = [], discountRules = [], updateQuantity, addToCart, removeFromCart }) {
  if (cart.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const totalOriginal = cart.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  )

  const currentDiscount = [...discountRules]
    .reverse()
    .find((rule) => totalOriginal >= rule.min)

  const discount = currentDiscount?.percent || 0
  const discountedTotal = Math.round(totalOriginal * (1 - discount / 100))
  const savings = totalOriginal - discountedTotal

  return (
    <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      {cart.map((item) => (
        <div key={item.id} className="mb-3 border-b border-gray-600 pb-2">
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-400">
              {formatPrice(item.originalPrice)} x {item.quantity} ={' '}
              <span className="text-white font-semibold">
                {formatPrice(item.originalPrice * item.quantity)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeFromCart(item.id)}
              className="px-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              className="w-12 text-center bg-gray-700 text-white rounded appearance-none"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (!isNaN(value) && value > 0) updateQuantity(item.id, value)
              }}
            />
            <button
              onClick={() => addToCart(item)}
              className="px-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              +
            </button>
          </div>
        </div>
      ))}

      {discount > 0 && (
        <div className="text-yellow-400 font-bold mt-4">
          Вы сэкономили {discount}% / {formatPrice(savings)}
        </div>
      )}

      <div className="mt-4 text-lg font-semibold">
        Итого: {formatPrice(discountedTotal)}
      </div>
    </div>
  )
}
