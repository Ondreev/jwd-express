import { useEffect, useState } from 'react'
import Papa from 'papaparse'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR322Pt499Vfg2H8lFKITDC7GIJiZgkq4tubdCKCZR87zeqRVhRBx8NoGk9RL09slKkOT0sFrJaOelE/pub?gid=1075610539&single=true&output=csv'
const SETTINGS_URL =
  'https://script.google.com/macros/s/AKfycby-UZnq9rWVkcbfYKAOLdqmkY5x-q5oIUyAG0OAdOeX7CGGeELN4Nlil48pLB669OaV4g/exec?action=getSettings'

function parseCSV(text) {
  const { data } = Papa.parse(text.trim(), { header: true, skipEmptyLines: true })
  return data.reverse()
}

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + '₽'
}

function parseItems(orderStr) {
  const items = []
  const parts = orderStr.split(',').map(p => p.trim()).filter(Boolean)

  for (let part of parts) {
    part = part.replace(/^"|"$/g, '')
    const match = part.match(/^(.+?) - (\d+)\s?₽$/)
    if (match) {
      items.push({ name: match[1], price: parseInt(match[2]), quantity: 1 })
    }
  }

  const grouped = {}
  for (let item of items) {
    const key = `${item.name}-${item.price}`
    if (!grouped[key]) grouped[key] = { ...item, quantity: 0 }
    grouped[key].quantity += 1
  }
  return Object.values(grouped)
}

function getDiscountRules(settings) {
  return Object.entries(settings)
    .filter(([k]) => k.startsWith('discount_rule_'))
    .map(([, v]) => {
      const [min, percent] = v.split(':').map(Number)
      return { min, percent }
    })
    .sort((a, b) => b.min - a.min)
}

function getBestDiscount(total, rules) {
  return [...rules].sort((a, b) => b.min - a.min).find(rule => total >= rule.min) || { percent: 0, min: 0 }
}

export function AdminPanel() {
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => setOrders(parseCSV(text)))
    fetch(SETTINGS_URL)
      .then(res => res.json())
      .then(setSettings)
  }, [])

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-700 text-white p-4 max-w-screen-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Заказы</h2>
        <div>Загрузка настроек скидок...</div>
      </div>
    )
  }

  const discountRules = getDiscountRules(settings)

  return (
    <div className="min-h-screen bg-gray-700 text-white p-4 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Заказы</h2>

      {orders.map((order, i) => {
        const items = parseItems(order['Заказ'] || '')
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const matchedRule = [...discountRules].sort((a, b) => b.min - a.min).find(rule => total >= rule.min)
        const maxDiscount = matchedRule ? matchedRule.percent : 0
        const discountAmount = Math.round(total * maxDiscount / 100)
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

            {maxDiscount > 0 && (
              <div className="text-yellow-400 font-semibold text-sm mt-2">
                Скидка {maxDiscount}%: −{formatPrice(discountAmount)}
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
