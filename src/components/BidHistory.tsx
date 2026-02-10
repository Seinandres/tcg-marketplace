// src/components/BidHistory.tsx
"use client";

export default function BidHistory({ initialBids }) {
  // Función auxiliar para calcular "hace cuánto tiempo" sin librerías externas
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace unos segundos';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours} h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `hace ${diffInDays} días`;
  };

  // Si no hay pujas, mostramos un mensaje de estado vacío
  if (!initialBids || initialBids.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-[10px] text-slate-500 italic">Sé el primero en desafiar...</p>
      </div>
    );
  }

  return (
    <div className="max-h-[200px] overflow-y-auto custom-scrollbar p-2 space-y-2">
      {initialBids.map((bid) => (
        <div key={bid.id} className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-2">
            {/* Avatar del Usuario */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-[8px] font-bold text-white uppercase border border-white/20 overflow-hidden">
              {bid.user?.image ? (
                <img src={bid.user.image} alt={bid.user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{bid.user?.name?.substring(0, 2) || "U"}</span>
              )}
            </div>
            
            {/* Nombre y Tiempo */}
            <div>
              <p className="text-[9px] font-bold text-slate-200 leading-tight">
                {bid.user?.name || "Entrenador Anónimo"}
              </p>
              <p className="text-[7px] text-slate-500">
                {getTimeAgo(bid.createdAt)}
              </p>
            </div>
          </div>

          {/* Monto de la Puja */}
          <div className="text-right">
            <p className="text-[10px] font-mono font-bold text-green-400">
              ${bid.amount.toLocaleString('es-CL')}
            </p>
            <div className="flex items-center justify-end gap-1">
               <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[6px] text-green-500/80 font-bold uppercase tracking-wider">Oferta</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}