"use client";

import React, { Suspense, use } from "react";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function ShippingLabelContent({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber = "ORD2026110001" } = use(searchParams);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 flex flex-col items-center">
      {/* Top Controls (Hidden in Print) */}
      <div className="w-full max-w-[100mm] sm:max-w-[150mm] mb-4 flex justify-between items-center no-print">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
          className="text-xs"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
        </Button>
        <Button
          size="sm"
          onClick={handlePrint}
          className="text-xs bg-indigo-600 text-white flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" /> พิมพ์ใบปะหน้าพัสดุ (A4 / Thermal 100x150mm)
        </Button>
      </div>

      {/* Standard Shipping Label (100mm x 150mm) */}
      <div className="w-[100mm] min-h-[145mm] bg-white text-black p-4 border-2 border-black rounded-lg shadow-xl print:shadow-none print:border-black font-sans text-xs flex flex-col justify-between">
        {/* Header Carrier */}
        <div className="border-b-2 border-black pb-2 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black tracking-wider">FLASH EXPRESS</h2>
            <p className="text-[10px] font-bold">NEXT DAY DELIVERY</p>
          </div>
          <div className="text-right">
            <span className="text-lg font-black font-mono border-2 border-black px-2 py-0.5 rounded">
              BKK-01
            </span>
          </div>
        </div>

        {/* Tracking Barcode & Number */}
        <div className="py-3 text-center border-b-2 border-black">
          {/* Simulated 1D Barcode Pattern */}
          <div className="h-12 w-64 mx-auto flex items-end justify-center gap-1 overflow-hidden">
            {[4, 2, 5, 1, 3, 6, 2, 4, 1, 5, 3, 2, 4, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 4, 1, 3, 6, 2, 4].map((h, i) => (
              <div
                key={i}
                className="bg-black"
                style={{
                  width: i % 3 === 0 ? "3px" : "1.5px",
                  height: "100%",
                }}
              />
            ))}
          </div>
          <p className="font-mono font-bold text-sm mt-1 tracking-widest">
            TH88921473EXP
          </p>
          <p className="text-[9px] text-slate-600">คำสั่งซื้อ: {orderNumber}</p>
        </div>

        {/* Sender & Receiver Info */}
        <div className="py-2 space-y-3 border-b-2 border-black text-[11px] leading-tight">
          {/* Receiver */}
          <div>
            <p className="font-bold uppercase text-[9px] text-slate-500">ผู้รับ (RECEIVER):</p>
            <p className="font-extrabold text-sm">คุณสมชาย ใจดีพร้อม</p>
            <p className="font-bold">โทร: 081-234-5678</p>
            <p className="text-slate-700">
              123/45 ถนนพระราม 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330
            </p>
            <p className="font-mono font-black text-base text-right mt-1">10330</p>
          </div>

          {/* Sender */}
          <div className="pt-2 border-t border-dashed border-slate-400">
            <p className="font-bold uppercase text-[9px] text-slate-500">ผู้ส่ง (SENDER):</p>
            <p className="font-bold">Siam Commerce Hub (ศูนย์กระจายสินค้าสยาม)</p>
            <p>โทร: 02-123-4567</p>
            <p className="text-slate-600">อาคารสยามทาวเวอร์ ชั้น 24 เขตปทุมวัน กทม. 10330</p>
          </div>
        </div>

        {/* Package Contents & COD details */}
        <div className="pt-2 flex justify-between items-center text-[10px]">
          <div>
            <p><strong>สินค้า:</strong> หูฟัง AeroTune ANC Wireless (1 ชิ้น)</p>
            <p><strong>น้ำหนัก:</strong> 0.65 kg</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-black border border-black px-1.5 py-0.5 rounded">
              ชำระแล้ว (PAID)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShippingLabelPage(props: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">กำลังโหลดใบปะหน้าพัสดุ...</div>}>
      <ShippingLabelContent {...props} />
    </Suspense>
  );
}
