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

  const body = JSON.stringify(data);
  const blob = new Blob([body], { type: "application/json" });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", blob);
  } else {
    fetch("/api/analytics", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  }
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
