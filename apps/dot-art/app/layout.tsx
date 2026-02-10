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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dotart.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dot Art Studio - 무료 도트 아트 생성기 | 픽셀 아트 메이커",
  description: "텍스트를 입력하면 도트 아트가 자동으로 생성됩니다. 그리드 에디터로 직접 픽셀을 찍거나 AI로 고품질 픽셀 아트를 만들어보세요. 무료 다운로드.",
  keywords: ["도트 아트", "픽셀 아트", "도트 아트 생성기", "픽셀 아트 메이커", "도트 그림"],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Dot Art Studio - 무료 도트 아트 생성기",
    description: "텍스트 입력으로 도트 아트를 자동 생성. 그리드 에디터와 AI 모드 지원.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "Dot Art Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dot Art Studio - 무료 도트 아트 생성기",
    description: "텍스트 입력으로 도트 아트를 자동 생성. 그리드 에디터와 AI 모드 지원. 무료 PNG 다운로드.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Dot Art Studio",
  "url": SITE_URL,
  "description": "텍스트를 입력하면 도트 아트가 자동으로 생성됩니다. 그리드 에디터로 직접 픽셀을 찍거나 AI로 고품질 픽셀 아트를 만들어보세요.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW",
  },
  "featureList": [
    "텍스트 → 도트 아트 자동 생성",
    "인터랙티브 그리드 에디터",
    "다양한 색상 팔레트",
    "도트 크기/모양 커스텀",
    "PNG 다운로드",
    "프리셋 갤러리",
    "AI 픽셀 아트 생성 (Pro)",
  ],
  "inLanguage": "ko",
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "도트 아트란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "도트 아트(Dot Art)는 작은 점(도트) 또는 사각형 픽셀을 이용해 이미지를 표현하는 디지털 아트 형식입니다. 레트로 게임 그래픽에서 유래했으며, 현재도 인디 게임, 이모티콘, SNS 프로필 이미지 등에 널리 활용됩니다.",
      },
    },
    {
      "@type": "Question",
      "name": "어떻게 도트 아트를 만들 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dot Art Studio에서는 세 가지 방법으로 도트 아트를 만들 수 있습니다. 1) 자동 생성: 텍스트를 입력하면 이모지 매핑을 통해 자동으로 도트 아트가 생성됩니다. 2) 그리드 에디터: 직접 픽셀을 찍어 원하는 그림을 그릴 수 있습니다. 3) Pro 모드: OpenAI API를 활용해 AI가 고품질 픽셀 아트를 생성합니다.",
      },
    },
    {
      "@type": "Question",
      "name": "생성된 도트 아트를 다운로드할 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "네, 생성된 도트 아트는 PNG 이미지 파일로 다운로드할 수 있습니다. 그리드 크기(8x8, 16x16, 32x32, 64x64)와 도트 스타일(사각형, 원형)을 선택한 뒤 다운로드 버튼을 클릭하면 됩니다.",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
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
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
