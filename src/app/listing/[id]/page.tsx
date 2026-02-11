"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) {
          router.push('/404');
          return;
        }
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      fetchListing();
    }
  }, [params.id, router]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white text-xl font-bold animate-pulse">Cargando Activo...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white text-xl font-bold">Activo no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        <div className="mb-12 flex items-center gap-4 animate-in fade-in slide-in-from-left duration-500">
           <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
             Mercado Global
           </Link>
           <span className="text-slate-700 text-xs">/</span>
           <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
             {listing.card.name}
           </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-5 space-y-8 animate-in zoom-in duration-700">
             <div className="relative aspect-[3/4] bg-slate-900 rounded-[40px] border border-white/10 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] group">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/50 animate-[scan-vertical_3s_linear_infinite] z-20"></div>
                
                <Image 
                  src={listing.card.image || listing.card.imageUrlSmall || "/placeholder-card.png"} 
                  alt={listing.card.name}
                  fill
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                />
             </div>

             <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Set / Expansión</p>
                      <p className="text-sm font-bold text-white uppercase">{listing.card.set || "N/A"}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Número de Serie</p>
                      <p className="text-sm font-mono text-cyan-400">#{listing.card.number || "000"}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Rareza detectada</p>
                      <p className="text-sm font-bold text-purple-400 uppercase">{listing.card.rarity || "COMMON"}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Universo</p>
                      <p className="text-sm font-bold text-white uppercase">{listing.card.game}</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-right duration-700">
             
             <div>
                <div className="flex items-center gap-3 mb-4">
                   <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      Venta Directa
                   </span>
                   <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      Estado: {listing.condition}
                   </span>
                </div>
                <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-4">
                   {listing.card.name}
                </h1>
                <div className="flex items-baseline gap-4">
                   <span className="text-5xl font-black text-cyan-400 font-mono tracking-tighter">
                      {formatMoney(listing.price)}
                   </span>
                   <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">PVP Sugerido</span>
                </div>
             </div>

             <div className="bg-gradient-to-r from-slate-900 to-transparent border-l-4 border-purple-500 p-8 rounded-r-3xl">
                <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.3em] mb-6">Información del Operador</p>
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-3xl font-black text-purple-500 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
                      {listing.user?.name?.charAt(0) || "?"}
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black uppercase italic text-white leading-none">
                         {listing.user?.name || "Mercader Anónimo"}
                      </h3>
                      <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                         LVL {listing.user?.heroLevel || 1} // {listing.user?.heroTitle || "Novato"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                         <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                               <span key={i} className={`text-[10px] ${i <= 4 ? 'text-yellow-500' : 'text-slate-700'}`}>★</span>
                            ))}
                         </div>
                         <span className="text-[9px] font-mono text-slate-500 uppercase">Reputación: {listing.user?.reputation || 100}%</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <button className="relative group overflow-hidden bg-white text-black py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] active:scale-95">
                   <span className="relative z-10">Adquirir Activo 🛒</span>
                   <div className="absolute inset-0 bg-cyan-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                </button>
                <button className="bg-slate-900 border border-white/10 text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-slate-800 transition-all active:scale-95">
                   Hacer Oferta 🛡️
                </button>
             </div>

             <div className="flex items-center gap-4 pt-6 text-slate-500 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-lg">🛡️</div>
                <p className="text-[10px] font-medium leading-relaxed uppercase tracking-wider">
                   Transacción protegida por el <span className="text-white">Protocolo Seina</span>. 
                   Liberación de fondos tras confirmación de entrega.
                </p>
             </div>

          </div>
        </div>

      </main>

      <style jsx global>{`
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
      `}</style>
    </div>
  );
}