// ProductList.jsx — список товаров с кнопками добавления в корзину

import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  if (!Array.isArray(products)) {
    console.error('❌ products не массив:', products)
    return <p>Ошибка загрузки товаров</p>
  }

  const maxDiscount = discountRules.length > 0
    ? Math.max(...discountRules.map(r => r.percent))
    : 0

  return (
    <div className="grid gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          maxDiscount={maxDiscount}
          addToCart={addToCart}
        />
      ))}
    </div>
  )
}
