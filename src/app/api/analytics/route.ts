import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AnalyticsEvent from "@/models/AnalyticsEvent";

const VALID_TYPES = ["page_view", "product_view", "whatsapp_click", "category_browse", "search", "contact_form"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, page, referrer, productId, productName, category, searchQuery, metadata, sessionId, userAgent } = body;

    if (!type || !VALID_TYPES.includes(type) || !page || !sessionId) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    await connectDB();

    // MUST await on serverless — function terminates after response
    await AnalyticsEvent.create({
      type,
      page: page.substring(0, 500),
      referrer: (referrer || "").substring(0, 1000),
      productId,
      productName: productName?.substring(0, 200),
      category: category?.substring(0, 100),
      searchQuery: searchQuery?.substring(0, 200),
      metadata,
      sessionId,
      userAgent: (userAgent || "").substring(0, 500),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Analytics event error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
