// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { redirect } from "next/navigation";

// Inicialización con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    // Buscamos al usuario en la base de datos de SEINA MARKET
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Creamos la sesión de pago segura
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId, // Este ID lo obtienes creando el producto en tu Dashboard de Stripe
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/subscription?canceled=true`,
      customer_email: user?.email,
      metadata: {
        userId: userId,
      },
    });

    // Redirigimos a la pasarela de Stripe
    redirect(session.url!);
  } catch (error) {
    console.error("Error al crear sesión de Stripe:", error);
    throw new Error("No se pudo iniciar el proceso de pago.");
  }
}