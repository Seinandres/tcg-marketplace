'use client'

import { useCart } from "../context/CartContext"

interface Props {
  card: {
    id: string
    name: string
    price: number
    image: string
  }
}

export default function AddToCartButton({ card }: Props) {
  const { addToCart } = useCart()

  return (
    <button 
      onClick={() => addToCart(card)}
      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-5 px-8 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-lg hover:-translate-y-1 active:scale-95"
    >
      Añadir al Carro 🛒
    </button>
  )
}