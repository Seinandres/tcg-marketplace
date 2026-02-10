// @ts-nocheck
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Filters from "@/components/Filters";

export const dynamic = 'force-dynamic';

async function getListings(query: string) {
  return await prisma.listing.findMany({
    where: { 
        status: 'ACTIVE', 
        type: 'SALE', // 👈 FILTRO CLAVE: Solo ventas directas
        card: { name: { contains: query, mode: 'insensitive' } } 
    },
    include: { card: { include: { set: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10
  });
}

// NUEVO: OBTENER LO MÁS VENDIDO (Simulado con las últimas ventas reales)
async function getRecentSales() {
  return await prisma.listing.findMany({
    where: { status: 'SOLD' }, // Buscamos lo que YA se vendió
    include: { card: true },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const query = params?.q || "";

  const [listings, soldItems] = await Promise.all([
    getListings(query),
    getRecentSales()
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* HERO */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-slate-950 to-slate-950" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-none mb-6">
            SEINA<span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-800">MARKET</span>
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 font-medium uppercase tracking-[0.4em] text-xs md:text-sm mb-10">
            El marketplace más confiable de cartas Pokémon y Magic en Chile
          </p>
          <div className="flex justify-center gap-4">
             <Link href="/sell" className="bg-white text-black px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl">Vender Cartas</Link>
             <Link href="#listings" className="bg-transparent border border-gray-600 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Explorar</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <Filters initialQuery={query} initialRarity="" />

        {!query && (
          <>
            {/* 1. EXPLORA POR UNIVERSO */}
            <div className="mb-24">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6">Categorías Principales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/catalog/pokemon" className="group relative h-48 rounded-[32px] overflow-hidden border border-slate-800 hover:border-yellow-500 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-slate-950" />
                    <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter group-hover:text-yellow-400 transition-colors">Pokémon TCG</h2>
                    </div>
                </Link>
                <Link href="/catalog/magic" className="group relative h-48 rounded-[32px] overflow-hidden border border-slate-800 hover:border-orange-500 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-slate-950" />
                    <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter group-hover:text-orange-400 transition-colors">Magic: The Gathering</h2>
                    </div>
                </Link>
                </div>
            </div>

            {/* 2. VENTAS RECIENTES (SOCIAL PROOF) - NUEVO SEGMENTO */}
            {soldItems.length > 0 && (
                <div className="mb-24">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-green-500 animate-pulse">💸</span>
                        <h2 className="text-2xl font-black uppercase italic">Vendido Recientemente</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                        {soldItems.map((item) => (
                        <div key={item.id} className="bg-slate-900/20 border border-slate-800 p-4 rounded-3xl grayscale hover:grayscale-0 transition-all">
                            <div className="relative aspect-[2.5/3.5] mb-4 overflow-hidden rounded-xl">
                                <Image src={item.card.imageUrlSmall} alt={item.card.name} fill className="object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded transform -rotate-12">Vendido</span>
                                </div>
                            </div>
                            <p className="text-center font-bold text-gray-500 text-xs truncate">{item.card.name}</p>
                            <p className="text-center font-black text-gray-400 text-sm line-through">${item.price.toLocaleString('es-CL')}</p>
                        </div>
                        ))}
                    </div>
                </div>
            )}
          </>
        )}

        {/* 3. RECIÉN LLEGADOS (STOCK ACTIVO) */}
        <div id="listings" className="mb-24">
            <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3"><span className="text-purple-500">⚡</span> Novedades en Vitrina</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {listings.map((item) => (
                  <Link key={item.id} href={`/cards/${item.card.id}`} className="bg-slate-900/40 border border-slate-800 p-4 rounded-3xl hover:border-purple-500/50 transition-all group hover:-translate-y-2">
                      <div className="relative aspect-[2.5/3.5] mb-4 overflow-hidden rounded-xl shadow-lg">
                        <Image src={item.card.imageUrlSmall} alt={item.card.name} fill className="object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-center font-black text-white text-lg">${item.price.toLocaleString('es-CL')}</p>
                      <p className="text-center text-[10px] font-bold text-gray-500 uppercase bg-slate-900 rounded-full py-1 mt-2">{item.condition}</p>
                  </Link>
                ))}
             </div>
             {listings.length === 0 && <p className="text-center text-gray-500 py-12">No hay cartas publicadas con ese criterio.</p>}
        </div>

      </div>
    </div>
  );
}