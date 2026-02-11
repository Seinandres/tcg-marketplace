import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.userItem.deleteMany({});
    await prisma.rpgItem.deleteMany({});

    const items = await prisma.rpgItem.createMany({
      data: [
        {
          name: "Daga del Novato",
          description: "Corta el camino a la gloria.",
          lore: "Forjada en las calles de Santiago, brilla con el fuego de tu primera subasta.",
          benefits: "-5% Fees en 5 ventas. +1 XP extra.",
          price: 150,
          type: "WEAPON",
          rarity: "COMMON",
          requiredLevel: 1,
          image: "https://cdn-icons-png.flaticon.com/512/1065/1065449.png"
        },
        {
          name: "Espada del Trader",
          description: "Invoca vientos de fortuna.",
          lore: "Templada en duelos del Biobío. Su filo vibra cuando hay interesados.",
          benefits: "Listings Top 3 por 24h. +10% Visibilidad.",
          price: 800,
          type: "WEAPON",
          rarity: "RARE",
          requiredLevel: 3,
          image: "https://cdn-icons-png.flaticon.com/512/1065/1065463.png"
        },
        {
          name: "Arco de la Pujadora",
          description: "Apunta alto, derriba rivales.",
          lore: "Curvado como el Mapocho. Lanza flechas de pujas precisas e imparables.",
          benefits: "+15% Bono en pujas (x1.15). Prioridad máxima.",
          price: 1500,
          type: "WEAPON",
          rarity: "RARE",
          requiredLevel: 5,
          image: "https://cdn-icons-png.flaticon.com/512/2830/2830310.png"
        },
        {
          name: "Escudo del Coleccionista",
          description: "Protege tu legado.",
          lore: "Esculpido de fragmentos de cartas raras. Defiende tus precios de regateos.",
          benefits: "Verificación gratis. 10% Descuento en envíos.",
          price: 2500,
          type: "SHIELD",
          rarity: "EPIC",
          requiredLevel: 8,
          image: "https://cdn-icons-png.flaticon.com/512/1065/1065411.png"
        },
        {
          name: "Cetro Legendario",
          description: "Domina la Arena Seina.",
          lore: "Infundido con esencia de Charizard. Corona a los reyes del mercado.",
          benefits: "Posicionamiento #1 Home. Acceso a subastas VIP.",
          price: 15000,
          type: "SKIN",
          rarity: "LEGENDARY",
          requiredLevel: 20,
          image: "https://cdn-icons-png.flaticon.com/512/3133/3133604.png"
        }
      ]
    });

    return NextResponse.json({ success: true, message: "¡Arsenal reabastecido con imágenes estables!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}