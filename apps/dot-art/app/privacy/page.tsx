import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Dot Art Studio",
  description: "Dot Art Studio 개인정보처리방침. 수집하는 정보, 이용 목적, 보관 기간 등을 안내합니다.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-sm text-gray-500 mb-8">
          시행일: 2025년 1월 1일 | 최종 수정: 2025년 1월 1일
        </p>

        <p className="text-gray-700 mb-8 leading-relaxed">
          Dot Art Studio(이하 &quot;서비스&quot;)는 이용자의 개인정보를 소중히 여기며,
          관련 법령에 따라 개인정보를 보호하고 이에 관한 고충을 신속하게 처리하기 위하여
          다음과 같이 개인정보처리방침을 수립하여 공개합니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 처리하는 개인정보 항목</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            본 서비스는 회원가입 절차 없이 이용 가능하며, 별도의 개인정보를 직접 수집하지 않습니다.
            다만 다음과 같은 정보가 자동으로 생성 또는 저장될 수 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Google Analytics 방문 데이터:</strong> 페이지 방문 기록, 브라우저 종류,
              운영체제, 방문 시간, 참조 URL 등 비식별 통계 데이터가 Google Analytics를 통해 수집됩니다.
            </li>
            <li>
              <strong>Pro 모드 API 키:</strong> 이용자가 Pro 모드 사용을 위해 입력한 OpenAI API 키는
              브라우저의 sessionStorage에만 임시 저장되며, 서버로 전송되거나 별도 저장되지 않습니다.
              브라우저 탭을 닫으면 즉시 삭제됩니다.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보 이용 목적</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>서비스 이용 통계 분석 및 서비스 개선 (Google Analytics)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 쿠키 및 추적 기술</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            본 서비스는 Google Analytics를 사용하며, 이 과정에서 쿠키가 사용될 수 있습니다.
          </p>
          <p className="text-gray-700 leading-relaxed">
            이용자는 브라우저 설정을 통해 쿠키 수집을 거부할 수 있으며,
            Google Analytics의 데이터 수집을 차단하려면{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            을 설치할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보 보관 및 파기</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Google Analytics 데이터는 Google의 데이터 보관 정책에 따르며, 기본 보관 기간은 14개월입니다.
            </li>
            <li>
              Pro 모드 API 키는 sessionStorage에만 저장되어 탭 종료 시 즉시 파기됩니다.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 제3자 제공</h2>
          <p className="text-gray-700 leading-relaxed">
            본 서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다.
            다만, Google Analytics 사용에 따라 비식별 통계 데이터가 Google에 전달될 수 있습니다.
            Pro 모드 사용 시 이용자의 프롬프트가 OpenAI API로 직접 전송되며,
            이에 대한 책임은{" "}
            <a
              href="https://openai.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              OpenAI 개인정보처리방침
            </a>
            을 참고하시기 바랍니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 광고</h2>
          <p className="text-gray-700 leading-relaxed">
            본 서비스는 Google AdSense를 통한 광고를 포함할 수 있습니다.
            광고 제공 과정에서 쿠키 및 유사 기술이 사용될 수 있으며,
            이에 대한 자세한 내용은{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Google 광고 정책
            </a>
            을 참고하시기 바랍니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 이용자의 권리</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>브라우저 설정을 통해 쿠키 수집을 거부할 수 있습니다.</li>
            <li>Google Analytics Opt-out 도구를 통해 방문 데이터 수집을 차단할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 연락처</h2>
          <p className="text-gray-700 leading-relaxed">
            개인정보처리방침에 대한 문의사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
          </p>
          <p className="text-gray-700 mt-2">
            이메일:{" "}
            <a href="mailto:rlawlsdnjswk@gmail.com" className="text-indigo-600 hover:underline">
              rlawlsdnjswk@gmail.com
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
