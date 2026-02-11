import type { Metadata } from "next";

const BASE_URL = "https://mbti.onekit.co.kr";

export const metadata: Metadata = {
  title: "이용약관 | 16가지 성격 유형 테스트",
  description: "16가지 성격 유형 테스트의 이용약관입니다.",
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading mb-8 text-2xl font-bold text-[var(--mbti-text)]">
        이용약관
      </h1>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            1. 서비스 소개
          </h2>
          <p>
            &quot;16가지 성격 유형 테스트&quot;(이하 &quot;서비스&quot;)는 간단한
            질문을 통해 사용자의 성격 유형을 분석해주는 무료 웹 서비스입니다. 본
            서비스를 이용함으로써 아래 약관에 동의하는 것으로 간주합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            2. 결과의 성격 및 면책
          </h2>
          <p>
            본 서비스에서 제공하는 테스트 결과는 오락 및 참고 목적으로만
            제공됩니다. 본 테스트는 전문적인 심리 진단, 상담, 또는 의학적 평가를
            대체하지 않으며, 전문적인 심리 검사로 간주되어서는 안 됩니다.
          </p>
          <p className="mt-2">
            테스트 결과를 바탕으로 한 어떠한 결정이나 행동에 대해서도 본 서비스는
            책임을 지지 않습니다. 심리적 문제나 고민이 있으시면 전문 상담사나 심리
            전문가에게 상담받으시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            3. 상표 관련 고지
          </h2>
          <p>
            MBTI(Myers-Briggs Type Indicator)는 The Myers-Briggs Company의 등록
            상표입니다. 본 서비스는 공식 MBTI 검사가 아니며, The Myers-Briggs
            Company와 제휴, 후원, 또는 인증 관계에 있지 않습니다.
          </p>
          <p className="mt-2">
            본 서비스는 칼 융(Carl Jung)의 성격 유형론에 기반한 독자적인 성격 유형
            분석 서비스입니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            4. 유명인 성격 유형 정보
          </h2>
          <p>
            본 서비스에서 제공하는 유명인의 성격 유형 정보는 공개적으로 알려진
            자료를 기반으로 한 추정이며, 해당 인물이 직접 확인하거나 공인한 정보가
            아닐 수 있습니다. 이 정보는 참고 목적으로만 제공됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            5. 지적재산권
          </h2>
          <p>
            본 서비스의 디자인, 콘텐츠, 코드 등 모든 지적재산은 서비스 운영자에게
            귀속됩니다. 사용자는 개인적인 목적으로 테스트 결과를 공유할 수 있으나,
            서비스의 콘텐츠를 무단으로 복제, 배포, 수정하여 상업적으로 이용할 수
            없습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            6. 광고
          </h2>
          <p>
            본 서비스는 무료로 제공되며, 운영 비용을 충당하기 위해 Google AdSense
            등의 광고 서비스를 통해 광고를 게재할 수 있습니다. 광고의 내용은 본
            서비스의 입장을 대변하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            7. 서비스 변경 및 중단
          </h2>
          <p>
            서비스 운영자는 사전 공지 없이 서비스의 내용을 변경하거나 서비스를
            중단할 수 있으며, 이로 인한 손해에 대해 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-[var(--mbti-text)]">
            8. 약관 변경
          </h2>
          <p>
            본 약관은 서비스 개선이나 법령 변경 등에 따라 수정될 수 있습니다. 변경
            시 본 페이지를 통해 공지합니다.
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
