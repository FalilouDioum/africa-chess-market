"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { Search, SlidersHorizontal } from "lucide-react";

interface Product {
  _id: string;
  nom: string;
  description: string;
  categorie: string;
  codeArticle: string;
  prixVenteCFA: number;
  prixCFA: number;
  quantiteEnStock: number;
  images: string[];
}

const categories = [
  { slug: "", label: "Tous" },
  { slug: "Chess board", label: "Plateaux" },
  { slug: "Chess pieces", label: "Pièces" },
  { slug: "Chess timer", label: "Pendules" },
  { slug: "chess set", label: "Sets" },
  { slug: "chess bag", label: "Sacs" },
];

function BoutiqueContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get("categorie") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState(catParam);
  const [sortBy, setSortBy] = useState("numero");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    let url = "/api/shop/products";
    const params = new URLSearchParams();
    if (filterCat) params.set("categorie", filterCat);
    if (search) params.set("search", search);
    if (params.toString()) url += "?" + params.toString();

    const res = await fetch(url);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, [filterCat, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setFilterCat(catParam);
  }, [catParam]);

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "prix_asc") return (a.prixVenteCFA || 0) - (b.prixVenteCFA || 0);
    if (sortBy === "prix_desc") return (b.prixVenteCFA || 0) - (a.prixVenteCFA || 0);
    if (sortBy === "stock") return b.quantiteEnStock - a.quantiteEnStock;
    return 0;
  });

  return (
    <div>
      {/* Hero mini */}
      <section className="bg-forest py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 hero-fade">
          <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Catalogue</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mt-2">Boutique</h1>
          <div className="w-16 h-0.5 bg-gold mt-4" />
          <p className="text-white/60 mt-3 text-sm sm:text-base">
            {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <FadeIn>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition min-h-[44px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 flex-1 sm:flex-none transition min-h-[44px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="numero">Par défaut</option>
                <option value="prix_asc">Prix croissant</option>
                <option value="prix_desc">Prix décroissant</option>
                <option value="stock">Stock disponible</option>
              </select>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="flex gap-2 mb-8 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setFilterCat(cat.slug)}
                className={`px-5 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[44px] ${
                  filterCat === cat.slug
                    ? "bg-forest text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gold hover:text-forest active:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </FadeIn>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest" />
          </div>
        ) : sorted.length === 0 ? (
          <FadeIn animation="fade-in">
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
              <p className="text-gray-400 text-sm mt-2">Essayez d&apos;élargir vos critères de recherche</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn animation="stagger-children">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {sorted.map((p) => (
                <ProductCard key={p._id} product={p as never} />
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

export default function BoutiquePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest" />
      </div>
    }>
      <BoutiqueContent />
    </Suspense>
  );
}
