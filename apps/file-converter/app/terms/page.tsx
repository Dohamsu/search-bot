import type { Metadata } from "next";

const SITE_URL = "https://file.onekit.co.kr";

export const metadata: Metadata = {
  title: "이용약관 - FileFlow",
  description:
    "FileFlow 이용약관. 무료 브라우저 기반 파일 변환 서비스의 이용 조건을 안내합니다.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--file-bg)]">
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <h1 className="mb-8 text-3xl font-bold text-[var(--file-text)]">
          이용약관
        </h1>

        <p className="mb-6 text-sm text-[#78716C]">
          최종 수정일: 2025년 1월 1일
        </p>

        <div className="space-y-10 text-[var(--file-text)] leading-relaxed">
          {/* 서비스 목적 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">1. 서비스 목적</h2>
            <p>
              FileFlow(이하 &quot;서비스&quot;)는 이미지 형식 변환, 압축, 리사이즈
              등의 파일 변환 기능을 무료로 제공하는 웹 기반 도구입니다. 본
              서비스를 이용함으로써 아래의 이용약관에 동의하는 것으로 간주됩니다.
            </p>
          </section>

          {/* 서비스 제공 방식 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              2. 서비스 제공 방식
            </h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                본 서비스는 사용자의 브라우저 내에서 파일을 처리하며, 파일이
                외부 서버로 전송되지 않습니다.
              </li>
              <li>
                서비스는 별도의 회원가입이나 로그인 없이 누구나 무료로 이용할 수
                있습니다.
              </li>
              <li>
                서비스 운영을 위해 페이지 내에 광고가 포함될 수 있습니다.
              </li>
            </ul>
          </section>

          {/* 면책 조항 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">3. 면책 조항</h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                파일 변환 과정에서 데이터 손실이나 품질 저하가 발생할 수
                있습니다. 변환 전 원본 파일을 반드시 별도로 보관하시기 바랍니다.
              </li>
              <li>
                서비스 이용으로 인해 발생하는 직접적 또는 간접적 손해에 대해
                서비스 제공자는 책임을 지지 않습니다.
              </li>
              <li>
                사용자의 브라우저 환경, 기기 성능, 운영체제 등에 따라 변환
                결과가 달라질 수 있습니다.
              </li>
            </ul>
          </section>

          {/* 지원 포맷 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              4. 지원 포맷 및 제한 사항
            </h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                현재 지원하는 이미지 형식: PNG, JPG(JPEG), WebP, GIF, HEIC
              </li>
              <li>
                HEIC 변환은 브라우저의 WebAssembly 지원 여부에 따라 동작하지
                않을 수 있습니다.
              </li>
              <li>
                매우 큰 파일이나 다수의 파일을 동시에 처리할 경우 브라우저
                성능에 따라 처리 속도가 느려지거나 실패할 수 있습니다.
              </li>
              <li>
                지원 포맷은 사전 고지 없이 추가 또는 변경될 수 있습니다.
              </li>
            </ul>
          </section>

          {/* 무보증 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">
              5. 서비스 무보증 (As-Is)
            </h2>
            <p>
              본 서비스는 &quot;있는 그대로(as-is)&quot; 제공되며, 명시적이든
              묵시적이든 어떠한 종류의 보증도 하지 않습니다. 여기에는
              상품성, 특정 목적에의 적합성, 비침해성에 대한 묵시적 보증이
              포함되나 이에 한정되지 않습니다.
            </p>
            <p className="mt-2">
              서비스 제공자는 서비스의 정확성, 신뢰성, 완전성 또는 연속성을
              보증하지 않으며, 서비스 중단이나 오류에 대한 책임을 지지
              않습니다.
            </p>
          </section>

          {/* 광고 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">6. 광고</h2>
            <p>
              본 서비스는 Google AdSense 등 제3자 광고 네트워크를 통한 광고를
              포함할 수 있습니다. 광고 내용은 서비스 제공자가 직접 관리하지
              않으며, 광고를 통한 외부 사이트 이용에 대해서는 해당 사이트의
              이용약관 및 개인정보처리방침이 적용됩니다.
            </p>
          </section>

          {/* 지식재산권 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">7. 지식재산권</h2>
            <p>
              사용자가 변환하는 파일에 대한 모든 권리는 사용자에게 있습니다.
              서비스 제공자는 사용자의 파일에 대해 어떠한 권리도 주장하지
              않습니다. 서비스의 디자인, 로고, 코드 등 서비스 자체에 대한
              지식재산권은 서비스 제공자에게 있습니다.
            </p>
          </section>

          {/* 약관 변경 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">8. 약관의 변경</h2>
            <p>
              본 약관은 서비스 운영상 필요에 따라 사전 고지 없이 변경될 수
              있으며, 변경된 약관은 본 페이지에 게시된 시점부터 효력이
              발생합니다. 서비스를 계속 이용하는 경우 변경된 약관에 동의한
              것으로 간주됩니다.
            </p>
          </section>

          {/* 문의 */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">9. 문의</h2>
            <p>
              이용약관에 대한 문의사항이 있으시면 아래로 연락해 주시기
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
