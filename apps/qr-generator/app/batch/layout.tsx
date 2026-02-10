import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://qr.example.com";

export const metadata: Metadata = {
  title: "QR코드 대량 생성 | QR Studio",
  description:
    "여러 개의 QR코드를 한 번에 생성하고 다운로드하세요. URL이나 텍스트를 줄바꿈으로 구분하여 최대 50개까지 일괄 생성 가능합니다.",
  keywords: [
    "QR코드 대량 생성",
    "QR코드 일괄 생성",
    "QR코드 배치",
    "QR코드 여러개",
    "대량 QR코드",
  ],
  alternates: {
    canonical: `${SITE_URL}/batch`,
  },
  openGraph: {
    title: "QR코드 대량 생성 | QR Studio",
    description:
      "여러 개의 QR코드를 한 번에 생성하고 다운로드하세요.",
    type: "website",
    url: `${SITE_URL}/batch`,
    locale: "ko_KR",
    siteName: "QR Studio",
  },
};

export default function BatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
