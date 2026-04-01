"use client";

import Link from "next/link";
import { useTranslation } from "../i18n";
import LanguageSwitcher from "../i18n/LanguageSwitcher";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <article className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 md:p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">{t("terms.title")}</h1>
          <LanguageSwitcher />
        </div>
        <p className="mt-1 text-sm text-slate-500">{t("terms.lastModified")}</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article1Title")}</h2>
            <p className="mt-2">{t("terms.article1Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article2Title")}</h2>
            <p className="mt-2">{t("terms.article2Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article3Title")}</h2>
            <ul className="mt-2 list-disc pl-5 space-y-2">
              <li>{t("terms.article3Item1")}</li>
              <li>{t("terms.article3Item2")}</li>
              <li>{t("terms.article3Item3")}</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article4Title")}</h2>
            <p className="mt-2">{t("terms.article4Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article5Title")}</h2>
            <p className="mt-2">{t("terms.article5Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article6Title")}</h2>
            <p className="mt-2">{t("terms.article6Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article7Title")}</h2>
            <p className="mt-2">{t("terms.article7Text")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article8Title")}</h2>
            <p className="mt-2">{t("terms.article8Text")}</p>
            <p className="mt-2">
              {t("terms.email")}
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
            {t("terms.backToMain")}
          </Link>
        </div>
      </article>
    </main>
  );
}
