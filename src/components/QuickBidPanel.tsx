'use client';

import { useState } from 'react';
import XPMiniNotification from './XPMiniNotification';
import confetti from 'canvas-confetti';

interface QuickBidPanelProps {
  currentPrice: number;
  minIncrement: number;
  listingId: string;
  onBidPlaced?: () => void;
}

export default function QuickBidPanel({ currentPrice, minIncrement, listingId, onBidPlaced }: QuickBidPanelProps) {
  const [customBid, setCustomBid] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);
  const [maxAutoBid, setMaxAutoBid] = useState('');
  const [xpNotification, setXpNotification] = useState<number | null>(null);

  const quickIncrements = [1000, 5000, 10000, 25000];

  const placeBid = async (amount: number) => {
    setLoading(true);
    try {
      const response = await fetch('/api/bids/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          amount
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText || 'Error al pujar');
        return;
      }

      const data = await response.json();

      // 🎮 Mostrar notificación XP
      if (data.xpGained) {
        setXpNotification(data.xpGained);
      }

      // 🎉 Confetti mini
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#06b6d4']
      });

      // Recargar datos
      if (onBidPlaced) onBidPlaced();
      
    } catch (error) {
      console.error('Error al pujar:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBid = async (increment: number) => {
    const newBid = currentPrice + increment;
    await placeBid(newBid);
  };

  const handleCustomBid = async () => {
    const bidAmount = parseInt(customBid);
    if (isNaN(bidAmount) || bidAmount <= currentPrice) {
      alert(`La puja debe ser mayor a $${currentPrice.toLocaleString('es-CL')}`);
      return;
    }
    await placeBid(bidAmount);
    setCustomBid('');
  };

  return (
    <>
      {/* Notificación XP */}
      {xpNotification && (
        <XPMiniNotification 
          xp={xpNotification} 
          onComplete={() => setXpNotification(null)} 
        />
      )}

      <div className="space-y-4">
        {/* Quick Bid Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">⚡ Puja Rápida</p>
            <span className="text-[7px] text-purple-400 font-bold">Min: +${minIncrement.toLocaleString('es-CL')}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {quickIncrements.map((increment) => (
              <button 
                key={increment}
                onClick={() => handleQuickBid(increment)}
                disabled={loading}
                className="bg-slate-800/50 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/50 rounded-xl py-3 text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +${(increment / 1000)}K
              </button>
            ))}
          </div>
        </div>

        {/* Custom Bid Input */}
        <div className="space-y-2">
          <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">💰 Puja Personalizada</p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">$</span>
              <input 
                type="number"
                value={customBid}
                onChange={(e) => setCustomBid(e.target.value)}
                placeholder={`Min: ${(currentPrice + minIncrement).toLocaleString('es-CL')}`}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-3 text-sm font-mono font-bold text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>
            <button 
              onClick={handleCustomBid}
              disabled={loading || !customBid}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-[9px] tracking-wider px-4 rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Pujar'}
            </button>
          </div>
        </div>

        {/* Auto-Bid System (eBay style) */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                autoBidEnabled ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
              }`} onClick={() => setAutoBidEnabled(!autoBidEnabled)}>
                {autoBidEnabled && <span className="text-white text-xs">✓</span>}
              </div>
              <p className="text-[9px] text-blue-400 uppercase font-black tracking-wider">🤖 Auto-Puja</p>
            </div>
            <span className="text-[7px] text-slate-500 font-bold italic">Próximamente</span>
          </div>
          
          {autoBidEnabled && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-[7px] text-slate-400 leading-relaxed">
                El sistema pujará automáticamente por ti hasta tu límite máximo
              </p>
              <input 
                type="number"
                value={maxAutoBid}
                onChange={(e) => setMaxAutoBid(e.target.value)}
                placeholder="Máximo que quieres pagar"
                className="w-full bg-black/40 border border-blue-500/30 rounded-lg py-2 px-3 text-xs font-mono font-bold text-blue-300 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none"
              />
              <button 
                disabled
                className="w-full bg-blue-600/20 border border-blue-500/30 text-blue-400/50 font-black uppercase text-[8px] tracking-wider py-2 rounded-lg transition-all cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>
          )}
        </div>

        {/* Main CTA */}
        <button 
          disabled={loading}
          onClick={() => handleQuickBid(minIncrement)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-xs tracking-widest py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>⚔️</span>
          <span>{loading ? 'Procesando...' : 'Hacer Puja Ahora'}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </button>
      </div>
    </>
  );
}