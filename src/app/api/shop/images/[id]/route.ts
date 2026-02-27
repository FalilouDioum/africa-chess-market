import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import sharp from "sharp";

// Whitelist of allowed widths to prevent arbitrary resize attacks
const ALLOWED_WIDTHS = [100, 300, 400, 800];

// In-memory LRU cache for processed images (avoids re-processing on every request)
const imageCache = new Map<string, { buffer: Buffer; contentType: string }>();
const MAX_CACHE_SIZE = 100;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idx = parseInt(req.nextUrl.searchParams.get("idx") || "0", 10);
    const rawWidth = parseInt(req.nextUrl.searchParams.get("w") || "0", 10);
    // Snap to nearest allowed width
    const width = ALLOWED_WIDTHS.includes(rawWidth) ? rawWidth : 0;

    // Check in-memory cache first
    const cacheKey = `${id}_${idx}_${width}`;
    const cached = imageCache.get(cacheKey);
    if (cached) {
      return new NextResponse(cached.buffer as unknown as BodyInit, {
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "CDN-Cache-Control": "public, max-age=31536000",
          "Vercel-CDN-Cache-Control": "public, max-age=31536000",
        },
      });
    }

    await connectDB();
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

    // Resize if width requested
    if (width > 0) {
      const quality = width <= 100 ? 70 : 80;
      finalBuf = Buffer.from(
        await sharp(raw)
          .resize(width, undefined, { withoutEnlargement: true })
          .jpeg({ quality, progressive: true })
          .toBuffer()
      );
      contentType = "image/jpeg";
    }

    // Store in memory cache (evict oldest if full)
    if (imageCache.size >= MAX_CACHE_SIZE) {
      const firstKey = imageCache.keys().next().value;
      if (firstKey) imageCache.delete(firstKey);
    }
    imageCache.set(cacheKey, { buffer: finalBuf, contentType });

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
