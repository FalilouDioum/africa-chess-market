import Link from "next/link";
import { Crown, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-white relative overflow-hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a455' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      <div className="gold-gradient-line" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
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
                  <Link href={link.href} className="text-sm text-white/60 hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
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
                  <Link href="/boutique" className="text-sm text-white/60 hover:text-gold transition-all duration-300 hover:translate-x-1 inline-block">
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
                <a href="https://wa.me/221766090921" className="hover:text-gold transition">+221 76 609 09 21</a>
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

        <div className="gold-gradient-line mt-12" />
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30 tracking-wide">
            &copy; {new Date().getFullYear()} Africa Chess Market SARL. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-gold/40" />
            <p className="text-xs text-gold/40 tracking-wider font-medium">
              Africa Chess Market
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
