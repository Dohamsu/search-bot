import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "./i18n";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = "https://mbti.onekit.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "16가지 성격 유형 테스트 | 무료 성격 검사",
  description:
    "Jung의 심리유형 이론에 기반한 무료 성격 유형 테스트. MBTI와 유사한 16가지 유형(ENFP, INTJ 등)을 16개 질문으로 알아보세요. 결과 이미지 공유, 유형별 직업 추천까지!",
  keywords: [
    "MBTI 테스트",
    "MBTI 유형",
    "성격유형 검사",
    "성격 테스트",
    "16가지 성격 유형",
    "MBTI 무료",
    "성격유형 테스트",
    "무료 성격 검사",
  ],
  openGraph: {
    title: "16가지 성격 유형 테스트 | 무료 성격 검사",
    description: "Jung의 심리유형 이론 기반 무료 성격 검사. MBTI와 유사한 16가지 유형을 알아보세요",
    type: "website",
    url: BASE_URL,
    locale: "ko_KR",
    siteName: "16가지 성격 유형 테스트",
  },
  twitter: {
    card: "summary_large_image",
    title: "16가지 성격 유형 테스트 | 무료 성격 검사",
    description: "Jung의 심리유형 이론에 기반한 무료 성격 유형 테스트. MBTI와 유사한 16가지 유형을 알아보세요. 결과 이미지 공유, 직업 추천까지!",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-YRKEEK84RK";
  const adsenseId = "ca-pub-3400073425613266";

  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "16가지 성격 유형 테스트",
    description:
      "Jung의 심리유형 이론에 기반한 무료 성격 유형 테스트. MBTI와 유사한 16가지 유형(ENFP, INTJ 등)을 16개 질문으로 알아보세요.",
    url: BASE_URL,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    inLanguage: "ko",
    browserRequirements: "Requires JavaScript",
  };

  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "16가지 성격 유형 테스트",
    description: "Jung의 심리유형 이론에 기반한 16가지 성격 유형 무료 테스트. MBTI와 유사한 유형 분류를 제공합니다.",
    educationalAlignment: {
      "@type": "AlignmentObject",
      alignmentType: "educationalSubject",
      targetName: "성격 심리학",
    },
    about: {
      "@type": "Thing",
      name: "성격 유형 검사",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "이 성격유형 검사는 무료인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "네, 완전 무료입니다. 회원가입 없이 바로 16개 질문에 답하면 16가지 성격유형 중 자신의 유형을 확인할 수 있습니다. 결과 이미지 저장과 공유도 무료로 제공됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "성격유형은 몇 가지인가요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Jung의 심리유형 이론에 기반한 16가지 유형이 있습니다. 외향(E)/내향(I), 감각(S)/직관(N), 사고(T)/감정(F), 판단(J)/인식(P)의 4가지 선호 지표를 조합하여 ENFP, INTJ 등 16가지 유형으로 분류됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "검사 소요 시간은 얼마나 되나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "총 16개 질문으로 구성되어 있어 약 3~5분이면 완료됩니다. 각 질문에 대해 자신에게 더 가까운 답변을 선택하면 됩니다. 깊이 고민하기보다 직관적으로 선택하는 것이 더 정확한 결과를 얻는 데 도움이 됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "성격유형 결과가 바뀔 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "네, 성격유형은 고정된 것이 아니라 환경, 경험, 성장에 따라 변할 수 있습니다. 특히 경계선에 있는 선호 지표는 시기에 따라 다르게 나올 수 있습니다. 정기적으로 검사하여 자신의 변화를 추적해 보는 것도 좋습니다.",
        },
      },
      {
        "@type": "Question",
        name: "유형별 궁합은 어떻게 확인하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "검사 결과 페이지에서 '궁합 보기' 기능을 통해 다른 유형과의 관계 궁합을 확인할 수 있습니다. 연애, 친구, 직장 등 다양한 관계에서의 궁합 점수와 조언을 제공합니다.",
        },
      },
    ],
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}
      >
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
