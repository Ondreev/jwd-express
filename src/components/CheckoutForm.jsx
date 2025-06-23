export function CheckoutForm({ items }) {
  if (items.length === 0) return null

  return (
    <form className="mt-6 bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="text-lg font-semibold">Оформление заказа</h2>
      <input type="text" placeholder="Ваше имя" required className="w-full border rounded p-2" />
      <input type="tel" placeholder="Номер WhatsApp" required className="w-full border rounded p-2" />
      <input type="text" placeholder="Адрес доставки" required className="w-full border rounded p-2" />
      <textarea placeholder="Примечание" className="w-full border rounded p-2"></textarea>
      <button type="submit" className="bg-black text-white px-4 py-2 rounded-xl">Отправить заказ</button>
    </form>
  )
}
