import { useEffect, useState } from 'react'

function App() {
  const [products, setProducts] = useState([])

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
      <div className="grid gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded p-4 shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-2"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            {product.promo && (
              <span className="text-red-500 font-bold text-sm">АКЦИЯ!</span>
            )}
            <p className="mt-2 font-bold">{product.price}₽</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
