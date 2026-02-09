// @ts-nocheck
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Función para eliminar una publicación (Botón Retirar)
export async function deleteListing(id: string) {
  try {
    await prisma.listing.delete({
      where: { id: id },
    });
    
    // Esto obliga a Next.js a refrescar el Dashboard para mostrar los datos actualizados
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { success: false, error: "No se pudo retirar la carta" };
  }
}