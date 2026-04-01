import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 날짜 계산기",
  description: "날짜 계산기 서비스의 개인정보처리방침입니다.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
