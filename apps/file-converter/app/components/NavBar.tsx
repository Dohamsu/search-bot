"use client";

import { useTranslation } from "../i18n";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export default function NavBar() {
  const { t } = useTranslation();

  return (
    <nav className="hidden md:flex h-16 items-center justify-between border-b border-[#E7E5E4] bg-white px-8">
      <div className="flex items-center gap-8">
        <span className="text-[22px] font-bold text-[var(--file-primary)]">
          FileFlow
        </span>
        <span className="text-sm font-medium text-[var(--file-primary)]">
          {t("nav.subtitle")}
        </span>
      </div>
      <LanguageSwitcher />
    </nav>
  );
}
