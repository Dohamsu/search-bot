"use client";

import { useState } from "react";
import {
  Palette,
  Droplets,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  Eye,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* FAQ Accordion Item                                                  */
/* ------------------------------------------------------------------ */
function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-gray-800 transition-colors hover:text-[var(--color-primary)]"
      >
        <span className="flex items-center gap-2">
          <HelpCircle size={16} className="shrink-0 text-[var(--color-accent)]" />
          {question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-4 pl-7 text-sm leading-relaxed text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Section                                                        */
/* ------------------------------------------------------------------ */
export default function ColorInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      {/* ---- 1. 색상 체계 이해하기 ---- */}
      <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <Palette size={22} className="text-[var(--color-primary)]" />
          색상 체계 이해하기
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-gray-700">
          <div>
            <h3 className="mb-1 font-semibold text-gray-800">HEX (16진수)</h3>
            <p>
              HEX는 <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">#RRGGBB</code> 형식으로 색상을 표현합니다.
              웹 개발에서 가장 널리 사용되며, CSS에서 직접 사용할 수 있어 편리합니다.
              예를 들어 <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">#A855F7</code>은 보라색을 나타냅니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-800">RGB (Red, Green, Blue)</h3>
            <p>
              빛의 3원색인 빨강(R), 초록(G), 파랑(B)을 0~255 범위로 조합하여 색상을 만듭니다.
              모니터, TV 등 디스플레이 장치에서 사용되며, 웹에서는{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">rgb(168, 85, 247)</code> 형식으로 작성합니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-800">HSL (Hue, Saturation, Lightness)</h3>
            <p>
              색상(H: 0~360도), 채도(S: 0~100%), 명도(L: 0~100%)로 색을 표현합니다.
              사람의 색상 인지 방식과 가장 유사하여 디자이너들이 색상 조합을 만들 때 직관적으로 사용할 수 있습니다.
              채도와 명도를 쉽게 조절할 수 있어 색상 팔레트 생성에 유리합니다.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-800">CMYK (Cyan, Magenta, Yellow, Key/Black)</h3>
            <p>
              인쇄 매체에서 사용하는 감법 혼색 체계입니다. 시안(C), 마젠타(M), 노랑(Y), 검정(K)의 잉크 비율로 색을 표현합니다.
              포스터, 명함, 브로슈어 등 인쇄물 디자인 시 반드시 CMYK 모드를 사용해야 정확한 색상 출력이 가능합니다.
            </p>
          </div>
          <div className="rounded-lg bg-[var(--color-bg)] p-4">
            <p className="font-semibold text-gray-800 mb-1">언제 어떤 체계를 사용할까?</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>웹 개발</strong> &mdash; HEX 또는 RGB (CSS에서 바로 사용 가능)</li>
              <li><strong>인쇄 디자인</strong> &mdash; CMYK (정확한 인쇄 색상 재현)</li>
              <li><strong>UI/UX 디자인</strong> &mdash; HSL (직관적인 색상 조절과 팔레트 생성)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---- 2. 색상 조합의 기본 원리 ---- */}
      <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <Droplets size={22} className="text-[var(--color-primary)]" />
          색상 조합의 기본 원리
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-gray-700">
          <p>
            효과적인 색상 조합은 색상환(Color Wheel)의 관계를 기반으로 합니다.
            다음은 가장 널리 사용되는 색상 조화 규칙입니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="mb-1 font-semibold text-gray-800">보색 (Complementary)</h3>
              <p className="text-gray-600">
                색상환에서 정반대에 위치한 두 색의 조합입니다. 빨강-초록, 파랑-주황처럼 강한 대비를 만들어
                시선을 끌고 싶은 요소에 적합합니다.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="mb-1 font-semibold text-gray-800">유사색 (Analogous)</h3>
              <p className="text-gray-600">
                색상환에서 인접한 3~4개 색상의 조합입니다. 파랑-청록-초록처럼 자연스럽고 편안한 느낌을 주어
                배경이나 전체 분위기 조성에 효과적입니다.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="mb-1 font-semibold text-gray-800">삼색 조합 (Triadic)</h3>
              <p className="text-gray-600">
                색상환에서 120도 간격으로 배치된 세 색상의 조합입니다. 빨강-노랑-파랑처럼
                균형 잡힌 다채로운 디자인을 만들 수 있습니다.
              </p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="mb-1 font-semibold text-gray-800">분할 보색 (Split-Complementary)</h3>
              <p className="text-gray-600">
                보색의 양쪽 인접 색상을 사용하는 조합입니다. 보색만큼 강렬하지 않으면서도
                풍부한 대비를 제공하여 초보자도 사용하기 쉬운 방식입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- 3. 웹 디자인 색상 꿀팁 ---- */}
      <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <Lightbulb size={22} className="text-[var(--color-accent)]" />
          웹 디자인 색상 꿀팁
        </h2>
        <div className="space-y-5 text-sm leading-relaxed text-gray-700">
          {/* Tip 1 */}
          <div className="flex gap-3">
            <Eye size={18} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">WCAG 명암비 기준을 지켜주세요</h3>
              <p className="text-gray-600">
                접근성을 위해 텍스트와 배경의 명암비(Contrast Ratio)를 확인해야 합니다.
                일반 텍스트는 최소 <strong>AA 기준 4.5:1</strong>, 높은 접근성을 원한다면{" "}
                <strong>AAA 기준 7:1</strong> 이상이 권장됩니다.
                큰 텍스트(18pt 이상)는 3:1 이상이면 됩니다.
              </p>
            </div>
          </div>
          {/* Tip 2 */}
          <div className="flex gap-3">
            <Palette size={18} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">60-30-10 색상 비율 법칙</h3>
              <p className="text-gray-600">
                인테리어 디자인에서 유래한 이 법칙은 웹 디자인에서도 효과적입니다.
                주색상(60%)은 배경, 보조색상(30%)은 카드/섹션, 강조색상(10%)은 버튼/CTA에 사용하면
                시각적으로 균형 잡힌 디자인을 만들 수 있습니다.
              </p>
            </div>
          </div>
          {/* Tip 3 */}
          <div className="flex gap-3">
            <Droplets size={18} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">색상 심리학 활용하기</h3>
              <p className="text-gray-600">
                색상은 사용자의 감정과 행동에 영향을 줍니다.{" "}
                <strong>빨강</strong>은 긴급함과 열정, <strong>파랑</strong>은 신뢰와 안정감,{" "}
                <strong>초록</strong>은 성장과 자연, <strong>노랑</strong>은 낙관과 에너지를 전달합니다.
                브랜드 메시지에 맞는 색상을 선택하세요.
              </p>
            </div>
          </div>
          {/* Tip 4 */}
          <div className="flex gap-3">
            <Lightbulb size={18} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
            <div>
              <h3 className="mb-1 font-semibold text-gray-800">다크 모드를 고려한 색상 설계</h3>
              <p className="text-gray-600">
                다크 모드에서는 순백(#FFFFFF)이나 순흑(#000000) 대신 약간 톤을 낮춘 색상을 사용하세요.
                채도가 높은 색상은 어두운 배경에서 눈의 피로를 유발하므로, 밝기를 높이고 채도를 약간 낮추는 것이 좋습니다.
                HSL 체계를 사용하면 밝기와 채도 조절이 간편합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- 4. FAQ ---- */}
      <div className="rounded-xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <HelpCircle size={22} className="text-[var(--color-primary)]" />
          자주 묻는 질문 (FAQ)
        </h2>
        <div>
          <FAQItem
            question="HEX와 RGB의 차이점은 무엇인가요?"
            answer="HEX와 RGB는 같은 색상을 다른 방식으로 표현한 것입니다. HEX는 16진수로 #RRGGBB 형태를 사용하고, RGB는 10진수로 rgb(R, G, B) 형태를 사용합니다. 예를 들어 HEX #FF0000과 RGB rgb(255, 0, 0)은 동일한 빨간색입니다. HEX는 짧고 간결하여 CSS에서 많이 쓰이고, RGB는 프로그래밍에서 색상 계산 시 더 직관적입니다."
          />
          <FAQItem
            question="색상 대비율(Contrast Ratio)이란 무엇인가요?"
            answer="색상 대비율은 두 색상의 상대적인 밝기 차이를 나타내는 수치입니다. 1:1(대비 없음)부터 21:1(최대 대비, 흑백)까지의 범위를 가집니다. WCAG 접근성 기준에서는 일반 텍스트에 최소 4.5:1(AA), 높은 접근성을 위해 7:1(AAA)의 대비율을 요구합니다. 충분한 대비율은 저시력 사용자나 밝은 환경에서도 텍스트를 읽기 쉽게 만들어 줍니다."
          />
          <FAQItem
            question="색상 팔레트는 어떻게 만드나요?"
            answer="색상 팔레트를 만드는 가장 체계적인 방법은 색상환의 조화 규칙(보색, 유사색, 삼색 조합 등)을 활용하는 것입니다. 먼저 브랜드나 목적에 맞는 기본 색상을 하나 정한 뒤, 조화 규칙에 따라 2~4개의 보조 색상을 선택합니다. 이후 각 색상의 밝기와 채도를 조절하여 변형(Tint/Shade)을 만들면 실용적인 팔레트가 완성됩니다."
          />
          <FAQItem
            question="WCAG 접근성이란 무엇인가요?"
            answer="WCAG(Web Content Accessibility Guidelines)는 W3C에서 제정한 웹 콘텐츠 접근성 지침입니다. 장애를 가진 사용자도 웹 콘텐츠를 인식하고 사용할 수 있도록 하는 국제 표준으로, 색상 관련해서는 텍스트와 배경 간 충분한 명암비, 색상만으로 정보를 전달하지 않기, 사용자가 색상을 커스터마이즈할 수 있는 옵션 제공 등을 권장합니다."
          />
          <FAQItem
            question="색상 형식 간 변환은 어떻게 하나요?"
            answer="색상 형식 간 변환은 수학적 공식을 통해 이루어집니다. HEX에서 RGB로는 16진수를 10진수로 변환하고, RGB에서 HSL로는 색상, 채도, 명도를 계산합니다. 직접 계산하기 복잡하므로, 이 페이지의 색상 변환 도구를 사용하면 HEX, RGB, HSL 값을 입력하는 즉시 다른 형식으로 자동 변환됩니다."
          />
        </div>
      </div>
    </section>
  );
}
