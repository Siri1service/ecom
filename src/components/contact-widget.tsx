"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Phone,
  Send,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { CONTACT_CHANNELS } from "@/lib/catalog-data";

export const ContactWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 no-print">
      {/* Expanded Contact Popover */}
      {isOpen && (
        <div className="mb-3 w-80 glass-panel rounded-3xl p-5 shadow-2xl space-y-4 border border-white/40 dark:border-slate-800 animate-slide-up">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                ช่องทางติดต่อฝ่ายบริการลูกค้า
              </h4>
              <p className="text-[11px] text-slate-500">ตอบกลับรวดเร็ว 08:30 - 18:00 น.</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* LINE OA */}
            <a
              href={CONTACT_CHANNELS.lineOa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 transition-all font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px]">
                  LINE
                </span>
                <span>LINE Official: {CONTACT_CHANNELS.lineId}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {/* Facebook Messenger */}
            <a
              href={CONTACT_CHANNELS.facebookMessenger}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/20 transition-all font-medium"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  f
                </span>
                <span>Facebook Messenger</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {/* Telegram Bot */}
            <a
              href={`https://t.me/${CONTACT_CHANNELS.telegramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/20 transition-all font-medium"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-500" />
                <span>Telegram: @{CONTACT_CHANNELS.telegramUsername}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {/* Telephone Call */}
            <a
              href={`tel:${CONTACT_CHANNELS.phone.split(",")[0].trim()}`}
              className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 transition-all font-medium"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-600" />
                <span>โทรด่วน: {CONTACT_CHANNELS.phone.split(",")[0]}</span>
              </div>
              <span className="text-[10px] text-indigo-500">โทรออก</span>
            </a>

            {/* WeChat */}
            <div className="p-2.5 rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20 text-[11px]">
              <span>WeChat ID: </span>
              <span className="font-mono font-semibold">{CONTACT_CHANNELS.wechatId}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-2 border-t border-slate-200/40">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>ช่องทางติดต่อทางการ ได้รับการรับรองความปลอดภัย</span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white/40"
        title="ติดต่อเราผ่าน LINE / Messenger / Telegram / โทรศัพท์"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 animate-bounce" />
        )}
      </button>
    </div>
  );
};
