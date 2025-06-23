import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  const maxRule = discountRules.sort((a, b) => b.percent - a.percent)[0] || { percent: 0 }

  return (
    <div className="grid gap-4 mb-8">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => addToCart(product)}
          discountPercent={maxRule.percent}
        />
      ))}
    </div>
  )
}
