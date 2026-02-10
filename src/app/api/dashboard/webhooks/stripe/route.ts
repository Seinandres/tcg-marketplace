// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Si la suscripción fue exitosa
  if (event.type === "checkout.session.completed") {
    await prisma.subscription.upsert({
      where: { userId: session.metadata.userId },
      update: {
        stripePriceId: session.line_items?.data[0].price?.id,
        status: "active",
        currentPeriodEnd: new Date(), // Stripe envía la fecha real, esto es simplificado
      },
      create: {
        userId: session.metadata.userId,
        stripeCustomerId: session.customer as string,
        stripePriceId: "price_example_id",
        status: "active",
        currentPeriodEnd: new Date(),
      },
    });
  }

  return new NextResponse("Success", { status: 200 });
}