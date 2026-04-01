import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCompatibility, getAllCompatibilityPairs } from "../../lib/compatibility";
import { getResult, getAllTypes } from "../../lib/results";
import CompatibilityResultClient from "./CompatibilityResultClient";
import Footer from "../../components/Footer";

const BASE_URL = "https://mbti.onekit.co.kr";

import ko from "../../i18n/ko.json";

function getKoTitle(type: string): string {
  const data = (ko.results as Record<string, { title?: string }>)[type];
  return data?.title || `${type} 유형`;
}

function resolveKoKey(key: string): string {
  const keys = key.split(".");
  let value: unknown = ko;
  for (const k of keys) {
    if (value && typeof value === "object") {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === "string" ? value : key;
}

interface CompatibilityPageProps {
  params: Promise<{ types: string }>;
}

export async function generateStaticParams() {
  const pairs = getAllCompatibilityPairs();
  return pairs.map(([t1, t2]) => ({
    types: `${t1}-${t2}`,
  }));
}

export async function generateMetadata({
  params,
}: CompatibilityPageProps): Promise<Metadata> {
  const { types } = await params;
  const parts = types.split("-");

  if (parts.length !== 2) {
    return { title: "궁합 결과를 찾을 수 없습니다" };
  }

  const [type1, type2] = parts.map((t) => t.toUpperCase());
  const allTypes = getAllTypes();

  if (
    !allTypes.includes(type1 as (typeof allTypes)[number]) ||
    !allTypes.includes(type2 as (typeof allTypes)[number])
  ) {
    return { title: "궁합 결과를 찾을 수 없습니다" };
  }

  const title1 = getKoTitle(type1);
  const title2 = getKoTitle(type2);
  const compatibility = getCompatibility(type1, type2);
  const compatTitle = resolveKoKey(compatibility.titleKey);
  const pageUrl = `${BASE_URL}/compatibility/${compatibility.type1}-${compatibility.type2}`;

  const title =
    type1 === type2
      ? `${type1} 같은 유형 궁합 | MBTI 궁합 분석`
      : `${type1}와 ${type2} 궁합 | MBTI 궁합 분석`;

  const description =
    type1 === type2
      ? `${type1}(${title1}) 같은 유형끼리의 궁합 분석. 호환성 점수 ${"\u2605".repeat(compatibility.score)}${"\u2606".repeat(5 - compatibility.score)}. ${compatTitle}.`
      : `${type1}(${title1})와 ${type2}(${title2})의 궁합 분석. 호환성 점수 ${"\u2605".repeat(compatibility.score)}${"\u2606".repeat(5 - compatibility.score)}. ${compatTitle}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      locale: "ko_KR",
      siteName: "16가지 성격 유형 테스트",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function CompatibilityResultPage({
  params,
}: CompatibilityPageProps) {
  const { types } = await params;
  const parts = types.split("-");

  if (parts.length !== 2) {
    notFound();
  }

  const [type1, type2] = parts.map((t) => t.toUpperCase());
  const allTypes = getAllTypes();

  if (
    !allTypes.includes(type1 as (typeof allTypes)[number]) ||
    !allTypes.includes(type2 as (typeof allTypes)[number])
  ) {
    notFound();
  }

  const compatibility = getCompatibility(type1, type2);
  const result1 = getResult(compatibility.type1);
  const result2 = getResult(compatibility.type2);

  const koTitle1 = getKoTitle(compatibility.type1);
  const koTitle2 = getKoTitle(compatibility.type2);
  const koCompatTitle = resolveKoKey(compatibility.titleKey);
  const koDescription = resolveKoKey(compatibility.descriptionKey)
    .replace(/\{type1\}/g, compatibility.type1)
    .replace(/\{type2\}/g, compatibility.type2)
    .replace(/\{title1\}/g, koTitle1)
    .replace(/\{title2\}/g, koTitle2);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${compatibility.type1}와 ${compatibility.type2} MBTI 궁합 분석`,
    description: koDescription,
    url: `${BASE_URL}/compatibility/${compatibility.type1}-${compatibility.type2}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/compatibility/${compatibility.type1}-${compatibility.type2}`,
    },
    about: {
      "@type": "Thing",
      name: `${compatibility.type1} ${compatibility.type2} 성격 유형 궁합`,
      description: koDescription,
    },
    keywords: `${compatibility.type1}, ${compatibility.type2}, MBTI 궁합, 성격 유형 호환성, ${koCompatTitle}`,
    inLanguage: "ko",
    isPartOf: {
      "@type": "WebSite",
      name: "16가지 성격 유형 테스트",
      url: BASE_URL,
    },
  };

  return (
    <main className="flex min-h-dvh flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Header */}
      <div className="flex w-full flex-col items-center gap-4 bg-gradient-to-b from-[#8B5CF6] via-[#EC4899] to-[#F9A8D4] px-6 pb-10 pt-12 md:pb-12 md:pt-16">
        <p className="text-sm font-medium text-white/80">MBTI Compatibility</p>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white px-6 py-2.5">
            <span
              className="font-heading text-2xl font-extrabold"
              style={{
                background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {compatibility.type1}
            </span>
          </div>
          <span className="text-2xl text-white">+</span>
          <div className="rounded-full bg-white px-6 py-2.5">
            <span
              className="font-heading text-2xl font-extrabold"
              style={{
                background: "linear-gradient(90deg, #EC4899, #F59E0B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {compatibility.type2}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-6">
        <CompatibilityResultClient
          compatibility={compatibility}
          result1={{
            type: result1.type,
            titleKey: result1.titleKey,
            descriptionKey: result1.descriptionKey,
          }}
          result2={{
            type: result2.type,
            titleKey: result2.titleKey,
            descriptionKey: result2.descriptionKey,
          }}
        />
      </article>

      <Footer />
    </main>
  );
}
