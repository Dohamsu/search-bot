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

const SITE_URL = "https://dev.onekit.co.kr";

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "JSON 포맷팅이란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON 포맷팅은 압축되거나 읽기 어려운 JSON 데이터를 들여쓰기와 줄바꿈을 적용해 가독성 높게 정리하는 것입니다. API 응답 디버깅, 설정 파일 편집 시 유용하며, 동시에 JSON 구문 오류도 검증할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "Base64 인코딩이란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Base64는 바이너리 데이터를 ASCII 문자열로 변환하는 인코딩 방식입니다. 이미지를 HTML에 직접 삽입하거나, 이메일 첨부파일 전송, API 인증 토큰 등에 사용됩니다. 원본 대비 약 33% 크기가 증가합니다.",
      },
    },
    {
      "@type": "Question",
      name: "UUID란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UUID(Universally Unique Identifier)는 전 세계적으로 고유한 128비트 식별자입니다. 데이터베이스 기본키, API 요청 추적, 파일 이름 등에 사용됩니다. v4는 무작위 생성, v7은 시간순 정렬이 가능합니다.",
      },
    },
    {
      "@type": "Question",
      name: "URL 인코딩이 필요한 이유는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "URL에는 한글, 공백, 특수문자(&, =, ? 등)를 직접 사용할 수 없습니다. URL 인코딩은 이런 문자를 %XX 형식으로 변환하여 안전하게 전송합니다. 예를 들어 공백은 %20, 한글 '가'는 %EA%B0%80으로 변환됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "해시 함수란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "해시 함수는 임의 길이의 데이터를 고정 길이의 해시값으로 변환하는 단방향 함수입니다. 비밀번호 저장, 파일 무결성 검증, 디지털 서명에 사용됩니다. SHA-256이 현재 표준이며, MD5는 보안 취약으로 사용이 권장되지 않습니다.",
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
