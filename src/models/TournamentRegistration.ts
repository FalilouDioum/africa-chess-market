import mongoose, { Schema, Document } from "mongoose";

export interface ITournamentRegistration extends Document {
  nom: string;
  telephone: string;
  email: string;
  fideId: string;
  club: string;
  categorie: string;
  notes: string;
  traite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TournamentRegistrationSchema = new Schema<ITournamentRegistration>(
  {
    nom: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, default: "" },
    fideId: { type: String, default: "" },
    club: { type: String, default: "" },
    categorie: { type: String, default: "Open" },
    notes: { type: String, default: "" },
    traite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.TournamentRegistration ||
  mongoose.model<ITournamentRegistration>(
    "TournamentRegistration",
    TournamentRegistrationSchema
  );
