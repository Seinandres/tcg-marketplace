// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/* 🎨 MOTOR GRÁFICO SVG PREMIUM - 64-BIT RENDERING                           */
/* -------------------------------------------------------------------------- */

const PixelHero = ({ 
  color = "#3b82f6", 
  weaponType = "sword", 
  helmType = "knight", 
  armType = "armored",
  tier = 1
}) => {
  
  const C = {
    outline: "#020617",
    skin: "#ffedd5",
    skinShadow: "#fdba74",
    steel: "#e2e8f0",
    steelMid: "#94a3b8",
    darkSteel: "#475569",
    gold: "#fbbf24",
    goldDark: "#d97706",
    leather: "#78350f",
    highlight: "rgba(255,255,255,0.6)",
    shadow: "rgba(0,0,0,0.35)",
    glow: color,
  };

  const glowIntensity = tier * 0.15;

  return (
    <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.7)]" shapeRendering="crispEdges">
      
      {tier > 1 && (
        <g opacity={glowIntensity}>
          <ellipse cx="16" cy="16" rx="14" ry="14" fill={color} opacity="0.2" className="animate-pulse" />
          <ellipse cx="16" cy="16" rx="12" ry="12" fill={color} opacity="0.15" />
        </g>
      )}

      <ellipse cx="16" cy="30" rx="11" ry="2.5" fill="#000" opacity="0.5" />

      <g>
        <rect x="11" y="22" width="4" height="7" fill={C.darkSteel} />
        <rect x="11" y="22" width="1" height="7" fill={C.highlight} opacity="0.4" />
        <rect x="14" y="24" width="1" height="3" fill={C.shadow} />
        
        <rect x="17" y="22" width="4" height="7" fill={C.darkSteel} />
        <rect x="17" y="22" width="1" height="7" fill={C.highlight} opacity="0.4" />
        
        <path d="M11 29 h4 v1 h-4 z M17 29 h4 v1 h-4 z" fill={C.outline} />
        
        <rect x="12" y="24" width="2" height="1" fill={C.gold} />
        <rect x="18" y="24" width="2" height="1" fill={C.gold} />
      </g>

      <g>
        <rect x="10" y="14" width="12" height="9" fill={C.darkSteel} />
        <rect x="11" y="15" width="10" height="7" fill={color} />
        
        <rect x="11" y="15" width="4" height="3" fill={C.highlight} opacity="0.3" />
        <rect x="16" y="15" width="4" height="3" fill={C.shadow} opacity="0.4" />
        
        <rect x="15" y="16" width="2" height="5" fill={C.outline} opacity="0.2" />
        
        <rect x="10" y="22" width="12" height="2" fill={C.leather} />
        <rect x="15" y="22" width="2" height="2" fill={C.gold} />
        
        {tier > 2 && (
          <>
            <rect x="11" y="15" width="10" height="1" fill={C.gold} opacity="0.6" />
            <rect x="11" y="21" width="10" height="1" fill={C.gold} opacity="0.6" />
          </>
        )}
      </g>

      {armType === 'bare' ? (
         <>
           <g>
             <rect x="7" y="14" width="3" height="6" fill={C.skin} />
             <rect x="7" y="14" width="1" height="2" fill={C.skinShadow} />
             <rect x="9" y="15" width="1" height="4" fill={C.highlight} opacity="0.3" />
             
             <rect x="22" y="14" width="3" height="6" fill={C.skin} />
             <rect x="24" y="14" width="1" height="2" fill={C.skinShadow} />
             
             <rect x="7" y="16" width="3" height="1" fill={C.leather} />
             <rect x="22" y="16" width="3" height="1" fill={C.leather} />
           </g>
         </>
      ) : (
         <>
           <g>
             <rect x="7" y="13" width="4" height="5" fill={C.steelMid} />
             <rect x="8" y="14" width="2" height="2" fill={C.highlight} />
             <rect x="7" y="13" width="4" height="1" fill={C.gold} />
             
             <rect x="21" y="13" width="4" height="5" fill={C.steelMid} />
             <rect x="22" y="14" width="2" height="2" fill={C.highlight} />
             <rect x="21" y="13" width="4" height="1" fill={C.gold} />
             
             {tier > 2 && (
               <>
                 <rect x="7" y="12" width="1" height="2" fill={C.steel} />
                 <rect x="24" y="12" width="1" height="2" fill={C.steel} />
               </>
             )}
           </g>
         </>
      )}

      <rect x="12" y="7" width="8" height="7" fill={C.skin} />
      
      {helmType === 'knight' && (
        <g>
          <rect x="11" y="5" width="10" height="9" fill={C.steelMid} />
          <rect x="12" y="6" width="1" height="7" fill={C.highlight} />
          <rect x="19" y="6" width="1" height="7" fill={C.shadow} />
          
          <path d="M13 8 h6 v2 h-2 v3 h-2 v-3 h-2 z" fill={C.outline} />
          <rect x="15" y="9" width="2" height="1" fill="#dc2626" opacity="0.6" />
          
          <rect x="14" y="2" width="4" height="3" fill={color} />
          <rect x="15" y="1" width="2" height="2" fill={C.highlight} opacity="0.5" />
          
          <rect x="11" y="5" width="10" height="1" fill={C.gold} />
          <rect x="13" y="7" width="1" height="1" fill={C.gold} />
          <rect x="18" y="7" width="1" height="1" fill={C.gold} />
        </g>
      )}

      {helmType === 'viking' && (
        <g>
          <rect x="11" y="5" width="10" height="5" fill={C.darkSteel} />
          <rect x="12" y="6" width="8" height="3" fill={C.steelMid} />
          
          <path d="M9 4 h2 v3 h-2 z M21 4 h2 v3 h-2 z" fill="#fff" />
          <path d="M8 2 h2 v3 h-2 z M22 2 h2 v3 h-2 z" fill="#e2e8f0" />
          <rect x="8" y="2" width="1" height="2" fill={C.highlight} />
          <rect x="22" y="2" width="1" height="2" fill={C.highlight} />
          
          <rect x="15" y="9" width="2" height="3" fill={C.steel} />
          
          <rect x="11" y="11" width="10" height="5" fill="#d97706" />
          <rect x="12" y="12" width="8" height="3" fill="#f59e0b" />
          <rect x="13" y="15" width="6" height="2" fill="#b45309" />
          <rect x="14" y="16" width="4" height="1" fill="#78350f" />
          
          <rect x="10" y="13" width="1" height="3" fill="#b45309" />
          <rect x="21" y="13" width="1" height="3" fill="#b45309" />
          
          <rect x="13" y="9" width="2" height="1" fill="#dc2626" />
          <rect x="17" y="9" width="2" height="1" fill="#dc2626" />
        </g>
      )}

      {helmType === 'hood' && (
        <g>
           <rect x="10" y="4" width="12" height="10" fill={color} />
           <rect x="11" y="5" width="10" height="8" fill={C.shadow} opacity="0.6" />
           
           <rect x="12" y="6" width="8" height="6" fill="#000" opacity="0.7" />
           
           <rect x="14" y="9" width="1" height="2" fill="#22d3ee" className="animate-pulse" />
           <rect x="17" y="9" width="1" height="2" fill="#22d3ee" className="animate-pulse" />
           
           <rect x="10" y="4" width="1" height="2" fill={C.gold} />
           <rect x="21" y="4" width="1" height="2" fill={C.gold} />
           <rect x="15" y="3" width="2" height="1" fill={C.gold} />
        </g>
      )}

      {helmType === 'crown' && (
        <g>
           <rect x="11" y="5" width="10" height="4" fill={C.gold} />
           <rect x="12" y="6" width="8" height="2" fill="#fde047" />
           
           <rect x="11" y="3" width="2" height="2" fill={C.gold} />
           <rect x="15" y="3" width="2" height="2" fill={C.gold} />
           <rect x="19" y="3" width="2" height="2" fill={C.gold} />
           <rect x="11" y="2" width="2" height="1" fill="#fde047" />
           <rect x="15" y="2" width="2" height="1" fill="#fde047" />
           <rect x="19" y="2" width="2" height="1" fill="#fde047" />
           
           <rect x="12" y="4" width="1" height="1" fill="#dc2626" />
           <rect x="16" y="4" width="1" height="1" fill="#3b82f6" />
           <rect x="19" y="4" width="1" height="1" fill="#10b981" />
           
           <rect x="13" y="9" width="2" height="1" fill={C.outline} />
           <rect x="17" y="9" width="2" height="1" fill={C.outline} />
           <rect x="14" y="11" width="4" height="1" fill={C.outline} opacity="0.3" />
        </g>
      )}

      <g transform="translate(0,0)">
        {weaponType === 'sword' && (
           <g>
             <rect x="6" y="8" width="4" height="17" fill={C.steel} />
             <rect x="7" y="8" width="1" height="17" fill="#fff" opacity="0.7" />
             <rect x="9" y="9" width="1" height="15" fill={C.outline} opacity="0.3" />
             
             <path d="M6 7 h4 v2 h-1 v-1 h-2 v1 h-1 z" fill={C.steel} />
             <rect x="8" y="7" width="1" height="1" fill="#fff" />
             
             <rect x="5" y="25" width="6" height="3" fill={C.gold} />
             <rect x="5" y="25" width="6" height="1" fill="#fde047" />
             <rect x="4" y="26" width="1" height="1" fill={C.gold} />
             <rect x="11" y="26" width="1" height="1" fill={C.gold} />
             
             <rect x="7" y="28" width="2" height="4" fill={C.leather} />
             <rect x="7" y="29" width="2" height="1" fill={C.goldDark} />
             
             <rect x="6" y="32" width="4" height="1" fill={C.gold} />
             
             {tier > 2 && (
               <>
                 <rect x="8" y="12" width="1" height="1" fill={color} opacity="0.8" />
                 <rect x="8" y="16" width="1" height="1" fill={color} opacity="0.8" />
                 <rect x="8" y="20" width="1" height="1" fill={color} opacity="0.8" />
               </>
             )}
           </g>
        )}
        
        {weaponType === 'axe' && (
           <g>
             <rect x="7" y="5" width="2" height="26" fill={C.leather} />
             <rect x="7" y="6" width="1" height="24" fill="#92400e" />
             
             <rect x="6" y="8" width="4" height="1" fill={C.steel} />
             <rect x="6" y="16" width="4" height="1" fill={C.steel} />
             <rect x="6" y="24" width="4" height="1" fill={C.steel} />
             
             <path d="M3 7 h4 v10 h-4 z M9 7 h4 v10 h-4 z" fill={C.steelMid} />
             <path d="M3 7 h4 v1 h-4 z M9 7 h4 v1 h-4 z" fill={C.steel} />
             
             <rect x="2" y="8" width="1" height="8" fill="#fff" opacity="0.6" />
             <rect x="12" y="8" width="1" height="8" fill="#fff" opacity="0.6" />
             
             <rect x="4" y="10" width="2" height="1" fill={color} />
             <rect x="10" y="10" width="2" height="1" fill={color} />
             <rect x="4" y="13" width="2" height="1" fill={color} />
             <rect x="10" y="13" width="2" height="1" fill={color} />
             
             <rect x="6" y="31" width="4" height="1" fill={C.steel} />
           </g>
        )}

        {weaponType === 'spear' && (
           <g>
             <rect x="7" y="2" width="2" height="31" fill={C.leather} />
             <rect x="7" y="3" width="1" height="29" fill="#92400e" />
             
             <rect x="6" y="10" width="4" height="1" fill={C.gold} />
             <rect x="6" y="20" width="4" height="1" fill={C.gold} />
             
             <path d="M6 1 h4 v8 h-4 z" fill={C.steel} />
             <rect x="7" y="1" width="2" height="6" fill="#fff" opacity="0.6" />
             
             <rect x="8" y="2" width="1" height="5" fill={C.highlight} />
             
             <rect x="6" y="9" width="4" height="2" fill={C.gold} />
             <rect x="6" y="9" width="4" height="1" fill="#fde047" />
             
             {tier > 1 && (
               <>
                 <rect x="8" y="4" width="1" height="1" fill={color} opacity="0.9" />
                 <rect x="8" y="13" width="1" height="1" fill={color} opacity="0.7" />
                 <rect x="8" y="23" width="1" height="1" fill={color} opacity="0.5" />
               </>
             )}
           </g>
        )}

        {weaponType === 'hammer' && (
           <g>
             <rect x="7" y="7" width="2" height="22" fill={C.darkSteel} />
             <rect x="7" y="8" width="1" height="20" fill={C.steelMid} />
             
             <rect x="6" y="20" width="4" height="6" fill={C.leather} />
             <rect x="6" y="21" width="4" height="1" fill={C.outline} opacity="0.3" />
             <rect x="6" y="23" width="4" height="1" fill={C.outline} opacity="0.3" />
             <rect x="6" y="25" width="4" height="1" fill={C.outline} opacity="0.3" />
             
             <rect x="3" y="5" width="10" height="7" fill={C.steel} />
             <rect x="4" y="6" width="8" height="5" fill={C.steelMid} />
             
             <rect x="5" y="7" width="6" height="3" fill={C.darkSteel} />
             
             <rect x="4" y="6" width="2" height="2" fill={C.highlight} opacity="0.5" />
             
             <rect x="5" y="6" width="1" height="1" fill={C.gold} />
             <rect x="8" y="6" width="1" height="1" fill={C.gold} />
             <rect x="5" y="10" width="1" height="1" fill={C.gold} />
             <rect x="8" y="10" width="1" height="1" fill={C.gold} />
             
             <rect x="6" y="29" width="4" height="2" fill={C.gold} />
           </g>
        )}
      </g>

      <g>
        <rect x="20" y="16" width="9" height="11" rx="2" fill={color} stroke={C.outline} strokeWidth="1.5" />
        
        <rect x="20" y="16" width="9" height="2" fill={C.steel} opacity="0.8" />
        <rect x="20" y="25" width="9" height="2" fill={C.steel} opacity="0.8" />
        
        <rect x="22" y="19" width="5" height="5" fill={C.highlight} opacity="0.3" />
        <rect x="23" y="20" width="3" height="3" fill={C.gold} />
        
        <rect x="21" y="17" width="1" height="1" fill={C.gold} />
        <rect x="27" y="17" width="1" height="1" fill={C.gold} />
        <rect x="21" y="25" width="1" height="1" fill={C.gold} />
        <rect x="27" y="25" width="1" height="1" fill={C.gold} />
        
        {tier > 2 && (
          <>
            <rect x="22" y="18" width="1" height="1" fill="#fff" opacity="0.5" />
            <rect x="26" y="18" width="1" height="1" fill="#fff" opacity="0.5" />
            <rect x="24" y="24" width="1" height="1" fill="#fff" opacity="0.5" />
          </>
        )}
      </g>

      {tier >= 4 && (
        <g opacity="0.6" className="animate-pulse">
          <rect x="4" y="10" width="1" height="1" fill={color} />
          <rect x="27" y="8" width="1" height="1" fill={color} />
          <rect x="6" y="20" width="1" height="1" fill={color} />
          <rect x="26" y="22" width="1" height="1" fill={color} />
        </g>
      )}
      
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/* 📜 LORE ÉPICO UNIVERSAL - SIN REFERENCIAS GEOGRÁFICAS                    */
/* -------------------------------------------------------------------------- */

