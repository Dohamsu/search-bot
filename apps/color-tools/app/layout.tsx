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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://colortools.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "색상 도구 | 컬러 피커, 팔레트 생성기, HEX<->RGB 변환",
  description:
    "컬러 피커, 팔레트 자동 생성, HEX/RGB/HSL 변환, 대비율 확인, 그라디언트 생성 등 디자이너를 위한 무료 색상 도구 모음입니다.",
  keywords: ["컬러피커", "팔레트생성기", "HEX변환", "RGB변환", "색상대비"],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "색상 도구 | 컬러 피커, 팔레트 생성기, HEX/RGB 변환",
    description:
      "컬러 피커, 팔레트 자동 생성, HEX/RGB/HSL 변환, 대비율 확인, 그라디언트 생성 등 무료 색상 도구 모음.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "색상 도구",
  },
  twitter: {
    card: "summary_large_image",
    title: "색상 도구 | 컬러 피커, 팔레트 생성기",
    description:
      "컬러 피커, 팔레트 자동 생성, HEX/RGB/HSL 변환, 대비율 확인, 그라디언트 생성 등 무료 색상 도구 모음.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "색상 도구",
  url: SITE_URL,
  description:
    "컬러 피커, 팔레트 자동 생성, HEX/RGB/HSL 변환, 대비율 확인, 그라디언트 생성 등 디자이너를 위한 무료 색상 도구 모음입니다.",
  applicationCategory: "DesignApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  featureList: [
    "컬러 피커 & HEX/RGB/HSL 변환",
    "조화 규칙 기반 팔레트 자동 생성",
    "WCAG 대비율 검사",
    "CSS 그라디언트 생성기",
    "이미지에서 색상 추출",
  ],
  inLanguage: "ko",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
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
