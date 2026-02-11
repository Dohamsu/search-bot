import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 공과금 계산기",
  description: "공과금 계산기 서비스의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">개인정보처리방침</h1>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              1. 수집하는 개인정보
            </h2>
            <p>
              본 서비스는 별도의 회원가입 없이 이용 가능하며, 개인정보를 수집하지
              않습니다. 모든 계산은 사용자의 브라우저에서 수행되며, 입력 데이터는
              서버로 전송되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              2. 쿠키 및 분석 도구
            </h2>
            <p>
              서비스 개선을 위해 Google Analytics를 사용할 수 있으며, 이 경우
              익명화된 사용 통계만 수집됩니다. Google AdSense를 통한 광고가
              표시될 수 있으며, 광고 관련 쿠키가 사용될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              3. 제3자 제공
            </h2>
            <p>수집된 정보는 제3자에게 제공되지 않습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              4. 문의
            </h2>
            <p>
              개인정보 관련 문의사항은 서비스 내 문의 채널을 통해 연락해 주시기
              바랍니다.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-sm text-yellow-700 hover:text-yellow-800 underline"
          >
            메인으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
