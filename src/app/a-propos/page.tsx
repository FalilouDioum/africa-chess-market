/* eslint-disable @next/next/no-img-element */
import { Crown, Target, Users, Globe } from "lucide-react";

export default function AProposPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-forest py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Notre histoire</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mt-2">À propos d&apos;Africa Chess Market</h1>
          <div className="w-16 h-0.5 bg-gold mt-4" />
          <p className="text-white/60 mt-3 max-w-2xl text-sm sm:text-base">
            Démocratiser les échecs en Afrique, un plateau à la fois.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="bg-white py-14 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Genèse</span>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mt-2">Notre histoire</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
          <div className="text-gray-600 space-y-5 leading-relaxed text-base sm:text-lg">
            <p>
              <strong className="text-gray-900">Africa Chess Market</strong> est née de la passion de deux amis, <strong className="text-gray-900">Falilou</strong> et <strong className="text-gray-900">Sidy</strong>, unis par leur amour des échecs et leur vision commune : rendre le matériel d&apos;échecs de qualité accessible à tous en Afrique.
            </p>
            <p>
              Opérant sous la marque <strong className="text-gray-900">Petit Nihal Chess</strong>, notre entreprise s&apos;est donnée pour mission de fournir aux joueurs, clubs, écoles et fédérations africaines du matériel professionnel à des prix compétitifs.
            </p>
            <p>
              Nous importons directement auprès des meilleurs fabricants mondiaux pour garantir la qualité et proposer les meilleurs tarifs. Chaque pièce est lestée, chaque plateau est sélectionné avec soin, chaque pendule est testée avant expédition.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-cream py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Ce qui nous guide</span>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mt-2">Nos valeurs</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Target,
                title: "Excellence",
                desc: "Nous ne proposons que du matériel de qualité professionnelle. Pas de compromis sur la qualité, jamais.",
              },
              {
                icon: Users,
                title: "Accessibilité",
                desc: "Les échecs sont pour tous. Nous travaillons à rendre le matériel abordable pour chaque joueur, chaque club, chaque école.",
              },
              {
                icon: Globe,
                title: "Panafricanisme",
                desc: "Notre ambition est de servir tout le continent. Nous livrons au Sénégal et dans toute l'Afrique de l'Ouest.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl p-6 sm:p-10 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gold/10">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Les fondateurs */}
      <section className="bg-white py-14 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">L&apos;équipe</span>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mt-2">Les fondateurs</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { name: "Falilou", role: "Co-fondateur & Directeur commercial", initial: "F", color: "bg-forest" },
              { name: "Sidy", role: "Co-fondateur & Directeur des opérations", initial: "S", color: "bg-gold-dark" },
            ].map((person) => (
              <div key={person.name} className="bg-cream rounded-2xl p-8 sm:p-10 text-center border border-gold/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-20 h-20 ${person.color} rounded-full flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold shadow-lg`}>
                  {person.initial}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                <p className="text-sm text-gray-500 mt-2">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-14 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative bg-forest rounded-3xl p-8 sm:p-16 text-center text-white overflow-hidden">
            <div className="relative">
              <div className="w-16 h-16 bg-gold/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Crown className="w-9 h-9 text-gold" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold mb-3">Envie de collaborer ?</h2>
              <p className="text-white/60 mb-8 text-sm sm:text-base leading-relaxed">Nous travaillons avec les clubs, écoles et fédérations d&apos;échecs.</p>
              <a
                href="https://wa.me/221771234455?text=Bonjour%20!%20Je%20souhaite%20discuter%20d'un%20partenariat."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-forest-dark font-bold px-8 py-4 rounded-xl transition hover:scale-105"
              >
                Contactez-nous
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
