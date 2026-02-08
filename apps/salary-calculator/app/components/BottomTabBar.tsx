"use client";

import { useState } from "react";
import { Calculator, Landmark, BookOpen, MoreHorizontal } from "lucide-react";

interface TabItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export default function BottomTabBar() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const tabs: TabItem[] = [
    {
      label: "급여",
      icon: <Calculator className="h-5 w-5" />,
      active: true,
    },
    {
      label: "퇴직금",
      icon: <Landmark className="h-5 w-5" />,
      disabled: true,
    },
    {
      label: "세금",
      icon: <BookOpen className="h-5 w-5" />,
      disabled: true,
    },
    {
      label: "더보기",
      icon: <MoreHorizontal className="h-5 w-5" />,
      disabled: true,
    },
  ];

  const handleTabClick = (tab: TabItem) => {
    if (tab.active) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showToast(`${tab.label} 기능은 준비 중입니다`);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[var(--salary-border)] bg-white md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab)}
            className={`flex flex-col items-center gap-0.5 ${
              tab.active
                ? "text-[var(--salary-primary)]"
                : "text-slate-300"
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
            {tab.disabled && (
              <span className="absolute -top-0.5 ml-6 h-1.5 w-1.5 rounded-full bg-slate-300" />
            )}
          </button>
        ))}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white shadow-lg animate-[fadeInUp_0.2s_ease-out]">
          {toast}
        </div>
      )}
    </>
  );
}
