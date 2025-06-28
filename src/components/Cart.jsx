// ✅ Cart.jsx с компактной версткой и pop-up для редактирования количества
import React, { useState } from 'react'

export function Cart({ cart = [], discountRules = [], onQuantityChange = () => {} }) {
  const [editingItem, setEditingItem] = useState(null)
  const [newQty, setNewQty] = useState(1)

  if (!cart.length) return null

  const totalOriginal = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const totalCurrent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  let discount = 0
  let percent = 0
  for (let i = discountRules.length - 1; i >= 0; i--) {
    if (totalCurrent >= discountRules[i].min) {
      percent = discountRules[i].percent
      discount = Math.round(totalCurrent * (percent / 100))
      break
    }
  }

  const finalTotal = totalCurrent - discount

  const formatPrice = (p) => p.toLocaleString('ru-RU') + '₽'

  return (
    <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      <div className="space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="text-sm">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm max-w-[140px] truncate">{item.name}</span>
              <span
                className="bg-gray-800 px-2 py-1 rounded cursor-pointer hover:bg-gray-700"
                onClick={() => {
                  setEditingItem(item)
                  setNewQty(item.quantity)
                }}
              >
                × {item.quantity}
              </span>
              <span className="text-sm">= {formatPrice(item.price * item.quantity)}</span>
            </div>
            <div className="text-xs text-gray-400 pl-1">
              {formatPrice(item.price)} × {item.quantity}
            </div>
          </div>
        ))}
      </div>

      <hr className="my-3 border-gray-600" />

      {discount > 0 && (
        <div className="text-yellow-400 font-semibold text-sm mb-1">
          Вы сэкономили {percent}% / {formatPrice(discount)}
        </div>
      )}
      <div className="text-lg font-bold">Итого: {formatPrice(finalTotal)}</div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl w-72">
            <h3 className="text-lg font-bold mb-3">Изменить количество</h3>
            <input
              type="number"
              min="1"
              value={newQty}
              onChange={(e) => setNewQty(Number(e.target.value))}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onQuantityChange(editingItem.id, newQty)
                  setEditingItem(null)
                }}
                className="px-3 py-1 bg-yellow-500 rounded font-semibold"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
