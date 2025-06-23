export function ProductCard({ product, addToCart, maxDiscountPercent }) {
  const hasDiscount = maxDiscountPercent > 0
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - maxDiscountPercent / 100))
    : product.price

  return (
    <div className="border rounded-2xl p-4 shadow-md relative bg-white">
      {product.promo && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Акция
        </span>
      )}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-xl mb-2"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.description}</p>

      {hasDiscount ? (
        <p className="text-sm text-gray-500 line-through">{product.price}₽</p>
      ) : null}
      <p className="text-xl font-bold">{discountedPrice}₽</p>

      <button
        onClick={() => addToCart(product)}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition"
      >
        Добавить в заказ
      </button>
    </div>
  )
}
