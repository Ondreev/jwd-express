import { useState, useEffect } from 'react'
import { ProductList } from './components/ProductList'
import { Cart } from './components/Cart'
import { CheckoutForm } from './components/CheckoutForm'
import { Login } from './components/Login'
import { AdminPanel } from './components/AdminPanel'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [discountRules, setDiscountRules] = useState([])
  const [products, setProducts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product])
  }

  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbybK3Vobo8b5sb8Lo4fgHs9atBxBeaan40O42W0ZfHWVAcI3w2mJjPDtY9A5AaSi-wl7A/exec?action=getSettings')
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
    fetch('https://script.google.com/macros/s/AKfycbybK3Vobo8b5sb8Lo4fgHs9atBxBeaan40O42W0ZfHWVAcI3w2mJjPDtY9A5AaSi-wl7A/exec?action=getProducts')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">JWD Express</h1>

      <ProductList products={products} addToCart={addToCart} discountRules={discountRules} />
      <Cart items={cartItems} discountRules={discountRules} />
      <CheckoutForm items={cartItems} />

      {!isAdmin && <Login onLogin={setIsAdmin} />}
      {isAdmin && <AdminPanel />}
    </div>
  )
}

export default App;
