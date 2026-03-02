import type { Metadata } from "next";
import { cache } from "react";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

// ISR: revalidate every 60s
export const revalidate = 60;

/**
 * Cached product fetch — React.cache deduplicates across
 * generateMetadata + page render within the same request.
 * Single aggregation: compute imageCount then strip images blob.
 */
const getProduct = cache(async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  await connectDB();
  const results = await Product.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $addFields: {
        imageCount: { $cond: { if: { $isArray: "$images" }, then: { $size: "$images" }, else: 0 } },
      },
    },
    { $project: { images: 0 } },
  ]);

  return results.length ? results[0] : null;
});

async function getSimilarProducts(categorie: string, excludeId: string) {
  await connectDB();
  const escaped = categorie.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Product.aggregate([
    {
      $match: {
        categorie: { $regex: new RegExp(`^${escaped}$`, "i") },
        _id: { $ne: new mongoose.Types.ObjectId(excludeId) },
      },
    },
    { $sort: { numero: 1 } },
    { $limit: 4 },
    {
      $addFields: {
        imageCount: { $cond: { if: { $isArray: "$images" }, then: { $size: "$images" }, else: 0 } },
      },
    },
    { $project: { images: 0 } },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return { title: "Produit non trouvé" };

  const description = product.description
    ? product.description.substring(0, 160)
    : `${product.nom} - ${product.categorie} disponible chez Africa Chess Market. Livraison au Sénégal et en Afrique de l'Ouest.`;

  return {
    title: product.nom,
    description,
    openGraph: {
      title: `${product.nom} - Africa Chess Market`,
      description,
      url: `/boutique/${product._id}`,
      type: "website",
      images: [{ url: `/api/shop/images/${product._id}?idx=0&w=800`, width: 800, height: 800, alt: product.nom }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.nom,
      description,
      images: [`/api/shop/images/${product._id}?idx=0&w=800`],
    },
    alternates: {
      canonical: `/boutique/${product._id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const product = await getProduct(id);
  if (!product) notFound();

  const similar = await getSimilarProducts(product.categorie, id);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nom,
    description: product.description,
    sku: product.codeArticle,
    category: product.categorie,
    image: `https://africa-chess-market.com/api/shop/images/${product._id}?idx=0&w=800`,
    url: `https://africa-chess-market.com/boutique/${product._id}`,
    brand: { "@type": "Brand", name: "Africa Chess Market" },
    offers: {
      "@type": "Offer",
      price: product.prixVenteCFA,
      priceCurrency: "XOF",
      availability: product.quantiteEnStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Africa Chess Market" },
      url: `https://africa-chess-market.com/boutique/${product._id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailClient
        product={JSON.parse(JSON.stringify(product))}
        similar={JSON.parse(JSON.stringify(similar))}
      />
    </>
  );
}
