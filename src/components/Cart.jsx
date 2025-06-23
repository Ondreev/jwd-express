// Cart.jsx — компонент корзины

export function Cart({ items, discountRules }) {
  if (!Array.isArray(items) || items.length === 0) return null

  const maxDiscount = discountRules.length > 0
    ? Math.max(...discountRules.map(r => r.percent))
    : 0

  // Группируем товары по id
  const groupedItems = items.reduce((acc, item) => {
    const key = item.id || item.name
    acc[key] = acc[key] || { ...item, quantity: 0 }
    acc[key].quantity += 1
    return acc
  }, {})

  const itemList = Object.values(groupedItems)

  const total = itemList.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0
    const discountedPrice = maxDiscount
      ? Math.round(price * (1 - maxDiscount / 100))
      : price
    return sum + discountedPrice * item.quantity
  }, 0)

  return (
    <div className="mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-2">Корзина</h2>
      <ul className="mb-4">
        {itemList.map((item, index) => {
          const price = parseFloat(item.price) || 0
          const discounted = maxDiscount
            ? Math.round(price * (1 - maxDiscount / 100))
            : price
          return (
            <li key={index} className="flex justify-between border-b py-1">
              <span>{item.name} x{item.quantity}</span>
              <span>
                {maxDiscount > 0 && (
                  <span className="text-sm line-through text-gray-400 mr-2">
                    {price * item.quantity}₽
                  </span>
                )}
                {discounted * item.quantity}₽
              </span>
            </li>
          )
        })}
      </ul>
      <div className="text-right font-bold">Итого: {total}₽</div>
    </div>
  )
}
