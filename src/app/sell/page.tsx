// @ts-nocheck
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { createListing } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

// IMAGEN DE RESPALDO
const PLACEHOLDER_IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAEsCAMAAACwdH5pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ3QjUzQjQ3QjQ3MTFFMzg5RDhGMzQ3QjQ3QjQ3QjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzQ3QjUzQjU3QjQ3MTFFMzg5RDhGMzQ3QjQ3QjQ3QjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNDdCNTNCMjdBNDcxMUUzODlEOEYzNDdCNDdCNDdCNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNDdCNTNCMzdBNDcxMUUzODlEOEYzNDdCNDdCNDdCNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pol5jXAAAAA1UExURQAAACIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIk0/338AAAARdFJOUwBAgLxdf4Cw37+/gL+/v7+AtivxXQAAAAlwSFlzAAALEgAACxIB0t1+/AAAABhJREFUeNrtwTEBAAAAwqD1T20Kb6AAAAC4AwZgAAEq5p72AAAAAElFTkSuQmCC";

// --- COMPONENTE TRADINGVIEW STYLE ---
const TradingViewChart = ({ currentPrice, color = "#22c55e" }: { currentPrice: number, color?: string }) => {
    const [timeframe, setTimeframe] = useState('1M');
    const [hoverData, setHoverData] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const points = timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : timeframe === '1Y' ? 50 : 30;
        const volatility = timeframe === '1M' ? 0.05 : 0.15; 
        
        let history = [];
        let cursorPrice = currentPrice;
        const now = new Date();
        
        for(let i=0; i<points; i++) {
             const date = new Date();
             date.setDate(now.getDate() - i);
             history.push({
                 price: Math.round(cursorPrice),
                 date: i === 0 ? 'HOY' : date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
             });
             const change = 1 + (Math.random() - 0.45) * volatility; 
             cursorPrice = cursorPrice / change;
        }
        setChartData(history.reverse());
    }, [currentPrice, timeframe]);

    const maxPrice = Math.max(...chartData.map(d => d.price), currentPrice) * 1.05;
    const minPrice = Math.min(...chartData.map(d => d.price), currentPrice) * 0.95;
    const range = maxPrice - minPrice || 1;

    const getY = (price: number) => 100 - ((price - minPrice) / range) * 100;
    const getX = (index: number) => (index / (chartData.length - 1)) * 100;

    const pathD = chartData.length > 0 
        ? `M0,${getY(chartData[0].price)} ` + chartData.map((d, i) => `L${getX(i)},${getY(d.price)}`).join(" ")
        : "";

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const index = Math.min(chartData.length - 1, Math.max(0, Math.round(percentage * (chartData.length - 1))));
        
        setHoverData({
            ...chartData[index],
            xPos: getX(index),
            yPos: getY(chartData[index].price)
        });
    };

    const displayPrice = hoverData ? hoverData.price : currentPrice;
    const displayLabel = hoverData ? hoverData.date : "Precio Actual";

    return (
        <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50 shadow-inner">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{displayLabel}</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter">${displayPrice.toLocaleString('es-CL')}</h3>
                </div>
                <div className="flex gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
                    {['1M', '3M', '1Y'].map((tf) => (
                        <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all ${timeframe === tf ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-white hover:bg-slate-800'}`}>{tf}</button>
                    ))}
                </div>
            </div>
            <div ref={containerRef} className="relative h-48 w-full cursor-crosshair group" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`${pathD} V 100 H 0 Z`} fill="url(#fillGradient)" stroke="none" />
                    <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    {hoverData && (
                        <>
                            <line x1={hoverData.xPos} y1="0" x2={hoverData.xPos} y2="100" stroke="#fff" strokeWidth="1" strokeDasharray="4" opacity="0.5" vectorEffect="non-scaling-stroke"/>
                            <line x1="0" y1={hoverData.yPos} x2="100" y2={hoverData.yPos} stroke="#fff" strokeWidth="1" strokeDasharray="4" opacity="0.5" vectorEffect="non-scaling-stroke"/>
                            <circle cx={hoverData.xPos} cy={hoverData.yPos} r="4" fill={color} stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"/>
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
};

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

// Helper para extraer precio de lista (usado para ordenar)
const getDisplayPrice = (card: any, game: string) => {
    let usd = 0;
    if (game === 'Pokemon') {
        // Busca el precio más alto entre Holo y Normal para el ordenamiento
        usd = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
    } else {
        usd = parseFloat(card.prices?.usd || "0");
    }
    return usd;
}

export default function SellPage() {
  const router = useRouter();
  const [game, setGame] = useState("Pokemon"); 
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]); 
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [listingType, setListingType] = useState("SALE");

  // CARGAR SUGERENCIAS
  useEffect(() => {
    async function fetchSuggestions() {
        if (query) return;
        setLoading(true);
        try {
            let data = [];
            if (game === "Pokemon") {
                const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:sv3pt5&pageSize=8`);
                const json = await res.json();
                data = json.data || [];
                // Ordenamos sugerencias por precio
                data.sort((a: any, b: any) => getDisplayPrice(b, 'Pokemon') - getDisplayPrice(a, 'Pokemon'));
            } else {
                const res = await fetch(`https://api.scryfall.com/cards/search?q=year%3D2024&order=usd&dir=desc`);
                const json = await res.json();
                data = json.data ? json.data.slice(0, 8) : [];
            }
            setSuggestions(data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    if (!isSuccess) fetchSuggestions();
  }, [game, isSuccess, query]); 

  // BUSCADOR (CON ORDENAMIENTO POR PRECIO)
  useEffect(() => {
    async function searchCards() {
        if (!debouncedQuery) { setResults([]); return; }
        setLoading(true);
        setResults([]); 
        try {
            let data = [];
            if (game === "Pokemon") {
                const cleanQuery = debouncedQuery.trim();
                // Pedimos más resultados (50) para poder ordenar mejor en el cliente
                const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${cleanQuery}*&pageSize=50&orderBy=-set.releaseDate`);
                const json = await res.json();
                data = json.data || [];
                
                // ORDENAMIENTO MANUAL POR PRECIO (Mayor a menor)
                data.sort((a: any, b: any) => getDisplayPrice(b, 'Pokemon') - getDisplayPrice(a, 'Pokemon'));
            } else {
                // Magic permite ordenar directo en la API
                const res = await fetch(`https://api.scryfall.com/cards/search?q=${debouncedQuery}&order=usd&dir=desc`);
                const json = await res.json();
                data = json.data ? json.data.slice(0, 50) : [];
            }
            setResults(data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }
    searchCards();
  }, [debouncedQuery, game]);

  const selectCard = (card: any) => {
    let normalizedCard: any = {};
    const img = game === 'Pokemon' 
        ? (card.images?.small || PLACEHOLDER_IMG)
        : (card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || PLACEHOLDER_IMG);

    // --- DATA INTELLIGENCE ---
    let marketData = { market: 0, low: 0, high: 0 };

    if (game === "Pokemon" && card.tcgplayer?.prices) {
        const prices = card.tcgplayer.prices;
        const variant = prices.holofoil || prices.normal || prices.reverseHolofoil || {};
        let lowPrice = variant.low || 0;
        let marketPrice = variant.market || 0;
        if (marketPrice > 5 && lowPrice < 1) lowPrice = marketPrice * 0.7;

        marketData = {
            market: marketPrice,
            low: lowPrice,
            high: variant.high || (marketPrice * 1.5)
        };
    } else if (game === "Magic") {
        const usd = parseFloat(card.prices?.usd || "0");
        marketData = {
            market: usd,
            low: usd * 0.85, 
            high: usd * 1.3
        };
    }
    
    const CLP_RATE = 950;
    const roundTo100 = (num: number) => Math.ceil(num / 100) * 100;
    
    const clpPrices = {
        market: roundTo100(marketData.market * CLP_RATE),
        low: roundTo100(marketData.low * CLP_RATE),
        high: roundTo100(marketData.high * CLP_RATE),
    };

    if (game === "Pokemon") {
      normalizedCard = {
        id: card.id, name: card.name, set: card.set?.name || "Unknown", image: img,
        rarity: card.rarity || "Common", number: card.number || "000",
        prices: clpPrices
      };
    } else {
      normalizedCard = {
        id: card.id, name: card.name, set: card.set_name || "Unknown", image: img,
        rarity: card.rarity || "Common", number: card.collector_number || "000",
        prices: clpPrices
      };
    }
    setSelectedCard(normalizedCard);
    setResults([]); 
    setSuggestions([]);
  };

  const handlePublish = async (formData: FormData) => {
      setIsPublishing(true);
      const res = await createListing(formData);
      setIsPublishing(false);
      if (res?.success) setIsSuccess(true);
      else alert("Error al publicar: " + res?.error);
  };

  const resetForm = () => {
      setIsSuccess(false);
      setSelectedCard(null);
      setQuery("");
      setResults([]);
      setListingType("SALE");
  };

  if (isSuccess && selectedCard) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-green-500/30 rounded-[40px] p-10 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-900/50"><span className="text-4xl">✓</span></div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">¡Publicado!</h2>
                <div className="space-y-3 mt-8">
                    <button onClick={resetForm} className="w-full bg-white text-black font-black uppercase py-4 rounded-xl hover:bg-gray-200 transition-all text-xs tracking-widest">Publicar Otra</button>
                    <Link href={listingType === 'SALE' ? '/' : '/auctions'} className="block w-full border border-slate-700 text-gray-400 font-bold uppercase py-4 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-xs tracking-widest">Ver Publicación</Link>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {!selectedCard && (
           <>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Publicar Venta</h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Elige el universo</p>
            <div className="grid grid-cols-2 gap-6 mb-12">
            {['Pokemon', 'Magic'].map((g) => (
                <button key={g} onClick={() => { setGame(g); setResults([]); setSelectedCard(null); setQuery(""); }} className={`relative h-24 rounded-2xl border transition-all ${game === g ? 'border-purple-500 bg-purple-900/20 shadow-lg shadow-purple-900/20' : 'border-slate-800 bg-slate-900/50 hover:border-gray-600'}`}>
                <span className={`text-xl font-black uppercase italic tracking-tighter ${game === g ? 'text-white' : 'text-gray-600'}`}>{g}</span>
                </button>
            ))}
            </div>
           </>
        )}

        {/* BUSCADOR */}
        {!selectedCard && (
          <div className="mb-12 relative z-20">
             <div className="relative group">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Buscar carta de ${game}...`} className="w-full bg-slate-900 text-white border border-slate-800 rounded-2xl py-6 pl-8 pr-20 text-lg font-bold placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-all shadow-lg" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {query && !loading && <button onClick={() => { setQuery(""); setResults([]); }} className="bg-slate-800 text-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all text-xs font-bold">✕</button>}
                    {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>}
                </div>
             </div>
          </div>
        )}

        {/* RESULTADOS (AHORA CON PRECIO VISUAL Y ORDENADOS) */}
        {!selectedCard && (
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">{query ? `Resultados` : `Sugerencias Populares de ${game}`}</h3>
                
                {query && results.length === 0 && !loading && (
                    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-300">
                        <div className="text-4xl mb-4">🤔</div>
                        <p className="text-white font-black uppercase italic text-lg mb-2">No encontramos nada</p>
                        <button onClick={() => setQuery("")} className="mt-2 text-xs text-white underline hover:text-purple-400 font-bold uppercase">Limpiar búsqueda</button>
                    </div>
                )}

                {(results.length > 0 || (!query && suggestions.length > 0)) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4">
                        {(query ? results : suggestions).map((card: any) => {
                            const safeImage = game === 'Pokemon' ? (card.images?.small || PLACEHOLDER_IMG) : (card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || PLACEHOLDER_IMG);
                            // Calculamos precio para mostrar en la grilla
                            const sortPrice = getDisplayPrice(card, game);
                            const displayPrice = sortPrice > 0 ? `$${Math.round(sortPrice * 950).toLocaleString('es-CL')}` : null;

                            return (
                                <div key={card.id} onClick={() => selectCard(card)} className="cursor-pointer group relative aspect-[2.5/3.5] bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-purple-500 hover:scale-105 transition-all shadow-xl">
                                    <Image src={safeImage} alt={card.name} fill className="object-contain" />
                                    {/* Etiqueta de Precio en la grilla */}
                                    {displayPrice && (
                                        <div className="absolute bottom-0 right-0 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-tl-xl border-t border-l border-slate-800">
                                            <span className="text-[10px] font-black text-green-400">{displayPrice}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {/* DASHBOARD (Sin Cambios, mantiene el gráfico interactivo) */}
        {selectedCard && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-300">
             <div className="lg:col-span-4 space-y-6">
                <div className="relative aspect-[2.5/3.5] bg-slate-900 rounded-[30px] border border-slate-800 shadow-[0_0_50px_rgba(168,85,247,0.1)] overflow-hidden">
                    <Image src={selectedCard.image} alt={selectedCard.name} fill className="object-contain p-4" />
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                    <h4 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest flex justify-between"><span>Price Points</span><span className="text-purple-500">CLP (Ref)</span></h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><span className="text-[10px] text-gray-500 uppercase font-bold">Market Price</span><span className="text-white font-black text-xl">{selectedCard.prices.market > 0 ? `$${selectedCard.prices.market.toLocaleString('es-CL')}` : '---'}</span></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800"><p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Mínimo</p><p className="text-green-400 font-bold">{selectedCard.prices.low > 0 ? `$${selectedCard.prices.low.toLocaleString('es-CL')}` : '---'}</p></div>
                            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800"><p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Máximo</p><p className="text-red-400 font-bold">{selectedCard.prices.high > 0 ? `$${selectedCard.prices.high.toLocaleString('es-CL')}` : '---'}</p></div>
                        </div>
                    </div>
                </div>
                
                <button type="button" onClick={() => setSelectedCard(null)} className="w-full py-4 text-xs font-black text-gray-500 hover:text-white uppercase tracking-widest border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all">← Seleccionar otra carta</button>
             </div>

             <div className="lg:col-span-8">
                 <form action={handlePublish} className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="mb-8">
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-2">{selectedCard.name}</h2>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest">{selectedCard.set}</span>
                                <span className="px-3 py-1 rounded-full border border-slate-700 bg-slate-800 text-gray-400 text-[10px] font-black uppercase tracking-widest">{selectedCard.rarity}</span>
                                <span className="px-3 py-1 rounded-full border border-slate-700 bg-slate-800 text-gray-400 text-[10px] font-black uppercase tracking-widest">#{selectedCard.number}</span>
                            </div>
                        </div>

                        {/* --- CHART COMPONENT --- */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Historial Interactivo</h3>
                                <span className="text-green-500 text-[10px] font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">Live Data</span>
                            </div>
                            <TradingViewChart currentPrice={selectedCard.prices.market || 5000} color={selectedCard.prices.market > 20000 ? "#a855f7" : "#22c55e"} />
                        </div>

                        <input type="hidden" name="cardId" value={selectedCard.id} />
                        <input type="hidden" name="cardName" value={selectedCard.name} />
                        <input type="hidden" name="cardSet" value={selectedCard.set} />
                        <input type="hidden" name="cardImage" value={selectedCard.image} />
                        <input type="hidden" name="cardRarity" value={selectedCard.rarity} />
                        <input type="hidden" name="cardNumber" value={selectedCard.number} />
                        <input type="hidden" name="game" value={game} />
                        <input type="hidden" name="type" value={listingType} /> 

                        <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                            <button type="button" onClick={() => setListingType("SALE")} className={`py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${listingType === "SALE" ? "bg-purple-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}>Venta Directa</button>
                            <button type="button" onClick={() => setListingType("AUCTION")} className={`py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${listingType === "AUCTION" ? "bg-pink-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}>Subasta</button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{listingType === "SALE" ? "Precio (CLP)" : "Precio Inicial (CLP)"}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-black">$</span>
                                    <input name="price" type="number" required placeholder={selectedCard.prices.market > 0 ? selectedCard.prices.market.toString() : "5000"} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-8 pr-4 font-black text-xl focus:border-purple-500 outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Estado</label>
                                <select name="condition" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 font-bold text-sm outline-none appearance-none cursor-pointer hover:border-gray-600 transition-all"><option value="NM">Near Mint (NM)</option><option value="LP">Lightly Played (LP)</option><option value="MP">Moderately Played (MP)</option></select>
                            </div>
                        </div>
                        
                        <button type="submit" disabled={isPublishing} className={`w-full font-black py-5 rounded-2xl uppercase text-sm tracking-widest transition-all ${isPublishing ? 'bg-gray-700 cursor-wait' : 'bg-white text-black hover:bg-green-500 hover:text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-green-500/30'}`}>{isPublishing ? "Procesando..." : (listingType === "SALE" ? "Publicar en Vitrina" : "Iniciar Subasta")}</button>
                    </div>
                 </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}