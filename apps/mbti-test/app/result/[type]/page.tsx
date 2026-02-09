import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResult, getAllTypes } from "../../lib/results";
import ResultHeader from "../../components/ResultHeader";
import ResultClientWrapper from "../../components/ResultClientWrapper";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mbti.example.com";

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
  const result = getResult(upperType);

  if (result.type !== upperType && !getAllTypes().includes(upperType as ReturnType<typeof getAllTypes>[number])) {
    return { title: "결과를 찾을 수 없습니다" };
  }

  const pageUrl = `${BASE_URL}/result/${result.type}`;

  return {
    title: `${result.type} - ${result.title} | 16가지 성격 유형 테스트`,
    description: `${result.type} ${result.title}: ${result.description} 추천 직업: ${result.careers.join(", ")}`,
    openGraph: {
      title: `나의 성격 유형은 ${result.type} - ${result.title}`,
      description: result.description,
      type: "article",
      url: pageUrl,
      locale: "ko_KR",
      siteName: "16가지 성격 유형 테스트",
    },
    twitter: {
      card: "summary_large_image",
      title: `나의 성격 유형은 ${result.type} - ${result.title}`,
      description: result.description,
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${result.type} - ${result.title}`,
    description: result.description,
    url: `${BASE_URL}/result/${result.type}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/result/${result.type}`,
    },
    about: {
      "@type": "Thing",
      name: `${result.type} 성격 유형`,
      description: result.description,
    },
    keywords: `${result.type}, ${result.title}, 성격유형, 성격 테스트, ${result.careers.join(", ")}`,
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

      <ResultHeader type={result.type} title={result.title} />

      <article className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-6">
        <ResultClientWrapper result={result} />
      </article>
    </main>
  );
}
