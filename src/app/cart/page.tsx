// @ts-nocheck
"use client";

import Link from "next/link";
import { useState } from "react";
import { processCheckout } from "@/lib/actions";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 👈 IMPORTANTE

export default function CartPage() {
  const router = useRouter(); // 👈 IMPORTANTE
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item?.price || 0), 0);

  const handleCheckout = async () => {
    setLoading(true);
    const listingIds = cart.filter(item => item?.id).map((item) => item.id);
    const res = await processCheckout(listingIds);

    if (res?.success) {
      clearCart();
      router.push("/success"); // 👈 REDIRECCIÓN A LA PÁGINA BONITA
    } else {
      alert(`Atención: ${res?.error || "Error desconocido"}.`);
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black italic uppercase mb-4 text-gray-700">Tu carro está vacío</h1>
        <Link href="/" className="bg-purple-600 px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-purple-500 transition-all">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  // ... (El resto del renderizado del carrito se mantiene igual que la versión blindada anterior) ...
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-gray-300">Carrito</h1>
        <button onClick={clearCart} className="text-xs font-bold text-red-500 hover:text-red-400 uppercase border border-red-900/50 px-4 py-2 rounded-lg hover:bg-red-900/20 transition-all">⚠️ Limpiar Carro</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            if (!item || !item.card) {
                return <div key={Math.random()} className="bg-red-900/10 p-4 rounded-xl text-red-500 text-xs font-bold">Item no disponible <button onClick={() => removeFromCart(item?.id)} className="underline ml-2">Eliminar</button></div>;
            }
            return (
                <div key={item.id} className="flex gap-6 bg-slate-900/50 border border-slate-800 p-4 rounded-3xl items-center group">
                  <div className="relative w-20 h-28 shrink-0"><Image src={item.card.imageUrlSmall || "/placeholder.png"} alt={item.card.name} fill className="object-contain" /></div>
                  <div className="flex-1"><h3 className="font-black uppercase italic text-lg">{item.card.name}</h3><p className="text-[10px] font-bold text-gray-500 uppercase">{item.card.set.name}</p></div>
                  <div className="text-right"><p className="text-xl font-black text-white italic">${item.price.toLocaleString('es-CL')}</p><button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-red-500 uppercase hover:text-red-400 mt-1">Quitar</button></div>
                </div>
            );
          })}
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] h-fit sticky top-24 shadow-2xl">
           <div className="flex justify-between items-end mb-8"><span className="text-xs font-bold uppercase text-gray-500">Total</span><span className="text-5xl font-black italic tracking-tighter text-white">${total.toLocaleString('es-CL')}</span></div>
           <button onClick={handleCheckout} disabled={loading || total === 0} className={`w-full py-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all ${loading ? 'bg-gray-700 cursor-wait' : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'}`}>{loading ? "Procesando..." : "Confirmar Compra"}</button>
           <p className="text-center mt-6 text-[10px] text-gray-500 uppercase font-bold">🔒 Pago Seguro vía Stripe</p>
        </div>
      </div>
    </div>
  );
}