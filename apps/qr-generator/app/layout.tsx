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

const SITE_URL = "https://qr.onekit.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "QR Studio - 무료 QR코드 생성기 | 색상 커스텀, 로고 삽입",
  description: "무료로 QR코드를 생성하세요. URL, Wi-Fi, 연락처, 이메일, SMS, 위치 QR코드 지원. 색상 커스텀, 로고 삽입, SVG 다운로드.",
  keywords: ["QR코드 생성기", "QR코드 만들기", "무료 QR코드", "QR코드 커스텀", "Wi-Fi QR코드"],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "QR Studio - 무료 QR코드 생성기",
    description: "색상 커스텀, 로고 삽입 가능한 무료 QR코드 생성기",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "QR Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Studio - 무료 QR코드 생성기",
    description: "색상 커스텀, 로고 삽입 가능한 무료 QR코드 생성기. URL, Wi-Fi, 연락처 등 다양한 QR코드를 무료로 생성하세요.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "QR Studio",
  "url": SITE_URL,
  "description": "무료로 QR코드를 생성하세요. URL, Wi-Fi, 연락처, 이메일, SMS, 위치 QR코드 지원. 색상 커스텀, 로고 삽입, SVG 다운로드.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW",
  },
  "featureList": [
    "URL QR코드 생성",
    "Wi-Fi QR코드 생성",
    "연락처 QR코드 생성",
    "이메일 QR코드 생성",
    "SMS QR코드 생성",
    "위치 QR코드 생성",
    "캘린더 QR코드 생성",
    "색상 커스텀",
    "로고 삽입",
    "SVG 다운로드",
  ],
  "inLanguage": "ko",
};

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "QR Studio - 무료 QR코드 생성기",
  "url": SITE_URL,
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "QR코드란 무엇인가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "QR코드(Quick Response Code)는 2차원 바코드의 일종으로, 스마트폰 카메라로 스캔하면 URL, 텍스트, 연락처 등의 정보를 빠르게 읽을 수 있습니다. 1994년 일본 덴소웨이브에서 개발되었으며, 현재 전 세계적으로 광범위하게 사용되고 있습니다.",
      },
    },
    {
      "@type": "Question",
      "name": "QR코드 색상 커스텀이 가능한가요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "네, QR Studio에서는 QR코드의 전경색과 배경색을 자유롭게 변경할 수 있습니다. 다만, QR코드 인식률을 위해 전경색과 배경색의 대비가 충분히 유지되어야 합니다. 너무 비슷한 색상을 사용하면 스캔이 어려울 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      "name": "QR코드에 로고를 삽입할 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "네, QR Studio에서는 QR코드 중앙에 로고 이미지를 삽입할 수 있습니다. 로고 삽입 시 오류 보정 레벨이 자동으로 H(30%)로 설정되어 로고로 가려진 부분을 보정합니다.",
      },
    },
    {
      "@type": "Question",
      "name": "생성된 QR코드는 어떤 형식으로 다운로드할 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "QR Studio에서 생성된 QR코드는 PNG 이미지와 SVG 벡터 형식으로 다운로드할 수 있습니다. SVG 형식은 크기를 자유롭게 조절해도 화질이 유지되어 인쇄물에 적합합니다.",
      },
    },
    {
      "@type": "Question",
      "name": "Wi-Fi QR코드는 어떻게 사용하나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wi-Fi QR코드를 생성하면, 다른 사람이 스마트폰 카메라로 QR코드를 스캔하여 비밀번호 입력 없이 자동으로 Wi-Fi에 연결할 수 있습니다. 네트워크 이름(SSID), 비밀번호, 암호화 방식을 입력하여 생성할 수 있습니다.",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
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
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          integrity="sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Ber6ja"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
