import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLevelFromXP, XP_CONSTANTS } from "@/lib/utils/xp-calculator";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { action, amount } = await request.json();
    
    let xpGained = 0;
    switch (action) {
      case "BID_PLACED":
        xpGained = XP_CONSTANTS.BID_PLACED;
        break;
      case "BID_WON":
        xpGained = XP_CONSTANTS.BID_WON;
        break;
      case "LISTING_CREATED":
        xpGained = XP_CONSTANTS.LISTING_CREATED;
        break;
      case "LISTING_SOLD":
        xpGained = XP_CONSTANTS.LISTING_SOLD + (amount ? Math.floor(amount / 1000) : 0);
        break;
      default:
        xpGained = amount || 0;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const newTotalXP = user.totalXP + xpGained;
    const newLevel = getLevelFromXP(newTotalXP);
    const leveledUp = newLevel > user.level;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: newTotalXP,
        xp: user.xp + xpGained,
        level: newLevel,
        ...(action === "BID_PLACED" && { totalBids: { increment: 1 } }),
        ...(action === "BID_WON" && { totalWins: { increment: 1 } }),
      }
    });

    return NextResponse.json({
      success: true,
      xpGained,
      newTotalXP,
      newLevel,
      leveledUp,
      user: {
        level: updatedUser.level,
        xp: updatedUser.xp,
        totalXP: updatedUser.totalXP
      }
    });
  } catch (error) {
    console.error("Error al ganar XP:", error);
    return NextResponse.json({ error: "Error al procesar XP" }, { status: 500 });
  }
}