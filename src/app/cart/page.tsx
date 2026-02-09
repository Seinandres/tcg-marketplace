// @ts-nocheck
"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { processCheckout } from "@/lib/actions";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    
    try {
      const result = await processCheckout(cart);
      
      if (result.success) {
        clearCart();
        window.location.href = "/checkout/success"; 
      } else {
        alert("Hubo un problema con la transacción. Verifica tu stock.");
        setIsCheckingOut(false);
      }
    } catch (err) {
      alert("Error crítico de conexión.");
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl font-black uppercase italic mb-8">Tu carro está vacío</h1>
        <Link href="/" className="bg-white text-black font-black py-4 px-10 rounded-2xl uppercase text-xs">Volver al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-black uppercase italic mb-12">Carrito de Compras</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div key={item.uniqueId} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[32px] flex items-center gap-8">
                <div className="relative w-20 h-28 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black uppercase italic">{item.name}</h3>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Oferta ID: {item.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">${item.price.toLocaleString("es-CL")}</p>
                  <button onClick={() => removeFromCart(item.uniqueId)} className="text-[10px] font-black uppercase text-red-500 mt-2">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-4">
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] sticky top-32 shadow-2xl">
              <div className="flex justify-between items-baseline mb-10">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total</span>
                <span className="text-5xl font-black italic tracking-tighter">${total.toLocaleString("es-CL")}</span>
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={isCheckingOut}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-6 rounded-2xl uppercase text-lg shadow-xl shadow-green-900/20 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isCheckingOut ? "Procesando Bodega..." : "💳 Confirmar Compra"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}