"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface DashboardProps {
  totalActiveValue: number;
  totalSoldValue: number;
  activeCount: number;
  salesCount: number;
  // Cambiamos recentSales por recentActivity para recibir TODO
  recentActivity: any[]; 
}

// FRASES DE LA IA "CORTEX" (LORE)
const AI_PHRASES = [
  "Analizando fluctuaciones del mercado TCG...",
  "Oportunidad detectada en el sector de subastas.",
  "Sistemas de seguridad de bóveda: ACTIVOS.",
  "Recuerda: El valor es subjetivo, la victoria es absoluta.",
  "Escaneando red en busca de compradores potenciales...",
  "Tu reputación precede a tus ventas, Operador.",
  "Los precios de Charizard están inestables hoy.",
  "Sincronizando con la Blockchain de Seina...",
  "Se detecta un aumento en la demanda de cartas selladas."
];

export default function DashboardRPG({ 
  totalActiveValue = 0, 
  totalSoldValue = 0, 
  activeCount = 0, 
  salesCount = 0,
  recentActivity = [] 
}: DashboardProps) {
  
  const { data: session, status } = useSession();
  
  // Estados RPG
  const [xp, setXp] = useState(250);
  const [maxXp, setMaxXp] = useState(1000);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [lootBoxState, setLootBoxState] = useState<'idle' | 'shaking' | 'opening' | 'opened'>('idle');
  const [mounted, setMounted] = useState(false);

  // Estados de la IA (CORTEX)
  const [aiText, setAiText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Efecto de montaje y Loop de la IA
  useEffect(() => {
    setMounted(true);
    const aiInterval = setInterval(() => { changeAiThought(); }, 8000);
    changeAiThought();
    return () => clearInterval(aiInterval);
  }, []);

  const changeAiThought = () => {
    setIsTyping(true);
    const phrase = AI_PHRASES[Math.floor(Math.random() * AI_PHRASES.length)];
    let i = 0;
    setAiText("");
    const typing = setInterval(() => {
      setAiText((prev) => prev + phrase.charAt(i));
      i++;
      if (i > phrase.length - 1) {
        clearInterval(typing);
        setIsTyping(false);
      }
    }, 30);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  // MECÁNICA DE LOOT BOX (Regresamos a la CAJA TÁCTICA 📦)
  const openLootBox = () => {
    if (dailyClaimed || lootBoxState !== 'idle') return;
    setLootBoxState('shaking');
    
    setTimeout(() => {
      setLootBoxState('opened');
      setDailyClaimed(true);
      setXp(prev => prev + 150);

      const duration = 3000;
      const end = Date.now() + duration;
      (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#00ffff', '#ff00ff', '#ffff00'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#00ffff', '#ff00ff', '#ffff00'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    }, 1000);
  };

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-24 h-24 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-mono text-xs animate-pulse tracking-[0.3em]">CORTEX SYSTEM: BOOTING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 relative">
      
      {/* CAPA 1: CRT OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(circle,transparent_60%,#000_100%)] opacity-40"></div>

      {/* CAPA 2: FONDO VIVO */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]"></div>
         <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        
        {/* === HEADER TÁCTICO === */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-8">
          
          {/* PERFIL & NIVEL */}
          <div className="flex items-center gap-6 bg-slate-900/40 backdrop-blur-md p-4 pr-8 rounded-r-full border-l-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)] w-full xl:w-auto animate-in slide-in-from-left duration-700">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-white/10 p-1">
                <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                   {session?.user?.image ? (
                     <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-slate-800 text-2xl">👾</div>
                   )}
                   <div className="absolute inset-0 bg-cyan-500/20 animate-[scan-vertical_2s_linear_infinite]"></div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-black border border-cyan-500 text-[9px] font-black text-cyan-400 px-2 rounded-full">LVL 1</div>
            </div>
            
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white glitch-text" data-text={session?.user?.name}>
                  {session?.user?.name || "OPERADOR"}
                </h1>
                <span className="text-[9px] text-slate-500 font-mono">ID: {Math.floor(Math.random()*9999)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                 <div className="w-32 h-2 bg-slate-800 rounded-sm overflow-hidden relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30"></div>
                    <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 shadow-[0_0_10px_cyan]" style={{ width: `${(xp/maxXp)*100}%` }}></div>
                 </div>
                 <span className="text-[9px] text-cyan-500 font-mono">{xp} XP</span>
              </div>
            </div>
          </div>

          {/* === CORTEX AI MODULE === */}
          <div className="flex-1 w-full max-w-2xl bg-black/40 border border-white/5 rounded-lg p-3 flex items-center gap-4 relative overflow-hidden group">
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-50"></div>
             <div className="w-10 h-10 rounded bg-purple-900/20 border border-purple-500/50 flex items-center justify-center shrink-0 relative">
               <div className="absolute inset-0 bg-purple-500/20 animate-ping rounded"></div>
               <span className="text-xl relative z-10">🧠</span>
             </div>
             <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-[8px] font-black text-purple-400 tracking-[0.2em] uppercase">CORTEX_AI // SYSTEM_LOG</span>
                 <span className="text-[8px] text-slate-600 font-mono animate-pulse">{isTyping ? 'RECEIVING DATA...' : 'STANDBY'}</span>
               </div>
               <p className="text-xs md:text-sm text-purple-100 font-mono truncate leading-none pb-1">
                 {">"} {aiText}<span className="animate-blink">_</span>
               </p>
             </div>
          </div>

          {/* Botón Acción */}
          <Link href="/sell" className="group relative px-6 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] skew-x-[-10deg] hover:skew-x-0 w-full md:w-auto text-center">
             <span className="block skew-x-[10deg] group-hover:skew-x-0 transition-transform">Desplegar Venta</span>
          </Link>
        </div>

        {/* === GRID BENTO PRINCIPAL === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* 1. BÓVEDA FINANCIERA */}
          <div className="lg:col-span-8 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-5"></div>
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                   <div className="flex items-center gap-2 mb-2 opacity-70">
                     <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_cyan]"></span>
                     <h3 className="text-[10px] font-bold text-cyan-300 uppercase tracking-[0.2em]">Valoración en Tiempo Real</h3>
                   </div>
                   <div className="flex items-baseline gap-4">
                     <h2 className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                       {formatMoney(totalActiveValue)}
                     </h2>
                     <span className="text-green-400 text-xs font-bold bg-green-900/30 px-2 py-1 rounded border border-green-500/30">▲ 2.4%</span>
                   </div>
                </div>

                <div className="mt-8 flex items-end gap-1 h-32 w-full mask-image-gradient-b">
                   {Array.from({ length: 20 }).map((_, i) => (
                     <div key={i} className="flex-1 relative group/bar h-full flex items-end">
                       <div 
                         className="w-full bg-cyan-500/20 border-t border-cyan-400 rounded-sm transition-all duration-[2000ms] ease-in-out hover:bg-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                         style={{ height: `${Math.floor(Math.random() * (90 - 20 + 1) + 20)}%` }}
                       ></div>
                     </div>
                   ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                   <div className="flex gap-4 text-slate-400">
                     <span><b className="text-white">{activeCount}</b> ACTIVOS</span>
                     <span><b className="text-white">{salesCount}</b> TRANSACCIONES</span>
                   </div>
                   <Link href="/inventory" className="text-cyan-400 font-bold hover:text-white transition-colors uppercase tracking-wider text-[10px]">
                     Entrar a Bóveda &rarr;
                   </Link>
                </div>
             </div>
          </div>

          {/* 2. LOOT BOX "HOLOGRÁFICA" (El regreso de la CAJA DE CARTÓN TÁCTICA) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-slate-900 to-purple-900/20 border border-white/10 rounded-3xl p-1 relative overflow-hidden flex flex-col shadow-2xl group">
            {!dailyClaimed && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent w-[200%] h-[200%] animate-[spin_4s_linear_infinite] opacity-50"></div>}
            
            <div className="relative w-full h-full bg-slate-950/90 rounded-[22px] p-6 flex flex-col items-center justify-center z-10">
               <div className="w-full flex justify-between items-center mb-8 border-b border-white/5 pb-2">
                 <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">SUMINISTRO DIARIO</span>
                 <span className="text-[9px] text-slate-600 font-mono">{dailyClaimed ? 'OFFLINE' : 'READY'}</span>
               </div>
               
               <div 
                 onClick={openLootBox}
                 className={`cursor-pointer transition-all duration-300 transform
                   ${lootBoxState === 'idle' ? 'hover:scale-105' : ''}
                   ${lootBoxState === 'shaking' ? 'animate-[shake_0.5s_ease-in-out_infinite]' : ''}
                   ${lootBoxState === 'opened' ? 'opacity-50 grayscale scale-95' : ''}
                 `}
               >
                 {/* AQUI ESTÁ EL CAMBIO: Volvimos a la Caja de Cartón 📦 */}
                 <div className="relative text-8xl filter drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                   {lootBoxState === 'opened' ? '🔓' : '📦'}
                   
                   {lootBoxState === 'idle' && (
                     <>
                      <div className="absolute -top-4 -right-4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse -z-10"></div>
                     </>
                   )}
                 </div>
               </div>

               <div className="mt-8">
                 {!dailyClaimed ? (
                   <button onClick={openLootBox} className="px-8 py-3 bg-purple-600/10 border border-purple-500 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                     {lootBoxState === 'shaking' ? 'DECODIFICANDO...' : 'INICIAR APERTURA'}
                   </button>
                 ) : (
                   <div className="text-center animate-in zoom-in">
                      <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">+150 XP</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase">Sincronización Completa</p>
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* 3. RADAR DE ACTIVIDAD (ARREGLADO PARA VER TUS VENTAS) */}
          <div className="lg:col-span-12 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-lg">
             <div className="p-3 border-b border-white/5 flex justify-between items-center bg-black/40 px-6">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                   <h3 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Radar de Actividad Local</h3>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500">
                   <span>SECTOR: 7G</span>
                   <span>LATENCIA: 12ms</span>
                </div>
             </div>

             <div className="relative p-4 min-h-[120px]">
               {recentActivity.length > 0 ? (
                 <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                   {recentActivity.map((item, idx) => (
                     <div key={idx} className={`min-w-[200px] bg-slate-800/50 border border-white/5 p-3 rounded-lg flex flex-col gap-1 transition-colors group ${item.type === 'SOLD' ? 'hover:border-green-500/50' : 'hover:border-cyan-500/50'}`}>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-white truncate max-w-[120px]">{item.card?.name || "Objeto Clasificado"}</span>
                          {/* ETIQUETA DINÁMICA: SOLD o BÓVEDA */}
                          <span className={`text-[8px] px-1 rounded border ${item.type === 'SOLD' ? 'text-green-400 bg-green-900/20 border-green-500/20' : 'text-cyan-400 bg-cyan-900/20 border-cyan-500/20'}`}>
                              {item.type === 'SOLD' ? 'SOLD' : 'BÓVEDA'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{new Date(item.updatedAt).toLocaleDateString()}</span>
                        <span className={`text-sm font-black text-white mt-1 ${item.type === 'SOLD' ? 'group-hover:text-green-400' : 'group-hover:text-cyan-400'}`}>
                            {formatMoney(item.price)}
                        </span>
                     </div>
                   ))}
                 </div>
               ) : (
                 // RADAR VACÍO ANIMADO
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-[scan-horizontal_3s_linear_infinite]"></div>
                    <p className="absolute text-[10px] text-green-500/50 font-mono tracking-widest bg-black px-2">BUSCANDO SEÑAL...</p>
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>

      {/* ESTILOS GLOBALES */}
      <style jsx global>{`
        @keyframes scan-vertical { 0% { top: -100%; opacity: 0; } 50% { opacity: 1; } 100% { top: 200%; opacity: 0; } }
        @keyframes scan-horizontal { 0% { width: 0%; opacity: 0; } 50% { width: 100%; opacity: 1; } 100% { width: 0%; opacity: 0; margin-left: 100%; } }
        @keyframes breathing-bar { 0% { height: 20%; } 100% { height: 100%; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        .glitch-text:hover { animation: shake 0.5s infinite; color: #00ffff; text-shadow: 2px 2px #ff00ff; }
      `}</style>
    </div>
  );
}