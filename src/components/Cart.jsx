// Cart.jsx — компонент корзины

export function Cart({ items, discountRules }) {
  if (!Array.isArray(items) || items.length === 0) return null

  const maxDiscount = discountRules.length > 0
    ? Math.max(...discountRules.map(r => r.percent))
    : 0

  const total = items.reduce((sum, item) => {
    const discountedPrice = maxDiscount
      ? Math.round(item.price * (1 - maxDiscount / 100))
      : item.price
    return sum + discountedPrice
  }, 0)

  return (
    <div className="mt-6 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-2">Корзина</h2>
      <ul className="mb-4">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between border-b py-1">
            <span>{item.name}</span>
            <span>
              {maxDiscount && (
                <span className="text-sm line-through text-gray-400 mr-2">
                  {item.price}₽
                </span>
              )}
              {maxDiscount
                ? Math.round(item.price * (1 - maxDiscount / 100))
                : item.price}₽
            </span>
          </li>
        ))}
      </ul>
      <div className="text-right font-bold">Итого: {total}₽</div>
    </div>
  )
}
