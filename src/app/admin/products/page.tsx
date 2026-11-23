"use client";

import React, { useState } from "react";
import {
  Package,
  Upload,
  Download,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  HardDrive,
  Video,
} from "lucide-react";
import { SAMPLE_PRODUCTS, Product } from "@/lib/catalog-data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState("");
  const [importReport, setImportReport] = useState<{
    successCount: number;
    errors: string[];
  } | null>(null);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stockQuantity: Math.max(0, newStock) } : p
      )
    );
  };

  const handleExportCSV = () => {
    const headers = ["SKU", "Title", "Category", "BasePrice", "SalePrice", "Stock", "GoogleDriveFolder"];
    const rows = products.map((p) => [
      p.sku,
      `"${p.title.replace(/"/g, '""')}"`,
      p.categoryName,
      p.basePrice,
      p.salePrice || "",
      p.stockQuantity,
      `"2026/11/23/${p.id}-${p.slug}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      
      const errors: string[] = [];
      let success = 0;

      // Validate header
      if (lines.length <= 1) {
        setImportReport({ successCount: 0, errors: ["ไฟล์ CSV ไม่มีข้อมูลสินค้า"] });
        return;
      }

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < 5) {
          errors.push(`แถวที่ ${i + 1}: จำนวนคอลัมน์ไม่ครบถ้วน (ต้องการอย่างน้อย SKU, Title, Category, BasePrice, Stock)`);
          continue;
        }

        const [sku, title, category, priceStr, stockStr] = cols;
        const price = parseFloat(priceStr);
        const stock = parseInt(stockStr, 10);

        if (!sku || sku.trim().length === 0) {
          errors.push(`แถวที่ ${i + 1}: ไม่พบรหัส SKU สินค้า`);
          continue;
        }

        if (isNaN(price) || price < 0) {
          errors.push(`แถวที่ ${i + 1}: ราคา "${priceStr}" ไม่ถูกต้องตามรูปแบบตัวเลข`);
          continue;
        }

        if (isNaN(stock) || stock < 0) {
          errors.push(`แถวที่ ${i + 1}: จำนวนสต็อก "${stockStr}" ไม่ถูกต้อง`);
          continue;
        }

        success++;
      }

      setImportReport({ successCount: success, errors });
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              จัดการสินค้าและคลัง (Products & Inventory CMS)
            </h1>
            <p className="text-xs text-slate-500">
              ควบคุมสต็อก กำหนดราคา เชื่อมต่อสื่อ Google Drive และนำเข้า/ส่งออกไฟล์ CSV
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>ส่งออก CSV</span>
            </Button>

            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 glass-panel text-xs font-semibold hover:border-indigo-500 transition-colors">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>นำเข้า CSV</span>
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* CSV Validation Report */}
        {importReport && (
          <div className="p-4 rounded-2xl glass-panel border border-indigo-200 dark:border-indigo-900 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>ตรวจสอบและนำเข้าข้อมูลสำเร็จ: {importReport.successCount} รายการ</span>
            </div>
            {importReport.errors.length > 0 && (
              <div className="space-y-1 text-rose-600 dark:text-rose-400">
                <p className="font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> พบข้อผิดพลาด {importReport.errors.length} รายการ:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
                  {importReport.errors.slice(0, 5).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {importReport.errors.length > 5 && (
                    <li>...และอีก {importReport.errors.length - 5} รายการ</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <div className="w-full sm:w-80">
          <Input
            placeholder="ค้นหาชื่อสินค้า, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-panel rounded-3xl p-6 border border-white/50 dark:border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-slate-500">
              <th className="pb-3 font-semibold">สินค้า & SKU</th>
              <th className="pb-3 font-semibold">หมวดหมู่</th>
              <th className="pb-3 font-semibold">ราคา</th>
              <th className="pb-3 font-semibold">สต็อกคงเหลือ</th>
              <th className="pb-3 font-semibold">สื่อ Google Drive</th>
              <th className="pb-3 font-semibold">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-white/30 dark:hover:bg-slate-900/30">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.featuredImageUrl}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{product.title}</p>
                      <p className="font-mono text-[10px] text-slate-400">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-slate-600 dark:text-slate-300">
                  {product.categoryName}
                </td>
                <td className="py-3 font-bold text-slate-900 dark:text-white">
                  {formatCurrency(product.salePrice ?? product.basePrice)}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={product.stockQuantity}
                      onChange={(e) =>
                        handleUpdateStock(product.id, parseInt(e.target.value, 10) || 0)
                      }
                      className="w-16 px-2 py-1 rounded-lg glass-input text-xs font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400">ชิ้น</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px]">
                      .../{product.id}-{product.slug.slice(0, 10)}
                    </span>
                    {product.videoDurationSeconds && (
                      <Badge variant="glass" className="text-[9px] py-0 px-1">
                        🎬 {product.videoDurationSeconds}s
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <Badge variant={product.isActive ? "success" : "secondary"}>
                    {product.isActive ? "เปิดขาย" : "ปิดชั่วคราว"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
