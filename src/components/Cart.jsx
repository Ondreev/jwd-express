// ✅ Cart.jsx с восстановленным дизайном и правильным отображением скидок
import React from 'react'

export function Cart({ cart = [], discountRules = [] }) {
  if (cart.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const getDiscount = (total) => {
    const matched = [...discountRules]
      .sort((a, b) => b.min - a.min)
      .find((r) => total >= r.min)
    return matched ? matched.percent : 0
  }

  const discountedItems = cart.map((item) => {
    const originalTotal = item.price * item.quantity
    const discountPercent = getDiscount(originalTotal)
    const finalPrice = Math.round(item.price * (1 - discountPercent / 100))
    return { ...item, price: finalPrice, originalTotal }
  })

  const total = discountedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const totalWithoutDiscount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const totalDiscount = totalWithoutDiscount - total
  const percentSaved = totalWithoutDiscount > 0
    ? Math.round((totalDiscount / totalWithoutDiscount) * 100)
    : 0

  return (
    <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg mt-4">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      <ul className="space-y-2">
        {discountedItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center border-b border-gray-700 pb-2">
            <span className="font-semibold">
              {item.name}
            </span>
            <span className="text-sm text-gray-400">
              {formatPrice(item.price)} x {item.quantity} ={' '}
              <span className="text-white font-bold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {totalDiscount > 0 && (
        <p className="mt-3 text-yellow-400 font-semibold">
          Вы сэкономили {percentSaved}% / {formatPrice(totalDiscount)}
        </p>
      )}

      <div className="mt-3 text-lg font-bold">
        Итого: {formatPrice(total)}
      </div>
    </div>
  )
}
