import mongoose, { Schema, Document } from "mongoose";

export interface IAnalyticsEvent extends Document {
  type: "page_view" | "product_view" | "whatsapp_click" | "category_browse" | "search" | "contact_form";
  page: string;
  referrer: string;
  productId?: string;
  productName?: string;
  category?: string;
  searchQuery?: string;
  metadata?: Record<string, unknown>;
  sessionId: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: {
      type: String,
      required: true,
      enum: ["page_view", "product_view", "whatsapp_click", "category_browse", "search", "contact_form"],
      index: true,
    },
    page: { type: String, required: true },
    referrer: { type: String, default: "" },
    productId: { type: String },
    productName: { type: String },
    category: { type: String },
    searchQuery: { type: String },
    metadata: { type: Schema.Types.Mixed },
    sessionId: { type: String, required: true, index: true },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ createdAt: -1 });
AnalyticsEventSchema.index({ type: 1, createdAt: -1 });

export default mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);
