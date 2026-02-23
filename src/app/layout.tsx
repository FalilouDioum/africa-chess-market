import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Africa Chess Market - Boutique d'échecs en ligne",
  description: "Achetez vos plateaux, pièces, pendules et accessoires d'échecs de qualité. Livraison au Sénégal et en Afrique. Petit Nihal Chess.",
  keywords: "échecs, chess, Sénégal, Afrique, plateau, pièces, pendule, boutique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
