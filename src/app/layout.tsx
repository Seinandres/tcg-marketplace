import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { CartProvider } from "../context/CartContext"; // 👈 IMPORTANTE

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TCG Marketplace Chile",
  description: "Compra y venta de cartas Pokémon en Chile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 👇 ENVOLVEMOS TODO CON EL PROVEEDOR DEL CARRITO */}
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}