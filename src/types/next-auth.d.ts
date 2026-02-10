import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      level: number;
      xp: number;
      role: string;
      isSeller: boolean;
      avatar?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    level: number;
    xp: number;
    role: string;
    isSeller: boolean;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    level: number;
    xp: number;
    role: string;
    isSeller: boolean;
    avatar?: string;
  }
}