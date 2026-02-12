import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { XP_CONSTANTS } from "@/lib/utils/xp-calculator";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const body = await request.json();
    const { listingId, amount } = body;

    if (!listingId || !amount) {
      return new NextResponse("Faltan datos", { status: 400 });
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado", { status: 404 });
    }

    // Buscar listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { 
        bids: { orderBy: { amount: 'desc' }, take: 1 }
      }
    });

    if (!listing) {
      return new NextResponse("Subasta no encontrada", { status: 404 });
    }

    // Validar que no sea el dueño
    if (listing.userId === user.id) {
      return new NextResponse("No puedes pujar en tu propia subasta", { status: 400 });
    }

    // Validar que el monto sea mayor
    const currentHighest = listing.bids[0]?.amount || listing.price;
    if (amount <= currentHighest) {
      return new NextResponse("La puja debe ser mayor a la actual", { status: 400 });
    }

    // Crear puja
    const bid = await prisma.bid.create({
      data: {
        userId: user.id,
        listingId: listingId,
        amount: amount
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    // 🎮 DAR RECOMPENSA XP
    const xpGain = XP_CONSTANTS.BID_PLACED;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        heroXP: { increment: xpGain }
      }
    });

    return NextResponse.json({
      success: true,
      bid,
      xpGained: xpGain
    });

  } catch (error: any) {
    console.error("Error en bid:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}