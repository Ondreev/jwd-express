import React, { useState } from 'react';

export function CheckoutForm({ cart, total }) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async () => {
    if (!name || !whatsapp || cart.length === 0) {
      alert('Заполните имя, WhatsApp и добавьте товары.');
      return;
    }

    const orderSummary = cart
      .map((item) => `${item.name} x${item.quantity}`)
      .join('\n');

    const params = new URLSearchParams({
      action: 'addOrder',
      name,
      whatsapp,
      address,
      note,
      order: orderSummary,
    });

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?${params.toString()}`
      );

      const result = await response.json();
      if (result.status === 'ok') {
        alert('Заказ отправлен!');
        setName('');
        setWhatsapp('');
        setAddress('');
        setNote('');
      } else {
        alert('Ошибка при отправке заказа.');
      }
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      alert('Не удалось отправить заказ.');
    }
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl mt-4">
      <h2 className="text-xl font-bold mb-2">Оформление заказа</h2>
      <div className="space-y-2">
        <input
          type="text"
          className="w-full p-2 rounded text-black"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 rounded text-black"
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 rounded text-black"
          placeholder="Адрес"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <textarea
          className="w-full p-2 rounded text-black"
          placeholder="Примечание к заказу"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full"
          onClick={handleSubmit}
        >
          Отправить заказ
        </button>
      </div>
    </div>
  );
}
