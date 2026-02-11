import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Obtener todo el arsenal disponible
    const items = await prisma.rpgItem.findMany({
      orderBy: [
        { rarity: 'desc' }, 
        { price: 'asc' }
      ]
    });

    let userCoins = 0;
    let userItems: string[] = [];

    // 2. Obtener datos del usuario
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          // 🟢 CORRECCIÓN: Usamos el nombre real de tu esquema
          rpgItems: true 
        }
      });

      if (user) {
        userCoins = user.coins;
        // 🟢 CORRECCIÓN: Mapeamos usando 'itemId'
        userItems = user.rpgItems.map((ui) => ui.itemId);
      }
    }

    return NextResponse.json({
      items,
      userCoins,
      userItems
    });

  } catch (error: any) {
    console.error("❌ Error fetching shop items:", error);
    return new NextResponse("Error táctico en el servidor", { status: 500 });
  }
}