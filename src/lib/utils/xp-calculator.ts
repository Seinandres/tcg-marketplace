export const XP_CONSTANTS = {
  BID_PLACED: 10,
  BID_WON: 100,
  LISTING_CREATED: 50,
  LISTING_SOLD: 200,
  
  BASE_XP_PER_LEVEL: 100,
  XP_MULTIPLIER: 1.5,
};

export function getXPForLevel(level: number): number {
  return Math.floor(
    XP_CONSTANTS.BASE_XP_PER_LEVEL * Math.pow(XP_CONSTANTS.XP_MULTIPLIER, level - 1)
  );
}

export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 0;
  
  while (xpNeeded <= totalXP) {
    xpNeeded += getXPForLevel(level);
    if (xpNeeded <= totalXP) {
      level++;
    }
  }
  
  return level;
}

export function getCurrentLevelProgress(totalXP: number): {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  progress: number;
} {
  const currentLevel = getLevelFromXP(totalXP);
  const xpForCurrentLevel = getTotalXPForLevel(currentLevel);
  const currentXP = totalXP - xpForCurrentLevel;
  const xpForNextLevel = getXPForLevel(currentLevel);
  const progress = (currentXP / xpForNextLevel) * 100;
  
  return {
    currentLevel,
    currentXP,
    xpForNextLevel,
    progress: Math.min(progress, 100)
  };
}

export function getRankTitle(level: number): {
  title: string;
  color: string;
  icon: string;
} {
  if (level >= 100) return { title: "Leyenda Mítica", color: "from-yellow-500 to-orange-500", icon: "👑" };
  if (level >= 80) return { title: "Gran Maestro", color: "from-purple-500 to-pink-500", icon: "🏆" };
  if (level >= 60) return { title: "Maestro Elite", color: "from-blue-500 to-purple-500", icon: "💎" };
  if (level >= 40) return { title: "Veterano", color: "from-green-500 to-blue-500", icon: "⚔️" };
  if (level >= 20) return { title: "Coleccionista Experto", color: "from-cyan-500 to-green-500", icon: "🎴" };
  if (level >= 10) return { title: "Aventurero", color: "from-slate-500 to-cyan-500", icon: "🗡️" };
  return { title: "Novato", color: "from-gray-500 to-slate-500", icon: "🛡️" };
}

