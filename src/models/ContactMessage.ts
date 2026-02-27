import mongoose, { Schema, Document } from "mongoose";

export interface IContactMessage extends Document {
  nom: string;
  telephone: string;
  message: string;
  lu: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    nom: { type: String, required: true },
    telephone: { type: String, default: "" },
    message: { type: String, required: true },
    lu: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
