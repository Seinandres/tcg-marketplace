// @ts-nocheck
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext"; // 👈 Recuperamos el contexto del carrito

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart(); // 👈 Obtenemos los items del carro
  const cartCount = cart.length;

  return (
    <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO NEÓN SEINA MARKET */}
        <Link href="/" className="group">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter italic text-white group-hover:text-purple-400 transition-colors duration-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
              SEINA<span className="text-purple-500">MARKET</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500 -mt-1">Chile Marketplace</span>
          </div>
        </Link>

        {/* NAVEGACIÓN CENTRAL */}
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link href="/" className={`hover:text-white transition-colors ${pathname === '/' ? 'text-purple-500' : ''}`}>Inicio</Link>
          <Link href="/auctions" className="hover:text-white transition-colors">Subastas</Link>
          <Link href="/sealed" className="hover:text-white transition-colors">Sellado</Link>
          <Link href="/subscription" className={`hover:text-purple-400 transition-colors flex items-center gap-2 ${pathname === '/subscription' ? 'text-purple-400' : ''}`}>
            ⭐ Premium
          </Link>
        </div>

        {/* ACCIONES DE USUARIO Y CARRITO RESTAURADO */}
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Mi Bodega
          </Link>
          
          <Link 
            href="/sell" 
            className="bg-white text-black text-[10px] font-black uppercase px-6 py-2.5 rounded-full hover:bg-purple-500 hover:text-white transition-all transform active:scale-95 shadow-lg shadow-white/5"
          >
            Vender Ahora
          </Link>

          {/* BOTÓN DEL CARRITO (Restaurado según image_3313da.png) */}
          <Link href="/cart" className="relative group p-2 bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500 transition-all">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            
            {/* BADGE DE NOTIFICACIÓN ROJO */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}