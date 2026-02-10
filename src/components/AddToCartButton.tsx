// @ts-nocheck
"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartButton({ item }: { item: any }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Feedback visual por 2 segundos
  };

  return (
    <button
      onClick={handleClick}
      disabled={added}
      className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
        added 
        ? "bg-green-500 text-white cursor-default" 
        : "bg-white text-black hover:bg-purple-500 hover:text-white shadow-lg"
      }`}
    >
      {added ? "¡Agregado!" : "+ Carro"}
    </button>
  );
}