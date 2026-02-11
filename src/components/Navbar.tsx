"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Importamos los hooks oficiales para manejar la sesión y el logout
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  // useSession detecta automáticamente cambios. 'status' nos dice si está cargando.
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [equippedCount, setEquippedCount] = useState(0);

  // Efecto para cargar datos RPG extras solo si hay sesión
  useEffect(() => {
    if (session?.user) {
      fetch('/api/inventory')
        .then(res => res.json())
        .then(invData => {
          setEquippedCount(invData.stats?.equipped || 0);
        })
        .catch(() => setEquippedCount(0));
    }
  }, [session, pathname]); // Se actualiza si cambia la sesión o la página

  // Función de Logout Blindada
  const handleSignOut = async () => {
    setIsMenuOpen(false);
    // signOut se encarga de borrar cookies, limpiar estado y redirigir
    await signOut({ callbackUrl: "/login" });
  };

  // Skeleton de carga (Mantenemos tu diseño de carga)
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-[100] bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 shadow-2xl">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="h-12 w-48 bg-slate-800/50 animate-pulse rounded-xl"></div>
          <div className="h-10 w-32 bg-slate-800/50 animate-pulse rounded-full"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-[100] bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 shadow-2xl">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        
        {/* === LOGO === */}
        <div className="flex items-center gap-10">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <span className="text-3xl font-black italic tracking-tighter text-white group-hover:text-purple-400 transition-colors">
              SEINA<span className="text-purple-500 group-hover:text-pink-500">MARKET</span>
            </span>
            <span className="hidden md:block text-[7px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 border-l border-white/10 pl-3">
              Chile Marketplace
            </span>
          </Link>

          {/* MENÚ PRINCIPAL (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              href={session ? "/dashboard" : "/"} 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-purple-400 ${
                pathname === '/' || pathname === '/dashboard' ? 'text-purple-400' : 'text-slate-400'
              }`}
            >
              INICIO
            </Link>
            <Link 
              href="/auctions" 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-purple-400 ${
                pathname === '/auctions' ? 'text-purple-400' : 'text-slate-400'
              }`}
            >
              SUBASTAS
            </Link>
            <Link 
              href="/sealed" 
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-purple-400 ${
                pathname === '/sealed' ? 'text-purple-400' : 'text-slate-400'
              }`}
            >
              SELLADO
            </Link>
            
            {session?.user && (
              <Link 
                href="/shop" 
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-yellow-400 ${
                  pathname === '/shop' ? 'text-yellow-400' : 'text-slate-400'
                }`}
              >
                <span className="text-sm">🏪</span> ARSENAL
              </Link>
            )}
            
            <Link 
              href="/premium" 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500 hover:text-yellow-400 transition-all"
            >
              <span className="text-sm">★</span> PREMIUM
            </Link>
          </div>
        </div>

        {/* === USUARIO / ACCIONES === */}
        <div className="flex items-center gap-4">
          
          {session?.user ? (
            <>
              {/* BOTÓN VENDER */}
              <Link 
                href="/sell" 
                className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-white to-slate-100 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
              >
                <span>⚡</span>
                Vender Ahora
              </Link>

              {/* DROPDOWN USUARIO */}
              <div className="relative">
                <div className="flex items-center gap-3 bg-slate-900/50 border border-white/10 hover:border-purple-500/50 p-1.5 pr-4 rounded-full transition-all group">
                  
                  {/* Avatar Clickable */}
                  <Link 
                    href="/dashboard"
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs font-black text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-110"
                    title="Centro de Mando"
                  >
                    {session.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "SE"}
                  </Link>

                  {/* Gatillo Menú */}
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex flex-col items-start text-left hover:opacity-80 transition-opacity"
                  >
                    <span className="text-[10px] font-black text-white leading-none uppercase truncate max-w-[80px]">
                      {session.user?.name || "Guerrero"}
                    </span>
                    <span className="text-[8px] font-bold text-purple-400 leading-none mt-1">NIVEL 1</span>
                  </button>

                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`ml-1 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                  >
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* MENÚ DESPLEGABLE */}
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                      
                      {/* Header Menú */}
                      <div className="p-4 border-b border-white/5 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Mi Cuenta</p>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-black text-white shadow-lg">
                            {session.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "SE"}
                          </div>
                          <div>
                            <p className="text-sm font-black text-white">{session.user?.name || "Guerrero"}</p>
                            <p className="text-[10px] text-purple-400 font-bold">Nivel 1 • Novato</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Links Menú */}
                      <div className="p-2 space-y-1">
                        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/10 text-slate-300 hover:text-purple-400 transition-all group">
                          <span className="text-lg group-hover:scale-110 transition-transform">🛰️</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">Centro de Mando</span>
                        </Link>
                        
                        <Link href="/hero" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-yellow-500/10 text-slate-300 hover:text-yellow-400 transition-all group">
                          <span className="text-lg group-hover:scale-110 transition-transform">👤</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">Mi Héroe</span>
                          {equippedCount > 0 && (
                            <span className="ml-auto bg-green-500/20 text-green-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-green-500/30">
                              {equippedCount} ⚡
                            </span>
                          )}
                        </Link>

                        <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-500/10 text-slate-300 hover:text-blue-400 transition-all group">
                          <span className="text-lg group-hover:scale-110 transition-transform">🛡️</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">Perfil</span>
                        </Link>

                        <Link href="/inventory" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition-all group">
                          <span className="text-lg group-hover:scale-110 transition-transform">🎒</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">Arsenal</span>
                        </Link>

                        <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-500/10 text-slate-300 hover:text-orange-400 transition-all group">
                          <span className="text-lg group-hover:scale-110 transition-transform">🏪</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">Tienda</span>
                        </Link>

                        <div className="h-px bg-white/5 my-2" />

                        {/* BOTÓN CERRAR SESIÓN (LOGOUT) */}
                        <button onClick={() => { setIsMenuOpen(false); handleSignOut(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-slate-300 hover:text-red-400 transition-all group">
                          <span className="text-lg group-hover:scale-110 transition-transform">🔌</span>
                          <span className="text-[10px] font-black uppercase tracking-wider">Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            // BOTÓN ACCEDER (SI NO HAY SESIÓN)
            <Link 
              href="/login" 
              className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95"
            >
              ACCEDER
            </Link>
          )}

          {/* CARRITO (SIEMPRE VISIBLE) */}
          <Link 
            href="/cart" 
            className="relative w-11 h-11 rounded-full bg-slate-900/50 border border-white/10 hover:border-purple-500/50 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-95"
          >
            <span className="text-xl">🛒</span>
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-[8px] font-black text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#020617] shadow-lg">
              0
            </span>
          </Link>
        </div>

      </div>
    </nav>
  );
}