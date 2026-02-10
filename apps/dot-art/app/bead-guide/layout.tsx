import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비즈공예 도안 생성기 | Dot Art Studio",
  description:
    "도트 아트를 비즈공예 도안으로 변환합니다. 아이로비즈, 펄러비즈에 사용할 수 있는 색상 번호 도안과 재료표를 자동 생성하고 인쇄/PDF로 저장하세요.",
  keywords: ["비즈공예", "비즈 도안", "아이로비즈", "펄러비즈", "도트 아트 비즈", "픽셀 비즈"],
  openGraph: {
    title: "비즈공예 도안 생성기 | Dot Art Studio",
    description: "도트 아트를 비즈공예 도안으로 변환. 색상 번호, 재료표 자동 생성. 인쇄/PDF 지원.",
  },
};

export default function BeadGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
