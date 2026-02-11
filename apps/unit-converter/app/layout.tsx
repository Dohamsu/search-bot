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
  process.env.NEXT_PUBLIC_SITE_URL || "https://unitconv.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "단위 변환기 | 길이, 무게, 넓이, 온도, 속도, 데이터 변환",
  description:
    "길이, 무게, 넓이, 부피, 온도, 속도, 데이터 등 다양한 단위를 쉽고 빠르게 변환하세요. 평↔㎡, 근↔kg, °C↔°F 등 한국에서 자주 쓰는 단위 변환을 지원합니다.",
  keywords: [
    "단위변환기",
    "평수계산",
    "근kg변환",
    "온도변환",
    "속도변환",
    "단위계산기",
    "길이변환",
    "무게변환",
    "넓이변환",
    "부피변환",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "단위 변환기 | 길이, 무게, 넓이, 온도, 속도, 데이터 변환",
    description:
      "평↔㎡, 근↔kg, °C↔°F 등 다양한 단위를 쉽고 빠르게 변환하세요.",
    type: "website",
    url: SITE_URL,
    locale: "ko_KR",
    siteName: "단위 변환기",
  },
  twitter: {
    card: "summary_large_image",
    title: "단위 변환기 | 길이, 무게, 넓이, 온도, 속도, 데이터 변환",
    description:
      "평↔㎡, 근↔kg, °C↔°F 등 다양한 단위를 쉽고 빠르게 변환하세요.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "단위 변환기",
  url: SITE_URL,
  description:
    "길이, 무게, 넓이, 부피, 온도, 속도, 데이터 등 다양한 단위를 쉽고 빠르게 변환하세요.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  featureList: [
    "길이 단위 변환 (mm, cm, m, km, in, ft, yd, mi, 리, 자, 치)",
    "무게 단위 변환 (mg, g, kg, t, oz, lb, 근, 냥, 돈)",
    "넓이 단위 변환 (㎟, ㎠, ㎡, ㎢, ha, ac, 평, 정)",
    "부피 단위 변환 (mL, L, ㎥, gal, qt, pt, fl oz, cup, 홉, 되, 말)",
    "온도 변환 (°C, °F, K)",
    "속도 변환 (m/s, km/h, mph, kn, 마하)",
    "데이터 단위 변환 (bit, B, KB, MB, GB, TB, PB)",
    "시간 단위 변환 (초, 분, 시, 일, 주, 월, 년)",
    "실시간 변환 결과",
    "한국 전통 단위 지원",
  ],
  inLanguage: "ko",
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "1평은 몇 제곱미터인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1평은 약 3.305785 제곱미터(㎡)입니다. 한국에서 부동산 면적을 나타낼 때 자주 사용하는 단위로, 정확히는 400/121 ㎡입니다.",
      },
    },
    {
      "@type": "Question",
      name: "1근은 몇 kg인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "한국에서 1근은 600g(0.6kg)입니다. 주로 고기, 채소 등 식재료의 무게를 나타낼 때 사용합니다.",
      },
    },
    {
      "@type": "Question",
      name: "섭씨 0도는 화씨 몇 도인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "섭씨 0°C는 화씨 32°F입니다. 변환 공식은 °F = °C × 9/5 + 32 입니다.",
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
