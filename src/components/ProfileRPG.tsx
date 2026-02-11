"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

// Tipos para TypeScript
interface UserProfile {
  name: string;
  image: string;
  heroLevel: number;
  heroXP: number;
  heroTitle: string;
  coins: number;
  reputation: number;
  listingsCount: number;
  salesCount: number;
}

export default function ProfileRPG({ profile }: { profile: UserProfile }) {
  // Calculamos XP para el siguiente nivel (Fórmula simple: Nivel * 1000)
  const nextLevelXP = profile.heroLevel * 1000;
  const progress = (profile.heroXP / nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-purple-500/30 pb-20">
      
      {/* Fondo Táctico */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* HEADER DE MANDO */}
        <div className="flex justify-between items-center mb-12 animate-in slide-in-from-top-4 duration-700">
           <div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-2">IDENTIDAD DEL OPERADOR</h4>
             <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter">
               CUARTEL GENERAL
             </h1>
           </div>
           <Link href="/dashboard" className="px-6 py-3 border border-white/10 hover:border-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-purple-500/10">
              Volver al Radar ➜
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA 1: TARJETA DE HÉROE (Stats) */}
          <div className="lg:col-span-4 space-y-6">
             
             {/* ID CARD */}
             <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col items-center text-center">
                   <div className="relative w-32 h-32 mb-6">
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500 border-dashed animate-[spin_10s_linear_infinite]"></div>
                      <div className="absolute inset-2 rounded-full overflow-hidden bg-black border border-white/20">
                         {profile.image ? (
                           <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-4xl">👾</div>
                         )}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs font-black px-2 py-1 rounded border border-black shadow-lg">
                        LVL {profile.heroLevel}
                      </div>
                   </div>

                   <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-1">{profile.name || "Sin Nombre"}</h2>
                   <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] bg-purple-900/20 px-3 py-1 rounded border border-purple-500/20 mb-6">
                     {profile.heroTitle}
                   </p>

                   {/* Barra XP */}
                   <div className="w-full mb-2 flex justify-between text-[9px] font-mono text-slate-400">
                      <span>EXP ACTUAL</span>
                      <span>{profile.heroXP} / {nextLevelXP}</span>
                   </div>
                   <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                      <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                   </div>
                </div>
             </div>

             {/* STATS DE COMBATE */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-center">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Reputación</p>
                   <p className="text-2xl font-black text-green-400">{profile.reputation}%</p>
                </div>
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-center">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Monedas</p>
                   <p className="text-2xl font-black text-yellow-400">{profile.coins}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-center">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Ventas</p>
                   <p className="text-xl font-black text-white">{profile.salesCount}</p>
                </div>
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-center">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">Activos</p>
                   <p className="text-xl font-black text-blue-400">{profile.listingsCount}</p>
                </div>
             </div>

          </div>

          {/* COLUMNA 2: LOADOUT & EQUIPAMIENTO */}
          <div className="lg:col-span-8">
             
             {/* SLOT ACTIVO (Loadout) */}
             <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-8 mb-8 relative">
                <div className="flex justify-between items-start mb-6">
                   <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Equipamiento Activo</h3>
                   <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded font-mono">STATUS: ONLINE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   
                   {/* ARMA PRINCIPAL (Slot Vacío por ahora) */}
                   <div className="aspect-square bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center group hover:border-purple-500/50 transition-colors cursor-pointer relative overflow-hidden">
                      <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-4xl mb-2 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">⚔️</span>
                      <p className="text-[9px] font-black uppercase text-slate-600 group-hover:text-purple-400 tracking-widest">Arma Principal</p>
                      <p className="text-[8px] text-slate-700 mt-1">Sin Equipar</p>
                   </div>

                   {/* ESCUDO (Slot Vacío) */}
                   <div className="aspect-square bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center group hover:border-blue-500/50 transition-colors cursor-pointer relative overflow-hidden">
                      <span className="text-4xl mb-2 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">🛡️</span>
                      <p className="text-[9px] font-black uppercase text-slate-600 group-hover:text-blue-400 tracking-widest">Módulo de Defensa</p>
                      <p className="text-[8px] text-slate-700 mt-1">Sin Equipar</p>
                   </div>

                   {/* ACCESORIO (Slot Vacío) */}
                   <div className="aspect-square bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center group hover:border-yellow-500/50 transition-colors cursor-pointer relative overflow-hidden">
                      <span className="text-4xl mb-2 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">⚡</span>
                      <p className="text-[9px] font-black uppercase text-slate-600 group-hover:text-yellow-400 tracking-widest">Chip de Sobrecarga</p>
                      <p className="text-[8px] text-slate-700 mt-1">Sin Equipar</p>
                   </div>

                </div>
             </div>

             {/* INVENTARIO (GRID) */}
             <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white mb-6">Inventario Desbloqueado</h3>
                
                <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/30">
                   <div className="text-4xl mb-4 grayscale opacity-30">🔒</div>
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Almacén Vacío</p>
                   <p className="text-xs text-slate-600 mt-2 max-w-md text-center">
                     Sube de nivel realizando ventas para desbloquear Cajas de Suministros y obtener equipamiento táctico.
                   </p>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}