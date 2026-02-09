// @ts-nocheck
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-bounce">
        ✓
      </div>
      <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-4 text-green-400">
        ¡Pago Exitoso!
      </h1>
      <p className="text-gray-400 max-w-md mb-12 font-medium">
        Tu pedido ha sido procesado. Te enviaremos un correo con los detalles de la entrega en Chile.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard" className="bg-slate-900 border border-slate-800 text-white font-black py-4 px-10 rounded-2xl uppercase text-xs hover:bg-slate-800 transition-all">
          Ver mi Dashboard
        </Link>
        <Link href="/" className="bg-purple-600 text-white font-black py-4 px-10 rounded-2xl uppercase text-xs hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/20">
          Seguir Comprando
        </Link>
      </div>
    </div>
  );
}