"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import ko from "./ko.json";
import en from "./en.json";

export type Locale = "ko" | "en";

const dictionaries: Record<Locale, Record<string, unknown>> = { ko, en };

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "ko",
  setLocale: () => {},
  t: (key) => key,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && (saved === "ko" || saved === "en")) {
      setLocaleState(saved);
    } else {
      const browserLang = navigator.language || "";
      if (!browserLang.startsWith("ko")) {
        setLocaleState("en");
      }
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".");
      let value: unknown = dictionaries[locale];
      for (const k of keys) {
        if (value && typeof value === "object") {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      if (typeof value !== "string") return key;
      if (!params) return value;
      let result = value;
      for (const [pk, pv] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${pk}\\}`, "g"), String(pv));
      }
      return result;
    },
    [locale]
  );

  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: "ko", setLocale, t: (key) => {
        const keys = key.split(".");
        let value: unknown = dictionaries.ko;
        for (const k of keys) {
          if (value && typeof value === "object") {
            value = (value as Record<string, unknown>)[k];
          } else {
            return key;
          }
        }
        return typeof value === "string" ? value : key;
      }}}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LocaleContext);
}
