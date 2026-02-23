/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Crown, ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  nom: string;
  description: string;
  categorie: string;
  codeArticle: string;
  prixVenteCFA: number;
  quantiteEnStock: number;
  images: string[];
}

function formatCFA(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

function getWhatsAppLink(product: Product) {
  const msg = `Bonjour Africa Chess Market !\n\nJe souhaite commander :\n\n🛒 ${product.nom}\n📝 ${product.description?.substring(0, 60) || ""}\n📦 Code : ${product.codeArticle}\n💰 Prix : ${formatCFA(product.prixVenteCFA)}\n\nMerci !`;
  return `https://wa.me/221771234455?text=${encodeURIComponent(msg)}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const inStock = product.quantiteEnStock > 0;
  const thumb = product.images?.[0];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      {/* Image */}
      <Link href={`/boutique/${product._id}`} className="relative block aspect-square overflow-hidden bg-cream-dark">
        {thumb ? (
          <img
            src={thumb}
            alt={product.nom}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Crown className="w-16 h-16 text-gold/30" />
          </div>
        )}
        {/* Badge catégorie */}
        <span className="absolute top-3 left-3 bg-forest/90 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {product.categorie}
        </span>
        {/* Badge stock */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}
      </Link>

      {/* Infos */}
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/boutique/${product._id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-forest transition line-clamp-1">
            {product.nom}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-forest">
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
              className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-xl transition hover:scale-105 shrink-0"
              title="Commander via WhatsApp"
            >
              <ShoppingCart className="w-4 h-4" />
            </a>
          ) : (
            <span className="text-xs text-gray-400 italic">Indisponible</span>
          )}
        </div>
      </div>
    </div>
  );
}
