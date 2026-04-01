"use client";

import { useState } from "react";
import { Palette, Grid3x3, Sparkles, HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "도트 아트를 만들려면 그림 실력이 필요한가요?",
    answer: "아닙니다! 사진을 업로드하면 자동으로 도트 아트로 변환해 주기 때문에 그림 실력이 없어도 누구나 쉽게 만들 수 있습니다. 물론 직접 픽셀을 찍어 작업하면 더 섬세한 결과물을 얻을 수 있습니다.",
  },
  {
    question: "어떤 이미지가 도트 아트로 변환하기 좋은가요?",
    answer: "윤곽이 뚜렷하고 색상 대비가 명확한 이미지가 가장 좋은 결과를 보여줍니다. 인물 사진, 로고, 일러스트 등이 적합하며, 배경이 복잡한 풍경 사진보다는 단순한 구도의 이미지가 더 잘 변환됩니다.",
  },
  {
    question: "도트 아트의 해상도(그리드 크기)는 어떻게 설정해야 하나요?",
    answer: "용도에 따라 다릅니다. 프로필 아이콘이나 이모지는 16x16~32x32, 게임 캐릭터는 32x32~64x64, 포스터나 인쇄물은 64x64 이상이 적합합니다. 해상도가 낮을수록 레트로 느낌이 강해지고, 높을수록 원본에 가까워집니다.",
  },
  {
    question: "만든 도트 아트는 어떤 형식으로 저장할 수 있나요?",
    answer: "PNG, SVG 형식으로 다운로드할 수 있습니다. PNG는 웹이나 소셜 미디어에 바로 사용하기 좋고, SVG는 크기를 자유롭게 조절해도 깨지지 않아 인쇄물이나 대형 작업에 적합합니다.",
  },
  {
    question: "상업적 용도로 사용해도 되나요?",
    answer: "본 도구로 생성한 도트 아트는 자유롭게 사용하실 수 있습니다. 다만, 원본 이미지의 저작권은 별도로 확인하셔야 합니다. 직접 촬영한 사진이나 저작권 프리 이미지를 사용하시면 안전합니다.",
  },
];

const useCases = [
  {
    icon: "👤",
    title: "프로필 사진 & 아바타",
    description:
      "SNS, 게임, 메신저에서 사용할 개성 있는 픽셀 아트 프로필 사진을 만들어 보세요. 나만의 레트로 감성 아바타로 차별화할 수 있습니다.",
  },
  {
    icon: "🎮",
    title: "게임 에셋 & 스프라이트",
    description:
      "인디 게임 개발에 필요한 캐릭터, 아이템, 타일맵 등의 스프라이트를 제작할 수 있습니다. 레트로 스타일 게임의 핵심 그래픽 리소스를 손쉽게 만들어 보세요.",
  },
  {
    icon: "🧵",
    title: "십자수 & 비즈 아트 도안",
    description:
      "도트 아트 패턴을 그대로 십자수나 비즈 아트 도안으로 활용할 수 있습니다. 좋아하는 사진을 도안으로 변환하여 세상에 하나뿐인 핸드메이드 작품을 만들어 보세요.",
  },
  {
    icon: "🎨",
    title: "NFT & 디지털 아트",
    description:
      "픽셀 아트 스타일의 디지털 아트를 제작하여 NFT 마켓플레이스에 등록하거나, 포스터·굿즈 등 다양한 디지털 콘텐츠로 활용할 수 있습니다.",
  },
];

const tips = [
  {
    title: "적절한 해상도 선택",
    description:
      "도트 아트의 매력은 적절한 단순화에 있습니다. 너무 높은 해상도는 원본과 차이가 없어지고, 너무 낮으면 형태를 알아보기 어렵습니다. 16x16에서 시작해 원하는 수준으로 조절해 보세요.",
  },
  {
    title: "컬러 팔레트 활용",
    description:
      "제한된 색상 팔레트를 사용하면 통일감 있고 아름다운 도트 아트를 만들 수 있습니다. 레트로, 파스텔, 모노톤 등 다양한 프리셋 팔레트를 활용해 보세요.",
  },
  {
    title: "디더링 효과 적용",
    description:
      "디더링은 제한된 색상으로 더 많은 색조를 표현하는 기법입니다. 그라데이션이 필요한 부분에 디더링을 적용하면 적은 색으로도 풍부한 표현이 가능합니다.",
  },
  {
    title: "출력 형식에 맞는 설정",
    description:
      "웹용이라면 PNG, 확대·인쇄용이라면 SVG를 선택하세요. 십자수 도안으로 활용할 때는 격자 간격을 넓히고 윤곽선을 켜면 도안으로 바로 사용할 수 있습니다.",
  },
];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50"
          >
            <span className="text-sm font-medium text-gray-800 pr-4">
              {item.question}
            </span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? "max-h-60" : "max-h-0"
            }`}
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DotArtInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      {/* 도트 아트란? */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 mb-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
          <Palette size={20} className="text-indigo-500" />
          도트 아트란?
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-gray-600">
          <p>
            도트 아트(Dot Art)는 작은 점(픽셀)을 하나하나 찍어 그림을 완성하는 디지털 아트의 한 장르입니다.
            1970~90년대 게임 그래픽의 하드웨어 제약에서 탄생한 픽셀 아트는 오늘날 하나의 독립적인 예술 양식으로 자리 잡았습니다.
          </p>
          <p>
            이미지를 도트 아트로 변환하는 과정은 원본 이미지를 지정된 격자(그리드) 크기로 축소한 뒤,
            각 격자 영역의 평균 색상을 선택한 팔레트의 가장 가까운 색으로 매핑하는 방식으로 이루어집니다.
            이 과정에서 디더링, 윤곽선 강조 등의 기법을 적용하여 더 풍부한 표현을 할 수 있습니다.
          </p>
          <p>
            도트 아트는 단순한 복고풍 향수를 넘어, 제한된 요소로 최대한의 표현을 이끌어내는 미니멀한 미학을 지니고 있습니다.
            적은 픽셀과 제한된 색상 안에서 형태와 감정을 전달하는 것이 도트 아트만의 독특한 예술적 가치입니다.
          </p>
        </div>
      </div>

      {/* 도트 아트 활용법 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 mb-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
          <Grid3x3 size={20} className="text-indigo-500" />
          도트 아트 활용법
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-2 text-2xl">{useCase.icon}</div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                {useCase.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-500">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 도트 아트 만들기 팁 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 mb-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
          <Sparkles size={20} className="text-indigo-500" />
          도트 아트 만들기 팁
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip, index) => (
            <div key={index} className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-800">
                {index + 1}. {tip.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-500">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
          <HelpCircle size={20} className="text-indigo-500" />
          자주 묻는 질문
        </h2>
        <FAQAccordion items={faqItems} />
      </div>
    </section>
  );
}
