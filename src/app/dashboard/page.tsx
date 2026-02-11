// src/app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import DashboardRPG from "@/components/DashboardRPG"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getUserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) return null;

  // 1. Obtener ACTIVO (En Venta)
  const activeListings = await prisma.listing.findMany({
    where: { userId: user.id, status: 'ACTIVE' },
    include: { card: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // 2. Obtener VENTAS (Vendidos)
  const soldListings = await prisma.listing.findMany({
    where: { userId: user.id, status: 'SOLD' },
    include: { card: true },
    orderBy: { updatedAt: 'desc' },
    take: 10
  });

  // 3. FUSIONAR Y ORDENAR (Protocolo de Radar Unificado)
  const recentActivity = [
    ...activeListings.map(l => ({ ...l, type: 'ACTIVE' })), 
    ...soldListings.map(l => ({ ...l, type: 'SOLD' }))
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
   .slice(0, 10); // Mostramos los últimos 10 movimientos sean ventas o publicaciones

  // 4. Totales
  const totalActiveValue = activeListings.reduce((acc, item) => acc + item.price, 0);
  const totalSoldValue = soldListings.reduce((acc, item) => acc + item.price, 0);

  return { 
    totalActiveValue, 
    totalSoldValue,
    activeCount: activeListings.length,
    salesCount: soldListings.length,
    recentActivity // <--- ESTO ES LO NUEVO
  };
}

export default async function DashboardPage() {
  const data = await getUserDashboard();
  
  if (!data) {
    redirect('/login');
  }
  
  return (
    <DashboardRPG 
      totalActiveValue={data.totalActiveValue}
      totalSoldValue={data.totalSoldValue}
      activeCount={data.activeCount}
      salesCount={data.salesCount}
      recentActivity={data.recentActivity} // Pasamos la data fusionada
    />
  );
}