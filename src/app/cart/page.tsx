'use client' // 👈 Necesario porque interactuamos con el usuario (borrar items)

import { useCart } from '../../context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeFromCart, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-3xl font-bold mb-2">Tu carro está vacío</h1>
        <p className="text-gray-400 mb-8">Parece que aún no has atrapado ninguna carta.</p>
        <Link href="/" className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Volver al Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <h1 className="text-4xl font-bold mb-8">Tu Carrito de Compras</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LISTA DE PRODUCTOS (Izquierda) */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            // Usamos index en la key por si agregas la misma carta 2 veces
            <div key={`${item.id}-${index}`} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors">
              
              {/* Foto pequeña */}
              <div className="relative w-20 h-28 bg-slate-800 rounded overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-contain" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-green-400 font-mono">${item.price.toFixed(2)} USD</p>
              </div>

              {/* Botón Eliminar */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-slate-800 rounded-lg transition-all"
                title="Eliminar del carro"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* RESUMEN DE PAGO (Derecha) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-4">Resumen</h2>
            
            <div className="flex justify-between mb-2 text-gray-400">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-400">
              <span>Envío</span>
              <span className="text-green-400">Gratis</span>
            </div>
            
            <div className="flex justify-between text-2xl font-bold mb-6 pt-4 border-t border-slate-800">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-green-900/20">
              Pagar Ahora 💳
            </button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              Transacción segura protegida por Blockchain
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}