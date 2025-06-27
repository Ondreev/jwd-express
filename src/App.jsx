import { useState, useEffect } from 'react'
import { ProductList } from './components/ProductList'
import { Cart } from './components/Cart'

function App() {
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  // Загрузка товаров из Google Таблицы
  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?action=getProducts')
      .then(res => res.json())
      .then(data => {
        console.log('📦 Товары из таблицы:', data)
        if (Array.isArray(data)) {
          setProducts(data)
        } else {
          console.error('❌ ОШИБКА: ожидался массив, а пришло:', data)
          setProducts([])
        }
      })
      .catch(err => {
        console.error('❌ Ошибка при загрузке продуктов:', err)
      })
  }, [])

  // Перенаправление в админку
  useEffect(() => {
    if (isAdmin) {
      window.location.href = '/admin'
    }
  }, [isAdmin])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id)
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, quantity: p.quantity - 1 } : p
        )
        .filter((p) => p.quantity > 0)
    )
  }

  const getQuantity = (id) => {
    const item = cart.find((p) => p.id === id)
    return item ? item.quantity : 0
  }

  const handleLogin = async () => {
    try {
      const res = await fetch(
        'https://script.google.com/macros/s/AKfycbwuYx0eVaMWIyydg7dIs2wuCzVwr_bx6MGwrIG3Yy-_Xvi8sq6VCVfkxFCp6svMQI7lCQ/exec?action=getAdminPass'
      )
      const realPass = await res.text()
      if (password === realPass.trim()) {
        setIsAdmin(true)
        setShowLoginPopup(false)
      } else {
        alert('Неверный пароль')
      }
    } catch (err) {
      alert('Ошибка авторизации')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <header className="bg-gray-900 py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">JWD Express</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLoginPopup(true)}
            className="text-sm bg-yellow-400 hover:bg-yellow-300 text-black px-2 py-1 rounded"
          >
            Админ
          </button>
          <a
            href="https://wa.me/74951400557"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-green-500 hover:bg-green-400 text-white px-2 py-1 rounded"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <main className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ProductList
            products={products}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            getQuantity={getQuantity}
            discountRules={[]}
          />
        </div>
        <div>
          <Cart cart={cart} />
        </div>
      </main>

      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Вход в админ-панель</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="p-2 border rounded w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-3 py-1 rounded bg-gray-300 text-black"
              >
                Отмена
              </button>
              <button
                onClick={handleLogin}
                className="px-3 py-1 rounded bg-yellow-500 text-black font-semibold"
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
