import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos - Notre histoire et nos valeurs",
  description: "Africa Chess Market est née d'une passion pour les échecs et d'une vision : rendre le matériel d'échecs de qualité accessible à tous en Afrique. Découvrez notre histoire.",
  openGraph: {
    title: "À propos d'Africa Chess Market",
    description: "Notre mission : démocratiser les échecs en Afrique avec du matériel de qualité professionnelle.",
    url: "/a-propos",
  },
  alternates: {
    canonical: "/a-propos",
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return children;
}
