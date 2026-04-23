import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournoi d'Échecs - 03 Mai 2026, UCAD Dakar",
  description:
    "Inscrivez-vous au Tournoi d'Échecs Africa Chess Market SARL. Cadence 15 min + 3 sec, dotation 330.000 FCFA, à l'UCAD à Dakar le 03 mai 2026.",
  openGraph: {
    title: "Tournoi Africa Chess Market · 03 Mai 2026",
    description:
      "Réservez votre place. Open d'échecs à l'UCAD Dakar · Dotation 330.000 FCFA · Cadence 15 min + 3 sec.",
    url: "/tournoi",
  },
  alternates: {
    canonical: "/tournoi",
  },
};

export default function TournoiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
