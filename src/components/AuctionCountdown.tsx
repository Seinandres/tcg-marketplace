'use client';

import { useEffect, useState } from 'react';

interface CountdownProps {
  endDate: Date;
  onExpire?: () => void;
}

export default function AuctionCountdown({ endDate, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        onExpire?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeLeft.expired) {
    return (
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
          <p className="text-sm font-black text-red-400 uppercase tracking-wider animate-pulse">
            ⏰ Subasta Finalizada
          </p>
        </div>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Días', color: 'text-blue-400' },
    { value: timeLeft.hours, label: 'Hrs', color: 'text-purple-400' },
    { value: timeLeft.minutes, label: 'Min', color: 'text-pink-400' },
    { value: timeLeft.seconds, label: 'Seg', color: 'text-red-400' }
  ];

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 1;

  return (
    <div className="grid grid-cols-4 gap-2">
      {timeUnits.map((unit, i) => (
        <div 
          key={i} 
          className={`bg-black/40 border rounded-xl p-2 text-center transition-all ${
            isUrgent ? 'border-red-500/30 animate-pulse' : 'border-white/5'
          }`}
        >
          <p className={`text-xl font-mono font-black leading-none mb-1 ${unit.color} ${
            isUrgent && i >= 2 ? 'animate-pulse' : ''
          }`}>
            {String(unit.value).padStart(2, '0')}
          </p>
          <p className="text-[7px] text-slate-500 uppercase font-black tracking-wider">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}