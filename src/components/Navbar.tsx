"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`sticky top-0 z-50 text-white transition-all duration-500 ${
          !isHome
            ? "bg-forest border-b border-transparent"
            : scrolled || open
              ? "bg-forest/95 backdrop-blur-xl shadow-lg border-b border-gold/20"
              : "bg-transparent border-b border-transparent"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-20">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-h-[44px] items-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Africa Chess Market" className="h-9 sm:h-14 w-auto bg-white rounded-lg p-0.5 sm:p-1 transition-shadow duration-300 group-hover:shadow-[0_0_15px_rgba(200,164,85,0.4)]" />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center relative ${
                    pathname === link.href
                      ? "text-gold after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-0.5 after:bg-gold after:rounded-full"
                      : "text-white/70 hover:text-white after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-0.5 after:bg-gold/0 hover:after:bg-gold/40 after:rounded-full after:transition-colors after:duration-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/221766090921"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 min-h-[44px]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </nav>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-3 -mr-3 rounded-xl hover:bg-white/10 active:bg-white/20 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-forest transition-all duration-300 flex flex-col overflow-y-auto ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: "56px", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav className="flex flex-col px-5 pt-4 gap-1.5 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-5 py-4 rounded-2xl text-base font-medium transition-colors min-h-[48px] flex items-center ${
                pathname === link.href
                  ? "bg-gold text-forest-dark"
                  : "text-white/90 active:bg-white/20"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 pb-6">
          <a
            href="https://wa.me/221766090921"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 active:bg-green-600 text-white px-5 py-4 rounded-2xl text-base font-semibold w-full min-h-[48px]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Commander via WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
