// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Faltan datos", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: { email }
    });

    if (exist) {
      return new NextResponse("El usuario ya existe", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "", // Puedes poner una URL de avatar por defecto si quieres
        xp: 0,
        level: 1,
        role: "USER"
      }
    });

    return NextResponse.json(user);
  } catch (err) {
    console.log(err);
    return new NextResponse("Error interno", { status: 500 });
  }
}