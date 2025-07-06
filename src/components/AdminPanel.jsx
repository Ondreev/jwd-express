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

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + '₽'
}

// Дополнительные вспомогательные функции: parseItems, getMatchedRule, formatWhatsAppLink и т.д.

export function AdminPanel() {
  const [orders, setOrders] = useState(null)
  const [productsList, setProductsList] = useState([])
  const [settings, setSettings] = useState({})
  const [adminPass, setAdminPass] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    // Загрузка orders, productsList, settings и adminPass
  }, [])

  if (!orders) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-700 text-white p-4 max-w-screen-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Заказы</h2>

      {orders.map((order, i) => {
        const items = parseItems(order['Заказ'] || '', productsList)
        const matchedRule = getMatchedRule(items, settings.discountRules)
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const discountAmount = (total * matchedRule.percent) / 100
        const finalTotal = total - discountAmount

        return (
          <div key={i} className="bg-[#0f172a] p-4 rounded-2xl shadow-lg mb-6">
            {/* Информация о клиенте */}
            <div className="text-sm mb-3 text-white">
              <div><strong>Имя:</strong> {order['Имя']}</div>
              <div>
                <strong>WhatsApp:</strong>{' '}
                <a href={formatWhatsAppLink(order['WhatsApp'])} target="_blank">
                  {order['WhatsApp']}
                </a>
              </div>
              <div><strong>Адрес:</strong> {order['Адрес']}</div>
              {order['Примечание'] && (
                <div><strong>Примечание:</strong> {order['Примечание']}</div>
              )}
            </div>

            {/* Список товаров */}
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

            {/* Скидка */}
            {matchedRule.percent > 0 ? (
              <div className="text-yellow-400 font-semibold text-sm mt-2">
                Применена скидка {matchedRule.percent}%: {formatPrice(discountAmount)}
              </div>
            ) : (
              <div className="text-yellow-400 font-semibold text-sm mt-2">
                Не забудь применить скидку на объем!
              </div>
            )}

            {/* Итог */}
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
