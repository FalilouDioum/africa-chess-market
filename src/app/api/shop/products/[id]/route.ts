import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const product = await Product.findById(id);
  if (!product) return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
  return NextResponse.json(product);
}
