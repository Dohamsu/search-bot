"use client";

import { useTranslation } from "../i18n";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-gray-100 bg-white/50 py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
          <a
            href="/privacy"
            className="hover:text-[var(--mbti-primary)] underline transition-colors"
          >
            {t("common.privacy")}
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="/terms"
            className="hover:text-[var(--mbti-primary)] underline transition-colors"
          >
            {t("common.terms")}
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="mailto:rlawlsdnjswk@gmail.com"
            className="hover:text-[var(--mbti-primary)] underline transition-colors"
          >
            {t("common.contact")}
          </a>
          <span className="hidden sm:inline">|</span>
          <span className="text-gray-400">{t("common.copyright")}</span>
          <span className="hidden sm:inline">|</span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
