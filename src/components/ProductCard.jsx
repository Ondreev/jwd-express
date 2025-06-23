export function ProductCard({ product, addToCart }) {
  const {
    name,
    image,
    description,
    promo,
    originalPrice,
    discountedPrice,
    discount
  } = product

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <div className="flex justify-between items-start mb-1">
        <h2 className="text-lg font-semibold leading-tight">{name}</h2>
        {promo && (
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">АКЦИЯ</span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-2">{description}</p>

      <div className="mb-3">
        {discount > 0 ? (
          <div className="space-x-2">
            <span className="text-sm line-through text-red-500">{originalPrice}₽</span>
            <span className="text-xl font-bold text-black">{discountedPrice}₽</span>
          </div>
        ) : (
          <span className="text-lg font-bold text-black">{originalPrice}₽</span>
        )}
      </div>

      <button
        onClick={() => addToCart(product)}
        className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition duration-200"
      >
        В корзину
      </button>
    </div>
  )
}
