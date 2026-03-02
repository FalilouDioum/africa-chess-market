import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await connectDB();

    // Simple pipeline: compute imageCount then strip images blob (no $lookup needed)
    const results = await Product.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $addFields: {
          imageCount: { $cond: { if: { $isArray: "$images" }, then: { $size: "$images" }, else: 0 } },
        },
      },
      { $project: { images: 0 } },
    ]);

    if (!results.length) return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });

    return NextResponse.json(results[0], {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("API /shop/products/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
