import type { Metadata } from "next";

const BASE_URL = "https://mbti.onekit.co.kr";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 16가지 성격 유형 테스트",
  description: "16가지 성격 유형 테스트의 개인정보처리방침입니다.",
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading mb-8 text-2xl font-bold text-[var(--mbti-text)]">
        개인정보처리방침
      </h1>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            1. 서비스 개요
          </h2>
          <p>
            &quot;16가지 성격 유형 테스트&quot;(이하 &quot;서비스&quot;)는 사용자의
            성격 유형을 분석하는 무료 웹 서비스입니다. 본 서비스는 회원가입을
            요구하지 않으며, 사용자의 개인정보를 별도로 수집하거나 저장하지
            않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            2. 수집하는 정보
          </h2>
          <p>
            본 서비스는 테스트 응답 데이터를 서버에 저장하지 않습니다. 모든 테스트
            처리는 사용자의 브라우저(클라이언트)에서 이루어지며, 테스트 결과는
            사용자의 기기에서만 생성됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            3. Google Analytics 사용
          </h2>
          <p>
            본 서비스는 웹사이트 이용 현황을 파악하기 위해 Google Analytics를 사용할
            수 있습니다. Google Analytics는 쿠키를 통해 다음과 같은 익명화된 정보를
            수집합니다:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>방문 페이지 및 체류 시간</li>
            <li>접속 지역 (국가/도시 수준)</li>
            <li>사용 기기 및 브라우저 종류</li>
            <li>유입 경로 (검색엔진, 직접 접속 등)</li>
          </ul>
          <p className="mt-2">
            수집된 데이터는 개인을 식별할 수 없는 형태로 처리되며, Google의
            개인정보처리방침에 따라 관리됩니다. 자세한 내용은{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--mbti-primary)] underline"
            >
              Google 개인정보처리방침
            </a>
            을 참고하세요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            4. 쿠키 안내
          </h2>
          <p>
            본 서비스는 다음과 같은 목적으로 쿠키를 사용할 수 있습니다:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Google Analytics를 통한 웹사이트 분석</li>
            <li>Google AdSense를 통한 광고 제공</li>
          </ul>
          <p className="mt-2">
            브라우저 설정을 통해 쿠키를 차단할 수 있으나, 이 경우 일부 서비스 이용에
            제한이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            5. 광고 서비스
          </h2>
          <p>
            본 서비스는 Google AdSense를 통해 광고를 게재할 수 있습니다. Google
            AdSense는 사용자의 관심사에 기반한 광고를 제공하기 위해 쿠키를 사용할 수
            있습니다. 자세한 내용은{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--mbti-primary)] underline"
            >
              Google 광고 정책
            </a>
            을 참고하세요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            6. 문의
          </h2>
          <p>
            개인정보처리방침에 관한 문의사항이 있으시면 아래 연락처로 문의해 주세요.
          </p>
          <p className="mt-2">
            이메일: rlawlsdnjswk@gmail.com
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            7. 방침 변경
          </h2>
          <p>
            본 개인정보처리방침은 법령이나 서비스 변경사항을 반영하기 위해 수정될 수
            있습니다. 변경 시 본 페이지를 통해 공지합니다.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            시행일: 2025년 1월 1일
          </p>
        </section>
      </div>

      <div className="mt-10">
        <a
          href="/"
          className="text-sm text-[var(--mbti-primary)] underline"
        >
          메인으로 돌아가기
        </a>
      </div>
    </main>
  );
}
