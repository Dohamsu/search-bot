import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 색상 도구",
  description: "색상 도구 서비스의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <article className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 md:p-10">
        <h1 className="text-xl font-bold text-slate-800">개인정보처리방침</h1>
        <p className="mt-1 text-sm text-slate-500">최종 수정일: 2026년 1월 1일</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="font-semibold text-slate-800">1. 서비스 개요</h2>
            <p className="mt-2">
              &ldquo;색상 도구&rdquo;(이하 &ldquo;서비스&rdquo;)는 색상 변환, 팔레트
              생성, 명도 대비 검사 등을 제공하는 무료 온라인 도구입니다. 서비스는
              사용자의 개인정보를 최소한으로 처리하며, 아래 방침에 따라 이를 관리합니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">2. 처리하는 개인정보 항목</h2>
            <p className="mt-2">
              서비스는 회원가입을 요구하지 않으며, 사용자가 입력하는 데이터는 서버에
              저장되지 않고 브라우저 내에서만 처리됩니다.
            </p>
            <p className="mt-2">
              다만 서비스 개선 및 이용 통계 분석을 위해 Google Analytics를 통해 다음과
              같은 방문 데이터를 자동으로 수집할 수 있습니다.
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>방문 페이지 URL, 접속 시간</li>
              <li>브라우저 종류, 운영체제, 화면 해상도</li>
              <li>대략적인 접속 지역 (IP 기반, 익명 처리)</li>
              <li>페이지 체류 시간, 이동 경로</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">3. 수집 목적</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>서비스 이용 현황 파악 및 통계 분석</li>
              <li>서비스 품질 개선 및 사용자 경험 향상</li>
              <li>오류 탐지 및 기술적 문제 해결</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">4. 보유 기간</h2>
            <p className="mt-2">
              Google Analytics를 통해 수집된 데이터는 Google의 데이터 보존 정책에 따라
              처리되며, 기본 보존 기간은 14개월입니다. 서비스 운영자는 별도의 개인정보
              데이터베이스를 운영하지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">5. Google Analytics 사용 고지</h2>
            <p className="mt-2">
              서비스는 Google Inc.가 제공하는 웹 분석 서비스인 Google Analytics를
              사용합니다. Google Analytics는 쿠키를 사용하여 웹사이트 이용 정보를
              수집하며, 수집된 정보는 Google 서버에 전송되어 저장됩니다. 자세한 내용은{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Google 개인정보처리방침
              </a>
              을 참고하시기 바랍니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">6. 쿠키 사용 안내</h2>
            <p className="mt-2">
              서비스는 Google Analytics 및 Google AdSense의 작동을 위해 쿠키를 사용할 수
              있습니다. 쿠키는 사용자의 브라우저에 저장되는 소량의 데이터 파일로, 서비스
              이용 분석 및 맞춤형 광고 제공에 활용됩니다. 사용자는 브라우저 설정을 통해
              쿠키 저장을 거부할 수 있으나, 이 경우 일부 기능 이용이 제한될 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">7. 문의처</h2>
            <p className="mt-2">
              개인정보 처리와 관련한 문의 사항은 아래 이메일로 연락해 주시기 바랍니다.
            </p>
            <p className="mt-2">
              이메일:{" "}
              <a
                href="mailto:rlawlsdnjswk@gmail.com"
                className="text-blue-600 underline hover:text-blue-800"
              >
                rlawlsdnjswk@gmail.com
              </a>
            </p>
          </div>
        </section>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <Link
            href="/"
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </article>
    </main>
  );
}
