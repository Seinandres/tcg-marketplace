import { prisma } from "@/lib/prisma";
import InventoryRPG from "@/components/InventoryRPG"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Forzar renderizado dinámico para ver cambios al instante
export const dynamic = 'force-dynamic';

async function getUserInventory() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return null;

  // Obtener TODAS las cartas del usuario (Activas y Vendidas)
  // Incluimos la relación 'card' para tener la foto, nombre, set, etc.
  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    include: { card: true },
    orderBy: { createdAt: 'desc' } // Las más nuevas primero
  });

  return listings;
}

export default async function InventoryPage() {
  const listings = await getUserInventory();
  
  // Si no hay sesión, mandarlo al login
  if (!listings && listings !== []) {
    redirect('/login');
  }
  
  return (
    <InventoryRPG listings={listings} />
  );
}