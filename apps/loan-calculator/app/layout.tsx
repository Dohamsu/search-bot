import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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

const SITE_URL = "https://loan.onekit.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "대출이자 계산기 2026 | 원리금균등·원금균등·만기일시 상환",
  description:
    "대출금액, 이자율, 상환기간을 입력하면 월 상환액과 총 이자를 자동 계산합니다. 원리금균등상환, 원금균등상환, 만기일시상환 방식을 비교하고 월별 상환 스케줄을 확인하세요.",
  keywords: [
    "대출이자계산기",
    "주택담보대출",
    "원리금균등상환",
    "대출상환계산",
    "이자계산",
    "대출이자",
    "원금균등상환",
    "만기일시상환",
    "월상환액",
    "대출계산기",
  ],
  openGraph: {
    title: "대출이자 계산기 2026 | 원리금균등·원금균등·만기일시 상환",
    description:
      "대출금액, 이자율, 상환기간을 입력하면 월 상환액과 총 이자를 자동 계산합니다.",
    url: SITE_URL,
    siteName: "대출이자 계산기",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "대출이자 계산기 2026",
    description: "대출금액, 이자율, 상환기간으로 월 상환액과 총 이자를 계산하세요.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-YRKEEK84RK";
  const adsenseId = "ca-pub-3400073425613266";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "대출이자 계산기",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description:
      "대출금액, 이자율, 상환기간을 입력하면 월 상환액과 총 이자를 자동 계산합니다.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    inLanguage: "ko",
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        {adsenseId && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
