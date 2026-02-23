import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error("API /shop/products/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
