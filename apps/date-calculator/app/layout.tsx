import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dateCalc.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "날짜 계산기 | D-day, 날짜 차이, 요일 계산, 만 나이",
  description:
    "두 날짜 사이의 일수 차이, D-day 계산, 날짜에서 일수 더하기/빼기, 만 나이 계산, 요일 확인 등 다양한 날짜 계산을 무료로 제공합니다.",
  keywords: [
    "날짜계산기",
    "D-day계산",
    "디데이계산기",
    "만나이계산",
    "요일계산",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "날짜 계산기 | D-day, 날짜 차이, 요일 계산, 만 나이",
    description:
      "D-day 계산, 날짜 차이, 날짜 더하기/빼기, 만 나이 계산을 무료로 제공합니다.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "날짜 계산기",
  },
  twitter: {
    card: "summary_large_image",
    title: "날짜 계산기 | D-day, 날짜 차이, 요일 계산, 만 나이",
    description:
      "D-day 계산, 날짜 차이, 날짜 더하기/빼기, 만 나이 계산을 무료로 제공합니다.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "날짜 계산기",
  url: SITE_URL,
  description:
    "두 날짜 사이의 일수 차이, D-day 계산, 날짜에서 일수 더하기/빼기, 만 나이 계산, 요일 확인 등 다양한 날짜 계산을 무료로 제공합니다.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  featureList: [
    "D-Day 디데이 계산",
    "두 날짜 사이 일수 차이 계산",
    "날짜 더하기/빼기",
    "만 나이 계산",
    "요일 확인",
    "영업일 계산",
    "띠(12지신) 확인",
  ],
  inLanguage: "ko",
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "D-Day 디데이 계산은 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "목표 날짜를 선택하면 오늘 기준으로 남은 일수(D-XXX) 또는 지난 일수(D+XXX)를 자동으로 계산합니다. 주, 월, 년 단위로도 확인할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "만 나이는 어떻게 계산하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "생년월일을 입력하면 만 나이를 자동으로 계산합니다. 한국 나이(연 나이), 띠(12지신), 다음 생일까지 남은 일수, 살아온 총 일수도 함께 확인할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "영업일 계산이 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 날짜 차이 계산과 날짜 더하기/빼기에서 영업일(토/일 제외) 기준 계산을 지원합니다. 한국 공휴일은 제외하지 않으며 토요일과 일요일만 제외합니다.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-YRKEEK84RK";
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
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
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
