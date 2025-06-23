import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  if (!Array.isArray(products)) {
    return <p className="text-red-500">Ошибка загрузки товаров</p>
  }

  const maxRule = discountRules.sort((a, b) => b.percent - a.percent)[0] || { percent: 0 }

  return (
    <div className="grid grid-cols-1 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          maxDiscountPercent={maxRule.percent}
          addToCart={addToCart}
        />
      ))}
    </div>
  )
}
