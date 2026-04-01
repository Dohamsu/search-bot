"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Calculator, TableProperties, Briefcase, MoreHorizontal } from "lucide-react";
import { useTranslation } from "../i18n";

interface TabItem {
  labelKey: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
}

export default function BottomTabBar() {
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const tabs: TabItem[] = [
    {
      labelKey: "tabs.salary",
      icon: <Calculator className="h-5 w-5" />,
      href: "/",
    },
    {
      labelKey: "tabs.table",
      icon: <TableProperties className="h-5 w-5" />,
      href: "/salary-table",
    },
    {
      labelKey: "tabs.severance",
      icon: <Briefcase className="h-5 w-5" />,
      href: "/severance",
    },
    {
      labelKey: "tabs.more",
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
      showToast(t("tabs.featureComingSoon", { label: t(tab.labelKey) }));
    } else {
      router.push(tab.href);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-[var(--salary-border)] bg-white md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.labelKey}
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
            <span className="text-[10px] font-medium">{t(tab.labelKey)}</span>
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
