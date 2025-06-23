export function ProductCard({ product, maxDiscount, addToCart }) {
  if (!product || typeof product !== 'object') {
    console.warn('❌ Неверный формат product:', product)
    return null
  }

  const priceWithDiscount = maxDiscount
    ? Math.round(product.price * (1 - maxDiscount / 100))
    : product.price

  return (
    <div className="border rounded p-4 shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover mb-2"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>

      {product.promo && (
        <span className="text-sm text-red-500 font-bold">АКЦИЯ!</span>
      )}

      <div className="mt-2">
        <span className="font-bold">{priceWithDiscount}₽</span>
        {priceWithDiscount !== product.price && (
          <span className="text-sm line-through text-gray-400 ml-2">
            {product.price}₽
          </span>
        )}
      </div>

      <button
        onClick={() => addToCart(product)}
        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        В корзину
      </button>
    </div>
  )
}
