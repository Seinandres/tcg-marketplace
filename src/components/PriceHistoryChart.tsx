'use client';

interface Bid {
  amount: number;
  createdAt: Date;
}

interface PriceHistoryChartProps {
  bids: Bid[];
  startingPrice: number;
}

export default function PriceHistoryChart({ bids, startingPrice }: PriceHistoryChartProps) {
  const allPrices = [startingPrice, ...bids.map(b => b.amount)];
  const maxPrice = Math.max(...allPrices);
  const minPrice = Math.min(...allPrices);
  const priceRange = maxPrice - minPrice;

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">📊 Historial de Precio</p>
        <span className="text-[7px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
          +{((maxPrice - startingPrice) / startingPrice * 100).toFixed(1)}%
        </span>
      </div>

      {/* Simple Line Chart */}
      <div className="relative h-32 bg-black/20 rounded-xl p-4 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div 
              key={percent}
              className="absolute w-full border-t border-white/20"
              style={{ top: `${percent}%` }}
            />
          ))}
        </div>

        {/* Price line */}
        <svg className="w-full h-full" preserveAspectRatio="none">
          <polyline
            points={allPrices.map((price, i) => {
              const x = (i / (allPrices.length - 1)) * 100;
              const y = 100 - ((price - minPrice) / priceRange) * 100;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            className="drop-shadow-lg"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Current price indicator */}
        <div className="absolute bottom-4 right-4 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg px-2 py-1">
          <p className="text-[8px] text-purple-300 font-black">
            ${maxPrice.toLocaleString('es-CL')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-[7px] text-slate-500 uppercase font-bold mb-1">Inicial</p>
          <p className="text-xs font-black text-slate-300">${startingPrice.toLocaleString('es-CL')}</p>
        </div>
        <div className="text-center">
          <p className="text-[7px] text-slate-500 uppercase font-bold mb-1">Pujas</p>
          <p className="text-xs font-black text-purple-400">{bids.length}</p>
        </div>
        <div className="text-center">
          <p className="text-[7px] text-slate-500 uppercase font-bold mb-1">Actual</p>
          <p className="text-xs font-black text-green-400">${maxPrice.toLocaleString('es-CL')}</p>
        </div>
      </div>
    </div>
  );
}