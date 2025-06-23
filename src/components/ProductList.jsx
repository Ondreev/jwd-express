// ProductList.jsx — отображение списка товаров с применением скидок

import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  const totalSum = products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
  const matchedRule = [...discountRules].sort((a, b) => b.min - a.min).find(rule => totalSum >= rule.min)
  const maxDiscount = matchedRule ? matchedRule.percent : 0

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {products.map(product => {
        const price = parseFloat(product.price) || 0
        const discountedPrice = maxDiscount ? Math.round(price * (1 - maxDiscount / 100)) : price

        return (
          <ProductCard
            key={product.id}
            product={{ ...product, discountedPrice, originalPrice: price }}
            addToCart={addToCart}
            maxDiscount={maxDiscount}
          />
        )
      })}
    </div>
  )
}

