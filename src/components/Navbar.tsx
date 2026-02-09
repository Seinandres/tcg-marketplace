"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext"; // Conectamos con el nuevo sistema
import { useState } from "react";

export default function Navbar() {
  const { cart } = useCart(); // Extraemos 'cart' en lugar de 'items'
  const [query, setQuery] = useState("");

  return (
    <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg flex items-center justify-center font-black text-white shadow-lg group-hover:rotate-12 transition-transform">
            T
          </div>
          <span className="hidden md:block font-black text-xl tracking-tighter text-white">
            TCG <span className="text-purple-500">Chile</span>
          </span>
        </Link>

        {/* BUSCADOR */}
        <form action="/search" className="flex-1 max-w-xl relative">
          <input
            type="text"
            name="q"
            placeholder="Buscar Charizard, Mew, 151..."
            className="w-full bg-slate-950 border border-slate-800 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white"
          />
          <span className="absolute left-3 top-2.5 text-gray-500 text-sm">🔍</span>
        </form>

        {/* ACCIONES */}
        <div className="flex items-center gap-2 md:gap-6">
          <Link 
            href="/dashboard" 
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
          >
            <span>👤</span> Ver mis Cartas publicadas
          </Link>

          <Link 
            href="/sell" 
            className="bg-green-600 hover:bg-green-500 text-white text-xs md:text-sm font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow-lg shadow-green-900/20 transition-all transform active:scale-95"
          >
            💰 <span className="hidden xs:inline">Vender</span>
          </Link>

          {/* CARRITO CON CONTADOR REAL */}
          <Link href="/cart" className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors group">
            <span className="text-xl">🛒</span>
            {/* Aquí arreglamos el error: usamos 'cart.length' */}
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900 group-hover:scale-110 transition-transform">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}