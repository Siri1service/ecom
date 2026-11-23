"use client";

import React, { Suspense, use } from "react";
import { Printer, ArrowLeft, Download, ShieldCheck } from "lucide-react";
import {
  SAMPLE_ACCOUNTING_DOCS,
  DocType,
  arabicToThaiBahtText,
  DEFAULT_COMPANY_PROFILE,
} from "@/lib/accounting/document-manager";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function DocumentPreviewContent({
  searchParams,
}: {
  searchParams: Promise<{ docType?: DocType; docNumber?: string }>;
}) {
  const { docType = "INV", docNumber = "INV2026110002" } = use(searchParams);

  const doc =
    SAMPLE_ACCOUNTING_DOCS.find((d) => d.docNumber === docNumber) ||
    SAMPLE_ACCOUNTING_DOCS[1];

  const handlePrint = () => {
    window.print();
  };

  const getDocTitle = (type: DocType) => {
    switch (type) {
      case "QT":
        return { th: "ใบเสนอราคา", en: "QUOTATION" };
      case "BL":
        return { th: "ใบวางบิล / ใบแจ้งหนี้", en: "BILLING NOTE / INVOICE" };
      case "INV":
        return { th: "ใบกำกับภาษี", en: "TAX INVOICE" };
      case "RE":
        return { th: "ใบเสร็จรับเงิน", en: "RECEIPT" };
      case "CA":
        return { th: "ใบเสร็จรับเงิน / ใบกำกับภาษีอย่างย่อ", en: "CASH SALE" };
    }
  };

  const title = getDocTitle(doc.docType);
  const taxableAmount = doc.subtotal - doc.discount;

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-2 sm:px-6 flex flex-col items-center">
      {/* Control Bar (Hidden when printing) */}
      <div className="w-full max-w-[210mm] mb-4 flex justify-between items-center no-print">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()}
          className="text-xs"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> ย้อนกลับ
        </Button>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handlePrint}
            className="text-xs bg-indigo-600 text-white flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-4 h-4" /> พิมพ์เอกสาร A4 (Print A4)
          </Button>
        </div>
      </div>

      {/* Standard Thai A4 Document (210mm x 297mm) */}
      <div className="a4-page w-[210mm] min-h-[297mm] bg-white text-slate-900 p-[15mm] shadow-2xl print:shadow-none border border-slate-200 print:border-none font-sans text-xs flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header: Company & Document Title */}
          <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900">
            {/* Company Details */}
            <div className="space-y-1 max-w-[120mm]">
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {DEFAULT_COMPANY_PROFILE.nameTh}
              </h2>
              <p className="text-[11px] font-semibold text-slate-600">
                {DEFAULT_COMPANY_PROFILE.nameEn}
              </p>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                {DEFAULT_COMPANY_PROFILE.address}
              </p>
              <p className="text-[10px] text-slate-700">
                <strong>เลขประจำตัวผู้เสียภาษีอากร:</strong>{" "}
                <span className="font-mono font-bold tracking-wider">
                  {DEFAULT_COMPANY_PROFILE.taxId}
                </span>{" "}
                ({DEFAULT_COMPANY_PROFILE.branch})
              </p>
              <p className="text-[10px] text-slate-600">
                โทร: {DEFAULT_COMPANY_PROFILE.phone} | อีเมล: {DEFAULT_COMPANY_PROFILE.email}
              </p>
            </div>

            {/* Title & Metadata Box */}
            <div className="text-right space-y-1.5">
              <div className="border-2 border-slate-900 px-3 py-1 rounded-lg text-center inline-block">
                <h1 className="text-sm font-black tracking-wide text-slate-900">
                  {title.th}
                </h1>
                <p className="text-[9px] font-bold tracking-widest text-slate-600">
                  {title.en}
                </p>
              </div>

              <div className="text-[10px] space-y-0.5 pt-1">
                <p>
                  <strong>เลขที่เอกสาร:</strong>{" "}
                  <span className="font-mono font-bold text-xs">{doc.docNumber}</span>
                </p>
                <p>
                  <strong>วันที่ออก:</strong> {doc.issuedAt}
                </p>
                {doc.referenceDocNumber && (
                  <p>
                    <strong>อ้างอิง:</strong>{" "}
                    <span className="font-mono">{doc.referenceDocNumber}</span>
                  </p>
                )}
                <p>
                  <strong>ผู้จัดทำ:</strong> {doc.createdBy}
                </p>
              </div>
            </div>
          </div>

          {/* Customer / Buyer Information Box */}
          <div className="p-3 rounded-lg border border-slate-300 bg-slate-50/50 text-[11px] space-y-1">
            <p className="font-bold uppercase text-[9px] text-slate-500">ข้อมูลผู้ซื้อ / ลูกค้า (CUSTOMER):</p>
            <div className="flex justify-between">
              <p className="font-bold text-xs">{doc.customer.name}</p>
              {doc.customer.taxId && (
                <p>
                  <strong>เลขประจำตัวผู้เสียภาษี:</strong>{" "}
                  <span className="font-mono">{doc.customer.taxId}</span>
                </p>
              )}
            </div>
            <p className="text-slate-600">{doc.customer.address}</p>
            <p className="text-slate-600">โทรศัพท์: {doc.customer.phone}</p>
          </div>

          {/* Items Table */}
          <table className="w-full text-left text-[11px] border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <th className="py-2 px-2 text-center w-10">ลำดับ</th>
                <th className="py-2 px-3">รายการสินค้า / รายละเอียด</th>
                <th className="py-2 px-2 text-center w-16">จำนวน</th>
                <th className="py-2 px-2 text-center w-16">หน่วย</th>
                <th className="py-2 px-2 text-right w-24">ราคาต่อหน่วย</th>
                <th className="py-2 px-3 text-right w-28">จำนวนเงิน (บาท)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {doc.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="py-2.5 px-2 text-center font-mono">{index + 1}</td>
                  <td className="py-2.5 px-3 font-medium">{item.title}</td>
                  <td className="py-2.5 px-2 text-center font-mono">{item.quantity}</td>
                  <td className="py-2.5 px-2 text-center">{item.unit}</td>
                  <td className="py-2.5 px-2 text-right font-mono">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations & Baht Text Summary */}
          <div className="flex justify-between items-start pt-2 gap-4">
            {/* Thai Baht Text Box */}
            <div className="flex-1 p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
              <p className="text-[10px] text-slate-500">จำนวนเงินตัวอักษร (BAHT TEXT):</p>
              <p className="font-bold text-xs text-indigo-900">
                ({arabicToThaiBahtText(doc.grandTotal)})
              </p>
              {doc.paymentMethod && (
                <p className="text-[10px] text-slate-600 pt-1">
                  <strong>วิธีชำระเงิน:</strong> {doc.paymentDetails || doc.paymentMethod}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="w-[75mm] text-[11px] space-y-1.5 border border-slate-300 p-3 rounded-lg">
              <div className="flex justify-between text-slate-600">
                <span>รวมเป็นเงิน (Subtotal):</span>
                <span className="font-mono">{formatCurrency(doc.subtotal)}</span>
              </div>
              {doc.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>หักส่วนลด (Discount):</span>
                  <span className="font-mono">-{formatCurrency(doc.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>มูลค่าก่อนภาษี (Taxable):</span>
                <span className="font-mono">{formatCurrency(taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                <span className="font-mono">{formatCurrency(doc.vatAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-slate-300">
                <span>ยอดเงินสุทธิ (Grand Total):</span>
                <span className="font-mono text-sm">{formatCurrency(doc.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signatures & Corporate Seal */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-[10px]">
          {/* Creator */}
          <div className="space-y-6">
            <p className="text-slate-500">ผู้จัดทำเอกสาร (Prepared By)</p>
            <div className="border-b border-slate-400 w-32 mx-auto" />
            <p>วันที่: {doc.issuedAt}</p>
          </div>

          {/* Authorized Signature & Corporate Seal */}
          <div className="space-y-6 relative">
            <p className="text-slate-500">ผู้มีอำนาจลงนาม / ตราประทับ (Authorized Signature)</p>
            {/* Corporate Seal Placeholder */}
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-rose-400/60 mx-auto flex items-center justify-center text-[9px] text-rose-500 font-bold -mb-4">
              ตราประทับ
            </div>
            <div className="border-b border-slate-400 w-36 mx-auto" />
            <p>วันที่: {doc.issuedAt}</p>
          </div>

          {/* Customer Receiver */}
          <div className="space-y-6">
            <p className="text-slate-500">ผู้รับเอกสาร / ผู้ซื้อ (Received By)</p>
            <div className="border-b border-slate-400 w-32 mx-auto" />
            <p>วันที่: ..... / ..... / .........</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentPreviewPage(props: {
  searchParams: Promise<{ docType?: DocType; docNumber?: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">กำลังโหลดเอกสารทางบัญชี...</div>}>
      <DocumentPreviewContent {...props} />
    </Suspense>
  );
}
