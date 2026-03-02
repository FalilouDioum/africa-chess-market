"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("acm_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("acm_sid", id);
  }
  return id;
}

type EventPayload = {
  type: "page_view" | "product_view" | "whatsapp_click" | "category_browse" | "search" | "contact_form";
  page?: string;
  productId?: string;
  productName?: string;
  category?: string;
  searchQuery?: string;
  metadata?: Record<string, unknown>;
};

export function sendEvent(payload: EventPayload) {
  const sessionId = getSessionId();
  if (!sessionId) return;

  const data = {
    ...payload,
    page: payload.page || window.location.pathname,
    referrer: document.referrer,
    sessionId,
    userAgent: navigator.userAgent,
  };

  // Use fetch with keepalive as primary — more reliable than sendBeacon for JSON
  fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef("");

  useEffect(() => {
    if (pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;
    sendEvent({ type: "page_view", page: pathname });
  }, [pathname]);

  return null;
}
