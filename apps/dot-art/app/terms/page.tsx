import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 | Dot Art Studio",
  description: "Dot Art Studio 서비스 이용약관. 서비스 이용 조건, 면책 사항 등을 안내합니다.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">이용약관</h1>
        <p className="text-sm text-gray-500 mb-8">
          시행일: 2025년 1월 1일 | 최종 수정: 2025년 1월 1일
        </p>

        <p className="text-gray-700 mb-8 leading-relaxed">
          본 약관은 Dot Art Studio(이하 &quot;서비스&quot;)의 이용 조건을 규정합니다.
          서비스를 이용함으로써 본 약관에 동의하는 것으로 간주됩니다.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
          <p className="text-gray-700 leading-relaxed">
            본 약관은 Dot Art Studio가 제공하는 무료 도트 아트 생성 도구 서비스의 이용에 관한
            기본적인 사항을 규정함을 목적으로 합니다. 본 서비스는 텍스트 입력을 통한 자동 도트 아트 생성,
            인터랙티브 그리드 에디터, AI 기반 픽셀 아트 생성 등의 기능을 제공하는 웹 기반 도구입니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (서비스 내용)</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>텍스트 입력 기반 도트 아트 자동 생성</li>
            <li>인터랙티브 그리드 에디터 (연필, 지우개, 페인트통, 스포이드)</li>
            <li>다양한 색상 팔레트 및 그리드 크기 커스터마이징</li>
            <li>프리셋 도트 아트 갤러리</li>
            <li>PNG 형식 다운로드</li>
            <li>AI 기반 고품질 픽셀 아트 생성 (Pro 모드, 사용자 API 키 필요)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (이용자의 의무 및 책임)</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>
              이용자는 본 서비스를 통해 생성한 도트 아트의 내용과 사용에 대해 전적으로 책임을 집니다.
            </li>
            <li>
              Pro 모드 사용 시 입력하는 OpenAI API 키의 관리 및 사용 비용에 대한 책임은 이용자에게 있습니다.
            </li>
            <li>
              이용자는 본 서비스를 이용하여 다음 행위를 해서는 안 됩니다.
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>불법적인 목적의 콘텐츠 생성</li>
                <li>타인의 권리를 침해하는 콘텐츠 생성</li>
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
              </ul>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (서비스 무보증)</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            본 서비스는 &quot;있는 그대로(AS-IS)&quot; 제공되며, 명시적이든 묵시적이든 어떠한 종류의
            보증도 제공하지 않습니다.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>서비스의 중단 없는 운영에 대한 보증</li>
            <li>생성된 도트 아트의 품질에 대한 보증</li>
            <li>Pro 모드 AI 생성 결과의 정확성에 대한 보증</li>
            <li>서비스의 오류 없음에 대한 보증</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (광고)</h2>
          <p className="text-gray-700 leading-relaxed">
            본 서비스는 운영 비용 충당을 위해 Google AdSense 등을 통한 광고를 포함할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (지적재산권)</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>
              본 서비스의 디자인, 소스코드, 로고, 서비스 명칭 등에 대한 지적재산권은
              서비스 운영자에게 귀속됩니다.
            </li>
            <li>
              이용자가 본 서비스를 이용하여 생성한 도트 아트에 대한 권리는 이용자에게 있으며,
              자유롭게 사용할 수 있습니다.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (서비스 변경 및 중단)</h2>
          <p className="text-gray-700 leading-relaxed">
            서비스 운영자는 필요한 경우 서비스의 내용을 변경하거나 서비스 제공을 중단할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (문의)</h2>
          <p className="text-gray-700 leading-relaxed">
            본 약관에 대한 문의사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
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
