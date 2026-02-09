// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { updateListing } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id: id },
    include: { card: true }
  });

  if (!listing) return notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 flex justify-center">
      <div className="max-w-2xl w-full">
        <Link href="/dashboard" className="text-gray-500 hover:text-white mb-8 inline-block font-bold uppercase text-xs tracking-widest">
          ← Cancelar y Volver
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-10 shadow-2xl">
          <h1 className="text-3xl font-black uppercase italic mb-8 text-purple-500">Editar Publicación</h1>
          
          <div className="flex items-center gap-6 mb-10 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div className="relative w-20 h-28 shrink-0">
              <Image src={listing.card.imageUrlSmall} alt={listing.card.name} fill className="object-contain" />
            </div>
            <div>
              <p className="text-xl font-black uppercase italic">{listing.card.name}</p>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-tighter">{listing.card.id}</p>
            </div>
          </div>

          <form action={updateListing} className="space-y-8">
            <input type="hidden" name="id" value={listing.id} />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Precio de Venta (CLP)</label>
              <input 
                type="number" 
                name="price" 
                defaultValue={listing.price}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-6 text-xl font-black focus:border-purple-500 focus:outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Estado de la Carta</label>
              <select 
                name="condition" 
                defaultValue={listing.condition}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-6 font-bold focus:border-purple-500 focus:outline-none transition-all appearance-none"
              >
                <option value="NM">Near Mint (Como nueva)</option>
                <option value="LP">Lightly Played (Poco uso)</option>
                <option value="MP">Moderately Played (Desgastada)</option>
                <option value="HP">Heavily Played (Dañada)</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-900/20 transition-all transform active:scale-95 uppercase tracking-tighter"
            >
              Guardar Cambios en Bodega
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}