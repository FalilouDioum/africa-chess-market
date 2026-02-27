import Link from "next/link";
import { Crown, ShoppingCart } from "lucide-react";
import LazyImage from "@/components/LazyImage";

interface Product {
  _id: string;
  nom: string;
  description: string;
  categorie: string;
  codeArticle: string;
  prixVenteCFA: number;
  quantiteEnStock: number;
  images?: string[];
  imageCount?: number;
}

function formatCFA(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function getWhatsAppLink(product: Product) {
  const msg = `Bonjour Africa Chess Market !\n\nJe souhaite commander :\n\n🛒 ${product.nom}\n📝 ${product.description?.substring(0, 60) || ""}\n📦 Code : ${product.codeArticle}\n💰 Prix : ${formatCFA(product.prixVenteCFA)}\n\nMerci !`;
  return `https://wa.me/221766090921?text=${encodeURIComponent(msg)}`;
}

function getImageSrc(product: Product): string | null {
  if (product.imageCount && product.imageCount > 0) {
    return `/api/shop/images/${product._id}?idx=0&w=400`;
  }
  if (product.images && product.images.length > 0) {
    return `/api/shop/images/${product._id}?idx=0&w=400`;
  }
  return null;
}

export default function ProductCard({ product }: { product: Product }) {
  const inStock = product.quantiteEnStock > 0;
  const imgSrc = getImageSrc(product);

  return (
    <div className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(26,58,42,0.12)] transition-all duration-500 border border-gray-100 hover:border-gold/40 flex flex-col hover:-translate-y-1.5 relative">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold/0 via-gold to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
      <Link href={`/boutique/${product._id}`} className="relative block aspect-square overflow-hidden bg-cream-dark">
        {imgSrc ? (
          <LazyImage
            src={imgSrc}
            alt={product.nom}
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 saturate-[0.85] group-hover:saturate-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-gold/30" />
          </div>
        )}
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-forest/90 text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-gold rounded-full" />
          {product.categorie}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-forest/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        {!inStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 flex items-center justify-center backdrop-saturate-0">
            <span className="bg-white/90 text-gray-900 text-[10px] sm:text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full tracking-wide uppercase">
              Rupture de stock
            </span>
          </div>
        )}
      </Link>

      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <Link href={`/boutique/${product._id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-forest transition text-sm sm:text-base line-clamp-1">
            {product.nom}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 flex-1 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-2 sm:mt-3 flex items-end justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <p className="text-base sm:text-xl font-bold text-forest truncate tracking-tight tabular-nums">
              {product.prixVenteCFA ? formatCFA(product.prixVenteCFA) : "Sur demande"}
            </p>
            {inStock && (
              <p className="text-xs text-green-600 font-medium">{product.quantiteEnStock} en stock</p>
            )}
          </div>
          {inStock ? (
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white p-2.5 sm:p-3 rounded-xl transition shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Commander via WhatsApp"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          ) : (
            <span className="text-xs text-gray-400 italic shrink-0">Indisponible</span>
          )}
        </div>
      </div>
    </div>
  );
}
