"use client";

import Link from "next/link";
import { useTranslation } from "../i18n";

export default function PrivacyPage() {
  const { t } = useTranslation();

  const section2Items = [
    t("privacy.section2Items.0") !== "privacy.section2Items.0" ? t("privacy.section2Items.0") : "",
    t("privacy.section2Items.1") !== "privacy.section2Items.1" ? t("privacy.section2Items.1") : "",
    t("privacy.section2Items.2") !== "privacy.section2Items.2" ? t("privacy.section2Items.2") : "",
    t("privacy.section2Items.3") !== "privacy.section2Items.3" ? t("privacy.section2Items.3") : "",
  ].filter(Boolean);

  const section3Items = [
    t("privacy.section3Items.0") !== "privacy.section3Items.0" ? t("privacy.section3Items.0") : "",
    t("privacy.section3Items.1") !== "privacy.section3Items.1" ? t("privacy.section3Items.1") : "",
    t("privacy.section3Items.2") !== "privacy.section3Items.2" ? t("privacy.section3Items.2") : "",
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <article className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 md:p-10">
        <h1 className="text-xl font-bold text-slate-800">{t("privacy.pageTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("privacy.lastModified")}</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section1Title")}</h2>
            <p className="mt-2">{t("privacy.section1Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section2Title")}</h2>
            <p className="mt-2">{t("privacy.section2Content1")}</p>
            <p className="mt-2">{t("privacy.section2Content2")}</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {section2Items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section3Title")}</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {section3Items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section4Title")}</h2>
            <p className="mt-2">{t("privacy.section4Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section5Title")}</h2>
            <p className="mt-2">
              {t("privacy.section5Content1")}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {t("privacy.section5Link")}
              </a>
              {t("privacy.section5Content2")}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section6Title")}</h2>
            <p className="mt-2">{t("privacy.section6Content")}</p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">{t("privacy.section7Title")}</h2>
            <p className="mt-2">{t("privacy.section7Content")}</p>
            <p className="mt-2">
              {t("privacy.email")}{" "}
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
