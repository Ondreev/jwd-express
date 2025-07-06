// ✅ Фикс для подгрузки products из нового URL
import { useEffect, useState } from 'react'
import Papa from 'papaparse'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR322Pt499Vfg2H8lFKITDC7GIJiZgkq4tubdCKCZR87zeqRVhRBx8NoGk9RL09slKkOT0sFrJaOelE/pub?gid=1075610539&single=true&output=csv'
const PRODUCTS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR322Pt499Vfg2H8lFKITDC7GIJiZgkq4tubdCKCZR87zeqRVhRBx8NoGk9RL09slKkOT0sFrJaOelE/pub?gid=0&single=true&output=csv'
const SETTINGS_URL =
  'https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?action=getSettings'
const ADMIN_PASS_URL =
  'https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?action=getAdminPass'

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
    if (!isLoggedIn) return

    async function loadData() {
      try {
        const [csvText, settingsRes, productsText] = await Promise.all([
          fetch(CSV_URL).then(res => res.text()),
          fetch(SETTINGS_URL).then(res => res.json()),
          fetch(PRODUCTS_URL).then(res => res.text())
        ])

        const parsedOrders = parseCSV(csvText)
        const parsedProducts = Papa.parse(productsText.trim(), { header: true }).data
          .map(row => ({
            name: row['name']?.trim(),
            price: Math.round(parseFloat((row['price'] || '0').replace(/\s/g, '').replace(',', '.'))),
            discount: parseInt((row['discoun'] || '').replace(/\D/g, '')),
          }))
          .filter(p => p.name && !isNaN(p.price))

        setOrders(parsedOrders)
        setProductsList(parsedProducts)
        setDiscountRules(getDiscountRules(settingsRes))
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
      }
    }
    loadData()
  }, [isLoggedIn])

  const handleLogin = async () => {
    try {
      const res = await fetch(ADMIN_PASS_URL)
      const realPass = await res.text()
      if (password === realPass.trim()) {
        setIsLoggedIn(true)
      } else {
        alert('Неверный пароль')
      }
    } catch (err) {
      console.error('Ошибка авторизации:', err)
    }
  }

  const handlePrint = (index) => {
    const printContents = document.getElementById(`order-${index}`)
    if (!printContents) return

    const win = window.open('', '', 'height=800,width=1000')
    win.document.write('<html><head><title>Печать заказа</title>')
    win.document.write(`
      <style>
        body { font-family: sans-serif; color: black; background: white; padding: 20px; }
        .text-sm { font-size: 14px; }
        .font-bold { font-weight: bold; }
        .text-lg { font-size: 18px; font-weight: bold; }
        .mt-2, .pt-2, .mb-2, .mb-3, .mb-6 { margin: 6px 0; padding-top: 4px; }
        .border-t { border-top: 1px solid #999; padding-top: 4px; }
        .grid { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; }
        .text-right { text-align: right; }
      </style></head><body>')
    win.document.write(printContents.innerHTML)
    win.document.write('</body></html>')
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-700 text-white p-4 max-w-screen-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Вход в админ-панель</h2>
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
      <div className="min-h-screen bg-gray-700 text-white p-4 max-w-screen-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Заказы</h2>
        <div>Загрузка заказов и настроек скидок...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white p-4 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Заказы</h2>

      {orders.map((order, i) => {
        const items = parseItems(order['Заказ'] || '', productsList)
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const matchedRule = getBestDiscount(total, discountRules)
        const discountAmount = Math.round(total * matchedRule.percent / 100)
        const finalTotal = total - discountAmount

        return (
          <div
            key={i}
            id={`order-${i}`}
            className="bg-[#0f172a] text-white p-4 rounded-2xl shadow-lg mb-6 printable"
          >
            <div className="text-sm mb-3">
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

            {matchedRule.percent > 0 ? (
              <div className="text-yellow-400 font-semibold text-sm mt-2">
                Применена скидка {matchedRule.percent}%: {formatPrice(discountAmount)}
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

            <button
              onClick={() => handlePrint(i)}
              className="bg-white text-black px-3 py-1 rounded mt-2 text-sm no-print"
            >
              🖨️ Распечатать
            </button>
          </div>
        )
      })}
    </div>
  )
}
