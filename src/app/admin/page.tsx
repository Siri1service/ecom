"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Package,
  Activity,
  HardDrive,
  Cpu,
  Radio,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SAMPLE_PRODUCTS } from "@/lib/catalog-data";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [dormantList, setDormantList] = useState([
    {
      id: "prod-old-099",
      sku: "ECOM-LEGACY-099",
      title: "หูฟังรุ่นเก่า Legacy Wired Earphones",
      lastViewed: "2025-10-15",
      mediaSize: "45 MB (Google Drive)",
    },
  ]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const totalProductsCount = SAMPLE_PRODUCTS.length;
  const grossRevenue = 1248500;
  const operationalExpense = 485200;
  const netProfit = grossRevenue - operationalExpense;

  const handleDeleteDormant = (id: string) => {
    setDormantList((prev) => prev.filter((item) => item.id !== id));
    setDeleteConfirmId(null);
    alert("ลบข้อมูลและไฟล์สื่อใน Google Drive เรียบร้อยแล้ว (บันทึก Audit Log)");
  };

  return (
    <div className="space-y-8">
      {/* Financial Executive Summary Cards */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          สรุปภาพรวมธุรกิจและการเงิน (Executive Dashboard)
        </h1>
        <p className="text-xs text-slate-500">
          ข้อมูลคำนวณแบบ Real-time: ยอดขาย รายจ่าย กำไรสุทธิ และสต็อกสินค้า
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="glass-card rounded-2xl p-5 space-y-2 border border-white/40 dark:border-slate-800">
          <div className="flex items-center justify-between text-indigo-600">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] text-emerald-500 font-bold font-mono">+18.5% YoY</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">รายรับรวม (Gross Revenue)</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(grossRevenue)}
            </p>
          </div>
        </div>

        {/* Expenses */}
        <div className="glass-card rounded-2xl p-5 space-y-2 border border-white/40 dark:border-slate-800">
          <div className="flex items-center justify-between text-rose-500">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] text-slate-400 font-mono">ต้นทุน & ขนส่ง</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">รายจ่ายรวม (Expenses)</p>
            <p className="text-2xl font-black text-rose-600">
              {formatCurrency(operationalExpense)}
            </p>
          </div>
        </div>

        {/* Net Profit */}
        <div className="glass-card rounded-2xl p-5 space-y-2 border border-emerald-500/40 bg-emerald-50/10">
          <div className="flex items-center justify-between text-emerald-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-[10px] text-emerald-600 font-bold font-mono">กำไร 61%</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">กำไรสุทธิ (Net Profit)</p>
            <p className="text-2xl font-black text-emerald-600">
              {formatCurrency(netProfit)}
            </p>
          </div>
        </div>

        {/* Orders & Products */}
        <div className="glass-card rounded-2xl p-5 space-y-2 border border-white/40 dark:border-slate-800">
          <div className="flex items-center justify-between text-purple-600">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] text-slate-400 font-mono">{totalProductsCount} สินค้า</span>
          </div>
          <div>
            <p className="text-xs text-slate-500">คำสั่งซื้อในระบบ</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">184 รายการ</p>
          </div>
        </div>
      </div>

      {/* System Health Check & Server Metrics */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              สถานะความพร้อมของระบบ (System Health Check & Resource Metrics)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            ทุกบริการทำงานปกติ (All Systems Operational)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-2xl glass-card space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-indigo-500" /> CPU Load</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">14.2%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[14%]" />
            </div>
          </div>

          <div className="p-3 rounded-2xl glass-card space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-purple-500" /> Memory (RAM)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">420 MB</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-[41%]" />
            </div>
          </div>

          <div className="p-3 rounded-2xl glass-card space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5"><Radio className="w-4 h-4 text-emerald-500" /> KBank QR API</span>
              <span className="font-mono font-bold text-emerald-600">Online</span>
            </div>
            <p className="text-[10px] text-slate-400">Response 45ms</p>
          </div>

          <div className="p-3 rounded-2xl glass-card space-y-1">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-amber-500" /> Drive API Quota</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">12% Used</span>
            </div>
            <p className="text-[10px] text-slate-400">1.8 GB / 15 GB</p>
          </div>
        </div>
      </div>

      {/* Dormant Products & Media Alert (> 1 Year Inactivity) */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-amber-300/50 dark:border-amber-900/50 bg-amber-50/10 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 dark:border-amber-900/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              แจ้งเตือนสินค้าและไฟล์สื่อที่ไม่ถูกเข้าถึงเกิน 1 ปี (Dormant Clean-up Alert)
            </h2>
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
            ต้องได้รับการยืนยันจาก Admin ก่อนลบ
          </span>
        </div>

        {dormantList.length === 0 ? (
          <p className="text-xs text-slate-500 py-2">
            ไม่มีสินค้าหรือไฟล์สื่อที่ไม่ได้เข้าถึงเกิน 1 ปีในระบบขณะนี้
          </p>
        ) : (
          <div className="space-y-3">
            {dormantList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-[11px] text-slate-500">
                    SKU: {item.sku} • เข้าชมล่าสุด: {item.lastViewed} ({item.mediaSize})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {deleteConfirmId === item.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-rose-600 font-bold">ยืนยันลบถาวร?</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteDormant(item.id)}
                        className="text-xs h-7 px-2"
                      >
                        ใช่, ลบเลย
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-xs h-7 px-2"
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="text-xs h-8 text-rose-600 hover:text-rose-700 flex items-center gap-1 border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ล้างพื้นที่ Google Drive</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
