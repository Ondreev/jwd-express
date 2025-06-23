import React from 'react'

export function Cart({ items = [], discountRules = [] }) {
  if (items.length === 0) return null

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

  const grouped = items.reduce((acc, item) => {
    const key = item.name
    acc[key] = acc[key] || { ...item, quantity: 0 }
    acc[key].quantity += 1
    return acc
  }, {})

  const uniqueItems = Object.values(grouped)
  const totalOriginal = uniqueItems.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  )

  const matchedRule = [...discountRules]
    .sort((a, b) => b.min - a.min)
    .find((rule) => totalOriginal >= rule.min)

  const discountPercent = matchedRule?.percent || 0
  const discountAmount = Math.round(totalOriginal * (discountPercent / 100))
  const finalTotal = totalOriginal - discountAmount

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 mt-6 rounded-2xl shadow-2xl space-y-5 text-white">
      <style>{`body { background: linear-gradient(to bottom right, #1a1a1a, #2c2c2c); }`}</style>
      <h2 className="text-2xl font-bold text-white">Корзина</h2>

      {uniqueItems.map((item, i) => (
        <div key={i} className="flex justify-between items-center border-b pb-2 text-sm text-gray-300">
          <span>
            {item.name} x{item.quantity}
          </span>
          <span>{formatPrice(item.price * item.quantity)}</span>
        </div>
      ))}

      {discountPercent > 0 && (
        <div className="text-yellow-400 font-extrabold text-base mt-2">
          Вы сэкономили {discountPercent}% / {formatPrice(discountAmount)}
        </div>
      )}

      <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-700 text-white">
        <span>Итого:</span>
        <span>{formatPrice(finalTotal)}</span>
      </div>
    </div>
  )
}
