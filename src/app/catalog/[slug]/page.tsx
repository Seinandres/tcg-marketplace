// @ts-nocheck
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const BRAND_CONFIG: any = {
  pokemon: {
    name: "Pokémon TCG",
    heroTitle: "Hazte con",
    heroSubtitle: "todos",
    color: "text-yellow-400",
    bgGradient: "from-yellow-400/20 via-slate-950 to-slate-950",
    // MEJORA: Trae las cartas con precio de mercado disponible, ordenadas por popularidad/precio
    apiFunction: async () => {
        try {
            // Buscamos cartas del set 151 (muy popular) o Paldean Fates, ordenadas por precio alto
            const res = await fetch('https://api.pokemontcg.io/v2/cards?q=set.id:sv3pt5&orderBy=-cardmarket.prices.averageSellPrice&pageSize=4');
            const data = await res.json();
            return data.data.map((c: any) => ({ 
              id: c.id, 
              name: c.name, 
              image: c.images.small,
              priceRef: c.cardmarket?.prices?.averageSellPrice ? `€${c.cardmarket.prices.averageSellPrice}` : "High Demand"
            })) || [];
        } catch (e) { return []; }
    }
  },
  magic: {
    name: "Magic: The Gathering",
    heroTitle: "Gather",
    heroSubtitle: "Your Party",
    color: "text-orange-500",
    bgGradient: "from-orange-500/20 via-slate-950 to-slate-950",
    // MEJORA: Trae las cartas más caras (USD) del último año legal en estándar
    apiFunction: async () => {
        try {
            const res = await fetch('https://api.scryfall.com/cards/search?q=year%3E2023+order%3Ausd+dir%3Adesc+is%3Abooster&unique=cards');
            const data = await res.json();
            return data.data.slice(0, 4).map((c: any) => ({ 
                id: c.id, 
                name: c.name, 
                image: c.image_uris?.normal || c.card_faces?.[0]?.image_uris?.normal,
                priceRef: c.prices?.usd ? `$${c.prices.usd}` : "Meta Defining"
            })) || [];
        } catch (e) { return []; }
    }
  }
};

async function getStock(gameSlug: string) {
  const dbGameName = gameSlug === 'magic' ? 'Magic' : 'Pokemon';
  return await prisma.listing.findMany({
    where: { status: 'ACTIVE', card: { game: dbGameName } },
    include: { card: { include: { set: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

export default async function CatalogPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase();
  
  const config = BRAND_CONFIG[slug] || BRAND_CONFIG.pokemon;
  const trending = await config.apiFunction();
  const listings = await getStock(slug);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* HERO SECTION */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden border-b border-slate-900">
        <div className={`absolute inset-0 bg-gradient-to-b ${config.bgGradient} opacity-60`} />
        
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-2">
            {config.heroTitle} <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{config.heroSubtitle}</span>
          </h1>
          <p className={`text-xl font-bold uppercase tracking-[0.5em] ${config.color} drop-shadow-lg`}>
            {config.name}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
         
         {/* SECCIÓN TENDENCIAS MEJORADA */}
         <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl animate-pulse">🔥</span>
              <h2 className="text-2xl font-black uppercase italic tracking-wide">Top Market Movers</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trending.map((t: any) => (
                    <div key={t.id} className="group bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 hover:border-white/30 transition-all hover:-translate-y-2 shadow-xl">
                        <div className="relative aspect-[2.5/3.5] mb-4 overflow-hidden rounded-xl">
                          <Image src={t.image || "/placeholder.png"} alt={t.name} fill className="object-contain group-hover:scale-110 transition-transform duration-500" />
                          
                          {/* Badge de Precio de Referencia */}
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-2 text-center translate-y-full group-hover:translate-y-0 transition-transform">
                            <p className={`text-[10px] font-black uppercase ${config.color}`}>Ref: {t.priceRef}</p>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-center text-gray-300 truncate group-hover:text-white transition-colors uppercase tracking-wider">{t.name}</p>
                    </div>
                ))}
            </div>
         </div>

         {/* SECCIÓN STOCK DISPONIBLE */}
         <div>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-3xl font-black uppercase italic tracking-tighter">Stock en Chile</h2>
               <Link href="/sell" className={`text-[10px] font-black uppercase tracking-widest ${config.color} hover:text-white border border-slate-800 px-4 py-2 rounded-full hover:bg-slate-800 transition-all`}>
                 + Vender {config.name}
               </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {listings.map((item: any) => (
                  <Link key={item.id} href={`/cards/${item.card.id}`} className="bg-slate-900/30 border border-slate-800 p-4 rounded-3xl hover:border-white transition-all group">
                      <div className="relative aspect-[2.5/3.5] mb-4">
                        <Image src={item.card.imageUrlSmall} alt={item.card.name} fill className="object-contain group-hover:scale-105 transition-transform" />
                      </div>
                      <p className="text-center font-black text-white text-lg">${item.price.toLocaleString('es-CL')}</p>
                      <p className="text-center text-[10px] font-bold text-gray-500 uppercase mt-1 px-2 py-0.5 bg-slate-900/50 rounded-full w-fit mx-auto">{item.condition}</p>
                  </Link>
                ))}
            </div>
            
            {listings.length === 0 && (
              <div className="text-center py-24 bg-slate-900/20 rounded-[40px] border border-dashed border-slate-800/50">
                <p className="text-gray-500 font-black italic uppercase text-xs tracking-widest mb-4">
                  El inventario de {config.name} está vacío por el momento.
                </p>
                <Link href="/sell" className="inline-block bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200">
                  Publicar Primera Carta
                </Link>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}