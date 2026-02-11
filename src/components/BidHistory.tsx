"use client";

import { useEffect, useState } from "react";

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  user: {
    name?: string;
    image?: string;
  };
}

interface BidHistoryProps {
  initialBids: Bid[];
  listingId?: string;
}

export default function BidHistory({ initialBids, listingId }: BidHistoryProps) {
  const [bids, setBids] = useState<Bid[]>(initialBids || []);

  // Polling para actualizar pujas cada 5 segundos
  useEffect(() => {
    if (!listingId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/listings/${listingId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.bids) {
            setBids(data.bids);
          }
        }
      } catch (error) {
        console.error('Error actualizando pujas:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [listingId]);

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace unos segundos';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours} h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `hace ${diffInDays} días`;
  };

  if (!bids || bids.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-full flex items-center justify-center opacity-50">
          <span className="text-2xl">⚔️</span>
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          Sé el primero en desafiar...
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-2 space-y-2">
      {bids.map((bid, index) => (
        <div 
          key={bid.id} 
          className={`flex items-center justify-between bg-black/20 p-3 rounded-lg border transition-all hover:bg-black/30 ${
            index === 0 
              ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' 
              : 'border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Avatar del Usuario */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white uppercase border overflow-hidden ${
              index === 0
                ? 'bg-gradient-to-tr from-purple-500 to-pink-500 border-purple-400/50 shadow-lg shadow-purple-500/30'
                : 'bg-gradient-to-tr from-slate-600 to-slate-500 border-white/20'
            }`}>
              {bid.user?.image ? (
                <img src={bid.user.image} alt={bid.user.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span>{bid.user?.name?.substring(0, 2) || "AN"}</span>
              )}
            </div>
            
            {/* Nombre y Tiempo */}
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-slate-200 leading-tight">
                  {bid.user?.name || "Guerrero Anónimo"}
                </p>
                {index === 0 && (
                  <span className="text-[7px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-purple-500/30">
                    Líder
                  </span>
                )}
              </div>
              <p className="text-[7px] text-slate-500 font-mono">
                {getTimeAgo(bid.createdAt)}
              </p>
            </div>
          </div>

          {/* Monto de la Puja */}
          <div className="text-right">
            <p className={`text-sm font-mono font-black ${
              index === 0 ? 'text-purple-400' : 'text-green-400'
            }`}>
              ${bid.amount.toLocaleString('es-CL')}
            </p>
            <div className="flex items-center justify-end gap-1">
               <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                 index === 0 ? 'bg-purple-500' : 'bg-green-500'
               }`}></span>
               <span className={`text-[6px] font-bold uppercase tracking-wider ${
                 index === 0 ? 'text-purple-400' : 'text-green-500/80'
               }`}>
                 {index === 0 ? 'Mejor' : 'Oferta'}
               </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}