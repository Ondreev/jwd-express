import { useState } from 'react'

export function ProductCard({ product, addToCart, maxDiscount }) {
  const [showPopup, setShowPopup] = useState(false)

  const discountedPrice = Math.floor(product.price * (1 - maxDiscount / 100))

  return (
    <div className="border rounded-2xl p-3 shadow hover:shadow-lg relative">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-xl" onClick={() => setShowPopup(true)} />
      <div className="mt-2">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-700 line-through text-sm">{product.price}₽</p>
        <p className="text-black font-bold">{discountedPrice}₽</p>
        <p className="text-xs text-gray-500">* с максимальной скидкой</p>
        {product.promo === 'true' && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Акция</span>}
        <button onClick={() => addToCart(product)} className="mt-2 bg-black text-white rounded-xl px-4 py-1">В корзину</button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setShowPopup(false)}>
          <div className="bg-white p-4 rounded-xl max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p>{product.description}</p>
            <button className="mt-4 bg-gray-200 px-4 py-1 rounded" onClick={() => setShowPopup(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  )
}
