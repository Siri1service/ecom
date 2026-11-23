"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  const {
    items,
    appliedCoupon,
    selectedSubtotal,
    shippingFee,
    discountAmount,
    taxAmount,
    totalAmount,
    selectedCount,
    updateQuantity,
    removeFromCart,
    toggleSelect,
    toggleSelectAll,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const allSelected = items.length > 0 && items.every((i) => i.selected);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
    if (res.success) {
      setCouponCode("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          ตะกร้าสินค้าของท่าน ({items.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          เลือกรายการสินค้าที่ต้องการสั่งซื้อ และใช้คูปองส่วนลดเพื่อรับสิทธิพิเศษ
        </p>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            ยังไม่มีสินค้าในตะกร้า
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ท่านสามารถสำรวจรายการสินค้าที่มีคุณภาพของเรา และกดใส่ตะกร้าได้ตลอด 24 ชั่วโมง
          </p>
          <Link href="/products">
            <Button size="lg" className="rounded-xl mt-2">
              ไปที่หน้ารวมสินค้า
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items Table List (2 Cols) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
            {/* Header / Select All */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
                <span>เลือกทั้งหมด ({items.length} รายการ)</span>
              </label>
              <span>ราคาต่อหน่วย / ยอดรวม</span>
            </div>

            {/* Items */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4">
                  {/* Select Checkbox */}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                  />

                  {/* Thumbnail */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-indigo-600 truncate block"
                    >
                      {item.title}
                    </Link>
                    {item.variantName && (
                      <p className="text-[11px] text-slate-500">ตัวเลือก: {item.variantName}</p>
                    )}
                    <p className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</p>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center glass-panel rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                        title="ลบออกจากตะกร้า"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      @{formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary (1 Col) */}
          <div className="glass-panel rounded-3xl p-6 space-y-6 border border-white/50 dark:border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
              สรุปคำสั่งซื้อ
            </h3>

            {/* Coupon Application Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" /> โค้ดส่วนลด / คูปอง
              </label>
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="เช่น WELCOME100, FREESHIP"
                  className="text-xs uppercase"
                />
                <Button type="submit" size="sm" variant="secondary" className="flex-shrink-0">
                  ใช้โค้ด
                </Button>
              </div>

              {couponFeedback && (
                <div
                  className={`text-[11px] p-2 rounded-xl flex items-center gap-1.5 ${
                    couponFeedback.success
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                  }`}
                >
                  {couponFeedback.success ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{couponFeedback.message}</span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                  <span>คูปอง: {appliedCoupon.code}</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-500 text-[10px]"
                  >
                    ยกเลิก
                  </button>
                </div>
              )}
            </form>

            {/* Breakdown Calculations */}
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="flex justify-between">
                <span>ยอดรวมสินค้าที่เลือก ({selectedCount} ชิ้น)</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(selectedSubtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>ส่วนลดคูปอง</span>
                <span className="font-semibold text-rose-600">
                  -{formatCurrency(discountAmount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>ค่าจัดส่งพัสดุ</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {shippingFee === 0 ? "ฟรีค่าจัดส่ง" : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>ภาษีมูลค่าเพิ่ม (VAT 7% รวมในยอดสุทธิ)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                <span>ยอดชำระสุทธิ</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <Link
              href={selectedCount > 0 ? "/checkout" : "#"}
              className={`block w-full ${selectedCount === 0 ? "pointer-events-none opacity-50" : ""}`}
            >
              <Button
                size="lg"
                className="w-full rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                disabled={selectedCount === 0}
              >
                <span>ดำเนินการสั่งซื้อ ({selectedCount} ชิ้น)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>การคำนวณและสต็อกสินค้าตรวจสอบบนเซิร์ฟเวอร์แบบ Real-time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
