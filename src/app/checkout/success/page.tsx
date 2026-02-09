import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-green-900/20">
        
        {/* Icono de Check Animado */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-400 mb-6">
          Tus cartas Pokémon ya son tuyas. Te hemos enviado un correo con el recibo.
        </p>

        <div className="space-y-3">
          <Link 
            href="/dashboard" 
            className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700"
          >
            Ver mis Pedidos
          </Link>
          <Link 
            href="/" 
            className="block w-full text-purple-400 hover:text-purple-300 font-medium py-2"
          >
            Volver a la Tienda
          </Link>
        </div>

      </div>
    </div>
  );
}