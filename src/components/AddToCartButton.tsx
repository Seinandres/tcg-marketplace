"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

// 👇 IMPORTANTE: 'export function' para que coincida con las llaves { } del import
export function AddToCartButton({ card }: { card: any }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    addToCart({
      id: card.id,
      name: card.name,
      price: card.price,
      image: card.image,
    });
    
    // Feedback visual (cambia de color un ratito)
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdded}
      className={`w-full px-4 py-2 rounded-lg font-bold transition-all transform active:scale-95 ${
        isAdded
          ? "bg-green-600 text-white shadow-inner"
          : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 hover:border-purple-500"
      }`}
    >
      {isAdded ? "✅ Agregado" : "+ Carro"}
    </button>
  );
}