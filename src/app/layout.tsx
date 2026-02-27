import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Africa Chess Market - Boutique d'échecs en ligne",
  description: "Achetez vos plateaux, pièces, pendules et accessoires d'échecs de qualité. Livraison au Sénégal et en Afrique. Petit Nihal Chess.",
  keywords: "échecs, chess, Sénégal, Afrique, plateau, pièces, pendule, boutique",
  openGraph: {
    title: "Africa Chess Market - Matériel d'échecs premium en Afrique",
    description: "Plateaux, pièces, pendules et accessoires d'échecs de qualité professionnelle. Livraison au Sénégal et en Afrique de l'Ouest.",
    type: "website",
    locale: "fr_FR",
    siteName: "Africa Chess Market",
  },
  twitter: {
    card: "summary_large_image",
    title: "Africa Chess Market",
    description: "Matériel d'échecs premium en Afrique",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
