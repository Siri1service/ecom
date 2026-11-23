"use client";

import React, { useState } from "react";
import {
  Send,
  Terminal,
  ShieldCheck,
  History,
  AlertTriangle,
  Play,
} from "lucide-react";
import { handleTelegramAdminCommand, TELEGRAM_AUDIT_LOGS } from "@/lib/telegram/bot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminTelegramAssistantPage() {
  const [commandInput, setCommandInput] = useState("/status");
  const [callerId, setCallerId] = useState("99887766"); // Super Admin test ID
  const [outputResult, setOutputResult] = useState<string>("");
  const [logs, setLogs] = useState([...TELEGRAM_AUDIT_LOGS]);

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const res = handleTelegramAdminCommand(callerId, commandInput);
    setOutputResult(res.response);
    setLogs([...TELEGRAM_AUDIT_LOGS]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3 border border-white/50 dark:border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <Send className="w-6 h-6 text-indigo-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Telegram Assistant Bot & คำสั่งจัดการผู้ดูแลระบบ (Audit Logs)
          </h1>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          บอทแจ้งเตือนคำสั่งซื้ออัตโนมัติ และเป็นผู้ช่วย Admin ในการตรวจเช็กสต็อก สถานะระบบ และบันทึกประวัติการเรียกใช้คำสั่ง (Audit Trail)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Command Simulator & Testing */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <Terminal className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              ทดสอบคำสั่งบอท (Telegram Bot Command Simulator)
            </h2>
          </div>

          <form onSubmit={handleExecuteCommand} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                จำลอง Telegram User ID (Whitelist: 99887766 หรือ 11223344)
              </label>
              <Input
                value={callerId}
                onChange={(e) => setCallerId(e.target.value)}
                placeholder="ระบุ Telegram ID"
                className="mt-1 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                คำสั่งที่ต้องการทดสอบ (/status, /sales, /stock ECOM-PHONE-PRO, /backup)
              </label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="/status"
                  className="font-mono text-xs"
                />
                <Button type="submit" size="sm" className="rounded-xl flex-shrink-0 flex items-center gap-1">
                  <Play className="w-4 h-4" />
                  <span>รันคำสั่ง</span>
                </Button>
              </div>
            </div>

            {outputResult && (
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs space-y-1 border border-slate-800">
                <p className="text-[10px] text-slate-400">Response จาก Telegram Bot Engine:</p>
                <pre className="whitespace-pre-wrap">{outputResult}</pre>
              </div>
            )}
          </form>
        </div>

        {/* Audit Log Table */}
        <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/50 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                บันทึกการใช้งานคำสั่ง (Command Audit Logs)
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">บันทึกล่าสุด</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                ยังไม่มีประวัติการรันคำสั่งในเซสชันนี้
              </p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {log.command} {log.parameters}
                      </span>
                      <Badge variant={log.authorized ? "success" : "destructive"} className="text-[9px] py-0 px-1">
                        {log.authorized ? "อนุมัติ" : "ปฏิเสธสิทธิ์"}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Caller: {log.telegramUserId} • {new Date(log.timestamp).toLocaleTimeString("th-TH")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
