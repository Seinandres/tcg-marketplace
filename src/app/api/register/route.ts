// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    // 1. Validar datos
    if (!email || !name || !password) {
      return new NextResponse("Faltan datos obligatorios", { status: 400 });
    }

    // 2. Verificar si el email ya existe
    const emailExist = await prisma.user.findUnique({
      where: { email }
    });

    if (emailExist) {
      return new NextResponse("Este correo ya está registrado", { status: 400 });
    }

    // 3. Generar un username único
    const randomSuffix = Math.floor(Math.random() * 10000);
    const generatedUsername = name.replace(/\s+/g, '_').toLowerCase() + "_" + randomSuffix;

    // 4. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Crear usuario (AQUÍ ESTABA EL ERROR DE NOMBRES)
    const user = await prisma.user.create({
      data: {
        email,
        name,           
        username: generatedUsername, 
        hashedPassword,
        image: "", 
        
        // --- CORRECCIÓN RPG ---
        heroXP: 0,      // Antes decía "xp"
        heroLevel: 1,   // Antes decía "level"
        // ---------------------
        
        role: "USER"
      }
    });

    return NextResponse.json(user);

  } catch (err: any) {
    console.error("❌ ERROR EN REGISTRO:", err);
    return new NextResponse(`Error del servidor: ${err.message}`, { status: 500 });
  }
}