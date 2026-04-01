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

const SITE_URL = "https://color.onekit.co.kr";

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "HEX 색상 코드란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "HEX 색상 코드는 #RRGGBB 형식으로 색상을 16진수로 표현한 것입니다. 예를 들어 #FF0000은 빨강, #00FF00은 초록, #0000FF은 파랑입니다. 웹 디자인에서 가장 많이 사용되는 색상 표기법입니다."
      }
    },
    {
      "@type": "Question",
      "name": "RGB와 HSL의 차이는 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "RGB는 빨강·초록·파랑의 혼합으로 색상을 표현하고, HSL은 색조(Hue)·채도(Saturation)·명도(Lightness)로 표현합니다. HSL이 인간의 색상 인식에 더 직관적이어서 색상 조절 시 유용합니다."
      }
    },
    {
      "@type": "Question",
      "name": "색상 대비 비율이란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "색상 대비 비율은 두 색상 간의 밝기 차이를 나타내는 수치로, WCAG 웹 접근성 기준에서 사용됩니다. 일반 텍스트는 4.5:1 이상, 큰 텍스트는 3:1 이상의 대비 비율을 충족해야 접근성 AA 등급을 만족합니다."
      }
    },
    {
      "@type": "Question",
      "name": "보색은 어떻게 찾나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "보색은 색상환에서 정반대(180도)에 위치한 색입니다. 예를 들어 빨강의 보색은 청록(Cyan), 파랑의 보색은 노랑입니다. 보색을 함께 사용하면 강한 대비 효과를 줄 수 있어 디자인에서 포인트 색상으로 활용됩니다."
      }
    },
    {
      "@type": "Question",
      "name": "웹 접근성 색상 기준은 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WCAG 2.1 기준으로 텍스트와 배경의 명도 대비는 AA 등급(일반 텍스트 4.5:1, 큰 텍스트 3:1) 이상이어야 합니다. AAA 등급은 일반 텍스트 7:1, 큰 텍스트 4.5:1입니다. 색상만으로 정보를 전달하지 않고 패턴이나 텍스트를 병행해야 합니다."
      }
    }
  ]
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
  const gaId = "G-YRKEEK84RK";
  const adsenseId = "ca-pub-3400073425613266";

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
