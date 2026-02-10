// @ts-nocheck
import { prisma } from "@/lib/prisma";
import DashboardContent from "@/components/DashboardContent"; 

export const dynamic = 'force-dynamic';

async function getUserDashboard() {
  const userId = "user_placeholder_id";

  const listings = await prisma.listing.findMany({
    where: { userId },
    include: { card: { include: { set: true } } },
    orderBy: { createdAt: 'desc' }
  });

  const sales = await prisma.listing.findMany({
    where: { userId, status: 'SOLD' },
    include: { card: true },
    orderBy: { updatedAt: 'desc' }
  });

  const totalActiveValue = listings
    .filter(l => l.status === 'ACTIVE')
    .reduce((acc, item) => acc + item.price, 0);

  const totalSoldValue = sales.reduce((acc, item) => acc + item.price, 0);

  return { listings, sales, totalActiveValue, totalSoldValue };
}

export default async function DashboardPage() {
  const data = await getUserDashboard();
  return <DashboardContent {...data} />;
}