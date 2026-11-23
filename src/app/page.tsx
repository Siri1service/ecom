"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Tag,
  ArrowRight,
  Truck,
  CreditCard,
  FileCheck,
} from "lucide-react";
import { SAMPLE_PRODUCTS, CATEGORIES_TREE, ACTIVE_COUPONS, BLOG_POSTS } from "@/lib/catalog-data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const featuredProducts = SAMPLE_PRODUCTS.filter((p) => p.isFeatured);

  return (
    <div className="space-y-12">
      {/* Hero Section with Glassmorphism */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 lg:p-16 border border-white/50 dark:border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <Badge variant="glass" className="py-1 px-3 text-xs sm:text-sm font-semibold gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
            <span>แพลตฟอร์ม E-Commerce & Affiliate ยุค 2026</span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            ช็อปสนุก ปลอดภัย <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              เชื่อมต่อทุกช่องทางแบบไร้รอยต่อ
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            สัมผัสประสบการณ์อีคอมเมิร์ซที่เหนือระดับ รองรับการชำระเงิน KBank QR พร้อมเพย์ 10 นาที
            ระบบเอกสารภาษีอัตโนมัติ (QT/BL/INV/RE) และโอกาสสร้างรายได้ผ่าน Affiliate
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/products">
              <Button size="lg" className="rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> สำรวจสินค้าทั้งหมด
              </Button>
            </Link>
            <Link href="/promotions">
              <Button variant="outline" size="lg" className="rounded-xl flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-500" /> ส่องโปรโมชั่นเด็ด
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">KBank QR 10 นาที</p>
              <p className="text-[11px] text-slate-500">เช็กยอดอัตโนมัติ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">จัดส่งรวดเร็ว</p>
              <p className="text-[11px] text-slate-500">พิมพ์ใบปะหน้าทันที</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">เอกสารภาษีไทย</p>
              <p className="text-[11px] text-slate-500">VAT 7% เต็มรูปแบบ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">สร้างรายได้ Affiliate</p>
              <p className="text-[11px] text-slate-500">คอมมิชชันโปร่งใส</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid (Hierarchical: Category -> Type -> Subtype) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">หมวดหมู่สินค้าหลัก</h2>
            <p className="text-xs text-slate-500">เลือกชมสินค้าตามหมวดหมู่ ประเภท และประเภทย่อย</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
            ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_TREE.map((category) => (
            <div key={category.id} className="glass-card rounded-2xl p-6 space-y-4 border border-white/40 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-14 h-14 rounded-xl object-cover shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{category.name}</h3>
                  <p className="text-xs text-slate-500">{category.types?.length || 0} ประเภทย่อย</p>
                </div>
              </div>

              {/* Sub-types chips */}
              <div className="flex flex-wrap gap-1.5">
                {category.types?.map((type) => (
                  <Link
                    key={type.id}
                    href={`/products?type=${type.slug}`}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors border border-slate-200/50 dark:border-slate-800"
                  >
                    {type.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">สินค้าแนะนำยอดนิยม</h2>
            <p className="text-xs text-slate-500">คัดสรรสินค้าคุณภาพ พร้อมส่งถึงบ้านคุณ</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
            ดูสินค้าทั้งหมด ({SAMPLE_PRODUCTS.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Active Coupons Banner */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-indigo-200/50 dark:border-indigo-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">คูปองส่วนลดพิเศษประจำวัน</h3>
          </div>
          <Link href="/coupons" className="text-xs font-semibold text-indigo-600 hover:underline">
            ดูคูปองทั้งหมด
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ACTIVE_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-dashed border-indigo-300 dark:border-indigo-800 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{coupon.code}</p>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{coupon.title}</p>
                <p className="text-[10px] text-slate-500">ขั้นต่ำ {coupon.minSpend} บาท</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coupon.code);
                  alert(`คัดลอกโค้ด ${coupon.code} สำเร็จ!`);
                }}
                className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                คัดลอก
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Blog & Knowledge Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">บทความและสาระน่ารู้</h2>
            <p className="text-xs text-slate-500">อัปเดตเทคโนโลยี ความปลอดภัย และเคล็ดลับการค้าออนไลน์</p>
          </div>
          <Link href="/blog" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
            อ่านทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="glass-card rounded-2xl overflow-hidden flex flex-col sm:flex-row border border-white/40 dark:border-slate-800">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full sm:w-48 h-48 object-cover"
              />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] text-indigo-600 font-semibold">{post.publishedAt} • {post.readTime}</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{post.excerpt}</p>
                </div>
                <Link href={`/blog/${post.slug}`} className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  อ่านต่อ <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
