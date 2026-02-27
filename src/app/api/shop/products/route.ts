import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
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

    const products = await Product.find(filter).select("-images").sort({ numero: 1 }).lean();

    // Add imageCount by querying just the images array length
    const productIds = products.map((p) => p._id);
    const imageCounts = await Product.find({ _id: { $in: productIds } }).select("images").lean();
    const countMap = new Map(
      imageCounts.map((p) => [
        String(p._id),
        ((p as Record<string, unknown>).images as string[] | undefined)?.length || 0,
      ])
    );

    const result = products.map((p) => ({
      ...p,
      imageCount: countMap.get(String(p._id)) || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("API /shop/products error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
