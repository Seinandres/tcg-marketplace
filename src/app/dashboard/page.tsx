// @ts-nocheck
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. Buscamos en la base de datos las cartas publicadas
  // Por ahora, para que veas datos, traemos las últimas del marketplace
  const myListings = await prisma.listing.findMany({
    include: {
      card: true,
    },
    take: 10,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado Profesional */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Panel de Control
            </h1>
            <p className="text-gray-400 font-medium italic">Gestión de inventario para @AshKetchum</p>
          </div>
          <Link 
            href="/sell" 
            className="bg-green-600 hover:bg-green-500 text-white font-black py-4 px-10 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all transform active:scale-95 uppercase text-sm"
          >
            + Publicar Nueva Carta
          </Link>
        </div>

        {/* Resumen de Stock (Estilo Logística) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">📦</div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Publicaciones Activas</p>
            <p className="text-5xl font-black text-purple-500">{myListings.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">💰</div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Valor Estimado</p>
            <p className="text-5xl font-black text-blue-500">---</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">📧</div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Interesados</p>
            <p className="text-5xl font-black text-green-500">0</p>
          </div>
        </div>

        {/* Listado de Inventario */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
            <h2 className="text-xl font-bold italic tracking-tight">Tu Bodega Digital</h2>
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">Sistema Sincronizado</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-5">Producto</th>
                  <th className="px-8 py-5 text-center">Estado</th>
                  <th className="px-8 py-5 text-right">Precio de Venta</th>
                  <th className="px-8 py-5 text-center">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {myListings.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-500/5 transition-colors group">
                    <td className="px-8 py-6 flex items-center gap-6">
                      <div className="relative w-14 h-20 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Image src={item.card.imageUrlSmall} alt={item.card.name} fill className="object-contain" />
                      </div>
                      <div>
                        <p className="font-black text-white text-lg leading-none mb-1">{item.card.name}</p>
                        <p className="text-[10px] font-mono text-gray-500 uppercase">{item.card.set.name} • #{item.card.number}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="bg-slate-800 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="font-black text-xl text-white tracking-tighter">
                        ${item.price.toLocaleString('es-CL')}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-4">
                        <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Editar</button>
                        <button className="text-xs font-bold text-red-900 hover:text-red-500 transition-colors uppercase tracking-widest">Retirar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {myListings.length === 0 && (
              <div className="text-center py-20 bg-slate-950/20">
                <p className="text-gray-600 font-bold italic">La bodega está vacía. Comienza a publicar tus productos.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}