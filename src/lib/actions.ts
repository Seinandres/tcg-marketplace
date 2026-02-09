// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteListing(id: string) {
  try {
    await prisma.listing.delete({ where: { id: id } });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error Delete:", error);
    return { success: false, error: "Error al retirar" };
  }
}

export async function updateListing(formData: FormData) {
  const id = formData.get("id") as string;
  const price = parseFloat(formData.get("price") as string);
  const condition = formData.get("condition") as string;

  try {
    await prisma.listing.update({
      where: { id: id },
      data: { price, condition },
    });
  } catch (error) {
    console.error("Error Update:", error);
    return { error: "No se pudo actualizar" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function processCheckout(cartItems: any[]) {
  if (!cartItems || cartItems.length === 0) return { success: false, error: "Carro vacío" };

  try {
    // Transacción atómica para marcar como vendida
    await prisma.$transaction(
      cartItems.map((item) =>
        prisma.listing.update({
          where: { id: item.id }, // Ahora sí recibirá el ID correcto de la oferta
          data: { status: 'SOLD' },
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    // Esto te dirá exactamente qué ID falló en tu terminal
    console.error("DETALLE ERROR CHECKOUT:", error);
    return { success: false, error: "Error en la base de datos" };
  }
}