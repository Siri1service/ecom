"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/catalog-data";

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-3xl p-8 space-y-3 border border-white/50 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            บทความและคลังความรู้ E-Commerce
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          อัปเดตเทรนด์การค้า นวัตกรรม AI กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) และระบบบัญชีภาษีไทย
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className="glass-card rounded-3xl overflow-hidden flex flex-col border border-white/40 dark:border-slate-800"
          >
            <img src={post.coverImage} alt={post.title} className="w-full h-56 object-cover" />
            <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[11px] text-indigo-600 font-semibold">
                  {post.publishedAt} • โดย {post.author} • {post.readTime}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{post.excerpt}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  อ่านบทความฉบับเต็ม <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
