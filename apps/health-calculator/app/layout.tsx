import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { LocaleProvider } from "./i18n";
import "./globals.css";

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

const SITE_URL = "https://health.onekit.co.kr";
const GA_ID = "G-YRKEEK84RK";
const ADSENSE_ID = "ca-pub-3400073425613266";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BMI 계산기 & 건강 계산기 | 체질량지수, 기초대사량, 체지방률",
  description:
    "BMI(체질량지수), 기초대사량(BMR), 일일 칼로리 소비량(TDEE), 체지방률, 표준 체중 등 건강 관련 수치를 간편하게 계산하세요.",
  keywords: [
    "BMI계산기",
    "체질량지수",
    "기초대사량",
    "BMR계산",
    "TDEE계산",
    "체지방률",
    "표준체중",
  ],
  openGraph: {
    title: "BMI 계산기 & 건강 계산기",
    description:
      "BMI, 기초대사량, TDEE, 체지방률, 표준 체중을 간편하게 계산하세요.",
    url: SITE_URL,
    siteName: "건강 계산기",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI 계산기 & 건강 계산기",
    description:
      "BMI, 기초대사량, TDEE, 체지방률, 표준 체중을 간편하게 계산하세요.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "BMI 정상 범위는 얼마인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "대한비만학회 기준 BMI 정상 범위는 18.5~22.9입니다. 23~24.9는 과체중, 25~29.9는 비만, 30 이상은 고도비만으로 분류됩니다. BMI는 키(m)의 제곱으로 체중(kg)을 나누어 계산합니다."
      }
    },
    {
      "@type": "Question",
      "name": "체지방률은 어떻게 계산하나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "체지방률은 미해군 공식(US Navy method)을 이용해 목둘레, 허리둘레(남성) 또는 엉덩이둘레(여성)로 추정합니다. 남성 정상 범위는 10~20%, 여성은 18~28%입니다. 정확한 측정은 인바디 등 체성분 분석기를 이용합니다."
      }
    },
    {
      "@type": "Question",
      "name": "기초대사량(BMR)이란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "기초대사량은 아무런 활동 없이 생명을 유지하는 데 필요한 최소 에너지량입니다. 성별, 나이, 키, 체중에 따라 달라지며, Mifflin-St Jeor 공식으로 계산합니다. 하루 총 칼로리 소비의 약 60~70%를 차지합니다."
      }
    },
    {
      "@type": "Question",
      "name": "하루 적정 칼로리 섭취량은 어떻게 알 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "하루 적정 칼로리는 기초대사량(BMR)에 활동계수를 곱해 계산합니다. 좌식 생활은 BMR × 1.2, 가벼운 운동은 × 1.375, 보통 운동은 × 1.55, 격렬한 운동은 × 1.725입니다. 체중 감량 시 총 칼로리에서 500kcal을 줄이면 주당 약 0.5kg 감량됩니다."
      }
    },
    {
      "@type": "Question",
      "name": "적정 심박수 범위는 어떻게 되나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "안정 시 정상 심박수는 60~100bpm입니다. 운동 시 목표 심박수는 카보넨 공식으로 계산하며, 유산소 운동 효과를 위해 최대심박수의 50~85% 범위를 유지하는 것이 좋습니다. 최대심박수는 220에서 나이를 뺀 값입니다."
      }
    }
  ]
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BMI 계산기 & 건강 계산기",
  description:
    "BMI(체질량지수), 기초대사량(BMR), 일일 칼로리 소비량(TDEE), 체지방률, 표준 체중 등 건강 관련 수치를 간편하게 계산하세요.",
  url: SITE_URL,
  applicationCategory: "HealthApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        {ADSENSE_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter)] antialiased`}>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
