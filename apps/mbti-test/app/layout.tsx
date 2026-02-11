import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mbti.example.com";

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
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

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
        {children}
      </body>
    </html>
  );
}
