"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  backgroundImage: string;
  imageCredit: string;
  workspaceName: string;
  panelBlur: number; // in pixels (e.g. 16)
  glassOpacity: number; // 0.1 to 1.0
}

const defaultConfig: ThemeConfig = {
  mode: "light",
  backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
  imageCredit: "Gradient Sky by Unsplash",
  workspaceName: "Siam Commerce Hub",
  panelBlur: 16,
  glassOpacity: 0.85,
};

interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: (newConfig: Partial<ThemeConfig>) => void;
  resetConfig: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  config: defaultConfig,
  updateConfig: () => {},
  resetConfig: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecom_theme_config");
      if (saved) {
        setConfig({ ...defaultConfig, ...JSON.parse(saved) });
      }
    } catch {
      // Ignore storage read error
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("ecom_theme_config", JSON.stringify(config));
    } catch {
      // Ignore storage write error
    }

    // Apply dark class to html
    const isDark =
      config.mode === "dark" ||
      (config.mode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Apply CSS Variables
    document.documentElement.style.setProperty("--panel-blur", `${config.panelBlur}px`);
    if (isDark) {
      document.documentElement.style.setProperty(
        "--glass-bg",
        `rgba(15, 23, 42, ${config.glassOpacity})`
      );
    } else {
      document.documentElement.style.setProperty(
        "--glass-bg",
        `rgba(255, 255, 255, ${config.glassOpacity})`
      );
    }
  }, [config, mounted]);

  const updateConfig = (newConfig: Partial<ThemeConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <ThemeContext.Provider value={{ config, updateConfig, resetConfig }}>
      <div
        className="min-h-screen transition-colors duration-300 relative bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: config.backgroundImage
            ? `url(${config.backgroundImage})`
            : undefined,
        }}
      >
        <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950/80 backdrop-blur-[2px] flex flex-col">
          {children}
          {/* Background image credit pill */}
          {config.imageCredit && (
            <div className="fixed bottom-2 right-2 text-[10px] text-slate-500/70 bg-white/40 dark:bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full z-10 pointer-events-none no-print">
              📷 {config.imageCredit} | {config.workspaceName}
            </div>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
