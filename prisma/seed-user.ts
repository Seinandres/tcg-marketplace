import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creando usuario de prueba...')

  const user = await prisma.user.upsert({
    where: { username: 'AshKetchum' },
    update: {},
    create: {
      username: 'AshKetchum',
      email: 'ash@pueblopaleta.com',
      walletAddress: '0x123...abc',
      reputation: 100
    }
  })

  console.log(`✅ Usuario creado: ${user.username} (ID: ${user.id})`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())