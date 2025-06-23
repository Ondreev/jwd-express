// Cart.jsx — современный футуристичный стиль с правильной поддержкой скидок

export function Cart({ items, discountRules }) {
  if (!Array.isArray(items) || items.length === 0) return null

  // Определяем скидку для каждой позиции
  const getDiscountPercent = (price, rules) => {
    const matchedRule = [...rules]
      .sort((a, b) => b.min - a.min)
      .find(rule => price >= rule.min)
    return matchedRule ? matchedRule.percent : 0
  }

  const groupedItems = items.reduce((acc, item) => {
    const key = item.id || item.name
    acc[key] = acc[key] || { ...item, quantity: 0 }
    acc[key].quantity += 1
    return acc
  }, {})

  const itemList = Object.values(groupedItems)

  const total = itemList.reduce((sum, item) => {
    const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, '')) || 0
    const discountPercent = getDiscountPercent(price * item.quantity, discountRules)
    const discountedPrice = Math.round(price * (1 - discountPercent / 100))
    return sum + discountedPrice * item.quantity
  }, 0)

  return (
    <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4 tracking-wide">🛒 Корзина</h2>
      <ul className="space-y-2 mb-6">
        {itemList.map((item, index) => {
          const price = parseFloat(item.price?.toString().replace(/[^\d.]/g, '')) || 0
          const discountPercent = getDiscountPercent(price * item.quantity, discountRules)
          const discounted = Math.round(price * (1 - discountPercent / 100))
          const hasDiscount = discountPercent > 0

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
        Итого: {total}₽
      </div>
    </div>
  )
}
