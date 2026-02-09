import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton"; 

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------
// 1. SEO MÁGICO (Metadata Dinámica)
// ---------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const card = await prisma.card.findUnique({
    where: { id },
    include: { set: true },
  });

  if (!card) return { title: "Carta no encontrada | TCG Chile" };

  return {
    title: `Comprar ${card.name} (${card.number}) | TCG Chile`,
    description: `Compra la carta ${card.name} de la expansión ${card.set.name}. Precio de referencia: $${card.marketPrice || '??'} USD. Envío a todo Chile.`,
    openGraph: {
      images: [card.imageUrlHiRes || card.imageUrlSmall],
    },
  };
}

// ---------------------------------------------------------
// 2. PÁGINA DE DETALLE
// ---------------------------------------------------------
export default async function CardPage({ params }: Props) {
  const { id } = await params;
  
  const card = await prisma.card.findUnique({
    where: { id },
    include: { 
      set: true,
      // Traemos las ofertas activas y el vendedor
      listings: {
        where: { status: 'ACTIVE' },
        include: { user: true },
        orderBy: { price: 'asc' } // Las más baratas primero
      }
    }
  });

  if (!card) return notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      
      {/* Botón Volver */}
      <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2 font-bold text-xl transition-colors">
        <span>⬅</span> Volver al Catálogo
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        
        {/* COLUMNA IZQUIERDA: FOTO */}
        <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 flex items-center justify-center relative group shadow-2xl">
          <div className="relative w-full max-w-md aspect-[2.5/3.5] transform group-hover:scale-105 transition-transform duration-500 ease-out">
            <Image 
              src={card.imageUrlHiRes || card.imageUrlSmall} 
              alt={card.name}
              fill
              className="object-contain drop-shadow-2xl"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: INFO */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-white leading-tight">{card.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-gray-300">
              <span className="bg-purple-900/30 text-purple-200 px-3 py-1 rounded border border-purple-500/30">
                {card.set.name}
              </span>
              <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700">
                #{card.number}
              </span>
              <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700 uppercase">
                {card.rarity}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-inner">
            <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Precio Promedio (Mercado)</p>
            <div className="text-5xl font-black text-green-400 tracking-tight">
              ${card.marketPrice?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "---"} 
              <span className="text-2xl text-gray-500 font-normal ml-2">USD</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">*Referencia internacional</p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------
          SECCIÓN DE OFERTAS (MARKETPLACE)
         --------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 border-b border-slate-800 pb-4 flex items-center gap-3">
          🛒 Ofertas de Usuarios 
          <span className="bg-slate-800 text-sm px-3 py-1 rounded-full text-white">{card.listings.length}</span>
        </h2>
        
        {card.listings.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-10 text-center">
             <p className="text-gray-400 text-lg mb-2">Nadie está vendiendo esta carta aún.</p>
             <p className="text-sm text-gray-600">¿La tienes? ¡Ve al Panel y véndela!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {card.listings.map((offer) => (
              <div key={offer.id} className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl flex flex-col md:flex-row items-center justify-between hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-900/10 gap-4">
                
                {/* Vendedor e Info */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg">
                    {offer.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">{offer.user.username}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Estado:</span> 
                      <span className="text-xs bg-green-900/30 text-green-400 border border-green-500/30 px-2 py-0.5 rounded font-bold">
                        {offer.condition}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Precio y Botones */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="text-3xl font-bold text-white">
                    ${offer.price.toLocaleString("es-CL")}
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    {/* Botón 1: Add to Cart (Tu componente) */}
                    <div className="flex-1">
                      <AddToCartButton card={{
                        id: card.id, 
                        name: `${card.name} (Vendedor: ${offer.user.username})`,
                        price: offer.price,
                        image: card.imageUrlSmall
                      }} />
                    </div>

                    {/* Botón 2: Comprar Ahora (Visual por ahora) */}
                    <button className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-green-900/20 whitespace-nowrap">
                      ⚡ Comprar
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}