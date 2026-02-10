// src/app/auctions/page.tsx
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
        card: { include: { set: true } },
        bids: {
            include: { user: true },
            orderBy: { amount: 'desc' }
        }
    },
    take: 12, 
    orderBy: { price: 'desc' }
  });
}

export default async function AuctionsPage() {
  const auctions = await getAuctions();
  
  const auctionEndDate = new Date();
  auctionEndDate.setHours(auctionEndDate.getHours() + 48);

  return <AuctionsUI initialAuctions={auctions} auctionEndDate={auctionEndDate} />;
}