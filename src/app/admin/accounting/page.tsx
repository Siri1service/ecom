"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Plus,
  ArrowRight,
  Printer,
  FileCheck,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";
import {
  SAMPLE_ACCOUNTING_DOCS,
  AccountingDocument,
  DocType,
  generateDocNumber,
} from "@/lib/accounting/document-manager";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminAccountingPage() {
  const [docs, setDocs] = useState<AccountingDocument[]>(SAMPLE_ACCOUNTING_DOCS);
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredDocs = docs.filter(
    (d) => filterType === "ALL" || d.docType === filterType
  );

  // Cascading handler: QT -> BL -> INV -> RE
  const handleCascadeDocument = (sourceDoc: AccountingDocument) => {
    let nextType: DocType;
    if (sourceDoc.docType === "QT") nextType = "BL";
    else if (sourceDoc.docType === "BL") nextType = "INV";
    else if (sourceDoc.docType === "INV") nextType = "RE";
    else return;

    const nextDocNumber = generateDocNumber(nextType, docs.length + 1);

    const newDoc: AccountingDocument = {
      ...sourceDoc,
      id: `doc-${Date.now()}`,
      docType: nextType,
      docNumber: nextDocNumber,
      referenceDocNumber: sourceDoc.docNumber,
      status: "draft",
      issuedAt: new Date().toISOString().slice(0, 10),
      createdBy: "Admin Accounting",
    };

    setDocs((prev) => [newDoc, ...prev]);
    alert(`สร้างเอกสาร ${nextType} เลขที่ ${nextDocNumber} จาก ${sourceDoc.docNumber} เรียบร้อยแล้ว!`);
  };

  const getDocTypeThaiName = (type: DocType) => {
    switch (type) {
      case "QT": return "ใบเสนอราคา (Quotation)";
      case "BL": return "ใบวางบิล (Billing Note)";
      case "INV": return "ใบกำกับภาษี (Tax Invoice)";
      case "RE": return "ใบเสร็จรับเงิน (Receipt)";
      case "CA": return "ใบขายเงินสด (Cash Sale)";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                ระบบเอกสารบัญชีและภาษีไทย (Thai Tax Accounting System)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              รองรับการส่งต่อเอกสารอัตโนมัติ <strong>QT → BL → INV → RE</strong> พร้อมคำนวณ VAT 7% และตัวอักษรบาทไทย
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-xs">
          {["ALL", "QT", "BL", "INV", "RE", "CA"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterType === type
                  ? "bg-indigo-600 text-white shadow-md font-semibold"
                  : "glass-panel text-slate-700 dark:text-slate-300 hover:border-indigo-400"
              }`}
            >
              {type === "ALL" ? "เอกสารทั้งหมด" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="glass-panel rounded-3xl p-6 border border-white/50 dark:border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-slate-500">
              <th className="pb-3 font-semibold">ประเภท & เลขที่เอกสาร</th>
              <th className="pb-3 font-semibold">เอกสารอ้างอิง</th>
              <th className="pb-3 font-semibold">ลูกค้า / นิติบุคคล</th>
              <th className="pb-3 font-semibold">ยอดก่อน VAT</th>
              <th className="pb-3 font-semibold">VAT 7%</th>
              <th className="pb-3 font-semibold">ยอดสุทธิ</th>
              <th className="pb-3 font-semibold">สถานะ</th>
              <th className="pb-3 font-semibold text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-white/30 dark:hover:bg-slate-900/30">
                <td className="py-3">
                  <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {doc.docNumber}
                  </p>
                  <p className="text-[10px] text-slate-400">{getDocTypeThaiName(doc.docType)}</p>
                </td>
                <td className="py-3">
                  {doc.referenceDocNumber ? (
                    <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {doc.referenceDocNumber}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="py-3">
                  <p className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {doc.customer.name}
                  </p>
                  <p className="text-[10px] text-slate-400">{doc.issuedAt}</p>
                </td>
                <td className="py-3 font-mono text-slate-600 dark:text-slate-300">
                  {formatCurrency(doc.subtotal - doc.discount)}
                </td>
                <td className="py-3 font-mono text-slate-500">
                  {formatCurrency(doc.vatAmount)}
                </td>
                <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(doc.grandTotal)}
                </td>
                <td className="py-3">
                  <Badge variant={doc.status === "issued" ? "success" : "secondary"}>
                    {doc.status === "issued" ? "ออกเอกสารแล้ว" : "ร่างเอกสาร"}
                  </Badge>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Cascade Button */}
                    {doc.docType !== "RE" && doc.docType !== "CA" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCascadeDocument(doc)}
                        className="h-7 px-2 text-[10px] rounded-lg border-indigo-200"
                        title="แปลงเป็นเอกสารขั้นถัดไป"
                      >
                        <span>
                          {doc.docType === "QT" ? "→ BL" : doc.docType === "BL" ? "→ INV" : "→ RE"}
                        </span>
                      </Button>
                    )}

                    {/* Preview / Print A4 Link */}
                    <Link
                      href={`/accounting/documents/preview?docType=${doc.docType}&docNumber=${doc.docNumber}`}
                      target="_blank"
                    >
                      <Button size="sm" className="h-7 px-2 text-[10px] rounded-lg bg-indigo-600">
                        <Printer className="w-3 h-3 mr-1" />
                        <span>พิมพ์ A4</span>
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
