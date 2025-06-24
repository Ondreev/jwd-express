export function CheckoutForm({ items }) {
  if (items.length === 0) return null

  return (
    <form className="fancy-block mt-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>

      <input
        type="text"
        placeholder="Ваше имя"
        required
        className="w-full mb-3 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <input
        type="tel"
        placeholder="Номер WhatsApp"
        required
        className="w-full mb-3 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <input
        type="text"
        placeholder="Адрес доставки"
        required
        className="w-full mb-3 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      <textarea
        placeholder="Примечание"
        className="w-full mb-4 p-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      ></textarea>

      <button
        type="submit"
        className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-600 transition"
      >
        Отправить заказ
      </button>
    </form>
  )
}
