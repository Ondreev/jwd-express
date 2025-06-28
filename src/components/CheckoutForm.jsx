// CheckoutForm.jsx — восстановленная рабочая версия с GET, стилем и формой

import React, { useState } from 'react';

export function CheckoutForm({ cartItems }) {
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    address: '',
    note: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.whatsapp) return alert("Введите имя и WhatsApp");

    const grouped = cartItems.reduce((acc, item) => {
      const key = item.name;
      acc[key] = acc[key] || { ...item, quantity: 0 };
      acc[key].quantity += 1;
      return acc;
    }, {});

    const order = Object.values(grouped)
      .map(item => `${item.name} x${item.quantity}`)
      .join("\n");

    const params = new URLSearchParams({
      action: "addOrder",
      name: form.name,
      whatsapp: form.whatsapp,
      address: form.address,
      note: form.note,
      order
    });

    try {
      const res = await fetch(`https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?${params}`);
      const data = await res.json();
      if (data.status === 'ok') alert("Заказ отправлен!");
      else throw new Error("Ошибка на сервере");
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      alert("Ошибка при отправке заказа");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded text-white space-y-2">
      <input
        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        type="text"
        name="name"
        placeholder="Имя"
        value={form.name}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        type="text"
        name="whatsapp"
        placeholder="WhatsApp"
        value={form.whatsapp}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        type="text"
        name="address"
        placeholder="Адрес"
        value={form.address}
        onChange={handleChange}
      />
      <textarea
        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        name="note"
        placeholder="Примечание"
        value={form.note}
        onChange={handleChange}
      />
      <button
        className="bg-yellow-500 text-black font-bold w-full py-2 rounded hover:bg-yellow-400"
        onClick={handleSubmit}
      >
        Отправить заказ
      </button>
    </div>
  );
}
