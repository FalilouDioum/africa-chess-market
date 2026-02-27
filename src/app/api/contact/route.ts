import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, telephone, message } = body;

    if (!nom || !message) {
      return NextResponse.json(
        { error: "Le nom et le message sont requis" },
        { status: 400 }
      );
    }

    await connectDB();
    await ContactMessage.create({
      nom: nom.trim(),
      telephone: (telephone || "").trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
