import Link from "next/link";
import { Crown, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-white" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Crown className="w-8 h-8 text-gold" />
              <div>
                <h3 className="text-lg font-bold tracking-tight">Africa Chess Market</h3>
                <p className="text-xs text-white/40 font-medium tracking-wider uppercase">SARL</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Votre boutique d&apos;échecs de référence en Afrique. Matériel de qualité professionnelle pour joueurs de tous niveaux.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-gold font-semibold mb-5 text-xs uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Accueil" },
                { href: "/boutique", label: "Boutique" },
                { href: "/a-propos", label: "À propos" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-gold transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h4 className="text-gold font-semibold mb-5 text-xs uppercase tracking-widest">Catégories</h4>
            <ul className="space-y-3">
              {["Plateaux", "Pièces", "Pendules", "Sets complets", "Sacs & accessoires"].map((cat) => (
                <li key={cat}>
                  <Link href="/boutique" className="text-sm text-white/60 hover:text-gold transition">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-semibold mb-5 text-xs uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
                <a href="https://wa.me/221771234455" className="hover:text-gold transition">+221 77 123 44 55</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 mt-0.5 text-gold/70 shrink-0" />
                <span>contact@africachessmarket.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 mt-0.5 text-gold/70 shrink-0" />
                <span>Dakar, Sénégal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 tracking-wide">
            &copy; {new Date().getFullYear()} Africa Chess Market SARL. Tous droits réservés.
          </p>
          <p className="text-xs text-white/30 tracking-wide">
            Petit Nihal Chess &mdash; Falilou & Sidy
          </p>
        </div>
      </div>
    </footer>
  );
}
