import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mbti.example.com";

export const metadata: Metadata = {
  title: "MBTI 궁합 분석 | 16가지 성격 유형 궁합 테스트",
  description:
    "MBTI 유형별 궁합을 확인하세요. 나와 상대방의 성격 유형 호환성, 잘 맞는 점, 주의할 점, 관계 팁까지 한눈에!",
  keywords: [
    "MBTI 궁합",
    "MBTI 호환성",
    "MBTI 궁합 테스트",
    "성격 유형 궁합",
    "MBTI 커플 궁합",
    "MBTI 친구 궁합",
  ],
  openGraph: {
    title: "MBTI 궁합 분석 | 16가지 성격 유형 궁합 테스트",
    description:
      "나와 상대방의 MBTI 궁합을 분석해보세요. 유형별 호환성 점수, 강점, 주의점까지!",
    type: "website",
    url: `${BASE_URL}/compatibility`,
    locale: "ko_KR",
    siteName: "16가지 성격 유형 테스트",
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI 궁합 분석 | 16가지 성격 유형 궁합 테스트",
    description:
      "나와 상대방의 MBTI 궁합을 분석해보세요. 유형별 호환성 점수, 강점, 주의점까지!",
  },
  alternates: {
    canonical: `${BASE_URL}/compatibility`,
  },
};

export default function CompatibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
