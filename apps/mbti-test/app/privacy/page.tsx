"use client";

import { useTranslation } from "../i18n";

export default function PrivacyPage() {
  const { t } = useTranslation();

  const section3List = [
    t("privacy.section3List.0" as "privacy.section3Title"),
    t("privacy.section3List.1" as "privacy.section3Title"),
    t("privacy.section3List.2" as "privacy.section3Title"),
    t("privacy.section3List.3" as "privacy.section3Title"),
  ];
  const section4List = [
    t("privacy.section4List.0" as "privacy.section4Title"),
    t("privacy.section4List.1" as "privacy.section4Title"),
  ];

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading mb-8 text-2xl font-bold text-[var(--mbti-text)]">
        {t("privacy.title")}
      </h1>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("privacy.section1Title")}
          </h2>
          <p>{t("privacy.section1Text")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("privacy.section2Title")}
          </h2>
          <p>{t("privacy.section2Text")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("privacy.section3Title")}
          </h2>
          <p>{t("privacy.section3Text")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {section3List.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-2">
            {t("privacy.section3Suffix")}{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--mbti-primary)] underline"
            >
              {t("privacy.section3Link")}
            </a>
            {t("privacy.section3LinkSuffix")}
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("privacy.section4Title")}
          </h2>
          <p>{t("privacy.section4Text")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {section4List.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-2">{t("privacy.section4Suffix")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("privacy.section5Title")}
          </h2>
          <p>
            {t("privacy.section5Text")}{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--mbti-primary)] underline"
            >
              {t("privacy.section5Link")}
            </a>
            {t("privacy.section5LinkSuffix")}
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("privacy.section6Title")}
          </h2>
          <p>{t("privacy.section6Text")}</p>
          <p className="mt-2">{t("privacy.section6Email")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            {t("privacy.section7Title")}
          </h2>
          <p>{t("privacy.section7Text")}</p>
          <p className="mt-2 text-xs text-gray-400">{t("privacy.effectiveDate")}</p>
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
