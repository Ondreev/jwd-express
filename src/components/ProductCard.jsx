import { useState } from 'react'

export function ProductCard({ product, addToCart, removeFromCart, getQuantity }) {
  const quantity = getQuantity(product.id)

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-md flex flex-col justify-between">
      <img src={product.image} alt={product.name} className="rounded-xl mb-2" />
      <h2 className="text-lg font-bold text-white">{product.name}</h2>
      <p className="text-sm text-gray-400">{product.description}</p>

      <div className="mt-2 text-white font-semibold">
        {product.discountedPrice && product.discountedPrice !== product.originalPrice ? (
          <>
            <span className="line-through text-red-400 mr-2">{product.originalPrice}₽</span>
            <span className="text-green-400">{product.discountedPrice}₽</span>
          </>
        ) : (
          <span>{product.originalPrice}₽</span>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        {quantity > 0 ? (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => removeFromCart(product.id)}
              className="bg-red-500 hover:bg-red-400 px-2 py-1 rounded"
            >-</button>
            <span className="font-bold">{quantity}</span>
            <button
              onClick={() => addToCart(product)}
              className="bg-green-500 hover:bg-green-400 px-2 py-1 rounded"
            >+</button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded font-semibold w-full"
          >
            В корзину
          </button>
        )}
      </div>
    </div>
  )
}

