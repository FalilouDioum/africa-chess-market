import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TournamentRegistration from "@/models/TournamentRegistration";

// Limits
const MAX_LEN = {
  nom: 100,
  telephone: 25,
  email: 150,
  fideId: 30,
  club: 120,
  categorie: 30,
  notes: 1000,
};
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX_PER_IP = 3;
const MIN_FORM_TIME_MS = 2500; // form must stay open ≥ 2.5s
const DUP_WINDOW_MS = 2 * 60 * 1000; // reject same phone within 2 min
const VALID_CATEGORIES = ["Open", "Féminin", "Junior", "Senior"];

function getClientIP(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function isValidEmail(email: string): boolean {
  if (!email) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= MAX_LEN.email;
}

function isValidPhone(phone: string): boolean {
  // Digits, spaces, +, -, () — 6 to 25 chars
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^\+?[0-9]{6,20}$/.test(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nom,
      telephone,
      email,
      fideId,
      club,
      categorie,
      notes,
      _hp, // honeypot (must be empty)
      _ts, // client timestamp (form load)
    } = body;

    // ───── Layer 1: honeypot (bots fill hidden fields) ─────
    if (typeof _hp === "string" && _hp.length > 0) {
      // Silent success to bots — don't tell them why it failed
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // ───── Layer 2: min form-fill time (bots submit instantly) ─────
    if (typeof _ts === "number") {
      const elapsed = Date.now() - _ts;
      if (elapsed < MIN_FORM_TIME_MS) {
        return NextResponse.json({ success: true }, { status: 201 });
      }
    }

    // ───── Layer 3: required fields & types ─────
    if (typeof nom !== "string" || typeof telephone !== "string") {
      return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
    }
    const nomT = nom.trim();
    const telT = telephone.trim();
    if (nomT.length < 2 || nomT.length > MAX_LEN.nom) {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }
    if (!isValidPhone(telT)) {
      return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
    }

    // ───── Layer 4: optional field validation ─────
    const emailT = typeof email === "string" ? email.trim() : "";
    if (emailT && !isValidEmail(emailT)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    const fideT = typeof fideId === "string" ? fideId.trim().slice(0, MAX_LEN.fideId) : "";
    const clubT = typeof club === "string" ? club.trim().slice(0, MAX_LEN.club) : "";
    const notesT = typeof notes === "string" ? notes.trim().slice(0, MAX_LEN.notes) : "";
    const catT =
      typeof categorie === "string" && VALID_CATEGORIES.includes(categorie.trim())
        ? categorie.trim()
        : "Open";

    // ───── Layer 5: connect DB, rate limit, duplicate check ─────
    const ip = getClientIP(req);
    const ua = (req.headers.get("user-agent") || "").slice(0, 250);

    await connectDB();

    // Rate limit by IP
    if (ip !== "unknown") {
      const since = new Date(Date.now() - RATE_WINDOW_MS);
      const recentFromIP = await TournamentRegistration.countDocuments({
        ipAddress: ip,
        createdAt: { $gte: since },
      });
      if (recentFromIP >= RATE_MAX_PER_IP) {
        return NextResponse.json(
          { error: "Trop de tentatives. Merci de réessayer plus tard." },
          { status: 429 }
        );
      }
    }

    // Duplicate: same phone submitted very recently = probable double-click
    const dupSince = new Date(Date.now() - DUP_WINDOW_MS);
    const recentSamePhone = await TournamentRegistration.findOne({
      telephone: telT,
      createdAt: { $gte: dupSince },
    });
    if (recentSamePhone) {
      return NextResponse.json(
        { error: "Une inscription avec ce numéro vient d'être enregistrée." },
        { status: 409 }
      );
    }

    // ───── Persist ─────
    await TournamentRegistration.create({
      nom: nomT.slice(0, MAX_LEN.nom),
      telephone: telT.slice(0, MAX_LEN.telephone),
      email: emailT,
      fideId: fideT,
      club: clubT,
      categorie: catT,
      notes: notesT,
      ipAddress: ip.slice(0, 60),
      userAgent: ua,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Tournament registration API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
