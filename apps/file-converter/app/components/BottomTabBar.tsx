"use client";

import { useState } from "react";
import { RefreshCw, Wrench, Clock } from "lucide-react";
import { useTranslation } from "../i18n";

interface TabDef {
  labelKey: string;
  icon: typeof RefreshCw;
  enabled: boolean;
}

const tabs: TabDef[] = [
  { labelKey: "tabs.convert", icon: RefreshCw, enabled: true },
  { labelKey: "tabs.tools", icon: Wrench, enabled: false },
  { labelKey: "tabs.recent", icon: Clock, enabled: false },
];

interface BottomTabBarProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const [toast, setToast] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleTabClick = (index: number) => {
    if (tabs[index].enabled) {
      onTabChange(index);
    } else {
      setToast(t("tabs.featurePreparing", { name: t(tabs[index].labelKey) }));
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div className="relative md:hidden">
      <div className="flex border-b border-[#E7E5E4] bg-white">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === index;
          return (
            <button
              key={tab.labelKey}
              onClick={() => handleTabClick(index)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive
                  ? "border-b-2 border-[var(--file-primary)] text-[var(--file-primary)]"
                  : tab.enabled
                    ? "text-[#A8A29E]"
                    : "text-[#D6D3D1]"
              }`}
            >
              <Icon size={18} />
              {t(tab.labelKey)}
              {!tab.enabled && (
                <span className="text-[9px] leading-none text-[#D6D3D1]">{t("tabs.preparing")}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 rounded-lg bg-[#1C1917] px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
