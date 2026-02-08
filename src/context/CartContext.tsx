'use client' // 👈 Importante: Esto se ejecuta en el navegador del usuario

import { createContext, useContext, useState, ReactNode } from 'react'

// Definimos qué forma tiene un item del carrito
type CartItem = {
  id: string
  name: string
  price: number
  image: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => [...prev, newItem])
    // Un pequeño "alert" visual para saber que funcionó
    alert(`¡Agregaste a ${newItem.name} al carro! 🛒`)
  }

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Calculamos el total de dinero sumando los precios
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

// Un "Hook" para usar el carrito fácil en cualquier lado
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider')
  return context
}