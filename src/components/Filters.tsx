"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Filters({ initialQuery, initialRarity }: { initialQuery: string, initialRarity: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  // Función para actualizar la URL sin recargar la página entera
  const updateFilters = (newQuery: string, newRarity: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newQuery) params.set("q", newQuery);
    else params.delete("q");
    
    if (newRarity) params.set("rarity", newRarity);
    else params.delete("rarity");

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-[32px] mb-16 backdrop-blur-xl flex flex-col md:flex-row gap-6 items-center shadow-2xl">
      <form 
        onSubmit={(e) => { e.preventDefault(); updateFilters(query, initialRarity); }} 
        className="flex-1 w-full relative"
      >
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre (ej: Charizard)..." 
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold focus:border-purple-500 outline-none transition-all pl-14 text-white"
        />
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </form>

      <div className="flex gap-4 w-full md:w-auto">
        <select 
          value={initialRarity}
          onChange={(e) => updateFilters(query, e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-2xl py-4 px-8 text-[10px] font-black uppercase tracking-widest outline-none focus:border-purple-500 cursor-pointer text-white appearance-none"
        >
          <option value="">Todas las Rarezas</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Special Illustration Rare">Special Illustration Rare</option>
          <option value="Promo">Promo</option>
        </select>
        
        <button 
          onClick={() => { setQuery(""); updateFilters("", ""); }}
          className="bg-slate-800 hover:bg-slate-700 px-6 py-4 rounded-2xl transition-colors italic font-black text-[10px] uppercase text-gray-400"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}