import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // <--- Importamos la lógica desde el archivo nuevo

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };