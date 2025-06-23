// ProductCard.jsx — карточка товара с отображением скидки и зачёркнутой цены

export function ProductCard({ product, addToCart }) {
  if (!product || typeof product !== 'object') {
    console.warn('❌ Неверный формат product:', product)
    return null
  }

  const originalPrice = product.price
  const discount = product.discount || 0
  const discountedPrice = Math.round(originalPrice * (1 - discount / 100))
  const hasDiscount = discount > 0 && discountedPrice < originalPrice

  return (
    <div className="border rounded-xl p-4 shadow bg-white flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover mb-3 rounded"
      />
      <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.description}</p>

      {product.promo && (
        <span className="text-xs text-red-600 font-bold mb-1">АКЦИЯ!</span>
      )}

      <div className="mt-auto">
        <div className="mb-2">
          <span className="text-xl font-bold text-black">
            {discountedPrice}₽
          </span>
          {hasDiscount && (
            <span className="text-sm line-through text-red-500 ml-2">
              {originalPrice}₽
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          В корзину
        </button>
      </div>
    </div>
  )
}
