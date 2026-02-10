// @ts-nocheck
"use client";

import { createCheckoutSession } from "@/lib/stripe-actions";
import Link from "next/link";

export default function SubscriptionPage() {
  
  // FUNCIÓN DE PAGO (Logística Financiera)
  const handleSubscribe = async (priceId: string, planName: string) => {
    if (planName === "Básico") {
      // Si es el plan gratis, simplemente lo enviamos al dashboard
      window.location.href = "/dashboard";
      return;
    }
    // Para planes pagados, iniciamos la sesión de Stripe
    // Nota: El "ID_USUARIO_ACTUAL" debe venir de tu sistema de autenticación
    await createCheckoutSession(priceId, "ID_USUARIO_ACTUAL");
  };

  const plans = [
    {
      name: "Básico",
      price: "0",
      priceId: "free",
      description: "Ideal para empezar tu colección.",
      features: [
        "Hasta 10 publicaciones activas", 
        "Comisión de venta: 10%", 
        "Soporte vía ticket",
        "Acceso al catálogo base"
      ],
      popular: false,
      buttonText: "Plan Actual"
    },
    {
      name: "Pro Seller",
      price: "9.990",
      // ⬇️ RECUERDA PEGAR TU PRICE ID DE STRIPE AQUÍ ⬇️
      priceId: "price_AQUÍ_VA_TU_ID_PRO", 
      description: "Optimiza tus ventas y destaca.",
      features: [
        "Publicaciones ilimitadas", 
        "Comisión de venta: 7%", 
        "Badge 'Vendedor Verificado'",
        "Prioridad en resultados de búsqueda"
      ],
      popular: true,
      buttonText: "Mejorar a Pro"
    },
    {
      name: "Market Maker",
      price: "24.990",
      // ⬇️ RECUERDA PEGAR TU PRICE ID DE STRIPE AQUÍ ⬇️
      priceId: "price_AQUÍ_VA_TU_ID_ELITE", 
      description: "Nivel profesional para tiendas.",
      features: [
        "Comisión mínima: 5%", 
        "Analytics Pro (Power BI Style)", 
        "Gestión masiva vía CSV",
        "Soporte prioritario 24/7"
      ],
      popular: false,
      buttonText: "Ser Elite"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* HEADER PREMIUM SEINA */}
      <div className="relative h-[45vh] flex flex-col items-center justify-center overflow-hidden border-b border-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-purple-900/10 to-slate-950" />
        <h1 className="relative z-10 text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4 text-center">
          SEINA <span className="text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">PREMIUM</span>
        </h1>
        <p className="relative z-10 text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px] text-center px-6 leading-relaxed">
          Suscripciones para coleccionistas y tiendas de élite en Chile
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-slate-900/60 backdrop-blur-2xl border ${
                plan.popular 
                ? 'border-purple-500 shadow-2xl shadow-purple-900/20 scale-105 z-10' 
                : 'border-slate-800'
              } rounded-[40px] p-10 transition-all hover:border-purple-400 group flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="bg-purple-600 text-[10px] font-black uppercase px-4 py-1 rounded-full italic tracking-widest w-fit mb-6 mx-auto">
                  Más Recomendado
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black uppercase italic mb-3 tracking-tighter">{plan.name}</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-none">{plan.description}</p>
              </div>
              
              <div className="mb-10 flex items-baseline justify-center gap-2">
                <span className="text-6xl font-black tracking-tighter">${plan.price}</span>
                <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">/ Mes</span>
              </div>

              <div className="h-px bg-slate-800 w-full mb-10" />

              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 text-xs shrink-0">✓</div>
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleSubscribe(plan.priceId, plan.name)}
                className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  plan.popular 
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30' 
                  : 'bg-slate-800 text-gray-400 hover:text-white'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* NOTA DE SEGURIDAD (Mismo estilo que Comercial Central Chile) */}
        <div className="mt-20 text-center space-y-4">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] italic">
              🔒 Pagos procesados por Stripe • SEINA MARKET Chile
            </p>
            <div className="flex justify-center gap-8 opacity-30 grayscale contrast-125">
               {/* Iconos de confianza */}
               <span className="text-2xl">💳</span>
               <span className="text-2xl">🛡️</span>
               <span className="text-2xl">⚡</span>
            </div>
        </div>
      </div>
    </div>
  );
}