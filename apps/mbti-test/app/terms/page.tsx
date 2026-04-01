"use client";

import { useTranslation } from "../i18n";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading mb-8 text-2xl font-bold text-[var(--mbti-text)]">
        {t("terms.title")}
      </h1>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("terms.section1Title")}
          </h2>
          <p>{t("terms.section1Text")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("terms.section2Title")}
          </h2>
          <p>{t("terms.section2Text1")}</p>
          <p className="mt-2">{t("terms.section2Text2")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("terms.section3Title")}
          </h2>
          <p>{t("terms.section3Text1")}</p>
          <p className="mt-2">{t("terms.section3Text2")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("terms.section4Title")}
          </h2>
          <p>{t("terms.section4Text")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("terms.section5Title")}
          </h2>
          <p>{t("terms.section5Text")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("terms.section6Title")}
          </h2>
          <p>{t("terms.section6Text")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("terms.section7Title")}
          </h2>
          <p>{t("terms.section7Text")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("terms.section8Title")}
          </h2>
          <p>{t("terms.section8Text")}</p>
          <p className="mt-2 text-xs text-gray-400">{t("terms.effectiveDate")}</p>
        </section>
      </div>

      <div className="mt-10">
        <a
          href="/"
          className="text-sm text-[var(--mbti-primary)] underline"
        >
          {t("common.backToHome")}
        </a>
      </div>
    </main>
  );
}
