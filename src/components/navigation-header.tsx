"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Sliders,
  User,
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth, UserRole } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { ThemeCustomizerDialog } from "@/components/theme-customizer-dialog";

export const NavigationHeader: React.FC = () => {
  const pathname = usePathname();
  const { config, updateConfig } = useTheme();
  const { user, role, switchDemoRole, logout } = useAuth();
  const { selectedCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "หน้าแรก" },
    { href: "/products", label: "สินค้า" },
    { href: "/promotions", label: "โปรโมชั่น" },
    { href: "/coupons", label: "คูปอง" },
    { href: "/blog", label: "Blog" },
    { href: "/portfolio", label: "ผลงาน" },
    { href: "/contact", label: "ติดต่อ" },
  ];

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchDemoRole(e.target.value as UserRole);
  };

  const toggleThemeMode = () => {
    updateConfig({ mode: config.mode === "dark" ? "light" : "dark" });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-md no-print transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-indigo-600/90 text-white text-xs py-1.5 px-4 text-center font-medium backdrop-blur-sm flex justify-between items-center">
          <span className="hidden sm:inline">🚀 ยินดีต้อนรับสู่ {config.workspaceName} - รับส่วนลดต้อนรับสมาชิกใหม่ใส่โค้ด WELCOME100</span>
          <span className="sm:hidden">โค้ดส่วนลดใหม่ WELCOME100</span>
          
          {/* Quick Role Switcher for instant testing */}
          <div className="flex items-center gap-1.5 text-[11px] bg-black/20 px-2 py-0.5 rounded-full">
            <span className="opacity-80">สลับสิทธิ์:</span>
            <select
              value={role}
              onChange={handleRoleSelect}
              className="bg-transparent text-white font-semibold cursor-pointer outline-none"
            >
              <option value="guest" className="text-slate-900">Guest (ผู้เยี่ยมชม)</option>
              <option value="member" className="text-slate-900">Member (สมาชิก)</option>
              <option value="admin" className="text-slate-900">Admin (ผู้ดูแลระบบ)</option>
              <option value="super_admin" className="text-slate-900">Super Admin (ผู้ดูแลสูงสุด)</option>
            </select>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Workspace Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                {config.workspaceName}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                E-Commerce Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search Box */}
          <div className="hidden lg:flex items-center relative w-64">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาสินค้า / หมวดหมู่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Customizer Trigger */}
            <button
              onClick={() => setThemeModalOpen(true)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-md transition-colors"
              title="ปรับแต่งธีม กระจก และพื้นหลัง"
            >
              <Sliders className="w-5 h-5 text-indigo-500" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleThemeMode}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-md transition-colors"
              title="สลับโหมดมืด/สว่าง"
            >
              {config.mode === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Cart Link with Badge */}
            <Link
              href="/cart"
              className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-md transition-colors"
              title="ตะกร้าสินค้า"
            >
              <ShoppingBag className="w-5 h-5" />
              {selectedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {selectedCount}
                </span>
              )}
            </Link>

            {/* Auth / Profile Link */}
            {role === "admin" || role === "super_admin" ? (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow hover:opacity-90 transition-opacity"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">ระบบหลังบ้าน</span>
              </Link>
            ) : user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold text-slate-900 dark:text-white hover:border-indigo-400 transition-colors"
                >
                  <User className="w-4 h-4 text-indigo-500" />
                  <span className="hidden sm:inline">{user.firstName || "ข้อมูลสมาชิก"}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-slate-200/50 dark:border-slate-800/50 px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {link.label}
              </Link>
            ))}
            {(role === "admin" || role === "super_admin") && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
              >
                🛡️ จัดการระบบหลังบ้าน
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Theme & Glassmorphism Customizer Modal */}
      <ThemeCustomizerDialog
        open={themeModalOpen}
        onClose={() => setThemeModalOpen(false)}
      />
    </>
  );
};
