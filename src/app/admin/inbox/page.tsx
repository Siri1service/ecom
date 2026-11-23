"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  ShieldAlert,
  Send,
  Paperclip,
  CheckCircle,
  FileWarning,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SafeChatMessage {
  id: string;
  channel: "telegram" | "line" | "messenger" | "web";
  senderName: string;
  senderId: string;
  rawText: string;
  attachments?: Array<{ name: string; size: string; isSafe: boolean; type: string }>;
  timestamp: string;
}

const SAMPLE_MESSAGES: SafeChatMessage[] = [
  {
    id: "msg-1",
    channel: "line",
    senderName: "คุณกมลวรรณ (LINE OA)",
    senderId: "U4a89921bc",
    rawText: "สวัสดีค่ะ สนใจสมาร์ตโฟน SiamPro 16 Ultra Max มีส่วนลดสมาชิกใหม่ไหมคะ?",
    timestamp: "11:42 น.",
  },
  {
    id: "msg-2",
    channel: "telegram",
    senderName: "Alex_dev (@alex)",
    senderId: "tg_998811",
    rawText: "ตรวจสอบคำสั่งซื้อ ORD2026110001 ให้ทีครับ ลิงก์ร้านอื่น https://phishing-site.example.com/promo <script>alert(1)</script>",
    attachments: [
      { name: "slip_transfer.jpg", size: "1.2 MB", isSafe: true, type: "image/jpeg" },
      { name: "invoice_update.exe", size: "3.4 MB", isSafe: false, type: "application/x-msdownload" },
    ],
    timestamp: "11:20 น.",
  },
];

export default function AdminUnifiedInboxPage() {
  const [messages, setMessages] = useState<SafeChatMessage[]>(SAMPLE_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<SafeChatMessage>(SAMPLE_MESSAGES[1]);
  const [replyText, setReplyText] = useState("");

  /**
   * Strict Security Sanitizer:
   * 1. Strips HTML tags and script injections
   * 2. Defangs URLs so admins cannot accidentally click dangerous external links
   */
  const sanitizeMessageContent = (text: string) => {
    // Strip HTML tags completely
    const strippedHtml = text.replace(/<[^>]*>?/gm, "");
    
    // Defang URL: replace 'http://' or 'https://' with '[blocked-external-url: ...]'
    const defangedUrls = strippedHtml.replace(
      /(https?:\/\/[^\s]+)/g,
      "[ลิงก์ภายนอกถูกปิดกั้นเพื่อความปลอดภัย: $1]"
    );

    return defangedUrls;
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    alert(`ส่งข้อความตอบกลับไปยังช่องทาง ${selectedMessage.channel.toUpperCase()} เรียบร้อยแล้ว`);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      {/* Security Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3 border border-indigo-200/50 dark:border-indigo-900/50 shadow-xl">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            หน้ารวมแชททุกช่องทางแบบปลอดภัย (Unified Safe Inbox)
          </h1>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          ระบบรวมข้อความจาก LINE OA, Facebook Messenger และ Telegram โดยมีระบบความปลอดภัย:{" "}
          <strong className="text-rose-600">
            ห้ามเปิด URL ภายนอกโดยตรง ป้องกัน HTML Injection และสแกนไฟล์แนบอันตราย
          </strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List (1 Col) */}
        <div className="glass-panel rounded-3xl p-4 border border-white/50 dark:border-slate-800 shadow-xl space-y-2">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 py-1">
            กล่องข้อความทั้งหมด ({messages.length})
          </p>

          <div className="space-y-1.5">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer ${
                  selectedMessage.id === msg.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "glass-card hover:bg-white/40 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold truncate">{msg.senderName}</span>
                  <span className="text-[10px] opacity-75">{msg.timestamp}</span>
                </div>
                <p className="text-[11px] truncate opacity-85 mt-1">
                  {msg.rawText}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="glass" className="text-[9px] py-0 px-1 uppercase">
                    {msg.channel}
                  </Badge>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <span className="text-[10px] opacity-75">📎 {msg.attachments.length} ไฟล์</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Inspection & Safe Reply Area (2 Cols) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-white/50 dark:border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Sender Meta */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50 text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {selectedMessage.senderName}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Channel ID: {selectedMessage.senderId} ({selectedMessage.channel})
                </p>
              </div>
              <span className="text-[10px] text-slate-400">{selectedMessage.timestamp}</span>
            </div>

            {/* Sanitized Message Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                ข้อความผ่านการฆ่าเชื้อ (Sanitized Plain Text Content):
              </label>
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 text-xs font-mono leading-relaxed text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
                {sanitizeMessageContent(selectedMessage.rawText)}
              </div>
            </div>

            {/* Attachment Inspection */}
            {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                <label className="text-[11px] font-semibold text-slate-500">
                  การตรวจสอบไฟล์แนบ (Attachment Inspection):
                </label>
                <div className="space-y-1.5">
                  {selectedMessage.attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        file.isSafe
                          ? "bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                          : "bg-rose-50/50 dark:bg-rose-950/40 border-rose-500/30 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {file.isSafe ? (
                          <Paperclip className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <FileWarning className="w-4 h-4 text-rose-600 animate-pulse" />
                        )}
                        <span className="font-mono font-medium">{file.name}</span>
                        <span className="text-[10px] opacity-75">({file.size})</span>
                      </div>
                      <Badge variant={file.isSafe ? "success" : "destructive"} className="text-[10px]">
                        {file.isSafe ? "ไฟล์ปลอดภัย" : "ปิดกั้นไฟล์อันตราย (.exe)"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex gap-2">
              <Input
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`พิมพ์ข้อความตอบกลับไปยัง ${selectedMessage.senderName}...`}
                className="text-xs"
              />
              <Button type="submit" size="sm" className="rounded-xl flex-shrink-0 flex items-center gap-1.5">
                <Send className="w-4 h-4" />
                <span>ส่ง</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
