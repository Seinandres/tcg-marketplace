import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        card: {
          include: { set: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar stock" }, { status: 500 });
  }
}