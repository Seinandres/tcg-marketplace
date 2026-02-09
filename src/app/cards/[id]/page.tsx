// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton"; 
import PriceChart from "@/components/PriceChart";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { set: true },
  });
  if (!card) return { title: "Carta no encontrada" };
  return { title: `${card.name} | TCG Chile Marketplace` };
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { 
      set: true,
      listings: {
        where: { status: 'ACTIVE' },
        include: { user: true },
        orderBy: { price: 'asc' }
      }
    }
  });

  if (!card) return notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Banner Superior Premium */}
      <div className="h-48 bg-gradient-to-b from-purple-900/20 to-transparent absolute w-full z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        <Link href="/" className="text-gray-500 hover:text-white mb-10 inline-flex items-center gap-2 font-black uppercase text-xs tracking-widest transition-all">
          <span className="text-lg">←</span> Volver al Catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LADO IZQUIERDO: VISUAL Y GRÁFICO */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-slate-900/60 rounded-[40px] p-12 border border-slate-800/50 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative group">
                <div className="relative w-full aspect-[2.5/3.5] transform group-hover:scale-105 transition-transform duration-700 ease-out">
                    <Image 
                        src={card.imageUrlHiRes || card.imageUrlSmall} 
                        alt={card.name}
                        fill
                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                        priority
                    />
                </div>
            </div>
            
            {/* Gráfico de Variación */}
            <PriceChart currentPrice={card.marketPrice || 0} />
          </div>

          {/* LADO DERECHO: INFO Y FICHA TÉCNICA RECUPERADA */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-purple-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-purple-900/20">Marketplace Oficial</span>
                <span className="text-gray-500 font-mono text-sm tracking-tighter">ID: {card.id}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-6 uppercase italic">
                {card.name}
              </h1>
              <div className="flex gap-4">
                <span className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-purple-400 uppercase tracking-tighter">
                    {card.set.name}
                </span>
                <span className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-sm font-bold text-gray-400">
                    #{card.number} / {card.set.totalCards}
                </span>
              </div>
            </div>

            {/* FICHA TÉCNICA RECUPERADA (GAMA ALTA) */}
            <div className="bg-slate-900/30 rounded-3xl border border-slate-800/50 p-8 shadow-inner">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Ficha Técnica Profesional</h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-[11px]">
                {[
                    { label: "Rareza", value: card.rarity || "Super Rare" },
                    { label: "Serie", value: "Scarlet & Violet 151" },
                    { label: "Stock Bodega", value: `${card.listings.length} Unidades`, color: "text-green-400" },
                    { label: "Idioma", value: "Inglés / Español" },
                    { label: "Referencia", value: `$${card.marketPrice?.toFixed(2)} USD` }
                ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-slate-800/50 pb-2">
                        <span className="font-bold text-gray-600 uppercase tracking-widest">{stat.label}</span>
                        <span className={`font-black ${stat.color || "text-white"} uppercase`}>{stat.value}</span>
                    </div>
                ))}
              </div>
            </div>

            {/* CAJA DE PRECIO PRINCIPAL (MASIVA) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[32px] p-10 border border-purple-500/20 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[80px] group-hover:bg-purple-500/20 transition-all" />
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Mejor Oferta Actual</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-7xl font-black text-white tracking-tighter">
                                ${card.listings[0]?.price.toLocaleString("es-CL") || "---"}
                            </span>
                            <span className="text-2xl font-bold text-purple-500 italic">CLP</span>
                        </div>
                    </div>
                    <a href="#offers" className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 text-white font-black py-6 px-12 rounded-2xl transition-all shadow-xl shadow-purple-900/40 uppercase tracking-tighter text-lg hover:scale-105 active:scale-95 text-center">
                        Ver Vendedores
                    </a>
                </div>
            </div>
          </div>
        </div>

        {/* LISTADO DE VENDEDORES ESTILO MARKETPLACE CHILE */}
        <div id="offers" className="mt-32">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Vendedores en Chile</h2>
                <div className="h-px flex-1 bg-slate-800 mx-8 hidden md:block" />
                <span className="text-gray-500 font-mono text-xs uppercase tracking-widest font-black">{card.listings.length} Unidades Disponibles</span>
            </div>

            <div className="grid gap-6">
                {card.listings.map((offer) => (
                    <div key={offer.id} className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between hover:bg-slate-900/80 hover:border-purple-500/50 transition-all group">
                        <div className="flex items-center gap-8 w-full md:w-auto">
                            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-3xl text-purple-500 border border-slate-700 shadow-inner group-hover:border-purple-500 transition-colors">
                                {offer.user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{offer.user.username}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1 tracking-widest">📍 Santiago, Chile</span>
                                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
                                    <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest ${
                                        offer.condition === 'NM' ? 'bg-green-900/20 text-green-400 border-green-500/20' : 'bg-yellow-900/20 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                        Estado: {offer.condition}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-10 w-full md:w-auto mt-8 md:mt-0 pt-8 md:pt-0 border-t border-slate-800/50 md:border-0">
                            <div className="text-center md:text-right">
                                <p className="text-4xl font-black text-white leading-none tracking-tighter">
                                  ${offer.price.toLocaleString("es-CL")}
                                </p>
                                <p className="text-[10px] text-gray-600 font-bold uppercase mt-2 tracking-widest">Precio Final CLP</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="flex-1">
                                    {/* Lógica de ID de oferta corregida para el carrito */}
                                    <AddToCartButton card={{
                                        id: offer.id, 
                                        name: `${card.name} (Vendedor: ${offer.user.username})`,
                                        price: offer.price,
                                        image: card.imageUrlSmall
                                    }} />
                                </div>
                                <Link href="/cart" className="flex-1 bg-green-600 hover:bg-green-500 text-white font-black py-4 px-10 rounded-xl transition-all shadow-lg shadow-green-900/20 uppercase text-[10px] flex items-center justify-center whitespace-nowrap tracking-widest active:scale-95">
                                    ⚡ Compra Directa
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}