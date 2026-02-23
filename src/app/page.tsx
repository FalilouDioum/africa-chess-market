/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import { Crown, Truck, ShieldCheck, MessageCircle, ArrowRight, Search, ShoppingCart, Package } from "lucide-react";

const categories = [
  { slug: "Chess board", label: "Plateaux", emoji: "♟", desc: "Vinyle, caoutchouc, bois" },
  { slug: "Chess pieces", label: "Pièces", emoji: "♚", desc: "Plastique et bois lestées" },
  { slug: "Chess timer", label: "Pendules", emoji: "⏱", desc: "Digitales avec bonus" },
  { slug: "chess set", label: "Sets complets", emoji: "♛", desc: "Plateau + pièces" },
  { slug: "chess bag", label: "Sacs & accessoires", emoji: "🎒", desc: "Transport et rangement" },
];

async function getHeroImage() {
  try {
    await connectDB();
    const product = await Product.findOne({ codeArticle: "TF520-S" }).lean();
    if (product && product.images && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  } catch {
    return null;
  }
}

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find().sort({ numero: 1 }).limit(8).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, heroImage] = await Promise.all([getFeaturedProducts(), getHeroImage()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a455' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        {heroImage && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] opacity-[0.08]">
            <img src={heroImage} alt="" className="w-full h-full object-contain" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-5 h-5 text-gold" />
              <span className="text-gold text-sm font-medium tracking-wider uppercase">Africa Chess Market</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              L&apos;excellence des échecs,
              <span className="text-gold"> livrée chez vous</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
              Découvrez notre sélection de matériel d&apos;échecs professionnel. Plateaux, pièces, pendules et accessoires de qualité supérieure, directement importés pour vous.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/boutique"
                className="bg-gold hover:bg-gold-dark text-forest-dark font-semibold px-6 py-3 rounded-xl transition hover:scale-105 flex items-center gap-2"
              >
                Découvrir la boutique <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/221771234455?text=Bonjour%20!%20Je%20souhaite%20en%20savoir%20plus%20sur%20vos%20produits."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition hover:scale-105 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Nos catégories</h2>
          <p className="text-gray-500 mt-2">Tout le matériel d&apos;échecs dont vous avez besoin</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/boutique?categorie=${encodeURIComponent(cat.slug)}`}
              className="group bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-lg border border-gray-100 transition-all hover:-translate-y-1"
            >
              <span className="text-4xl block mb-3">{cat.emoji}</span>
              <h3 className="font-semibold text-gray-900 group-hover:text-forest transition">{cat.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Nos produits</h2>
              <p className="text-gray-500 mt-2">Les meilleurs articles de notre catalogue</p>
            </div>
            <Link
              href="/boutique"
              className="hidden sm:flex items-center gap-2 text-forest font-medium hover:text-gold transition"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p: Record<string, unknown>) => (
              <ProductCard key={p._id as string} product={p as never} />
            ))}
          </div>
          <div className="sm:hidden text-center mt-8">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-medium"
            >
              Voir tous les produits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comment commander */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Comment commander ?</h2>
          <p className="text-gray-500 mt-2">3 étapes simples pour recevoir votre matériel</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, step: "01", title: "Parcourez notre catalogue", desc: "Explorez notre sélection de plateaux, pièces, pendules et accessoires d'échecs." },
            { icon: ShoppingCart, step: "02", title: "Commandez via WhatsApp", desc: "Cliquez sur le bouton Commander et envoyez-nous votre commande directement sur WhatsApp." },
            { icon: Package, step: "03", title: "Recevez votre commande", desc: "Nous préparons et livrons votre matériel d'échecs à l'adresse de votre choix." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center">
                <span className="text-6xl font-black text-forest/5 absolute top-4 right-6">{item.step}</span>
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="bg-forest text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Pourquoi Africa Chess Market ?</h2>
            <p className="text-white/60 mt-2">Votre satisfaction est notre priorité</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Qualité garantie", desc: "Matériel professionnel importé directement des meilleurs fabricants. Pièces lestées, plateaux résistants." },
              { icon: Truck, title: "Livraison rapide", desc: "Livraison dans tout le Sénégal et en Afrique de l'Ouest. Suivi de commande en temps réel." },
              { icon: MessageCircle, title: "Support réactif", desc: "Une question ? Contactez-nous directement via WhatsApp. Réponse garantie sous 24h." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-gradient-to-br from-forest to-forest-light rounded-3xl p-8 sm:p-12 text-center text-white">
          <Crown className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Prêt à élever votre jeu ?</h2>
          <p className="text-white/70 max-w-md mx-auto mb-6">
            Commandez dès maintenant et recevez votre matériel d&apos;échecs de qualité professionnelle.
          </p>
          <a
            href="https://wa.me/221771234455?text=Bonjour%20!%20Je%20souhaite%20passer%20commande."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-forest-dark font-bold px-8 py-4 rounded-xl transition hover:scale-105 text-lg"
          >
            Commander maintenant <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
