// src/app/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti"; // Importamos la magia

export default function RegisterPage() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Efecto de Confeti al completar el registro
  useEffect(() => {
    if (showSuccess) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#22c55e', '#ffffff'] // Colores morado, verde y blanco
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#22c55e', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [showSuccess]);

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
        setShowSuccess(true);
        setLoading(false);
      } else {
        const errorText = await response.text();
        const cleanError = errorText.replace(/"/g, ''); 
        alert("⚠️ Misión fallida: " + cleanError);
        setLoading(false);
      }
    } catch (error) {
      alert("Error de conexión. Revisa tu consola.");
      setLoading(false);
    }
  }

  const handleNavigation = (path: string) => {
    router.push('/login'); 
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* ==================== MODAL "STARTER PACK" ==================== */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="relative w-full max-w-4xl text-center">
            
            {/* Título de Victoria */}
            <div className="mb-10 animate-in slide-in-from-top-10 duration-700">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                GUERRERO <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">RECLUTADO</span>
              </h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.5em] mt-4 animate-pulse">
                Identidad Forjada • Acceso Concedido
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              
              {/* === LA NUEVA "ID CARD" DEL JUGADOR === */}
              <div className="relative group w-full max-w-xs perspective-1000 animate-in zoom-in duration-700 delay-150">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-slate-900 border border-white/10 rounded-xl p-6 flex flex-col items-center shadow-2xl">
                  {/* Avatar Placeholder */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-1 mb-4 shadow-lg shadow-purple-500/30">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-3xl">
                      👾
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{data.name}</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Nivel 1 • Novato</p>
                  
                  {/* Stats Ficticias de Inicio */}
                  <div className="w-full grid grid-cols-2 gap-2 text-center mb-4">
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-[8px] text-slate-400 uppercase">XP</p>
                      <p className="text-xs font-bold text-green-400">0 / 100</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <p className="text-[8px] text-slate-400 uppercase">Rango</p>
                      <p className="text-xs font-bold text-yellow-400">F</p>
                    </div>
                  </div>
                  
                  <div className="text-[9px] text-slate-600 font-mono">ID: {Math.floor(Math.random() * 999999)}</div>
                </div>
              </div>

              {/* === OPCIONES DE CAMINO === */}
              <div className="flex flex-col gap-4 w-full max-w-sm animate-in slide-in-from-right-8 duration-700 delay-300">
                
                {/* Botón Bodega */}
                <button 
                  onClick={() => handleNavigation('/inventory')}
                  className="group relative flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-purple-500/50 p-4 rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🎒
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase">Ir a mi Bodega</h4>
                    <p className="text-[10px] text-slate-400">Gestiona tu inventario inicial</p>
                  </div>
                  <span className="ml-auto text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">➜</span>
                </button>

                {/* Botón Perfil */}
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="group relative flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-yellow-500/50 p-4 rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase">Editar Perfil</h4>
                    <p className="text-[10px] text-slate-400">Personaliza tu avatar</p>
                  </div>
                  <span className="ml-auto text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">➜</span>
                </button>

                <p className="text-[9px] text-center text-slate-600 mt-4">
                  Serás redirigido al Login para asegurar tu cuenta.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Fondos RPG */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" />
         <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-t from-purple-900/10 to-transparent" />
      </div>

      <div className={`relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all duration-500 ${showSuccess ? 'blur-xl scale-90 opacity-0 pointer-events-none' : 'animate-in fade-in slide-in-from-bottom-8'}`}>
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