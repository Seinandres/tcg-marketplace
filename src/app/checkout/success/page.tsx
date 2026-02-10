// @ts-nocheck
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Fondo Festivo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-950 to-slate-950 animate-pulse" />
      
      <div className="max-w-lg w-full bg-slate-900/80 backdrop-blur-xl border border-purple-500/30 rounded-[40px] p-12 text-center relative z-10 shadow-2xl">
        <div className="text-6xl mb-6 animate-bounce">🎉</div>
        
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
          ¡Compra Exitosa!
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-10 leading-relaxed">
          Gracias por tu compra. El vendedor ha sido notificado y tus cartas están siendo preparadas para el envío.
        </p>

        <div className="bg-slate-950 rounded-2xl p-6 mb-10 border border-slate-800">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Orden #SEINA-{Math.floor(Math.random() * 10000)}</p>
            <div className="flex justify-between items-center text-sm font-bold">
                <span>Estado del Pago</span>
                <span className="text-green-500 flex items-center gap-1">● Aprobado</span>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <Link href="/" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black uppercase py-4 rounded-xl text-xs tracking-widest transition-all shadow-lg shadow-purple-900/20">
              Seguir Explorando
            </Link>
            <Link href="/dashboard" className="w-full bg-transparent border border-slate-700 text-gray-400 hover:text-white hover:bg-slate-800 font-black uppercase py-4 rounded-xl text-xs tracking-widest transition-all">
              Ver Mis Pedidos
            </Link>
        </div>
      </div>
    </div>
  );
}