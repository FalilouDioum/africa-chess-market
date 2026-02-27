import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://africachessmarket.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/boutique`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamic product pages
  try {
    await connectDB();
    const products = await Product.find({ statut: { $in: ["en_stock", "en_transit"] } })
      .select("_id updatedAt")
      .lean();

    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/boutique/${(p as { _id: { toString(): string }; updatedAt: Date })._id.toString()}`,
      lastModified: (p as { updatedAt: Date }).updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
