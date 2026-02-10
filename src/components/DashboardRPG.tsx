// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/* 🎨 MOTOR GRÁFICO SVG "PIXEL FORGE" (VERSIÓN DASHBOARD - NO BORRAR)         */
/* -------------------------------------------------------------------------- */

const PixelHeroMini = ({ color = "#eab308" }) => {
  const C = {
    outline: "#020617", skin: "#ffedd5", gold: "#fbbf24",
    steel: "#94a3b8", steelDark: "#1e293b",
  };
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-lg" shapeRendering="crispEdges">
       {/* Aura suave */}
       <g className="animate-pulse" style={{ animationDuration: '3s' }}>
          <circle cx="16" cy="15" r="14" fill={color} opacity={0.15} filter="blur(6px)" />
       </g>
       {/* Cuerpo Simplificado para Preview */}
       <g>
          <path d="M8 14 L5 28 L27 28 L24 14 Z" fill={color} />
          <rect x="5" y="27" width="22" height="1" fill={C.gold} />
          <rect x="12" y="24" width="3" height="6" fill={C.steelDark} />
          <rect x="17" y="24" width="3" height="6" fill={C.steelDark} />
          <rect x="11" y="14" width="10" height="10" fill={C.steel} />
          <rect x="15" y="21" width="2" height="5" fill={color} stroke={C.gold} strokeWidth="0.5" />
       </g>
       <g transform="translate(0, -2)">
          <rect x="12" y="8" width="8" height="7" fill={C.skin} />
          <rect x="11" y="5" width="10" height="4" fill={C.gold} />
          <rect x="12" y="6" width="8" height="2" fill="#fff" opacity="0.5" />
       </g>
       <g>
          <rect x="5" y="8" width="4" height="18" fill={C.steel} />
          <rect x="3" y="26" width="8" height="2" fill={C.gold} />
       </g>
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/* 📦 COMPONENTE: GESTIÓN DE BODEGA (INVENTARIO)                              */
/* -------------------------------------------------------------------------- */

const InventoryTable = ({ listings }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Simulación de filtro (en producción usarías la DB)
    const filteredListings = listings.filter(l => 
        l.card?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out] shadow-2xl">
            {/* Header de la Tabla con Herramientas */}
            <div className="p-5 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400 flex items-center justify-center w-10 h-10">
                        <span className="text-xl">📦</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Bóveda de Cartas</h3>
                        <p className="text-[10px] text-slate-400">Gestionando {listings.length} ítems</p>
                    </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre..." 
                            className="w-full bg-black/50 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl text-slate-300 transition-colors flex items-center justify-center">
                        <span className="text-xs">🌪️</span>
                    </button>
                </div>
            </div>
            
            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/50 text-slate-500 uppercase font-black tracking-wider border-b border-white/5">
                        <tr>
                            <th className="px-5 py-4">Carta</th>
                            <th className="px-5 py-4">Set / Edición</th>
                            <th className="px-5 py-4">Estado</th>
                            <th className="px-5 py-4 text-right">Precio</th>
                            <th className="px-5 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredListings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                        <span className="text-3xl">📭</span>
                                        <p className="italic">No se encontraron cartas en la bóveda.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredListings.map((item) => (
                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-5 py-4 font-bold text-white">
                                        <div className="flex items-center gap-3">
                                            {/* Placeholder visual de carta */}
                                            <div className="w-8 h-10 bg-slate-800 rounded border border-slate-600 flex-shrink-0 flex items-center justify-center text-[10px] shadow-sm group-hover:scale-110 transition-transform">
                                                🃏
                                            </div>
                                            <span className="group-hover:text-blue-400 transition-colors cursor-pointer">
                                                {item.card?.name || "Carta Desconocida"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-400 font-mono text-[10px]">
                                        {item.card?.set?.name || "Set Base"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                                            item.status === 'ACTIVE' 
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                            : 'bg-slate-700 text-slate-400'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
                                            {item.status === 'ACTIVE' ? 'En Venta' : 'Vendido'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <span className="font-mono text-yellow-400 font-bold text-sm">
                                            ${item.price.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors" title="Editar">
                                                ✏️
                                            </button>
                                            <button className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors" title="Eliminar">
                                                🗑️
                                            </button>
                                            <button className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                                                ⋯
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer de Paginación */}
            <div className="p-4 border-t border-white/5 bg-black/20 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">Mostrando {filteredListings.length} resultados</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-800 rounded text-[10px] text-slate-400 hover:text-white disabled:opacity-50" disabled>Anterior</button>
                    <button className="px-3 py-1 bg-slate-800 rounded text-[10px] text-slate-400 hover:text-white">Siguiente</button>
                </div>
            </div>
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/* 🧩 COMPONENTES UI DASHBOARD                                                */
/* -------------------------------------------------------------------------- */

const ProgressBar = ({ current, max, color, label, icon }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
        <span className="flex items-center gap-1.5"><span className="opacity-70">{icon}</span> {label}</span>
        <span className="font-mono">{current}/{max}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
        <div 
          className="h-full transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
        >
            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
};

const QuestItem = ({ type, title, rewardXP, rewardGold, progress, target, isCompleted }) => (
  <div className={`group relative p-3.5 rounded-xl border transition-all duration-300 ${isCompleted ? 'bg-green-900/10 border-green-500/30' : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}>
    <div className="flex justify-between items-start mb-2.5">
      <div className="flex items-center gap-2.5">
        <div className={`w-1.5 h-1.5 rounded-full ${type === 'Daily' ? 'bg-blue-400' : 'bg-purple-400'} shadow-[0_0_8px_currentColor]`} />
        <span className={`text-[10px] font-bold ${isCompleted ? 'text-green-300 line-through opacity-70' : 'text-slate-200'}`}>{title}</span>
      </div>
      <div className="flex gap-1">
        <span className="text-[8px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded font-mono font-bold">+{rewardGold}G</span>
        <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono font-bold">+{rewardXP}XP</span>
      </div>
    </div>
    
    <div className="relative h-1 w-full bg-slate-950 rounded-full overflow-hidden">
        <div 
            className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-slate-600 group-hover:bg-slate-500'}`} 
            style={{ width: `${(progress/target)*100}%` }} 
        />
    </div>
    
    {isCompleted && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
             <span className="text-green-500 text-xs animate-bounce">✅</span>
        </div>
    )}
  </div>
);

const MarketAlert = ({ type, text, trend }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-inner ${type === 'hot' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
            {type === 'hot' ? '🔥' : '📈'}
        </div>
        <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-300 leading-tight group-hover:text-white transition-colors">{text}</p>
            <p className={`text-[9px] font-mono font-bold mt-1 flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% <span className="text-slate-500 font-sans font-normal">Demanda</span>
            </p>
        </div>
    </div>
);

/* -------------------------------------------------------------------------- */
/* 🏰 DASHBOARD RPG (COMPONENTE PRINCIPAL)                                    */
/* -------------------------------------------------------------------------- */

export default function DashboardRPG({ listings = [], sales = [], totalActiveValue = 0, totalSoldValue = 0 }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [view, setView] = useState('hq'); // 'hq' (Centro de Mando) | 'inventory' (Bodega)
  
  // Calcular nivel basado en ventas (Gamification real con tus datos)
  const xp = Math.min(3500, Math.floor(totalSoldValue / 10)); 
  const level = Math.floor(xp / 500) + 1;
  const nextLevelXp = level * 500;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 pb-20 overflow-hidden">
      
      {/* BACKGROUND FX (Grid sutil) */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 opacity-[0.03]" 
            style={{ 
                backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }} 
         />
         <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-900/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-white/5 gap-6">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.3)] text-3xl border border-white/20">
                    🏰
                </div>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-sm">CENTRO DE MANDO</h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                        ESTADO: <span className="text-green-400 animate-pulse">ONLINE</span>
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="bg-slate-900/80 border border-white/10 px-5 py-3 rounded-2xl flex flex-col items-end min-w-[140px] shadow-lg">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Tesorería (Ventas)</span>
                    <span className="text-xl font-mono font-bold text-yellow-400 drop-shadow-sm">${totalSoldValue.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/80 border border-white/10 px-5 py-3 rounded-2xl flex flex-col items-end min-w-[140px] shadow-lg">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">Valor en Bodega</span>
                    <span className="text-xl font-mono font-bold text-blue-400 drop-shadow-sm">${totalActiveValue.toLocaleString()}</span>
                </div>
            </div>
        </header>

        {/* NAVEGACIÓN (TABS) */}
        <div className="flex gap-4 mb-8">
            <button 
                onClick={() => setView('hq')}
                className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${view === 'hq' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'}`}
            >
                🗺️ Mapa General
            </button>
            <button 
                onClick={() => setView('inventory')}
                className={`px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${view === 'inventory' ? 'bg-slate-700 text-white shadow-lg scale-105 border border-white/20' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'}`}
            >
                📦 Gestión de Bodega
            </button>
        </div>

        {/* === VISTA: CENTRO DE MANDO (HQ) === */}
        {view === 'hq' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-[fadeIn_0.5s_ease-out]">
                
                {/* 1. COLUMNA IZQUIERDA: TU AVATAR */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-900/60 border border-white/10 rounded-[2rem] p-6 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
                        
                        <div className="text-center mb-6 relative">
                            <div className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[9px] font-black text-yellow-400 uppercase tracking-widest mb-4">
                                Comerciante Épico
                            </div>
                            {/* MINI HÉROE */}
                            <div className="w-32 h-32 mx-auto relative filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110">
                                <PixelHeroMini color="#eab308" />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-black text-white italic tracking-tight">NIVEL {level}</span>
                                <span className="text-[10px] text-slate-400 font-mono font-bold">{xp} / {nextLevelXp} XP</span>
                            </div>
                            <ProgressBar current={xp} max={nextLevelXp} color="#3b82f6" label="Progreso" icon="✨" />
                            <ProgressBar current={85} max={100} color="#22c55e" label="Energía" icon="⚡" />
                        </div>
                        
                        {/* BOTÓN MÁGICO: ENLACE A LA PÁGINA DE EDICIÓN */}
                        <Link href="/dashboard/hero" className="mt-8 block group/btn">
                            <div className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-xl flex items-center justify-center gap-2 transition-all">
                                <span className="text-[10px] font-black text-slate-300 group-hover/btn:text-white uppercase tracking-widest">⚙️ Personalizar Avatar</span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* 2. COLUMNA CENTRAL: MISIONES */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-slate-900/60 border border-white/10 rounded-[2rem] p-6 min-h-[400px] shadow-2xl relative overflow-hidden">
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black italic text-white flex items-center gap-2">
                                <span className="text-2xl">📜</span> MISIONES ACTIVAS
                            </h2>
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                <button onClick={() => setActiveTab('daily')} className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === 'daily' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Diarias</button>
                                <button onClick={() => setActiveTab('weekly')} className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${activeTab === 'weekly' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Semanales</button>
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                            {/* Ejemplo de Quest completada y pendientes */}
                            <QuestItem type="Daily" title="Publica 3 cartas nuevas" rewardXP={50} rewardGold={100} progress={listings.length % 3} target={3} isCompleted={listings.length >= 3} />
                            <QuestItem type="Daily" title="Ventas Totales" rewardXP={100} rewardGold={50} progress={totalSoldValue} target={50000} isCompleted={totalSoldValue >= 50000} />
                            {/* Quest falsa para rellenar */}
                            <QuestItem type="Daily" title="Comparte tu perfil" rewardXP={20} rewardGold={5} progress={0} target={1} isCompleted={false} />
                        </div>
                    </div>
                </div>

                {/* 3. COLUMNA DERECHA: OPORTUNIDADES */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-slate-900/60 border border-white/10 rounded-[2rem] p-6 shadow-2xl">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-5 flex items-center gap-2">
                            <span className="text-lg">🎯</span> Oportunidades
                        </h3>
                        <div className="space-y-3">
                            <MarketAlert type="hot" text="Alta demanda: One Piece" trend={25} />
                            <MarketAlert type="opportunity" text="Escasez: Charizard VMAX" trend={12} />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* === VISTA: BODEGA (INVENTARIO) === */}
        {view === 'inventory' && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
                <InventoryTable listings={listings} />
            </div>
        )}

      </div>
      
      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}