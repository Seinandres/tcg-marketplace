// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Nuevo estado para el modal épico

  const registerUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // En lugar de alert, activamos el Modal Épico
        setShowSuccess(true);
        setLoading(false);
      } else {
        const errorText = await response.text();
        const cleanError = errorText.replace(/"/g, ''); 
        alert("⚠️ Misión fallida: " + cleanError);
        setLoading(false);
      }
    } catch (error) {
      alert("Error de conexión. Revisa tu internet o la consola.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* ==================== MODAL DE ÉXITO (RPG STYLE) ==================== */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-gradient-to-br from-slate-900 to-[#0f172a] border border-green-500/30 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-in zoom-in-95 duration-500">
            
            {/* Efecto de brillo superior */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-green-500 rounded-full blur-[50px] opacity-40 animate-pulse" />
            
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <span className="text-4xl">⚔️</span>
              </div>
            </div>

            <h2 className="text-2xl font-black italic uppercase text-white mb-2 tracking-tighter">
              ¡GUERRERO <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">RECLUTADO!</span>
            </h2>
            
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">
              Tu perfil ha sido forjado con éxito. <br/>
              Ahora ingresa a la arena y configura tu inventario.
            </p>

            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-xl shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-95 group"
            >
              <span className="group-hover:animate-pulse">INICIAR MISIÓN (LOGIN) →</span>
            </button>
          </div>
        </div>
      )}

      {/* Fondos RPG */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" />
         <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-t from-purple-900/10 to-transparent" />
      </div>

      {/* Formulario de Registro */}
      <div className={`relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all duration-500 ${showSuccess ? 'blur-sm scale-95 opacity-50' : 'animate-in fade-in slide-in-from-bottom-8'}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black italic uppercase text-white mb-2 tracking-tighter">
            NUEVO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">GUERRERO</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Crea tu perfil y comienza tu leyenda</p>
        </div>

        <form onSubmit={registerUser} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Nombre de Entrenador</label>
            <input 
              type="text" 
              value={data.name}
              onChange={(e) => setData({...data, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              placeholder="Ej: AshKetchum99"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={data.email}
              onChange={(e) => setData({...data, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Contraseña</label>
            <input 
              type="password" 
              value={data.password}
              onChange={(e) => setData({...data, password: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Unirse a la Arena"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            ¿Ya tienes cuenta? {' '}
            <Link href="/login" className="text-white font-bold hover:text-blue-400 underline decoration-blue-500/50 hover:decoration-blue-500 transition-all">
              Ingresar aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}