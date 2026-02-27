/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, ShoppingCart, Truck, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";

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
  statut: string;
}

function formatCFA(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function getWhatsAppLink(product: Product) {
  const msg = `Bonjour Africa Chess Market !\n\nJe souhaite commander :\n\n🛒 ${product.nom}\n📝 ${product.description?.substring(0, 80) || ""}\n📦 Code : ${product.codeArticle}\n💰 Prix : ${formatCFA(product.prixVenteCFA)}\n\nMerci !`;
  return `https://wa.me/221771234455?text=${encodeURIComponent(msg)}`;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-12">
      {/* Breadcrumb */}
      <Link href="/boutique" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-forest active:text-forest mb-4 sm:mb-6 transition py-2.5 min-h-[44px]">
        <ArrowLeft className="w-4 h-4" /> Retour à la boutique
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Galerie */}
        <div>
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {imageCount > 0 ? (
              <>
                <img
                  src={`/api/shop/images/${product._id}?idx=${currentImg}`}
                  alt={product.nom}
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
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {Array.from({ length: imageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                    i === currentImg ? "border-forest" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={`/api/shop/images/${product._id}?idx=${i}`} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails */}
        <div>
          <span className="bg-forest/10 text-forest text-xs font-medium px-3 py-1 rounded-full">
            {product.categorie}
          </span>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mt-3">
            {product.nom}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Code : {product.codeArticle}</p>

          <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4 leading-relaxed">
            {product.description}
          </p>

          {/* Prix */}
          <div className="mt-4 sm:mt-6 bg-cream-dark rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-forest">
                {product.prixVenteCFA ? formatCFA(product.prixVenteCFA) : "Sur demande"}
              </span>
            </div>
            {inStock ? (
              <p className="text-green-600 text-sm font-medium mt-1">{product.quantiteEnStock} en stock</p>
            ) : (
              <p className="text-red-500 text-sm font-medium mt-1">Actuellement indisponible</p>
            )}
          </div>

          {/* CTA */}
          {inStock ? (
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3.5 sm:py-4 px-6 rounded-xl transition hover:scale-[1.02] text-base sm:text-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Commander via WhatsApp
            </a>
          ) : (
            <button
              disabled
              className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-3 bg-gray-300 text-gray-500 font-bold py-3.5 sm:py-4 px-6 rounded-xl cursor-not-allowed text-base sm:text-lg"
            >
              Indisponible
            </button>
          )}

          {/* Infos */}
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
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
                <p className="text-xs text-gray-500">Matériel importé de {product.fournisseur}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <div className="mt-10 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Produits similaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {similar.map((p) => (
              <ProductCard key={p._id} product={p as never} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