const MERCHANT_CLASSES = [
    { 
        id: "class_01", 
        name: "Vanguardia de Hierro", 
        subtitle: "El Bastión de la Estabilidad",
        benefit: "−3% Comisión Permanente", 
        bonusEffect: "Stack Infinito",
        lore: `Forjado en la volatilidad de mil mercados bajistas. La Vanguardia no busca el "hype" del momento, construye imperios ladrillo a ladrillo. Su reputación es tan sólida como su armadura. Cuando otros huyen del caos, él planta su escudo y convierte la incertidumbre en oportunidad.`,
        motivation: "La consistencia construye imperios. Sé inquebrantable.",
        specialPower: "Venta Garantizada: Prioridad en listados seguros",
        props: { color: "#ef4444", weaponType: "hammer", helmType: "knight", armType: "armored", tier: 3 }, 
        textColor: "text-red-500",
        bgGradient: "from-red-500/20",
        stats: { atk: 95, def: 85, speed: 70, luck: 80 },
        achievements: ["Primera Venta en 24hrs", "Vendedor Confiable", "Maestro del Precio Justo"]
    },
    { 
        id: "class_02", 
        name: "Soberano del Cénit", 
        subtitle: "Monarca de la Alta Gama",
        benefit: "+20% Visibilidad VIP", 
        bonusEffect: "Destacado Automático",
        lore: `Desde el trono de la abundancia, el Soberano solo trata con lo exquisito. No vende productos, vende estatus. Su sello real convierte cualquier ítem en un objeto de deseo inmediato. Los coleccionistas más exigentes compiten por ganarse su aprobación.`,
        motivation: "La calidad es la única divisa real. Gobierna el mercado.",
        specialPower: "Sello Real: +15% valor percibido en tus cartas",
        props: { color: "#3b82f6", weaponType: "sword", helmType: "crown", armType: "armored", tier: 4 }, 
        textColor: "text-blue-400",
        bgGradient: "from-blue-500/20",
        stats: { atk: 80, def: 90, speed: 85, luck: 95 },
        achievements: ["Vendedor Premium", "10 Ventas Perfectas", "Corona de Platino"]
    },
    { 
        id: "class_03", 
        name: "Saqueador de Tendencias", 
        subtitle: "Cazador de Volatilidad",
        benefit: "Recompensas x2 en Quests", 
        bonusEffect: "XP Doble",
        lore: `No espera a que el mercado se mueva; él ES el movimiento. Ataca rápido, asegura ganancias y desaparece antes de que la burbuja estalle. El riesgo es su desayuno. Mientras otros analizan gráficos, él ya cerró tres deals y está buscando el siguiente.`,
        motivation: "La velocidad mata a la competencia. Sé el primero.",
        specialPower: "Frenesí de Ventas: Cada venta aumenta tu velocidad de listing",
        props: { color: "#f97316", weaponType: "axe", helmType: "viking", armType: "bare", tier: 3 }, 
        textColor: "text-orange-400",
        bgGradient: "from-orange-500/20",
        stats: { atk: 100, def: 60, speed: 95, luck: 70 },
        achievements: ["Vendedor Relámpago", "Racha x5", "Conquistador del Mercado"]
    },
    { 
        id: "class_04", 
        name: "Árbitro del Pacto Dorado", 
        subtitle: "Guardián de la Confianza",
        benefit: "Seguro Anti-Estafa Total", 
        bonusEffect: "Devolución Garantizada",
        lore: `En un mundo de caos, él es la ley. Sus contratos son sagrados y su palabra es oro puro. Los compradores acuden a él buscando el refugio de la certeza absoluta. Su martillo no destruye, construye puentes de confianza inquebrantable entre vendedor y comprador.`,
        motivation: "La confianza es el recurso más escaso. Acorázala.",
        specialPower: "Sello de Confianza: 100% valoración positiva garantizada",
        props: { color: "#eab308", weaponType: "hammer", helmType: "knight", armType: "armored", tier: 4 }, 
        textColor: "text-yellow-400",
        bgGradient: "from-yellow-500/20",
        stats: { atk: 85, def: 100, speed: 65, luck: 85 },
        achievements: ["Comerciante Honesto", "0 Reclamos", "Leyenda de Confianza"]
    },
    { 
        id: "class_05", 
        name: "Lancero de la Primicia", 
        subtitle: "Francotirador de Ofertas",
        benefit: "Prioridad de Cola Absoluta", 
        bonusEffect: "Siempre Primero",
        lore: `Su visión trasciende los gráficos. Detecta la oportunidad antes de que exista. Su lanza atraviesa el ruido del mercado para clavar la venta perfecta en el momento exacto. No importa cuántos competidores existan... tu listing siempre aparece primero. Esa es su bendición.`,
        motivation: "Ser segundo es ser el primero de los perdedores.",
        specialPower: "Alcance Imperial: Tus listings aparecen en TODAS las búsquedas relevantes",
        props: { color: "#6366f1", weaponType: "spear", helmType: "knight", armType: "armored", tier: 3 }, 
        textColor: "text-indigo-400",
        bgGradient: "from-indigo-500/20",
        stats: { atk: 90, def: 75, speed: 100, luck: 75 },
        achievements: ["Velocidad de Luz", "Primera Impresión", "Alcance Total"]
    },
    { 
        id: "class_06", 
        name: "Sindicato de Sombras", 
        subtitle: "Arquitecto de la Red Oculta",
        benefit: "+8% Valor de Canje", 
        bonusEffect: "Bonus en Trades",
        lore: `Opera en los márgenes, donde las verdaderas fortunas se hacen. Conoce a quien tiene lo que buscas y a quien paga lo que pides. El mercado público es solo la punta del iceberg. Sus ofertas son místicas, sus precios justos pero inesperados. El mejor trato siempre está en las sombras.`,
        motivation: "Los mejores tratos nunca ven la luz del día.",
        specialPower: "Conexiones Místicas: Acceso a cartas raras de otros vendedores",
        props: { color: "#10b981", weaponType: "sword", helmType: "hood", armType: "armored", tier: 4 }, 
        textColor: "text-emerald-400",
        bgGradient: "from-emerald-500/20",
        stats: { atk: 75, def: 70, speed: 90, luck: 100 },
        achievements: ["Comerciante Misterioso", "Red Completa", "Maestro del Intercambio"]
    }
];

