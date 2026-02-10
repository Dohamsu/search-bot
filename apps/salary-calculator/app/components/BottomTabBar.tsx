"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Calculator, TableProperties, Briefcase, MoreHorizontal } from "lucide-react";

interface TabItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
}

export default function BottomTabBar() {
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const tabs: TabItem[] = [
    {
      label: "급여",
      icon: <Calculator className="h-5 w-5" />,
      href: "/",
    },
    {
      label: "실수령표",
      icon: <TableProperties className="h-5 w-5" />,
      href: "/salary-table",
    },
    {
      label: "퇴직금",
      icon: <Briefcase className="h-5 w-5" />,
      href: "/severance",
    },
    {
      label: "더보기",
      icon: <MoreHorizontal className="h-5 w-5" />,
      href: "",
      disabled: true,
    },
  ];

  const isActive = (tab: TabItem) => {
    if (tab.href === "/") return pathname === "/";
    return pathname.startsWith(tab.href);
  };

  const handleTabClick = (tab: TabItem) => {
    if (isActive(tab)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab.disabled) {
      showToast(`${tab.label} 기능은 준비 중입니다`);
    } else {
      router.push(tab.href);
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
              isActive(tab)
                ? "text-[var(--salary-primary)]"
                : tab.disabled
                  ? "text-slate-300"
                  : "text-slate-500"
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

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm text-white shadow-lg animate-[fadeInUp_0.2s_ease-out]">
          {toast}
        </div>
      )}
    </>
  );
}
