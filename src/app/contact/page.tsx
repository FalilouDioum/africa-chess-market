"use client";

import { useState } from "react";
import { MessageCircle, Check, Loader2 } from "lucide-react";
import FadeIn from "@/components/FadeIn";

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!nom.trim() || !message.trim()) return;

    // Open WhatsApp immediately
    const text = `Bonjour Africa Chess Market !\n\nJe suis ${nom}${telephone ? ` (${telephone})` : ""}.\n\n${message}`;
    window.open(`https://wa.me/221766090921?text=${encodeURIComponent(text)}`, "_blank");

    // Save to database in background
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nom.trim(), telephone: telephone.trim(), message: message.trim() }),
      });
    } catch {
      // Silently fail — WhatsApp already opened
    }
    setSending(false);
    setSent(true);
    setNom("");
    setTelephone("");
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-forest py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 hero-fade">
          <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Nous joindre</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mt-2">Contactez-nous</h1>
          <div className="w-16 h-0.5 bg-gold mt-4" />
          <p className="text-white/60 mt-3 max-w-xl text-sm sm:text-base">
            Une question, une commande spéciale ? Nous sommes là pour vous.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <FadeIn>
            <div>
              <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Message</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 mb-2">Envoyez-nous un message</h2>
              <div className="w-16 h-0.5 bg-gold mb-8" />
              <div className="bg-cream rounded-2xl border border-gold/10 p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                  Remplissez le formulaire ci-dessous et nous vous répondrons via WhatsApp dans les plus brefs délais.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre nom</label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition min-h-[44px]"
                      placeholder="Prénom et nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre téléphone</label>
                    <input
                      type="tel"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition min-h-[44px]"
                      placeholder="+221 7X XXX XX XX"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre message</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold resize-none transition"
                      placeholder="Décrivez votre besoin..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {sent && (
                    <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-4 py-3 rounded-xl">
                      <Check className="w-4 h-4" />
                      Message envoyé avec succès !
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending || !nom.trim() || !message.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition text-sm hover:scale-[1.02]"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MessageCircle className="w-5 h-5" />
                    )}
                    {sending ? "Envoi en cours..." : "Envoyer via WhatsApp"}
                  </button>
                </form>
              </div>
            </div>
            </FadeIn>
        </div>
      </section>
    </div>
  );
}
