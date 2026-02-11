import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-var",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk-var",
  subsets: ["latin"],
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
        {children}
      </body>
    </html>
  );
}
