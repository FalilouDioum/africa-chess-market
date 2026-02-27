import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const idx = parseInt(req.nextUrl.searchParams.get("idx") || "0", 10);

    const product = await Product.findById(id).select("images").lean();
    if (!product) return new NextResponse("Not found", { status: 404 });

    const images = (product as Record<string, unknown>).images as string[] | undefined;
    if (!images || !images[idx]) return new NextResponse("No image", { status: 404 });

    const dataUrl = images[idx];
    // Parse data:image/jpeg;base64,xxxxx
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return new NextResponse("Invalid image", { status: 400 });

    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000",
        "Vercel-CDN-Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Image API error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
