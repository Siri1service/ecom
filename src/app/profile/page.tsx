"use client";

import React, { useState } from "react";
import {
  User,
  Building,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { THAI_BANKS, THAI_ADDRESS_DATA, validateThaiPhone, validateThaiTaxId } from "@/lib/thai-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [memberType, setMemberType] = useState<"individual" | "corporate">(
    user?.memberType || "individual"
  );

  // Individual fields
  const [firstName, setFirstName] = useState(user?.firstName || "สมชาย");
  const [lastName, setLastName] = useState(user?.lastName || "ใจดีพร้อม");
  const [phone, setPhone] = useState(user?.phone || "0812345678");
  const [address, setAddress] = useState(user?.address || "123/45 ถนนพระราม 4");
  const [province, setProvince] = useState(user?.province || "กรุงเทพมหานคร");
  const [district, setDistrict] = useState(user?.district || "ปทุมวัน");
  const [subdistrict, setSubdistrict] = useState(user?.subdistrict || "ลุมพินี");
  const [zipcode, setZipcode] = useState(user?.zipcode || "10330");
  const [bankName, setBankName] = useState(user?.bankName || "KBANK");
  const [bankAccountNumber, setBankAccountNumber] = useState(user?.bankAccountNumber || "0041234567");

  // Corporate fields
  const [companyName, setCompanyName] = useState(user?.companyName || "บริษัท ดิจิทัล โซลูชันส์ จำกัด");
  const [companyType, setCompanyType] = useState(user?.companyType || "company_limited");
  const [taxId, setTaxId] = useState(user?.taxId || "0105555099887");
  const [taxAddress, setTaxAddress] = useState(user?.taxAddress || "อาคารไอทีพลาซ่า ดินแดง กทม.");
  const [contactName, setContactName] = useState(user?.contactName || "นายสมชาย ใจดีพร้อม");

  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!validateThaiPhone(phone)) {
      setErrorMessage("เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0 และมีตัวเลข 10 หลัก");
      return;
    }

    if (memberType === "corporate" && !validateThaiTaxId(taxId)) {
      setErrorMessage("เลขประจำตัวผู้เสียภาษี 13 หลักไม่ถูกต้องตามหลักการคำนวณ Checksum");
      return;
    }

    const ok = await updateProfile({
      memberType,
      firstName,
      lastName,
      phone,
      address,
      province,
      district,
      subdistrict,
      zipcode,
      bankName,
      bankAccountNumber,
      companyName,
      companyType,
      taxId,
      taxAddress,
      contactName,
    });

    if (ok) {
      setStatusMessage("บันทึกข้อมูลสมาชิกเรียบร้อยแล้ว (อัปเดตเซสชันและฐานข้อมูล)");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3 border border-white/50 dark:border-slate-800 shadow-xl">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          จัดการข้อมูลสมาชิกและสิทธิ์ (Member Profile & Settings)
        </h1>
        <p className="text-xs text-slate-500">
          อีเมลที่เชื่อมโยง: <strong className="font-mono text-indigo-600">{user?.email || "somchai.dev@gmail.com"}</strong>
          {" "}(Google Account)
        </p>

        {/* Member Type Switcher */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => setMemberType("individual")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              memberType === "individual"
                ? "bg-indigo-600 text-white shadow-md"
                : "glass-panel text-slate-700 dark:text-slate-300 hover:border-indigo-400"
            }`}
          >
            <User className="w-4 h-4" />
            <span>บุคคลธรรมดา (Individual)</span>
          </button>

          <button
            type="button"
            onClick={() => setMemberType("corporate")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              memberType === "corporate"
                ? "bg-indigo-600 text-white shadow-md"
                : "glass-panel text-slate-700 dark:text-slate-300 hover:border-indigo-400"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>นิติบุคคล / องค์กร (Corporate)</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {memberType === "individual" ? (
          /* Individual Form */
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
              ข้อมูลส่วนบุคคลและที่อยู่จัดส่ง
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อจริง (ไทย/อังกฤษ)</label>
                <Input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">นามสกุล</label>
                <Input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">เบอร์โทรศัพท์ (10 หลัก)</label>
              <Input
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">ที่อยู่จัดส่งสินค้า</label>
              <Input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          /* Corporate Form */
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl text-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
              ข้อมูลนิติบุคคลและใบกำกับภาษี
            </h2>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อจดทะเบียนนิติบุคคล</label>
              <Input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">เลขประจำตัวผู้เสียภาษี (13 หลัก)</label>
                <Input
                  required
                  maxLength={13}
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อผู้ติดต่อประสานงาน</label>
                <Input
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">ที่อยู่ตามใบกำกับภาษี</label>
              <Input
                required
                value={taxAddress}
                onChange={(e) => setTaxAddress(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Bank Account Details for Affiliate / Payouts */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              ข้อมูลบัญชีธนาคาร (สำหรับรับค่าคอมมิชชันและสะสมแต้ม)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">ธนาคารในประเทศไทย</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl glass-input text-xs cursor-pointer text-slate-900 dark:text-white"
              >
                {THAI_BANKS.map((b) => (
                  <option key={b.acronym} value={b.acronym} className="text-slate-900">
                    {b.nameTh} ({b.acronym})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">เลขที่บัญชี (เก็บเลขศูนย์นำหน้า)</label>
              <Input
                required
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="0041234567"
                className="mt-1 font-mono"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>บันทึกการเปลี่ยนแปลงข้อมูล</span>
        </Button>
      </form>
    </div>
  );
}
