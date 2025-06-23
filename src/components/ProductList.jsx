import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  if (!Array.isArray(products)) {
    console.error('❌ products не массив:', products)
    return <p className="text-red-500">Ошибка отображения товаров.</p>
  }

  // Вычисляем максимальную скидку в процентах
  const total = products.reduce((sum, item) => sum + Number(item.price || 0), 0)
  const rule = discountRules
    .filter(r => total >= r.min)
    .sort((a, b) => b.min - a.min)[0] || { percent: 0 }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product, i) => (
        <ProductCard
          key={i}
          product={product}
          maxDiscount={rule.percent}
          addToCart={addToCart}
        />
      ))}
    </div>
  )
}
