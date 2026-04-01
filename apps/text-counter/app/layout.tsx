import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "./i18n";

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

const SITE_URL = "https://text.onekit.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "글자수 세기 | 공백 포함/제외, 바이트 수, 단어 수 실시간 계산",
  description:
    "텍스트의 글자수, 단어수, 바이트수를 실시간으로 확인하세요. 공백 포함/제외, SNS 글자수 제한 확인, 원고지 매수 계산 등 다양한 텍스트 도구를 무료로 제공합니다.",
  keywords: [
    "글자수세기",
    "글자수카운터",
    "바이트계산",
    "단어수세기",
    "원고지매수",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "글자수 세기 | 실시간 글자수 카운터",
    description:
      "텍스트의 글자수, 단어수, 바이트수를 실시간으로 확인하세요. 공백 포함/제외, SNS 글자수 제한 확인, 원고지 매수 계산 등 다양한 텍스트 도구를 무료로 제공합니다.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "글자수 세기",
  },
  twitter: {
    card: "summary_large_image",
    title: "글자수 세기 | 실시간 글자수 카운터",
    description:
      "글자수, 단어수, 바이트수를 실시간으로 확인하세요. SNS 글자수 제한 확인, 원고지 매수 계산까지.",
  },
};

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "글자수 세기",
  url: SITE_URL,
  description:
    "텍스트의 글자수, 단어수, 바이트수를 실시간으로 확인하세요. 공백 포함/제외, SNS 글자수 제한 확인, 원고지 매수 계산 등 다양한 텍스트 도구를 무료로 제공합니다.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  inLanguage: "ko",
  browserRequirements: "Requires JavaScript",
  softwareVersion: "1.0",
  creator: {
    "@type": "Organization",
    name: "글자수 세기",
    url: SITE_URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "글자수와 바이트 수의 차이는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "글자수는 문자의 개수를 세는 것이고, 바이트 수는 해당 문자가 차지하는 저장 공간입니다. 한글은 UTF-8 기준 한 글자당 3바이트, 영문·숫자는 1바이트를 차지합니다. 예를 들어 '안녕'은 2글자이지만 6바이트입니다.",
      },
    },
    {
      "@type": "Question",
      name: "공백 포함 글자수와 미포함 글자수의 차이는?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "공백 포함 글자수는 띄어쓰기, 탭 등 모든 공백 문자를 포함한 총 문자 수이고, 공백 미포함 글자수는 공백을 제외한 순수 문자 수입니다. 대학 레포트나 공모전 등에서는 보통 공백 포함 기준을 사용합니다.",
      },
    },
    {
      "@type": "Question",
      name: "SNS별 글자수 제한은 어떻게 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "주요 SNS 글자수 제한: X(트위터) 280자, 인스타그램 캡션 2,200자, 카카오톡 메시지 1만자, 네이버 블로그 제목 100자, 유튜브 제목 100자·설명 5,000자입니다. 한글과 영문 모두 1글자로 계산됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "원고지 매수는 어떻게 계산하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "200자 원고지 기준으로 공백 포함 총 글자수를 200으로 나누면 원고지 매수가 됩니다. 예를 들어 2,000자 글은 200자 원고지 10매에 해당합니다. 문학상 응모 시 주로 이 기준을 사용합니다.",
      },
    },
    {
      "@type": "Question",
      name: "한글 바이트 수는 어떻게 계산하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "한글 바이트 수는 인코딩 방식에 따라 다릅니다. UTF-8에서는 한글 1자 = 3바이트, EUC-KR(CP949)에서는 2바이트입니다. SMS 문자(EUC-KR) 기준 한글 1자 = 2바이트로, 80바이트(한글 40자) 초과 시 장문(LMS)으로 전환됩니다.",
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
  const adsenseId = "ca-pub-3400073425613266";

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
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
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
