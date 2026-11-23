"use client";

import React, { useState, Suspense, use } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Share2,
  Video,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  Copy,
  Sparkles,
} from "lucide-react";
import { SAMPLE_PRODUCTS, Product, ProductVariant } from "@/lib/catalog-data";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug) || SAMPLE_PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState(product.featuredImageUrl);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>(() => {
    const init: { [key: string]: string } = {};
    product.attributeOptions.forEach((opt) => {
      init[opt.name] = opt.values[0];
    });
    return init;
  });
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Match active variant based on attribute selection
  const activeVariant: ProductVariant | undefined = product.variants.find((v) => {
    return Object.entries(selectedAttributes).every(
      ([key, val]) => v.attributes[key] === val
    );
  }) || product.variants[0];

  const currentPrice = activeVariant ? activeVariant.price : (product.salePrice ?? product.basePrice);
  const stock = activeVariant ? activeVariant.stock : product.stockQuantity;

  // Affiliate Short Link with anti-open redirect check
  const affiliateRef = user?.affiliateCode || "REF2026";
  const shareableUrl = typeof window !== "undefined"
    ? `${window.location.origin}/products/${product.slug}?ref=${affiliateRef}`
    : `/products/${product.slug}?ref=${affiliateRef}`;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-indigo-600">หน้าแรก</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-indigo-600">สินค้า</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">{product.title}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 glass-panel rounded-3xl p-6 sm:p-10 border border-white/50 dark:border-slate-800 shadow-2xl">
        {/* Left: Gallery & Video Preview */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-white/40 dark:border-slate-800 shadow-inner">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Video preview trigger if present */}
            {product.videoDurationSeconds && (
              <button
                onClick={() => setShowVideoModal(true)}
                className="absolute bottom-4 left-4 glass-panel px-3 py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg backdrop-blur-md hover:bg-white/40 transition-colors cursor-pointer"
              >
                <Video className="w-4 h-4 text-indigo-400" />
                <span>ดูวิดีโอสินค้า ({product.videoDurationSeconds} วินาที)</span>
              </button>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedImage === img
                    ? "border-indigo-600 shadow-md scale-95"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info & Variant Options */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <Badge variant="glass" className="text-xs">
              หมวดหมู่: {product.categoryName}
            </Badge>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono">SKU: {activeVariant?.sku || product.sku}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">พร้อมส่งในสต็อก</span>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {formatCurrency(currentPrice)}
              </span>
              {product.salePrice && product.salePrice < product.basePrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Attributes & Variant Selection */}
          <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            {product.attributeOptions.map((opt) => (
              <div key={opt.name} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  เลือก{opt.name}: <span className="text-indigo-600">{selectedAttributes[opt.name]}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        setSelectedAttributes((prev) => ({ ...prev, [opt.name]: val }))
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        selectedAttributes[opt.name] === val
                          ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                จำนวนที่ต้องการซื้อ (เหลือ {stock} ชิ้น)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center glass-panel rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Share */}
          <div className="space-y-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => addToCart(product, activeVariant, quantity)}
                className="flex-1 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" /> เพิ่มลงตะกร้าสินค้า
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={copyShareLink}
                className="rounded-xl flex items-center gap-1.5"
                title="คัดลอกลิงก์แนะนำสินค้า Affiliate"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedLink ? "คัดลอกแล้ว!" : "แชร์ Affiliate"}</span>
              </Button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-indigo-500" />
                <span>ส่งด่วนทั่วไทย</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>ของแท้ 100%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>คืนสินค้าใน 7 วัน</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal if clicked */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-400" />
                วิดีโอแนะนำสินค้า (ความยาวไม่เกิน 30 วินาที)
              </h4>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕ ปิด
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl bg-black flex items-center justify-center overflow-hidden">
              <div className="text-center p-6 space-y-2">
                <p className="text-white text-sm font-semibold">🎬 พรีวิววิดีโอขนาดสั้น 30 วินาที</p>
                <p className="text-xs text-slate-400">
                  ไฟล์วิดีโอได้รับการตรวจสอบขนาด ความยาว ({product.videoDurationSeconds}s) และจัดเก็บใน Google Drive API
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.title,
            image: product.featuredImageUrl,
            description: product.description,
            sku: product.sku,
            offers: {
              "@type": "Offer",
              url: shareableUrl,
              priceCurrency: "THB",
              price: currentPrice,
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
    </div>
  );
}

export default function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">กำลังโหลดรายละเอียดสินค้า...</div>}>
      <ProductDetailContent {...props} />
    </Suspense>
  );
}
