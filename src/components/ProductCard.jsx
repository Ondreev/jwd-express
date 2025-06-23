export function ProductCard({ product, addToCart }) {
  const {
    name,
    image,
    description,
    promo,
    originalPrice,
    discountedPrice
  } = product

  const hasDiscount =
    typeof originalPrice === 'number' &&
    typeof discountedPrice === 'number' &&
    discountedPrice < originalPrice

  return (
    <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300 relative">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover rounded mb-3"
        />
        {promo && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            АКЦИЯ
          </span>
        )}
      </div>

      <div className="flex justify-between items-start mb-1">
        <h2 className="text-lg font-semibold leading-tight">{name}</h2>
      </div>

      <p className="text-sm text-gray-600 mb-2">{description}</p>

      <div className="mb-3">
        {hasDiscount ? (
          <div className="flex flex-col">
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
