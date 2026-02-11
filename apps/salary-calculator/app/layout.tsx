import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-var",
  subsets: ["latin"],
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
        {children}
      </body>
    </html>
  );
}
