// src/app/api/listings/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Verificar Seguridad
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new NextResponse("Acceso Denegado: Identidad no verificada.", { status: 401 });
    }

    // 2. Obtener datos COMPLETOS del formulario
    const body = await request.json();
    const { 
      cardId, 
      price, 
      condition, 
      type,
      // Datos extra para crear la carta si no existe
      cardName,
      cardImage,
      cardSet,
      cardRarity,
      cardNumber,
      game
    } = body; 

    if (!cardId || !price) {
      return new NextResponse("Faltan datos del activo.", { status: 400 });
    }

    // 3. Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado.", { status: 404 });
    }

    // ============================================================
    // 4. PROTOCOLO DE INDEXACIÓN (EL ARREGLO MÁGICO) 🪄
    // ============================================================
    
    // Verificamos si la carta ya existe en nuestra DB local
    let card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    // ¡Si no existe, la creamos al vuelo!
    if (!card) {
      console.log(`🆕 Indexando nueva carta en la base de datos: ${cardName}`);
      card = await prisma.card.create({
        data: {
          id: cardId,
          name: cardName || "Carta Desconocida",
          image: cardImage || "",
          set: cardSet || "Promo",
          rarity: cardRarity || "Common",
          number: cardNumber || "000",
          game: game || "Pokemon" // Asegúrate de tener este campo en tu schema.prisma, si no, bórralo
        }
      });
    }

    // 5. Ahora sí, creamos la Venta vinculada a la carta que ASEGURAMOS que existe
    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        cardId: card.id, // Usamos el ID de la carta local
        price: Number(price),
        condition: condition,
        type: type || "SALE",
        status: "ACTIVE",
        quantity: 1
      }
    });

    return NextResponse.json(listing);

  } catch (error: any) {
    console.error("❌ FALLO CRÍTICO EN API:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}