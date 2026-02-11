"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface InventoryProps {
  listings: any[];
}

// --- SUB-COMPONENTE: CARTA HOLOGRÁFICA 3D ---
const HoloCard = ({ item }: { item: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  // Detectar rareza para el color del borde/brillo
  const getRarityColor = (rarity: string = "") => {
    const r = rarity.toLowerCase();
    if (r.includes("common")) return "border-slate-600 shadow-slate-500/20";
    if (r.includes("uncommon")) return "border-green-500 shadow-green-500/40";
    if (r.includes("rare")) return "border-cyan-400 shadow-cyan-400/50";
    if (r.includes("mythic") || r.includes("illustration") || r.includes("special")) return "border-purple-500 shadow-purple-500/60";
    if (r.includes("hyper") || r.includes("gold") || r.includes("secret")) return "border-yellow-400 shadow-yellow-400/60";
    return "border-slate-700"; // Default
  };

  const rarityClass = getRarityColor(item.card?.rarity);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    // Intensidad del giro
    const rotateX = (y - centerY) / 8; 
    const rotateY = (centerX - x) / 8;

    setRotate({ x: rotateX, y: rotateY });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setOpacity(0);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  return (
    <div 
      className="perspective-1000 relative h-[420px] w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className={`relative h-full w-full bg-slate-900 rounded-[20px] border-2 p-3 transition-transform duration-100 ease-out overflow-hidden ${rarityClass} hover:z-50`}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transformStyle: 'preserve-3d',
          boxShadow: opacity > 0 ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : ''
        }}
      >
        {/* BRILLO HOLOGRÁFICO */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay transition-opacity duration-300 rounded-[18px]"
          style={{
            opacity: opacity,
            background: `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 0.2) 50%, transparent 54%)`,
            transform: 'translateZ(1px)'
          }}
        />

        {/* CONTENIDO DE LA CARTA */}
        <div className="flex flex-col h-full relative z-10 bg-slate-950/50 backdrop-blur-sm rounded-xl">
            
            {/* Header: Estado */}
            <div className="flex justify-between items-center p-2 mb-2">
                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded border ${
                    item.status === 'SOLD' 
                    ? 'bg-green-500/20 border-green-500 text-green-400' 
                    : 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                }`}>
                    {item.status === 'SOLD' ? 'VENDIDO' : 'ACTIVO'}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">#{item.card?.number}</span>
            </div>

            {/* Imagen */}
            <div className="relative flex-1 w-full mb-2 group-hover:scale-105 transition-transform duration-500" style={{ transform: 'translateZ(20px)' }}>
                {item.card?.image ? (
                    <Image src={item.card.image} alt={item.card.name} fill className="object-contain drop-shadow-xl" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-700">🃏</div>
                )}
            </div>

            {/* Footer: Datos */}
            <div className="p-3 border-t border-white/5 bg-black/40 rounded-b-xl" style={{ transform: 'translateZ(10px)' }}>
                <h3 className="text-white font-bold text-sm truncate mb-1" title={item.card?.name}>{item.card?.name || "Desconocido"}</h3>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Precio</p>
                        <p className="text-lg font-black text-white">{formatMoney(item.price)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">{item.card?.set}</p>
                        <span className="text-[9px] px-2 py-0.5 bg-white/10 rounded text-slate-300 font-bold uppercase">{item.card?.rarity?.slice(0,10)}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default function InventoryRPG({ listings = [] }: InventoryProps) {
  const [filter, setFilter] = useState("ALL"); 
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);

  // Lógica de Filtrado
  const filteredListings = listings.filter((item) => {
    const matchesGame = filter === "ALL" || item.card?.game === filter;
    const matchesSearch = item.card?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesGame && matchesSearch;
  });

  // CÁLCULO DE PATRIMONIO DINÁMICO
  const totalValue = filteredListings.reduce((acc, item) => acc + item.price, 0);
  const activeValue = filteredListings.filter(i => i.status === 'ACTIVE').reduce((acc, item) => acc + item.price, 0);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  if (!mounted) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-mono animate-pulse">DESENCRIPTANDO BÓVEDA...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-500/30 pb-20 overflow-x-hidden">
      
      {/* Fondo Matrix */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-white/10 pb-6 animate-in slide-in-from-top-4 duration-700">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">SISTEMA DE GESTIÓN DE ACTIVOS</h4>
            </div>
            <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter">
              BÓVEDA PERSONAL
            </h1>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0">
             <Link href="/dashboard" className="px-6 py-3 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all text-slate-400 hover:text-white">
                ← Volver al Mando
             </Link>
             <Link href="/sell" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[10px] font-black text-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105">
                + Ingresar Activo
             </Link>
          </div>
        </div>

        {/* WIDGET DE CONTROL Y ANALÍTICA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 sticky top-4 z-40">
           
           {/* BARRA DE FILTROS Y BÚSQUEDA */}
           <div className="lg:col-span-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-2xl">
               <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800 w-full md:w-auto">
                  {['ALL', 'Pokemon', 'Magic'].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyan-600 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                      {f === 'ALL' ? 'Todos' : f}
                    </button>
                  ))}
               </div>
               <div className="relative w-full md:w-80 group">
                  <input type="text" placeholder="LOCALIZAR ACTIVO..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-cyan-400 placeholder-slate-700 focus:outline-none focus:border-cyan-500 transition-all uppercase" />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500">🔍</div>
               </div>
           </div>

           {/* ANALÍTICA EN TIEMPO REAL (Patrimonio) */}
           <div className="lg:col-span-4 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-full bg-cyan-500/10 skew-x-[-20deg] translate-x-10"></div>
               <div>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Valor Filtrado</p>
                   <h3 className="text-3xl font-black text-white tracking-tighter">{formatMoney(totalValue)}</h3>
               </div>
               <div className="text-right z-10">
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Cartas</p>
                   <h3 className="text-3xl font-black text-cyan-400 tracking-tighter">{filteredListings.length}</h3>
               </div>
           </div>
        </div>

        {/* GRID DE ACTIVOS HOLOGRÁFICOS */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 perspective-2000">
            {filteredListings.map((item, index) => (
              <div key={item.id} className="animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                 <HoloCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          /* ESTADO VACÍO (LORE) */
          <div className="w-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 animate-in fade-in">
             <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl mb-6 grayscale opacity-50">📦</div>
             <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest mb-2">Bóveda Vacía</h2>
             <p className="text-slate-600 text-xs font-mono max-w-md text-center mb-8">No se detectan activos con los parámetros actuales.</p>
             <Link href="/sell" className="px-8 py-4 bg-slate-800 hover:bg-cyan-600 hover:text-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">Iniciar Adquisición</Link>
          </div>
        )}

      </div>
    </div>
  );
}