import { useEffect, useState } from 'react'
import { ProductList } from './components/ProductList'
import { Cart } from './components/Cart'
import { CheckoutForm } from './components/CheckoutForm'

function App() {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [discountRules, setDiscountRules] = useState([])

  const addToCart = (product) => {
    setCartItems(prev => [...prev, product])
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const index = prev.findIndex(p => p.id === productId)
      if (index !== -1) {
        const newCart = [...prev]
        newCart.splice(index, 1)
        return newCart
      }
      return prev
    })
  }

  const getQuantity = (productId) => {
    return cartItems.filter(item => item.id === productId).length
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

    fetch('https://script.google.com/macros/s/AKfycbxhfipSAbKIDxove3iOYAzqssmt_YBHFdL9Fp1mnUQYbJRwBxQtAxPZ7AaUxgqkTvbDpw/exec?action=getSettings')
      .then(res => res.json())
      .then(data => {
        const rules = Object.entries(data)
          .filter(([key]) => key.startsWith('discount_rule_'))
          .map(([_, value]) => {
            const [min, percent] = value.split(':').map(Number)
            return { min, percent }
          })
        setDiscountRules(rules)
      })
      .catch(console.error)
  }, [])

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-white tracking-wide uppercase">JWD Express</h1>

        <ProductList
          products={products}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          getQuantity={getQuantity}
          discountRules={discountRules}
        />

        <Cart
          items={cartItems}
          discountRules={discountRules}
        />

        <CheckoutForm items={cartItems} />
      </div>
    </div>
  )
}

export default App
