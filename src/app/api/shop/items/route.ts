import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    const items = await prisma.rpgItem.findMany({
      orderBy: [
        { rarity: 'desc' },
        { price: 'asc' }
      ]
    });

    let userCoins = 0;
    let userItems: string[] = [];

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          rpgItems: {
            include: {
              item: true
            }
          }
        }
      });

      userCoins = user?.coins || 0;
      userItems = user?.rpgItems.map(ui => ui.itemId) || [];
    }

    return NextResponse.json({
      items,
      userCoins,
      userItems
    });

  } catch (error: any) {
    console.error("Error fetching shop items:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}