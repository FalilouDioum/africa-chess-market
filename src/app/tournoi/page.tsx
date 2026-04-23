"use client";

import { useState } from "react";
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Banknote,
  Check,
  Loader2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { sendEvent } from "@/components/AnalyticsTracker";

export default function TournoiPage() {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [fideId, setFideId] = useState("");
  const [club, setClub] = useState("");
  const [categorie, setCategorie] = useState("Open");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!nom.trim() || !telephone.trim()) {
      setError("Le nom et le téléphone sont obligatoires.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim(),
          telephone: telephone.trim(),
          email: email.trim(),
          fideId: fideId.trim(),
          club: club.trim(),
          categorie: categorie.trim(),
          notes: notes.trim(),
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      sendEvent({ type: "tournament_registration" });
      setSent(true);
      setNom("");
      setTelephone("");
      setEmail("");
      setFideId("");
      setClub("");
      setNotes("");
      setTimeout(() => setSent(false), 8000);
    } catch {
      setError("Une erreur est survenue. Merci de réessayer ou de nous contacter.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative bg-forest overflow-hidden py-16 sm:py-24">
        {/* Ambient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(200,164,85,0.12),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/40 via-transparent to-forest-dark/60" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 xl:px-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#ff8a4d] via-[#e85d2c] to-[#c24419] rounded-full px-4 py-2 mb-6 shadow-[0_8px_30px_rgba(232,93,44,0.35)]">
            <Trophy className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
              Inscriptions ouvertes
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Chess Tournament
          </h1>
          <p className="mt-2 sm:mt-3 text-2xl sm:text-4xl lg:text-5xl font-serif italic text-gold">
            Invitation
          </p>

          {/* Date MEGA */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center">
            <div
              className="text-7xl sm:text-[10rem] lg:text-[12rem] font-bold leading-[0.85] tracking-tight"
              style={{
                background:
                  "linear-gradient(180deg, #ffb37a 0%, #ff8a4d 35%, #e85d2c 70%, #8a2a0a 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 8px 30px rgba(232,93,44,0.4))",
              }}
            >
              03
            </div>
            <div className="mt-3 sm:mt-4 flex items-center gap-4 w-full max-w-lg">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              <span className="text-xl sm:text-3xl font-serif tracking-[0.4em] text-gold uppercase">
                Mai
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>
            <div
              className="mt-2 sm:mt-3 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
              style={{
                background:
                  "linear-gradient(180deg, #f0d98a 0%, #d4a853 50%, #8a6f3a 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              2026
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ INFO CARDS ═══════════════════ */}
      <section className="bg-warm-50 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 xl:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {[
              { icon: MapPin, label: "Lieu", value: "UCAD", sub: "Dakar, Sénégal" },
              { icon: Calendar, label: "Date", value: "03 Mai", sub: "2026" },
              { icon: Clock, label: "Cadence", value: "15 + 3", sub: "min + sec / coup" },
              { icon: Banknote, label: "Dotation", value: "330.000", sub: "FCFA" },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <FadeIn key={card.label}>
                  <div className="bg-cream rounded-2xl border border-gold/15 p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 bg-gold/15 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <p className="text-[10px] sm:text-xs text-warm-500 font-semibold uppercase tracking-[0.18em]">
                        {card.label}
                      </p>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-warm-900 leading-tight">
                      {card.value}
                    </p>
                    <p className="text-xs sm:text-sm text-warm-500 mt-1">
                      {card.sub}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Organizer line */}
          <FadeIn>
            <div className="mt-8 sm:mt-10 text-center">
              <p className="text-xs sm:text-sm text-warm-500 tracking-[0.15em] uppercase">
                Organisé par
              </p>
              <p className="mt-2 text-lg sm:text-xl font-bold text-warm-900 tracking-wide">
                Africa Chess Market <span className="text-gold">SARL</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ REGISTRATION FORM ═══════════════════ */}
      <section className="bg-cream py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-gold text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase">
                Formulaire
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-warm-900 mt-2">
                Réservez votre place
              </h2>
              <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
              <p className="text-warm-500 mt-4 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                Places limitées. Remplissez le formulaire et confirmez votre
                inscription via WhatsApp.
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="bg-warm-50 rounded-2xl border border-gold/15 p-6 sm:p-8 shadow-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="space-y-5"
              >
                {/* Nom + Téléphone (required) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      Nom complet <span className="text-[#e85d2c]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition min-h-[44px]"
                      placeholder="Prénom et nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      Téléphone <span className="text-[#e85d2c]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition min-h-[44px]"
                      placeholder="+221 7X XXX XX XX"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email + FIDE ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition min-h-[44px]"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      ID FIDE <span className="text-warm-400">(optionnel)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition min-h-[44px]"
                      placeholder="ex. 12345678"
                      value={fideId}
                      onChange={(e) => setFideId(e.target.value)}
                    />
                  </div>
                </div>

                {/* Club + Catégorie */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      Club d&apos;échecs
                    </label>
                    <input
                      type="text"
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition min-h-[44px]"
                      placeholder="Votre club"
                      value={club}
                      onChange={(e) => setClub(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      Catégorie
                    </label>
                    <select
                      className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition min-h-[44px]"
                      value={categorie}
                      onChange={(e) => setCategorie(e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="Féminin">Féminin</option>
                      <option value="Junior">Junior (U18)</option>
                      <option value="Senior">Senior (50+)</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1.5">
                    Message / Questions
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-warm-200 rounded-xl px-4 py-3 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none transition"
                    placeholder="Une précision, une question ? (optionnel)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-[#c24419] text-sm bg-[#ffe4d6] px-4 py-3 rounded-xl border border-[#ffcba4]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                {sent && (
                  <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                    <Check className="w-4 h-4 shrink-0" />
                    Inscription enregistrée ! Nous vous recontactons prochainement.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || !nom.trim() || !telephone.trim()}
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#ff8a4d] via-[#e85d2c] to-[#c24419] hover:from-[#ff9a5a] hover:via-[#ff6a3a] hover:to-[#d14d24] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-[0_8px_30px_rgba(232,93,44,0.35)] hover:shadow-[0_12px_40px_rgba(232,93,44,0.5)]"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4" />
                      S&apos;inscrire au tournoi
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-warm-400 text-center">
                  Vos informations sont enregistrées de manière sécurisée.
                  Nous vous contacterons pour confirmer votre inscription.
                </p>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
