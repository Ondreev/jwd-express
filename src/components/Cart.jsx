// Cart.jsx — современный футуристичный стиль с правильной поддержкой скидок от суммы корзины

export function Cart({ items, discountRules }) {
  if (!Array.isArray(items) || items.length === 0) return null

  // Группируем товары по id
  const groupedItems = items.reduce((acc, item) => {
    const key = item.id || item.name
    acc[key] = acc[key] || { ...item, quantity: 0 }
    acc[key].quantity += 1
    return acc
  }, {})

  const itemList = Object.values(groupedItems)

  // Общая сумма без скидки
  const fullTotal = itemList.reduce((sum, item) => {
    const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, '')) || 0
    return sum + price * item.quantity
  }, 0)

  // Определяем скидку по общей сумме корзины
  const matchedRule = [...discountRules].sort((a, b) => b.min - a.min).find(rule => fullTotal >= rule.min)
  const discountPercent = matchedRule ? matchedRule.percent : 0

  return (
    <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4 tracking-wide">🛒 Корзина</h2>
      <ul className="space-y-2 mb-6">
        {itemList.map((item, index) => {
          const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, '')) || 0
          const hasDiscount = discountPercent > 0
          const discounted = Math.round(price * (1 - discountPercent / 100))

          return (
            <li
              key={index}
              className="flex justify-between items-center border-b border-gray-700 pb-2"
            >
              <span className="font-medium">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
              <span>
                {hasDiscount && (
                  <span className="text-sm line-through text-red-400 mr-2">
                    {price * item.quantity}₽
                  </span>
                )}
                <span className="text-lg font-bold">
                  {discounted * item.quantity}₽
                </span>
              </span>
            </li>
          )
        })}
      </ul>
      <div className="text-right text-xl font-bold border-t border-gray-700 pt-4">
        Итого: {Math.round(fullTotal * (1 - discountPercent / 100))}₽
      </div>
    </div>
  )
}
