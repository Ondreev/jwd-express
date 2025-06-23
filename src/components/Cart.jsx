export function Cart({ items, discountRules }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  const rule = discountRules
    .filter(r => total >= r.min)
    .sort((a, b) => b.min - a.min)[0] || { percent: 0 }

  const discount = Math.floor((rule.percent / 100) * total)

  return (
    <div className="mt-6 bg-gray-100 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Ваш заказ</h2>
      {items.map((item, i) => (
        <div key={i} className="flex justify-between">
          <span>{item.name}</span>
          <span>{item.price}₽</span>
        </div>
      ))}
      <hr className="my-2" />
      <div className="flex justify-between">
        <span>Итого:</span>
        <span>{total - discount}₽</span>
      </div>
      {rule.percent > 0 ? (
        <p className="text-sm text-green-600 mt-1">
          Скидка {rule.percent}% (−{discount}₽) за заказ от {rule.min}₽ применена
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-1">
          Скидка применится при заказе от {(Array.isArray(discountRules) ? discountRules.map(r => r.min) : []).join(', ')}₽
        </p>
      )}
    </div>
  )
}
