"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError("Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(139,92,246,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(236,72,153,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Contenedor del login */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse" />
        
        <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-xl shadow-purple-500/50">
              <span className="text-4xl">🎴</span>
            </div>
            <h1 className="text-3xl font-black uppercase text-white mb-2 tracking-tight">
              Bienvenido Guerrero
            </h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
              Ingresa a la Arena
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <p className="text-sm text-red-400 font-bold text-center flex items-center justify-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="guerrero@tcg.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-widest">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black uppercase text-sm tracking-wider py-4 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>⚔️</span>
                  <span>Entrar a la Arena</span>
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500 font-bold uppercase">o</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Link a registro */}
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-3">
              ¿Nuevo en la arena?
            </p>
            <Link
              href="/auth/register"
              className="inline-block w-full bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-purple-500/50 text-white font-bold uppercase text-sm tracking-wider py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                <span>🌟</span>
                <span>Crear Cuenta</span>
              </span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-white/5">
            <div className="text-center">
              <div className="text-xl mb-1">🛡️</div>
              <p className="text-[7px] text-slate-500 uppercase font-bold">Seguro</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">⚡</div>
              <p className="text-[7px] text-slate-500 uppercase font-bold">Rápido</p>
            </div>
            <div className="text-center">
              <div className="text-xl mb-1">✅</div>
              <p className="text-[7px] text-slate-500 uppercase font-bold">Verificado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Guardar:** `Ctrl + S`

---

# 📋 PASO 10: CREAR PÁGINA DE REGISTRO

**Estructura:**
```
src/app/auth/register/page.tsx
```

**Pasos:**

1. Dentro de `src/app/auth`, crea carpeta `register`
2. Dentro de `register`, crea archivo `page.tsx`

**Visual:**
```
src/app/auth/
├── login/
│   └── page.tsx     ← (ya creado)
└── register/        ← NUEVA CARPETA
    └── page.tsx     ← NUEVO ARCHIVO