// Cart.jsx — современный футуристичный стиль

export function Cart({ items, discountRules }) {
  if (!Array.isArray(items) || items.length === 0) return null

  const maxDiscount = discountRules.length > 0
    ? Math.max(...discountRules.map(r => r.percent))
    : 0

  const groupedItems = items.reduce((acc, item) => {
    const key = item.id || item.name
    acc[key] = acc[key] || { ...item, quantity: 0 }
    acc[key].quantity += 1
    return acc
  }, {})

  const itemList = Object.values(groupedItems)

  const total = itemList.reduce((sum, item) => {
    const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, '')) || 0
    const discountedPrice = maxDiscount
      ? Math.round(price * (1 - maxDiscount / 100))
      : price
    return sum + discountedPrice * item.quantity
  }, 0)

  return (
    <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4 tracking-wide">🛒 Корзина</h2>
      <ul className="space-y-2 mb-6">
        {itemList.map((item, index) => {
          const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, '')) || 0
          const discounted = maxDiscount
            ? Math.round(price * (1 - maxDiscount / 100))
            : price
          return (
            <li
              key={index}
              className="flex justify-between items-center border-b border-gray-700 pb-2"
            >
              <span className="font-medium">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
              <span>
                {maxDiscount > 0 && (
                  <span className="text-sm line-through text-red-400 mr-2">
                    {price * item.quantity}₽
                  </span>
                )}
                <span className="text-lg font-semibold">{discounted * item.quantity}₽</span>
              </span>
            </li>
          )
        })}
      </ul>
      <div className="text-right text-xl font-bold border-t border-gray-700 pt-4">
        Итого: {total}₽
      </div>
    </div>
  )
}
