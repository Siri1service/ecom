"use client";

import React from "react";
import { Tag, Sparkles, Copy, CheckCircle, Percent } from "lucide-react";
import { ACTIVE_COUPONS } from "@/lib/catalog-data";
import { Button } from "@/components/ui/button";

export default function PromotionsPage() {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`คัดลอกโค้ด ${code} เรียบร้อยแล้ว สามารถนำไปใช้ในหน้าตะกร้าสินค้าได้ทันที!`);
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-3xl p-8 space-y-3 border border-white/50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Tag className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            โปรโมชั่นและโค้ดคูปองส่วนลดพิเศษ
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          รวมโค้ดส่วนลดและแคมเปญสุดคุ้มจาก Siam Commerce Hub ใช้งานง่าย ไม่มีเงื่อนไขซับซ้อน
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ACTIVE_COUPONS.map((coupon) => (
          <div
            key={coupon.id}
            className="glass-card rounded-2xl p-6 space-y-4 border border-dashed border-indigo-300 dark:border-indigo-800 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg">
                  {coupon.code}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> ใช้ได้ทันที
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {coupon.title}
              </h3>
              <p className="text-xs text-slate-500">
                ยอดซื้อขั้นต่ำ: {coupon.minSpend} บาท
                {coupon.maxDiscount ? ` (ลดสูงสุด ${coupon.maxDiscount} บ.)` : ""}
              </p>
            </div>

            <Button
              onClick={() => copyCode(coupon.code)}
              size="sm"
              className="w-full rounded-xl flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4" /> คัดลอกโค้ด
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
