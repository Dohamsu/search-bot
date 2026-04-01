import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
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

const SITE_URL = "https://loan.onekit.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "대출이자 계산기 2026 | 원리금균등·원금균등·만기일시 상환",
  description:
    "대출금액, 이자율, 상환기간을 입력하면 월 상환액과 총 이자를 자동 계산합니다. 원리금균등상환, 원금균등상환, 만기일시상환 방식을 비교하고 월별 상환 스케줄을 확인하세요.",
  keywords: [
    "대출이자계산기",
    "주택담보대출",
    "원리금균등상환",
    "대출상환계산",
    "이자계산",
    "대출이자",
    "원금균등상환",
    "만기일시상환",
    "월상환액",
    "대출계산기",
  ],
  openGraph: {
    title: "대출이자 계산기 2026 | 원리금균등·원금균등·만기일시 상환",
    description:
      "대출금액, 이자율, 상환기간을 입력하면 월 상환액과 총 이자를 자동 계산합니다.",
    url: SITE_URL,
    siteName: "대출이자 계산기",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "대출이자 계산기 2026",
    description: "대출금액, 이자율, 상환기간으로 월 상환액과 총 이자를 계산하세요.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-YRKEEK84RK";
  const adsenseId = "ca-pub-3400073425613266";

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "원리금균등상환과 원금균등상환의 차이는 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "원리금균등상환은 매월 동일한 금액(원금+이자)을 상환하여 초기 부담이 적지만 총 이자가 많습니다. 원금균등상환은 매월 동일한 원금에 잔액 이자를 더해 상환하여 초기 상환액이 크지만 총 이자가 적습니다."
        }
      },
      {
        "@type": "Question",
        "name": "만기일시상환이란 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "만기일시상환은 대출 기간 동안 이자만 납부하다가 만기일에 원금을 한꺼번에 상환하는 방식입니다. 매월 납입금이 적어 부담이 작지만, 총 이자 부담이 가장 크고 만기에 목돈이 필요합니다."
        }
      },
      {
        "@type": "Question",
        "name": "대출 이자는 어떻게 계산하나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "대출 이자는 대출잔액 × 연이자율 ÷ 12로 매월 계산됩니다. 예를 들어 1억원을 연 4%로 빌리면 첫 달 이자는 1억 × 4% ÷ 12 = 약 33만원입니다. 원금 상환 방식에 따라 총 이자가 달라집니다."
        }
      },
      {
        "@type": "Question",
        "name": "대출 상환 방식 중 어떤 것이 유리한가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "총 이자 부담이 가장 적은 방식은 원금균등상환이며, 그 다음이 원리금균등상환, 만기일시상환 순입니다. 다만 원금균등상환은 초기 상환 부담이 크므로, 자금 여력에 따라 원리금균등상환을 선택하는 경우가 많습니다."
        }
      },
      {
        "@type": "Question",
        "name": "중도상환수수료란 무엇인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "중도상환수수료는 대출 만기 전에 원금을 갚을 때 부과되는 수수료입니다. 보통 대출 후 3년 이내에 상환 시 부과되며, 잔여 원금의 0.5~1.5% 수준입니다. 3년이 경과하면 대부분 면제됩니다."
        }
      }
    ]
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "대출이자 계산기",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description:
      "대출금액, 이자율, 상환기간을 입력하면 월 상환액과 총 이자를 자동 계산합니다.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    inLanguage: "ko",
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        {adsenseId && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter)] antialiased`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
