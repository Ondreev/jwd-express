import { useEffect, useState } from 'react'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR322Pt499Vfg2H8lFKITDC7GIJiZgkq4tubdCKCZR87zeqRVhRBx8NoGk9RL09slKkOT0sFrJaOelE/pub?gid=1075610539&single=true&output=csv'

const discountRules = [
  { min: 3000, percent: 15 },
  { min: 2000, percent: 10 },
  { min: 1000, percent: 5 }
]

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + '₽'
}

function parseCSV(text) {
  const [headerLine, ...lines] = text.trim().split('\n')
  const headers = headerLine.split(',')
  return lines.map(line => {
    const values = line.split(',')
    const row = {}
    headers.forEach((key, i) => (row[key.trim()] = values[i]?.trim()))
    return row
  }).reverse()
}

function groupItems(orderString) {
  const grouped = {}
  const entries = orderString.split(',')
  for (let entry of entries) {
    const [nameRaw, priceRaw] = entry.split('-').map(x => x.trim())
    const name = nameRaw
    const price = parseInt(priceRaw?.replace(/\D/g, '') || '0', 10)
    if (!name || !price) continue
    const key = `${name}-${price}`
    if (!grouped[key]) {
      grouped[key] = { name, price, quantity: 0 }
    }
    grouped[key].quantity += 1
  }
  return Object.values(grouped)
}

function calculateTotals(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const matchedRule = [...discountRules].sort((a, b) => b.min - a.min).find(rule => total >= rule.min)
  const discountPercent = matchedRule?.percent || 0
  const discountAmount = Math.round(total * discountPercent / 100)
  const final = total - discountAmount
  return { total, discountPercent, discountAmount, final }
}

export function AdminPanel() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => setOrders(parseCSV(text)))
  }, [])

  return (
    <div className="mt-6 px-4">
      <h2 className="text-2xl font-bold mb-6 text-white">Заказы</h2>
      <div className="grid gap-6">
        {orders.map((order, i) => {
          const items = groupItems(order['Заказ'])
          const { total, discountPercent, discountAmount, final } = calculateTotals(items)

          return (
            <div
              key={i}
              className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg border border-gray-700"
            >
              <div className="text-sm text-gray-300 mb-4">
                <div><strong className="text-white">Имя:</strong> {order['Имя']}</div>
                <div><strong className="text-white">WhatsApp:</strong> {order['WhatsApp']}</div>
                <div><strong className="text-white">Адрес:</strong> {order['Адрес']}</div>
                {order['Примечание'] && (
                  <div><strong className="text-white">Примечание:</strong> {order['Примечание']}</div>
                )}
              </div>

              <div className="mb-2 space-y-1 text-sm text-gray-300">
                {items.map((item, j) => (
                  <div key={j} className="flex justify-between border-b border-gray-700 py-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {discountPercent > 0 && (
                <div className="text-yellow-400 font-bold text-sm mt-2">
                  Скидка {discountPercent}%: {formatPrice(discountAmount)}
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600 mt-2">
                <span>Итого:</span>
                <span>{formatPrice(final)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
