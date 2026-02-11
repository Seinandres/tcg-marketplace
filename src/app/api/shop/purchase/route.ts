import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return new NextResponse("ItemId requerido", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado", { status: 404 });
    }

    const item = await prisma.rpgItem.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      return new NextResponse("Item no encontrado", { status: 404 });
    }

    if (user.coins < item.price) {
      return new NextResponse("Monedas insuficientes", { status: 400 });
    }

    const alreadyOwns = await prisma.userItem.findFirst({
      where: {
        userId: user.id,
        itemId: item.id
      }
    });

    if (alreadyOwns) {
      return new NextResponse("Ya posees este item", { status: 400 });
    }

    const [updatedUser, userItem] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          coins: user.coins - item.price
        }
      }),
      prisma.userItem.create({
        data: {
          userId: user.id,
          itemId: item.id
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      item,
      remainingCoins: updatedUser.coins,
      userItem
    });

  } catch (error: any) {
    console.error("Error purchasing item:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}