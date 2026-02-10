// @ts-nocheck
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 IMPORTANTE: Para la redirección

/* -------------------------------------------------------------------------- */
/* 🎨 MOTOR GRÁFICO SVG "PIXEL FORGE" (INTACTO)                               */
/* -------------------------------------------------------------------------- */

const PixelHero = ({ 
  color = "#3b82f6", 
  weaponType = "sword", 
  helmType = "knight", 
  bodyType = "plate", 
  tier = 1 
}) => {
  const C = {
    outline: "#020617", black: "#000000", skin: "#ffedd5", skinShadow: "#f97316",
    steelCrit: "#ffffff", steelLight: "#f1f5f9", steel: "#94a3b8", steelDim: "#475569", steelDark: "#1e293b",
    gold: "#fbbf24", goldLight: "#fef08a", goldDark: "#92400e",
    leather: "#854d0e", leatherDark: "#451a03", clothDark: "#172554", wood: "#7c2d12", fur: "#525252",
    highlight: "rgba(255,255,255,0.8)", shadow: "rgba(0,0,0,0.5)",
  };
  const glowOpacity = tier * 0.2;

  return (
    <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]" shapeRendering="crispEdges">
      <ellipse cx="16" cy="29" rx="11" ry="3" fill="#000" opacity="0.6" />
      {tier >= 3 && (
         <g className="animate-pulse" style={{ animationDuration: '3s' }}>
            <circle cx="16" cy="15" r="16" fill={color} opacity={glowOpacity * 0.6} filter="blur(12px)" />
            <circle cx="16" cy="15" r="14" fill={color} opacity={glowOpacity} filter="blur(8px)" />
         </g>
      )}
      
      {/* CUERPOS */}
      {bodyType === 'barbarian' && (
        <g>
          <rect x="11" y="24" width="4" height="6" fill={C.fur} />
          <rect x="17" y="24" width="4" height="6" fill={C.fur} />
          <rect x="10" y="23" width="6" height="2" fill={C.steelDark} />
          <rect x="16" y="23" width="6" height="2" fill={C.steelDark} />
          <rect x="11" y="20" width="10" height="4" fill={C.leather} />
          <rect x="14" y="20" width="4" height="3" fill={C.steelLight} />
          <rect x="10" y="13" width="12" height="8" fill={C.skin} />
          <rect x="10" y="13" width="1" height="8" fill={C.skinShadow} />
          <rect x="21" y="13" width="1" height="8" fill={C.skinShadow} />
          <rect x="11" y="16" width="4" height="2" fill={C.skinShadow} opacity="0.7" />
          <rect x="17" y="16" width="4" height="2" fill={C.skinShadow} opacity="0.7" />
          <rect x="12" y="18" width="3" height="1" fill={C.skinShadow} opacity="0.4" />
          <rect x="17" y="18" width="3" height="1" fill={C.skinShadow} opacity="0.4" />
          <rect x="6" y="13" width="4" height="8" fill={C.skin} />
          <rect x="22" y="13" width="4" height="8" fill={C.skin} />
          <rect x="6" y="15" width="1" height="4" fill={C.skinShadow} />
          <rect x="25" y="15" width="1" height="4" fill={C.skinShadow} />
          <rect x="6" y="17" width="4" height="3" fill={C.leatherDark} />
          <rect x="22" y="17" width="4" height="3" fill={C.leatherDark} />
          <rect x="6" y="18" width="1" height="1" fill={C.steelLight} />
          <rect x="25" y="18" width="1" height="1" fill={C.steelLight} />
        </g>
      )}
      {bodyType === 'royal' && (
        <g>
          <path d="M8 14 L5 28 L27 28 L24 14 Z" fill={color} />
          <rect x="5" y="27" width="22" height="1" fill={C.gold} />
          <rect x="12" y="24" width="3" height="6" fill={C.steelDark} />
          <rect x="17" y="24" width="3" height="6" fill={C.steelDark} />
          <rect x="12" y="29" width="3" height="1" fill={C.steelCrit} />
          <rect x="17" y="29" width="3" height="1" fill={C.steelCrit} />
          <rect x="11" y="14" width="10" height="10" fill={C.steel} />
          <rect x="13" y="14" width="6" height="10" fill={C.steelLight} />
          <rect x="11" y="22" width="10" height="3" fill={C.goldDark} />
          <rect x="15" y="21" width="2" height="5" fill={color} stroke={C.goldLight} strokeWidth="0.5" />
          <rect x="9" y="13" width="4" height="3" fill={C.gold} />
          <rect x="19" y="13" width="4" height="3" fill={C.gold} />
          <rect x="10" y="13" width="2" height="2" fill={C.goldLight} />
          <rect x="20" y="13" width="2" height="2" fill={C.goldLight} />
          <rect x="9" y="16" width="1" height="4" fill={C.goldDark} />
          <rect x="23" y="16" width="1" height="4" fill={C.goldDark} />
        </g>
      )}
      {bodyType === 'rogue' && (
        <g>
          <path d="M9 12 L8 29 L24 29 L23 12 Z" fill={C.clothDark} />
          <rect x="10" y="13" width="12" height="16" fill={color} opacity="0.15" style={{ mixBlendMode: 'overlay' }} />
          <rect x="12" y="29" width="3" height="1" fill={C.black} />
          <rect x="17" y="29" width="3" height="1" fill={C.black} />
          <rect x="8" y="12" width="16" height="4" fill={C.clothDark} />
        </g>
      )}
      {bodyType === 'heavy' && (
        <g>
          <rect x="10" y="23" width="5" height="7" fill={C.steelDark} />
          <rect x="17" y="23" width="5" height="7" fill={C.steelDark} />
          <rect x="10" y="28" width="5" height="2" fill={C.steel} />
          <rect x="17" y="28" width="5" height="2" fill={C.steel} />
          <rect x="9" y="14" width="14" height="10" fill={C.steelDim} />
          <rect x="10" y="15" width="12" height="8" fill={color} />
          <rect x="10" y="16" width="12" height="2" fill={C.highlight} opacity="0.4" />
          <path d="M4 12 h7 v7 h-7 z" fill={C.steel} />
          <path d="M21 12 h7 v7 h-7 z" fill={C.steel} />
          <rect x="5" y="13" width="5" height="5" fill={color} />
          <rect x="22" y="13" width="5" height="5" fill={color} />
          <rect x="4" y="12" width="7" height="1" fill={C.steelCrit} />
          <rect x="21" y="12" width="7" height="1" fill={C.steelCrit} />
          <rect x="4" y="13" width="1" height="6" fill={C.steelDark} />
          <rect x="27" y="13" width="1" height="6" fill={C.steelDark} />
          <rect x="14" y="22" width="4" height="7" fill={C.steel} />
          <rect x="15" y="22" width="2" height="6" fill={color} />
          <rect x="15" y="23" width="2" height="4" fill={C.highlight} opacity="0.3" />
        </g>
      )}
      {bodyType === 'plate' && (
        <g>
          <rect x="11" y="22" width="4" height="7" fill={C.steelDim} />
          <rect x="17" y="22" width="4" height="7" fill={C.steelDim} />
          <rect x="12" y="23" width="2" height="5" fill={C.steelLight} opacity="0.5" />
          <rect x="18" y="23" width="2" height="5" fill={C.steelLight} opacity="0.5" />
          <rect x="11" y="28" width="4" height="2" fill={C.steelDark} />
          <rect x="17" y="28" width="4" height="2" fill={C.steelDark} />
          <rect x="10" y="14" width="12" height="9" fill={C.steel} />
          <rect x="11" y="15" width="10" height="7" fill={color} />
          <rect x="11" y="15" width="2" height="7" fill={C.highlight} opacity="0.5" />
          <rect x="19" y="15" width="2" height="7" fill={C.shadow} opacity="0.5" />
          <rect x="13" y="17" width="6" height="3" fill={C.highlight} opacity="0.2" />
          <rect x="8" y="13" width="4" height="4" fill={C.steel} />
          <rect x="20" y="13" width="4" height="4" fill={C.steel} />
          <rect x="9" y="13" width="2" height="3" fill={C.steelLight} />
          <rect x="21" y="13" width="2" height="3" fill={C.steelLight} />
          <rect x="10" y="21" width="12" height="2" fill={C.leatherDark} />
          <rect x="14" y="21" width="4" height="3" fill={C.goldDark} />
          <rect x="15" y="22" width="2" height="1" fill={C.goldLight} />
        </g>
      )}
      {bodyType === 'robe' && (
        <g>
           <rect x="10" y="22" width="12" height="8" fill={C.steelDark} />
           <rect x="12" y="22" width="8" height="8" fill={color} />
           <rect x="10" y="29" width="12" height="1" fill={C.gold} opacity="0.8" />
           <rect x="10" y="14" width="12" height="8" fill={C.steel} />
           <rect x="10" y="14" width="3" height="16" fill={C.goldDark} />
           <rect x="19" y="14" width="3" height="16" fill={C.goldDark} />
           <rect x="11" y="15" width="1" height="14" fill={C.goldLight} />
           <rect x="20" y="15" width="1" height="14" fill={C.goldLight} />
           <path d="M7 12 h4 v5 h-4 z" fill={C.steelLight} />
           <path d="M21 12 h4 v5 h-4 z" fill={C.steelLight} />
           <rect x="8" y="13" width="2" height="3" fill={C.gold} />
           <rect x="22" y="13" width="2" height="3" fill={C.gold} />
           <rect x="7" y="12" width="4" height="1" fill={C.goldLight} />
           <rect x="21" y="12" width="4" height="1" fill={C.goldLight} />
        </g>
      )}

      {/* CABEZA */}
      <g transform="translate(0, -2)">
         <rect x="12" y="8" width="8" height="7" fill={C.skin} />
         {helmType === 'viking' && (
            <g>
               <rect x="11" y="6" width="10" height="4" fill={C.steel} />
               <rect x="12" y="6" width="8" height="1" fill={C.steelLight} opacity="0.5" />
               <path d="M8 4 h3 v3 h-3 z M21 4 h3 v3 h-3 z" fill={C.steelLight} />
               <path d="M8 4 h1 v3 h-1 z M23 4 h1 v3 h-1 z" fill={C.steelDark} />
               <rect x="11" y="11" width="10" height="6" fill={C.goldDark} /> 
               <rect x="12" y="12" width="8" height="4" fill={C.gold} />
            </g>
         )}
         {helmType === 'crown' && (
            <g>
               <rect x="11" y="5" width="10" height="3" fill={C.goldDark} />
               <rect x="11" y="6" width="10" height="1" fill={C.gold} />
               <rect x="11" y="3" width="2" height="2" fill={C.goldLight} />
               <rect x="15" y="2" width="2" height="3" fill={C.goldLight} />
               <rect x="19" y="3" width="2" height="2" fill={C.goldLight} />
               <rect x="12" y="6" width="1" height="1" fill="#ef4444" />
               <rect x="16" y="6" width="1" height="1" fill="#3b82f6" />
               <rect x="19" y="6" width="1" height="1" fill="#10b981" />
            </g>
         )}
         {helmType === 'hood' && (
            <g>
               <rect x="10" y="4" width="12" height="11" fill={C.clothDark} />
               <rect x="12" y="6" width="8" height="8" fill="#000" />
               <rect x="13" y="9" width="2" height="1" fill={color} className="animate-pulse" />
               <rect x="17" y="9" width="2" height="1" fill={color} className="animate-pulse" />
            </g>
         )}
         {helmType === 'knight' && (
            <g>
               <rect x="11" y="5" width="10" height="10" fill={C.steel} />
               <path d="M12 8 h8 v2 h-2 v3 h-4 v-3 h-2 z" fill={C.outline} />
               <rect x="14" y="9" width="4" height="1" fill={C.black} />
               <rect x="14" y="2" width="4" height="4" fill={color} /> 
            </g>
         )}
      </g>

      {/* ARMAS (SWAPPABLE) */}
      <g transform="translate(0,0)">
         {weaponType === 'axe' && (
            <g transform={`translate(${bodyType === 'barbarian' ? -2 : 0}, 0)`}>
               <rect x="6" y="4" width="2" height="26" fill={C.wood} />
               <path d="M2 6 h4 v12 h-4 z M8 6 h5 v12 h-5 z" fill={C.steel} />
               <rect x="2" y="6" width="1" height="12" fill={C.steelCrit} />
               <rect x="12" y="6" width="1" height="12" fill={C.steelCrit} />
               <rect x="5" y="8" width="4" height="8" fill={C.steelDark} />
            </g>
         )}
         {weaponType === 'sword' && (
            <g>
               <rect x="5" y="8" width="4" height="18" fill={C.steel} />
               <path d="M5 8 h4 l-2 -4 z" fill={C.steel} />
               <rect x="3" y="26" width="8" height="2" fill={C.gold} />
               <rect x="6" y="28" width="2" height="3" fill={C.leather} />
               <rect x="6" y="31" width="3" height="2" fill={C.gold} />
            </g>
         )}
         {weaponType === 'hammer' && (
            <g>
               <rect x="7" y="6" width="2" height="24" fill={C.steelDark} />
               <rect x="2" y="5" width="12" height="8" fill={C.steel} />
               <rect x="3" y="6" width="10" height="6" fill={C.steelDim} />
               <path d="M14 7 h3 v4 h-3 z" fill={C.steelDark} />
            </g>
         )}
         {weaponType === 'spear' && (
            <g>
               <rect x="7" y="0" width="1" height="32" fill={C.wood} />
               <path d="M6 0 h3 v8 h-3 z" fill={C.steel} />
               <rect x="7" y="0" width="1" height="8" fill={C.steelCrit} />
               <rect x="8" y="8" width="5" height="6" fill={color} />
            </g>
         )}
      </g>

      {/* ESCUDO */}
      <g>
         {bodyType === 'heavy' ? (
            <g>
               <rect x="20" y="14" width="11" height="14" fill={color} stroke={C.outline} />
               <rect x="20" y="14" width="1" height="14" fill={C.steelCrit} />
               <rect x="24" y="18" width="3" height="3" fill={C.gold} />
            </g>
         ) : bodyType === 'rogue' ? (
            <g>
               <rect x="26" y="18" width="2" height="8" fill={C.steel} />
               <path d="M26 18 h2 l-1 -3 z" fill={C.steelCrit} />
            </g>
         ) : (
            <g>
               <rect x="21" y="16" width="9" height="11" rx="1" fill={color} stroke={C.outline} />
               <rect x="21" y="16" width="1" height="11" fill={C.steel} />
               <rect x="24" y="19" width="3" height="3" fill={C.gold} />
            </g>
         )}
      </g>
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/* ⚔️ ARMERÍA DE MERCADO (DATOS DE ARMAS)                                     */
/* -------------------------------------------------------------------------- */

const WEAPON_ARSENAL = [
  { id: "sword", name: "Espada del Trato", benefit: "+5% Reputación", desc: "Equilibrio perfecto. Atrae clientes confiables.", icon: "⚔️" },
  { id: "axe", name: "Hacha de Rebaja", benefit: "-2% Comisión", desc: "Corta los precios para mover volumen masivo.", icon: "🪓" },
  { id: "hammer", name: "Mazo de Justicia", benefit: "Protección Total", desc: "Tus disputas se resuelven a tu favor.", icon: "🔨" },
  { id: "spear", name: "Lanza de Alcance", benefit: "+10% Visibilidad", desc: "Tus productos llegan a clientes más lejanos.", icon: "🔱" }
];

/* -------------------------------------------------------------------------- */
/* 📜 LORE: TCG MARKETPLACE RPG                                              */
/* -------------------------------------------------------------------------- */

const MERCHANT_CLASSES = [
    { 
        id: "warrior", 
        name: "Titán del Bulk", 
        subtitle: "Guerrero de Volumen",
        benefit: "Venta Rápida de Lotes", 
        bonusEffect: "Storage+",
        difficulty: "Fácil",
        style: "Pasivo",
        lore: `No vendes cartas sueltas, vendes ejércitos. Tu especialidad es mover cajas enteras. Donde otros ven basura, tú ves márgenes de ganancia bruta.`,
        motivation: "El volumen siempre gana.",
        buffs: ["Resistencia al Regateo", "Carga Máxima"],
        starterGear: [
            { name: "Martillo de Lote", desc: "Aplasta precios para mover stock rápido." },
            { name: "Cajas de Stock", desc: "+500 espacio de inventario inicial." },
            { name: "Báscula Precisa", desc: "Calcula envíos de bulk automáticamente." }
        ],
        props: { color: "#ef4444", weaponType: "hammer", helmType: "knight", bodyType: "heavy", tier: 3 }, 
        textColor: "text-red-400",
        bgGradient: "from-red-500/20",
        stats: { atk: 95, def: 90, speed: 40, luck: 60 },
        achievements: ["1000 Ventas", "Rey del Bulk", "Inventario Infinito"]
    },
    { 
        id: "king", 
        name: "Lord del High-End", 
        subtitle: "Monarca de la Rareza",
        benefit: "Acceso a Subastas VIP", 
        bonusEffect: "Destacado",
        difficulty: "Difícil",
        style: "Estratégico",
        lore: `Solo tocas lo que brilla. Tu carpeta no tiene cartas comunes, solo primeras ediciones y gemas graduadas. Los coleccionistas más ricos acuden a ti.`,
        motivation: "Calidad sobre cantidad.",
        buffs: ["Aura de Prestigio", "Cliente VIP"],
        starterGear: [
            { name: "Espada Ceremonial", desc: "Aumenta el prestigio de tu tienda." },
            { name: "Expositor Cristal", desc: "Mejora las fotos de tus productos." },
            { name: "Guantes Blancos", desc: "Garantía de manipulación segura." }
        ],
        props: { color: "#eab308", weaponType: "sword", helmType: "crown", bodyType: "royal", tier: 4 }, 
        textColor: "text-yellow-400",
        bgGradient: "from-yellow-500/20",
        stats: { atk: 60, def: 80, speed: 50, luck: 100 },
        achievements: ["Venta de $10k", "Colección Museo", "Trato Cerrado"]
    },
    { 
        id: "rogue", 
        name: "Sniper de Ofertas", 
        subtitle: "Pícaro del Margen",
        benefit: "Alertas de Precio Bajo", 
        bonusEffect: "Ping 1ms",
        difficulty: "Experto",
        style: "Agresivo",
        lore: `Vives en el refresco de página. Encuentras ese error de precio a las 3 AM. Compras barato, vendes caro, y desapareces antes de que el mercado se de cuenta.`,
        motivation: "La velocidad es dinero.",
        buffs: ["Paso Sombra", "Ojo de Halcón"],
        starterGear: [
            { name: "Daga de Puja", desc: "Ofertas automáticas de último segundo." },
            { name: "Bot de Rastreo", desc: "Notificaciones de precios bajos." },
            { name: "Capa Invisible", desc: "Oculta tu historial de compras." }
        ],
        props: { color: "#10b981", weaponType: "sword", helmType: "hood", bodyType: "rogue", tier: 3 }, 
        textColor: "text-emerald-400",
        bgGradient: "from-emerald-500/20",
        stats: { atk: 90, def: 30, speed: 100, luck: 80 },
        achievements: ["Snipe Legendario", "Flip Rápido", "Ojo de Halcón"]
    },
    { 
        id: "wizard", 
        name: "Alquimista del Grado", 
        subtitle: "Mago de la Valoración",
        benefit: "Envíos a PSA/BGS", 
        bonusEffect: "Grade+",
        difficulty: "Medio",
        style: "Técnico",
        lore: `Tienes el ojo místico. Ves un 10 donde otros ven un 9. Limpias, preparas y gradúas cartas para multiplicar su valor x10. Transformas cartón en oro.`,
        motivation: "El valor está en los detalles.",
        buffs: ["Transmutación", "Visión Verdadera"],
        starterGear: [
            { name: "Báculo Lupa", desc: "Detecta imperfecciones invisibles." },
            { name: "Kit de Limpieza", desc: "Restaura el brillo de las cartas." },
            { name: "Fundas Mágicas", desc: "Protección contra UV y humedad." }
        ],
        props: { color: "#8b5cf6", weaponType: "spear", helmType: "hood", bodyType: "robe", tier: 4 }, 
        textColor: "text-purple-400",
        bgGradient: "from-purple-500/20",
        stats: { atk: 70, def: 60, speed: 60, luck: 95 },
        achievements: ["Gem Mint 10", "Ojo Clínico", "Retorno Mágico"]
    },
    { 
        id: "ranger", 
        name: "Explorador de Sets", 
        subtitle: "Cazador de Novedades",
        benefit: "Pre-Venta Anticipada", 
        bonusEffect: "Early Access",
        difficulty: "Medio",
        style: "Especulativo",
        lore: `Siempre un paso adelante del meta. Sabes qué carta se jugará en el próximo torneo. Acumulas stock de cartas 'inútiles' que mañana valdrán una fortuna.`,
        motivation: "Conocimiento es poder.",
        buffs: ["Rastreo de Mercado", "Tiro Certero"],
        starterGear: [
            { name: "Lanza Tendencia", desc: "Marca cartas que subirán de precio." },
            { name: "Botas de Set", desc: "Acceso a pre-ventas exclusivas." },
            { name: "Mapa de Meta", desc: "Guía de mazos competitivos." }
        ],
        props: { color: "#f97316", weaponType: "spear", helmType: "knight", bodyType: "plate", tier: 3 }, 
        textColor: "text-orange-400",
        bgGradient: "from-orange-500/20",
        stats: { atk: 85, def: 50, speed: 85, luck: 70 },
        achievements: ["Predicción Correcta", "Stock Listo", "Líder de Meta"]
    },
    { 
        id: "barbarian", 
        name: "Rompedor de Cajas", 
        subtitle: "Berserker del Azar",
        benefit: "Doble Loot Points", 
        bonusEffect: "RNG Boost",
        difficulty: "Fácil",
        style: "Caótico",
        lore: `La emoción de abrir sobres es tu combustible. No compras singles, los cazas. Tu tienda está llena de 'hits' frescos sacados directamente del sobre.`,
        motivation: "¡Todo o nada!",
        buffs: ["Suerte de Principiante", "Furia de Apertura"],
        starterGear: [
            { name: "Hacha de Corte", desc: "Abre sobres con estilo." },
            { name: "Tapete Suerte", desc: "+5% Suerte en aperturas en vivo." },
            { name: "Caja Fresca", desc: "Garantiza un hit por box break." }
        ],
        props: { color: "#ef4444", weaponType: "axe", helmType: "viking", bodyType: "barbarian", tier: 3 }, 
        textColor: "text-red-500",
        bgGradient: "from-red-500/20",
        stats: { atk: 100, def: 40, speed: 90, luck: 100 },
        achievements: ["God Pack", "Chase Card", "Manos de Suerte"]
    }
];

/* -------------------------------------------------------------------------- */
/* 🧩 COMPONENTES UI (Stats, Badges, Modal, Ticker, Gear)                   */
/* -------------------------------------------------------------------------- */

const StatBar = ({ label, value, color, icon }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center px-1">
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
        <span className="text-lg opacity-80">{icon}</span> {label}
      </span>
      <span className="text-[10px] font-mono font-bold text-white">{value}</span>
    </div>
    <div className="relative h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 shadow-inner">
      <div 
        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${value}%`, 
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          boxShadow: `0 0 10px ${color}80`,
          animation: 'loadBar 1s ease-out forwards'
        }}
      />
    </div>
  </div>
);

const AchievementBadge = ({ title, unlocked }: any) => (
  <div className={`px-2 py-1.5 rounded-lg border text-center transition-all ${
    unlocked 
      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' 
      : 'bg-slate-900/40 border-slate-800/60 text-slate-600 opacity-60'
  }`}>
    <p className="text-[7px] font-black uppercase tracking-wider truncate">{title}</p>
  </div>
);

// NUEVO: COMPONENTE "BUFF TRAY" (Iconos de estado)
const BuffTray = ({ buffs, color }) => (
    <div className="flex gap-2 mt-4 animate-[fadeIn_0.5s_ease-out]">
        {buffs.map((buff, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-slate-300 uppercase tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                {buff}
            </div>
        ))}
    </div>
);

// NUEVO: COMPONENTE "XP BAR"
const RankProgress = ({ color }) => (
    <div className="w-full mt-4">
        <div className="flex justify-between items-end mb-1">
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Nivel 1</span>
            <span className="text-[8px] font-mono text-slate-400">0 / 1000 XP</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[5%] bg-white animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
        </div>
    </div>
);

const WeaponSelector = ({ currentWeapon, onSelect, color }) => {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl shadow-inner mb-6 transition-all duration-300 hover:border-white/10">
      <div className="flex justify-between items-center mb-4">
         <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
            <span className="text-lg">⚔️</span> Armería Estratégica
         </h4>
         <span className="text-[8px] uppercase font-bold text-slate-500 bg-black/40 px-2 py-1 rounded border border-white/5">Buff Activo</span>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
         {WEAPON_ARSENAL.map((w) => (
            <button
               key={w.id}
               onClick={() => onSelect(w.id)}
               className={`relative group flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                  currentWeapon === w.id 
                  ? 'bg-white/10 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105' 
                  : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/20'
               }`}
            >
               <span className="text-3xl mb-2 filter drop-shadow-lg group-hover:scale-110 transition-transform">{w.icon}</span>
               {currentWeapon === w.id && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_#4ade80]" />
               )}
            </button>
         ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/5 animate-[fadeIn_0.3s_ease-out]">
         {WEAPON_ARSENAL.map(w => w.id === currentWeapon && (
            <div key={w.id} className="flex flex-col gap-2">
               <div className="flex justify-between items-start">
                   <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wide">{w.name}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-1">{w.desc}</p>
                   </div>
                   <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-[9px] font-bold text-green-400 uppercase tracking-wide shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                      {w.benefit}
                   </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

const GearSlot = ({ item, color, onHover, onLeave }: any) => (
  <div 
    className="flex flex-col items-center gap-2 group cursor-help relative"
    onMouseEnter={() => onHover(item)}
    onMouseLeave={onLeave}
  >
    <div 
      className="w-12 h-12 bg-[#0f172a] rounded-xl border-2 flex items-center justify-center text-xl shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      style={{ borderColor: `${color}60` }}
    >
      {item.name.includes("Espada") || item.name.includes("Daga") || item.name.includes("Hacha") || item.name.includes("Lanza") || item.name.includes("Martillo") || item.name.includes("Báculo") ? "⚔️" :
       item.name.includes("Capa") || item.name.includes("Placas") || item.name.includes("Túnica") || item.name.includes("Pieles") ? "🛡️" : "🧿"}
    </div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide text-center max-w-[70px] leading-tight group-hover:text-white transition-colors">
        {item.name}
    </span>
  </div>
);

const HoloCard = ({ children, color }) => {
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div 
            ref={cardRef}
            className="relative w-full h-full perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
        >
            <div 
                className="w-full h-full transition-transform duration-100 ease-out preserve-3d shadow-2xl rounded-[2.5rem]"
                style={{ 
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    boxShadow: `${-rotation.y * 2}px ${rotation.x * 2}px 30px rgba(0,0,0,0.5)`
                }}
            >
                <div 
                    className="absolute inset-0 z-50 rounded-[2.5rem] pointer-events-none opacity-40 mix-blend-overlay bg-gradient-to-tr from-transparent via-white to-transparent"
                    style={{
                        background: `linear-gradient(${135 + rotation.y * 5}deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)`
                    }}
                />
                {children}
            </div>
        </div>
    );
};

const SuccessModal = ({ isOpen, onClose, heroName, color }) => {
  const router = useRouter(); // Instanciamos el router

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-[#0f172a] border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-[0_0_100px_rgba(0,255,0,0.2)] overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }} />
        <div className="relative z-10 text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center border-2 border-white/20 text-4xl shadow-2xl animate-bounce">
            ⚔️
          </div>
          <div>
            <h3 className="text-2xl font-black italic uppercase text-white mb-2">Clase Seleccionada</h3>
            <p className="text-sm text-slate-400">
              Has comenzado tu viaje como <span className="text-white font-bold" style={{ color: color }}>{heroName}</span>.
            </p>
            <p className="text-xs text-slate-500 mt-2">Tu tienda ha sido actualizada con nuevos beneficios.</p>
          </div>
          {/* Botón con redirección */}
          <button 
             onClick={() => router.push('/dashboard')} 
             className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold uppercase tracking-widest text-xs transition-all text-white"
          >
            Comenzar a Vender
          </button>
        </div>
      </div>
    </div>
  );
};

const MarketTicker = () => (
  <div className="w-full bg-[#050a14] border-b border-white/5 py-1.5 overflow-hidden flex items-center gap-8 relative z-20">
    <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[9px] font-sans font-bold text-slate-400 uppercase tracking-widest">
      <span className="flex items-center gap-1"><span className="text-green-500">▲</span> CHARIZARD 1ST ED <span className="text-green-400">$25,400</span></span>
      <span className="flex items-center gap-1"><span className="text-red-500">▼</span> BLACK LOTUS (POOR) <span className="text-red-400">$4,200</span></span>
      <span className="flex items-center gap-1"><span className="text-green-500">▲</span> ONE RING 001/001 <span className="text-green-400">$2.1M</span></span>
      <span className="flex items-center gap-1"><span className="text-slate-500">=</span> PIKACHU ILLUS. <span className="text-slate-300">$850,000</span></span>
      <span className="flex items-center gap-1"><span className="text-green-500">▲</span> MOX SAPPHIRE <span className="text-green-400">$12,500</span></span>
      <span className="flex items-center gap-1"><span className="text-red-500">▼</span> SHEOLDRED <span className="text-red-400">$65</span></span>
    </div>
  </div>
);

const LiveTransactionFeed = () => {
    const [sales, setSales] = useState([
        { user: "PokeWhale99", item: "Charizard Base Set", price: "$4,500" },
    ]);

    useEffect(() => {
        const items = ["Black Lotus", "Mox Ruby", "Gengar VMAX", "Umbreon VMAX Alt", "Blue-Eyes White Dragon"];
        const users = ["AshKetchum", "YugiMoto", "GaryOak", "SetoKaiba", "RedTrainer"];
        
        const interval = setInterval(() => {
            const newItem = {
                user: users[Math.floor(Math.random() * users.length)],
                item: items[Math.floor(Math.random() * items.length)],
                price: "$" + (Math.floor(Math.random() * 2000) + 100).toLocaleString()
            };
            setSales(prev => [newItem, ...prev].slice(0, 2)); 
        }, 4000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            {sales.map((sale, i) => (
                <div key={i} className="bg-[#0f172a]/95 border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 animate-[slideInRight_0.4s_ease-out] w-72 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs shadow-lg">📦</div>
                    <div className="flex flex-col">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{sale.user} vendió</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-xs text-white font-bold italic">{sale.item}</p>
                            <span className="text-[10px] text-green-400 font-bold bg-green-900/20 px-1.5 rounded">{sale.price}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const InteractiveBackground = ({ color }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        // setMousePosition({ x, y }); // Optimización: removido si no se usa para evitar re-renders
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden bg-[#020617] transition-colors duration-1000">
      {/* Luz Ambiental Dinámica */}
      <div 
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: color }}
      />
      {/* Partículas Flotantes */}
      <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
             <div 
               key={i}
               className="absolute w-1 h-1 rounded-full animate-float"
               style={{
                  backgroundColor: color,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 5 + 5}s`,
                  animationDelay: `${Math.random() * 2}s`
               }}
             />
          ))}
      </div>
      <div className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
        }} 
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 📱 PÁGINA PRINCIPAL                                                       */
/* -------------------------------------------------------------------------- */

