// ✅ CheckoutForm.jsx — ОБНОВЛЁННАЯ версия для отправки заказов через POST
import { useState } from 'react'

const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽'

export function CheckoutForm({ items }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const orderText = items
      .map(({ name, price, quantity }) => `${name} x${quantity} — ${formatPrice(price * quantity)}`)
      .join('\n')

    try {
      const res = await fetch('https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          whatsapp: formData.phone,
          address: formData.address,
          note: formData.note,
          order: orderText
        })
      })

      const data = await res.json()
      if (data.status === 'ok') setSuccess(true)
    } catch (err) {
      console.error('Ошибка при отправке:', err)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  if (success) {
    return (
      <div className="fancy-block mt-6 text-green-400 font-bold">
        Заказ успешно отправлен!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="fancy-block mt-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>

      <input
        type="text"
        name="name"
        placeholder="Ваше имя"
        required
        onChange={handleChange}
        className="w-full mb-3 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Номер WhatsApp"
        required
        onChange={handleChange}
        className="w-full mb-3 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <input
        type="text"
        name="address"
        placeholder="Адрес доставки"
        required
        onChange={handleChange}
        className="w-full mb-3 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <textarea
        name="note"
        placeholder="Примечание"
        onChange={handleChange}
        className="w-full mb-4 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      ></textarea>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-600 transition"
      >
        {loading ? 'Отправка...' : 'Отправить заказ'}
      </button>
    </form>
  )
}
