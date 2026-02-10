'use client';

interface XPRewardPreviewProps {
  currentPrice: number;
  isWinner?: boolean;
}

export default function XPRewardPreview({ currentPrice, isWinner = false }: XPRewardPreviewProps) {
  const bidXP = Math.floor(currentPrice / 1000);
  const winXP = Math.floor(currentPrice / 500);
  const totalPotentialXP = bidXP + (isWinner ? winXP : 0);

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl p-4 space-y-3 hover:border-purple-500/40 transition-colors group">
      <div className="flex items-center justify-between">
        <p className="text-[8px] text-purple-400 uppercase font-black tracking-widest flex items-center gap-2">
          <span className="text-sm">⚡</span> Recompensas XP
        </p>
        <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-xs">🎮</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Por Pujar */}
        <div className="bg-black/20 border border-purple-500/10 rounded-lg p-3 space-y-1">
          <p className="text-[7px] text-slate-400 uppercase font-black tracking-wider">Por Pujar</p>
          <p className="text-lg font-black text-purple-400">+{bidXP}</p>
          <p className="text-[6px] text-purple-300/60 uppercase font-bold">XP Instant</p>
        </div>

        {/* Por Ganar */}
        <div className="bg-black/20 border border-yellow-500/10 rounded-lg p-3 space-y-1">
          <p className="text-[7px] text-slate-400 uppercase font-black tracking-wider">Si Ganas</p>
          <p className="text-lg font-black text-yellow-400">+{winXP}</p>
          <p className="text-[6px] text-yellow-300/60 uppercase font-bold">XP Bonus</p>
        </div>
      </div>

      {/* Total Potencial */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3 flex items-center justify-between">
        <div>
          <p className="text-[7px] text-slate-400 uppercase font-black tracking-wider mb-1">Total Potencial</p>
          <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            +{totalPotentialXP} XP
          </p>
        </div>
        <div className="text-right">
          <div className="bg-purple-500/20 rounded-full px-3 py-1">
            <p className="text-[8px] text-purple-300 font-black">
              ≈ {Math.floor(totalPotentialXP / 100)} lvls
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[7px] text-slate-500 uppercase font-bold">Progreso Siguiente Nivel</p>
          <p className="text-[7px] text-purple-400 font-black">750 / 1000 XP</p>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '75%' }} />
        </div>
      </div>
    </div>
  );
}