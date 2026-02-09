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

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 2025 | 4대보험 세금 공제 자동 계산",
  description:
    "2025년 최신 4대보험, 소득세 기준으로 연봉 실수령액을 정확하게 계산합니다. 연봉 3000만원~1억원 실수령액 표, 월급 역산 계산기 제공.",
  keywords: [
    "연봉 실수령액",
    "연봉 계산기",
    "2025 연봉",
    "4대보험 계산",
    "소득세 계산",
    "월급 계산기",
  ],
  openGraph: {
    title: "연봉 실수령액 계산기 2025",
    description: "4대보험, 소득세 자동 공제 계산",
    type: "website",
  },
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
        className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter-var)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
