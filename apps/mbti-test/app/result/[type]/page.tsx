import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResult, getAllTypes } from "../../lib/results";
import ResultHeader from "../../components/ResultHeader";
import ResultClientWrapper from "../../components/ResultClientWrapper";
import Footer from "../../components/Footer";

const BASE_URL = "https://mbti.onekit.co.kr";

// Static Korean metadata for SEO (server component can't use i18n context)
import ko from "../../i18n/ko.json";

function getKoTitle(type: string): string {
  const data = (ko.results as Record<string, { title?: string }>)[type];
  return data?.title || `${type} 유형`;
}

function getKoDescription(type: string): string {
  const data = (ko.results as Record<string, { description?: string }>)[type];
  return data?.description || "";
}

function getKoCareers(type: string): string[] {
  const data = (ko.results as Record<string, { careers?: string[] }>)[type];
  return data?.careers || [];
}

interface ResultPageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return getAllTypes().map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: ResultPageProps): Promise<Metadata> {
  const { type } = await params;
  const upperType = type.toUpperCase();

  if (!getAllTypes().includes(upperType as ReturnType<typeof getAllTypes>[number])) {
    return { title: "결과를 찾을 수 없습니다" };
  }

  const title = getKoTitle(upperType);
  const description = getKoDescription(upperType);
  const careers = getKoCareers(upperType);
  const pageUrl = `${BASE_URL}/result/${upperType}`;

  return {
    title: `${upperType} - ${title} | 16가지 성격 유형 테스트`,
    description: `${upperType} ${title}: ${description} MBTI와 유사한 성격 유형 분석. 추천 직업: ${careers.join(", ")}`,
    openGraph: {
      title: `나의 성격 유형은 ${upperType} - ${title}`,
      description,
      type: "article",
      url: pageUrl,
      locale: "ko_KR",
      siteName: "16가지 성격 유형 테스트",
    },
    twitter: {
      card: "summary_large_image",
      title: `나의 성격 유형은 ${upperType} - ${title}`,
      description,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { type } = await params;
  const upperType = type.toUpperCase();
  const allTypes = getAllTypes();

  if (!allTypes.includes(upperType as (typeof allTypes)[number])) {
    notFound();
  }

  const result = getResult(upperType);
  const koTitle = getKoTitle(upperType);
  const koDescription = getKoDescription(upperType);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${result.type} - ${koTitle}`,
    description: koDescription,
    url: `${BASE_URL}/result/${result.type}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/result/${result.type}`,
    },
    about: {
      "@type": "Thing",
      name: `${result.type} 성격 유형`,
      description: koDescription,
    },
    keywords: `${result.type}, ${koTitle}, MBTI ${result.type}, 성격유형, 성격 테스트, ${getKoCareers(upperType).join(", ")}`,
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

      <ResultHeader type={result.type} titleKey={result.titleKey} />

      <article className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-6">
        <ResultClientWrapper result={result} />
      </article>

      <Footer />
    </main>
  );
}
