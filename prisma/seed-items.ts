import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedItems() {
  const items = [
    // ========== ARMAS LEGENDARIAS ==========
    {
      name: "Excalibur del Mercader",
      description: "Espada legendaria que otorga +50% visibilidad. Tus ventas brillan con aura dorada y aparecen primero en búsquedas durante 48h",
      type: "WEAPON",
      rarity: "LEGENDARY",
      image: "⚔️",
      price: 2500,
      effects: JSON.stringify({ 
        highlight: true,
        highlightColor: "#FFD700",
        searchBoost: 1.5,
        duration: 172800,
        glowEffect: true,
        badge: "⭐ DESTACADO"
      })
    },
    {
      name: "Katana de las Mil Ofertas",
      description: "Espada rápida que reduce el tiempo de publicación en un 75% y garantiza 3 ventas destacadas simultáneas",
      type: "WEAPON",
      rarity: "RARE",
      image: "🗡️",
      price: 1200,
      effects: JSON.stringify({ 
        publishSpeedBoost: 0.75,
        simultaneousHighlights: 3,
        duration: 259200,
        flashEffect: true
      })
    },
    {
      name: "Hacha del Subastero",
      description: "Arma brutal que aumenta tus pujas iniciales en 10% automáticamente y te notifica de nuevas subastas al instante",
      type: "WEAPON",
      rarity: "RARE",
      image: "🪓",
      price: 800,
      effects: JSON.stringify({ 
        autoBidBoost: 0.10,
        instantNotifications: true,
        duration: 604800
      })
    },

    // ========== ESCUDOS Y ARMADURAS ==========
    {
      name: "Escudo de Aegis",
      description: "Defensa divina que reduce comisiones al 0% durante 7 días y protege contra cancelaciones accidentales",
      type: "SHIELD",
      rarity: "LEGENDARY",
      image: "🛡️",
      price: 3000,
      effects: JSON.stringify({ 
        commissionDiscount: 1.0,
        cancelProtection: true,
        duration: 604800,
        shieldAnimation: true
      })
    },
    {
      name: "Armadura del Comerciante",
      description: "Protección robusta que reduce comisiones en 30% y aumenta reputación por cada venta exitosa",
      type: "SHIELD",
      rarity: "RARE",
      image: "🦾",
      price: 900,
      effects: JSON.stringify({ 
        commissionDiscount: 0.30,
        reputationBonus: 5,
        duration: 432000
      })
    },

    // ========== POCIONES Y ELIXIRES ==========
    {
      name: "Elixir de Experiencia Supremo",
      description: "Poción divina que otorga 3x XP por TODAS las acciones durante 24 horas. Efecto apilable con otros buffs",
      type: "POTION",
      rarity: "LEGENDARY",
      image: "🧪",
      price: 1500,
      effects: JSON.stringify({ 
        xpMultiplier: 3,
        duration: 86400,
        stackable: true,
        particleEffect: "stars"
      })
    },
    {
      name: "Poción de Velocidad Comercial",
      description: "Aumenta la velocidad de todas tus transacciones. Ventas instantáneas y pujas automáticas mejoradas por 12h",
      type: "POTION",
      rarity: "RARE",
      image: "⚗️",
      price: 600,
      effects: JSON.stringify({ 
        transactionSpeed: 2,
        autoBidUpgrade: true,
        duration: 43200
      })
    },
    {
      name: "Poción de Duplicación",
      description: "Dobla las monedas obtenidas de ventas y subastas ganadas durante 6 horas",
      type: "POTION",
      rarity: "RARE",
      image: "💊",
      price: 1800,
      effects: JSON.stringify({ 
        coinMultiplier: 2,
        duration: 21600,
        sparkleEffect: true
      })
    },

    // ========== RUNAS Y ENCANTAMIENTOS ==========
    {
      name: "Runa de Shvas",
      description: "Encantamiento antiguo que aumenta permanentemente tu límite de ventas simultáneas en +5",
      type: "RUNE",
      rarity: "LEGENDARY",
      image: "📿",
      price: 5000,
      effects: JSON.stringify({ 
        listingLimit: 5,
        permanent: true,
        runeGlow: "#9333ea"
      })
    },
    {
      name: "Cristal de Fortuna",
      description: "Aumenta la probabilidad de obtener items raros al vender en 25% durante 7 días",
      type: "RUNE",
      rarity: "RARE",
      image: "💎",
      price: 1100,
      effects: JSON.stringify({ 
        luckBoost: 0.25,
        rareLootChance: 0.25,
        duration: 604800
      })
    },
    {
      name: "Sello del Dragón",
      description: "Marca tus ventas con el sello legendario. +100% atención de compradores premium",
      type: "RUNE",
      rarity: "RARE",
      image: "🐉",
      price: 950,
      effects: JSON.stringify({ 
        premiumBuyerAttraction: 2,
        specialBadge: "🐉 LEGENDARIO",
        duration: 259200
      })
    },

    // ========== MONTURAS Y VELOCIDAD ==========
    {
      name: "Chocobo Dorado",
      description: "Montura legendaria que aumenta tu velocidad de navegación y te permite ver nuevas cartas 10 minutos antes que otros",
      type: "MOUNT",
      rarity: "LEGENDARY",
      image: "🐥",
      price: 4000,
      effects: JSON.stringify({ 
        earlyAccess: 600,
        navigationSpeed: 2,
        permanent: true,
        mountAnimation: true
      })
    },
    {
      name: "Grifo Mercante",
      description: "Criatura alada que te notifica al instante de cualquier venta o puja en tus items",
      type: "MOUNT",
      rarity: "RARE",
      image: "🦅",
      price: 1300,
      effects: JSON.stringify({ 
        instantNotifications: true,
        pushNotifications: true,
        duration: 1209600
      })
    },

    // ========== ARTEFACTOS ÚNICOS ==========
    {
      name: "Corona del Rey Mercader",
      description: "Artefacto supremo que te otorga el título visual 'Rey Mercader' y desbloquea el color cromático en tu perfil",
      type: "ARTIFACT",
      rarity: "LEGENDARY",
      image: "👑",
      price: 10000,
      effects: JSON.stringify({ 
        customTitle: "👑 Rey Mercader",
        chromaticProfile: true,
        permanent: true,
        crownAnimation: true,
        exclusiveEmotes: true
      })
    },
    {
      name: "Ojo de Horus",
      description: "Ve las estadísticas ocultas de cualquier carta: historial de ventas, demanda real y precio óptimo recomendado",
      type: "ARTIFACT",
      rarity: "LEGENDARY",
      image: "👁️",
      price: 3500,
      effects: JSON.stringify({ 
        seeHiddenStats: true,
        priceOptimizer: true,
        demandAnalyzer: true,
        duration: 2592000
      })
    },
    {
      name: "Cuerno de Guerra",
      description: "Anuncia tus ventas a TODOS los usuarios conectados. Efecto épico de megáfono global por 72h",
      type: "ARTIFACT",
      rarity: "RARE",
      image: "📯",
      price: 2200,
      effects: JSON.stringify({ 
        globalAnnouncement: true,
        soundEffect: true,
        duration: 259200
      })
    },

    // ========== SKINS Y COSMÉTICOS ==========
    {
      name: "Aura Celestial",
      description: "Envuelve tu perfil en un aura brillante de partículas doradas. Efecto visual permanente ultra premium",
      type: "SKIN",
      rarity: "LEGENDARY",
      image: "✨",
      price: 8000,
      effects: JSON.stringify({ 
        auraEffect: "celestial",
        particleSystem: "gold-stars",
        permanent: true,
        animationSpeed: 1.5
      })
    },
    {
      name: "Tema Oscuro Élite",
      description: "Desbloquea el tema oscuro premium con efectos neón personalizables",
      type: "SKIN",
      rarity: "RARE",
      image: "🌑",
      price: 1500,
      effects: JSON.stringify({ 
        darkTheme: true,
        neonEffects: true,
        customColors: ["#9333ea", "#ec4899", "#06b6d4"],
        permanent: true
      })
    }
  ];

  console.log('📦 Creando items épicos...\n');

  let createdCount = 0;
  let skippedCount = 0;

  for (const itemData of items) {
    try {
      const existing = await prisma.rpgItem.findFirst({
        where: { name: itemData.name }
      });

      if (existing) {
        skippedCount++;
        console.log(`⏭️  Ya existe: ${itemData.image} ${itemData.name}`);
      } else {
        await prisma.rpgItem.create({
          data: itemData
        });
        createdCount++;
        console.log(`✅ Creado: ${itemData.image} ${itemData.name}`);
      }
    } catch (error) {
      console.log(`❌ Error con: ${itemData.name}`, error);
    }
  }

  console.log(`\n✅ ${createdCount} items nuevos creados`);
  console.log(`⏭️  ${skippedCount} items ya existían`);

  // Mostrar resumen
  const allItems = await prisma.rpgItem.findMany({
    orderBy: [
      { rarity: 'desc' },
      { price: 'desc' }
    ]
  });

  const itemsByType: Record<string, any[]> = {};
  allItems.forEach(item => {
    if (!itemsByType[item.type]) {
      itemsByType[item.type] = [];
    }
    itemsByType[item.type].push(item);
  });

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    🏪 EL ARSENAL ÉPICO                     ');
  console.log('═══════════════════════════════════════════════════════════\n');

  Object.entries(itemsByType).forEach(([type, items]) => {
    const typeEmoji = {
      'WEAPON': '⚔️',
      'SHIELD': '🛡️',
      'POTION': '🧪',
      'RUNE': '📿',
      'MOUNT': '🐥',
      'ARTIFACT': '👑',
      'SKIN': '✨'
    }[type] || '📦';

    console.log(`\n${typeEmoji}  ${type} (${items.length})`);
    console.log('─────────────────────────────────────────────────────────');
    
    items.forEach(item => {
      const rarityColor = {
        'LEGENDARY': '🌟',
        'RARE': '💜',
        'COMMON': '💙'
      }[item.rarity] || '⚪';
      
      console.log(`  ${rarityColor} ${item.image} ${item.name.padEnd(35)} ${item.price.toString().padStart(6)} 🪙 [${item.rarity}]`);
    });
  });

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`Total: ${allItems.length} items | Valor total: ${allItems.reduce((sum, i) => sum + i.price, 0).toLocaleString()} 🪙`);
  console.log('═══════════════════════════════════════════════════════════\n');
}

seedItems()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });