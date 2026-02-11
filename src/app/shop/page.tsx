"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ShopItemCard from "@/components/ShopItemCard";
import confetti from "canvas-confetti";

export default function ShopPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [userCoins, setUserCoins] = useState(0);
  const [userItems, setUserItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    try {
      const response = await fetch('/api/shop/items');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
        setUserCoins(data.userCoins);
        setUserItems(data.userItems);
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (itemId: string) => {
    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      const data = await response.json();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706']
      });

      setUserCoins(data.remainingCoins);
      setUserItems(prev => [...prev, itemId]);

      alert(`¡${data.item.name} adquirido con éxito! 🎉`);

    } catch (error) {
      console.error('Error purchasing:', error);
      alert('Error al comprar el item');
    }
  };

  const filteredItems = items.filter(item => 
    filter === "ALL" || item.type === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-t-4 border-yellow-500 rounded-full animate-spin" />
          <p className="text-yellow-400 font-mono text-sm animate-pulse">Cargando Arsenal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20 relative overflow-hidden">
      
      {/* Fondo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-yellow-900/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                  EL ARSENAL
                </span>
              </h1>
              <p className="text-slate-400 text-sm font-bold">
                Mejora tu poder con items legendarios
              </p>
            </div>

            {/* Balance */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-[10px] text-yellow-400 uppercase font-bold mb-1">Tus Monedas</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-yellow-400">{userCoins}</span>
                <span className="text-2xl">🪙</span>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'WEAPON', 'SHIELD', 'BUFF', 'SKIN'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  filter === f
                    ? 'bg-yellow-500 text-black shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/10'
                }`}
              >
                {f === 'ALL' ? 'Todos' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                userCoins={userCoins}
                isOwned={userItems.includes(item.id)}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No hay items en esta categoría</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-black uppercase mb-2">¿Necesitas más monedas?</h3>
          <p className="text-slate-400 mb-6">Vende cartas y puja en subastas para ganar monedas</p>
          <button
            onClick={() => router.push('/sell')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-sm tracking-wider px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-all"
          >
            Ir a Vender
          </button>
        </div>
      </div>
    </div>
  );
}