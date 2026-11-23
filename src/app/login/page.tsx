"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function MemberLoginPage() {
  const router = useRouter();
  const { loginWithGoogle, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.push("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 space-y-6 border border-white/50 dark:border-slate-800 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mx-auto shadow-md">
          <User className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            เข้าสู่ระบบสมาชิก (Member Login)
          </h1>
          <p className="text-xs text-slate-500">
            เข้าสู่ระบบด้วยบัญชี Google เพื่อความสะดวกรวดเร็วและปลอดภัยสูงสุด
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2 text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            มาตรฐานการคุ้มครองข้อมูล (PDPA Compliant):
          </p>
          <ul className="list-disc pl-4 space-y-1 text-[11px]">
            <li>ใช้อีเมลทางการจากบัญชี Google เพื่อยืนยันตัวตน</li>
            <li>หากเข้าใช้งานครั้งแรก ระบบจะมีแบบฟอร์มกรอกข้อมูลที่อยู่และบัญชีรับเงินเพิ่มเติม</li>
            <li>Session ปลอดภัย และจะบังคับออกจากระบบเมื่อไม่มีกิจกรรมนานเกิน 2 เดือน</li>
          </ul>
        </div>

        <Button
          onClick={handleGoogleLogin}
          size="lg"
          disabled={isLoading}
          className="w-full rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-50 shadow-md flex items-center justify-center gap-3 cursor-pointer"
        >
          {/* Google Color G Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="font-semibold text-xs sm:text-sm">
            {isLoading ? "กำลังเชื่อมต่อ Google OAuth..." : "เข้าสู่ระบบด้วย Google"}
          </span>
        </Button>

        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <Link
            href="/admin/login"
            className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            เข้าสู่ระบบสำหรับเจ้าหน้าที่และผู้ดูแลระบบ (Admin) →
          </Link>
        </div>
      </div>
    </div>
  );
}
