// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validar que vengan datos
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }

        // 2. Buscar al operador en la base de datos
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 3. Si no existe o no tiene contraseña (quizás entró por Google antes)
        if (!user || !user.hashedPassword) {
          throw new Error("Operador no encontrado o credenciales inválidas");
        }

        // 4. Comparar la contraseña encriptada
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Clave de acceso incorrecta");
        }

        // 5. Retornar el usuario (Éxito)
        return user;
      }
    })
  ],
  session: {
    strategy: "jwt", // Usamos JWT para que sea rápido y no sature la DB
  },
  callbacks: {
    // Esto asegura que el ID del usuario pase a la sesión para poder consultar sus items
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login', // Si falla, mandar aquí
  },
  debug: process.env.NODE_ENV === 'development', // Para ver errores en consola
  secret: process.env.NEXTAUTH_SECRET, // Asegúrate de tener esto en tu .env
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };