export function ProductCard({ product, addToCart }) {
  const {
    name,
    image,
    description,
    price,
    discountedPrice,
    discount,
    promo
  } = product

  const hasDiscount = discount > 0 && discountedPrice < price

  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition duration-300 bg-white relative">
      {promo && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">АКЦИЯ</span>
      )}

      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <h3 className="text-lg font-semibold mb-1 truncate">{name}</h3>
      <p className="text-sm text-gray-500 mb-2 line-clamp-2 min-h-[2.5em]">{description}</p>

      {hasDiscount ? (
        <div className="mb-2">
          <div className="text-sm text-gray-400 line-through">{price}₽</div>
          <div className="text-xl font-bold text-red-600">{discountedPrice}₽</div>
        </div>
      ) : (
        <div className="text-lg font-bold mb-2">{price}₽</div>
      )}

      <button
        onClick={() => addToCart(product)}
        className="bg-black text-white px-4 py-2 rounded-xl w-full hover:bg-gray-800 transition"
      >
        В корзину
      </button>
    </div>
  )
}
