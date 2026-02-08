import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link' // Importante: Importamos el Link

const prisma = new PrismaClient()

async function getCards() {
  const cards = await prisma.card.findMany({
    orderBy: { marketPrice: 'desc' },
    take: 20
  })
  return cards
}

export default async function Home() {
  const cards = await getCards()

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 border-4 border-red-500">
      {/* 👆 OJO: Puse un borde ROJO para confirmar que el código se actualizó */}

      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          PRUEBA DE CAMBIO V3
        </h1>
        <p className="text-gray-400">Si ves el borde rojo, el código funciona.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          /* 👇 AQUÍ ESTÁ LA CLAVE: El Link envuelve todo */
          <Link href={`/cards/${card.id}`} key={card.id} className="group block">
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500 transition-all hover:scale-105 cursor-pointer h-full flex flex-col">
              
              {/* IMAGEN */}
              <div className="relative aspect-[2.5/3.5] bg-slate-800 p-4">
                <Image 
                  src={card.imageUrlHiRes || card.imageUrlSmall} 
                  alt={card.name}
                  fill
                  className="object-contain"
                />
              </div>

              {/* DATOS */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-lg truncate text-white group-hover:text-purple-400">
                    {card.name}
                  </h2>
                  <p className="text-xs text-gray-400">{card.rarity}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-green-400">
                    ${(card.marketPrice || 0).toFixed(2)}
                  </span>
                  <span className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                    VER DETALLE 👉
                  </span>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}