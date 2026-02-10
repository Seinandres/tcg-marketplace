// @ts-nocheck
"use client"; 

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { deleteListing } from "@/lib/actions"; 

// --- COMPONENTES AUXILIARES ---

const InfoTooltip = ({ text }: { text: string }) => (
    <div className="group relative ml-1 inline-flex items-center justify-center cursor-help z-50">
        <span className="text-gray-600 hover:text-yellow-400 text-[10px] font-bold px-1 transition-colors">ⓘ</span>
        <div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 w-56 bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl z-[100] pointer-events-none">
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
            <p className="text-[10px] leading-relaxed text-gray-300 font-medium text-left italic">{text}</p>
        </div>
    </div>
);

const DFKOracle = () => {
    const [prices, setPrices] = useState({ jewel: 0, crystal: 0 });
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=defi-kingdoms,defi-kingdoms-crystal&vs_currencies=usd');
                const data = await res.json();
                setPrices({ jewel: data['defi-kingdoms']?.usd || 0.11, crystal: data['defi-kingdoms-crystal']?.usd || 0.003 });
            } catch (e) { setPrices({ jewel: 0.11, crystal: 0.003 }); }
        };
        fetchPrices();
    }, []);

    return (
        <div className="flex gap-4 items-center bg-slate-900/50 border border-white/5 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3">
                <span className="text-lg">💎</span>
                <div className="flex flex-col leading-none">
                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Jewel</span>
                    <span className="text-sm font-mono font-bold text-white">${prices.jewel.toFixed(3)}</span>
                </div>
            </div>
            <div className="w-px h-6 bg-white/10"></div>
            <div className="flex items-center gap-3">
                <span className="text-lg">❄️</span>
                <div className="flex flex-col leading-none">
                    <span className="text-[8px] font-black text-cyan-300 uppercase tracking-widest">Crystal</span>
                    <span className="text-sm font-mono font-bold text-white">${prices.crystal.toFixed(3)}</span>
                </div>
            </div>
        </div>
    );
};

