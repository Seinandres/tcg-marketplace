import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { XP_CONSTANTS, getLevelFromXP, getRankTitle } from "@/lib/utils/xp-calculator";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const body = await request.json();
    const { action, listingPrice } = body;

    // Encontrar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado", { status: 404 });
    }

    // Calcular recompensas
    let xpGain = 0;
    let coinsGain = 0;

    switch (action) {
      case "LISTING_CREATED":
        xpGain = XP_CONSTANTS.LISTING_CREATED;
        coinsGain = Math.floor(listingPrice / 100); // 1 moneda por cada $100
        break;
      case "LISTING_SOLD":
        xpGain = XP_CONSTANTS.LISTING_SOLD;
        coinsGain = Math.floor(listingPrice / 50); // Más monedas por venta
        break;
      case "BID_PLACED":
        xpGain = XP_CONSTANTS.BID_PLACED;
        break;
      case "BID_WON":
        xpGain = XP_CONSTANTS.BID_WON;
        break;
      default:
        return new NextResponse("Acción inválida", { status: 400 });
    }

    // Actualizar usuario
    const newTotalXP = user.heroXP + xpGain;
    const newCoins = user.coins + coinsGain;
    const newLevel = getLevelFromXP(newTotalXP);
    const oldLevel = getLevelFromXP(user.heroXP);
    const leveledUp = newLevel > oldLevel;

    // Obtener nuevo título si subió de nivel
    const rankInfo = leveledUp ? getRankTitle(newLevel) : null;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        heroXP: newTotalXP,
        heroLevel: newLevel,
        heroTitle: rankInfo ? rankInfo.title : user.heroTitle,
        heroColor: rankInfo ? rankInfo.color : user.heroColor,
        coins: newCoins
      }
    });

    return NextResponse.json({
      success: true,
      xpGained: xpGain,
      coinsGained: coinsGain,
      totalXP: newTotalXP,
      totalCoins: newCoins,
      currentLevel: newLevel,
      leveledUp,
      newRank: rankInfo
    });

  } catch (error: any) {
    console.error("Error en reward:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
