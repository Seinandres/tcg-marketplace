// prisma/reset.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('⚠️  INICIANDO PROTOCOLO DE LIMPIEZA TÁCTICA...');

  // Lista de tablas en orden de eliminación para evitar conflictos
  const tables = [
    "UserItem", "RpgItem", "Bid", "CartItem", "Order", 
    "PriceHistory", "Subscription", "Listing", "Card", 
    "CardSet", "Account", "Session", "VerificationToken", "User"
  ];

  for (const table of tables) {
    try {
      // Usamos comillas dobles para asegurar compatibilidad con PostgreSQL/Nile
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
      console.log(`✅ Estructura eliminada: ${table}`);
    } catch (e) {
      console.log(`ℹ️  Saltando ${table} (No existía o error menor)`);
    }
  }
  console.log('🏁 TERRENO LIMPIO. LISTO PARA LA NUEVA ERA.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());