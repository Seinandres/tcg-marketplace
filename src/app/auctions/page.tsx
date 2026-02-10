// @ts-nocheck
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import BidHistory from "@/components/BidHistory";

export const dynamic = 'force-dynamic';

async function getAuctions() {
  return await prisma.listing.findMany({
    where: { 
        status: 'ACTIVE',
        type: 'AUCTION'
    },
    include: { 
        card: { include: { set: true } },
        // Traemos las ofertas ordenadas para mostrar el historial real
        bids: {
            include: { user: true },
            orderBy: { amount: 'desc' }
        }
    },
    take: 6, 
    orderBy: { price: 'desc' }
  });
}

export default async function AuctionsPage() {
  const auctions = await getAuctions();
  
  // Tomamos el primer item como "Lote Destacado" para el panel lateral
  const featuredAuction = auctions[0]; 

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* HEADER DE SUBASTAS */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden border-b border-slate-900 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
        <div className="relative z-10 text-center px-6">
            <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest mb-4 animate-pulse">
                ● En Vivo
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-2">
                Subastas <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Activas</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">
                Cierre de Lotes: Todos los Martes 21:00 Hrs
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        
        {/* LAYOUT PRINCIPAL (GRID + SIDEBAR) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA IZQUIERDA: GRILLA DE LOTES */}
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black uppercase italic text-gray-300">Lotes Disponibles ({auctions.length})</h2>
                    <div className="flex gap-2">
                        <button className="bg-slate-900 text-xs font-bold px-4 py-2 rounded-lg border border-slate-800 hover:border-purple-500 transition-all">🔥 On Fire</button>
                        <button className="bg-slate-900 text-xs font-bold px-4 py-2 rounded-lg border border-slate-800 hover:border-purple-500 transition-all">⏳ Terminando</button>
                    </div>
                </div>

                {auctions.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {auctions.map((item, index) => (
                            <Link 
                                key={item.id} 
                                // En el futuro podrías tener una vista dedicada /auctions/[id]
                                href={`/cards/${item.card.id}`} 
                                className="group bg-slate-900/50 border border-slate-800 p-3 rounded-2xl hover:border-purple-500/50 transition-all hover:-translate-y-1 relative overflow-hidden"
                            >
                                {/* Etiqueta de Lote */}
                                <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black uppercase text-white border border-white/10">
                                    Lote #{index + 1}
                                </div>

                                <div className="relative aspect-[3/4] mb-3 rounded-xl overflow-hidden bg-slate-950">
                                    <Image src={item.card.imageUrlSmall} alt={item.card.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                
                                <div className="space-y-1">
                                    <h3 className="font-bold text-xs uppercase truncate text-gray-300 group-hover:text-purple-400">{item.card.name}</h3>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[8px] text-gray-500 uppercase font-black">Oferta actual</p>
                                            <p className="text-sm font-black text-white">${item.price.toLocaleString('es-CL')}</p>
                                        </div>
                                        <div className="text-[9px] font-bold text-red-400 bg-red-900/10 px-2 py-0.5 rounded border border-red-900/20">
                                            2d 4h
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                        <p className="text-gray-500 font-black uppercase text-xs tracking-widest mb-4">No hay subastas activas en este momento.</p>
                        <Link href="/sell" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-500">
                            Crear primera subasta
                        </Link>
                    </div>
                )}
            </div>

            {/* COLUMNA DERECHA: DETALLE DEL LOTE DESTACADO */}
            <div className="lg:col-span-1 hidden lg:block sticky top-24 h-fit">
                {featuredAuction ? (
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-1 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                            <div className="relative aspect-square w-full rounded-[20px] overflow-hidden bg-slate-950">
                                <Image src={featuredAuction.card.imageUrlLarge || featuredAuction.card.imageUrlSmall} alt="Featured" fill className="object-contain p-4" />
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <span className="bg-purple-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                                        ★ Lote Destacado
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* COMPONENTE DE HISTORIAL DE PUJAS CONECTADO A DB */}
                        <BidHistory 
                            listingId={featuredAuction.id}
                            currentPrice={featuredAuction.price}
                            initialBids={featuredAuction.bids} 
                        />
                    </div>
                ) : (
                    <div className="p-10 text-center border border-dashed border-slate-800 rounded-3xl">
                        <p className="text-gray-500 text-xs uppercase font-bold">Esperando lotes...</p>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}