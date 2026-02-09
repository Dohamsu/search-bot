import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관 | 연봉 실수령액 계산기",
  description: "연봉 실수령액 계산기 서비스의 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <article className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6 md:p-10">
        <h1 className="text-xl font-bold text-slate-800">이용약관</h1>
        <p className="mt-1 text-sm text-slate-500">최종 수정일: 2025년 1월 1일</p>

        <section className="mt-8 space-y-6 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="font-semibold text-slate-800">제1조 (목적)</h2>
            <p className="mt-2">
              본 약관은 &ldquo;연봉 실수령액 계산기&rdquo;(이하 &ldquo;서비스&rdquo;)의
              이용 조건 및 절차에 관한 사항을 정하는 것을 목적으로 합니다. 서비스는
              사용자에게 연봉 기반 세후 실수령액 참고 계산 도구를 무료로 제공합니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">제2조 (서비스의 성격)</h2>
            <p className="mt-2">
              서비스는 2025년 근로소득 간이세액표 및 4대보험 요율을 기반으로 연봉
              실수령액을 참고용으로 계산하는 도구입니다. 서비스가 제공하는 모든 계산
              결과는 참고 목적으로만 제공되며, 세무, 법률, 재정 관련 전문 상담을
              대체하지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">제3조 (면책 사항)</h2>
            <ul className="mt-2 list-disc pl-5 space-y-2">
              <li>
                서비스가 제공하는 계산 결과는 참고용이며, 그 정확성이나 완전성을
                보장하지 않습니다. 계산 결과에 법적 효력은 없습니다.
              </li>
              <li>
                실제 급여 수령액은 연말정산, 추가 공제 항목, 회사별 급여 체계 등에 따라
                달라질 수 있습니다.
              </li>
              <li>
                서비스 이용으로 인해 발생하는 직접적 또는 간접적 손해에 대해 서비스
                운영자는 책임을 지지 않습니다.
              </li>
              <li>
                세금 및 급여 관련 의사결정은 반드시 국세청, 세무사 등 전문가의 상담을
                받으시기 바랍니다.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">제4조 (지적재산권)</h2>
            <p className="mt-2">
              서비스에 포함된 모든 콘텐츠(디자인, 텍스트, 소스 코드, 로고 등)에 대한
              지적재산권은 서비스 운영자에게 귀속됩니다. 사용자는 서비스 운영자의 사전
              서면 동의 없이 이를 복제, 배포, 수정, 상업적으로 이용할 수 없습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">제5조 (서비스 변경 및 중단)</h2>
            <p className="mt-2">
              서비스 운영자는 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를
              변경하거나 중단할 수 있습니다. 서비스 변경 또는 중단에 따른 사용자의 손해에
              대해 서비스 운영자는 별도의 보상 의무를 지지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">제6조 (광고)</h2>
            <p className="mt-2">
              서비스는 운영 비용 충당을 위해 Google AdSense 등의 광고를 포함할 수
              있습니다. 광고에 의한 거래는 사용자와 광고주 간의 문제이며, 서비스 운영자는
              이에 대해 책임을 지지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">제7조 (약관의 변경)</h2>
            <p className="mt-2">
              서비스 운영자는 관련 법령에 위배되지 않는 범위 내에서 본 약관을 변경할 수
              있으며, 변경된 약관은 서비스 내에 공지함으로써 효력이 발생합니다.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-slate-800">제8조 (문의)</h2>
            <p className="mt-2">
              본 약관에 관한 문의 사항은 아래 이메일로 연락해 주시기 바랍니다.
            </p>
            <p className="mt-2">
              이메일:{" "}
              <a
                href="mailto:contact@example.com"
                className="text-blue-600 underline hover:text-blue-800"
              >
                contact@example.com
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
