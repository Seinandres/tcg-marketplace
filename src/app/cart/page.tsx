// @ts-nocheck
"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      clearCart();
      window.location.href = "/checkout/success"; 
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center text-5xl mb-8 border border-slate-800 shadow-2xl">🛒</div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Tu carro está vacío</h1>
        <p className="text-gray-500 max-w-xs mb-10">La bodega digital no tiene productos asignados actualmente.</p>
        <Link href="/" className="bg-white text-black font-black py-4 px-10 rounded-2xl uppercase text-sm hover:scale-105 transition-transform">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-12">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div key={item.uniqueId} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] flex flex-col sm:flex-row items-center gap-8 group">
                <div className="relative w-24 h-32 shrink-0 shadow-2xl">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-black uppercase italic">{item.name}</h3>
                  <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">ID: {item.id}</p>
                </div>
                <div className="text-center sm:text-right space-y-2">
                  <p className="text-3xl font-black">${item.price.toLocaleString("es-CL")} <span className="text-xs text-gray-500">CLP</span></p>
                  <button onClick={() => removeFromCart(item.uniqueId || item.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">Eliminar</button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] sticky top-32 shadow-2xl">
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Resumen de Pago</h2>
              <div className="space-y-4 mb-10 border-b border-slate-800 pb-8 font-bold text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>${total.toLocaleString("es-CL")}</span></div>
                <div className="flex justify-between text-green-400"><span>Envío Chile</span><span>GRATIS</span></div>
              </div>
              <div className="flex justify-between items-baseline mb-10">
                <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Total Final</span>
                <span className="text-5xl font-black italic tracking-tighter">${total.toLocaleString("es-CL")}</span>
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-6 rounded-2xl uppercase tracking-tighter text-lg shadow-xl shadow-purple-900/20 disabled:opacity-50 transition-all"
              >
                {isCheckingOut ? "Procesando..." : "💳 Pagar Ahora"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}