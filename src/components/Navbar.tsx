// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession(); // Detecta si el usuario está logueado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO (Igual a tu imagen) */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-2xl font-black italic tracking-tighter text-white group-hover:scale-105 transition-transform">
            SEINA
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              MARKET
            </span>
          </span>
          <span className="hidden sm:block text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5 ml-2">
            Chile Marketplace
          </span>
        </Link>

        {/* MENU CENTRAL (Links de tu captura) */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'INICIO', path: '/' },
            { name: 'SUBASTAS', path: '/auctions' },
            { name: 'SELLADO', path: '/sealed' },
            { name: 'PREMIUM', path: '/premium', icon: '⭐' }
          ].map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors flex items-center gap-1.5 ${
                link.name === 'PREMIUM' ? 'text-yellow-400 hover:text-yellow-200' : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.icon && <span>{link.icon}</span>}
              {link.name}
            </Link>
          ))}
        </div>

        {/* ZONA DERECHA (Usuario y Acciones) */}
        <div className="flex items-center gap-4">
          
          {/* Lógica de Sesión: Si hay usuario muestra Perfil, si no, muestra Login */}
          {session?.user ? (
            // --- ESTADO: LOGUEADO ---
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-bold text-white leading-none">{session.user.name}</p>
                <p className="text-[8px] text-purple-400 font-black uppercase tracking-wider">Nivel 1</p>
              </div>
              
              <div className="relative group cursor-pointer">
                {/* Avatar del usuario */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-[1px]">
                  <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center overflow-hidden">
                    {session.user.image ? (
                        <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-sm font-bold text-white">{session.user.name?.substring(0,2).toUpperCase()}</span>
                    )}
                  </div>
                </div>
                
                {/* Dropdown simple al hacer hover */}
                <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Mi Cuenta</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Perfil de Héroe</Link>
                    <Link href="/inventory" className="block px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors">Mi Bodega</Link>
                    <button 
                        onClick={() => signOut()} 
                        className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors mt-1"
                    >
                        Cerrar Sesión
                    </button>
                </div>
              </div>
            </div>
          ) : (
            // --- ESTADO: NO LOGUEADO (Visitante) ---
            <Link 
              href="/login"
              className="text-[10px] font-black text-slate-300 hover:text-white uppercase tracking-widest transition-colors"
            >
              MI BODEGA (LOGIN)
            </Link>
          )}

          {/* Botón VENDER AHORA (Siempre visible) */}
          <Link 
            href="/sell"
            className="hidden md:flex bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            Vender Ahora
          </Link>

          {/* Carrito */}
          <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-white transition-colors">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </button>

        </div>
      </div>
    </nav>
  );
}