/* eslint-disable @next/next/no-img-element */
import { Crown, Target, Users, Globe } from "lucide-react";

export default function AProposPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-forest text-white py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-gold mx-auto mb-3 sm:mb-4" />
          <h1 className="text-2xl sm:text-5xl font-bold">À propos d&apos;Africa Chess Market</h1>
          <p className="text-white/70 mt-2 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-lg">
            Démocratiser les échecs en Afrique, un plateau à la fois.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Notre histoire</h2>
        <div className="prose prose-lg text-gray-600 space-y-4">
          <p>
            <strong>Africa Chess Market</strong> est née de la passion de deux amis, <strong>Falilou</strong> et <strong>Sidy</strong>, unis par leur amour des échecs et leur vision commune : rendre le matériel d&apos;échecs de qualité accessible à tous en Afrique.
          </p>
          <p>
            Opérant sous la marque <strong>Petit Nihal Chess</strong>, notre entreprise s&apos;est donnée pour mission de fournir aux joueurs, clubs, écoles et fédérations africaines du matériel professionnel à des prix compétitifs.
          </p>
          <p>
            Nous importons directement auprès des meilleurs fabricants mondiaux pour garantir la qualité et proposer les meilleurs tarifs. Chaque pièce est lestée, chaque plateau est sélectionné avec soin, chaque pendule est testée avant expédition.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="bg-white py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
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
                <div key={item.title} className="bg-cream rounded-2xl p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Les fondateurs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">Les fondateurs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { name: "Falilou", role: "Co-fondateur & Directeur commercial", initial: "F", color: "bg-forest" },
            { name: "Sidy", role: "Co-fondateur & Directeur des opérations", initial: "S", color: "bg-gold-dark" },
          ].map((person) => (
            <div key={person.name} className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-gray-100 shadow-sm">
              <div className={`w-20 h-20 ${person.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold`}>
                {person.initial}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{person.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">Envie de collaborer ?</h2>
          <p className="text-white/70 mb-6">Nous travaillons avec les clubs, écoles et fédérations d&apos;échecs.</p>
          <a
            href="https://wa.me/221771234455?text=Bonjour%20!%20Je%20souhaite%20discuter%20d'un%20partenariat."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-forest-dark font-bold px-6 py-3 rounded-xl transition"
          >
            Contactez-nous
          </a>
        </div>
      </section>
    </div>
  );
}
