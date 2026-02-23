"use client";

import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-forest text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl sm:text-5xl font-bold">Contactez-nous</h1>
          <p className="text-white/70 mt-2 sm:mt-4 max-w-xl mx-auto text-sm sm:text-lg">
            Une question, une commande spéciale ? Nous sommes là pour vous.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Infos de contact */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Nos coordonnées</h2>
            <div className="space-y-4 sm:space-y-6">
              <a
                href="https://wa.me/221771234455"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 bg-green-50 p-5 rounded-2xl border border-green-100 hover:shadow-md transition group"
              >
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-green-700 transition">WhatsApp Business</p>
                  <p className="text-green-700 font-medium">+221 77 123 44 55</p>
                  <p className="text-xs text-gray-500 mt-1">Cliquez pour nous écrire directement</p>
                </div>
              </a>

              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-forest">contact@africachessmarket.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Adresse</p>
                  <p className="text-gray-600">Dakar, Sénégal</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Horaires</p>
                  <p className="text-gray-600">Lundi - Samedi : 9h - 19h</p>
                  <p className="text-gray-500 text-sm">Dimanche : sur rendez-vous</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire WhatsApp */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Envoyez-nous un message</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              <p className="text-gray-500 text-sm mb-6">
                Remplissez le formulaire ci-dessous et nous vous répondrons via WhatsApp dans les plus brefs délais.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="space-y-4"
                id="contact-form"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre nom</label>
                  <input
                    type="text"
                    id="contact-name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                    placeholder="Prénom et nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre téléphone</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                    placeholder="+221 7X XXX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Votre message</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest resize-none"
                    placeholder="Décrivez votre besoin..."
                  />
                </div>
                <ContactFormButton />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactFormButton() {
  "use client";
  return (
    <button
      type="button"
      onClick={() => {
        const name = (document.getElementById("contact-name") as HTMLInputElement)?.value || "";
        const phone = (document.getElementById("contact-phone") as HTMLInputElement)?.value || "";
        const message = (document.getElementById("contact-message") as HTMLTextAreaElement)?.value || "";
        const text = `Bonjour Africa Chess Market !\n\nJe suis ${name}${phone ? ` (${phone})` : ""}.\n\n${message}`;
        window.open(`https://wa.me/221771234455?text=${encodeURIComponent(text)}`, "_blank");
      }}
      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition text-sm"
    >
      <MessageCircle className="w-5 h-5" />
      Envoyer via WhatsApp
    </button>
  );
}
