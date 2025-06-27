import { useState } from 'react'

export function ProductCard({ product, addToCart, removeFromCart, getQuantity }) {
  const {
    id,
    name,
    image,
    description,
    promo,
    originalPrice
  } = product

  const hasPromo = promo === true || promo === 'TRUE';
  const discountedPrice = hasPromo
    ? Math.round(originalPrice * 0.8)
    : originalPrice;

  const hasDiscount = discountedPrice < originalPrice;
  const quantity = getQuantity(id);

  const formatPrice = (price) => price.toLocaleString('ru-RU') + '₽';

  return (
    <div className="fancy-block bg-gray-900 text-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 relative">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover rounded mb-3"
        />
        {hasPromo && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            АКЦИЯ
          </span>
        )}
      </div>

      <div className="flex justify-between items-start mb-1">
        <h2 className="text-lg font-semibold leading-tight text-white">{name}</h2>
      </div>

      <p className="text-sm text-gray-300 mb-2">{description}</p>

      <div className="mb-3">
        {hasDiscount ? (
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-yellow-300">{formatPrice(discountedPrice)}</span>
            <span className="text-sm line-through text-red-400">{formatPrice(originalPrice)}</span>
          </div>
        ) : (
          <span className="text-lg font-bold text-yellow-300">{formatPrice(originalPrice)}</span>
        )}
      </div>

      {quantity === 0 ? (
        <button
          onClick={() => addToCart({ ...product, price: discountedPrice, originalPrice })}
          className="w-full bg-yellow-500 text-black py-2 rounded-xl hover:bg-yellow-600 transition duration-200 font-bold"
        >
          В корзину
        </button>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => removeFromCart(id)}
            className="bg-yellow-300 text-black w-8 h-8 rounded-full font-bold text-xl hover:bg-yellow-400"
          >
            −
          </button>
          <span className="font-semibold text-lg text-white">{quantity}</span>
          <button
            onClick={() => addToCart({ ...product, price: discountedPrice, originalPrice })}
            className="bg-yellow-500 text-black w-8 h-8 rounded-full font-bold text-xl hover:bg-yellow-600"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
