import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "./i18n";

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

const SITE_URL = "https://bill.onekit.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "전기요금 계산기 2026 | 주택용·일반용 전기세, 수도요금, 가스요금",
  description:
    "2026년 최신 요금 기준으로 전기요금(주택용/일반용), 수도요금, 도시가스 요금을 간편하게 계산하세요. 누진제 구간별 요금, 월별 예상 요금을 확인할 수 있습니다.",
  keywords: [
    "전기요금계산기",
    "전기세계산",
    "누진세",
    "수도요금계산",
    "가스요금계산",
    "공과금계산기",
    "전기요금 누진제",
    "2026 전기요금",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "전기요금 계산기 2026 | 전기세·수도·가스 요금 계산",
    description:
      "2026년 최신 요금 기준으로 전기요금(주택용/일반용), 수도요금, 도시가스 요금을 간편하게 계산하세요.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "전기요금 계산기",
  },
  twitter: {
    card: "summary_large_image",
    title: "전기요금 계산기 2026",
    description:
      "전기요금, 수도요금, 가스요금을 간편하게 계산하세요. 누진제 구간별 요금 확인.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "전기요금 누진제란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "전기요금 누진제는 전기 사용량이 많을수록 높은 단가를 적용하는 제도입니다. 주택용 전기의 경우 구간별(예: 200kWh 이하, 200~400kWh, 400kWh 초과)로 다른 단가가 적용되며, 여름철에는 별도 단가가 적용됩니다."
      }
    },
    {
      "@type": "Question",
      "name": "수도요금은 어떻게 계산되나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "수도요금은 상수도 기본료 + 상수도 사용료 + 하수도 사용료 + 물이용부담금으로 구성됩니다. 가정용 기준 사용량 구간별 누진요금이 적용되며, 지역(서울, 경기 등)에 따라 요율이 다릅니다."
      }
    },
    {
      "@type": "Question",
      "name": "가스요금 절약 방법은 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "가스요금 절약을 위해 보일러 외출 모드 활용, 창문·현관 틈새 단열테이프 부착, 보일러 온수 온도 낮추기, 요리 시 냄비 뚜껑 덮기, 보일러 배관 청소 등을 실천하면 10~30% 절감 효과를 볼 수 있습니다."
      }
    },
    {
      "@type": "Question",
      "name": "전기요금 할인 받는 방법은 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "복지 할인제도로 장애인, 기초생활수급자, 차상위계층, 다자녀 가구, 출산가구 등은 전기요금을 할인받을 수 있습니다. 한국전력 고객센터(123)나 홈페이지에서 신청 가능하며, 월 최대 16,000원까지 할인됩니다."
      }
    },
    {
      "@type": "Question",
      "name": "한국 평균 가구 전기 사용량은 얼마인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "한국 평균 가구 전기 사용량은 월 약 300~350kWh입니다. 1인 가구는 약 200kWh, 4인 가구는 약 400kWh 수준이며, 여름·겨울 냉난방 시 사용량이 크게 증가합니다."
      }
    }
  ]
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "전기요금 계산기 2026",
  url: SITE_URL,
  description:
    "2026년 최신 요금 기준으로 전기요금(주택용/일반용), 수도요금, 도시가스 요금을 간편하게 계산하세요. 누진제 구간별 요금, 월별 예상 요금을 확인할 수 있습니다.",
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
    name: "공과금 계산기",
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
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
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
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
