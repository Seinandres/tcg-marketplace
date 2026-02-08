'use client'

import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useState } from 'react' // 👈 Para guardar lo que escribes
import { useRouter } from 'next/navigation' // 👈 Para cambiar de página

export default function Navbar() {
  const { items } = useCart()
  const [search, setSearch] = useState('') // Guardamos el texto aquí
  const router = useRouter() // El "chofer" que nos lleva a otra página

  // Función que se activa al presionar una tecla
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim() !== '') {
      // Si apretó Enter, nos vamos a la página de búsqueda
      router.push(`/search?q=${search}`)
      setSearch('') // Limpiamos la barra
    }
  }

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform">
              T
            </div>
            <span className="font-bold text-xl tracking-tight">TCG Chile</span>
          </Link>

          {/* BUSCADOR ACTIVO */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar Charizard, Mew..." 
                className="w-full bg-slate-950 border border-slate-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-purple-500 text-sm transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)} // Guardamos mientras escribes
                onKeyDown={handleSearch} // Detectamos el Enter
              />
              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
            </div>
          </div>
{/* BOTÓN VENDER */}
            <Link href="/sell" className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-1">
              <span>💰</span> Vender
            </Link>
          <div className="flex items-center gap-6">
            {/* ENLACE AL DASHBOARD */}
            <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <span>👤</span> Mis Cartas
            </Link>
            
            <Link href="/cart" className="relative p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors group">
              <span className="text-xl">🛒</span>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900 group-hover:scale-110 transition-transform">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}