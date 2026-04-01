"use client";

import Link from "next/link";
import { useTranslation } from "../i18n";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <article className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 md:p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">{t("privacy.title")}</h1>
          <LanguageSwitcher />
        </div>
        <p className="mt-1 text-sm text-slate-500">{t("privacy.lastModified")}</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section1Title")}</h2>
            <p className="mt-2">{t("privacy.section1Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section2Title")}</h2>
            <p className="mt-2">{t("privacy.section2Text1")}</p>
            <p className="mt-2">{t("privacy.section2Text2")}</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>{t("privacy.section2Item1")}</li>
              <li>{t("privacy.section2Item2")}</li>
              <li>{t("privacy.section2Item3")}</li>
              <li>{t("privacy.section2Item4")}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section3Title")}</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>{t("privacy.section3Item1")}</li>
              <li>{t("privacy.section3Item2")}</li>
              <li>{t("privacy.section3Item3")}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section4Title")}</h2>
            <p className="mt-2">{t("privacy.section4Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section5Title")}</h2>
            <p className="mt-2">
              {t("privacy.section5Text")}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {t("privacy.section5LinkText")}
              </a>
              {t("privacy.section5TextAfter")}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section6Title")}</h2>
            <p className="mt-2">{t("privacy.section6Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section7Title")}</h2>
            <p className="mt-2">{t("privacy.section7Text")}</p>
            <p className="mt-2">
              {t("privacy.email")}
              <a
                href="mailto:rlawlsdnjswk@gmail.com"
                className="text-blue-600 underline hover:text-blue-800"
              >
                rlawlsdnjswk@gmail.com
              </a>
            </p>
          </div>
        </section>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <Link
            href="/"
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            {t("privacy.backToMain")}
          </Link>
        </div>
      </article>
    </main>
  );
}
