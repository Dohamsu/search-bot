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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bill.example.com";

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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

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
        {children}
      </body>
    </html>
  );
}
