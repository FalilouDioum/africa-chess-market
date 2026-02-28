/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, ShoppingCart, Truck, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import LazyImage from "@/components/LazyImage";
import FadeIn from "@/components/FadeIn";

interface Product {
  _id: string;
  nom: string;
  description: string;
  categorie: string;
  codeArticle: string;
  prixVenteCFA: number;
  prixCFA: number;
  prixUnitaireUSD: number;
  quantiteEnStock: number;
  quantiteCommandee: number;
  imageCount: number;
  fournisseur: string;
  promo: boolean;
  prixPromoCFA: number;
  statut: string;
}

function formatCFA(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function getWhatsAppLink(product: Product) {
  const msg = `Bonjour Africa Chess Market !\n\nJe souhaite commander :\n\n🛒 ${product.nom}\n📝 ${product.description?.substring(0, 80) || ""}\n💰 Prix : ${formatCFA(product.prixVenteCFA)}\n\nMerci !`;
  return `https://wa.me/221766090921?text=${encodeURIComponent(msg)}`;
}

export default function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  const fetchProduct = useCallback(async () => {
    const res = await fetch(`/api/shop/products/${id}`);
    if (res.ok) {
      const data = await res.json();
      setProduct(data);
      // Fetch similar
      const simRes = await fetch(`/api/shop/products?categorie=${encodeURIComponent(data.categorie)}`);
      const simData = await simRes.json();
      setSimilar(simData.filter((p: Product) => p._id !== data._id).slice(0, 4));
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Produit non trouvé</p>
        <Link href="/boutique" className="text-forest hover:underline mt-4 inline-block">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const imageCount = product.imageCount || 0;
  const inStock = product.quantiteEnStock > 0;

  return (
    <div>
      <div className="bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-4">
          <Link href="/boutique" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-forest active:text-forest transition py-2.5 min-h-[44px]">
            <ArrowLeft className="w-4 h-4" /> Retour à la boutique
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10">
        {/* Galerie */}
        <FadeIn animation="fade-in-scale">
        <div>
          <div className="relative aspect-[4/3] sm:aspect-square bg-white rounded-2xl overflow-hidden border border-gold/10 shadow-[0_4px_20px_rgba(26,58,42,0.08)]">
            {imageCount > 0 ? (
              <>
                <LazyImage
                  src={`/api/shop/images/${product._id}?idx=${currentImg}`}
                  alt={product.nom}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-contain p-4"
                />
                {imageCount > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImg((prev) => (prev - 1 + imageCount) % imageCount)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow transition min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImg((prev) => (prev + 1) % imageCount)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow transition min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Crown className="w-24 h-24 text-gold/20" />
              </div>
            )}
            {!inStock && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                Rupture de stock
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {imageCount > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {Array.from({ length: imageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-300 ${
                    i === currentImg ? "border-gold shadow-[0_0_12px_rgba(200,164,85,0.3)] scale-105" : "border-gray-200 hover:border-gold/50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={`/api/shop/images/${product._id}?idx=${i}&w=100`} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
          {/* Mobile dot indicators */}
          {imageCount > 1 && (
            <div className="flex sm:hidden justify-center gap-2 mt-3">
              {Array.from({ length: imageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentImg ? "bg-gold w-6" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        </FadeIn>

        {/* Détails */}
        <FadeIn delay={150}>
        <div>
          <span className="bg-forest/10 text-forest text-xs font-medium px-3 py-1 rounded-full">
            {product.categorie}
          </span>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mt-2">
            {product.nom}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4 leading-relaxed">
            {product.description}
          </p>

          {/* Prix */}
          <div className={`mt-3 sm:mt-5 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden ${product.promo && product.prixPromoCFA ? "bg-gradient-to-br from-red-50 to-cream border border-red-200" : "bg-gradient-to-br from-cream-dark to-cream border border-gold/20"}`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${product.promo && product.prixPromoCFA ? "bg-gradient-to-b from-red-500 via-red-400 to-red-500" : "bg-gradient-to-b from-gold via-gold-light to-gold"}`} />
            {product.promo && product.prixPromoCFA ? (
              <>
                <span className="text-xs text-red-500 font-medium tracking-widest uppercase">Promo</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl sm:text-4xl font-bold text-red-600 tabular-nums tracking-tight">
                    {formatCFA(product.prixPromoCFA)}
                  </span>
                  <span className="text-sm sm:text-lg text-gray-400 line-through tabular-nums">
                    {formatCFA(product.prixVenteCFA)}
                  </span>
                </div>
                <span className="inline-block mt-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  -{Math.round(((product.prixVenteCFA - product.prixPromoCFA) / product.prixVenteCFA) * 100)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-gold font-medium tracking-widest uppercase">Prix</span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl sm:text-4xl font-bold text-forest tabular-nums tracking-tight">
                    {product.prixVenteCFA ? formatCFA(product.prixVenteCFA) : "Sur demande"}
                  </span>
                </div>
              </>
            )}
            {inStock ? (
              <p className="text-green-600 text-sm font-medium mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {product.quantiteEnStock} en stock
              </p>
            ) : (
              <p className="text-red-500 text-sm font-medium mt-2">Actuellement indisponible</p>
            )}
          </div>

          {/* CTA */}
          {inStock ? (
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 sm:mt-5 w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] text-base sm:text-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Commander via WhatsApp
            </a>
          ) : (
            <button
              disabled
              className="mt-3 sm:mt-5 w-full flex items-center justify-center gap-3 bg-gray-300 text-gray-500 font-bold py-3.5 sm:py-4 px-6 rounded-xl cursor-not-allowed text-base sm:text-lg"
            >
              Indisponible
            </button>
          )}

          {/* Infos */}
          <div className="mt-4 sm:mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-gold mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Livraison disponible</p>
                <p className="text-xs text-gray-500">Livraison dans tout le Sénégal et en Afrique de l&apos;Ouest</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-gold mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Qualité professionnelle</p>
                <p className="text-xs text-gray-500">Matériel sélectionné avec soin par nos experts</p>
              </div>
            </div>
          </div>
        </div>
        </FadeIn>
      </div>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <FadeIn className="mt-10 sm:mt-16">
          <div className="mb-6 sm:mb-8">
            <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Vous aimerez aussi</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 tracking-tight">Produits similaires</h2>
            <div className="w-16 h-0.5 bg-gold mt-4" />
          </div>
          <FadeIn animation="stagger-children">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {similar.map((p) => (
                <ProductCard key={p._id} product={p as never} />
              ))}
            </div>
          </FadeIn>
        </FadeIn>
      )}
      </div>
    </div>
  );
}
