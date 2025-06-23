import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  const total = products.reduce((sum, p) => sum + Number(p.price), 0)

  const rule = discountRules
    .filter(r => total >= r.min)
    .sort((a, b) => b.min - a.min)[0] || { percent: 0 }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          maxDiscount={rule.percent}
          addToCart={addToCart}
        />
      ))}
    </div>
  )
}
