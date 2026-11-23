"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  MessageSquare,
  Send,
  FileSpreadsheet,
  Database,
  Shield,
  ArrowLeft,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, switchDemoRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isSuperAdmin = role === "super_admin";
  const isAdmin = role === "admin" || isSuperAdmin;

  const adminNav = [
    { href: "/admin", label: "ภาพรวม & การเงิน", icon: LayoutDashboard },
    { href: "/admin/products", label: "สินค้า & สต็อก (CSV)", icon: Package },
    { href: "/admin/orders", label: "รายการคำสั่งซื้อ", icon: ShoppingBag },
    { href: "/admin/shipping", label: "ขนส่ง & ใบปะหน้า", icon: Truck },
    { href: "/admin/inbox", label: "หน้ารวมแชท (Unified Safe)", icon: MessageSquare },
    { href: "/admin/telegram", label: "Telegram Bot & Audit", icon: Send },
    { href: "/admin/accounting", label: "เอกสารบัญชี (QT-RE)", icon: FileSpreadsheet },
    ...(isSuperAdmin
      ? [{ href: "/admin/backup", label: "สำรอง & ย้ายระบบ", icon: Database }]
      : []),
  ];

  if (!isAdmin) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 my-12 border border-rose-300 dark:border-rose-900">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          ต้องใช้สิทธิ์ผู้ดูแลระบบ (Admin Access Required)
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          ท่านกำลังเข้าถึงในฐานะ "{role}" ซึ่งไม่มีสิทธิ์จัดการระบบหลังบ้าน
          กรุณาเข้าสู่ระบบด้วยบัญชี Admin หรือคลิกสลับสิทธิ์เพื่อทดสอบระบบ
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button
            size="sm"
            onClick={() => switchDemoRole("admin")}
            className="rounded-xl text-xs bg-indigo-600"
          >
            สลับเป็น Admin (จำลองสิทธิ์)
          </Button>
          <Button
            size="sm"
            onClick={() => switchDemoRole("super_admin")}
            className="rounded-xl text-xs bg-purple-600"
          >
            สลับเป็น Super Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 glass-panel rounded-3xl p-5 border border-white/50 dark:border-slate-800 shadow-xl space-y-4 flex-shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-white">ระบบจัดการหลังบ้าน</p>
              <p className="text-[10px] text-slate-400 font-mono">
                {isSuperAdmin ? "Super Admin" : "Department Admin"}
              </p>
            </div>
          </div>
          <Link href="/" className="text-slate-400 hover:text-indigo-600 p-1" title="กลับหน้าร้าน">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <nav className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Admin Working Area */}
      <div className="flex-1 min-w-0 w-full">{children}</div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">กำลังโหลดส่วนผู้ดูแลระบบ...</div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
