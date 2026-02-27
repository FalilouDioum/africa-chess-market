import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import sharp from "sharp";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const idx = parseInt(req.nextUrl.searchParams.get("idx") || "0", 10);
    const width = parseInt(req.nextUrl.searchParams.get("w") || "0", 10);

    const product = await Product.findById(id).select("images").lean();
    if (!product) return new NextResponse("Not found", { status: 404 });

    const images = (product as Record<string, unknown>).images as string[] | undefined;
    if (!images || !images[idx]) return new NextResponse("No image", { status: 404 });

    const dataUrl = images[idx];
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return new NextResponse("Invalid image", { status: 400 });

    const raw = Buffer.from(match[2], "base64");
    let contentType = match[1];
    let finalBuf: Buffer = raw;

    // Resize if width requested (thumbnail for grid cards)
    if (width > 0 && width <= 800) {
      finalBuf = Buffer.from(
        await sharp(raw)
          .resize(width, undefined, { withoutEnlargement: true })
          .jpeg({ quality: 80, progressive: true })
          .toBuffer()
      );
      contentType = "image/jpeg";
    }

    return new NextResponse(finalBuf as unknown as BodyInit, {
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
