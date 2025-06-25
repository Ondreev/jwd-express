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
  return lines.reverse().map(line => {
    const values = line.split(',')
    const row = {}
    headers.forEach((key, i) => (row[key.trim()] = values[i]?.trim()))
    return row
  })
}

function groupItems(orderString) {
  const grouped = {}
  const entries = orderString.split(',')
  for (let entry of entries) {
    const [nameRaw, priceRaw] = entry.split('-').map(x => x.trim())
    const name = nameRaw
    const price = parseInt(priceRaw.replace(/\D/g, '')) || 0
    grouped[name] = grouped[name] || { name, price, quantity: 0 }
    grouped[name].quantity += 1
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
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Заказы</h2>
      <div className="grid gap-6">
        {orders.map((order, i) => {
          const items = groupItems(order['Заказ'])
          const { total, discountPercent, discountAmount, final } = calculateTotals(items)

          return (
            <div key={i} className="fancy-block text-white">
              <div className="text-sm text-gray-400 mb-2">
                <div><strong>Имя:</strong> {order['Имя']}</div>
                <div><strong>WhatsApp:</strong> {order['WhatsApp']}</div>
                <div><strong>Адрес:</strong> {order['Адрес']}</div>
                {order['Примечание'] && <div><strong>Примечание:</strong> {order['Примечание']}</div>}
              </div>

              {items.map((item, j) => (
                <div key={j} className="flex justify-between text-sm text-gray-300 border-b border-gray-700 py-1">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}

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
