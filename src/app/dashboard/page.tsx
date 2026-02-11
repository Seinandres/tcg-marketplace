import { prisma } from "@/lib/prisma";
import DashboardRPG from "@/components/DashboardRPG"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

// --- FUNCIÓN TÁCTICA PARA OBTENER DATOS (Lógica ordenada) ---
async function getUserDashboard(userId: string) {
  
  // 1. Obtener ACTIVO (En Venta)
  const activeListings = await prisma.listing.findMany({
    where: { userId: userId, status: 'ACTIVE' },
    include: { card: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // 2. Obtener VENTAS (Vendidos)
  const soldListings = await prisma.listing.findMany({
    where: { userId: userId, status: 'SOLD' },
    include: { card: true },
    orderBy: { updatedAt: 'desc' },
    take: 10
  });

  // 3. FUSIONAR Y ORDENAR (Protocolo de Radar Unificado)
  const recentActivity = [
    // @ts-ignore
    ...activeListings.map(l => ({ ...l, type: 'ACTIVE' })), 
    // @ts-ignore
    ...soldListings.map(l => ({ ...l, type: 'SOLD' }))
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
   .slice(0, 10); // Mostramos los últimos 10 movimientos

  // 4. Calcular Totales Financieros
  const totalActiveValue = activeListings.reduce((acc, item) => acc + item.price, 0);
  const totalSoldValue = soldListings.reduce((acc, item) => acc + item.price, 0);

  return { 
    totalActiveValue, 
    totalSoldValue,
    activeCount: activeListings.length,
    salesCount: soldListings.length,
    recentActivity 
  };
}

// --- COMPONENTE DE PÁGINA PRINCIPAL ---
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Validación de seguridad
  if (!session || !session.user) {
    redirect("/login");
  }

  // Obtenemos los datos calculados usando la ID de la sesión
  const data = await getUserDashboard(session.user.id);

  // Renderizamos el Dashboard pasando el Usuario y las Estadísticas
  // Nota: Pasamos 'stats' como un objeto separado para mantener el orden
  return (
    <DashboardRPG 
      user={session.user}
      stats={{
        totalActiveValue: data.totalActiveValue,
        totalSoldValue: data.totalSoldValue,
        activeCount: data.activeCount,
        salesCount: data.salesCount,
        recentActivity: data.recentActivity
      }}
    />
  );
}