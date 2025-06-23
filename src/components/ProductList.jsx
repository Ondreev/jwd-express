import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  if (!Array.isArray(products)) {
    console.warn('❌ products не массив:', products)
    return <p className="text-red-600">Ошибка загрузки товаров</p>
  }

  const maxRule = discountRules.sort((a, b) => b.percent - a.percent)[0] || { percent: 0 }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          maxDiscount={maxRule.percent}
          addToCart={addToCart}
        />
      ))}
    </div>
  )
}
