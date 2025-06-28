// Cart.jsx (обновлённая логика с ручным вводом количества)
import React from 'react'

export function Cart({ cart = [], discountRules = [] }) {
  if (!Array.isArray(cart) || cart.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const grouped = cart.reduce((acc, item) => {
    const key = item.name
    acc[key] = acc[key] || { ...item, quantity: 0 }
    acc[key].quantity += 1
    return acc
  }, {})

  const uniqueItems = Object.values(grouped)
  const totalOriginal = uniqueItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const matchedDiscount = discountRules
    .map((rule) => ({ ...rule, threshold: parseFloat(rule.threshold), discount: parseFloat(rule.discount) }))
    .filter((rule) => totalOriginal >= rule.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0]

  const discountPercent = matchedDiscount ? matchedDiscount.discount : 0
  const totalDiscount = totalOriginal * (discountPercent / 100)
  const total = totalOriginal - totalDiscount

  return (
    <div className="bg-gray-800 text-white rounded-2xl p-4 shadow-xl max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Корзина</h2>
      <div className="mb-2 border-b border-gray-600 pb-2">
        {uniqueItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-1">
            <span>
              {item.name}
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const qty = parseInt(e.target.value)
                  if (!isNaN(qty) && qty > 0) {
                    const updatedCart = []
                    for (let i = 0; i < qty; i++) {
                      updatedCart.push(item)
                    }
                    const restCart = cart.filter((i) => i.name !== item.name)
                    const newCart = [...restCart, ...updatedCart]
                    const event = new CustomEvent('updateCart', { detail: newCart })
                    window.dispatchEvent(event)
                  }
                }}
                className="bg-gray-700 text-white w-12 ml-2 text-center rounded"
              />
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      {discountPercent > 0 && (
        <div className="text-yellow-400 mb-2 font-semibold">
          Вы сэкономили {discountPercent}% / {formatPrice(totalDiscount)}
        </div>
      )}
      <div className="text-lg font-bold">Итого: {formatPrice(total)}</div>
    </div>
  )
}
