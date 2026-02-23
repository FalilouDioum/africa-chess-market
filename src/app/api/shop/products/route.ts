import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const categorie = searchParams.get("categorie");
  const search = searchParams.get("search");

  const filter: Record<string, unknown> = {};
  if (categorie) filter.categorie = categorie;
  if (search) {
    filter.$or = [
      { nom: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { codeArticle: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter).sort({ numero: 1 });
  return NextResponse.json(products);
}
