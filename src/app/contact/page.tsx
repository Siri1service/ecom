"use client";

import React from "react";
import { Phone, MessageCircle, Send, MapPin, Clock, ExternalLink } from "lucide-react";
import { CONTACT_CHANNELS } from "@/lib/catalog-data";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="glass-panel rounded-3xl p-8 space-y-3 border border-white/50 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          ติดต่อเรา (Contact Us)
        </h1>
        <p className="text-xs text-slate-500">
          ทีมงาน Siam Commerce Hub พร้อมให้บริการและตอบคำถามผ่านทุกช่องทางสื่อสารที่ท่านสะดวก
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="glass-panel rounded-3xl p-8 space-y-6 border border-white/40 dark:border-slate-800 shadow-xl">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            ช่องทางสื่อสารอย่างเป็นทางการ
          </h3>

          <div className="space-y-4 text-xs">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">เบอร์โทรศัพท์</p>
                <p className="text-slate-500">{CONTACT_CHANNELS.phone}</p>
              </div>
            </div>

            {/* LINE OA */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">LINE Official Account</p>
                <a
                  href={CONTACT_CHANNELS.lineOa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline flex items-center gap-1"
                >
                  {CONTACT_CHANNELS.lineId} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Telegram */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Telegram Assistant Bot</p>
                <a
                  href={`https://t.me/${CONTACT_CHANNELS.telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:underline flex items-center gap-1"
                >
                  @{CONTACT_CHANNELS.telegramUsername} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Office Address */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">สำนักงานใหญ่</p>
                <p className="text-slate-500 leading-relaxed">{CONTACT_CHANNELS.address}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">เวลาทำการ</p>
                <p className="text-slate-500">{CONTACT_CHANNELS.workingHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Send Message Form */}
        <div className="glass-panel rounded-3xl p-8 space-y-4 border border-white/40 dark:border-slate-800 shadow-xl">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            ส่งข้อความถึงทีมงาน (Web Inbox)
          </h3>
          <p className="text-xs text-slate-500">
            ข้อความของท่านจะได้รับการคัดกรองความปลอดภัยและส่งตรงสู่ Unified Admin Inbox
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("ส่งข้อความถึงทีมงานเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุดครับ");
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">ชื่อผู้ติดต่อ</label>
              <input
                required
                className="w-full mt-1 p-2.5 rounded-xl glass-input text-xs"
                placeholder="ชื่อ - นามสกุล"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">เบอร์โทรศัพท์ หรือ อีเมล</label>
              <input
                required
                className="w-full mt-1 p-2.5 rounded-xl glass-input text-xs"
                placeholder="08X-XXX-XXXX หรือ email@domain.com"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">ข้อความที่ต้องการสอบถาม</label>
              <textarea
                required
                rows={4}
                className="w-full mt-1 p-2.5 rounded-xl glass-input text-xs resize-none"
                placeholder="ระบุรายละเอียดที่ต้องการติดต่อ..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              ส่งข้อความ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
