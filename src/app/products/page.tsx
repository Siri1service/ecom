"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { SAMPLE_PRODUCTS, CATEGORIES_TREE } from "@/lib/catalog-data";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc">("featured");

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchCategory =
        selectedCategory === "all" ||
        p.categorySlug === selectedCategory ||
        CATEGORIES_TREE.find((c) => c.slug === selectedCategory)?.types?.some(
          (t) => t.slug === p.categorySlug
        );

      return matchSearch && matchCategory;
    }).sort((a, b) => {
      if (sortBy === "price_asc") {
        return (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice);
      }
      if (sortBy === "price_desc") {
        return (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice);
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* Page Title & Search Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              แคตตาล็อกสินค้าทั้งหมด
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              พบสินค้า {filteredProducts.length} รายการ จากระบบจัดการสินค้า
            </p>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-3 w-full md:w-80">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="ค้นหาชื่อสินค้า, แท็ก..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "glass-panel text-slate-700 dark:text-slate-300 hover:border-indigo-400"
              }`}
            >
              ทั้งหมด
            </button>
            {CATEGORIES_TREE.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === c.slug
                    ? "bg-indigo-600 text-white shadow-md"
                    : "glass-panel text-slate-700 dark:text-slate-300 hover:border-indigo-400"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="glass-panel px-3 py-1.5 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="featured" className="text-slate-900">สินค้าแนะนำก่อน</option>
              <option value="price_asc" className="text-slate-900">ราคา: ต่ำไปสูง</option>
              <option value="price_desc" className="text-slate-900">ราคา: สูงไปต่ำ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
            ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
          </p>
          <p className="text-xs text-slate-500">
            ลองปรับเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น
          </p>
          <Button
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
          >
            ล้างตัวกรองทั้งหมด
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
