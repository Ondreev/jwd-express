// shop-miniapp — базовая структура на React + Vite с Tailwind CSS

import { useState, useEffect } from 'react'
import { ProductList } from './components/ProductList'
import { Cart } from './components/Cart'
import { CheckoutForm } from './components/CheckoutForm'
import { AdminPanel } from './components/AdminPanel'
import { Login } from './components/Login'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [discountRules, setDiscountRules] = useState([])
  const [products, setProducts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [productsError, setProductsError] = useState(false)

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product])
  }

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjKj32Emszk_aVk3GKB9aY23lQG6Nkxt4Va2WAe710KiwsXevhrLS2w7DNIs6jEVXFTh6LwZc6U3MvXT19YvV1TgTUEbexYkzsfGQFFjWFZAVAFZKiDq5FHD8fE3Lkj9dZ7EyhkfuYmc_IoK0TgM73Q4CjX4kTy5cdQJEMXt15l4HE-48yp-k4wiDaXbvVVA1YPSXAC8gbarNjKKHNKWlZr6V4CZg_qGs_ykX33J6rXJ4fc1G5deHFdDLxMIC8OmNNreLx-E-V0C_knBjPSDIn0owFxdxD9qCQ0LXYKcmegJta6Kf5PXc6AwIcyig&lib=MV5zt_1yAKnbl-Cizom2A6UBf2lQkhfMZ')
      .then(res => res.json())
      .then(data => {
        console.log('🟢 Products:', data)
        if (Array.isArray(data)) {
          const safeData = data.map(product => ({
            ...product,
            promo: product.promo === true || product.promo === 'TRUE'
          }))
          setProducts(safeData)
          setProductsError(false)
        } else {
          console.error('❌ products не массив:', data)
          setProductsError(true)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Ошибка загрузки товаров:', err)
        setProductsError(true)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">JWD Express</h1>

      {loading && <p>Загрузка товаров...</p>}

      {!loading && productsError && (
        <p className="text-red-500">Ошибка загрузки данных.</p>
      )}

      {!loading && !productsError && (
        products.length > 0 ? (
          <ProductList
            products={products}
            addToCart={addToCart}
            discountRules={discountRules}
          />
        ) : (
          <p className="text-gray-500">Нет доступных товаров.</p>
        )
      )}

      <Cart items={cartItems} discountRules={discountRules} />
      <CheckoutForm items={cartItems} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Вход для администратора</h2>
        {!isAdmin && <Login onLogin={setIsAdmin} />}
        {isAdmin && <AdminPanel />}
      </div>
    </div>
  )
}

export default App;
