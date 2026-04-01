import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "./i18n";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://dot.onekit.co.kr";

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
        "text": "도트 아트(Dot Art)는 작은 점(픽셀)으로 이미지를 표현하는 디지털 아트 형식입니다. 게임보이, 닌텐도 등 레트로 게임에서 유래했으며, 최근에는 NFT 아트, 비즈공예 도안, SNS 프로필 이미지 등으로 인기가 높습니다.",
      },
    },
    {
      "@type": "Question",
      "name": "텍스트로 도트 아트를 만드는 방법은?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "텍스트를 입력하면 각 글자를 도트(픽셀) 패턴으로 자동 변환합니다. 한글, 영문, 숫자, 이모지 등을 지원하며, 팔레트 색상과 그리드 크기를 조절할 수 있습니다. 생성된 도트 아트는 PNG 이미지로 다운로드 가능합니다.",
      },
    },
    {
      "@type": "Question",
      "name": "이미지를 도트 아트로 변환할 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "네, 사진이나 이미지 파일을 업로드하면 자동으로 도트 아트 스타일로 변환됩니다. 해상도(그리드 크기), 팔레트(게임보이, 레트로 등), 도트 형태(원형/사각형)를 선택할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      "name": "도트 아트 그리드 크기는 어떻게 설정하나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "그리드 크기는 도트 하나의 크기를 결정합니다. 작은 값(8~12px)은 세밀한 표현이 가능하고, 큰 값(20~32px)은 레고/비즈공예 느낌의 큰 도트를 만듭니다. 이미지 크기와 용도에 맞게 조절하세요.",
      },
    },
    {
      "@type": "Question",
      "name": "도트 아트를 다운로드하려면 어떻게 하나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "도트 아트 생성 후 '다운로드' 버튼을 클릭하면 PNG 형식으로 저장됩니다. 생성된 이미지는 SNS 프로필, 블로그 꾸미기, 비즈공예 도안 등 다양한 용도로 활용할 수 있습니다.",
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
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
