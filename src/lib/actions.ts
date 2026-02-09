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
    return { success: false, error: "No se pudo retirar" };
  }
}

// NUEVA FUNCIÓN PARA EDITAR
export async function updateListing(formData: FormData) {
  const id = formData.get("id") as string;
  const price = parseFloat(formData.get("price") as string);
  const condition = formData.get("condition") as string;

  try {
    await prisma.listing.update({
      where: { id: id },
      data: {
        price: price,
        condition: condition,
      },
    });
  } catch (error) {
    return { error: "Error al actualizar los datos" };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}