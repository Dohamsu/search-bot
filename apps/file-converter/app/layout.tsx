import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
  ],
  openGraph: {
    title: "FileFlow - 무료 온라인 파일 변환기",
    description: "100% 브라우저 처리, 서버 업로드 없는 안전한 파일 변환",
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
      <body className={`${inter.variable} antialiased font-inter`}>
        {children}
      </body>
    </html>
  );
}
