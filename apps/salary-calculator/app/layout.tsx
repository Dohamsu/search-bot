import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "./components/ClientProviders";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-var",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://salary.onekit.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "연봉 실수령액 계산기 2026 | 4대보험 세금 공제 자동 계산",
  description:
    "2026년 최신 4대보험, 소득세 기준으로 연봉 실수령액을 간편하게 계산해 보세요. 연봉 3000만원~1억원 실수령액 표, 월급 역산 계산기 제공.",
  keywords: [
    "연봉 실수령액",
    "연봉 계산기",
    "2026 연봉",
    "4대보험 계산",
    "소득세 계산",
    "월급 계산기",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "연봉 실수령액 계산기 2026",
    description:
      "2026년 최신 4대보험, 소득세 기준으로 연봉 실수령액을 간편하게 계산해 보세요. 연봉 3000만원~1억원 실수령액 표, 월급 역산 계산기 제공.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "연봉 실수령액 계산기",
  },
  twitter: {
    card: "summary_large_image",
    title: "연봉 실수령액 계산기 2026",
    description:
      "4대보험, 소득세 자동 공제 후 실수령액을 간편하게 계산해 보세요.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "연봉 3000만원 실수령액은 얼마인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "연봉 3000만원의 월 실수령액은 약 224만원입니다. 4대보험(국민연금, 건강보험, 장기요양보험, 고용보험)과 소득세, 지방소득세를 공제한 금액이며, 비과세 월 10만원, 부양가족 1인(본인) 기준입니다."
      }
    },
    {
      "@type": "Question",
      "name": "4대보험 공제 비율은 어떻게 되나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "2026년 기준 근로자 부담 4대보험료율은 국민연금 4.75%, 건강보험 3.595%, 장기요양보험(건강보험료의 13.14%), 고용보험 0.9%입니다. 월급에서 이 비율만큼 공제됩니다."
      }
    },
    {
      "@type": "Question",
      "name": "퇴직금은 어떻게 계산하나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "퇴직금은 1일 평균임금 × 30일 × (재직일수/365)로 계산됩니다. 1일 평균임금은 퇴직 전 3개월간 총 급여를 해당 기간의 총 일수로 나누어 산정합니다. 1년 이상 근무해야 퇴직금을 받을 수 있습니다."
      }
    },
    {
      "@type": "Question",
      "name": "비과세 금액이란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "비과세 금액은 소득세가 부과되지 않는 급여 항목입니다. 대표적으로 식대(월 20만원 한도), 자가운전보조금(월 20만원), 출산·보육수당(월 20만원) 등이 있습니다. 비과세 금액이 클수록 실수령액이 늘어납니다."
      }
    },
    {
      "@type": "Question",
      "name": "연봉과 월급의 차이는 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "연봉은 1년간 받는 총 급여(세전)이고, 월급은 연봉을 12로 나눈 세전 월 급여입니다. 실수령액은 여기서 4대보험료와 세금을 공제한 금액입니다. 예를 들어 연봉 5000만원이면 월급(세전)은 약 417만원, 실수령액은 약 350만원입니다."
      }
    }
  ]
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "연봉 실수령액 계산기 2026",
  url: SITE_URL,
  description:
    "2026년 최신 4대보험, 소득세 기준으로 연봉 실수령액을 간편하게 계산해 보세요. 연봉 3000만원~1억원 실수령액 표, 월급 역산 계산기 제공.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko",
  browserRequirements: "Requires JavaScript",
  softwareVersion: "2026",
  creator: {
    "@type": "Organization",
    name: "연봉계산기",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-YRKEEK84RK";
  const adsenseId = "ca-pub-3400073425613266";

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
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
        className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter-var)] antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
