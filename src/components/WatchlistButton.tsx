'use client';

import { useState } from 'react';

interface WatchlistButtonProps {
  listingId: string;
  initialWatching?: boolean;
}

export default function WatchlistButton({ listingId, initialWatching = false }: WatchlistButtonProps) {
  const [isWatching, setIsWatching] = useState(initialWatching);
  const [loading, setLoading] = useState(false);

  const toggleWatch = async () => {
    setLoading(true);
    try {
      // API call here
      setIsWatching(!isWatching);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWatch}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase text-[9px] tracking-wider transition-all hover:scale-105 active:scale-95 ${
        isWatching 
          ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30' 
          : 'bg-slate-800/50 border border-white/10 text-slate-400 hover:border-yellow-500/50 hover:text-yellow-400'
      }`}
    >
      <span className={isWatching ? 'animate-pulse' : ''}>{isWatching ? '⭐' : '☆'}</span>
      <span>{isWatching ? 'Siguiendo' : 'Seguir'}</span>
    </button>
  );
}