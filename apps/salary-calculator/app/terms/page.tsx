"use client";

import Link from "next/link";
import { useTranslation } from "../i18n";

export default function TermsPage() {
  const { t } = useTranslation();

  const article3Items = [
    t("terms.article3Items.0") !== "terms.article3Items.0" ? t("terms.article3Items.0") : "",
    t("terms.article3Items.1") !== "terms.article3Items.1" ? t("terms.article3Items.1") : "",
    t("terms.article3Items.2") !== "terms.article3Items.2" ? t("terms.article3Items.2") : "",
    t("terms.article3Items.3") !== "terms.article3Items.3" ? t("terms.article3Items.3") : "",
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <article className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 md:p-10">
        <h1 className="text-xl font-bold text-slate-800">{t("terms.pageTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("terms.lastModified")}</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article1Title")}</h2>
            <p className="mt-2">{t("terms.article1Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article2Title")}</h2>
            <p className="mt-2">{t("terms.article2Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article3Title")}</h2>
            <ul className="mt-2 list-disc pl-5 space-y-2">
              {article3Items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article4Title")}</h2>
            <p className="mt-2">{t("terms.article4Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article5Title")}</h2>
            <p className="mt-2">{t("terms.article5Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article6Title")}</h2>
            <p className="mt-2">{t("terms.article6Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article7Title")}</h2>
            <p className="mt-2">{t("terms.article7Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("terms.article8Title")}</h2>
            <p className="mt-2">{t("terms.article8Content")}</p>
            <p className="mt-2">
              {t("terms.email")}{" "}
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
            {t("common.backToMain")}
          </Link>
        </div>
      </article>
    </main>
  );
}
