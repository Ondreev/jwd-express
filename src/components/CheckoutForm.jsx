import React, { useState } from 'react';

export function CheckoutForm({ cartItems }) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert('Корзина пуста');
      return;
    }

    const orderText = cartItems.reduce((text, item) => {
      return text + `${item.name} x${item.quantity || 1}\n`;
    }, '');

    const url = new URL(
      'https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec'
    );

    url.searchParams.append('action', 'addOrder');
    url.searchParams.append('name', name);
    url.searchParams.append('whatsapp', whatsapp);
    url.searchParams.append('address', address);
    url.searchParams.append('note', note);
    url.searchParams.append('order', orderText);

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'ok') {
        alert('Заказ отправлен!');
        setName('');
        setWhatsapp('');
        setAddress('');
        setNote('');
      } else {
        alert('Ошибка при отправке заказа');
      }
    } catch (err) {
      console.error('Ошибка при отправке:', err);
      alert('Ошибка при отправке');
    }
  };

  return (
    <div className="bg-white text-black p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Оформление заказа</h2>
      <input
        type="text"
        placeholder="Имя"
        className="block w-full mb-2 p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="WhatsApp"
        className="block w-full mb-2 p-2 border rounded"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
      />
      <input
        type="text"
        placeholder="Адрес"
        className="block w-full mb-2 p-2 border rounded"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Примечание"
        className="block w-full mb-4 p-2 border rounded"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-600"
      >
        Отправить заказ
      </button>
    </div>
  );
}
