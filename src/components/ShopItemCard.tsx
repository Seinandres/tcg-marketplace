"use client";

import Image from "next/image";

export default function ShopItemCard({ item, userCoins, isOwned, onPurchase }: any) {
  const canAfford = userCoins >= item.price;

  const styleConfig: any = {
    LEGENDARY: "border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.3)] bg-yellow-950/20",
    EPIC: "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)] bg-purple-950/20",
    RARE: "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-blue-950/20",
    COMMON: "border-slate-600 bg-slate-900/40",
  };

  const style = styleConfig[item.rarity] || styleConfig.COMMON;

  return (
    <div className={`
      relative flex flex-col w-full max-w-[380px] mx-auto
      border-2 rounded-[2rem] p-5 transition-all duration-300
      hover:-translate-y-2 hover:shadow-2xl h-full
      ${style}
      ${isOwned ? 'opacity-70' : ''}
    `}>
      
      {/* Nivel y Tipo */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
          LVL {item.requiredLevel} • {item.type}
        </span>
        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase text-white ${style.split(' ')[0].replace('border', 'bg')}`}>
          {item.rarity}
        </span>
      </div>

      {/* Título - Ajustado para no cortarse */}
      <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-4 line-clamp-1">
        {item.name}
      </h3>

      {/* Imagen - Tamaño controlado */}
      <div className="relative w-full aspect-video bg-black/40 rounded-2xl border border-white/5 mb-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
        <div className="relative w-24 h-24 md:w-28 md:h-28 z-10">
          <Image 
            src={item.image} 
            alt={item.name} 
            fill 
            className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform" 
          />
        </div>
      </div>

      {/* Lore - Compacto y Legible */}
      <div className="bg-white/5 rounded-xl p-3 mb-4 border-l-4 border-white/20">
        <p className="text-[11px] text-slate-300 italic leading-snug line-clamp-2">
          "{item.lore}"
        </p>
      </div>

      {/* Beneficios - Grid Compacto */}
      <div className="flex flex-wrap gap-1.5 mb-6 min-h-[50px]">
        {item.benefits?.split('.').map((b: string, i: number) => b.trim() && (
          <span key={i} className="text-[9px] font-bold bg-white/5 border border-white/10 px-2 py-1 rounded-md text-slate-400">
            ⚡ {b.trim()}
          </span>
        ))}
      </div>

      {/* Footer - Compra */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-500 uppercase font-black">Costo</span>
          <div className="flex items-center gap-1 font-black text-lg text-white">
            {item.price.toLocaleString()} <span className="text-yellow-500 text-sm">🪙</span>
          </div>
        </div>

        {isOwned ? (
          <button disabled className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/40 rounded-xl text-[10px] font-black uppercase">
            ✓ En Bodega
          </button>
        ) : (
          <button 
            onClick={() => onPurchase(item.id)}
            disabled={!canAfford}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all
              ${canAfford ? 'bg-white text-black hover:bg-yellow-400' : 'bg-slate-800 text-slate-600 opacity-50'}
            `}
          >
            {canAfford ? 'ADQUIRIR' : 'BLOQUEADO'}
          </button>
        )}
      </div>
    </div>
  );
}