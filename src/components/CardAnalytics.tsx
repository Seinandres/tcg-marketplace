// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";

// --- GRÁFICO INTERACTIVO (Estilo TradingView) ---
const TradingViewChart = ({ currentPrice, color = "#22c55e" }: { currentPrice: number, color?: string }) => {
    const [timeframe, setTimeframe] = useState('1M');
    const [hoverData, setHoverData] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const points = timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 50;
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
    const displayLabel = hoverData ? hoverData.date : "Precio de Referencia";

    return (
        <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/50 shadow-inner h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
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
            <div ref={containerRef} className="relative h-40 w-full cursor-crosshair group" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverData(null)}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`${pathD} V 100 H 0 Z`} fill={`url(#grad-${color})`} stroke="none" />
                    <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
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

// --- DASHBOARD PRINCIPAL ---
export default function CardAnalytics({ priceData }: { priceData: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* IZQUIERDA: PUNTOS DE PRECIO */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex flex-col justify-center">
                <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest flex justify-between">
                    <span>Métricas de Mercado</span>
                    <span className="text-purple-500">CLP</span>
                </h4>
                
                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Precio Promedio</span>
                        <div className="text-right">
                            <span className="text-white font-black text-2xl">${priceData.market.toLocaleString('es-CL')}</span>
                            <p className="text-[9px] text-green-400 font-bold">▲ Demanda Alta</p>
                        </div>
                    </div>
                    
                    <div className="h-px bg-slate-800 w-full" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Mínimo Histórico</p>
                            <p className="text-green-400 font-bold text-lg">${priceData.low.toLocaleString('es-CL')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Máximo Reciente</p>
                            <p className="text-red-400 font-bold text-lg">${priceData.high.toLocaleString('es-CL')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DERECHA: GRÁFICO INTERACTIVO */}
            <div>
                <TradingViewChart currentPrice={priceData.market} color={priceData.market > 20000 ? "#a855f7" : "#22c55e"} />
            </div>
        </div>
    );
}