export default function HeroManagementPage() {
    const [selectedHero, setSelectedHero] = useState(MERCHANT_CLASSES[0]);
    const [selectedWeapon, setSelectedWeapon] = useState(MERCHANT_CLASSES[0].props.weaponType);
    const [name, setName] = useState("CardMaster");
    const [bio, setBio] = useState("Especialista en condiciones Mint. Envíos rápidos.");
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [tooltipItem, setTooltipItem] = useState(null); 
    
    const hero = selectedHero || MERCHANT_CLASSES[0];
    const currentWeaponData = WEAPON_ARSENAL.find(w => w.id === selectedWeapon) || WEAPON_ARSENAL[0];

    const handleClassChange = (item) => {
        setSelectedHero(item);
        setSelectedWeapon(item.props.weaponType); 
    };

    const handleSave = () => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setShowSuccess(true);
      }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 pb-40 relative font-sans selection:bg-purple-500/30 overflow-hidden flex flex-col">
            
            <MarketTicker />
            <LiveTransactionFeed />
            
            {/* FONDO DINÁMICO REAGIENDO AL COLOR DE LA CLASE */}
            <InteractiveBackground color={hero.props.color} />
            
            <SuccessModal 
              isOpen={showSuccess} 
              onClose={() => setShowSuccess(false)} 
              heroName={hero.name}
              color={hero.props.color}
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 relative z-10 w-full">
                
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/5 pb-8 gap-6">
                    <Link href="/dashboard" className="group flex items-center gap-4 text-slate-500 hover:text-white transition-all">
                        <div className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center group-hover:bg-slate-800 group-hover:border-white/20 text-lg transition-all shadow-lg">←</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors">Volver al Mercado</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-xl">
                            SEINA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MARKET</span>
                        </h1>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Selecciona tu Arquetipo de Vendedor</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[9px] font-bold text-blue-400 flex items-center gap-2 uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> Servidor Seguro
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* COLUMNA IZQUIERDA: VISUALIZACIÓN */}
                    <div className="lg:col-span-5 space-y-6 flex flex-col">
                        
                        {/* CONTENEDOR HÉROE (HOLO-FOIL 3D) - MOVIDO AL INICIO */}
                        <div className="aspect-[4/5]">
                            <HoloCard color={hero.props.color}>
                                <div className={`relative w-full h-full bg-[#050a14] rounded-[2.5rem] border-4 ${
                                    hero.tier >= 4 ? 'border-yellow-500/20' : 'border-slate-800'
                                } p-8 flex items-center justify-center overflow-hidden`}>
                                    
                                    <div className={`absolute inset-0 bg-gradient-to-t ${hero.bgGradient} to-transparent opacity-20 transition-opacity duration-500`} />
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                                    {/* HÉROE ESCALADO CON ARMA PERSONALIZADA */}
                                    <div className="relative w-full h-full scale-110 z-10 flex items-center justify-center filter drop-shadow-2xl">
                                        <PixelHero {...hero.props} weaponType={selectedWeapon} />
                                    </div>

                                    <div className="absolute bottom-6 inset-x-6 bg-slate-900/90 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl z-30">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1">
                                                    <p className="text-xl font-black text-white italic tracking-tight uppercase leading-tight drop-shadow-md">{hero.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{hero.subtitle}</p>
                                                </div>
                                                <div className={`h-8 w-8 rounded-lg border border-white/10 flex items-center justify-center text-xs shadow-lg bg-white/5`}>
                                                    {hero.tier}⭐
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {/* BENEFICIOS ACTIVOS: CLASE + ARMA */}
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                                                        <span className={`text-[9px] font-bold ${hero.textColor} uppercase tracking-wider flex items-center gap-2`}>
                                                            <span className="text-xs">👤</span> {hero.benefit}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                                                        <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
                                                            <span className="text-xs">{currentWeaponData.icon}</span> {currentWeaponData.benefit}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </HoloCard>
                        </div>
                         
                        <div className="flex justify-between items-end px-4">
                            <h3 className="text-xs font-black italic uppercase text-slate-400 tracking-widest">Vista Previa</h3>
                            <span className="text-[9px] font-bold text-purple-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping"></span>EN VIVO</span>
                        </div>

                         {/* LORE (MOVIDO DEBAJO DE LA CARTA) */}
                        <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors animate-[fadeIn_0.5s_ease-out]">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
                            <div className="space-y-3 pl-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                        <span className="text-base">📜</span> Biografía del Vendedor
                                    </h4>
                                    <div className="flex gap-2">
                                        <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${
                                            hero.difficulty === "Fácil" ? "border-green-500/30 text-green-400 bg-green-500/10" : 
                                            hero.difficulty === "Medio" ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" : 
                                            "border-red-500/30 text-red-400 bg-red-500/10"
                                        }`}>{hero.difficulty}</span>
                                        <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded border border-blue-500/30 text-blue-400 bg-blue-500/10">{hero.style}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed font-medium italic opacity-90 animate-[fadeIn_0.5s_ease-out]">
                                    "{hero.lore}"
                                </p>
                                <div className="pt-3 border-t border-white/5">
                                    <p className="text-[10px] font-bold text-blue-400 flex items-center gap-2">LEMA: <span className="text-white italic">"{hero.motivation}"</span></p>
                                </div>
                            </div>
                        </div>
                        
                        {/* NUEVO: BARRA DE PROGRESO DE NIVEL */}
                        <RankProgress color={hero.props.color} />
                        
                        {/* NUEVO: BUFFS ACTIVOS */}
                        <div className="flex flex-wrap gap-2">
                            {(hero.buffs || []).map((buff, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-slate-300 uppercase tracking-wide">
                                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: hero.props.color }} />
                                    {buff}
                                </div>
                            ))}
                        </div>

                        {/* STATS */}
                        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl space-y-3 shadow-inner">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2"><span className="text-base">📊</span> Estadísticas</h4>
                            <StatBar label="VOLUMEN" value={hero.stats.atk} color="#ef4444" icon="📦" />
                            <StatBar label="DEFENSA" value={hero.stats.def} color="#3b82f6" icon="🛡️" />
                            <StatBar label="VELOCIDAD" value={hero.stats.speed} color="#10b981" icon="⚡" />
                            <StatBar label="SUERTE" value={hero.stats.luck} color="#f59e0b" icon="🎲" />
                        </div>

                        {/* INVENTARIO INICIAL (CON TOOLTIP) */}
                        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl shadow-inner relative">
                            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center gap-2"><span className="text-base">🎒</span> Kit de Inicio</h4>
                            <div className="flex justify-between px-2 gap-2">
                                {(hero.starterGear || []).map((gear, idx) => (
                                    <GearSlot 
                                        key={idx}
                                        item={gear} 
                                        icon={idx === 0 ? "⚔️" : idx === 1 ? "👕" : "🧿"} 
                                        color={hero.props.color} 
                                        onHover={setTooltipItem}
                                        onLeave={() => setTooltipItem(null)}
                                    />
                                ))}
                            </div>
                            
                            {/* TOOLTIP FLOTANTE */}
                            {tooltipItem && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-black/90 border border-white/20 p-3 rounded-xl shadow-2xl backdrop-blur-md animate-[scaleIn_0.1s_ease-out] z-50">
                                    <p className="text-[10px] font-bold text-white uppercase mb-1">{tooltipItem.name}</p>
                                    <p className="text-[9px] text-slate-400 leading-tight">{tooltipItem.desc}</p>
                                    <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-black/90 border-r border-b border-white/20 rotate-45"></div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-10">
                        <div>
                            <h2 className="text-5xl lg:text-6xl font-black italic tracking-tighter text-white uppercase leading-[0.9] drop-shadow-xl">
                                Selecciona tu <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Estilo de Venta</span>
                            </h2>
                            <p className="text-slate-400 mt-4 max-w-lg leading-relaxed text-sm font-medium">
                                En Seina Market, tu clase define tus bonificaciones. ¿Prefieres vender rápido, vender caro o vender seguro? Elige sabiamente.
                            </p>
                        </div>
                        
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[3rem] space-y-10 backdrop-blur-md relative shadow-2xl">
                            <div className="absolute top-8 right-8 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-20" />

                            <div className="space-y-6">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block pl-2 flex items-center gap-2"><span className="text-lg">💠</span> Clases Disponibles</label>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {MERCHANT_CLASSES.map((item) => (
                                        <button 
                                            key={item.id}
                                            onClick={() => handleClassChange(item)}
                                            className={`relative p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 group overflow-hidden ${
                                                selectedHero?.id === item.id 
                                                ? `bg-slate-800 border-${item.props.color === '#ef4444' ? 'red' : item.props.color === '#3b82f6' ? 'blue' : item.props.color === '#f97316' ? 'orange' : item.props.color === '#eab308' ? 'yellow' : item.props.color === '#6366f1' ? 'indigo' : 'emerald'}-500/50 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] scale-[1.02]` 
                                                : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'
                                            }`}
                                        >
                                            {selectedHero?.id === item.id && (
                                                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_#fff] animate-pulse" />
                                            )}

                                            <div className="w-16 h-16 transition-transform duration-300 group-hover:scale-110 relative z-10 filter drop-shadow-md">
                                                {/* Héroe en el botón usa su arma por defecto para que se entienda la clase */}
                                                <PixelHero {...item.props} />
                                            </div>
                                            
                                            <div className="text-center w-full z-10 space-y-1">
                                                <p className={`text-[9px] font-black uppercase leading-none truncate ${selectedHero?.id === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                                    {item.name}
                                                </p>
                                                <p className={`text-[8px] font-bold uppercase truncate ${item.textColor} bg-white/5 px-2 py-1 rounded-lg inline-block border border-white/5`}>
                                                    {item.benefit}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* NUEVO: ARMERÍA (Weapon Selector) */}
                            <WeaponSelector 
                                currentWeapon={selectedWeapon} 
                                onSelect={setSelectedWeapon} 
                                color={hero.props.color} 
                            />

                            <div className="space-y-5 pt-2 border-t border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-3">Nombre de Tienda</label>
                                        <input 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            className="w-full bg-black/50 border border-slate-700 rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-700 shadow-inner" 
                                            placeholder="Ej: PokeMaster99"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-3">Eslogan</label>
                                        <input 
                                            value={bio} 
                                            onChange={(e) => setBio(e.target.value)} 
                                            className="w-full bg-black/50 border border-slate-700 rounded-xl py-4 px-6 text-xs font-medium text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all truncate shadow-inner" 
                                            placeholder="Ej: Envíos en 24h"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                              onClick={handleSave}
                              disabled={isSaving}
                              className={`w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black uppercase text-sm tracking-[0.3em] rounded-xl shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 border border-white/20 relative overflow-hidden group ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                  {isSaving ? "INICIANDO..." : "ACTIVAR CUENTA DE VENDEDOR"} <span className="text-lg">🚀</span>
                                </span>
                            </button>

                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                                <span className="text-xl">💡</span>
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-1">Consejo Pro</p>
                                    <p className="text-[9px] text-slate-400 leading-relaxed">
                                        Podrás cambiar tu clase una vez al mes. Elige la que mejor se adapte a tu inventario actual.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scaleIn {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes slideInRight {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                @keyframes loadBar {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); opacity: 0.2; }
                    50% { transform: translateY(-20px); opacity: 0.6; }
                }
            `}</style>
        </div>
    );
}