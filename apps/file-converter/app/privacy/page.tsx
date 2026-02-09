import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://file.example.com";

export const metadata: Metadata = {
  title: "개인정보처리방침 - FileFlow",
  description:
    "FileFlow 개인정보처리방침. 파일은 브라우저 내에서만 처리되며 서버로 전송되지 않습니다.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--file-bg)]">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <h1 className="mb-8 text-3xl font-bold text-[var(--file-text)]">
          개인정보처리방침
        </h1>

        <p className="mb-6 text-sm text-[#78716C]">
          최종 수정일: 2025년 1월 1일
        </p>

        <div className="space-y-10 text-[var(--file-text)] leading-relaxed">
          {/* 서비스 개요 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">1. 서비스 개요</h2>
            <p>
              FileFlow(이하 &quot;서비스&quot;)는 브라우저 기반의 무료 파일 변환
              도구입니다. 본 서비스는 사용자의 파일을 서버로 전송하지 않으며, 모든
              파일 처리는 사용자의 브라우저(기기) 내에서 직접 수행됩니다.
            </p>
          </section>

          {/* 파일 처리 방식 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              2. 파일 처리 방식
            </h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                사용자가 선택한 파일은 브라우저의 메모리에서만 처리되며, 외부
                서버로 업로드되거나 전송되지 않습니다.
              </li>
              <li>
                변환된 파일은 사용자의 기기에 직접 다운로드되며, 서비스 측에서
                파일 데이터를 보관하지 않습니다.
              </li>
              <li>
                브라우저 탭을 닫거나 페이지를 새로고침하면 처리 중이던 파일
                데이터는 메모리에서 자동으로 삭제됩니다.
              </li>
            </ul>
          </section>

          {/* 수집 정보 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              3. 수집하는 정보
            </h2>
            <p className="mb-3">
              서비스 운영 및 개선을 위해 다음과 같은 정보를 수집할 수 있습니다.
            </p>

            <h3 className="mb-2 text-lg font-medium">
              3-1. Google Analytics를 통한 방문 데이터
            </h3>
            <p className="mb-3">
              본 서비스는 Google Analytics를 사용하여 웹사이트 방문 통계를
              수집합니다. 수집되는 정보에는 페이지 조회수, 방문 시간, 사용
              브라우저 및 기기 유형, 대략적인 지역 정보 등이 포함될 수 있습니다.
              이 데이터는 익명으로 처리되며, 개별 사용자를 식별하는 데 사용되지
              않습니다.
            </p>
            <p>
              Google Analytics의 개인정보 처리에 대한 자세한 내용은{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--file-primary)] underline"
              >
                Google 개인정보처리방침
              </a>
              을 참고하시기 바랍니다.
            </p>
          </section>

          {/* 쿠키 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">4. 쿠키 사용</h2>
            <p>
              본 서비스는 Google Analytics 및 광고 서비스 운영을 위해 쿠키를
              사용할 수 있습니다. 쿠키는 사용자의 브라우저에 저장되는 작은
              텍스트 파일로, 웹사이트 이용 패턴을 분석하는 데 활용됩니다.
              대부분의 브라우저에서 쿠키 설정을 변경하거나 쿠키 수신을 거부할 수
              있으며, 이 경우 서비스 이용에는 영향이 없습니다.
            </p>
          </section>

          {/* 광고 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">5. 광고</h2>
            <p>
              본 서비스는 Google AdSense를 통한 광고를 포함할 수 있습니다. 광고
              제공 과정에서 Google이 쿠키를 사용하여 사용자의 관심사에 기반한
              광고를 표시할 수 있습니다. 맞춤 광고 설정은{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--file-primary)] underline"
              >
                Google 광고 설정
              </a>
              에서 관리할 수 있습니다.
            </p>
          </section>

          {/* 제3자 제공 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              6. 개인정보의 제3자 제공
            </h2>
            <p>
              본 서비스는 사용자의 파일 데이터를 수집하지 않으므로, 제3자에게
              파일 데이터를 제공하지 않습니다. Google Analytics 및 Google
              AdSense를 통해 수집되는 익명 방문 데이터는 Google의 개인정보처리방침에
              따라 처리됩니다.
            </p>
          </section>

          {/* 아동 보호 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">7. 아동 보호</h2>
            <p>
              본 서비스는 만 14세 미만 아동의 개인정보를 의도적으로 수집하지
              않습니다.
            </p>
          </section>

          {/* 방침 변경 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              8. 개인정보처리방침의 변경
            </h2>
            <p>
              본 방침은 법령 변경이나 서비스 운영 방식 변경에 따라 수정될 수
              있으며, 변경 시 본 페이지를 통해 공지합니다.
            </p>
          </section>

          {/* 연락처 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">9. 문의</h2>
            <p>
              개인정보처리방침에 대한 문의사항이 있으시면 아래로 연락해 주시기
              바랍니다.
            </p>
            <p className="mt-2 text-sm text-[#78716C]">
              이메일: rlawlsdnjswk@gmail.com
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-[#E7E5E4] pt-6">
          <a
            href="/"
            className="text-sm text-[var(--file-primary)] hover:underline"
          >
            &larr; FileFlow 홈으로 돌아가기
          </a>
        </div>
      </div>
    </main>
  );
}
