import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return { title: "Produit non trouvé" };
    }

    const p = product as { nom: string; description: string; categorie: string; prixVenteCFA: number; _id: { toString(): string } };
    const title = p.nom;
    const description = p.description
      ? p.description.substring(0, 160)
      : `${p.nom} - ${p.categorie} disponible chez Africa Chess Market. Livraison au Sénégal et en Afrique de l'Ouest.`;

    return {
      title,
      description,
      openGraph: {
        title: `${p.nom} - Africa Chess Market`,
        description,
        url: `/boutique/${p._id.toString()}`,
        type: "website",
        images: [{ url: `/api/shop/images/${p._id.toString()}?idx=0&w=800`, width: 800, height: 800, alt: p.nom }],
      },
      twitter: {
        card: "summary_large_image",
        title: p.nom,
        description,
        images: [`/api/shop/images/${p._id.toString()}?idx=0&w=800`],
      },
      alternates: {
        canonical: `/boutique/${p._id.toString()}`,
      },
    };
  } catch {
    return { title: "Produit" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  let productJsonLd = null;
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    if (product) {
      const p = product as { _id: { toString(): string }; nom: string; description: string; categorie: string; prixVenteCFA: number; quantiteEnStock: number; codeArticle: string };
      productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.nom,
        description: p.description,
        sku: p.codeArticle,
        category: p.categorie,
        image: `https://africachessmarket.com/api/shop/images/${p._id.toString()}?idx=0&w=800`,
        url: `https://africachessmarket.com/boutique/${p._id.toString()}`,
        brand: { "@type": "Brand", name: "Africa Chess Market" },
        offers: {
          "@type": "Offer",
          price: p.prixVenteCFA,
          priceCurrency: "XOF",
          availability: p.quantiteEnStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "Africa Chess Market" },
          url: `https://africachessmarket.com/boutique/${p._id.toString()}`,
        },
      };
    }
  } catch {
    // Silently fail — page will still render
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductDetailClient id={id} />
    </>
  );
}
