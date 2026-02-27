import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique - Plateaux, pièces, pendules et accessoires d'échecs",
  description: "Découvrez notre catalogue complet de matériel d'échecs : plateaux, pièces, pendules, sets complets et accessoires. Livraison au Sénégal et en Afrique de l'Ouest.",
  openGraph: {
    title: "Boutique Africa Chess Market - Matériel d'échecs",
    description: "Découvrez notre catalogue complet de matériel d'échecs de qualité professionnelle.",
    url: "/boutique",
  },
  alternates: {
    canonical: "/boutique",
  },
};

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
