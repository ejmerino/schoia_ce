// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Importa la fuente
import "./globals.css";

const inter = Inter({ subsets: ["latin"] }); // Configura la fuente

export const metadata: Metadata = {
  title: "ScholA+",
  description: "Tu asistente académico personal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplica la clase de la fuente al body */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}