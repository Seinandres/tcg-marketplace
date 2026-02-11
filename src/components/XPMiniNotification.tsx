"use client";

import { useEffect, useState } from "react";

interface XPMiniNotificationProps {
  xp: number;
  onComplete?: () => void;
}

export default function XPMiniNotification({ xp, onComplete }: XPMiniNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-24 right-6 z-[9999] animate-in slide-in-from-right-full fade-in duration-300">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-purple-500/50 flex items-center gap-3 border border-white/20">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-2xl">⚡</span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">Puja Registrada</p>
          <p className="text-lg font-black">+{xp} XP</p>
        </div>
      </div>
    </div>
  );
}