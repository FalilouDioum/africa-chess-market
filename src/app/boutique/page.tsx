"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { Search, SlidersHorizontal, X } from "lucide-react";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCat, setFilterCat] = useState(catParam);
  const [sortBy, setSortBy] = useState("numero");
  const [inStockOnly, setInStockOnly] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce search: wait 350ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterCat) params.set("categorie", filterCat);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (inStockOnly) params.set("inStock", "1");
    const url = "/api/shop/products" + (params.toString() ? "?" + params.toString() : "");

    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      // Silently fail — keep previous products
    }
    setLoading(false);
  }, [filterCat, debouncedSearch, inStockOnly]);

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
      <section className="bg-forest py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a455' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 hero-fade">
          <span className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase">Catalogue</span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mt-2 tracking-tight">Boutique</h1>
          <div className="w-16 h-0.5 bg-gold mt-4" />
          <p className="text-white/60 mt-3 text-sm sm:text-base">
            <span className="text-gold font-semibold">{products.length}</span> produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <FadeIn>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full pl-11 pr-10 py-3.5 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold focus:bg-white transition min-h-[44px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition"
                    aria-label="Effacer la recherche"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
                <select
                  className="bg-cream border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold focus:bg-white flex-1 sm:flex-none transition min-h-[44px]"
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
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setFilterCat(cat.slug)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[40px] ${
                    filterCat === cat.slug
                      ? "bg-forest text-white shadow-md"
                      : "bg-cream text-gray-600 hover:bg-cream-dark hover:text-forest active:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[40px] ml-auto ${
                  inStockOnly
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-cream text-gray-600 hover:bg-cream-dark hover:text-green-700 active:bg-gray-200"
                }`}
              >
                En stock
              </button>
            </div>
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
