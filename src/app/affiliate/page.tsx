"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  DollarSign,
  Link as LinkIcon,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import { validateSafeRedirectUrl, CATEGORY_COMMISSION_RATES } from "@/lib/affiliate/affiliate-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AffiliateDashboardPage() {
  const { user } = useAuth();
  const [targetPath, setTargetPath] = useState("/products/siampro-16-ultra-max");
  const [generatedShortUrl, setGeneratedShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [validationWarning, setValidationWarning] = useState("");

  const affiliateCode = user?.affiliateCode || "SOMCHAI2026";
  const isApproved = user?.isAffiliateApproved ?? true;

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationWarning("");

    const validation = validateSafeRedirectUrl(targetPath);
    if (!validation.isSafe) {
      setValidationWarning("ตรวจพบ URL ภายนอกที่ไม่ปลอดภัย! ระบบอนุญาตเฉพาะลิงก์ภายในเว็บไซต์ Siam Commerce Hub เพื่อป้องกัน Phishing");
      return;
    }

    const host = typeof window !== "undefined" ? window.location.origin : "https://siamcommerce.co.th";
    const shortCode = Math.random().toString(36).substring(2, 7);
    const fullUrl = `${host}/s/${shortCode}?to=${encodeURIComponent(validation.safeUrl)}&ref=${affiliateCode}`;
    setGeneratedShortUrl(fullUrl);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg">
                รหัสตัวแทน: {affiliateCode}
              </span>
              <Badge variant={isApproved ? "success" : "warning"}>
                {isApproved ? "สิทธิ์ตัวแทน: อนุมัติแล้ว" : "รอผู้ดูแลระบบอนุมัติ"}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              แผงควบคุมตัวแทนการตลาด (Affiliate Dashboard)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              สร้างลิงก์แนะนำสินค้า ติดตามสถิติยอดคลิก คำสั่งซื้อ และค่าคอมมิชชันแบบ Real-time
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">บัญชีรับเงิน:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {user?.bankName || "KBANK"} (***{user?.bankAccountNumber?.slice(-4) || "4567"})
            </span>
          </div>
        </div>
      </div>

      {/* Analytics KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Clicks */}
        <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/40 dark:border-slate-800">
          <div className="flex items-center justify-between text-indigo-600">
            <MousePointerClick className="w-5 h-5" />
            <span className="text-[10px] font-semibold text-slate-400">30 วันล่าสุด</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">ยอดคลิกเข้าชม</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">1,248</p>
          </div>
        </div>

        {/* Orders Generated */}
        <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/40 dark:border-slate-800">
          <div className="flex items-center justify-between text-purple-600">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-semibold text-emerald-500 font-mono">CVR 3.8%</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">คำสั่งซื้อที่สำเร็จ</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">48</p>
          </div>
        </div>

        {/* Total Sales */}
        <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/40 dark:border-slate-800">
          <div className="flex items-center justify-between text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">ยอดขายรวม</p>
            <p className="text-lg font-black text-slate-900 dark:text-white truncate">
              {formatCurrency(142500)}
            </p>
          </div>
        </div>

        {/* Estimated Commission */}
        <div className="glass-card rounded-2xl p-4 space-y-2 border border-amber-500/30 bg-amber-50/10">
          <div className="flex items-center justify-between text-amber-600">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] text-amber-600 font-semibold">รอครบ 7 วัน</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">ยอดประมาณการ</p>
            <p className="text-lg font-black text-amber-600 truncate">
              {formatCurrency(2850)}
            </p>
          </div>
        </div>

        {/* Approved Commission */}
        <div className="glass-card rounded-2xl p-4 space-y-2 border border-emerald-500/30 bg-emerald-50/10">
          <div className="flex items-center justify-between text-emerald-600">
            <Check className="w-5 h-5" />
            <span className="text-[10px] text-emerald-600 font-semibold">พร้อมถอน</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">ยอดอนุมัติแล้ว</p>
            <p className="text-lg font-black text-emerald-600 truncate">
              {formatCurrency(8550)}
            </p>
          </div>
        </div>

        {/* Paid Payouts */}
        <div className="glass-card rounded-2xl p-4 space-y-2 border border-white/40 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500">
            <DollarSign className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">โอนจ่ายสะสม</p>
            <p className="text-lg font-black text-slate-900 dark:text-white truncate">
              {formatCurrency(24000)}
            </p>
          </div>
        </div>
      </div>

      {/* Link Generator Tool & Anti-Open Redirect Guard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/50 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              สร้างลิงก์ย่อสินค้า Affiliate ปลอดภัย (Safe Short Link Generator)
            </h2>
          </div>

          <form onSubmit={handleGenerateLink} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                ปลายทางหน้าสินค้า หรือ หมวดหมู่ในเว็บไซต์
              </label>
              <div className="flex gap-2 mt-1">
                <Input
                  required
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder="/products/your-product-slug"
                  className="text-xs"
                />
                <Button type="submit" size="sm" className="rounded-xl flex-shrink-0">
                  สร้างลิงก์ย่อ
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ตัวอย่าง: <code>/products/siampro-16-ultra-max</code> หรือ <code>/products?cat=fashion</code>
              </p>
            </div>

            {validationWarning && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationWarning}</span>
              </div>
            )}

            {generatedShortUrl && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                  ลิงก์ Affiliate ของคุณพร้อมใช้งาน:
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={generatedShortUrl}
                    className="bg-white dark:bg-slate-900 font-mono text-xs select-all"
                  />
                  <Button
                    type="button"
                    onClick={copyLink}
                    size="sm"
                    className="flex-shrink-0 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "คัดลอกแล้ว!" : "คัดลอก"}</span>
                  </Button>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>มีระบบป้องกัน Open Redirect ห้ามส่งต่อออกนอกโดเมนเด็ดขาด</span>
                </div>
              </div>
            )}
          </form>

          {/* Commission Tier Rates */}
          <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">
              อัตราค่าคอมมิชชันตามหมวดหมู่สินค้า
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {CATEGORY_COMMISSION_RATES.map((rule) => (
                <div
                  key={rule.categorySlug}
                  className="p-3 rounded-xl glass-panel border border-slate-200/60 dark:border-slate-800"
                >
                  <p className="text-[11px] text-slate-500 uppercase">{rule.categorySlug}</p>
                  <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {rule.ratePercent}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attribution Terms & Guidelines (1 Col) */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl text-xs h-fit">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              กติกาการนับยอด Attribution
            </h3>
          </div>

          <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
              <span><strong>อายุคุกกี้ 30 วัน:</strong> เมื่อลูกค้าคลิกลิงก์ ระบบจะจำรหัสตัวแทน 30 วัน</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
              <span><strong>Last-Click Attribution:</strong> ให้ผลตอบแทนแก่ลิงก์สุดท้ายที่ลูกค้าคลิกก่อนสั่งซื้อ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
              <span><strong>การกักยอด 7 วัน (Holding Period):</strong> ยอดจะแสดงเป็น "ประมาณการ" รอครบกำหนด 7 วันกรณีมีคืนสินค้า ก่อนเปลี่ยนเป็น "อนุมัติแล้ว"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
              <span><strong>การยกเลิกคำสั่งซื้อ:</strong> หากลูกค้าปฏิเสธการรับพัสดุ ยอดคอมมิชชันรายการนั้นจะถูกยกเลิกโดยอัตโนมัติ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0" />
              <span><strong>การตัดรอบจ่ายเงิน:</strong> โอนเข้าบัญชีธนาคารทุกวันที่ 5 และ 20 ของเดือน เมื่อยอดอนุมัติสะสมครบ 500 บาทขึ้นไป</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
