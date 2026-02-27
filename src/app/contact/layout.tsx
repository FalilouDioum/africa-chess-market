import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Nous joindre",
  description: "Contactez Africa Chess Market pour toute question, commande spéciale ou demande de partenariat. Réponse rapide via WhatsApp.",
  openGraph: {
    title: "Contactez Africa Chess Market",
    description: "Une question, une commande spéciale ? Contactez-nous pour une réponse rapide via WhatsApp.",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
