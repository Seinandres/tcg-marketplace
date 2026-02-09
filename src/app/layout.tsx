import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Contexto del Carrito
import { CartProvider } from "@/context/CartContext"; 
// 2. RECUPERAMOS EL NAVBAR (Importante: intenta esto primero)
import Navbar from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TCG Marketplace Chile",
  description: "Compra y vende cartas Pokémon en Chile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950 text-white`}>
        {/* Envolvemos todo en el CartProvider para que funcione la lógica de compra */}
        <CartProvider>
          
          {/* 👇 AQUÍ ESTÁ EL MENÚ DE VUELTA 👇 */}
          <Navbar /> 
          
          <main className="min-h-screen">
            {children}
          </main>
          
        </CartProvider>
      </body>
    </html>
  );
}