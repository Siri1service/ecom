"use client";

import React, { useState, useEffect, Suspense, use } from "react";
import Link from "next/link";
import {
  QrCode,
  Clock,
  CheckCircle,
  Truck,
  Printer,
  FileText,
  AlertTriangle,
  Upload,
  ShieldCheck,
  Package,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function OrderStatusContent({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);

  const [order, setOrder] = useState<any>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(600); // 10 minutes (600s)
  const [isExpired, setIsExpired] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [isVerifyingSlip, setIsVerifyingSlip] = useState(false);
  const [slipStatusMessage, setSlipStatusMessage] = useState("");

  // Load Order
  useEffect(() => {
    fetch(`/api/orders/create?orderNumber=${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
          if (data.order.status === "paid" || data.order.payment?.status === "paid") {
            setIsPaid(true);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [orderNumber]);

  // 10-minute Countdown Timer strictly compliant with KBank QR Service
  useEffect(() => {
    if (isPaid) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaid]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSimulatePaymentSuccess = () => {
    setIsPaid(true);
    setOrder((prev: any) => ({
      ...prev,
      status: "paid",
      payment: { ...prev.payment, status: "paid" },
    }));
  };

  const handleUploadSlip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipFile) return;

    setIsVerifyingSlip(true);
    setSlipStatusMessage("กำลังตรวจสอบสลิปและรายการเดินบัญชีผ่านระบบ...");

    setTimeout(() => {
      setIsVerifyingSlip(false);
      setIsPaid(true);
      setSlipStatusMessage("ตรวจสอบสลิปเรียบร้อย! ยอดเงินตรงกับระบบ คำสั่งซื้อได้รับการยืนยันแล้ว");
      setOrder((prev: any) => ({
        ...prev,
        status: "paid",
        payment: { ...prev.payment, status: "paid", slipVerified: true },
      }));
    }, 2000);
  };

  if (!order) {
    return (
      <div className="glass-panel rounded-3xl p-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">กำลังโหลดข้อมูลคำสั่งซื้อ {orderNumber}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Status Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg">
                {order.orderNumber}
              </span>
              <Badge variant={isPaid ? "success" : isExpired ? "destructive" : "warning"}>
                {isPaid ? "ชำระเงินเรียบร้อยแล้ว" : isExpired ? "QR หมดอายุการใช้งาน" : "รอการชำระเงิน"}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              สถานะคำสั่งซื้อ & รายละเอียดการจัดส่ง
            </h1>
          </div>

          <div className="flex gap-2">
            <Link href={`/shipping/label?orderNumber=${order.orderNumber}`} target="_blank">
              <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-indigo-600" />
                <span>พิมพ์ใบปะหน้าพัสดุ</span>
              </Button>
            </Link>
            <Link href={`/accounting/documents/preview?docType=INV&orderNumber=${order.orderNumber}`} target="_blank">
              <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>ใบเสร็จ/ใบกำกับภาษี</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Step Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
          <div className={`p-3 rounded-2xl border ${isPaid ? "bg-emerald-50/50 border-emerald-500/30 text-emerald-700" : "bg-amber-50/50 border-amber-500/30 text-amber-700"}`}>
            <p className="font-bold">1. ชำระเงิน</p>
            <p className="text-[10px] opacity-80">{isPaid ? "สำเร็จ" : "กำลังดำเนินการ"}</p>
          </div>
          <div className={`p-3 rounded-2xl border ${isPaid ? "bg-indigo-50/50 border-indigo-500/30 text-indigo-700" : "opacity-40"}`}>
            <p className="font-bold">2. เตรียมสินค้า</p>
            <p className="text-[10px] opacity-80">คลังสินค้ากำลังแพ็ก</p>
          </div>
          <div className="p-3 rounded-2xl border opacity-40">
            <p className="font-bold">3. บริษัทขนส่งรับพัสดุ</p>
            <p className="text-[10px] opacity-80">{order.shippingCarrier}</p>
          </div>
          <div className="p-3 rounded-2xl border opacity-40">
            <p className="font-bold">4. จัดส่งสำเร็จ</p>
            <p className="text-[10px] opacity-80">รอผู้รับตรวจรับ</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment & QR Section (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {!isPaid ? (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/50 dark:border-slate-800 shadow-xl text-center">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  สแกนชำระผ่าน KBank QR Code (พร้อมเพย์)
                </h2>
                <p className="text-xs text-slate-500">
                  เปิดแอปพลิเคชันธนาคารใดก็ได้ และสแกน QR Code ด้านล่างเพื่อชำระเงิน
                </p>

                {/* 10-Minute Expiry Timer */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold ${
                  isExpired
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                }`}>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>
                    {isExpired
                      ? "QR Code หมดอายุ (เกิน 10 นาที)"
                      : `QR Code มีอายุคงเหลือ: ${formatTimer(timeLeftSeconds)} นาที`}
                  </span>
                </div>
              </div>

              {/* Scannable QR Code Image */}
              <div className="p-4 bg-white rounded-3xl shadow-lg inline-block mx-auto border-4 border-emerald-500/20">
                {order.payment?.qrCodeUrl ? (
                  <img
                    src={order.payment.qrCodeUrl}
                    alt="KBank PromptPay QR Code"
                    className="w-56 h-56 mx-auto"
                  />
                ) : (
                  <div className="w-56 h-56 bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-mono">
                    <QrCode className="w-32 h-32 text-emerald-600" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">ยอดเงินที่ต้องชำระ</p>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(order.totalAmount)}
                </p>
                <p className="text-[10px] text-slate-400">
                  อ้างอิง: {order.orderNumber} | Kasikornbank API Integration
                </p>
              </div>

              {/* Demo Action Button to simulate webhook trigger */}
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap justify-center gap-3">
                <Button
                  onClick={handleSimulatePaymentSuccess}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>จำลองการตรวจพบยอดชำระสำเร็จ (Webhook Trigger)</span>
                </Button>
              </div>

              {/* Slip Upload Alternative */}
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-left space-y-3">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  กรณีโอนผ่านบัญชี หรือต้องการแนบหลักฐานสลิป:
                </h3>
                <form onSubmit={handleUploadSlip} className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-950 dark:file:text-indigo-300"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!slipFile || isVerifyingSlip}
                    className="text-xs rounded-xl flex-shrink-0"
                  >
                    {isVerifyingSlip ? "กำลังตรวจสอบ..." : "ส่งสลิปเพื่อตรวจสอบ"}
                  </Button>
                </form>
                {slipStatusMessage && (
                  <p className="text-xs font-semibold text-emerald-600">{slipStatusMessage}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 space-y-4 border border-emerald-500/30 bg-emerald-50/20 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                การชำระเงินเสร็จสมบูรณ์เรียบร้อยแล้ว
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ขอบพระคุณสำหรับการสั่งซื้อ คำสั่งซื้อของท่านได้เข้าสู่กระบวนการเตรียมสินค้าในคลังเรียบร้อยแล้ว
              </p>
              <div className="p-4 rounded-2xl glass-panel inline-block text-left text-xs space-y-1">
                <p><strong>หมายเลขพัสดุ (Tracking Number):</strong> {order.trackingNumber}</p>
                <p><strong>ผู้ให้บริการขนส่ง:</strong> {order.shippingCarrier}</p>
                <p><strong>เวลาที่บันทึกชำระ:</strong> {formatDate(new Date())}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Items & Shipping Address (1 Col) */}
        <div className="glass-panel rounded-3xl p-6 space-y-6 border border-white/50 dark:border-slate-800 shadow-xl h-fit">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              ที่อยู่จัดส่งพัสดุ
            </h3>
            <div className="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p className="text-slate-500">{order.shippingAddress?.address}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              รายการสินค้า ({order.items?.length})
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto pr-1">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="py-2 flex justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400">{item.quantity} ชิ้น @{formatCurrency(item.unitPrice)}</p>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex justify-between">
              <span>ยอดรวมสินค้า</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>ส่วนลด</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>ค่าจัดส่ง</span>
              <span>{order.shippingFee === 0 ? "ส่งฟรี" : formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <span>ยอดสุทธิ</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderStatusPage(props: {
  params: Promise<{ orderNumber: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">กำลังโหลดคำสั่งซื้อ...</div>}>
      <OrderStatusContent {...props} />
    </Suspense>
  );
}
