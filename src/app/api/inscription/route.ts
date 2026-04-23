import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TournamentRegistration from "@/models/TournamentRegistration";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, telephone, email, fideId, club, categorie, notes } = body;

    if (!nom || !telephone) {
      return NextResponse.json(
        { error: "Le nom et le téléphone sont requis" },
        { status: 400 }
      );
    }

    await connectDB();
    await TournamentRegistration.create({
      nom: nom.trim(),
      telephone: telephone.trim(),
      email: (email || "").trim(),
      fideId: (fideId || "").trim(),
      club: (club || "").trim(),
      categorie: (categorie || "Open").trim(),
      notes: (notes || "").trim(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Tournament registration API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
