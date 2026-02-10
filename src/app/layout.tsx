// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "@/context/AuthContext"; 
import Navbar from "@/components/Navbar"; // <--- ESTO FALTABA

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seina Market | TCG Marketplace",
  description: "El mejor mercado de cartas coleccionables de Chile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthContext>
          {/* El Navbar va DENTRO del AuthContext para saber si estás logueado */}
          <Navbar /> 
          <main>
            {children}
          </main>
        </AuthContext>
      </body>
    </html>
  );
}