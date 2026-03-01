/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Crown, ArrowRight, MessageCircle, ShieldCheck, Truck, Clock } from "lucide-react";

/* ---------- static data ---------- */

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: Math.random() * 3 + 1.5,
  delay: Math.random() * 20,
  duration: Math.random() * 12 + 14,
  drift: (Math.random() - 0.5) * 120,
  opacity: Math.random() * 0.4 + 0.2,
}));

const STATS = [
  { icon: ShieldCheck, label: "Qualité", value: "Pro" },
  { icon: Truck, label: "Livraison", value: "Sénégal" },
  { icon: Clock, label: "Ouvert", value: "7j/7" },
];

const CHESS_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a455' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

/* ---------- component ---------- */

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* reveal helper — staggered entrance via transition-delay */
  const reveal = (delay: number, extra = "") => ({
    className: `transition-all duration-[800ms] ease-out ${
      revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
    } ${extra}`,
    style: { transitionDelay: `${delay}ms` } as React.CSSProperties,
  });

  return (
    <section
      ref={heroRef}
      className="relative bg-forest overflow-hidden min-h-[100svh] flex items-end sm:items-center"
    >
      {/* ── Drifting chess pattern ── */}
      <div className="absolute inset-0 opacity-[0.06] overflow-hidden">
        <div
          className="absolute inset-[-100%] hero-pattern-drift"
          style={{ backgroundImage: CHESS_PATTERN, backgroundSize: "60px 60px" }}
        />
      </div>

      {/* ── Ambient glow layers ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_25%_50%,rgba(200,164,85,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_80%_30%,rgba(200,164,85,0.05),transparent)]" />

      {/* ── Gradient depth ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/70 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/70 via-forest/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/50 via-transparent to-transparent" />

      {/* ── Background image ── */}
      <div className="absolute inset-0 opacity-25">
        <img src="/hero.jpg" alt="" className="w-full h-full object-contain hero-bg-animate" />
      </div>

      {/* ── Floating golden particles ── */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="hero-particle"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              "--p-duration": `${p.duration}s`,
              "--p-delay": `${p.delay}s`,
              "--p-drift": `${p.drift}px`,
              "--p-opacity": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}

      {/* ── Bottom dissolve → cream ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-cream via-cream/60 to-transparent z-10" />

      {/* ═══════════════════════ CONTENT ═══════════════════════ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 sm:pt-32 pb-44 sm:pb-32 z-10">
        <div className="max-w-2xl lg:max-w-3xl">
            {/* Badge */}
            <div {...reveal(0)}>
              <div className="inline-flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6 sm:mb-8">
                <div className="w-7 h-7 bg-gold/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-3.5 h-3.5 text-gold" />
                </div>
                <span className="text-gold text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase">
                  Africa Chess Market
                </span>
              </div>
            </div>

            {/* Heading */}
            <div {...reveal(150)}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                Découvrez le
                <br className="hidden sm:block" />
                {" jeu des "}
                <span className="text-gold">Rois</span>
              </h1>
            </div>

            {/* Shimmer subtitle */}
            <div {...reveal(300)}>
              <p className="text-2xl sm:text-4xl lg:text-5xl font-bold mt-2 sm:mt-3 gold-shimmer">
                au Sénégal
              </p>
            </div>

            {/* Description */}
            <div {...reveal(450)}>
              <p className="mt-5 sm:mt-8 text-sm sm:text-lg text-white/70 max-w-lg leading-relaxed">
                Matériel d&apos;échecs professionnel — plateaux, pièces lestées,
                pendules digitales et accessoires de qualité supérieure.
              </p>
            </div>

            {/* CTAs */}
            <div {...reveal(600)}>
              <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/boutique"
                  className="group bg-gold hover:bg-gold-dark active:bg-gold-dark text-forest-dark font-bold px-7 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(200,164,85,0.4)] flex items-center justify-center gap-2.5 text-sm sm:text-base"
                >
                  Accédez à la boutique
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href="https://wa.me/221766090921?text=Bonjour%20!%20Je%20souhaite%20en%20savoir%20plus%20sur%20vos%20produits."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-sm text-white font-semibold px-7 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.03] border border-white/[0.12] hover:border-white/25 flex items-center justify-center gap-2.5 text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4" /> Nous contacter
                </a>
              </div>
            </div>

            {/* Trust badges */}
            <div {...reveal(750)}>
              <div className="mt-10 sm:mt-14 grid grid-cols-3 gap-2 sm:gap-4">
                {STATS.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.07] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 hover:bg-white/[0.08] hover:border-gold/20 transition-all duration-500"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold/10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gold" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[11px] text-white/40 font-medium uppercase tracking-wider">
                          {stat.label}
                        </p>
                        <p className="text-[11px] sm:text-sm text-white font-semibold truncate">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
