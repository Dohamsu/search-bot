"use client";

import { useTranslation, Locale } from "./index";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  const toggle = () => {
    setLocale(locale === "ko" ? "en" : "ko");
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-[#E7E5E4] bg-white px-2.5 py-1.5 text-xs font-medium text-[#78716C] transition-colors hover:bg-[#F5F5F4] hover:text-[#1C1917] ${className ?? ""}`}
      aria-label="Switch language"
    >
      <Globe size={14} />
      <span>{locale === "ko" ? "EN" : "KO"}</span>
    </button>
  );
}
