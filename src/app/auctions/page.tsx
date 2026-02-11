// @ts-nocheck
import { prisma } from "@/lib/prisma";
import AuctionsUI from "./AuctionsUI"; 

export const dynamic = 'force-dynamic';

async function getAuctions() {
  return await prisma.listing.findMany({
    where: { 
        status: 'ACTIVE',
        type: 'AUCTION'
    },
    include: { 
        // Corregido: 'set' ahora es un campo de texto, no una relación
        card: true, 
        user: {
            select: {
                name: true,
                heroLevel: true,
                heroTitle: true,
                heroColor: true
            }
        },
        bids: {
            include: { user: { select: { name: true } } },
            orderBy: { amount: 'desc' }
        }
    },
    take: 12, 
    orderBy: { createdAt: 'desc' }
  });
}

export default async function AuctionsPage() {
  const auctions = await getAuctions();
  
  // Lógica de tiempo: 48 horas desde la carga para simular el fin del ciclo
  const auctionEndDate = new Date();
  auctionEndDate.setHours(auctionEndDate.getHours() + 48);

  return (
    <div className="min-h-screen bg-[#020617]">
       {/* Pasamos los datos al motor visual del cliente */}
       <AuctionsUI initialAuctions={auctions} auctionEndDate={auctionEndDate} />
    </div>
  );
}