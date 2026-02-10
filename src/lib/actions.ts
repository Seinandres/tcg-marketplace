// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. CREAR
// @ts-nocheck
export async function createListing(formData: FormData) {
  const rawPrice = formData.get("price") as string;
  const price = parseInt(rawPrice.replace(/\./g, ""), 10);
  const condition = formData.get("condition") as string;
  const cardId = formData.get("cardId") as string;
  const game = formData.get("game") as string;
  const cardName = formData.get("cardName") as string;
  const cardSet = formData.get("cardSet") as string;
  const cardImage = formData.get("cardImage") as string;
  const cardRarity = formData.get("cardRarity") as string;
  const cardNumber = formData.get("cardNumber") as string;
  
  // NUEVO: Capturamos el tipo de venta
  const type = formData.get("type") as string || "SALE"; 

  if (!price || !cardId) return { success: false, error: "Datos incompletos" };

  try {
    const set = await prisma.set.upsert({
      where: { id: cardSet }, update: {}, create: { id: cardSet, name: cardSet, series: game }
    });

    const card = await prisma.card.upsert({
      where: { id: cardId }, update: { game }, 
      create: { id: cardId, name: cardName, game, number: cardNumber || "000", rarity: cardRarity || "Common", imageUrlSmall: cardImage, imageUrlLarge: cardImage, setId: set.id }
    });

    const sellerId = "user_placeholder_id";
    await prisma.user.upsert({
        where: { id: sellerId }, update: {}, create: { id: sellerId, username: "Vendedor Demo", email: "demo@seina.cl" }
    });

    await prisma.listing.create({
      data: { 
          price, 
          condition, 
          status: "ACTIVE", 
          cardId: card.id, 
          userId: sellerId,
          type: type // 👈 Guardamos si es SALE o AUCTION
      }
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/auctions"); // Actualizamos también subastas
    revalidatePath(`/catalog/${game?.toLowerCase()}`); 
    return { success: true };

  } catch (error) {
    console.error("Error crear:", error);
    return { success: false, error: "Error al publicar" };
  }
}

// 2. ACTUALIZAR
export async function updateListing(formData: FormData) {
  const id = formData.get("id") as string;
  const rawPrice = formData.get("price") as string;
  const price = parseInt(rawPrice.replace(/\./g, ""), 10);
  const condition = formData.get("condition") as string;

  try {
    await prisma.listing.update({ where: { id }, data: { price, condition } });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al actualizar" };
  }
}

// 3. ELIMINAR
export async function deleteListing(id: string) {
  try {
    await prisma.listing.update({ where: { id }, data: { status: "DELETED" } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar" };
  }
}

// 4. PROCESAR COMPRA (MEJORADO Y BLINDADO)
export async function processCheckout(listingIds: string[]) {
  try {
    if (!listingIds || listingIds.length === 0) return { success: false, error: "Carro vacío" };

    // A. Validar qué items REALMENTE existen y están ACTIVE en la DB
    const validListings = await prisma.listing.findMany({
      where: {
        id: { in: listingIds },
        status: "ACTIVE"
      },
      select: { id: true }
    });

    const validIds = validListings.map(l => l.id);

    if (validIds.length === 0) {
      // Si ninguno es válido, es porque son IDs fantasmas del localStorage
      return { success: false, error: "Los items ya no están disponibles. Limpia tu carro." };
    }

    // B. Procesar solo los válidos
    await prisma.$transaction(
      validIds.map((id) => 
        prisma.listing.update({
          where: { id },
          data: { status: "SOLD" }
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, soldCount: validIds.length }; // Retornamos éxito
  } catch (error) {
    console.error("Error checkout:", error);
    return { success: false, error: "Error de servidor al procesar." };
  }
}
// 5. REALIZAR UNA OFERTA (BID)
export async function placeBid(formData: FormData) {
  const listingId = formData.get("listingId") as string;
  const rawAmount = formData.get("amount") as string;
  const amount = parseInt(rawAmount.replace(/\./g, ""), 10);

  if (!amount || !listingId) return { success: false, error: "Monto inválido" };

  try {
    // 1. Obtener la subasta actual para validar precio
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    
    if (!listing) return { success: false, error: "Subasta no encontrada" };
    if (amount <= listing.price) {
        return { success: false, error: `La oferta debe ser mayor a $${listing.price}` };
    }

    // 2. Crear usuario "Comprador" si no existe (Simulado por ahora)
    const bidderId = "bidder_demo_user"; 
    await prisma.user.upsert({
        where: { id: bidderId }, update: {}, create: { id: bidderId, username: "Entrenador X", email: "bidder@seina.cl" }
    });

    // 3. Guardar la oferta y Actualizar el precio de la carta
    await prisma.$transaction([
        prisma.bid.create({
            data: { amount, listingId, userId: bidderId }
        }),
        prisma.listing.update({
            where: { id: listingId },
            data: { price: amount } // El precio de la carta sube automáticamente
        })
    ]);

    revalidatePath("/auctions");
    return { success: true };

  } catch (error) {
    console.error("Error al ofertar:", error);
    return { success: false, error: "Error al procesar la oferta" };
  }
}