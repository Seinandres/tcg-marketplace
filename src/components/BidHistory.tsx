// @ts-nocheck
"use client";

import { useState } from "react";
import { placeBid } from "@/lib/actions";

// Recibimos 'listingId' y 'initialBids' como props reales
export default function BidHistory({ listingId, currentPrice, initialBids = [] }: { listingId: string, currentPrice: number, initialBids?: any[] }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  // Calculamos la oferta mínima sugerida
  const minBid = currentPrice + 1000;

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("listingId", listingId);
    formData.append("amount", amount);

    const res = await placeBid(formData);
    
    if (res?.success) {
        setAmount(""); // Limpiar input
        // La página se recargará automáticamente por el revalidatePath del server action
    } else {
        alert(res?.error || "Error al ofertar");
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full max-h-[600px]">
      {/* CABECERA */}
      <div className="bg-slate-950 p-6 border-b border-slate-800">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-1">Oferta Actual</h3>
        <div className="flex justify-between items-end">
             <span className="text-4xl font-black italic text-white">${currentPrice.toLocaleString('es-CL')}</span>
             <span className="text-[10px] font-bold text-green-500 bg-green-900/20 px-2 py-1 rounded animate-pulse">● En Vivo</span>
        </div>
      </div>

      {/* LISTA DE PUJAS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {initialBids.length > 0 ? (
            initialBids.map((bid, index) => (
            <div 
                key={bid.id} 
                className={`flex items-center justify-between p-3 rounded-xl border ${
                    index === 0 
                    ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                    : "bg-slate-950/50 border-slate-800"
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase ${
                        index === 0 ? "bg-purple-500 text-white" : "bg-slate-800 text-gray-500"
                    }`}>
                        {bid.user?.username?.substring(0, 2) || "NN"}
                    </div>
                    <div>
                        <p className={`text-xs font-bold uppercase ${index === 0 ? "text-purple-300" : "text-gray-400"}`}>
                            {bid.user?.username || "Anónimo"}
                        </p>
                        <p className="text-[9px] text-gray-600">Hace un momento</p>
                    </div>
                </div>
                <p className={`text-sm font-black ${index === 0 ? "text-white" : "text-gray-500"}`}>
                    ${bid.amount.toLocaleString('es-CL')}
                </p>
            </div>
            ))
        ) : (
            <div className="text-center py-10 text-gray-600 text-xs italic">
                Aún no hay ofertas. ¡Sé el primero!
            </div>
        )}
      </div>

      {/* FORMULARIO DE OFERTA */}
      <form onSubmit={handleBid} className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="mb-3">
            <label className="text-[9px] font-bold uppercase text-gray-500 mb-1 block">Tu Oferta (Mínimo ${minBid.toLocaleString('es-CL')})</label>
            <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minBid}
                placeholder={`$${minBid}`}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white font-bold focus:border-purple-500 outline-none"
            />
        </div>
        <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-black uppercase py-4 rounded-xl text-xs tracking-widest transition-all shadow-lg ${
                loading ? "bg-gray-700 cursor-wait" : "bg-white text-black hover:bg-purple-500 hover:text-white"
            }`}
        >
            {loading ? "Procesando..." : "Ofertar Ahora"}
        </button>
      </form>
    </div>
  );
}