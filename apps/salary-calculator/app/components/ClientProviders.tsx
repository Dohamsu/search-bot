"use client";

import { LocaleProvider } from "../i18n";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
