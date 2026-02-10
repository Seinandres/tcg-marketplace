// @ts-nocheck
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  id: string;
  price: number;
  card: {
    name: string;
    imageUrlSmall: string;
    set: {
      name: string;
    };
  };
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 1. Cargar del LocalStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("seina_cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error al cargar carrito", e);
      }
    }
  }, []);

  // 2. Guardar en LocalStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("seina_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    // Evitar duplicados
    if (!cart.some((i) => i.id === item.id)) {
      // ⚠️ AQUÍ ESTÁ LA CLAVE: Aseguramos que el item tenga la estructura correcta
      if (item.card && item.card.imageUrlSmall) {
          setCart((prev) => [...prev, item]);
      } else {
          console.error("Intento de agregar item incompleto al carro:", item);
      }
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("seina_cart");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};