/* -------------------------------------------------------------------------- */
/* 🎯 SISTEMA DE STATS VISUAL                                               */
/* -------------------------------------------------------------------------- */

const StatBar = ({ label, value, color, icon }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center px-1">
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
        <span className="text-sm">{icon}</span> {label}
      </span>
      <span className="text-xs font-mono font-bold text-white">{value}</span>
    </div>
    <div className="relative h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
      <div 
        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${value}%`, 
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 10px ${color}80`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* 🏆 ACHIEVEMENT BADGES                                                     */
/* -------------------------------------------------------------------------- */

const AchievementBadge = ({ title, unlocked }: any) => (
  <div className={`px-3 py-2 rounded-xl border text-center transition-all ${
    unlocked 
      ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
      : 'bg-slate-900/30 border-slate-800 text-slate-600'
  }`}>
    <p className="text-[8px] font-black uppercase tracking-wider">{title}</p>
  </div>
);

/* -------------------------------------------------------------------------- */
/* 📱 COMPONENTE PRINCIPAL                                                   */
/* -------------------------------------------------------------------------- */

export default function HeroManagementPage() {
    const [selectedHero, setSelectedHero] = useState(MERCHANT_CLASSES[0]);
    const [name, setName] = useState("TraderLegend");
    const [bio, setBio] = useState("Forjador de imperios. Destructor de competencia desleal.");
    
    const hero = selectedHero || MERCHANT_CLASSES[0];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 pb-40 relative font-sans selection:bg-blue-500/30 overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
            <div className="absolute top-20 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] animate-pulse" />

            <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 relative z-10">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 border-b border-white/5 pb-8 gap-4">
                    <Link href="/dashboard" className="group flex items-center gap-4 text-slate-500 hover:text-white transition-all">
                        <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:border-white/20 text-xl transition-all">←</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Dashboard</span>
                    </Link>
                    <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-white to-slate-500 text-transparent bg-clip-text">
                        SEINA MARKET <span className="text-blue-500 text-sm align-top">ID</span>
                    </h1>
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-400 flex items-center gap-2 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" /> Sistema Online
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    <div className="lg:col-span-5 space-y-6 flex flex-col">
                        <div className="flex justify-between items-end px-4">
                            <h3 className="text-sm font-black italic uppercase text-slate-400 tracking-widest">Previsualización</h3>
                            <span className="text-[10px] font-mono text-slate-600">RENDER: ULTRA</span>
                        </div>
                        
                        <div className={`relative group w-full aspect-[4/5] bg-gradient-to-b from-slate-900 to-[#0a0f1e] rounded-[3rem] border-4 ${
                          hero.tier >= 4 ? 'border-yellow-500/30' : 'border-slate-800'
                        } p-8 flex items-center justify-center shadow-2xl overflow-hidden transition-all duration-500 hover:border-slate-700`}>
                            
                            <div className={`absolute inset-0 bg-gradient-to-t ${hero.bgGradient} to-transparent opacity-40 transition-opacity duration-500`} />
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                            <div className="relative w-full h-full scale-90 z-10 filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-95">
                                <PixelHero {...hero.props} />
                            </div>

                            <div className="absolute inset-0 pointer-events-none opacity-20 z-20" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 3px, 3px 100%' }} />

                            <div className="absolute bottom-6 inset-x-6 bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl z-30 transform transition-all duration-300 group-hover:translate-y-[-5px]">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-2xl font-black text-white italic tracking-tight uppercase leading-tight">{hero.name}</p>
                                            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-1">{hero.subtitle}</p>
                                        </div>
                                        <div className={`h-10 w-10 rounded-2xl ${hero.props.color === '#ef4444' ? 'bg-red-500/20' : hero.props.color === '#3b82f6' ? 'bg-blue-500/20' : hero.props.color === '#f97316' ? 'bg-orange-500/20' : hero.props.color === '#eab308' ? 'bg-yellow-500/20' : hero.props.color === '#6366f1' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'} border border-white/10 flex items-center justify-center text-xl shadow-lg`}>
                                            ⚡
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-bold ${hero.textColor} uppercase tracking-wider`}>{hero.benefit}</span>
                                            <span className="text-[8px] px-2 py-1 bg-white/5 rounded-full border border-white/10 text-slate-400 font-bold uppercase">{hero.bonusEffect}</span>
                                        </div>
                                        <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">⭐ {hero.specialPower}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Atributos de Batalla</h4>
                            <StatBar label="ATK" value={hero.stats.atk} color="#ef4444" icon="⚔️" />
                            <StatBar label="DEF" value={hero.stats.def} color="#3b82f6" icon="🛡️" />
                            <StatBar label="SPD" value={hero.stats.speed} color="#10b981" icon="⚡" />
                            <StatBar label="LCK" value={hero.stats.luck} color="#f59e0b" icon="🎲" />
                        </div>

                        <div className="bg-gradient-to-br from-slate-900/60 to-slate-900/20 border border-white/5 p-6 rounded-3xl shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent" />
                            <div className="space-y-3 pl-2">
                                <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-widest flex items-center gap-2">
                                    <span className="text-base">📜</span> Leyenda del Mercader
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                    {hero.lore}
                                </p>
                                <div className="pt-3 border-t border-white/5">
                                    <p className="text-[11px] font-black italic text-white">"{hero.motivation}"</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-base">🏆</span> Logros Desbloqueables
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {hero.achievements.map((ach, idx) => (
                                    <AchievementBadge key={idx} title={ach} unlocked={idx === 0} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-center space-y-10">
                        <div>
                            <h2 className="text-5xl lg:text-6xl font-black italic tracking-tighter text-white uppercase leading-[0.9]">
                                Forja tu <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Leyenda</span>
                            </h2>
                            <p className="text-slate-400 mt-4 max-w-md leading-relaxed">
                                Elige la clase que definirá tu legado en el mercado. 
                                Cada mercenario tiene poderes únicos que transformarán tu estrategia de ventas.
                            </p>
                        </div>
                        
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] space-y-10 backdrop-blur-sm relative">
                            <div className="absolute top-8 right-8 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-20" />

                            <div className="space-y-6">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block pl-2">Arsenal de Clases</label>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {MERCHANT_CLASSES.map((item) => (
                                        <button 
                                            key={item.id}
                                            onClick={() => setSelectedHero(item)}
                                            className={`relative p-5 rounded-[1.5rem] border-2 transition-all duration-300 flex flex-col items-center gap-3 group overflow-hidden ${
                                                selectedHero?.id === item.id 
                                                ? `bg-slate-800 border-${item.props.color === '#ef4444' ? 'red' : item.props.color === '#3b82f6' ? 'blue' : item.props.color === '#f97316' ? 'orange' : item.props.color === '#eab308' ? 'yellow' : item.props.color === '#6366f1' ? 'indigo' : 'emerald'}-500/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)]` 
                                                : 'bg-slate-950/50 border-transparent hover:bg-slate-900 hover:border-slate-700'
                                            }`}
                                        >
                                            {selectedHero?.id === item.id && (
                                                <>
                                                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff] animate-pulse" />
                                                    <div className={`absolute inset-0 bg-gradient-to-t ${item.bgGradient} to-transparent opacity-20`} />
                                                </>
                                            )}

                                            <div className="w-16 h-16 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 relative z-10">
                                                <PixelHero {...item.props} />
                                            </div>
                                            
                                            <div className="text-center w-full z-10 space-y-1">
                                                <p className={`text-[9px] font-black uppercase leading-none truncate ${selectedHero?.id === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                                    {item.name}
                                                </p>
                                                <p className={`text-[8px] font-bold uppercase truncate ${item.textColor}`}>
                                                    {item.benefit}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-5 pt-6 border-t border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-3">Nombre de Guerra</label>
                                        <input 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            className="w-full bg-black/50 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-700" 
                                            placeholder="Tu alias legendario"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-3">Lema Personal</label>
                                        <input 
                                            value={bio} 
                                            onChange={(e) => setBio(e.target.value)} 
                                            className="w-full bg-black/50 border border-slate-800 rounded-2xl py-4 px-6 text-xs font-medium text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all truncate" 
                                            placeholder="Tu frase épica"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-7 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-black uppercase text-sm tracking-[0.3em] rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 border border-white/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                <span className="relative z-10">Activar Protocolo Mercenario</span>
                                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </button>

                            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-wider mb-1">Advertencia del Sistema</p>
                                    <p className="text-[9px] text-slate-400 leading-relaxed">
                                        La clase seleccionada definirá tu estrategia comercial. Los beneficios son permanentes y acumulables. 
                                        <span className="text-yellow-400 font-bold"> ¡Elige con sabiduría!</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}