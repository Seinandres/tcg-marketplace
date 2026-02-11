// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";

// IMAGEN DE RESPALDO (Holograma de error)
const PLACEHOLDER_IMG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAEsCAMAAACwdH5pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzQ3QjUzQjQ3QjQ3MTFFMzg5RDhGMzQ3QjQ3QjQ3QjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzQ3QjUzQjU3QjQ3MTFFMzg5RDhGMzQ3QjQ3QjQ3QjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNDdCNTNCMjdBNDcxMUUzODlEOEYzNDdCNDdCNDdCNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNDdCNTNCMzdBNDcxMUUzODlEOEYzNDdCNDdCNDdCNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pol5jXAAAAA1UExURQAAACIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIk0/338AAAARdFJOUwBAgLxdf4Cw37+/gL+/v7+AtivxXQAAAAlwSFlzAAALEgAACxIB0t1+/AAAABhJREFUeNrtwTEBAAAAwqD1T20Kb6AAAAC4AwZgAAEq5p72AAAAAElFTkSuQmCC";

// --- COMPONENTE TRADINGVIEW STYLE (VISUALIZACIÓN DE MERCADO) ---
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
        <div className="bg-slate-950/80 rounded-2xl p-5 border border-white/5 shadow-inner backdrop-blur-sm relative overflow-hidden group">
            {/* Grid background effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {displayLabel}
                    </p>
                    <h3 className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">${displayPrice.toLocaleString('es-CL')}</h3>
                </div>
                <div className="flex gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
                    {['1M', '3M', '1Y'].map((tf) => (
                        <button key={tf} onClick={() => setTimeframe(tf)} className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all ${timeframe === tf ? 'bg-purple-600 text-white shadow' : 'text-gray-500 hover:text-white hover:bg-slate-800'}`}>{tf}</button>
                    ))}
                </div>
            </div>
            <div ref={containerRef} className="relative h-48 w-full cursor-crosshair group z-10" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`${pathD} V 100 H 0 Z`} fill="url(#fillGradient)" stroke="none" />
                    <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"/>
                    {hoverData && (
                        <>
                            <line x1={hoverData.xPos} y1="0" x2={hoverData.xPos} y2="100" stroke="#fff" strokeWidth="1" strokeDasharray="4" opacity="0.5" vectorEffect="non-scaling-stroke"/>
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

// Helper para extraer precio de lista
const getDisplayPrice = (card: any, game: string) => {
    let usd = 0;
    if (game === 'Pokemon') {
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
  
  // Estados para el Formulario (Manual)
  const [priceInput, setPriceInput] = useState("");
  const [conditionInput, setConditionInput] = useState("NM");

  // Estado Lore (Cortex AI)
  const [aiMessage, setAiMessage] = useState("ESPERANDO ENTRADA DE DATOS...");

  // Efectos de Lore
  useEffect(() => {
      if (isPublishing) setAiMessage("ENCRIPTANDO ACTIVO EN BLOCKCHAIN...");
      else if (isSuccess) setAiMessage("TRANSACCIÓN COMPLETADA CON ÉXITO.");
      else if (selectedCard) setAiMessage("ACTIVO SELECCIONADO. ESPERANDO VALORACIÓN...");
      else if (loading) setAiMessage("ESCANEANDO BASE DE DATOS GLOBAL...");
      else if (query) setAiMessage("BUSCANDO COINCIDENCIAS...");
      else setAiMessage("SISTEMA LISTO. SELECCIONE UNIVERSO.");
  }, [isPublishing, isSuccess, selectedCard, loading, query]);

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

  // BUSCADOR
  useEffect(() => {
    async function searchCards() {
        if (!debouncedQuery) { setResults([]); return; }
        setLoading(true);
        setResults([]); 
        try {
            let data = [];
            if (game === "Pokemon") {
                const cleanQuery = debouncedQuery.trim();
                const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${cleanQuery}*&pageSize=50&orderBy=-set.releaseDate`);
                const json = await res.json();
                data = json.data || [];
                data.sort((a: any, b: any) => getDisplayPrice(b, 'Pokemon') - getDisplayPrice(a, 'Pokemon'));
            } else {
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
    setPriceInput(normalizedCard.prices.market > 0 ? normalizedCard.prices.market.toString() : "5000");
    setResults([]); 
    setSuggestions([]);
  };

  // --- FUNCIÓN DE PUBLICACIÓN BLINDADA (PIPELINE) ---
  const handlePublish = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!selectedCard) return alert("Selecciona una carta primero, Operador.");
      const finalPrice = parseInt(priceInput);
      
      if (isNaN(finalPrice) || finalPrice <= 0) return alert("Error: El precio debe ser un número válido mayor a 0.");

      setIsPublishing(true);

      try {
        // === LA FUSIÓN CLAVE: ENVIAR DATOS PARA AUTO-INDEXADO ===
        const response = await fetch('/api/listings/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Datos de la Venta
            cardId: selectedCard.id,
            price: finalPrice,
            condition: conditionInput,
            type: listingType,
            
            // 🔥 DATOS DE LA CARTA (Para que la DB la conozca)
            cardName: selectedCard.name,
            cardImage: selectedCard.image,
            cardSet: selectedCard.set,
            cardRarity: selectedCard.rarity,
            cardNumber: selectedCard.number,
            game: game
          })
        });

        if (response.ok) {
            // Success Effect
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#00ffff', '#ff00ff', '#ffff00']
            });
            setIsSuccess(true);
        } else {
            const errorMsg = await response.text();
            alert("⚠️ FALLO EN DESPLIEGUE: " + errorMsg);
        }
      } catch (error) {
          console.error(error);
          alert("Error crítico de conexión con el servidor central.");
      } finally {
          setIsPublishing(false);
      }
  };

  // Navegación Inteligente al Dashboard
  const handleGoToDashboard = () => {
      router.push('/dashboard');
      router.refresh(); // <--- RECARGA FORZADA PARA VER LA CARTA NUEVA
  };

  const resetForm = () => {
      setIsSuccess(false);
      setSelectedCard(null);
      setQuery("");
      setResults([]);
      setListingType("SALE");
      setPriceInput("");
  };

  if (isSuccess && selectedCard) {
      return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Cyberpunk */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            
            <div className="max-w-md w-full bg-slate-900/90 border border-green-500/30 rounded-[30px] p-10 text-center shadow-[0_0_60px_rgba(34,197,94,0.3)] animate-in zoom-in duration-300 relative z-10 backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-[scan-horizontal_2s_infinite]"></div>
                
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)] border border-green-500">
                    <span className="text-4xl animate-bounce">✓</span>
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2 text-white">¡Despliegue Exitoso!</h2>
                <p className="text-green-400 font-mono text-xs mb-8">ACTIVO ID: {Math.floor(Math.random()*999999)} REGISTRADO</p>
                
                <div className="space-y-3 mt-8">
                    <button onClick={resetForm} className="w-full bg-white text-black font-black uppercase py-4 rounded-xl hover:bg-green-400 transition-all text-xs tracking-widest hover:scale-[1.02]">Publicar Otro Activo</button>
                    <button onClick={handleGoToDashboard} className="block w-full border border-slate-700 text-gray-400 font-bold uppercase py-4 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-xs tracking-widest hover:border-green-500/50">Ir al Centro de Comando</button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 font-sans selection:bg-purple-500/30 relative overflow-x-hidden">
      
      {/* CRT SCANLINES */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER CORTEX AI */}
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
            <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                    {selectedCard ? "Configurar Activo" : "Publicar Venta"}
                </h1>
                <p className="text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    CORTEX AI: {aiMessage}
                </p>
            </div>
        </div>

        {!selectedCard && (
           <div className="animate-in slide-in-from-bottom-4 duration-500">
            {/* SELECTOR DE UNIVERSO */}
            <div className="grid grid-cols-2 gap-4 mb-8">
            {['Pokemon', 'Magic'].map((g) => (
                <button key={g} onClick={() => { setGame(g); setResults([]); setSelectedCard(null); setQuery(""); }} className={`relative h-24 rounded-2xl border transition-all overflow-hidden group ${game === g ? 'border-cyan-500 bg-cyan-900/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shine_1s_infinite]"></div>
                    <span className={`text-2xl font-black uppercase italic tracking-tighter relative z-10 ${game === g ? 'text-cyan-400' : 'text-slate-600'}`}>{g}</span>
                </button>
            ))}
            </div>

            {/* BUSCADOR */}
             <div className="mb-12 relative z-20">
                 <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <span className="text-slate-500 text-xl">🔍</span>
                    </div>
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`INGRESAR NOMBRE DEL ACTIVO (${game})...`} className="w-full bg-slate-900/80 text-white border border-slate-700 rounded-2xl py-6 pl-14 pr-20 text-lg font-bold placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-slate-900 transition-all shadow-xl font-mono uppercase" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {query && !loading && <button onClick={() => { setQuery(""); setResults([]); }} className="bg-slate-800 text-gray-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-xs font-bold">✕</button>}
                        {loading && <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-600 border-t-cyan-500"></div>}
                    </div>
                 </div>
             </div>
           </div>
        )}

        {/* RESULTADOS */}
        {!selectedCard && (
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                    {query ? "COINCIDENCIAS ENCONTRADAS" : `ACTIVOS TENDENCIA: ${game.toUpperCase()}`}
                    <div className="h-px flex-1 bg-slate-800"></div>
                </h3>
                
                {query && results.length === 0 && !loading && (
                    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-300">
                        <div className="text-4xl mb-4 opacity-50">📡</div>
                        <p className="text-white font-black uppercase italic text-lg mb-2">Señal Perdida</p>
                        <p className="text-slate-500 text-xs font-mono">No se encontraron activos con esa denominación.</p>
                        <button onClick={() => setQuery("")} className="mt-4 text-xs text-cyan-400 underline hover:text-white font-bold uppercase">Reiniciar Escaneo</button>
                    </div>
                )}

                {(results.length > 0 || (!query && suggestions.length > 0)) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8">
                        {(query ? results : suggestions).map((card: any) => {
                            const safeImage = game === 'Pokemon' ? (card.images?.small || PLACEHOLDER_IMG) : (card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || PLACEHOLDER_IMG);
                            const sortPrice = getDisplayPrice(card, game);
                            const displayPrice = sortPrice > 0 ? `$${Math.round(sortPrice * 950).toLocaleString('es-CL')}` : null;

                            return (
                                <div key={card.id} onClick={() => selectCard(card)} className="cursor-pointer group relative aspect-[2.5/3.5] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-400 transition-all shadow-2xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:-translate-y-2">
                                    <Image src={safeImage} alt={card.name} fill className="object-contain p-1 group-hover:scale-110 transition-transform duration-500" />
                                    
                                    {/* Scanline effect on hover */}
                                    <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none animate-[scan-vertical_1s_linear_infinite]"></div>
                                    
                                    {/* Price Tag */}
                                    {displayPrice && (
                                        <div className="absolute bottom-0 right-0 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-tl-xl border-t border-l border-slate-700 group-hover:border-cyan-500">
                                            <span className="text-[10px] font-black text-cyan-400 font-mono">{displayPrice}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {/* --- FORMULARIO DE VENTA (DASHBOARD MODE) --- */}
        {selectedCard && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
             
             {/* COLUMNA IZQUIERDA: VISUALIZACIÓN */}
             <div className="lg:col-span-4 space-y-6">
                <div className="relative aspect-[2.5/3.5] bg-slate-900 rounded-[30px] border border-slate-800 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.2),transparent)] opacity-50"></div>
                    <Image src={selectedCard.image} alt={selectedCard.name} fill className="object-contain p-6 relative z-10 group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Holographic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"></div>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest flex justify-between border-b border-slate-800 pb-2">
                        <span>DATA DE MERCADO</span>
                        <span className="text-purple-400 animate-pulse">● LIVE</span>
                    </h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Valor de Mercado</span>
                            <span className="text-white font-black text-2xl font-mono">{selectedCard.prices.market > 0 ? `$${selectedCard.prices.market.toLocaleString('es-CL')}` : '---'}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-full opacity-50"></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                            <span>MIN: {selectedCard.prices.low > 0 ? `$${selectedCard.prices.low.toLocaleString('es-CL')}` : '---'}</span>
                            <span>MAX: {selectedCard.prices.high > 0 ? `$${selectedCard.prices.high.toLocaleString('es-CL')}` : '---'}</span>
                        </div>
                    </div>
                </div>
                
                <button type="button" onClick={() => setSelectedCard(null)} className="w-full py-4 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all group">
                    <span className="group-hover:-translate-x-1 inline-block transition-transform">←</span> ABORTAR OPERACIÓN
                </button>
             </div>

             {/* COLUMNA DERECHA: CONFIGURACIÓN */}
             <div className="lg:col-span-8">
                 <form onSubmit={handlePublish} className="bg-slate-900/80 border border-slate-800 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="mb-8 border-b border-white/5 pb-6">
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-white">{selectedCard.name}</h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded bg-slate-950 border border-slate-700 text-slate-400 text-[9px] font-black uppercase tracking-widest">{selectedCard.set}</span>
                                <span className="px-3 py-1 rounded bg-slate-950 border border-slate-700 text-slate-400 text-[9px] font-black uppercase tracking-widest">{selectedCard.rarity}</span>
                                <span className="px-3 py-1 rounded bg-slate-950 border border-slate-700 text-slate-400 text-[9px] font-black uppercase tracking-widest">#{selectedCard.number}</span>
                            </div>
                        </div>

                        {/* CHART COMPONENT */}
                        <div className="mb-10">
                            <TradingViewChart currentPrice={selectedCard.prices.market || 5000} color={selectedCard.prices.market > 20000 ? "#a855f7" : "#22c55e"} />
                        </div>

                        {/* SELECTOR TIPO VENTA */}
                        <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-inner">
                            <button type="button" onClick={() => setListingType("SALE")} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${listingType === "SALE" ? "bg-purple-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Venta Directa</button>
                            <button type="button" onClick={() => setListingType("AUCTION")} className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${listingType === "AUCTION" ? "bg-pink-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Subasta</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2 group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-purple-400 transition-colors">{listingType === "SALE" ? "PRECIO FINAL (CLP)" : "PUJA INICIAL (CLP)"}</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xl">$</span>
                                    <input 
                                        type="number" 
                                        value={priceInput}
                                        onChange={(e) => setPriceInput(e.target.value)}
                                        required 
                                        placeholder={selectedCard.prices.market > 0 ? selectedCard.prices.market.toString() : "5000"} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-10 pr-5 font-black text-2xl focus:border-purple-500 outline-none transition-all shadow-inner text-white placeholder-slate-700 font-mono" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-focus-within:text-purple-400 transition-colors">ESTADO FÍSICO</label>
                                <div className="relative">
                                    <select 
                                        value={conditionInput}
                                        onChange={(e) => setConditionInput(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-5 font-bold text-sm outline-none appearance-none cursor-pointer hover:border-slate-600 transition-all text-white shadow-inner"
                                    >
                                        <option value="NM">✨ Near Mint (Impecable)</option>
                                        <option value="LP">👌 Lightly Played (Leve)</option>
                                        <option value="MP">🛡️ Moderately Played (Uso)</option>
                                        <option value="HP">💀 Heavily Played (Dañada)</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* BOTÓN DE DESPLIEGUE */}
                        <button 
                          type="submit" 
                          disabled={isPublishing} 
                          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all relative overflow-hidden group ${
                              isPublishing 
                                ? 'bg-slate-800 text-slate-500 cursor-wait' 
                                : 'bg-white text-black hover:bg-green-400 hover:text-black shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(74,222,128,0.4)] hover:scale-[1.01]'
                          }`}
                        >
                             {isPublishing ? (
                                 <div className="flex items-center justify-center gap-3">
                                     <div className="w-4 h-4 border-2 border-slate-500 border-t-green-500 rounded-full animate-spin"></div>
                                     <span className="animate-pulse">ENCRIPTANDO ACTIVO...</span>
                                 </div>
                             ) : (
                                 <>
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {listingType === "SALE" ? "PUBLICAR EN VITRINA" : "INICIAR SUBASTA"} 
                                        <span className="text-lg">🚀</span>
                                    </span>
                                    {/* Brillo */}
                                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shine_0.8s_infinite]"></div>
                                 </>
                             )}
                        </button>

                    </div>
                 </form>
             </div>
          </div>
        )}
      </div>
      
      {/* Global Styles */}
      <style jsx global>{`
        @keyframes shine {
          100% { left: 100%; }
        }
        @keyframes scan-horizontal {
          0% { top: 0%; opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}