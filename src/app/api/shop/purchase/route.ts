import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Acceso denegado", { status: 401 });
    }

    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return new NextResponse("Error: ID del activo no especificado", { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      
      const user = await tx.user.findUnique({
        where: { email: session.user.email! },
        include: { rpgItems: true }
      });

      if (!user) throw new Error("Operador no encontrado.");

      const item = await tx.rpgItem.findUnique({
        where: { id: itemId }
      });

      if (!item) throw new Error("El ítem ya no existe.");

      if (user.coins < item.price) {
        throw new Error(`Fondos insuficientes. Faltan ${item.price - user.coins} monedas.`);
      }

      const alreadyOwns = user.rpgItems.some((i) => i.itemId === item.id);
      
      if (alreadyOwns) {
        throw new Error("Ya posees este equipamiento.");
      }

      // 1. Restar Monedas
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          coins: { decrement: item.price }
        }
      });

      // 2. Entregar Item (LA CORRECCIÓN ESTÁ AQUÍ)
      const newItem = await tx.userItem.create({
        data: {
          userId: user.id,
          itemId: item.id,
          isEquipped: false // ⚠️ AQUÍ ESTABA EL ERROR: Antes decía 'equipped'
        }
      });

      return {
        success: true,
        item: item,
        remainingCoins: updatedUser.coins,
        userItem: newItem
      };
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("❌ Error compra:", error.message);
    return new NextResponse(error.message || "Error interno", { status: 400 });
  }
}