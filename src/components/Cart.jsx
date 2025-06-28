// ✅ Cart.jsx с компактным видом, корректной скидкой и попап-редактированием количества
import React, { useState } from 'react'

export function Cart({ cart = [], discountRules = [], onQuantityChange = () => {} }) {
  const [popupItem, setPopupItem] = useState(null)
  const [newQty, setNewQty] = useState('')

  const formatPrice = (p) => p.toLocaleString('ru-RU') + '₽'

  const totalOriginal = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const totalDiscounted = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  let discountPercent = 0
  for (let i = discountRules.length - 1; i >= 0; i--) {
    if (totalDiscounted >= discountRules[i].min) {
      discountPercent = discountRules[i].percent
      break
    }
  }

  const discountAmount = Math.floor((totalDiscounted * discountPercent) / 100)
  const finalTotal = totalDiscounted - discountAmount

  return (
    <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 relative mb-4">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-start text-sm border-b border-gray-700 py-2"
        >
          <div className="flex-1 pr-2">
            <div className="font-semibold break-words leading-snug">
              {item.name}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => {
                setPopupItem(item)
                setNewQty(String(item.quantity))
              }}
              className="px-1 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs"
            >
              × {item.quantity}
            </button>
            <div className="text-right font-bold min-w-[70px]">{formatPrice(item.price * item.quantity)}</div>
          </div>
        </div>
      ))}

      {discountAmount > 0 && (
        <div className="text-yellow-400 font-semibold mt-4">
          Вы сэкономили {discountPercent}% / {formatPrice(discountAmount)}
        </div>
      )}

      <div className="mt-2 font-bold text-lg">
        Итого: {formatPrice(finalTotal)}
      </div>

      {popupItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl w-64">
            <h3 className="font-semibold text-lg mb-2">{popupItem.name}</h3>
            <input
              type="number"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPopupItem(null)}
                className="bg-gray-300 text-black px-3 py-1 rounded"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  const qty = parseInt(newQty)
                  if (!isNaN(qty) && qty > 0) onQuantityChange(popupItem.name, qty)
                  setPopupItem(null)
                }}
                className="bg-yellow-500 text-black px-3 py-1 rounded font-semibold"
              >
                Ок
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
