import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// --- ACCIÓN DEL SERVIDOR: Borrar Venta ---
async function deleteListing(formData: FormData) {
  'use server'
  const listingId = formData.get('listingId') as string
  
  if (listingId) {
    await prisma.listing.delete({ where: { id: listingId } })
    revalidatePath('/dashboard')
    revalidatePath('/') // También actualizamos el inicio
  }
}

export default async function DashboardPage() {
  // Buscamos al usuario y sus ventas
  const user = await prisma.user.findUnique({
    where: { username: 'AshKetchum' },
    include: {
      listings: {
        include: { card: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  // Si no existe el usuario (por si acaso)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold mb-4">⚠️ Usuario no encontrado</h1>
        <p className="text-gray-400">Ejecuta el script 'seed-user.ts' primero.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-slate-800 pb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Panel de Control</h1>
            <p className="text-gray-400">Bienvenido de vuelta, <span className="text-purple-400 font-bold">@{user.username}</span></p>
          </div>
          
          <Link href="/sell" className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center gap-2">
            <span>💰</span> Publicar Nueva Carta
          </Link>
        </div>

        {/* LISTA DE VENTAS */}
        <h2 className="text-2xl font-bold mb-6">Mis Publicaciones Activas ({user.listings.length})</h2>

        {user.listings.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold mb-2">No estás vendiendo nada</h3>
            <p className="text-gray-500">¡Sube tus cartas para ganar dinero!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {user.listings.map((listing) => (
              <div key={listing.id} className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-center justify-between group hover:border-purple-500/50 transition-all">
                
                {/* IZQUIERDA: FOTO Y NOMBRE */}
                <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                  <div className="relative w-16 h-20 md:w-20 md:h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700">
                    <Image 
                      src={listing.card.imageUrlSmall} 
                      alt={listing.card.name} 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{listing.card.name}</h3>
                    <div className="flex gap-2">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-700 text-gray-300">
                        {listing.condition}
                      </span>
                      <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded text-xs border border-green-900">
                        ACTIVO
                      </span>
                    </div>
                  </div>
                </div>

                {/* DERECHA: PRECIO Y BORRAR */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Precio</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${listing.price.toLocaleString()}
                    </p>
                  </div>

                  <form action={deleteListing}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button 
                      type="submit"
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-xl transition-all border border-red-500/20"
                      title="Eliminar Publicación"
                    >
                      🗑️
                    </button>
                  </form>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}