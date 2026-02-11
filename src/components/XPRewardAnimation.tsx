"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface XPRewardAnimationProps {
  xpGained: number;
  coinsGained: number;
  leveledUp?: boolean;
  newLevel?: number;
  newRank?: { title: string; icon: string; color: string };
  onComplete?: () => void;
}

export default function XPRewardAnimation({
  xpGained,
  coinsGained,
  leveledUp,
  newLevel,
  newRank,
  onComplete
}: XPRewardAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Confetti si subió de nivel
    if (leveledUp) {
      const duration = 3000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#ec4899', '#fbbf24']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#ec4899', '#fbbf24']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

    // Auto-cerrar después de 5 segundos
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [leveledUp, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative max-w-md w-full mx-4">
        
        {/* Efectos de fondo */}
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
        
        <div className="relative bg-slate-900 border-2 border-purple-500 rounded-3xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 animate-bounce">
              <span className="text-4xl">⚡</span>
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">
              {leveledUp ? "¡NIVEL SUBIDO!" : "¡RECOMPENSA!"}
            </h2>
            <p className="text-xs text-purple-400 font-mono uppercase tracking-widest">
              MISIÓN COMPLETADA
            </p>
          </div>

          {/* Recompensas */}
          <div className="space-y-4 mb-6">
            {/* XP */}
            <div className="bg-black/40 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Experiencia</p>
                  <p className="text-xl font-black text-purple-400">+{xpGained} XP</p>
                </div>
              </div>
              <div className="text-2xl animate-pulse">✨</div>
            </div>

            {/* Monedas */}
            {coinsGained > 0 && (
              <div className="bg-black/40 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Monedas</p>
                    <p className="text-xl font-black text-yellow-400">+{coinsGained}</p>
                  </div>
                </div>
                <div className="text-2xl animate-pulse">🪙</div>
              </div>
            )}

            {/* Nivel nuevo */}
            {leveledUp && newRank && (
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-xl p-4 animate-in zoom-in duration-500">
                <p className="text-center text-[10px] text-purple-400 uppercase font-bold mb-2">
                  Nuevo Rango Desbloqueado
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{newRank.icon}</span>
                  <div>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      {newRank.title}
                    </p>
                    <p className="text-sm text-white font-bold">Nivel {newLevel}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={() => {
              setVisible(false);
              if (onComplete) onComplete();
            }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-sm tracking-wider rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            ¡Continuar Aventura!
          </button>
        </div>
      </div>
    </div>
  );
}