// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  // Validación de Email en tiempo real
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setData({ ...data, email });
    if (email.includes('@') && email.includes('.')) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  };

  const loginUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulamos un retraso de "Escaneo" para el efecto dramático
    await new Promise(resolve => setTimeout(resolve, 800));

    const callback = await signIn('credentials', {
      ...data,
      redirect: false
    });

    if (callback?.error) {
      setError("ACCESO DENEGADO: Credenciales inválidas.");
      setLoading(false);
      // Efecto de vibración si falla (puedes agregarlo con CSS después)
    }

    if (callback?.ok) {
      router.push('/dashboard'); 
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Fondo Cibernético (Red) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
      </div>

      {/* Orbe de luz ambiental */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md p-4">
        
        {/* Título y Motivación */}
        <div className="text-center mb-8 animate-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            ACCESO AL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">MERCADO</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">
              Sistema Online • Oportunidades activas
            </p>
          </div>
        </div>

        {/* TARJETA DE LOGIN "HIGHTECH" */}
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 rounded-[2rem] p-8 shadow-2xl overflow-hidden group transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
          
          {/* Línea de Escáner (Animación) */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_3s_ease-in-out_infinite] opacity-50 pointer-events-none"></div>
          
          <form onSubmit={loginUser} className="space-y-6 relative z-10">
            
            {/* Input Email con Validación */}
            <div className="space-y-2 group/input">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                <span>Identificación (Email)</span>
                {emailValid === true && <span className="text-green-400 animate-in fade-in">✅ VERIFICADO</span>}
                {emailValid === false && data.email.length > 0 && <span className="text-red-400 animate-in fade-in">❌ FORMATO INVÁLIDO</span>}
              </label>
              <div className="relative group focus-within:scale-[1.02] transition-transform duration-200">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className={`text-lg transition-colors ${emailValid ? 'text-green-400' : 'text-slate-500'}`}>👤</span>
                </div>
                <input 
                  type="email" 
                  value={data.email}
                  onChange={handleEmailChange}
                  className={`w-full bg-slate-950/50 border rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:bg-slate-900/90 transition-all text-sm shadow-inner ${
                    emailValid === false && data.email.length > 0 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-white/10 focus:border-blue-500'
                  }`}
                  placeholder="nombre@guerrero.com"
                  required
                />
                {/* Glow interno al enfocar */}
                <div className="absolute inset-0 rounded-xl bg-blue-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2 group/input">
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                <span>Clave de Acceso</span>
                <span className="opacity-0 group-focus-within/input:opacity-100 transition-opacity text-[8px] text-blue-300">ENCRIPTADO</span>
              </label>
              <div className="relative group focus-within:scale-[1.02] transition-transform duration-200">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 text-lg">🔒</span>
                </div>
                <input 
                  type="password" 
                  value={data.password}
                  onChange={(e) => setData({...data, password: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:bg-slate-900/90 transition-all text-sm shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 animate-in shake duration-300">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-xs text-red-400 font-bold">{error}</p>
              </div>
            )}

            {/* Botón de Login Épico */}
            <button 
              disabled={loading}
              className={`group relative w-full mt-2 overflow-hidden font-black uppercase text-xs tracking-[0.2em] py-5 rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed ${
                loading ? 'bg-slate-800 border border-blue-500/30' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)]'
              }`}
            >
              {loading ? (
                // Estado de Carga (Escaneo Biométrico)
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-blue-400 animate-pulse">Verificando Identidad...</span>
                  <div className="w-1/2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 animate-[loading_1s_ease-in-out_infinite]" style={{width: '100%'}}></div>
                  </div>
                </div>
              ) : (
                // Estado Normal
                <>
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0] group-hover:bg-[position:200%_0] transition-all duration-1000" />
                  <span className="relative flex items-center justify-center gap-3 text-white">
                    Desbloquear Terminal <span className="text-lg">🔓</span>
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Footer del Login */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 mb-4">
              ¿Eres nuevo en la Arena?
            </p>
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] group"
            >
              <span>Reclutamiento (Crear Cuenta)</span>
              <span className="group-hover:translate-x-1 transition-transform">➜</span>
            </Link>
          </div>

        </div>
        
        {/* Estadísticas Falsas de Mercado */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center opacity-70 hover:opacity-100 transition-opacity">
            <div className="bg-slate-900/40 backdrop-blur-md rounded-lg p-3 border border-white/5 hover:border-green-500/30 transition-colors">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Volumen 24h</p>
                <p className="text-xs font-black text-green-400">▲ 1,240</p>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-md rounded-lg p-3 border border-white/5 hover:border-yellow-500/30 transition-colors">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Lote Récord</p>
                <p className="text-xs font-black text-yellow-400">$850k</p>
            </div>
            <div className="bg-slate-900/40 backdrop-blur-md rounded-lg p-3 border border-white/5 hover:border-blue-500/30 transition-colors">
                <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Guerreros</p>
                <p className="text-xs font-black text-blue-400">342 ON</p>
            </div>
        </div>

      </div>
    </div>
  );
}