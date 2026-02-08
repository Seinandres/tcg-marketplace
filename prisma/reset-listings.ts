import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Iniciando limpieza de precios gigantes...')

  // Esto borra TODAS las filas de la tabla "Listing"
  const deleted = await prisma.listing.deleteMany({})

  console.log(`✅ ¡Listo! Se borraron ${deleted.count} ventas. El error ha desaparecido.`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
