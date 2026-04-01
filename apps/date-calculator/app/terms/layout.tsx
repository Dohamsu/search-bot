import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | 날짜 계산기",
  description: "날짜 계산기 서비스의 이용약관입니다.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
