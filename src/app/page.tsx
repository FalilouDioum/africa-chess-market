/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import HeroSection from "@/components/HeroSection";
import { Crown, Truck, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import LazyImage from "@/components/LazyImage";

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
    // Single aggregation instead of 2 queries
    const products = await Product.aggregate([
      { $sort: { numero: 1 } },
      { $limit: 8 },
      {
        $project: {
          numero: 1, nom: 1, categorie: 1, codeArticle: 1, description: 1,
          quantiteEnStock: 1, prixVenteCFA: 1, prixCFA: 1, fournisseur: 1, statut: 1, promo: 1, prixPromoCFA: 1,
          imageCount: { $cond: { if: { $isArray: "$images" }, then: { $size: "$images" }, else: 0 } },
        },
      },
    ]);
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

async function getPromoProducts() {
  try {
    await connectDB();
    const products = await Product.aggregate([
      { $match: { promo: true, quantiteEnStock: { $gt: 0 } } },
      { $sort: { updatedAt: -1 } },
      { $limit: 8 },
      {
        $project: {
          numero: 1, nom: 1, categorie: 1, codeArticle: 1, description: 1,
          quantiteEnStock: 1, prixVenteCFA: 1, prixCFA: 1, statut: 1, promo: 1, prixPromoCFA: 1,
          imageCount: { $cond: { if: { $isArray: "$images" }, then: { $size: "$images" }, else: 0 } },
        },
      },
    ]);
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

async function getCategoryImageIds() {
  try {
    await connectDB();
    // Single aggregation instead of N+1 queries (was 5 separate queries)
    const slugs = categories.map((c) => c.slug);
    const results = await Product.aggregate([
      {
        $match: {
          categorie: { $in: slugs.map((s) => new RegExp(`^${s}$`, "i")) },
          images: { $exists: true, $not: { $size: 0 } },
        },
      },
      { $group: { _id: "$categorie", productId: { $first: "$_id" } } },
    ]);
    const map: Record<string, string> = {};
    for (const r of results) {
      // Match back to original slug (case-insensitive)
      const slug = slugs.find((s) => s.toLowerCase() === String(r._id).toLowerCase());
      if (slug) map[slug] = String(r.productId);
    }
    return map;
  } catch (error) {
    console.error("Failed to fetch category images:", error);
    return {};
  }
}

// ISR: revalidate every 60s instead of force-dynamic
export const revalidate = 60;

export default async function HomePage() {
  const [products, categoryImageIds, promoProducts] = await Promise.all([
    getFeaturedProducts(),
    getCategoryImageIds(),
    getPromoProducts(),
  ]);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Promotions */}
      {promoProducts.length > 0 && (
        <section className="bg-white py-14 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle at 80% 50%, #ef4444 0%, transparent 50%)',
          }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <FadeIn>
              <div className="text-center mb-10 sm:mb-14">
                <span className="text-red-500 text-xs sm:text-sm font-medium tracking-widest uppercase">Offres limitées</span>
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Nos promotions</h2>
                <div className="w-16 h-0.5 bg-red-500 mx-auto mt-4" />
              </div>
            </FadeIn>
            <FadeIn animation="stagger-children">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {promoProducts.map((product: Record<string, unknown>) => (
                  <ProductCard key={String(product._id)} product={product as never} />
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Catégories */}
      <section className="bg-cream py-14 sm:py-24 relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, var(--color-gold) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--color-forest-light) 0%, transparent 50%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Collection</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Nos catégories</h2>
              <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
            </div>
          </FadeIn>
          <FadeIn animation="stagger-children">
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-5 sm:overflow-visible">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/boutique?categorie=${encodeURIComponent(cat.slug)}`}
                  className="group relative rounded-2xl overflow-hidden shrink-0 w-32 sm:w-auto aspect-[3/4] sm:aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-white">
                    {categoryImageIds[cat.slug] ? (
                      <LazyImage
                        src={`/api/shop/images/${categoryImageIds[cat.slug]}?idx=0&w=300`}
                        alt={cat.label}
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl sm:text-6xl">{cat.emoji}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="font-bold text-white text-sm sm:text-lg group-hover:text-gold transition-colors duration-300">{cat.label}</h3>
                    <p className="text-[10px] sm:text-xs text-white/70 mt-1 leading-snug">{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="bg-white py-14 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 sm:mb-14">
              <div>
                <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Catalogue</span>
                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2 tracking-tight">Nos produits</h2>
                <div className="w-16 h-0.5 bg-gold mt-4" />
              </div>
              <Link
                href="/boutique"
                className="hidden sm:inline-flex items-center gap-2 text-forest font-semibold hover:text-gold transition border border-forest/20 hover:border-gold px-5 py-2.5 rounded-xl text-sm"
              >
                Voir tout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
          <FadeIn animation="stagger-children">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((p: Record<string, unknown>) => (
                <ProductCard key={p._id as string} product={p as never} />
              ))}
            </div>
          </FadeIn>
          <FadeIn>
            <div className="sm:hidden text-center mt-10">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 bg-forest text-white px-8 py-3.5 rounded-xl font-semibold text-sm"
              >
                Voir tous les produits <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="bg-forest text-white py-14 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a455' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-14">
              <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Nos engagements</span>
              <h2 className="text-2xl sm:text-4xl font-bold mt-2 tracking-tight">Pourquoi Africa Chess Market ?</h2>
              <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
            </div>
          </FadeIn>
          <FadeIn animation="stagger-children">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { icon: ShieldCheck, title: "Qualité garantie", desc: "Matériel professionnel importé directement des meilleurs fabricants. Pièces lestées, plateaux résistants." },
                { icon: Truck, title: "Livraison rapide", desc: "Livraison dans tout le Sénégal et en Afrique de l'Ouest. Suivi de commande en temps réel." },
                { icon: MessageCircle, title: "Support réactif", desc: "Une question ? Contactez-nous directement via WhatsApp. Réponse garantie sous 24h." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white/[0.06] backdrop-blur-sm rounded-2xl p-6 sm:p-10 text-center border border-white/10 hover:border-gold/30 transition-all duration-500 border-t-2 border-t-gold/40 hover:border-t-gold">
                    <div className="w-16 h-16 bg-gold/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-cream py-14 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn animation="fade-in-scale">
            <div className="relative bg-forest rounded-3xl p-8 sm:p-16 text-center text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img src="/hero-chess.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-gold/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Crown className="w-9 h-9 text-gold" />
                </div>
                <h2 className="text-xl sm:text-3xl font-bold mb-3 tracking-tight">Prêt à élever votre jeu ?</h2>
                <p className="text-white/60 max-w-md mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                  Commandez dès maintenant et recevez votre matériel d&apos;échecs de qualité professionnelle.
                </p>
                <a
                  href="https://wa.me/221766090921?text=Bonjour%20!%20Je%20souhaite%20passer%20commande."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark active:bg-gold-dark text-forest-dark font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(200,164,85,0.4)] text-base sm:text-lg"
                >
                  Commander maintenant <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
