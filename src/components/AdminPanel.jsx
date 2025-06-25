import { useEffect, useState } from 'react'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR322Pt499Vfg2H8lFKITDC7GIJiZgkq4tubdCKCZR87zeqRVhRBx8NoGk9RL09slKkOT0sFrJaOelE/pub?gid=1075610539&single=true&output=csv'

function parseCSV(text) {
  const [headerLine, ...lines] = text.trim().split('\n')
  const headers = headerLine.split(',').map(h => h.trim())
  return lines.map(line => {
    const values = line.split(',').map(v => v.trim())
    const row = {}
    headers.forEach((key, i) => (row[key] = values[i] || ''))
    return row
  }).reverse()
}

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + '₽'
}

function parseItems(orderStr) {
  const items = []
  const parts = orderStr.split(',').map(p => p.trim())
  for (let part of parts) {
    const match = part.match(/^(.+?) - (\d+)\s?₽$/)
    if (match) {
      items.push({ name: match[1], price: parseInt(match[2]), quantity: 1 })
    }
  }

  // группировка по имени и цене
  const grouped = {}
  for (let item of items) {
    const key = `${item.name}-${item.price}`
    if (!grouped[key]) grouped[key] = { ...item, quantity: 0 }
    grouped[key].quantity += 1
  }

  return Object.values(grouped)
}

function calculateDiscount(total) {
  if (total >= 3000) return 15
  if (total >= 2000) return 10
  if (total >= 1000) return 5
  return 0
}

export function AdminPanel() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => setOrders(parseCSV(text)))
  }, [])

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-white mb-6">Заказы</h2>

      {orders.map((order, i) => {
        const items = parseItems(order['Заказ'] || '')
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const discountPercent = calculateDiscount(total)
        const discountAmount = Math.round((total * discountPercent) / 100)
        const finalTotal = total - discountAmount

        return (
          <div
            key={i}
            className="bg-[#0f172a] text-white p-4 rounded-2xl shadow-lg mb-6"
          >
            <div className="text-sm mb-3">
              <div><strong>Имя:</strong> {order['Имя']}</div>
              <div><strong>WhatsApp:</strong> {order['WhatsApp']}</div>
              <div><strong>Адрес:</strong> {order['Адрес']}</div>
              {order['Примечание'] && <div><strong>Примечание:</strong> {order['Примечание']}</div>}
            </div>

            {items.length > 0 ? (
              <div className="mb-2 text-sm text-gray-300 space-y-1 border-t border-gray-700 pt-2">
                {items.map((item, j) => (
                  <div key={j} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic">Нет товаров</div>
            )}

            {discountPercent > 0 && (
              <div className="text-yellow-400 font-semibold text-sm mt-2">
                Скидка {discountPercent}%: {formatPrice(discountAmount)}
              </div>
            )}

            <div className="flex justify-between font-bold text-lg mt-2 border-t border-gray-600 pt-2">
              <span>Итого:</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
