import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://file.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "FileFlow - 무료 온라인 파일 변환기 | 이미지 압축, HEIC 변환",
  description:
    "100% 브라우저에서 처리되는 안전한 파일 변환기. PNG, JPG, WebP, HEIC 변환, 이미지 압축 및 리사이즈. 서버 업로드 없이 프라이버시 보호.",
  keywords: [
    "파일 변환기",
    "이미지 변환",
    "HEIC 변환",
    "이미지 압축",
    "PNG JPG 변환",
    "무료 변환기",
    "온라인 파일 변환",
    "WebP 변환",
    "이미지 리사이즈",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "FileFlow - 무료 온라인 파일 변환기",
    description:
      "100% 브라우저 처리, 서버 업로드 없는 안전한 파일 변환. PNG, JPG, WebP, HEIC 지원.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "FileFlow - 파일 변환기",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileFlow - 무료 온라인 파일 변환기",
    description:
      "100% 브라우저에서 처리되는 안전한 파일 변환기. PNG, JPG, WebP, HEIC 변환 지원.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FileFlow - 무료 온라인 파일 변환기",
  url: SITE_URL,
  description:
    "100% 브라우저에서 처리되는 안전한 파일 변환기. PNG, JPG, WebP, HEIC 변환, 이미지 압축 및 리사이즈.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  featureList: [
    "PNG, JPG, WebP, HEIC 이미지 형식 변환",
    "이미지 압축 및 리사이즈",
    "품질 조절 슬라이더",
    "100% 브라우저 처리 (서버 업로드 없음)",
    "개인정보 보호",
  ],
  inLanguage: "ko",
};

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FileFlow",
  url: SITE_URL,
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "파일이 서버에 업로드되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아닙니다. FileFlow는 100% 브라우저에서 파일을 처리합니다. 파일이 서버로 전송되지 않으며, 모든 변환 작업은 사용자의 기기에서 직접 수행됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "HEIC 파일이란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HEIC(High Efficiency Image Container)는 Apple이 iOS 11부터 기본 사진 형식으로 채택한 이미지 포맷입니다. JPG보다 높은 압축률로 동일한 화질의 사진을 더 작은 파일 크기로 저장할 수 있지만, Windows나 일부 앱에서 호환되지 않는 경우가 있어 PNG/JPG로 변환이 필요합니다.",
      },
    },
    {
      "@type": "Question",
      name: "이미지 변환 시 품질 손실이 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PNG에서 PNG로의 변환은 무손실이며, JPG/WebP 변환 시 품질 슬라이더로 압축률을 조절할 수 있습니다. 기본 설정(92%)에서는 육안으로 구별하기 어려운 수준의 최소한의 손실만 발생합니다.",
      },
    },
    {
      "@type": "Question",
      name: "한 번에 여러 파일을 변환할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 여러 파일을 동시에 드래그 앤 드롭하거나 선택하여 일괄 변환할 수 있습니다. 모든 파일은 순차적으로 브라우저에서 처리됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "지원하는 파일 형식은 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "현재 PNG, JPG(JPEG), WebP, GIF, HEIC 형식의 이미지 변환을 지원합니다. 각 형식 간 자유롭게 변환할 수 있으며, 이미지 리사이즈 및 압축 기능도 함께 제공합니다.",
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebApp),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftwareApp),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdFaq),
          }}
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
      <body className={`${inter.variable} antialiased font-inter`}>
        {children}
      </body>
    </html>
  );
}
