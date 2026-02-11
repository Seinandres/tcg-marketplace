import { prisma } from "@/lib/prisma";
import ProfileRPG from "@/components/ProfileRPG";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getUserProfile() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return null;
  }

  // Buscamos al usuario con sus datos RPG
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      listings: true, // Para contar ventas y activos
    }
  });

  if (!user) return null;

  // Calculamos stats simples
  const activeListings = user.listings.filter(l => l.status === 'ACTIVE').length;
  const soldListings = user.listings.filter(l => l.status === 'SOLD').length;

  return {
    name: user.name || "Guerrero Anónimo",
    image: user.image || "",
    heroLevel: user.heroLevel,
    heroXP: user.heroXP,
    heroTitle: user.heroTitle || "Recluta",
    coins: user.coins,
    reputation: user.reputation,
    listingsCount: activeListings,
    salesCount: soldListings
  };
}

export default async function ProfilePage() {
  const profile = await getUserProfile();
  
  if (!profile) {
    redirect('/login');
  }
  
  return <ProfileRPG profile={profile} />;
}