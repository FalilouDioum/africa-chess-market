import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// Strip accents for accent-insensitive regex search
function stripAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Build a regex pattern that matches both accented and unaccented forms
function accentInsensitivePattern(str: string) {
  const map: Record<string, string> = {
    a: "[aàâä]", e: "[eéèêë]", i: "[iîï]", o: "[oôö]", u: "[uùûü]", c: "[cç]",
  };
  return stripAccents(str)
    .split("")
    .map((c) => map[c.toLowerCase()] || c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("");
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const search = searchParams.get("search")?.trim();
    const inStock = searchParams.get("inStock");

    const filter: Record<string, unknown> = {};
    if (categorie) filter.categorie = { $regex: new RegExp(`^${categorie}$`, "i") };
    if (inStock === "1") filter.quantiteEnStock = { $gt: 0 };
    if (search) {
      const pattern = accentInsensitivePattern(search);
      filter.$or = [
        { nom: { $regex: pattern, $options: "i" } },
        { description: { $regex: pattern, $options: "i" } },
        { codeArticle: { $regex: pattern, $options: "i" } },
      ];
    }

    // Single aggregation: get products with imageCount in one query
    const products = await Product.aggregate([
      { $match: filter },
      { $sort: { numero: 1 } },
      {
        $project: {
          numero: 1, nom: 1, categorie: 1, codeArticle: 1, description: 1,
          quantiteEnStock: 1, quantiteCommandee: 1,
          prixVenteCFA: 1, prixCFA: 1, prixUnitaireUSD: 1,
          fournisseur: 1, statut: 1,
          imageCount: { $cond: { if: { $isArray: "$images" }, then: { $size: "$images" }, else: 0 } },
        },
      },
    ]);

    return NextResponse.json(products);
  } catch (error) {
    console.error("API /shop/products error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
