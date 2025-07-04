// ✅ CheckoutForm.jsx с визуалом, как у карточек товаров
import React, { useState } from 'react'

export function CheckoutForm({ items = [] }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!Array.isArray(items) || items.length === 0) {
      alert('Корзина пуста')
      return
    }

    const orderText = items
      .map((item) => `${item.name} x ${item.quantity}`)
      .join(', ')

    const url = new URL(
      'https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec'
    )
    url.searchParams.append('action', 'addOrder')
    url.searchParams.append('name', name)
    url.searchParams.append('whatsapp', whatsapp)
    url.searchParams.append('address', address)
    url.searchParams.append('note', note)
    url.searchParams.append('order', orderText)

    try {
      const res = await fetch(url.toString())
      const data = await res.json()
      if (data.status === 'ok') {
        setSubmitted(true)
      } else {
        setStatus('Ошибка при отправке')
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err)
      setStatus('Ошибка отправки')
    }
  }

  if (submitted) {
    return (
      <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg">
        <p className="text-yellow-400 font-bold text-center">Ваш заказ отправлен</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
    >
      <h2 className="text-xl font-bold mb-4">Оформление заказа</h2>
      <input
        type="text"
        placeholder="Ваше имя"
        className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3 text-white placeholder-gray-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="WhatsApp"
        className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3 text-white placeholder-gray-400"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Адрес доставки"
        className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3 text-white placeholder-gray-400"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <textarea
        placeholder="Комментарий к заказу"
        className="bg-gray-800 border border-gray-700 p-2 rounded w-full mb-3 text-white placeholder-gray-400"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        className="bg-yellow-500 text-black px-6 py-2 rounded-xl hover:bg-yellow-400 font-semibold w-full"
      >
        Отправить заказ
      </button>
      {status && <p className="mt-3 text-sm text-orange-400 font-medium">{status}</p>}
    </form>
  )
}
