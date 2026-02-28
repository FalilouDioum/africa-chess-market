import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  numero: number;
  nom: string;
  categorie: string;
  codeArticle: string;
  description: string;
  quantiteCommandee: number;
  quantiteEnStock: number;
  prixUnitaireUSD: number;
  totalUSD: number;
  prixCFA: number;
  prixVenteCFA: number;
  margeUnitaireCFA: number;
  numeroCommande: string;
  images: string[];
  fournisseur: string;
  promo: boolean;
  prixPromoCFA: number;
  statut: "en_commande" | "en_transit" | "en_stock" | "epuise";
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    numero: { type: Number, required: true },
    nom: { type: String, required: true },
    categorie: { type: String, required: true },
    codeArticle: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    quantiteCommandee: { type: Number, required: true, default: 0 },
    quantiteEnStock: { type: Number, default: 0 },
    prixUnitaireUSD: { type: Number, required: true },
    totalUSD: { type: Number, required: true },
    prixCFA: { type: Number, default: 0 },
    prixVenteCFA: { type: Number, default: 0 },
    margeUnitaireCFA: { type: Number, default: 0 },
    numeroCommande: { type: String, default: "" },
    images: [{ type: String }],
    fournisseur: { type: String, default: "CNCHESS CO.,LTD" },
    promo: { type: Boolean, default: false },
    prixPromoCFA: { type: Number, default: 0 },
    statut: {
      type: String,
      enum: ["en_commande", "en_transit", "en_stock", "epuise"],
      default: "en_commande",
    },
  },
  { timestamps: true }
);

// Calcul automatique de la marge
ProductSchema.pre("save", function () {
  if (this.prixVenteCFA && this.prixCFA) {
    this.margeUnitaireCFA = this.prixVenteCFA - this.prixCFA;
  }
  this.totalUSD = this.prixUnitaireUSD * this.quantiteCommandee;
});

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
