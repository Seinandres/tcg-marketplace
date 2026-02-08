import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

const prisma = new PrismaClient()

// Evita que guarde caché, así la búsqueda es siempre fresca
export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  // 1. Leemos qué escribió el usuario (Ej: "mew")
  const { q } = await searchParams
  const query = q || ''

  // 2. Buscamos en la base de datos (LIKE %query%)
  const cards = await prisma.card.findMany({
    where: {
      name: {
        contains: query, // Que contenga el texto...
      }
    },
    take: 50 // Máximo 50 resultados
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Título de Resultados */}
        <h1 className="text-3xl font-bold mb-2">
          Resultados para: <span className="text-purple-400">"{query}"</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Encontramos {cards.length} cartas coincidentes.
        </p>

        {/* Si no hay nada... */}
        {cards.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <div className="text-6xl mb-4">🕵️‍♂️</div>
            <h2 className="text-xl font-bold">No encontramos nada</h2>
            <p className="text-gray-500">Intenta buscar "Pikachu" o "Ex".</p>
          </div>
        )}

        {/* GRILLA DE RESULTADOS (Reutilizamos el diseño) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link href={`/cards/${card.id}`} key={card.id} className="group block">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-purple-500 transition-all hover:scale-105 h-full flex flex-col">
                
                <div className="relative aspect-[2.5/3.5] bg-slate-800 p-4">
                  <Image 
                    src={card.imageUrlHiRes || card.imageUrlSmall} 
                    alt={card.name}
                    fill
                    className="object-contain"
                  />
                </div>

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
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded">Ver ➜</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}