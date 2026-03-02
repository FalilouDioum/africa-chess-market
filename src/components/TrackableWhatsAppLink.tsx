"use client";

import { sendEvent } from "@/components/AnalyticsTracker";

interface Props {
  href: string;
  productId: string;
  productName: string;
  category: string;
  children: React.ReactNode;
  className: string;
  title?: string;
}

export default function TrackableWhatsAppLink({ href, productId, productName, category, children, className, title }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={title}
      onClick={() => {
        sendEvent({
          type: "whatsapp_click",
          productId,
          productName,
          category,
        });
      }}
    >
      {children}
    </a>
  );
}
