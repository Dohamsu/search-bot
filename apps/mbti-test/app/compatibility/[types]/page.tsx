import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCompatibility, getAllCompatibilityPairs } from "../../lib/compatibility";
import { getResult, getAllTypes } from "../../lib/results";
import CompatibilityResultClient from "./CompatibilityResultClient";
import Footer from "../../components/Footer";

const BASE_URL = "https://mbti.onekit.co.kr";

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

  const result1 = getResult(type1);
  const result2 = getResult(type2);
  const compatibility = getCompatibility(type1, type2);
  const pageUrl = `${BASE_URL}/compatibility/${compatibility.type1}-${compatibility.type2}`;

  const title =
    type1 === type2
      ? `${type1} 같은 유형 궁합 | MBTI 궁합 분석`
      : `${type1}와 ${type2} 궁합 | MBTI 궁합 분석`;

  const description =
    type1 === type2
      ? `${type1}(${result1.title}) 같은 유형끼리의 궁합 분석. 호환성 점수 ${"★".repeat(compatibility.score)}${"☆".repeat(5 - compatibility.score)}. ${compatibility.title}.`
      : `${type1}(${result1.title})와 ${type2}(${result2.title})의 궁합 분석. 호환성 점수 ${"★".repeat(compatibility.score)}${"☆".repeat(5 - compatibility.score)}. ${compatibility.title}.`;

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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${compatibility.type1}와 ${compatibility.type2} MBTI 궁합 분석`,
    description: compatibility.description,
    url: `${BASE_URL}/compatibility/${compatibility.type1}-${compatibility.type2}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/compatibility/${compatibility.type1}-${compatibility.type2}`,
    },
    about: {
      "@type": "Thing",
      name: `${compatibility.type1} ${compatibility.type2} 성격 유형 궁합`,
      description: compatibility.description,
    },
    keywords: `${compatibility.type1}, ${compatibility.type2}, MBTI 궁합, 성격 유형 호환성, ${compatibility.title}`,
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
        <p className="text-sm font-medium text-white/80">MBTI 궁합 분석</p>
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
        <h1 className="font-heading text-center text-lg font-bold text-white">
          {compatibility.title}
        </h1>
      </div>

      {/* Content */}
      <article className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-6">
        <CompatibilityResultClient
          compatibility={compatibility}
          result1={{
            type: result1.type,
            title: result1.title,
            description: result1.description,
          }}
          result2={{
            type: result2.type,
            title: result2.title,
            description: result2.description,
          }}
        />
      </article>

      <Footer />
    </main>
  );
}
