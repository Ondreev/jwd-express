// 2. components/ProductList.jsx
import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  const maxRule = discountRules.sort((a, b) => b.percent - a.percent)[0] || { percent: 0 }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          addToCart={addToCart}
          maxDiscount={maxRule.percent}
        />
      ))}
    </div>
  )
}
