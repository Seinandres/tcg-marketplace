// @ts-nocheck
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Filters from "@/components/Filters";

export const dynamic = 'force-dynamic';

// 1. OBTENER ACTIVOS EN VITRINA (ACTIVOS)
async function getListings(query: string) {
  return await prisma.listing.findMany({
    where: { 
        status: 'ACTIVE', 
        type: 'SALE', 
        card: { name: { contains: query, mode: 'insensitive' } } 
    },
    include: { 
        card: true, 
        user: {
            select: {
                name: true,
                heroLevel: true,
                heroTitle: true
            }
        }
    },
    orderBy: { createdAt: 'desc' },
    take: 15 // Aumentamos un poco el rango de visión
  });
}

// 2. OBTENER HISTORIAL DE DESPLIEGUES EXITOSOS (VENDIDOS)
async function getRecentSales() {
  return await prisma.listing.findMany({
    where: { status: 'SOLD' },
    include: { card: true },
    orderBy: { updatedAt: 'desc' },
    take: 5
  });
}

export default async function Home(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";

  const [listings, soldItems] = await Promise.all([
    getListings(query),
    getRecentSales()
  ]);

  return (
    <div className="min-h-screen bg-[#020617] text-white pb-20 selection:bg-purple-500/30">
      
      {/* === HERO SECTION (SIN NAVBAR INTERNA) === */}
      <div className="relative h-[65vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        
        <div className="relative z-10 text-center px-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="flex justify-center mb-4">
             <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[9px] font-black uppercase tracking-[0.4em] text-purple-400 animate-pulse">
                RED DE COMERCIO TÁCTICO // CHILE
             </span>
          </div>
          
          <h1 className="text-6xl md:text-[9rem] font-black tracking-tighter uppercase italic leading-none mb-6 drop-shadow-[0_0_40px_rgba(168,85,247,0.25)]">
            SEINA<span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-purple-800">MARKET</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-slate-400 font-medium uppercase tracking-[0.3em] text-[10px] md:text-xs mb-10 leading-relaxed opacity-80">
            EL PRIMER MARKETPLACE GAMIFICADO DE ACTIVOS <span className="text-white font-bold">TCG</span>
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
             <Link href="/sell" className="group relative bg-white text-black px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-xl active:scale-95 overflow-hidden">
                <span className="relative z-10">Desplegar Venta 🔥</span>
                <div className="absolute inset-0 bg-purple-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
             </Link>
             <Link href="#listings" className="bg-slate-900/50 border border-slate-700 text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all backdrop-blur-md active:scale-95">
                Explorar Vitrina
             </Link>
          </div>
        </div>

        {/* Efecto CRT Scanlines (Optimizado) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-14 relative z-30">
        
        {/* BARRA DE FILTROS (DISEÑO FLOTANTE) */}
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-24">
           <Filters initialQuery={query} initialRarity="" />
        </div>

        {!query && (
          <>
            {/* 1. SECTORES (CATEGORÍAS) */}
            <div className="mb-32 animate-in fade-in duration-1000">
                <div className="flex items-center gap-4 mb-8">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Sectores de Operación</h3>
                   <div className="h-px flex-1 bg-white/5"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/catalog/pokemon" className="group relative h-56 rounded-[35px] overflow-hidden border border-white/5 hover:border-yellow-500/50 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-slate-950 to-slate-950 z-0" />
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter group-hover:scale-110 transition-transform duration-700">Pokémon TCG</h2>
                      </div>
                  </Link>

                  <Link href="/catalog/magic" className="group relative h-56 rounded-[35px] overflow-hidden border border-white/5 hover:border-orange-500/50 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-slate-950 to-slate-950 z-0" />
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter group-hover:scale-110 transition-transform duration-700">Magic: Gathering</h2>
                      </div>
                  </Link>
                </div>
            </div>

            {/* 2. VENTAS RECIENTES (RADAR) */}
            {soldItems.length > 0 && (
                <div className="mb-32">
                    <div className="flex items-center justify-between mb-8 opacity-60">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Operaciones Exitosas</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {soldItems.map((item) => (
                        <div key={item.id} className="group bg-slate-900/30 border border-white/5 p-4 rounded-3xl grayscale hover:grayscale-0 transition-all relative">
                            <div className="relative aspect-[2.5/3.5] mb-4 overflow-hidden rounded-2xl">
                                <Image src={item.card?.image || "/placeholder.png"} alt={item.card.name} fill className="object-contain p-1" />
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-red-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-sm transform -rotate-12">CONFIRMADO</span>
                                </div>
                            </div>
                            <p className="text-center font-bold text-slate-500 text-[9px] truncate mb-1">{item.card.name}</p>
                            <p className="text-center font-black text-slate-600 text-xs line-through">${item.price.toLocaleString('es-CL')}</p>
                        </div>
                        ))}
                    </div>
                </div>
            )}
          </>
        )}

        {/* === 3. VITRINA GLOBAL === */}
        <div id="listings" className="mb-32 scroll-mt-32">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3">
                  <span className="text-purple-500 text-xl animate-pulse">⚡</span>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Novedades en Vitrina</h2>
               </div>
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {listings.map((item) => (
                  <Link key={item.id} href={`/listing/${item.id}`} className="group">
                    <div className="bg-slate-900/40 border border-white/5 p-4 rounded-[2rem] hover:border-purple-500/50 transition-all shadow-xl hover:-translate-y-2 relative">
                        <div className="relative aspect-[2.5/3.5] mb-5 overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50">
                          <Image src={item.card?.image || "/placeholder.png"} alt={item.card.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                             <p className="font-black text-cyan-400 text-xs font-mono">${item.price.toLocaleString('es-CL')}</p>
                          </div>
                        </div>
                        <div className="px-1">
                           <h3 className="font-black text-[11px] uppercase text-slate-200 truncate mb-2">{item.card.name}</h3>
                           <div className="flex justify-between items-center mb-4">
                              <span className="text-[7px] font-bold text-slate-500 uppercase truncate max-w-[70px]">{item.card.set}</span>
                              <span className="text-[7px] font-black px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">{item.condition}</span>
                           </div>
                           
                           {/* MINI CARD DEL VENDEDOR */}
                           <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                              <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-[9px] font-black text-purple-500 border border-white/5">
                                 {item.user?.name?.charAt(0) || "O"}
                              </div>
                              <div className="flex flex-col leading-none">
                                 <p className="text-[9px] font-black text-white uppercase">{item.user?.name || "Operador"}</p>
                                 <p className="text-[7px] font-bold text-purple-400 uppercase mt-0.5">LVL {item.user?.heroLevel || 1}</p>
                              </div>
                           </div>
                        </div>
                    </div>
                  </Link>
                ))}
             </div>

             {listings.length === 0 && (
               <div className="py-20 text-center border border-dashed border-white/5 rounded-[40px]">
                  <p className="text-slate-500 font-mono uppercase text-[10px] tracking-[0.4em] animate-pulse">
                    Buscando señal... Sector vacío.
                  </p>
               </div>
             )}
        </div>
      </div>
    </div>
  );
}