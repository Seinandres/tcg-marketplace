// @ts-nocheck
"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calcular total
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    // Simulamos proceso de pago
    setTimeout(() => {
      clearCart();
      // Usamos window.location para forzar la redirección segura
      window.location.href = "/checkout/success"; 
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2">Tu carro está vacío</h1>
          <p className="text-gray-400 mb-6">Parece que no has atrapado ningún Pokémon todavía.</p>
          <Link 
            href="/" 
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        Tu Carrito <span className="text-sm bg-purple-600 px-3 py-1 rounded-full">{cart.length} ítems</span>
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTA DE ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.uniqueId || item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-purple-500/50 transition-colors">
              
              <div className="relative w-20 h-28 bg-slate-800 rounded-lg overflow-hidden shrink-0">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm">Cantidad: 1</p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-green-400 mb-2">
                  ${item.price.toLocaleString("es-CL")}
                </p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm text-red-400 hover:text-red-300 underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMEN DE PAGO */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl sticky top-4 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 border-b border-slate-800 pb-4">Resumen de Orden</h2>
            
            <div className="space-y-2 mb-6 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-green-400">Gratis</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-black text-white mb-6 pt-4 border-t border-slate-800">
              <span>Total</span>
              <span>${total.toLocaleString("es-CL")}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Procesando..." : "💳 Pagar Ahora"}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Pagos seguros vía Webpay / Stripe
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}