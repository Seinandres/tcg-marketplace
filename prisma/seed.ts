import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando Siembra Manual (Plan B)...')

  // 1. Limpiar base de datos
  try {
    await prisma.cartItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.listing.deleteMany({})
    await prisma.priceHistory.deleteMany({})
    await prisma.card.deleteMany({})
    await prisma.cardSet.deleteMany({})
    console.log('🧹 Base de datos limpia.')
  } catch (error) {
    console.log('⚠️ Primera ejecución (DB vacía).')
  }

  // 2. Crear el Set "151" manualmente
  const set151 = await prisma.cardSet.create({
    data: {
      name: "Scarlet & Violet: 151",
      code: "sv3pt5",
      releaseDate: "2023-09-22",
      totalCards: 165
    }
  })

  console.log('📦 Set creado: Pokémon 151')

  // 3. Crear Cartas Icónicas Manualmente
  const cards = [
    {
      name: "Charizard ex",
      number: "199",
      rarity: "Special Illustration Rare",
      imageUrlSmall: "https://images.pokemontcg.io/sv3pt5/199.png",
      imageUrlHiRes: "https://images.pokemontcg.io/sv3pt5/199_hires.png",
      marketPrice: 115.50 // Precio aprox en USD
    },
    {
      name: "Mew ex",
      number: "151",
      rarity: "Double Rare",
      imageUrlSmall: "https://images.pokemontcg.io/sv3pt5/151.png",
      imageUrlHiRes: "https://images.pokemontcg.io/sv3pt5/151_hires.png",
      marketPrice: 8.20
    },
    {
      name: "Pikachu",
      number: "173",
      rarity: "Illustration Rare",
      imageUrlSmall: "https://images.pokemontcg.io/sv3pt5/173.png",
      imageUrlHiRes: "https://images.pokemontcg.io/sv3pt5/173_hires.png",
      marketPrice: 25.00
    },
    {
      name: "Erika's Invitation",
      number: "203",
      rarity: "Special Illustration Rare",
      imageUrlSmall: "https://images.pokemontcg.io/sv3pt5/203.png",
      imageUrlHiRes: "https://images.pokemontcg.io/sv3pt5/203_hires.png",
      marketPrice: 35.50
    }
  ]

  for (const card of cards) {
    await prisma.card.create({
      data: {
        setId: set151.id,
        name: card.name,
        number: card.number,
        rarity: card.rarity,
        imageUrlSmall: card.imageUrlSmall,
        imageUrlHiRes: card.imageUrlHiRes,
        marketPrice: card.marketPrice
      }
    })
    console.log(`✅ Carta creada: ${card.name}`)
  }

  console.log('🚀 ¡Listo! Datos de prueba insertados correctamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })