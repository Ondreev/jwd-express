import { ProductCard } from './ProductCard'

export function ProductList({ products, addToCart, discountRules }) {
  if (!Array.isArray(products)) {
    console.error('❌ products не массив в ProductList:', products)
    return null
  }

  // Находим максимальную скидку (для отображения зачёркнутой цены)
  const maxDiscount = discountRules?.length
    ? Math.max(...discountRules.map(rule => rule.percent))
    : 0

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          product={product}
          maxDiscount={maxDiscount}
          addToCart={(p) => {
            console.log('🛒 Добавляем в корзину:', p)
            addToCart(p)
          }}
        />
      ))}
    </div>
  )
}
