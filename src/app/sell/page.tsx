import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Image from 'next/image'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// 1. ACCIÓN DEL SERVIDOR: Esto se ejecuta en el Backend cuando le das "Publicar"
async function createListing(formData: FormData) {
  'use server' // 👈 Magia de Next.js: Código de servidor dentro del componente

  const cardId = formData.get('cardId') as string
  const price = parseFloat(formData.get('price') as string)
  const condition = formData.get('condition') as string

  // Buscamos a nuestro usuario de prueba (Ash Ketchum)
  const user = await prisma.user.findUnique({ where: { username: 'AshKetchum' }})

  if (!user) throw new Error("Falta correr el seed-user.ts")

  // Guardamos la venta en la base de datos
  await prisma.listing.create({
    data: {
      userId: user.id,
      cardId: cardId,
      price: price,
      condition: condition,
      status: 'ACTIVE'
    }
  })

  // Redirigimos al usuario al inicio
  redirect('/')
}

export default async function SellPage() {
  // Obtenemos todas las cartas para ponerlas en la lista
  const cards = await prisma.card.findMany({ orderBy: { name: 'asc' }})

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-4">
      
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-lg w-full shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Vender Carta</h1>
        <p className="text-gray-400 text-center mb-8">Convierte tus cartones en dinero.</p>

        {/* FORMULARIO */}
        <form action={createListing} className="space-y-6">
          
          {/* Selector de Carta */}
          <div>
            <label className="block text-sm font-bold mb-2">¿Qué carta vendes?</label>
            <select name="cardId" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:border-green-500 outline-none text-white">
              {cards.map(card => (
                <option key={card.id} value={card.id}>
                  {card.name} - ({card.rarity})
                </option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-bold mb-2">Precio (CLP o USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input 
                type="number" 
                name="price" 
                placeholder="10000" 
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 pl-8 focus:border-green-500 outline-none text-white"
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-bold mb-2">Estado de la carta</label>
            <select name="condition" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:border-green-500 outline-none text-white">
              <option value="NM">Near Mint (Como nueva)</option>
              <option value="LP">Lightly Played (Poco uso)</option>
              <option value="MP">Moderately Played (Desgastada)</option>
              <option value="HP">Heavily Played (Muy dañada)</option>
            </select>
          </div>

          {/* Botón Submit */}
          <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-green-900/20">
            🚀 Publicar Ahora
          </button>

        </form>
      </div>
    </div>
  )
}