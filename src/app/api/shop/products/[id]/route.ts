import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    // Single aggregation: get product with imageCount, without images blob
    const results = await Product.aggregate([
      { $match: { _id: new (await import("mongoose")).Types.ObjectId(id) } },
      {
        $project: {
          images: 0,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { pid: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$pid"] } } },
            { $project: { count: { $cond: { if: { $isArray: "$images" }, then: { $size: "$images" }, else: 0 } } } },
          ],
          as: "imgInfo",
        },
      },
      {
        $addFields: {
          imageCount: { $ifNull: [{ $arrayElemAt: ["$imgInfo.count", 0] }, 0] },
        },
      },
      { $project: { imgInfo: 0 } },
    ]);

    if (!results.length) return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });

    return NextResponse.json(results[0], {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API /shop/products/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
