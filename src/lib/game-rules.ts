// src/lib/game-rules.ts

export const LEVEL_TIERS = [
  { level: 1, title: "Recluta", xpRequired: 0, commission: 0.10, perks: ["Acceso Básico"] },
  { level: 5, title: "Mercenario", xpRequired: 500, commission: 0.09, perks: ["Perfil Personalizado"] },
  { level: 10, title: "Veterano", xpRequired: 2000, commission: 0.08, perks: ["Borde Dorado en Ventas"] },
  { level: 20, title: "Comandante", xpRequired: 5000, commission: 0.07, perks: ["Soporte Prioritario"] },
  { level: 50, title: "Señor de la Guerra", xpRequired: 20000, commission: 0.05, perks: ["Comisión Reducida", "Ventas Destacadas"] },
];

export function getLevelData(xp: number) {
  // Encuentra el nivel más alto alcanzado con esa XP
  return LEVEL_TIERS.slice().reverse().find(tier => xp >= tier.xpRequired) || LEVEL_TIERS[0];
}

export function getNextLevelProgress(xp: number) {
  const currentTier = getLevelData(xp);
  const nextTier = LEVEL_TIERS.find(t => t.level > currentTier.level);
  
  if (!nextTier) return { percent: 100, remaining: 0 };
  
  const xpNeeded = nextTier.xpRequired - currentTier.xpRequired;
  const xpGained = xp - currentTier.xpRequired;
  
  return {
    percent: Math.min(100, Math.floor((xpGained / xpNeeded) * 100)),
    remaining: nextTier.xpRequired - xp,
    nextTitle: nextTier.title
  };
}