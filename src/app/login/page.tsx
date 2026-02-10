// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [data, setData] = useState({ email: '', password: '' });
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loginUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/auctions'); // Redirige a la arena
      router.refresh();
    } else {
      alert("Credenciales incorrectas, guerrero.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Fondos RPG */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#020617] to-[#020617]" />
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">
            SEINA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">ID</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Identifícate para entrar a la Arena</p>
        </div>

        <form onSubmit={loginUser} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={data.email}
              onChange={(e) => setData({...data, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
              placeholder="entrenador@seina.cl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest ml-1">Contraseña</label>
            <input 
              type="password" 
              value={data.password}
              onChange={(e) => setData({...data, password: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? "Conectando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            ¿Nuevo recluta? {' '}
            <Link href="/register" className="text-white font-bold hover:text-purple-400 underline decoration-purple-500/50 hover:decoration-purple-500 transition-all">
              Crear cuenta de Héroe
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}