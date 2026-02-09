import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 Conectando a la PokéAPI (Set 151)...');

  // USAMOS EL CÓDIGO INFALIBLE: sv3pt5 (Scarlet & Violet 151)
  const setId = 'sv3pt5'; 
  
  const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}`);
  const data = await response.json();
  const cards = data.data;

  if (!cards || cards.length === 0) {
    console.error("❌ ERROR: La API devolvió 0 cartas. Revisa tu conexión a internet.");
    return;
  }

  console.log(`📦 Se encontraron ${cards.length} cartas. Guardando en Postgres...`);

  // 1. Crear el SET
  const set = await prisma.cardSet.upsert({
    where: { id: setId },
    update: {},
    create: {
      id: setId,
      name: 'Scarlet & Violet 151',
      code: setId,
      releaseDate: '2023-09-22',
      totalCards: cards.length
    }
  });

  // 2. Guardar las CARTAS
  for (const card of cards) {
    try {
      await prisma.card.upsert({
        where: { id: card.id },
        update: {},
        create: {
          id: card.id,
          name: card.name,
          number: card.number,
          rarity: card.rarity || 'Common',
          imageUrlSmall: card.images.small,
          imageUrlHiRes: card.images.large,
          marketPrice: card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || null,
          setId: set.id,
        }
      });
      process.stdout.write('.');
    } catch (e) {
      // Ignorar errores de duplicados
    }
  }

  console.log('\n✨ ¡ÉXITO! Ya tienes a Charizard y compañía en tu base de datos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });