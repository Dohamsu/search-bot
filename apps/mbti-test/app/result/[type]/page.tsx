import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResult, getAllTypes } from "../../lib/results";
import ResultHeader from "../../components/ResultHeader";
import ResultClientWrapper from "../../components/ResultClientWrapper";
import CrossLinks from "../../components/CrossLinks";

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

  return {
    title: `${result.type} - ${result.title} | MBTI 성격 유형 테스트`,
    description: `${result.type} ${result.title}: ${result.description} 추천 직업: ${result.careers.join(", ")}`,
    openGraph: {
      title: `나의 MBTI는 ${result.type} - ${result.title}`,
      description: result.description,
      type: "article",
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

  return (
    <div className="flex min-h-dvh flex-col">
      <ResultHeader type={result.type} title={result.title} />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-6">
        <ResultClientWrapper result={result} />
      </div>

      <CrossLinks />
    </div>
  );
}
