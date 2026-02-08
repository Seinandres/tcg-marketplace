import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

async function getCard(id: string) {
  const card = await prisma.card.findUnique({
    where: { id: id },
    include: { 
      set: true,
      // 👇 AQUÍ ESTÁ LA MAGIA: Traemos las ofertas activas
      listings: {
        where: { status: 'ACTIVE' },
        include: { user: true } // Y traemos el nombre del vendedor
      }
    }
  })
  return card
}

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const card = await getCard(id)

  if (!card) return <div>Carta no encontrada</div>

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2 font-bold text-xl transition-colors">
        <span>⬅</span> Volver al Catálogo
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* FOTO */}
        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 flex items-center justify-center relative group">
          <div className="relative w-full max-w-md aspect-[2.5/3.5] shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
            <Image 
              src={card.imageUrlHiRes || card.imageUrlSmall} 
              alt={card.name}
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* INFO PRINCIPAL */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-white">{card.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-gray-300">
              <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700">{card.set.name}</span>
              <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700">#{card.number}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Precio de Referencia</p>
            <div className="text-6xl font-black text-green-400 tracking-tight">
              ${card.marketPrice?.toFixed(2)} <span className="text-2xl text-gray-500 font-normal">USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* 👇 NUEVA SECCIÓN: LISTA DE VENDEDORES */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 border-b border-slate-800 pb-4">Ofertas de Usuarios ({card.listings.length})</h2>
        
        {card.listings.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Nadie está vendiendo esta carta aún. ¡Sé el primero!</p>
        ) : (
          <div className="grid gap-4">
            {card.listings.map((offer) => (
              <div key={offer.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between hover:border-purple-500 transition-colors">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-xl">
                    {offer.user.username.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{offer.user.username}</p>
                    <p className="text-sm text-gray-400">Estado: <span className="text-white font-bold">{offer.condition}</span></p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-6">
                  <div className="text-2xl font-bold text-green-400">
                    ${offer.price.toFixed(0)}
                  </div>
                  
                  {/* Este botón agrega ESTA oferta específica al carro */}
                  <AddToCartButton card={{
                    id: card.id, // Ojo: Aquí idealmente usaríamos el ID de la oferta, pero por ahora mantenemos el ID de la carta para no romper el carro
                    name: `${card.name} (de ${offer.user.username})`, // Truco visual
                    price: offer.price,
                    image: card.imageUrlSmall
                  }} />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}