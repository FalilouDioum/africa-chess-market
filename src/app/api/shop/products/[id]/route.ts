import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });

    const p = product as Record<string, unknown>;
    const images = p.images as string[] | undefined;
    const imageCount = images?.length || 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images: _imgs, ...rest } = p;
    return NextResponse.json({ ...rest, imageCount });
  } catch (error) {
    console.error("API /shop/products/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
