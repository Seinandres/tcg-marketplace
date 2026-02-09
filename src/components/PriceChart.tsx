// @ts-nocheck
"use client";

import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function PriceChart({ currentPrice }) {
  const data = [
    { date: '01 Feb', price: currentPrice * 0.85 },
    { date: '02 Feb', price: currentPrice * 0.92 },
    { date: '03 Feb', price: currentPrice * 1.05 },
    { date: '04 Feb', price: currentPrice * 0.98 },
    { date: '05 Feb', price: currentPrice * 1.10 },
    { date: '06 Feb', price: currentPrice * 1.02 },
    { date: 'Hoy', price: currentPrice },
  ];

  return (
    <div className="w-full h-[350px] bg-slate-900/40 p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white text-lg font-black uppercase tracking-tighter italic">Análisis de Mercado</h3>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Variación últimos 7 días</p>
        </div>
        <div className="text-right">
          <span className="text-green-400 text-xs font-black bg-green-900/20 px-2 py-1 rounded">+12.5%</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
            itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
            cursor={{ stroke: '#a855f7', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#a855f7" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}