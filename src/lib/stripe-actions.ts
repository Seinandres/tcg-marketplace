// src/lib/stripe-actions.ts
// ✅ VERSIÓN MEJORADA - Usa cliente centralizado
"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe"; // ✅ IMPORTAMOS EL STRIPE CENTRALIZADO
import { redirect } from "next/navigation";

/**
 * Crear sesión de checkout para suscripción
 * @param priceId - ID del precio en Stripe (ej: price_xxx)
 * @param userId - ID del usuario en tu base de datos
 */
export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    // 1. Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // 2. Crear sesión de pago segura en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscription?canceled=true`,
      customer_email: user.email || undefined,
      metadata: {
        userId: userId,
      },
    });

    if (!session.url) {
      throw new Error("No se pudo generar URL de pago");
    }

    // 3. Redirigir a la pasarela de Stripe
    redirect(session.url);
  } catch (error) {
    console.error("❌ Error al crear sesión de Stripe:", error);
    throw new Error("No se pudo iniciar el proceso de pago.");
  }
}