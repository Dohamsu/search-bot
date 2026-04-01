"use client";

import Link from "next/link";
import { useTranslation } from "../i18n";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[var(--salary-border)] bg-slate-50 py-4">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-center justify-center gap-2 text-xs text-slate-500 md:flex-row md:gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="underline transition-colors hover:text-[var(--salary-primary)]"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/terms"
              className="underline transition-colors hover:text-[var(--salary-primary)]"
            >
              {t("footer.terms")}
            </Link>
          </div>
          <span className="hidden md:inline text-slate-300">|</span>
          <a
            href="mailto:rlawlsdnjswk@gmail.com"
            className="underline transition-colors hover:text-[var(--salary-primary)]"
          >
            rlawlsdnjswk@gmail.com
          </a>
          <span className="hidden md:inline text-slate-300">|</span>
          <span>{t("footer.copyright")}</span>
        </div>
      </div>
    </footer>
  );
}
