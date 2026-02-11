import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        card: true,
        user: {
          select: {
            name: true,
            heroLevel: true,
            heroTitle: true,
            reputation: true,
          }
        }
      }
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## PASO 5: Verifica que page.tsx esté correcto

**Archivo:** `src/app/listing/[id]/page.tsx` (debe tener el código que te envié antes con `"use client"`)

---

## ✅ ESTRUCTURA FINAL CORRECTA
```
src/app/
├── api/
│   └── listings/
│       └── [id]/
│           └── route.ts       ← API endpoint en /api/listings/123
└── listing/
    └── [id]/
        └── page.tsx           ← Página visual en /listing/123