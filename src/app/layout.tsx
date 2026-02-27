import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://africachessmarket.com"),
  title: {
    default: "Africa Chess Market - Boutique d'échecs en ligne au Sénégal",
    template: "%s | Africa Chess Market",
  },
  description: "Achetez vos plateaux, pièces, pendules et accessoires d'échecs de qualité professionnelle. Livraison au Sénégal et en Afrique de l'Ouest.",
  keywords: ["échecs", "chess", "Sénégal", "Afrique", "plateau d'échecs", "pièces d'échecs", "pendule d'échecs", "boutique échecs", "matériel échecs", "Africa Chess Market", "Dakar"],
  authors: [{ name: "Africa Chess Market SARL" }],
  creator: "Africa Chess Market",
  publisher: "Africa Chess Market SARL",
  formatDetection: { telephone: false },
  openGraph: {
    title: "Africa Chess Market - Matériel d'échecs premium en Afrique",
    description: "Plateaux, pièces, pendules et accessoires d'échecs de qualité professionnelle. Livraison au Sénégal et en Afrique de l'Ouest.",
    url: "https://africachessmarket.com",
    type: "website",
    locale: "fr_FR",
    siteName: "Africa Chess Market",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Africa Chess Market - Matériel d'échecs premium" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Africa Chess Market",
    description: "Matériel d'échecs premium en Afrique",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://africachessmarket.com",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Africa Chess Market",
  legalName: "Africa Chess Market SARL",
  url: "https://africachessmarket.com",
  logo: "https://africachessmarket.com/logo.png",
  description: "Boutique d'échecs de référence en Afrique. Matériel de qualité professionnelle pour joueurs de tous niveaux.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dakar",
    addressCountry: "SN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+221766090921",
    contactType: "customer service",
    availableLanguage: ["French"],
  },
  sameAs: ["https://wa.me/221766090921"],
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Africa Chess Market",
  url: "https://africachessmarket.com/boutique",
  description: "Plateaux, pièces, pendules et accessoires d'échecs de qualité professionnelle.",
  currenciesAccepted: "XOF",
  paymentAccepted: "Cash, Mobile Money",
  areaServed: {
    "@type": "Place",
    name: "Afrique de l'Ouest",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
