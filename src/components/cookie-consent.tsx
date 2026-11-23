"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consented = localStorage.getItem("siam_cookie_consent");
      if (!consented) {
        setShow(true);
      }
    } catch {
      // Ignore read error
    }
  }, []);

  const acceptAll = () => {
    try {
      localStorage.setItem("siam_cookie_consent", "all");
      // Set anonymous visitor ID for guest tracking without storing PII
      if (!localStorage.getItem("siam_anon_guest_id")) {
        localStorage.setItem(
          "siam_anon_guest_id",
          `anon_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        );
      }
    } catch {
      // Ignore write error
    }
    setShow(false);
  };

  const acceptNecessaryOnly = () => {
    try {
      localStorage.setItem("siam_cookie_consent", "necessary");
    } catch {
      // Ignore write error
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50 glass-panel rounded-3xl p-5 shadow-2xl border border-white/50 dark:border-slate-800 space-y-3 animate-slide-up no-print">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cookie className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
            นโยบายความเป็นส่วนตัวและการใช้คุกกี้ (PDPA)
          </h4>
        </div>
        <button
          onClick={acceptNecessaryOnly}
          className="text-slate-400 hover:text-slate-600 p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
        เราใช้คุกกี้เพื่อพัฒนาประสบการณ์การใช้งานและวิเคราะห์ความสนใจของท่านโดยใช้
        Anonymous Identifier ไม่มีการเปิดเผยข้อมูลส่วนบุคคลเกินความจำเป็นตามกฎหมาย PDPA
      </p>

      <div className="flex items-center justify-between gap-2 pt-1">
        <Link
          href="/privacy"
          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          อ่านนโยบายฉบับเต็ม
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={acceptNecessaryOnly}
            className="text-[11px] h-8 px-2.5 rounded-xl"
          >
            เฉพาะที่จำเป็น
          </Button>
          <Button
            size="sm"
            onClick={acceptAll}
            className="text-[11px] h-8 px-3 rounded-xl bg-indigo-600 text-white"
          >
            ยอมรับทั้งหมด
          </Button>
        </div>
      </div>
    </div>
  );
};
