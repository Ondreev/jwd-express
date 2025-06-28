// ✅ Cart.jsx с поддержкой ручного ввода и обновления количества по имени товара
import React from 'react'

export function Cart({ cart = [], discountRules = [], onChangeQuantity }) {
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

  const matched = discountRules
    .filter((rule) => totalOriginal >= rule.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0]

  const discount = matched ? matched.discount : 0
  const totalWithDiscount = totalOriginal - discount

  return (
    <div className="bg-gray-800 text-white rounded-2xl p-4 shadow-xl">
      <h2 className="text-xl font-bold mb-3">Корзина</h2>
      {uniqueItems.map((item) => (
        <div key={item.name} className="flex justify-between items-center mb-1">
          <div>
            {item.name}
            <input
              type="text"
              inputMode="numeric"
              pattern="\\d*"
              className="ml-2 w-10 text-center bg-gray-700 text-white rounded focus:outline-none"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (!isNaN(value) && value >= 0) {
                  onChangeQuantity(item.name, value)
                }
              }}
            />
          </div>
          <div>{formatPrice(item.price * item.quantity)}</div>
        </div>
      ))}

      {discount > 0 && (
        <p className="text-yellow-400 font-semibold mt-2">
          Вы сэкономили {matched.percent}% / {formatPrice(discount)}
        </p>
      )}

      <hr className="my-2 border-gray-700" />

      <p className="font-bold text-lg flex justify-between">
        <span>Итого:</span> <span>{formatPrice(totalWithDiscount)}</span>
      </p>
    </div>
  )
}
