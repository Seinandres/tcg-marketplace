import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// AQUÍ ESTÁ TU LÓGICA (No se pierde nada)
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Tu validación original
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Operador no encontrado o credenciales inválidas");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Clave de acceso incorrecta");
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  // AQUÍ AGREGAMOS LA MAGIA RPG A TUS CALLBACKS EXISTENTES
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Agregamos los datos RPG al token
        // @ts-ignore
        token.heroLevel = user.heroLevel;
        // @ts-ignore
        token.coins = user.coins;
        // @ts-ignore
        token.heroTitle = user.heroTitle;
      }
      
      // Permitir actualizar datos sin reloguear
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // Pasamos los datos RPG del token a la sesión del navegador
        // @ts-ignore
        session.user.heroLevel = token.heroLevel;
        // @ts-ignore
        session.user.coins = token.coins;
        // @ts-ignore
        session.user.heroTitle = token.heroTitle;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Tu página de login personalizada
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};