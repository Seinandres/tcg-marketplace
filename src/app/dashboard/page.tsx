import { prisma } from "@/lib/prisma";
import DashboardRPG from "@/components/DashboardRPG"; // Importamos el nuevo componente visual

export const dynamic = 'force-dynamic';

async function getUserDashboard() {
  // AQUÍ VA TU LÓGICA DE USUARIO REAL (Auth)
  const userId = "user_placeholder_id"; 

  // 1. Obtener Inventario (Listings)
  const listings = await prisma.listing.findMany({
    where: { userId },
    include: { card: { include: { set: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Obtener Ventas (Sales)
  const sales = await prisma.listing.findMany({
    where: { userId, status: 'SOLD' },
    include: { card: true },
    orderBy: { updatedAt: 'desc' }
  });

  // 3. Calcular Totales
  const totalActiveValue = listings
    .filter(l => l.status === 'ACTIVE')
    .reduce((acc, item) => acc + item.price, 0);

  const totalSoldValue = sales.reduce((acc, item) => acc + item.price, 0);

  return { listings, sales, totalActiveValue, totalSoldValue };
}

export default async function DashboardPage() {
  const data = await getUserDashboard();
  
  // Pasamos los datos reales al componente RPG
  return <DashboardRPG {...data} />;
}