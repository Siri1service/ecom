"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  QrCode,
  Building,
  Truck,
  ShieldCheck,
  CheckCircle,
  MapPin,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import { THAI_ADDRESS_DATA, validateThaiPhone } from "@/lib/thai-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, appliedCoupon, selectedSubtotal, shippingFee, discountAmount, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [fullName, setFullName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressLine, setAddressLine] = useState(user?.address || "");
  const [province, setProvince] = useState(user?.province || "กรุงเทพมหานคร");
  const [district, setDistrict] = useState(user?.district || "ปทุมวัน");
  const [subdistrict, setSubdistrict] = useState(user?.subdistrict || "ลุมพินี");
  const [zipcode, setZipcode] = useState(user?.zipcode || "10330");
  const [paymentMethod, setPaymentMethod] = useState<"kbank_qr" | "credit_card" | "bank_transfer" | "cash_on_delivery">("kbank_qr");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedItems = items.filter((i) => i.selected);

  // Address Cascading Handlers
  const currentProvinceData = THAI_ADDRESS_DATA.find((p) => p.name === province);
  const currentDistrictData = currentProvinceData?.districts.find((d) => d.name === district);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProv = e.target.value;
    setProvince(newProv);
    const provObj = THAI_ADDRESS_DATA.find((p) => p.name === newProv);
    if (provObj && provObj.districts.length > 0) {
      const firstDist = provObj.districts[0];
      setDistrict(firstDist.name);
      if (firstDist.subdistricts.length > 0) {
        setSubdistrict(firstDist.subdistricts[0].name);
        setZipcode(firstDist.subdistricts[0].zipcode);
      }
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDist = e.target.value;
    setDistrict(newDist);
    const distObj = currentProvinceData?.districts.find((d) => d.name === newDist);
    if (distObj && distObj.subdistricts.length > 0) {
      setSubdistrict(distObj.subdistricts[0].name);
      setZipcode(distObj.subdistricts[0].zipcode);
    }
  };

  const handleSubdistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSub = e.target.value;
    setSubdistrict(newSub);
    const subObj = currentDistrictData?.subdistricts.find((s) => s.name === newSub);
    if (subObj) {
      setZipcode(subObj.zipcode);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || fullName.trim().length < 2) {
      setErrorMessage("กรุณาระบุชื่อ-นามสกุลผู้รับสินค้า");
      return;
    }

    if (!validateThaiPhone(phone)) {
      setErrorMessage("เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0 และมีตัวเลข 10 หลัก (เช่น 0812345678)");
      return;
    }

    if (!addressLine || addressLine.trim().length < 5) {
      setErrorMessage("กรุณาระบุที่อยู่จัดส่งให้ชัดเจน (บ้านเลขที่, ซอย, ถนน)");
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          couponCode: appliedCoupon?.code,
          paymentMethod,
          shippingAddress: {
            fullName,
            phone,
            address: `${addressLine} ตำบล/แขวง${subdistrict} อำเภอ/เขต${district} จังหวัด${province} ${zipcode}`,
            province,
            district,
            subdistrict,
            zipcode,
          },
          idempotencyKey,
          affiliateCode: user?.affiliateCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการประมวลผลคำสั่งซื้อ");
      }

      // Clear checked out items from cart
      clearCart();

      // Redirect to dynamic order payment & status page
      router.push(`/orders/${data.order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          ไม่มีสินค้าที่ถูกเลือกสำหรับสั่งซื้อ
        </h2>
        <p className="text-xs text-slate-500">
          กรุณากลับไปที่หน้าตะกร้าและติ๊กเลือกรายการสินค้าที่ท่านต้องการชำระเงิน
        </p>
        <Button onClick={() => router.push("/cart")} size="sm">
          กลับไปที่ตะกร้าสินค้า
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePlaceOrder} className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          ชำระเงินและยืนยันคำสั่งซื้อ
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          ระบบตรวจสอบราคาสินค้า โปรโมชั่น และสต็อกคงเหลือบนเซิร์ฟเวอร์โดยตรง
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Settings (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Section */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                ข้อมูลที่อยู่จัดส่งสินค้า
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  ชื่อ-นามสกุล ผู้รับ *
                </label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="เช่น นายสมชาย ใจดีพร้อม"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  เบอร์โทรศัพท์ (10 หลัก) *
                </label>
                <Input
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="08XXXXXXXX"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                บ้านเลขที่, หมู่บ้าน, ซอย, ถนน *
              </label>
              <Input
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="เช่น 123/45 ซอยสุขุมวิท 55"
              />
            </div>

            {/* Thai Cascaded Address Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">จังหวัด</label>
                <select
                  value={province}
                  onChange={handleProvinceChange}
                  className="w-full mt-1 p-2 rounded-xl glass-input text-xs cursor-pointer text-slate-900 dark:text-white"
                >
                  {THAI_ADDRESS_DATA.map((p) => (
                    <option key={p.name} value={p.name} className="text-slate-900">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">อำเภอ / เขต</label>
                <select
                  value={district}
                  onChange={handleDistrictChange}
                  className="w-full mt-1 p-2 rounded-xl glass-input text-xs cursor-pointer text-slate-900 dark:text-white"
                >
                  {currentProvinceData?.districts.map((d) => (
                    <option key={d.name} value={d.name} className="text-slate-900">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">ตำบล / แขวง</label>
                <select
                  value={subdistrict}
                  onChange={handleSubdistrictChange}
                  className="w-full mt-1 p-2 rounded-xl glass-input text-xs cursor-pointer text-slate-900 dark:text-white"
                >
                  {currentDistrictData?.subdistricts.map((s) => (
                    <option key={s.name} value={s.name} className="text-slate-900">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-36 text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">รหัสไปรษณีย์</label>
              <Input
                readOnly
                value={zipcode}
                className="mt-1 bg-slate-100/60 dark:bg-slate-800/60 font-mono font-bold"
              />
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                เลือกช่องทางการชำระเงิน
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* KBank QR */}
              <label
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  paymentMethod === "kbank_qr"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-md"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "kbank_qr"}
                  onChange={() => setPaymentMethod("kbank_qr")}
                  className="mt-1 text-emerald-600 accent-emerald-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>KBank QR (พร้อมเพย์)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    สแกน QR ได้ทุกแอปธนาคาร ยอดเงินอัปเดตอัตโนมัติ (อายุ QR 10 นาที)
                  </p>
                </div>
              </label>

              {/* Credit / Debit Card */}
              <label
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  paymentMethod === "credit_card"
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "credit_card"}
                  onChange={() => setPaymentMethod("credit_card")}
                  className="mt-1 text-indigo-600 accent-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>บัตรเครดิต / เดบิต</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Visa, Mastercard, JCB พร้อมระบบรักษาความปลอดภัย 3-D Secure
                  </p>
                </div>
              </label>

              {/* Bank Transfer */}
              <label
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  paymentMethod === "bank_transfer"
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="mt-1 text-indigo-600 accent-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>โอนผ่านบัญชีธนาคาร</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    โอนเข้าบัญชีบริษัทและอัปโหลดสลิปเพื่อตรวจสอบยอด
                  </p>
                </div>
              </label>

              {/* Cash On Delivery */}
              <label
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  paymentMethod === "cash_on_delivery"
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={() => setPaymentMethod("cash_on_delivery")}
                  className="mt-1 text-indigo-600 accent-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span>เก็บเงินปลายทาง (COD)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ชำระเงินสดแก่พนักงานขนส่งเมื่อได้รับสินค้า
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar (1 Col) */}
        <div className="glass-panel rounded-3xl p-6 space-y-6 border border-white/50 dark:border-slate-800 shadow-xl h-fit">
          <h3 className="font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
            รายการสินค้าที่สั่งซื้อ ({selectedItems.length})
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-1">
            {selectedItems.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex justify-between">
              <span>ยอดรวมสินค้า</span>
              <span>{formatCurrency(selectedSubtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>ส่วนลดคูปอง ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>ค่าจัดส่ง</span>
              <span>{shippingFee === 0 ? "ส่งฟรี" : formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
              <span>ยอดชำระสุทธิ</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>กำลังประมวลผลคำสั่งซื้อ...</span>
            ) : (
              <>
                <span>ยืนยันและชำระเงิน</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <div className="text-[10px] text-slate-400 space-y-1 text-center">
            <p className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>เข้ารหัสข้อมูลการชำระเงินตามมาตรฐานความปลอดภัย</span>
            </p>
            <p>อายุ QR และเงื่อนไขการยกเลิกเป็นไปตามเกณฑ์ธนาคารกสิกรไทย</p>
          </div>
        </div>
      </div>
    </form>
  );
}
