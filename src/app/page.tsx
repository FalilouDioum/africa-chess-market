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

async function getCategoryImages() {
  try {
    await connectDB();
    const categoryImages: Record<string, string> = {};
    for (const cat of categories) {
      const product = await Product.findOne({
        categorie: { $regex: new RegExp(`^${cat.slug}$`, "i") },
        images: { $exists: true, $ne: [] },
      }).select("images").lean();
      if (product && (product as Record<string, unknown>).images) {
        const images = (product as Record<string, unknown>).images as string[];
        if (images.length > 0) {
          categoryImages[cat.slug] = images[0];
        }
      }
    }
    return categoryImages;
  } catch (error) {
    console.error("Failed to fetch category images:", error);
    return {};
  }
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categoryImages] = await Promise.all([
    getFeaturedProducts(),
    getCategoryImages(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-forest overflow-hidden -mt-16 sm:-mt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a455' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="absolute inset-0 opacity-[0.12]">
          <img src="/hero-chess.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-52 pb-16 sm:pb-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              <span className="text-gold text-xs sm:text-sm font-medium tracking-wider uppercase">Africa Chess Market</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Découvrez le jeu des Rois
            </h1>
            <p className="text-xl sm:text-3xl lg:text-4xl font-bold text-gold mt-2">
              au Sénégal
            </p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
              Une sélection de matériel d&apos;échecs professionnel. Plateaux, pièces, pendules et accessoires de qualité supérieure.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/boutique"
                className="bg-gold hover:bg-gold-dark active:bg-gold-dark text-forest-dark font-semibold px-6 py-3.5 sm:py-3 rounded-xl transition hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Accédez à la boutique <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/221771234455?text=Bonjour%20!%20Je%20souhaite%20en%20savoir%20plus%20sur%20vos%20produits."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold px-6 py-3.5 sm:py-3 rounded-xl transition hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4" /> Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="bg-cream py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Collection</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">Nos catégories</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-5 sm:overflow-visible">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/boutique?categorie=${encodeURIComponent(cat.slug)}`}
                className="group relative rounded-2xl overflow-hidden shrink-0 w-40 sm:w-auto aspect-[3/4] sm:aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background image */}
                <div className="absolute inset-0 bg-white">
                  {categoryImages[cat.slug] ? (
                    <img
                      src={categoryImages[cat.slug]}
                      alt={cat.label}
                      className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl">{cat.emoji}</span>
                    </div>
                  )}
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
                {/* Gold border on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold transition-colors duration-300" />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="font-bold text-white text-sm sm:text-lg group-hover:text-gold transition-colors duration-300">{cat.label}</h3>
                  <p className="text-[10px] sm:text-xs text-white/70 mt-1 leading-snug">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="bg-white py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10 sm:mb-14">
            <div>
              <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Catalogue</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">Nos produits</h2>
              <div className="w-16 h-0.5 bg-gold mt-4" />
            </div>
            <Link
              href="/boutique"
              className="hidden sm:inline-flex items-center gap-2 text-forest font-semibold hover:text-gold transition border border-forest/20 hover:border-gold px-5 py-2.5 rounded-xl text-sm"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((p: Record<string, unknown>) => (
              <ProductCard key={p._id as string} product={p as never} />
            ))}
          </div>
          <div className="sm:hidden text-center mt-10">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 bg-forest text-white px-8 py-3.5 rounded-xl font-semibold text-sm"
            >
              Voir tous les produits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comment commander */}
      <section className="bg-cream py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Processus</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">Comment commander ?</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Search, step: "01", title: "Parcourez notre catalogue", desc: "Explorez notre sélection de plateaux, pièces, pendules et accessoires d'échecs." },
              { icon: ShoppingCart, step: "02", title: "Commandez via WhatsApp", desc: "Cliquez sur le bouton Commander et envoyez-nous votre commande directement sur WhatsApp." },
              { icon: Package, step: "03", title: "Recevez votre commande", desc: "Nous préparons et livrons votre matériel d'échecs à l'adresse de votre choix." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative bg-white rounded-2xl p-6 sm:p-10 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gold/10">
                  <span className="text-7xl sm:text-8xl font-extrabold text-forest/[0.03] absolute top-2 right-4 sm:top-4 sm:right-6 leading-none">{item.step}</span>
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

      {/* Pourquoi nous choisir */}
      <section className="bg-forest text-white py-14 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a455' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Nos engagements</span>
            <h2 className="text-2xl sm:text-4xl font-bold mt-2">Pourquoi Africa Chess Market ?</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: ShieldCheck, title: "Qualité garantie", desc: "Matériel professionnel importé directement des meilleurs fabricants. Pièces lestées, plateaux résistants." },
              { icon: Truck, title: "Livraison rapide", desc: "Livraison dans tout le Sénégal et en Afrique de l'Ouest. Suivi de commande en temps réel." },
              { icon: MessageCircle, title: "Support réactif", desc: "Une question ? Contactez-nous directement via WhatsApp. Réponse garantie sous 24h." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white/[0.06] backdrop-blur-sm rounded-2xl p-6 sm:p-10 text-center border border-white/10 hover:border-gold/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-gold/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-cream py-14 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative bg-forest rounded-3xl p-8 sm:p-16 text-center text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img src="/hero-chess.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative">
              <div className="w-16 h-16 bg-gold/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Crown className="w-9 h-9 text-gold" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold mb-3">Prêt à élever votre jeu ?</h2>
              <p className="text-white/60 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                Commandez dès maintenant et recevez votre matériel d&apos;échecs de qualité professionnelle.
              </p>
              <a
                href="https://wa.me/221771234455?text=Bonjour%20!%20Je%20souhaite%20passer%20commande."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark active:bg-gold-dark text-forest-dark font-bold px-8 py-4 rounded-xl transition hover:scale-105 text-base sm:text-lg"
              >
                Commander maintenant <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
