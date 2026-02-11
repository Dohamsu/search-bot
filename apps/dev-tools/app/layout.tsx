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
  process.env.NEXT_PUBLIC_SITE_URL || "https://devtools.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "개발자 도구 | JSON 포맷터, Base64, URL 인코딩, 해시 생성",
  description:
    "JSON 포맷팅/검증, Base64 인코딩/디코딩, URL 인코딩, UUID 생성, 해시 생성, 정규식 테스트, Lorem Ipsum 등 개발자를 위한 무료 온라인 도구 모음입니다.",
  keywords: [
    "JSON포맷터",
    "Base64변환",
    "URL인코딩",
    "개발자도구",
    "UUID생성기",
    "해시생성기",
    "정규식테스터",
    "LoremIpsum",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "개발자 도구 | JSON 포맷터, Base64, URL 인코딩, 해시 생성",
    description:
      "JSON 포맷팅/검증, Base64 인코딩/디코딩, URL 인코딩, UUID 생성, 해시 생성, 정규식 테스트, Lorem Ipsum 등 무료 온라인 도구 모음.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "개발자 도구",
  },
  twitter: {
    card: "summary_large_image",
    title: "개발자 도구 | JSON 포맷터, Base64, URL 인코딩",
    description:
      "JSON 포맷팅/검증, Base64 인코딩/디코딩, URL 인코딩, UUID 생성, 해시 생성, 정규식 테스트, Lorem Ipsum 등 무료 온라인 도구 모음.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "개발자 도구",
  url: SITE_URL,
  description:
    "JSON 포맷팅/검증, Base64 인코딩/디코딩, URL 인코딩, UUID 생성, 해시 생성, 정규식 테스트, Lorem Ipsum 등 개발자를 위한 무료 온라인 도구 모음입니다.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  featureList: [
    "JSON 포맷터/압축/검증",
    "Base64 인코딩/디코딩 (UTF-8 지원)",
    "URL 인코딩/디코딩",
    "UUID v4 생성기",
    "SHA-1/256/384/512 해시 생성",
    "정규식 테스터 (실시간 매칭)",
    "Lorem Ipsum 생성기 (한국어 지원)",
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
