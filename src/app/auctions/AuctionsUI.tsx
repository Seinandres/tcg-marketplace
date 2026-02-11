"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BidHistory from "@/components/BidHistory";
import AuctionCountdown from "@/components/AuctionCountdown";
import QuickBidPanel from "@/components/QuickBidPanel";
import XPRewardPreview from "@/components/XPRewardPreview";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import WatchlistButton from "@/components/WatchlistButton";

export default function AuctionsUI({ initialAuctions, auctionEndDate }) {
  const [auctions, setAuctions] = useState(initialAuctions);
  const [featuredAuction, setFeaturedAuction] = useState(initialAuctions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleCardClick = (e, auction) => {
    e.preventDefault();
    setFeaturedAuction(auction);
    setIsModalOpen(true);
    setActiveTab('overview');
    
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const refreshAuctionData = async () => {
    try {
      const response = await fetch(`/api/listings/${featuredAuction.id}`);
      if (response.ok) {
        const updatedListing = await response.json();
        setFeaturedAuction(updatedListing);
        
        setAuctions(prevAuctions =>
          prevAuctions.map(a =>
            a.id === updatedListing.id ? updatedListing : a
          )
        );
      }
    } catch (error) {
      console.error('Error refreshing auction:', error);
    }
  };

  const xpPotential = Math.floor(featuredAuction.price / 500);
  
  const sellerLevel = featuredAuction.user?.heroLevel || 1;
  const sellerTitle = featuredAuction.user?.heroTitle || "Recluta";
  const sellerColor = featuredAuction.user?.heroColor || "#3b82f6";
  const sellerName = featuredAuction.user?.name || "Mercader Anónimo";

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20 relative overflow-hidden font-sans">
      
      {isModalOpen && featuredAuction && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
          <div 
            className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-purple-500/20 rounded-3xl w-full max-w-[95vw] lg:max-w-6xl max-h-[92vh] shadow-[0_0_100px_rgba(168,85,247,0.4)] animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col">
            
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative border-b border-white/10 bg-black/20 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center justify-between p-4 lg:p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <span className="text-xl lg:text-2xl">🎴</span>
                  </div>
                  <div>
                    <h2 className="text-base lg:text-xl font-black uppercase text-white tracking-tight">
                      Inspección de Artefacto
                    </h2>
                    <p className="text-[8px] lg:text-[9px] text-purple-400 uppercase font-bold tracking-widest">
                      Contrato #{featuredAuction.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="group p-2 lg:p-3 bg-white/5 hover:bg-red-500/20 rounded-xl transition-all border border-white/10 hover:border-red-500/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-red-400 transition-colors">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                </button>
              </div>

              <div className="flex gap-1 px-4 lg:px-5 pb-3">
                {[
                  { id: 'overview', icon: '🎴', label: 'Vista General' },
                  { id: 'stats', icon: '📊', label: 'Estadísticas' },
                  { id: 'bids', icon: '⚔️', label: 'Historial' },
                  { id: 'seller', icon: '👤', label: 'Mercader' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-xl font-bold text-[9px] lg:text-[10px] uppercase tracking-wider transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 text-slate-500 border border-white/5 hover:border-purple-500/30 hover:text-purple-400'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'animate-pulse' : ''}>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative overflow-y-auto flex-1 custom-scrollbar">
              <div className="p-4 lg:p-6">
                
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    <div className="lg:col-span-2 space-y-4">
                      <div className="relative group perspective-1000">
                        <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
                        
                        <div className="relative bg-gradient-to-br from-[#050a14] to-purple-950/30 rounded-3xl p-4 lg:p-5 border border-purple-500/20 shadow-2xl overflow-hidden card-tilt">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          
                          <div className="relative aspect-[2.5/3.5] w-full max-w-[280px] mx-auto">
                            <Image 
                              src={featuredAuction.card.imageUrlHiRes || featuredAuction.card.image || featuredAuction.card.imageUrlSmall} 
                              alt={featuredAuction.card.name} 
                              fill 
                              className="object-contain drop-shadow-[0_20px_80px_rgba(168,85,247,0.6)] group-hover:scale-105 transition-transform duration-700"
                              priority
                            />
                          </div>

                          <div className="absolute top-3 left-3 right-3 flex justify-between">
                            <div className="bg-purple-500/30 backdrop-blur-xl border border-purple-500/50 rounded-xl px-2.5 py-1 text-[8px] font-black text-purple-200 uppercase tracking-wider shadow-xl">
                              PSA 10 • Gem Mint
                            </div>
                            <div className="bg-green-500/30 backdrop-blur-xl border border-green-500/50 rounded-xl px-2.5 py-1 text-[8px] font-black text-green-200 uppercase tracking-wider flex items-center gap-1 shadow-xl">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                              EN VIVO
                            </div>
                          </div>

                          <div className="absolute bottom-3 left-0 right-0 text-center">
                            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/40 text-yellow-300 text-[8px] font-black uppercase px-3 py-1.5 rounded-full shadow-2xl tracking-widest">
                              <span className="text-xs">✨</span>
                              {featuredAuction.card.rarity || "Ultra Raro"} • Edición Limitada
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex -space-x-1.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                                {String.fromCharCode(64 + i)}
                              </div>
                            ))}
                            <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-400">
                              +7
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-white">11 cazadores rastreando</p>
                            <p className="text-[7px] text-slate-500 uppercase font-bold">Interés Alto 🔥</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[7px] text-slate-500 uppercase font-bold mb-0.5">Vistas Totales</p>
                          <p className="text-base font-black text-purple-400">342</p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-3 space-y-4 lg:space-y-5">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-2xl lg:text-3xl font-black uppercase text-white leading-tight tracking-tight mb-2">
                              {featuredAuction.card.name}
                            </h3>
                            <p className="text-xs lg:text-sm text-purple-400 font-bold uppercase tracking-widest mb-2.5">
                              {featuredAuction.card.set || "Set Desconocido"}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-[8px] font-bold text-blue-300 uppercase">
                                Coleccionable
                              </span>
                              <span className="px-2.5 py-0.5 bg-green-500/20 border border-green-500/30 rounded-lg text-[8px] font-bold text-green-300 uppercase">
                                Verificado
                              </span>
                              <span className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-[8px] font-bold text-purple-300 uppercase flex items-center gap-1">
                                <span>⚡</span> +{xpPotential} XP
                              </span>
                            </div>
                          </div>
                          <WatchlistButton listingId={featuredAuction.id} />
                        </div>
                      </div>

                      <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-2 border-green-500/30 rounded-2xl p-4 lg:p-5 shadow-xl">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-3xl" />
                        <div className="relative">
                          <p className="text-[8px] text-green-400 uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Valor del Botín Actual
                          </p>
                          <div className="flex items-baseline gap-2.5 mb-2">
                            <p className="text-3xl lg:text-5xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                              ${featuredAuction.price.toLocaleString('es-CL')}
                            </p>
                            <span className="text-xs lg:text-sm text-green-400 font-bold">CLP</span>
                          </div>
                          <div className="flex items-center justify-between text-[7px] lg:text-[8px] text-green-300/70 uppercase font-bold">
                            <span>Inicial: ${(featuredAuction.price * 0.7).toLocaleString('es-CL')}</span>
                            <span className="flex items-center gap-0.5">
                              <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                              </svg>
                              +{(((featuredAuction.price - featuredAuction.price * 0.7) / (featuredAuction.price * 0.7)) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/60 border border-red-500/20 rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-[8px] text-red-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                            <span className="animate-pulse">⏰</span> Tiempo Restante del Contrato
                          </p>
                          <span className="text-[7px] text-slate-500 font-bold">Cierra: 18 Feb, 21:00</span>
                        </div>
                        <AuctionCountdown endDate={auctionEndDate} />
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[7px] text-slate-500 uppercase font-bold">
                            <span>Tiempo transcurrido</span>
                            <span>68%</span>
                          </div>
                          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full w-[68%] bg-gradient-to-r from-red-500 to-orange-500 rounded-full relative">
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">⚡ Acciones Rápidas</p>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-[10px] tracking-wider py-3 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5">
                            <span>⚔️</span>
                            <span>Pujar Ahora</span>
                          </button>
                          <button className="bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-purple-500/50 text-slate-300 hover:text-white font-black uppercase text-[10px] tracking-wider py-3 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5">
                            <span>📊</span>
                            <span>Ver Detalles</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 space-y-2.5">
                        <p className="text-[8px] text-blue-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                          <span>📈</span> Análisis de Mercado
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[7px] text-slate-500 uppercase font-bold mb-0.5">Valor Promedio</p>
                            <p className="text-base lg:text-lg font-black text-blue-300">${(featuredAuction.price * 0.9).toLocaleString('es-CL')}</p>
                          </div>
                          <div>
                            <p className="text-[7px] text-slate-500 uppercase font-bold mb-0.5">Valor Máximo</p>
                            <p className="text-base lg:text-lg font-black text-purple-300">${(featuredAuction.price * 1.2).toLocaleString('es-CL')}</p>
                          </div>
                        </div>
                        <p className="text-[7px] lg:text-[8px] text-blue-300/70 italic">
                          Esta reliquia está <span className="font-bold text-green-400">8% por debajo</span> del valor promedio
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl lg:text-2xl font-black uppercase text-white flex items-center gap-2.5">
                      <span className="text-2xl lg:text-3xl">📊</span> Estadísticas de Combate
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                      {[
                        { label: 'Total Pujas', value: featuredAuction.bids.length, icon: '⚔️' },
                        { label: 'Participantes', value: new Set(featuredAuction.bids.map(b => b.userId)).size, icon: '👥' },
                        { label: 'Puja Promedio', value: `$${Math.floor(featuredAuction.price * 0.85).toLocaleString('es-CL')}`, icon: '💰' },
                        { label: 'Incremento', value: `+${(((featuredAuction.price - featuredAuction.price * 0.7) / (featuredAuction.price * 0.7)) * 100).toFixed(1)}%`, icon: '📈' },
                        { label: 'XP Potencial', value: `+${xpPotential}`, icon: '⚡' },
                        { label: 'Vistas', value: '342', icon: '👁️' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-xl">{stat.icon}</span>
                            </div>
                            <div className="text-2xl font-black text-purple-400">
                              {stat.value}
                            </div>
                          </div>
                          <p className="text-[8px] text-purple-300/70 uppercase font-bold tracking-wider">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <PriceHistoryChart 
                      bids={featuredAuction.bids}
                      startingPrice={featuredAuction.price * 0.7}
                    />

                    <XPRewardPreview currentPrice={featuredAuction.price} />
                  </div>
                )}

                {activeTab === 'bids' && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl lg:text-2xl font-black uppercase text-white flex items-center gap-2.5">
                        <span className="text-2xl lg:text-3xl">⚔️</span> Historial de Batalla
                      </h3>
                      <span className="text-[9px] font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        ACTUALIZACIÓN EN VIVO
                      </span>
                    </div>

                    <div className="bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden min-h-[300px]">
                      <BidHistory initialBids={featuredAuction.bids} listingId={featuredAuction.id} />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-xl font-black text-purple-400">{featuredAuction.bids.length}</p>
                        <p className="text-[7px] text-slate-500 uppercase font-bold mt-0.5">Total Pujas</p>
                      </div>
                      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-xl font-black text-pink-400">{new Set(featuredAuction.bids.map(b => b.userId)).size}</p>
                        <p className="text-[7px] text-slate-500 uppercase font-bold mt-0.5">Guerreros</p>
                      </div>
                      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-xl font-black text-green-400">$1K</p>
                        <p className="text-[7px] text-slate-500 uppercase font-bold mt-0.5">Incremento Avg</p>
                      </div>
                      <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-center">
                        <p className="text-xl font-black text-blue-400">8m</p>
                        <p className="text-[7px] text-slate-500 uppercase font-bold mt-0.5">Última Puja</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'seller' && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl lg:text-2xl font-black uppercase text-white flex items-center gap-2.5">
                      <span className="text-2xl lg:text-3xl">👤</span> Perfil del Mercader
                    </h3>

                    <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-purple-500/20 rounded-3xl p-6 lg:p-8">
                      <div className="flex flex-col md:flex-row gap-5 lg:gap-6">
                        <div className="flex flex-col items-center gap-3.5">
                          <div className="relative">
                            <div 
                              className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center shadow-2xl"
                              style={{ 
                                background: `linear-gradient(135deg, ${sellerColor}22, ${sellerColor}88)`,
                                boxShadow: `0 10px 40px ${sellerColor}50`
                              }}
                            >
                              <span className="text-4xl lg:text-5xl">🎮</span>
                            </div>
                            <div 
                              className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-black px-3 py-0.5 rounded-full text-[10px] font-black uppercase shadow-lg"
                              style={{ background: sellerColor }}
                            >
                              Nivel {sellerLevel}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              {[1,2,3,4,5].map(i => (
                                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                              ))}
                            </div>
                            <p className="text-xs font-bold text-white">5.0 <span className="text-slate-500">(234 ventas)</span></p>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3.5">
                          <div>
                            <h4 className="text-xl lg:text-2xl font-black text-white mb-0.5">{sellerName}</h4>
                            <p 
                              className="text-xs lg:text-sm font-bold uppercase tracking-wider"
                              style={{ color: sellerColor }}
                            >
                              {sellerTitle} • Verificado ✓
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { icon: '🏆', label: 'Top Seller' },
                              { icon: '⚡', label: 'Envío Rápido' },
                              { icon: '💎', label: 'Calidad Premium' },
                              { icon: '🛡️', label: 'Verificado' }
                            ].map((badge, i) => (
                              <div key={i} className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                                <span className="text-xs">{badge.icon}</span>
                                <span className="text-[8px] font-bold text-purple-300 uppercase">{badge.label}</span>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                            <div>
                              <p className="text-xl font-black text-purple-400">234</p>
                              <p className="text-[7px] text-slate-500 uppercase font-bold">Ventas Totales</p>
                            </div>
                            <div>
                              <p className="text-xl font-black text-green-400">99.8%</p>
                              <p className="text-[7px] text-slate-500 uppercase font-bold">Satisfacción</p>
                            </div>
                            <div>
                              <p className="text-xl font-black text-blue-400">12h</p>
                              <p className="text-[7px] text-slate-500 uppercase font-bold">Tiempo Respuesta</p>
                            </div>
                          </div>

                          <div className="bg-black/20 border border-white/5 rounded-xl p-3">
                            <p className="text-[10px] lg:text-xs text-slate-300 leading-relaxed">
                              "Mercader profesional con más de 10 años de experiencia. Todas mis reliquias son auténticas, gradeadas y enviadas con el máximo cuidado. ¡Tu satisfacción es mi prioridad! 🎴"
                            </p>
                          </div>

                          <button className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-purple-500/50 text-white font-bold uppercase text-[10px] tracking-wider py-2.5 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-1.5">
                            <span>💬</span>
                            <span>Contactar Mercader</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 border-2 border-purple-500/30 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
                      <div className="relative space-y-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <span className="text-2xl">🌟</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-black uppercase text-white">¿Quieres ser un Maestro Mercader?</h4>
                            <p className="text-xs text-purple-400 font-bold">Únete a la élite de comerciantes</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {[
                            { icon: '💰', title: 'Gana más', desc: 'Comisiones reducidas para mercaderes élite' },
                            { icon: '⚡', title: 'Sube niveles', desc: 'Gana XP por cada transacción exitosa' },
                            { icon: '🏆', title: 'Desbloquea Items', desc: 'Accede a reliquias y buffs exclusivos' }
                          ].map((benefit, i) => (
                            <div key={i} className="bg-black/20 border border-white/5 rounded-xl p-3">
                              <div className="text-2xl mb-1.5">{benefit.icon}</div>
                              <p className="text-xs font-black text-white mb-0.5">{benefit.title}</p>
                              <p className="text-[8px] text-slate-400">{benefit.desc}</p>
                            </div>
                          ))}
                        </div>

                        <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black uppercase text-xs tracking-wider py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                          <span>🚀</span>
                          <span>Convertirme en Mercader</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-md p-4 flex-shrink-0">
              <div className="flex flex-col md:flex-row gap-3">
                <Link 
                  href={`/cards/${featuredAuction.card.id}`}
                  className="flex-1 group relative py-3 px-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-black uppercase text-xs lg:text-sm tracking-wider overflow-hidden transition-all hover:scale-[1.02] shadow-xl hover:shadow-2xl hover:shadow-purple-500/50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2.5 group-hover:gap-3.5 transition-all">
                    <span>⚔️</span>
                    Ir al Panel de Misión Completo
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>

                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="md:w-auto px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-2xl font-bold uppercase text-xs lg:text-sm tracking-wider transition-all"
                >
                  Cerrar Vista Previa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/15 via-transparent to-transparent" />
         <div className="absolute inset-0 opacity-[0.03]" 
            style={{ 
                backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }} 
         />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(139,92,246,0.15)_0%,_transparent_50%)]" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(236,72,153,0.15)_0%,_transparent_50%)]" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]" />
      </div>

      <div className="relative h-[45vh] flex items-center justify-center overflow-hidden border-b border-white/5 bg-[#020617]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#020617] to-transparent z-10" />
        
        <div className="relative z-20 text-center px-6 animate-in fade-in duration-1000 slide-in-from-bottom-6">
            <div className="flex justify-center mb-6">
                <span className="relative flex items-center gap-2 py-2 px-5 rounded-full bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-500 border border-red-500/30 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(239,68,68,0.3)] backdrop-blur-md">
                    <span className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="relative z-10">Contratos en Tiempo Real</span>
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                ARENA DE{' '}
                <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-2xl animate-pulse">
                        CONTRATOS
                    </span>
                    <span className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl -z-10" />
                </span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-default group">
                    <span className="group-hover:scale-110 transition-transform">🛡️</span> Verificación Blockchain
                </span>
                <span className="text-white/20">|</span>
                <span className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors cursor-default group">
                    <span className="group-hover:scale-110 transition-transform">⚡</span> +{xpPotential} XP por Misión
                </span>
                <span className="text-white/20">|</span>
                <span className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-default group">
                    <span className="group-hover:scale-110 transition-transform">💎</span> Reliquias Verificadas
                </span>
                <span className="text-white/20">|</span>
                <span className="flex items-center gap-2 text-purple-400 italic hover:text-pink-400 transition-colors cursor-default group">
                    <span className="group-hover:scale-110 transition-transform">⏳</span> Cierre: Martes 21:00
                </span>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-2 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-4 flex-wrap">
                        <h2 className="text-sm font-black uppercase italic text-slate-300 flex items-center gap-3 tracking-widest">
                            <span className="text-xl animate-pulse">⚔️</span> 
                            Tablero de Misiones
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs font-black">
                                {auctions.length}
                            </span>
                        </h2>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                        <button className="bg-slate-800/50 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/5 hover:border-red-500 transition-all hover:bg-red-500/10 active:scale-95 hover:shadow-lg hover:shadow-red-500/20 flex items-center gap-1.5">
                            🔥 <span>Tendencia</span>
                        </button>
                        <button className="bg-slate-800/50 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/5 hover:border-yellow-500 transition-all hover:bg-yellow-500/10 active:scale-95 hover:shadow-lg hover:shadow-yellow-500/20 flex items-center gap-1.5">
                            ⏳ <span>Finalizando</span>
                        </button>
                        <button className="bg-slate-800/50 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/5 hover:border-purple-500 transition-all hover:bg-purple-500/10 active:scale-95 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-1.5">
                            💰 <span>Botín</span>
                        </button>
                    </div>
                </div>

                {auctions.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {auctions.map((item, index) => {
                            const bidCount = item.bids.length;
                            const uniqueBidders = new Set(item.bids.map(b => b.userId)).size;
                            const xpReward = Math.floor(item.price / 1000);
                            const isSelected = featuredAuction.id === item.id;
                            
                            return (
                                <Link 
                                    key={item.id} 
                                    href={`/cards/${item.card.id}`}
                                    onClick={(e) => handleCardClick(e, item)}
                                    className={`group relative bg-slate-900/40 border p-5 rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20
                                        ${isSelected ? 'border-purple-500/80 ring-1 ring-purple-500/30' : 'border-white/10 hover:border-purple-500/50'}
                                    `}
                                >
                                    {isSelected && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 z-20 shadow-[0_0_15px_#a855f7]" />}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 blur-xl transition-all duration-500" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-2">
                                                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase text-white border border-white/10 shadow-lg">
                                                    CONTRATO #{index + 1}
                                                </div>
                                                <div className="bg-purple-500/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-bold text-purple-300 border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    +{xpReward} XP
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-1 text-[8px] font-bold text-green-400 uppercase tracking-widest">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                                                    Live
                                                </div>
                                                {bidCount > 0 && (
                                                    <div className="bg-blue-500/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] font-bold text-blue-300 border border-blue-500/30">
                                                        {bidCount} oferta{bidCount !== 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="relative aspect-[3/4] mb-5 rounded-3xl overflow-hidden bg-gradient-to-br from-[#050a14] to-purple-950/10 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                                            <Image 
                                                src={item.card.imageUrlHiRes || item.card.image || item.card.imageUrlSmall} 
                                                alt={item.card.name} 
                                                fill 
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out" 
                                            />
                                            <div className="absolute bottom-2 right-2 bg-blue-500/20 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-blue-300 border border-blue-500/30 shadow-lg">
                                                {item.condition || "NM/MINT"}
                                            </div>
                                            {uniqueBidders > 2 && (
                                                <div className="absolute top-2 left-2 bg-red-500/20 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-red-300 border border-red-500/30 shadow-lg flex items-center gap-1">
                                                    🔥 <span>HOT</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-black text-xs uppercase truncate text-slate-100 group-hover:text-purple-400 transition-colors tracking-widest mb-1">
                                                    {item.card.name}
                                                </h3>
                                                <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider truncate">
                                                    {item.card.set || "Set Desconocido"}
                                                </p>
                                            </div>
                                            
                                            <div className="bg-black/40 border border-white/5 group-hover:border-purple-500/20 rounded-2xl p-3 transition-colors space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-[7px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Botín</p>
                                                        <p className="text-sm font-mono font-bold text-green-400 leading-none">
                                                            ${item.price.toLocaleString('es-CL')}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[7px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Faltan</p>
                                                        <p className="text-[9px] font-bold text-red-400 animate-pulse leading-none">2d 4h</p>
                                                    </div>
                                                </div>
                                                {uniqueBidders > 0 && (
                                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                        <p className="text-[7px] text-slate-500 uppercase font-bold">Cazadores</p>
                                                        <p className="text-[8px] text-purple-400 font-black">{uniqueBidders} activo{uniqueBidders !== 1 ? 's' : ''}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-20 text-center bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-white/5">
                        <div className="text-5xl mb-6 opacity-20 filter grayscale">🃏</div>
                        <p className="text-slate-500 font-black uppercase text-xs tracking-[0.3em] mb-6">No hay misiones disponibles</p>
                        <Link href="/sell" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:scale-105 transition-transform shadow-xl">
                            ⚔️ Crear Primera Misión
                        </Link>
                    </div>
                )}
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
                    {featuredAuction ? (
                        <>
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-50 transition-all duration-1000 animate-pulse"></div>
                                <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-[2.3rem] p-2 shadow-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <div className="relative aspect-square w-full rounded-[1.8rem] overflow-hidden bg-gradient-to-br from-[#050a14] to-purple-950/20">
                                        <Image 
                                            src={featuredAuction.card.imageUrlHiRes || featuredAuction.card.image || featuredAuction.card.imageUrlSmall} 
                                            alt="Featured" 
                                            fill 
                                            className="object-contain p-6 group-hover:scale-105 transition-transform duration-700" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent pointer-events-none" />
                                        <div className="absolute bottom-6 left-0 right-0 text-center animate-bounce" style={{ animationDuration: '3s' }}>
                                            <span className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[9px] font-black uppercase px-4 py-2 rounded-full shadow-2xl tracking-[0.2em] inline-flex items-center gap-2">
                                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                                ★ Contrato Activo
                                            </span>
                                        </div>
                                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                            <div className="bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-xl px-2 py-1 text-[8px] font-black text-purple-300 uppercase tracking-wider">
                                                PSA 10
                                            </div>
                                            <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-xl px-2 py-1 text-[8px] font-black text-green-300 uppercase tracking-wider flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                                {featuredAuction.bids.length} ofertas
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 shadow-2xl space-y-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-black text-lg uppercase text-white mb-1 tracking-tight leading-tight">
                                            {featuredAuction.card.name}
                                        </h3>
                                        <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">
                                            {featuredAuction.card.set || "Set Desconocido"}
                                        </p>
                                    </div>
                                    <WatchlistButton listingId={featuredAuction.id} />
                                </div>
                                <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
                                    <div className="relative">
                                        <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-2">Valor del Botín</p>
                                        <div className="flex items-baseline gap-3">
                                            <p className="text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                                                ${featuredAuction.price.toLocaleString('es-CL')}
                                            </p>
                                            <span className="text-[10px] text-green-400 font-bold animate-pulse">CLP</span>
                                        </div>
                                        <p className="text-[7px] text-slate-500 uppercase font-bold mt-2">
                                            Valor inicial: ${(featuredAuction.price * 0.7).toLocaleString('es-CL')}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">⏰ Tiempo Restante</p>
                                    <AuctionCountdown endDate={auctionEndDate} />
                                </div>
                            </div>

                            <div className="bg-gradient-to-b from-slate-900/60 to-slate-950/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 shadow-2xl">
                                <QuickBidPanel 
                                    currentPrice={featuredAuction.price}
                                    minIncrement={1000}
                                    listingId={featuredAuction.id}
                                    onBidPlaced={refreshAuctionData}
                                />
                            </div>
                            <XPRewardPreview currentPrice={featuredAuction.price} />
                            
                            <Link 
                                href={`/cards/${featuredAuction.card.id}`}
                                className="block w-full text-center py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-all border border-white/5 hover:border-white/20"
                            >
                                Ver Detalles Completos →
                            </Link>

                            <PriceHistoryChart 
                                bids={featuredAuction.bids}
                                startingPrice={featuredAuction.price * 0.7}
                            />

                            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden">
                                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-purple-500/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">📜 Historial de Ofertas</span>
                                        <span className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            LIVE
                                        </span>
                                    </div>
                                </div>
                                <div className="p-1">
                                    <BidHistory 
                                        listingId={featuredAuction.id}
                                        initialBids={featuredAuction.bids} 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 hover:border-purple-500/30 transition-all group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <span className="text-sm">👥</span>
                                        </div>
                                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Cazadores</p>
                                    </div>
                                    <p className="text-2xl font-black text-white">
                                        {new Set(featuredAuction.bids.map(b => b.userId)).size}
                                    </p>
                                    <p className="text-[7px] text-purple-400 uppercase font-bold mt-1">Activos</p>
                                </div>
                                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 hover:border-pink-500/30 transition-all group">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <span className="text-sm">⚔️</span>
                                        </div>
                                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Ofertas</p>
                                    </div>
                                    <p className="text-2xl font-black text-white">
                                        {featuredAuction.bids.length}
                                    </p>
                                    <p className="text-[7px] text-pink-400 uppercase font-bold mt-1">Total</p>
                                </div>
                            </div>

                            <div className="relative overflow-hidden p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 border border-purple-500/20 rounded-[2rem] group hover:border-purple-500/40 transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors"></div>
                                <div className="relative space-y-4">
                                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="text-lg">📜</span> Reglas del Contrato
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="text-purple-400 text-xs mt-0.5">•</span>
                                            <p className="text-[9px] text-slate-300 leading-relaxed">
                                                Cada oferta extiende el tiempo por <span className="text-purple-400 font-bold">30 segundos</span>
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-purple-400 text-xs mt-0.5">•</span>
                                            <p className="text-[9px] text-slate-300 leading-relaxed">
                                                Gana <span className="text-yellow-400 font-bold">+{xpPotential} XP</span> al completar el contrato
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-3 border-t border-purple-500/10">
                                        <span className="text-base">⚡</span>
                                        <p className="text-[8px] text-purple-300 font-bold">
                                            Sube de nivel y desbloquea reliquias exclusivas
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-center hover:border-green-500/30 transition-colors group">
                                    <div className="text-lg mb-1 group-hover:scale-110 transition-transform">✅</div>
                                    <p className="text-[7px] text-slate-400 uppercase font-black">Verificado</p>
                                </div>
                                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-center hover:border-blue-500/30 transition-colors group">
                                    <div className="text-lg mb-1 group-hover:scale-110 transition-transform">🔒</div>
                                    <p className="text-[7px] text-slate-400 uppercase font-black">Seguro</p>
                                </div>
                                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-center hover:border-purple-500/30 transition-colors group">
                                    <div className="text-lg mb-1 group-hover:scale-110 transition-transform">⚡</div>
                                    <p className="text-[7px] text-slate-400 uppercase font-black">Rápido</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[2rem] opacity-30 bg-slate-900/20">
                            <div className="text-4xl mb-4 filter grayscale animate-pulse">⚔️</div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">
                                Esperando misiones...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .card-tilt {
          transition: transform 0.3s ease;
        }
        
        .card-tilt:hover {
          transform: rotateY(2deg) rotateX(-2deg);
        }
      `}</style>
    </div>
  );
}