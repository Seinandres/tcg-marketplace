import { prisma } from "@/lib/prisma";
import ProfileRPG from "@/components/ProfileRPG";
import { getServerSession } from "next-auth";
// 🟢 CORRECCIÓN CRÍTICA: Importamos desde la librería centralizada, no desde la ruta API
import { authOptions } from "@/lib/auth"; 
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getUserProfile() {
  // Obtenemos la sesión usando la configuración centralizada
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

  // Calculamos stats de combate financiero
  const activeListings = user.listings.filter(l => l.status === 'ACTIVE').length;
  const soldListings = user.listings.filter(l => l.status === 'SOLD').length;

  return {
    name: user.name || "Guerrero Anónimo",
    image: user.image || "",
    heroLevel: user.heroLevel,
    heroXP: user.heroXP,
    // Mejora: "Novato" es el título base que definimos en el registro
    heroTitle: user.heroTitle || "Novato", 
    coins: user.coins,
    reputation: user.reputation,
    listingsCount: activeListings,
    salesCount: soldListings
  };
}

export default async function ProfilePage() {
  const profile = await getUserProfile();
  
  if (!profile) {
    // Si no hay perfil, redirigir al login unificado
    redirect('/login');
  }
  
  return <ProfileRPG profile={profile} />;
}