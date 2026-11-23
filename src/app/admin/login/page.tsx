"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAsAdmin } = useAuth();
  const [email, setEmail] = useState("admin@siamcommerce.co.th");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await loginAsAdmin(password, email);
      if (success) {
        router.push("/admin");
      } else {
        setError("รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง (ทดสอบ: admin1234 หรือ superadmin1234)");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 space-y-6 border border-white/50 dark:border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            เข้าสู่ระบบผู้ดูแลระบบ (Admin Login)
          </h1>
          <p className="text-xs text-slate-500">
            เฉพาะเจ้าหน้าที่ที่ได้รับการสร้างบัญชีจาก Super Admin เท่านั้น
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              อีเมลผู้ดูแลระบบ (Admin Email)
            </label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@siamcommerce.co.th"
                className="pl-9 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              รหัสผ่าน (Password)
            </label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ระบุรหัสผ่านผู้ดูแลระบบ"
                className="pl-9 text-xs"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              รหัสทดสอบ: <code>admin1234</code> หรือ <code>superadmin1234</code>
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            {isLoading ? <span>กำลังตรวจสอบ...</span> : (
              <>
                <span>เข้าสู่ระบบหลังบ้าน</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <Link href="/login" className="text-xs text-indigo-600 hover:underline">
            ← เข้าสู่ระบบสมาชิกทั่วไป (Member Login)
          </Link>
        </div>
      </div>
    </div>
  );
}
