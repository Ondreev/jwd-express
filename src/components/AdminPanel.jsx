// ✅ Фикс для подгрузки products из нового URL
import { useEffect, useState } from 'react'
import Papa from 'papaparse'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR322Pt499Vfg...9RL09slKkOT0sFrJaOelE/pub?gid=1075610539&single=true&output=csv'
const PRODUCTS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR322Pt499Vfg...hRBx8NoGk9RL09slKkOT0sFrJaOelE/pub?gid=0&single=true&output=csv'
const SETTINGS_URL =
  'https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2...x6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?action=getSettings'
const ADMIN_PASS_URL =
  'https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2...6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?action=getAdminPass'

function parseCSV(text) {
  const { data } = Papa.parse(text.trim(), { header: true, skipEmptyLines: true })
  return data.reverse()
}

function getDiscountRules(settingsObj) {
  return Object.entries(settingsObj)
    .filter(([k]) => k.startsWith('discount_rule_'))
    .map(([, v]) => {
      const [minStr, percentStr] = v.split(':').map(s => s.trim())
      const min = Number(minStr)
      const percent = Number(percentStr)
      return { min, percent }
    })
    .filter(rule => !isNaN(rule.min) && !isNaN(rule.percent))
    .sort((a, b) => b.min - a.min)
}

function getBestDiscount(total, rules) {
  for (let rule of rules) {
    if (total >= rule.min) return rule
  }
  return { min: 0, percent: 0 }
}

function parseItems(orderStr, productsList = []) {
  if (!orderStr) return []
  return orderStr
    .split(',')
    .map(part => part.trim())
    .map(part => {
      const [rawName, qtyStr] = part.split(' x')
      const quantity = Number(qtyStr) || 1
      const product = productsList.find(p => p.name === rawName) || {}
      const price = Number(product.price) || 0
      return { name: rawName, quantity, price }
    })
}

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + '₽'
}

function formatWhatsAppLink(number) {
  const normalized = number.replace(/\D/g, '')
  return `https://wa.me/${normalized}`
}

export function AdminPanel() {
  const [orders, setOrders] = useState(null)
  const [productsList, setProductsList] = useState([])
  const [discountRules, setDiscountRules] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    async function loadSettings() {
      const res = await fetch(SETTINGS_URL)
      const json = await res.json()
      setDiscountRules(getDiscountRules(json))
    }

    async function loadProducts() {
      const text = await fetch(PRODUCTS_URL).then(r => r.text())
      const data = Papa.parse(text.trim(), { header: true }).data
      setProductsList(data)
    }

    async function loadOrders() {
      const text = await fetch(CSV_URL).then(res => res.text())
      const data = parseCSV(text)
      setOrders(data)
    }

    loadSettings()
    loadProducts()
    loadOrders()
  }, [isLoggedIn])

  function handleLogin() {
    if (password === 'admin123') setIsLoggedIn(true)
    else alert('Неверный пароль')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Введите пароль"
          className="p-2 rounded text-black mr-2"
        />
        <button onClick={handleLogin} className="bg-yellow-500 text-black px-4 py-2 rounded">
          Войти
        </button>
      </div>
    )
  }

  if (!orders) {
    return (
      <div>Загрузка...</div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white p-4 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Заказы</h2>

      {orders.map((order, i) => {
        const items = parseItems(order['Заказ'], productsList)
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const best = getBestDiscount(total, discountRules)
        const discountAmount = (total * best.percent) / 100
        const finalTotal = total - discountAmount

        return (
          <div key={i} className="bg-[#0f172a] p-4 rounded-2xl shadow-lg mb-6">
            <div className="text-sm mb-3 text-white">
              <div><strong>Имя:</strong> {order['Имя']}</div>
              <div>
                <strong>WhatsApp:</strong>{' '}
                <a
                  href={formatWhatsAppLink(order['WhatsApp'])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 underline"
                >
                  {order['WhatsApp']}
                </a>
              </div>
              <div><strong>Адрес:</strong> {order['Адрес']}</div>
              {order['Примечание'] && <div><strong>Примечание:</strong> {order['Примечание']}</div>}
            </div>

            {items.length > 0 ? (
              <div className="mb-2 text-sm text-gray-300 border-t border-gray-700 pt-2">
                {items.map((item, j) => (
                  <div
                    key={j}
                    className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-start mb-1"
                  >
                    <span className="break-words whitespace-normal">
                      {item.name}
                    </span>
                    <span className="text-right">x{item.quantity}</span>
                    <span className="text-right">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic">Нет товаров</div>
            )}

            {best.percent > 0 ? (
              <div className="text-yellow-400 font-semibold text-sm mt-2">
                Применена скидка {best.percent}%: {formatPrice(discountAmount)}
              </div>
            ) : (
              <div className="text-yellow-400 font-semibold text-sm mt-2">
                Не забудь применить скидку на объем!
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
