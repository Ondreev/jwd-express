// ✅ Новый корректный CheckoutForm.jsx с полной поддержкой GET, правильным оформлением заказа и fallback на пустой массив
import React, { useState } from 'react'

export function CheckoutForm({ items = [] }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
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
        setStatus('Заказ отправлен')
      } else {
        setStatus('Ошибка при отправке')
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err)
      setStatus('Ошибка отправки')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black rounded-xl p-4 mt-4 shadow-lg"
    >
      <h2 className="text-lg font-bold mb-2">Оформление заказа</h2>
      <input
        type="text"
        placeholder="Ваше имя"
        className="border p-2 rounded w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="WhatsApp"
        className="border p-2 rounded w-full mb-2"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Адрес доставки"
        className="border p-2 rounded w-full mb-2"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <textarea
        placeholder="Комментарий к заказу"
        className="border p-2 rounded w-full mb-2"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 font-semibold"
      >
        Отправить заказ
      </button>
      {status && <p className="mt-2 text-sm text-green-600">{status}</p>}
    </form>
  )
}
