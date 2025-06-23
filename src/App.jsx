import { useEffect, useState } from 'react'
import { ProductList } from './components/ProductList'
import { Cart } from './components/Cart'
import { CheckoutForm } from './components/CheckoutForm'

function App() {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    console.log('🛒 Добавлено в корзину:', product.name)
    setCartItems(prev => [...prev, product])
  }

  useEffect(() => {
    fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjKj32Emszk_aVk3GKB9aY23lQG6Nkxt4Va2WAe710KiwsXevhrLS2w7DNIs6jEVXFTh6LwZc6U3MvXT19YvV1TgTUEbexYkzsfGQFFjWFZAVAFZKiDq5FHD8fE3Lkj9dZ7EyhkfuYmc_IoK0TgM73Q4CjX4kTy5cdQJEMXt15l4HE-48yp-k4wiDaXbvVVA1YPSXAC8gbarNjKKHNKWlZr6V4CZg_qGs_ykX33J6rXJ4fc1G5deHFdDLxMIC8OmNNreLx-E-V0C_knBjPSDIn0owFxdxD9qCQ0LXYKcmegJta6Kf5PXc6AwIcyig&lib=MV5zt_1yAKnbl-Cizom2A6UBf2lQkhfMZ')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const normalized = data.map(p => ({
            ...p,
            promo: p.promo === true || p.promo === 'TRUE'
          }))
          setProducts(normalized)
        } else {
          console.error('❌ Не массив:', data)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">JWD Express</h1>

      <ProductList
        products={products}
        addToCart={addToCart}
        discountRules={[]} // или можешь позже добавить реальные скидки
      />

      <Cart
        items={cartItems}
        discountRules={[]}
      />

      <CheckoutForm items={cartItems} />
    </div>
  )
}

export default App