// 🛡️ HERO CARD BASE DEFINITIVA
const HeroStatsCard = ({ baseStats, bonusStats, rank, availablePoints, onUpgrade, level }: any) => {
    const [heroId, setHeroId] = useState("663903"); 
    const stats = { STR: baseStats.STR + bonusStats.STR, DEX: baseStats.DEX + bonusStats.DEX, INT: baseStats.INT + bonusStats.INT, VIT: baseStats.VIT + bonusStats.VIT };
    const getWidth = (val: number) => Math.min(100, Math.max(5, val));
    const totalPower = Object.values(stats).reduce((a, b) => a + b, 0);

    const statsLore = {
        STR: "Fuerza Bruta: Refleja tu dominio sobre las cartas más raras. Una STR alta impone respeto en el mercado.",
        DEX: "Agilidad Comercial: Tu rapidez para cerrar ventas. Los héroes ágiles obtienen mejores posiciones en el feed.",
        INT: "Sabiduría del Coleccionista: Inteligencia para identificar sets valiosos y tendencias antes que nadie.",
        VIT: "Resiliencia del Mercader: Tu constancia diaria. Desbloquea descuentos permanentes en comisiones."
    };

    return (
        <div className="relative h-full">
            <div className={`bg-gradient-to-b from-slate-900 to-slate-950 rounded-[40px] border ${availablePoints > 0 ? 'border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.15)] animate-pulse' : 'border-white/5'} p-8 shadow-2xl relative`}>
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="relative mb-4 group/avatar">
                        <div className="absolute -inset-2 bg-gradient-to-tr from-yellow-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                        <div className="relative w-32 h-32 bg-slate-950 rounded-[35px] overflow-hidden border-2 border-white/10 shadow-2xl">
                            <img 
                                src={`https://api.defikingdoms.com/v1/images/heroes/${heroId}`} 
                                className="w-full h-full object-cover scale-110"
                                onError={(e) => { e.target.src = `https://api.dicebear.com/9.x/pixel-art/png?seed=Hero${heroId}`; }}
                            />
                        </div>
                        <div className="absolute -bottom-2 right-2 bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full border-4 border-slate-950 shadow-xl">
                            Lvl {level}
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-yellow-500/80 mb-1">{rank.icon} {rank.name}</span>
                    <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none mb-4">MI HÉROE</h2>
                    
                    {/* 🔗 BOTÓN DE GESTIÓN (NUEVA PÁGINA) */}
                    <Link href="/dashboard/hero" className="w-full py-2 bg-slate-800 hover:bg-white hover:text-black border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-4">
                        Gestionar Héroe ⚙️
                    </Link>
                </div>

                <div className="space-y-6">
                    {[
                        { label: "STR", key: "STR", color: "bg-red-500", text: "text-red-400" },
                        { label: "DEX", key: "DEX", color: "bg-green-500", text: "text-green-400" },
                        { label: "INT", key: "INT", color: "bg-blue-500", text: "text-blue-400" },
                        { label: "VIT", key: "VIT", color: "bg-purple-500", text: "text-purple-400" }
                    ].map((s) => (
                        <div key={s.key} className="flex items-center gap-4 group/stat">
                            <div className="flex items-center gap-1 w-11 shrink-0">
                                <span className={`text-[10px] font-black ${s.text}`}>{s.label}</span>
                                <InfoTooltip text={statsLore[s.key]} />
                            </div>
                            <div className="flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                                <div className={`absolute left-0 top-0 h-full ${s.color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{width: `${getWidth(stats[s.key])}%`}}></div>
                            </div>
                            <span className="text-xs font-mono font-bold text-white w-6 text-right">{stats[s.key]}</span>
                            <div className="w-6 h-6 flex items-center justify-center">
                                {availablePoints > 0 && (
                                    <button onClick={() => onUpgrade(s.key)} className="w-6 h-6 bg-yellow-500 hover:bg-white text-black font-black rounded-lg text-xs shadow-lg transition-all animate-pulse">+</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-60">
                    <span className="text-[10px] font-black uppercase">Power Rating</span>
                    <span className="text-sm font-black text-yellow-500">{totalPower} ⚡</span>
                </div>
            </div>
        </div>
    );
};

// 🏅 PANEL DE MEDALLAS
const AchievementsPanel = ({ achievements }: any) => {
    const unlockedCount = achievements.filter((a: any) => a.unlocked).length;
    return (
        <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[40px] backdrop-blur-sm relative overflow-hidden h-full shadow-xl">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-purple-400 font-black uppercase italic tracking-widest text-xs flex items-center gap-3">
                    <span className="text-2xl drop-shadow-md">🏆</span> Medallas & Logros
                </h3>
                <span className="text-[9px] font-black text-gray-500 bg-white/5 px-3 py-1 rounded-lg border border-white/10 uppercase tracking-widest">
                    {unlockedCount} / {achievements.length}
                </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((ach: any) => (
                    <div key={ach.id} className={`group relative p-5 rounded-[24px] border-2 transition-all duration-500 flex flex-col items-center justify-center text-center gap-2 ${
                        ach.unlocked ? 'bg-slate-800/80 border-purple-500/30 shadow-lg hover:scale-105' : 'bg-slate-950/50 border-white/5 opacity-20 grayscale'
                    }`}>
                        <span className="text-3xl transition-transform group-hover:scale-125 duration-300">{ach.icon}</span>
                        <p className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">{ach.name}</p>
                        <div className="absolute inset-0 bg-black/95 rounded-[22px] flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-2xl">
                            <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tight leading-tight">{ach.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 🚀 COMPONENTE PRINCIPAL
export default function DashboardContent({ listings, sales, totalActiveValue, totalSoldValue }: any) {
    const [searchTerm, setSearchTerm] = useState("");
    const [bonusStats, setBonusStats] = useState({ STR: 0, DEX: 0, INT: 0, VIT: 0 });
    const [availablePoints, setAvailablePoints] = useState(0); 

    const totalSales = sales.length;
    const totalXP = (totalSales * 100) + (listings.length * 10);
    const level = Math.floor(totalXP / 500) + 1;
    const currentLevelXP = totalXP % 500;
    const game = { level, currentLevelXP, weeklyGoal: 5, weeklyProgress: Math.min(totalSales, 5) };

    const achievements = [
        { id: 1, name: "Primera Sangre", icon: "⚔️", unlocked: totalSales >= 1, description: "Vende tu primera carta" },
        { id: 2, name: "Mercader", icon: "💰", unlocked: totalSales >= 5, description: "Completa 5 ventas" },
        { id: 3, name: "Magnate", icon: "💎", unlocked: totalSoldValue >= 100000, description: "Genera $100.000 en ventas" },
        { id: 4, name: "Bodega Llena", icon: "📦", unlocked: listings.length >= 10, description: "Ten 10 cartas activas" },
        { id: 5, name: "Velocista", icon: "⚡", unlocked: totalSales >= 20, description: "Realiza 20 ventas totales" },
        { id: 6, name: "El Padrino", icon: "👑", unlocked: totalSoldValue >= 5000000, description: "Vendedor de élite mundial" }
    ];

    const ranks = [{ min: 0, max: 4, name: "Novato", icon: "🌱" }, { min: 5, max: 14, name: "Coleccionista", icon: "📦" }, { min: 15, name: "Maestro", icon: "🏆" }];
    const currentRank = ranks.find(r => totalSales >= r.min && (r.max ? totalSales <= r.max : true)) || ranks[0];
    const baseHeroStats = { STR: Math.min(80, Math.floor(totalSoldValue / 10000)), DEX: Math.min(80, totalSales * 5), INT: Math.min(80, listings.length * 5), VIT: Math.min(80, level * 10) };

    const activeListings = listings.filter((l: any) => l.status === 'ACTIVE' && l.card.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleUpgrade = (k: string) => { if (availablePoints > 0) { setBonusStats(p => ({...p, [k]: p[k]+5})); setAvailablePoints(p => p-1); }};
    const handleDelete = async (id: string) => { if(confirm("¿Seguro que deseas eliminar este item?")) await deleteListing(id); };

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-40 relative overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto px-8 pt-24 relative z-10">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <h1 className="text-7xl font-black italic tracking-tighter text-white drop-shadow-2xl">MI BODEGA</h1>
                        <div className="flex items-center gap-6">
                            <div className="w-80 h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                                <div className="h-full bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]" style={{ width: `${(currentLevelXP / 500) * 100}%` }} />
                            </div>
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest font-mono">{currentLevelXP} / 500 XP</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-5">
                        <DFKOracle />
                        <Link href="/sell" className="bg-white hover:bg-green-400 text-black px-10 py-3 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl">+ Nueva Publicación</Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    <div className="lg:col-span-4 h-full"><HeroStatsCard baseStats={baseHeroStats} bonusStats={bonusStats} rank={currentRank} availablePoints={availablePoints} onUpgrade={handleUpgrade} level={level} /></div>
                    <div className="lg:col-span-4">
                        {/* QUEST BOARD SLIM */}
                        <div className="bg-slate-900 border border-yellow-500/10 rounded-[40px] p-10 h-full flex flex-col justify-center relative group overflow-hidden shadow-2xl">
                            <h3 className="text-yellow-500 font-black uppercase italic tracking-widest text-xs mb-6 flex items-center gap-3">📜 Active Quest</h3>
                            <p className="text-white font-black text-2xl uppercase italic mb-4 leading-tight">Vendedor de Élite</p>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner"><div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400" style={{ width: `${(totalSales / 5) * 100}%` }} /></div>
                                <span className="text-xl font-mono font-black text-yellow-500">{totalSales}/5</span>
                            </div>
                            {totalSales >= 5 && availablePoints === 0 ? (
                                <button onClick={() => setAvailablePoints(p => p+3)} className="w-full py-5 bg-gradient-to-r from-yellow-600 to-orange-600 text-black font-black uppercase text-xs tracking-widest rounded-2xl animate-pulse shadow-xl shadow-yellow-500/20 border-b-4 border-orange-800">Reclamar +3 AP</button>
                            ) : (
                                <div className="w-full py-5 bg-green-500/10 border-2 border-green-500/20 text-green-400 font-black uppercase text-xs tracking-widest rounded-2xl text-center">✓ Recompensa Lista</div>
                            )}
                            <div className="absolute -right-6 -bottom-6 text-9xl opacity-[0.02] rotate-12 group-hover:opacity-[0.05] transition-opacity font-black">QUEST</div>
                        </div>
                    </div>
                    <div className="lg:col-span-4"><AchievementsPanel achievements={achievements} /></div>
                </div>

                {/* KPIS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 px-4">
                    {[
                        { label: "Valor Activo", val: `$${totalActiveValue.toLocaleString('es-CL')}`, color: "text-white" },
                        { label: "Ventas Totales", val: `$${totalSoldValue.toLocaleString('es-CL')}`, color: "text-green-400" },
                        { label: "Items", val: sales.length, color: "text-white" },
                        { label: "Racha Actual", val: `🔥 ${Math.min(totalSales, 7)}`, color: "text-orange-400" }
                    ].map((kpi, i) => (
                        <div key={i} className="bg-slate-900/60 border border-white/5 p-8 rounded-[40px] flex flex-col justify-center backdrop-blur-md shadow-xl hover:border-slate-700 transition-colors"><p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 tracking-[0.2em]">{kpi.label}</p><p className={`text-3xl font-black ${kpi.color} tracking-tighter`}>{kpi.val}</p></div>
                    ))}
                </div>

                {/* INVENTARIO */}
                <div className="mt-28 space-y-10">
                    <div className="flex justify-between items-end px-6">
                        <h2 className="text-4xl font-black uppercase italic text-white flex items-center gap-5 leading-none"><span className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_20px_#22c55e]"></span>Inventario de Bodega</h2>
                        <div className="relative group"><input type="text" placeholder="Buscar carta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-900 border border-white/5 rounded-2xl py-4 px-14 text-sm font-bold text-white focus:border-purple-500 outline-none w-96 shadow-2xl transition-all" /><svg className="w-5 h-5 text-gray-500 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                    </div>
                    <div className="bg-slate-900/60 border border-white/5 rounded-[50px] overflow-hidden shadow-2xl backdrop-blur-xl">
                        {activeListings.length > 0 ? activeListings.map((item: any) => (
                            <div key={item.id} className="p-8 flex items-center justify-between border-b border-white/5 hover:bg-white/[0.04] transition-all group/item">
                                <div className="flex items-center gap-8">
                                    <div className="relative w-16 h-28 bg-slate-950 rounded-2xl overflow-hidden border border-white/10 group-hover/item:scale-105 transition-transform duration-500 shadow-2xl shrink-0"><Image src={item.card.imageUrlSmall} alt={item.card.name} fill className="object-contain" /></div>
                                    <div className="space-y-3">
                                        <h3 className="font-black text-2xl text-gray-200 group-hover/item:text-white transition-colors tracking-tight leading-none uppercase italic">{item.card.name}</h3>
                                        <div className="flex gap-2.5">
                                            <span className="text-[10px] font-black uppercase px-3 py-1 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">{item.type}</span>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase px-3 py-1 bg-slate-800 rounded-xl">Condition: {item.condition}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-20">
                                    <div className="text-right"><p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1 opacity-50">Market Price</p><p className="font-black text-white text-3xl tracking-tighter group-hover/item:text-yellow-400 transition-all">${item.price.toLocaleString('es-CL')}</p></div>
                                    <div className="flex gap-4 opacity-0 group-hover/item:opacity-100 transition-all translate-x-4 group-hover/item:translate-x-0">
                                        <Link href={`/cards/${item.card.id}`} className="p-4 bg-slate-800 hover:bg-purple-600 text-white rounded-2xl transition-all shadow-xl hover:shadow-purple-500/40 border border-slate-700 active:scale-90">✏️</Link>
                                        <button onClick={() => handleDelete(item.id)} className="p-4 bg-slate-800 hover:bg-red-600 text-white rounded-2xl transition-all shadow-xl hover:shadow-red-500/40 border border-slate-700 active:scale-90">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        )) : <div className="p-32 text-center text-gray-700 font-black uppercase tracking-[0.4em] text-lg italic animate-pulse">Bodega vacía, capitán...</div>}
                    </div>
                </div>
            </div>
            <style jsx global>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
        </div>
    );
}