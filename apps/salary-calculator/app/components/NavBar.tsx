"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";
import { useTranslation } from "../i18n";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export default function NavBar() {
  const { t } = useTranslation();

  return (
    <nav className="hidden md:flex h-16 items-center justify-between border-b border-[var(--salary-border)] bg-white px-8">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-[var(--salary-primary)]" />
          <span className="font-[family-name:var(--font-space-grotesk-var)] text-xl font-bold text-[var(--salary-primary)]">
            {t("common.siteName")}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-medium text-[var(--salary-text)]"
          >
            {t("nav.salaryCalc")}
          </button>
          <Link
            href="/salary-table"
            className="text-sm font-medium text-[var(--salary-text)] transition-colors hover:text-[var(--salary-primary)]"
          >
            {t("nav.salaryTable")}
          </Link>
          <Link
            href="/severance"
            className="text-sm font-medium text-[var(--salary-text)] transition-colors hover:text-[var(--salary-primary)]"
          >
            {t("nav.severance")}
          </Link>
        </div>
      </div>
      <LanguageSwitcher />
    </nav>
  );
}
