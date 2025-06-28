// CheckoutForm.jsx — обновлённый рабочий вариант
// 1. Работает добавление товара через +
// 2. Заказ отправляется через GET (base64)

import React, { useState } from 'react';

export function CheckoutForm({ cartItems }) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !whatsapp || cartItems.length === 0) {
      alert('Пожалуйста, заполните имя, WhatsApp и добавьте товары в корзину');
      return;
    }

    const grouped = cartItems.reduce((acc, item) => {
      const key = item.name;
      if (!acc[key]) acc[key] = { ...item, quantity: 0 };
      acc[key].quantity += 1;
      return acc;
    }, {});

    const orderText = Object.values(grouped)
      .map((item) => `${item.name} x${item.quantity}`)
      .join('\n');

    const payload = {
      name,
      whatsapp,
      address,
      note,
      order: orderText,
    };

    const query = new URLSearchParams({
      action: 'addOrder',
      name: payload.name,
      whatsapp: payload.whatsapp,
      address: payload.address,
      note: payload.note,
      order: orderText,
    });

    try {
      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?${query.toString()}`
      );
      const data = await res.json();
      if (data.status === 'ok') {
        alert('Заказ успешно отправлен!');
        setName('');
        setWhatsapp('');
        setAddress('');
        setNote('');
      } else {
        alert('Ошибка при отправке заказа');
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      alert('Ошибка при отправке заказа');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Номер WhatsApp"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
      />
      <input
        placeholder="Адрес доставки"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        placeholder="Примечание"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Оформить заказ</button>
    </form>
  );
}
