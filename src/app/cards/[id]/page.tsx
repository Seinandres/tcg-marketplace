// @ts-nocheck
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import CardAnalytics from "@/components/CardAnalytics"; // 👈 IMPORTAMOS EL NUEVO DASHBOARD

export const dynamic = 'force-dynamic';

async function getCardDetail(id: string) {
  const card = await prisma.card.findUnique({
    where: { id },
    include: {
      set: true,
      listings: {
        where: { status: 'ACTIVE' },
        orderBy: { price: 'asc' }
      }
    }
  });
  return card;
}

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await getCardDetail(id);

  if (!card) return <div className="text-white text-center pt-20">Carta no encontrada</div>;

  // --- CÁLCULO DE PRECIOS REALES (BASADO EN TU STOCK) ---
  const activePrices = card.listings.map(l => l.price);
  
  // Si hay vendedores, usamos sus precios. Si no, usamos el precio de mercado guardado o un estimado.
  const hasStock = activePrices.length > 0;
  
  const minPrice = hasStock ? Math.min(...activePrices) : (card.marketPrice || 5000);
  const maxPrice = hasStock ? Math.max(...activePrices) : (card.marketPrice ? card.marketPrice * 1.5 : 8000);
  const avgPrice = hasStock 
      ? Math.round(activePrices.reduce((a, b) => a + b, 0) / activePrices.length) 
      : (card.marketPrice || 5000);

  const priceData = {
      market: avgPrice,
      low: minPrice,
      high: maxPrice
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 relative overflow-hidden">
        
      {/* FONDO AMBIENTAL */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* NAVEGACIÓN */}
        <div className="flex justify-between items-center mb-10">
            <Link href="/" className="text-gray-500 hover:text-white uppercase text-[10px] font-black tracking-[0.2em] flex items-center gap-2">
            ← Volver al Catálogo
            </Link>
            <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">{card.game} • {card.set.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* COLUMNA IZQUIERDA: IMAGEN (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="relative aspect-[2.5/3.5] bg-slate-900 rounded-[30px] border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                <Image 
                  src={card.imageUrlLarge || card.imageUrlSmall} 
                  alt={card.name} 
                  fill 
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-700" 
                  priority
                />
             </div>
             
             <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                <div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Rareza</p>
                    <p className="text-sm font-bold text-white">{card.rarity || "Común"}</p>
                </div>
                <div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest text-right">Número</p>
                    <p className="text-sm font-bold text-white text-right">#{card.number}</p>
                </div>
             </div>
          </div>

          {/* COLUMNA DERECHA: DATOS (8 cols) */}
          <div className="lg:col-span-8">
            
            {/* ENCABEZADO */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-2">{card.name}</h1>
              <div className="flex items-baseline gap-4">
                 <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Mejor Precio Actual</span>
                 <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                    ${minPrice.toLocaleString('es-CL')}
                 </span>
              </div>
            </div>

            {/* --- DASHBOARD DE ANÁLISIS (EL NUEVO COMPONENTE) --- */}
            <CardAnalytics priceData={priceData} />

            {/* LISTA DE VENDEDORES */}
            <div>
                <h3 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-2">
                    <span className="text-purple-500">⚡</span> Vendedores Disponibles
                </h3>
                
                <div className="bg-slate-900/30 border border-slate-800 rounded-[30px] overflow-hidden">
                    {card.listings.length > 0 ? (
                        <div className="divide-y divide-slate-800">
                            {card.listings.map((listing) => (
                                <div key={listing.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors group">
                                    
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-black text-xl shadow-lg">
                                            {/* Avatar Simulado */}
                                            {listing.user?.username ? listing.user.username[0] : 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-wide group-hover:text-purple-400 transition-colors">SEINA USER</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${
                                                    listing.condition === 'NM' ? 'bg-green-500/20 text-green-400' : 
                                                    listing.condition === 'LP' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {listing.condition}
                                                </span>
                                                <span className="text-[9px] text-gray-500 font-bold">Santiago, CL</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-2xl font-black italic tracking-tighter">${listing.price.toLocaleString('es-CL')}</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase">Precio Final</p>
                                        </div>
                                        
                                        <AddToCartButton 
                                            item={{
                                                id: listing.id,
                                                price: listing.price,
                                                card: {
                                                    name: card.name,
                                                    imageUrlSmall: card.imageUrlSmall,
                                                    set: { name: card.set.name }
                                                }
                                            }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 font-black uppercase text-xs tracking-widest mb-4">No hay vendedores activos para esta carta.</p>
                            <Link href="/sell" className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
                                Sé el primero en vender
                            </Link>
                        </div>
                    )}
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}