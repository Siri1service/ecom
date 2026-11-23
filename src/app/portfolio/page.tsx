"use client";

import React from "react";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { PORTFOLIO_ITEMS } from "@/lib/catalog-data";

export default function PortfolioPage() {
  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-3xl p-8 space-y-3 border border-white/50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            ผลงานและความสำเร็จ (Portfolio & Showcase)
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          ตัวอย่างความร่วมมือ การพัฒนาระบบคลังสินค้า การเชื่อมต่อ Payment Gateway และการจัดการโลจิสติกส์
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PORTFOLIO_ITEMS.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-3xl overflow-hidden border border-white/40 dark:border-slate-800 space-y-4"
          >
            <img src={item.imageUrl} alt={item.title} className="w-full h-56 object-cover" />
            <div className="p-6 pt-0 space-y-2">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                {item.category}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span>พาร์ทเนอร์: {item.client}</span>
                <span>{item.completedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
