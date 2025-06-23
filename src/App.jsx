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
    fetch('https://script.google.com/macros/s/AKfycbxhfipSAbKIDxove3iOYAzqssmt_YBHFdL9Fp1mnUQYbJRwBxQtAxPZ7AaUxgqkTvbDpw/exec?action=getProducts')
      .then(res => res.json())
      .then(data => {
        console.log('🟢 Products:', data)
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.error('❌ Ожидался массив, но получено:', data)
          setProducts([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Ошибка загрузки товаров:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">JWD Express</h1>

      {loading ? (
        <p>Загрузка товаров...</p>
      ) : (
        <ProductList products={products} addToCart={addToCart} discountRules={discountRules} />
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
