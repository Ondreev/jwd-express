export function ProductCard({ product, addToCart }) {
  if (!product || typeof product !== 'object') return null

  const hasDiscount = product.discount && product.discount > 0
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  return (
    <div className="border rounded-xl p-4 shadow bg-white space-y-2">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>

      {product.promo && (
        <span className="inline-block text-red-500 text-xs font-bold">АКЦИЯ</span>
      )}

      <div className="text-lg font-bold mt-1">
        {hasDiscount ? (
          <>
            <span className="text-black">{discountedPrice}₽</span>{' '}
            <span className="line-through text-red-400 text-sm">{product.price}₽</span>
          </>
        ) : (
          <span>{product.price}₽</span>
        )}
      </div>

      <button
        onClick={() => addToCart(product)}
        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
      >
        В корзину
      </button>
    </div>
  )
}
