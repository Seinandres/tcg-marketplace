// @ts-nocheck
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getCards() {
  return await prisma.card.findMany({
    orderBy: { marketPrice: 'desc' },
    take: 20
  });
}

export default async function Home() {
  const cards = await getCards();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-slate-950/80 to-slate-950" />
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-400 to-slate-500 mb-4">
            TCG Match
          </h1>
          <p className="text-gray-400 text-sm md:text-xl font-bold uppercase tracking-[0.5em] italic">
            El Marketplace definitivo de Chile
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Cartas Destacadas</h2>
          <div className="h-px flex-1 bg-slate-800 mx-8" />
          <span className="text-purple-500 font-mono text-sm font-bold">LIVE MARKET</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {cards.map((card) => (
            <Link 
              key={card.id} 
              href={`/cards/${card.id}`}
              className="group relative bg-slate-900/40 border border-slate-800/50 rounded-[32px] p-6 transition-all duration-500 hover:border-purple-500/50 hover:bg-slate-900/80 hover:-translate-y-2 shadow-2xl"
            >
              <div className="relative aspect-[2.5/3.5] mb-6 overflow-hidden rounded-xl shadow-2xl">
                <Image 
                  src={card.imageUrlSmall} 
                  alt={card.name} 
                  fill 
                  className="object-contain transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{card.rarity}</p>
                <h3 className="font-black text-lg truncate uppercase">{card.name}</h3>
                <div className="flex justify-between items-end pt-4">
                  <p className="text-2xl font-black text-white italic">${card.marketPrice?.toFixed(2)} <span className="text-[10px] text-gray-500 not-italic">USD</span></p>
                  <span className="bg-white/5 p-2 rounded-lg text-xs group-hover:bg-purple-600 transition-colors">➜</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}