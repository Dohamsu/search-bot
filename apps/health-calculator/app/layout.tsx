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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://health.example.com";
const GA_ID = "G-YRKEEK84RK";
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

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
        {children}
      </body>
    </html>
  );
}
