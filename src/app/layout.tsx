import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { NavigationHeader } from "@/components/navigation-header";
import { ContactWidget } from "@/components/contact-widget";
import { CookieConsent } from "@/components/cookie-consent";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Siam Commerce Hub - แพลตฟอร์ม E-Commerce & Affiliate ยุคใหม่",
  description: "ระบบจำหน่ายสินค้าออนไลน์ครบวงจร รองรับชำระเงิน KBank QR, บัญชีภาษีไทย, ระบบตัวแทน Affiliate และการเชื่อมต่อขนส่ง",
  keywords: ["e-commerce", "kbank qr", "affiliate", "ใบกำกับภาษี", "nextjs", "supabase"],
  openGraph: {
    title: "Siam Commerce Hub - E-Commerce Platform",
    description: "แพลตฟอร์ม E-Commerce ทรงพลัง ดีไซน์ Glassmorphism พร้อมระบบบัญชีและ Affiliate",
    type: "website",
    locale: "th_TH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Suspense fallback={<div className="h-16 w-full glass-nav" />}>
                <NavigationHeader />
              </Suspense>
              
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
              </main>

              <ContactWidget />
              <CookieConsent />

              {/* Glassmorphic Footer */}
              <footer className="w-full glass-panel border-t border-slate-200/50 dark:border-slate-800/50 mt-12 py-10 no-print">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-3">
                    <h5 className="font-bold text-base text-slate-900 dark:text-white">
                      Siam Commerce Hub
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      ระบบแพลตฟอร์มอีคอมเมิร์ซที่สอดคล้องกับมาตรฐานความปลอดภัย พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) และระบบภาษีของประเทศไทย
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h6 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      การนำทาง
                    </h6>
                    <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <li><Link href="/products" className="hover:text-indigo-600">สินค้าทั้งหมด</Link></li>
                      <li><Link href="/promotions" className="hover:text-indigo-600">โปรโมชั่นและส่วนลด</Link></li>
                      <li><Link href="/blog" className="hover:text-indigo-600">บทความและสาระน่ารู้</Link></li>
                      <li><Link href="/portfolio" className="hover:text-indigo-600">ผลงานและความสำเร็จ</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h6 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      ความร่วมมือ & Affiliate
                    </h6>
                    <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                      <li><Link href="/affiliate" className="hover:text-indigo-600">ระบบตัวแทนขาย Affiliate</Link></li>
                      <li><Link href="/admin/login" className="hover:text-indigo-600">เข้าสู่ระบบเจ้าหน้าที่ (Admin)</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h6 className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      รับประกันความปลอดภัย
                    </h6>
                    <p className="text-xs text-slate-500">
                      รองรับการชำระเงิน KBank QR Code 10 นาที ตรวจสอบความถูกต้องแบบอัตโนมัติ และบริการออกใบกำกับภาษีเต็มรูปแบบ
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>ระบบปฏิบัติการพร้อมใช้งาน 100%</span>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                  <p>© 2026 Siam Commerce Hub. สงวนลิขสิทธิ์ตามกฎหมาย</p>
                  <p>ขับเคลื่อนด้วย React, Next.js, Supabase, Tailwind CSS & Glassmorphic Design</p>
                </div>
              </footer>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
