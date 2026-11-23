"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Eye, Star, Video } from "lucide-react";
import { Product } from "@/lib/catalog-data";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative border border-white/40 dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1">
      {/* Image Container with Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={product.featuredImageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <Badge variant="destructive" className="font-bold text-[11px] shadow-md">
              ลด {discountPercent}%
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="glass" className="text-[10px] font-semibold">
              ⭐ แนะนำ
            </Badge>
          )}
        </div>

        {/* Video duration tag if available */}
        {product.videoDurationSeconds && (
          <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
            <Video className="w-3 h-3 text-indigo-400" />
            <span>{product.videoDurationSeconds}s</span>
          </div>
        )}

        {/* Quick View Overlay Button */}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
        >
          <span className="px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-white flex items-center gap-1 shadow-lg backdrop-blur-md">
            <Eye className="w-3.5 h-3.5" /> ดูรายละเอียด
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
            {product.categoryName}
          </p>
          <Link
            href={`/products/${product.slug}`}
            className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 transition-colors"
          >
            {product.title}
          </Link>
        </div>

        {/* Price & Stock */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {formatCurrency(product.salePrice ?? product.basePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              คงเหลือ {product.stockQuantity} ชิ้น
            </p>
          </div>

          {/* Quick Add to Cart Button */}
          <button
            onClick={() => addToCart(product, product.variants[0])}
            className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer active:scale-95"
            title="ใส่ตะกร้า"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
