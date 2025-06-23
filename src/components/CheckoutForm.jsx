export function CheckoutForm({ items }) {
  const hasItems = Array.isArray(items) && items.length > 0

  return (
    <form className="mt-6 bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="text-lg font-semibold">
        Оформление заказа {hasItems ? '' : '(товары ещё не выбраны)'}
      </h2>

      <input
        type="text"
        placeholder="Ваше имя"
        required
        className="w-full border rounded p-2"
      />
      <input
        type="tel"
        placeholder="Номер WhatsApp"
        required
        className="w-full border rounded p-2"
      />
      <input
        type="text"
        placeholder="Адрес доставки"
        required
        className="w-full border rounded p-2"
      />
      <textarea
        placeholder="Примечание"
        className="w-full border rounded p-2"
      ></textarea>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
        disabled={!hasItems}
      >
        Отправить заказ
      </button>
    </form>
  )
}
