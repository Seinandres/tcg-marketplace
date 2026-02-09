"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definimos cómo se ve un ítem del carro
type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  uniqueId?: string; // Para diferenciar si compras la misma carta 2 veces
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cargar carro desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("tcg-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carro en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("tcg-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    // Agregamos un ID único temporal para listas
    const newItem = { ...item, uniqueId: crypto.randomUUID() };
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId && item.uniqueId !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}