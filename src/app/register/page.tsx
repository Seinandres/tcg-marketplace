// src/app/register/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function RegisterPage() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Estados para la animación de "Reveal"
  const [isFlipped, setIsFlipped] = useState(false); // La carta empieza boca abajo
  const [showContent, setShowContent] = useState(false); // Retraso para textos

  // --- LÓGICA TILT 3D ---
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };
  // ----------------------

  // SECUENCIA CINEMÁTICA DE ÉXITO
  useEffect(() => {
    if (showSuccess) {
      // 1. Esperamos 600ms con la carta boca abajo (Suspenso)
      setTimeout(() => {
        setIsFlipped(true); // ¡GIRA LA CARTA!
        
        // 2. Disparamos confeti justo cuando la carta se revela
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#22c55e', '#ffffff', '#fbbf24']
        });
      }, 600);

      // 3. Mostramos los botones y textos laterales un poco después
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
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
      alert("Error de conexión.");
      setLoading(false);
    }
  }

  const handleNavigation = (path: string) => {
    router.push('/login'); 
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* ==================== MODAL DE EXPERIENCIA "PACK OPENING" ==================== */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-xl animate-in fade-in duration-300">
          
          {/* Fondo Cibernético Animado */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
          </div>

          <div className="relative w-full max-w-5xl text-center z-10">
            
            {/* Título que aparece suavemente */}
            <div className={`mb-12 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter drop-shadow-[0_0_35px_rgba(168,85,247,0.6)]">
                GUERRERO <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse">DESPERTADO</span>
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 perspective-2000">
              
              {/* === LA CARTA FLIPPEABLE === */}
              <div 
                className="relative w-72 h-96 cursor-pointer group perspective-1000"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Contenedor que hace el giro real */}
                <div 
                  className="w-full h-full relative transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped 
                      ? `rotateY(180deg) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` // Si giró, aplicamos tilt al frente
                      : `rotateY(0deg) rotateX(${rotate.x/2}deg) rotateY(${rotate.y/2}deg)` // Si no, tilt a la espalda
                  }}
                >
                  
                  {/* --- CARA TRASERA (BOCA ABAJO - SEINA LOGO) --- */}
                  <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center backface-hidden z-20 overflow-hidden">
                    {/* Patrón de la espalda */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                    
                    <div className="relative z-10 animate-pulse">
                      <div className="w-24 h-24 rounded-full border-4 border-slate-700 flex items-center justify-center bg-slate-950">
                         <span className="text-3xl font-black text-slate-700 italic">SE</span>
                      </div>
                    </div>
                  </div>

                  {/* --- CARA DELANTERA (BOCA ARRIBA - PERFIL) --- */}
                  <div 
                    ref={cardRef}
                    className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-900 to-black rounded-2xl border border-white/20 p-6 flex flex-col items-center justify-between shadow-[0_0_50px_rgba(168,85,247,0.3)] backface-hidden [transform:rotateY(180deg)] overflow-hidden"
                  >
                    {/* Efecto Holográfico Automático (Barrido de brillo) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent z-30 w-[200%] h-full animate-[shimmer_3s_infinite_linear] pointer-events-none" />
                    
                    {/* Header Carta */}
                    <div className="w-full flex justify-between items-start mb-4 relative z-10">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TCG CARD</div>
                        <div className="px-2 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/50 text-[8px] font-black text-yellow-400 uppercase animate-pulse">★ LEGENDARY</div>
                    </div>

                    {/* Avatar Épico */}
                    <div className="relative w-32 h-32 mb-4 group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                      <div className="relative w-full h-full rounded-full bg-slate-950 p-1 border-2 border-white/10">
                         <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                            {/* Aquí iría la imagen del usuario real si la tuviera */}
                            <span className="text-5xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">👾</span>
                         </div>
                      </div>
                    </div>

                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1 drop-shadow-lg">{data.name}</h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-[10px] text-green-400 uppercase font-bold tracking-[0.2em]">Online</p>
                      </div>
                    </div>
                    
                    {/* Stats Footer */}
                    <div className="w-full grid grid-cols-2 gap-0 border-t border-white/10 mt-auto pt-4 relative z-10">
                      <div className="text-center border-r border-white/10">
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Nivel</p>
                        <p className="text-xl font-black text-white">1</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Mazo</p>
                        <p className="text-xl font-black text-white">0</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* === BOTONES LATERALES (APARECEN DESPUÉS) === */}
              <div className={`flex flex-col gap-4 w-full max-w-sm transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                
                <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl mb-2">
                  <p className="text-xs text-purple-200 font-medium italic text-center">
                    "Bienvenido a Seina Market. Tu carta de jugador ha sido acuñada en la base de datos."
                  </p>
                </div>

                {/* Botón Bodega */}
                <button 
                  onClick={() => handleNavigation('/inventory')}
                  className="group relative flex items-center justify-between bg-slate-800 border-2 border-slate-700 hover:border-green-500 p-5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-900/50 flex items-center justify-center text-green-400 font-black text-xl">
                      🎒
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-black text-white uppercase">Ir a mi Bodega</h4>
                      <p className="text-[10px] text-slate-400">Ver inventario inicial</p>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-green-400 transition-colors">➜</span>
                </button>

                {/* Botón Perfil */}
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="group relative flex items-center justify-between bg-slate-800 border-2 border-slate-700 hover:border-blue-500 p-5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-900/50 flex items-center justify-center text-blue-400 font-black text-xl">
                      🛡️
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-black text-white uppercase">Editar Perfil</h4>
                      <p className="text-[10px] text-slate-400">Personalizar carta</p>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-blue-400 transition-colors">➜</span>
                </button>

                <p className="text-[9px] text-center text-slate-600 mt-4 font-mono">
                  SISTEMA DE SEGURIDAD: REQUIERE LOGIN
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Fondos y Formulario (Sin cambios funcionales) */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#020617] to-[#020617]" />
         <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-t from-purple-900/10 to-transparent" />
      </div>

      <div className={`relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl transition-all duration-1000 ${showSuccess ? 'blur-xl scale-75 opacity-0 pointer-events-none translate-y-20' : 'animate-in fade-in slide-in-from-bottom-8'}`}>
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