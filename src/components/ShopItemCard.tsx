"use client";

import { useState } from "react";

interface ShopItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    type: string;
    rarity: string;
    image: string;
    price: number;
    effects: string;
  };
  userCoins: number;
  isOwned: boolean;
  onPurchase: (itemId: string) => Promise<void>;
}

export default function ShopItemCard({ item, userCoins, isOwned, onPurchase }: ShopItemCardProps) {
  const [loading, setLoading] = useState(false);

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY": return "from-yellow-500 via-orange-500 to-red-500";
      case "RARE": return "from-purple-500 via-pink-500 to-purple-600";
      case "COMMON": return "from-blue-500 via-cyan-500 to-blue-600";
      default: return "from-slate-500 to-slate-600";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY": return "border-yellow-500/50 shadow-yellow-500/20";
      case "RARE": return "border-purple-500/50 shadow-purple-500/20";
      case "COMMON": return "border-blue-500/50 shadow-blue-500/20";
      default: return "border-slate-500/50 shadow-slate-500/20";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'WEAPON': '⚔️ Arma',
      'SHIELD': '🛡️ Escudo',
      'POTION': '🧪 Poción',
      'RUNE': '📿 Runa',
      'MOUNT': '🐥 Montura',
      'ARTIFACT': '👑 Artefacto',
      'SKIN': '✨ Skin'
    };
    return labels[type] || type;
  };

  const canAfford = userCoins >= item.price;

  const handlePurchase = async () => {
    if (loading || isOwned || !canAfford) return;
    
    setLoading(true);
    try {
      await onPurchase(item.id);
    } finally {
      setLoading(false);
    }
  };

  const effects = JSON.parse(item.effects || '{}');
  const isPermanent = effects.permanent === true;

  return (
    <div className={`relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-md border-2 ${getRarityBorder(item.rarity)} rounded-3xl overflow-hidden group hover:scale-105 transition-all duration-500 shadow-2xl`}>
      
      {/* Efecto de brillo animado */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${getRarityGradient(item.rarity)} opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 animate-pulse`} />
      
      {/* Efecto de partículas para legendarios */}
      {item.rarity === 'LEGENDARY' && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        </div>
      )}

      {/* Badge de rareza flotante */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r ${getRarityGradient(item.rarity)} text-white shadow-2xl backdrop-blur-sm border border-white/20`}>
          {item.rarity === 'LEGENDARY' && '🌟 '}
          {item.rarity}
        </div>
      </div>

      {/* Badge de permanente */}
      {isPermanent && (
        <div className="absolute top-4 left-4 z-20">
          <div className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl backdrop-blur-sm border border-white/20 animate-pulse">
            ♾️ Permanente
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 p-6">
        
        {/* Icono del item con efecto 3D */}
        <div className="relative mb-6 perspective-1000">
          <div className={`w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br ${getRarityGradient(item.rarity)} p-1 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center relative overflow-hidden">
              <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">{item.image}</span>
              {item.rarity === 'LEGENDARY' && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 animate-pulse" />
              )}
            </div>
          </div>
          
          {/* Badge de adquirido */}
          {isOwned && (
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-900 animate-bounce">
              <span className="text-lg">✓</span>
            </div>
          )}
        </div>

        {/* Info del item */}
        <div className="space-y-4">
          
          {/* Nombre */}
          <div>
            <h3 className={`text-xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r ${getRarityGradient(item.rarity)} mb-2 leading-tight tracking-tight`}>
              {item.name}
            </h3>
            
            {/* Tipo */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-slate-800/80 border border-white/20 rounded-lg text-[10px] font-bold text-slate-300 backdrop-blur-sm">
                {getTypeLabel(item.type)}
              </span>
            </div>

            {/* Descripción */}
            <p className="text-xs text-slate-400 leading-relaxed min-h-[60px]">
              {item.description}
            </p>
          </div>

          {/* Stats visuales */}
          {item.rarity === 'LEGENDARY' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
              <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <span>⚡</span> Poder Legendario
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-900/50 rounded-lg p-2 text-center">
                  <p className="text-xs font-black text-yellow-400">★★★★★</p>
                  <p className="text-[8px] text-slate-500 uppercase">Rareza</p>
                </div>
                <div className="flex-1 bg-slate-900/50 rounded-lg p-2 text-center">
                  <p className="text-xs font-black text-orange-400">MAX</p>
                  <p className="text-[8px] text-slate-500 uppercase">Potencia</p>
                </div>
              </div>
            </div>
          )}

          {/* Precio y botón */}
          <div className="pt-4 border-t border-white/10 flex items-end justify-between gap-4">
            
            {/* Precio */}
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1.5 tracking-wider">Precio</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getRarityGradient(item.rarity)}`}>
                  {item.price.toLocaleString()}
                </span>
                <span className="text-xl animate-bounce" style={{ animationDuration: '2s' }}>🪙</span>
              </div>
            </div>

            {/* Botón de compra */}
            <button
              onClick={handlePurchase}
              disabled={loading || isOwned || !canAfford}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wider transition-all relative overflow-hidden ${
                isOwned
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default shadow-xl'
                  : !canAfford
                  ? 'bg-slate-800/50 text-slate-600 border-2 border-slate-700/30 cursor-not-allowed'
                  : `bg-gradient-to-r ${getRarityGradient(item.rarity)} hover:scale-110 active:scale-95 text-white shadow-2xl border-2 border-white/20`
              }`}
            >
              {!isOwned && !loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>...</span>
                  </>
                ) : isOwned ? (
                  <>
                    <span>✓</span>
                    <span>Adquirido</span>
                  </>
                ) : !canAfford ? (
                  <>
                    <span>🔒</span>
                    <span>Bloqueado</span>
                  </>
                ) : (
                  <>
                    <span>💰</span>
                    <span>Comprar</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Advertencia de fondos */}
          {!canAfford && !isOwned && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 animate-pulse">
              <p className="text-[10px] text-red-400 text-center font-bold">
                ⚠️ Te faltan <span className="text-red-300 font-black">{(item.price - userCoins).toLocaleString()}</span> monedas
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Borde brillante animado para legendarios */}
      {item.rarity === 'LEGENDARY' && (
        <div className="absolute inset-0 rounded-3xl">
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${getRarityGradient(item.rarity)} opacity-20 blur-sm animate-pulse`} />
        </div>
      )}
    </div>
  );
}