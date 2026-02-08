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
  title: "연봉 실수령액 계산기",
  description: "2024년 기준 연봉 실수령액을 간편하게 계산해 보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-[family-name:var(--font-inter-var)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
