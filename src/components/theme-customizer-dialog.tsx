"use client";

import React, { useState } from "react";
import { X, Image as ImageIcon, Sparkles, RefreshCw } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ThemeCustomizerDialogProps {
  open: boolean;
  onClose: () => void;
}

const PRESET_WALLPAPERS = [
  {
    name: "Gradient Sky (Default)",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
    credit: "Gradient Sky by Unsplash",
  },
  {
    name: "Modern Cyberpunk City",
    url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=2000&auto=format&fit=crop",
    credit: "Neon City by Unsplash",
  },
  {
    name: "Minimalist Silk Abstract",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    credit: "Abstract Waves by Unsplash",
  },
  {
    name: "Emerald Forest Mist",
    url: "https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=2000&auto=format&fit=crop",
    credit: "Green Forest by Unsplash",
  },
];

export const ThemeCustomizerDialog: React.FC<ThemeCustomizerDialogProps> = ({
  open,
  onClose,
}) => {
  const { config, updateConfig, resetConfig } = useTheme();
  const [customUrl, setCustomUrl] = useState(config.backgroundImage);
  const [credit, setCredit] = useState(config.imageCredit);
  const [workspaceName, setWorkspaceName] = useState(config.workspaceName);

  if (!open) return null;

  const handleApply = () => {
    updateConfig({
      backgroundImage: customUrl,
      imageCredit: credit,
      workspaceName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in no-print">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 relative border border-white/30 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              ปรับแต่งธีมและ Glassmorphism
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Workspace Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              ชื่อ Workspace / แพลตฟอร์ม
            </label>
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="เช่น Siam Commerce Hub"
            />
          </div>

          {/* Background Wallpaper Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              ภาพพื้นหลัง (Background Image Presets)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_WALLPAPERS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setCustomUrl(preset.url);
                    setCredit(preset.credit);
                  }}
                  className={`text-left p-2 rounded-xl text-xs border transition-all ${
                    customUrl === preset.url
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/50 font-semibold"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  <p className="truncate text-slate-900 dark:text-white">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Image URL & Credit */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              หรือระบุ URL รูปภาพของท่านเอง
            </label>
            <Input
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://images.example.com/wallpaper.jpg"
            />
            <Input
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              placeholder="เครดิตภาพ (เช่น Photo by John Doe on Unsplash)"
              className="text-xs"
            />
          </div>

          {/* Panel Blur Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>ความเบลอของแผงกระจก (Glass Blur)</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {config.panelBlur} px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="2"
              value={config.panelBlur}
              onChange={(e) =>
                updateConfig({ panelBlur: parseInt(e.target.value, 10) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Glass Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>ความทึบของกระจก (Glass Opacity)</span>
              <span className="text-indigo-600 dark:text-indigo-400">
                {Math.round(config.glassOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="0.95"
              step="0.05"
              value={config.glassOpacity}
              onChange={(e) =>
                updateConfig({ glassOpacity: parseFloat(e.target.value) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetConfig();
              setCustomUrl(PRESET_WALLPAPERS[0].url);
              setCredit(PRESET_WALLPAPERS[0].credit);
              setWorkspaceName("Siam Commerce Hub");
            }}
            className="text-xs text-slate-500 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            คืนค่าเริ่มต้น
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button size="sm" onClick={handleApply}>
              บันทึกการตั้งค่า
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
