// ✅ Фикс для отображения корректных цен в карточках товаров
import { useEffect, useState } from 'react'
import Papa from 'papaparse'

const PRODUCTS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR322Pt499Vfg2H8lFKITDC7GIJiZgkq4tubdCKCZR87zeqRVhRBx8NoGk9RL09slKkOT0sFrJaOelE/pub?gid=0&single=true&output=csv'

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + '₽'
}

export default function ProductList() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const text = await fetch(PRODUCTS_URL).then(res => res.text())
        const { data } = Papa.parse(text.trim(), { header: true })
        const parsed = data.map(row => {
          const basePrice = parseFloat((row['price'] || '0').replace(',', '.'))
          const rawDiscount = String(row['discoun'] || '0')
          const discount = parseInt(rawDiscount.replace(/\D/g, '')) || 0
          const discountedPrice = Math.round(basePrice * (1 - discount / 100))
          return {
            name: row['name'],
            description: row['description'],
            image: row['image'],
            price: Math.round(basePrice),
            discountedPrice,
            promo: row['promo'] === 'TRUE',
          }
        }).filter(p => p.name && !isNaN(p.price))
        setProducts(parsed)
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err)
      }
    }
    loadProducts()
  }, [])

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product, i) => (
        <div key={i} className="bg-[#0f172a] text-white rounded-xl p-4 shadow-md">
          {product.promo && <div className="bg-red-600 text-white px-2 py-1 text-xs rounded w-max mb-2">АКЦИЯ</div>}
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
          <div className="font-semibold text-lg mb-1">{product.name}</div>
          <div className="text-sm text-gray-300 mb-2">{product.description}</div>
          <div className="text-right text-lg">
            <span className="text-yellow-400 mr-2">{formatPrice(product.discountedPrice)}</span>
            {product.discountedPrice !== product.price && (
              <span className="text-sm line-through text-gray-400">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
