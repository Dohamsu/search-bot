"use client";

import { useState } from "react";
import {
  Ruler,
  ArrowLeftRight,
  Lightbulb,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const faqs = [
  {
    q: "미국은 왜 아직도 인치, 파운드 등 야드파운드법을 사용하나요?",
    a: "미국은 역사적으로 영국의 도량형 체계를 물려받았으며, 1975년 미터법 전환법이 통과되었지만 강제성이 없어 산업계와 일상생활에서 야드파운드법이 그대로 유지되고 있습니다. 전환 비용과 국민들의 익숙함이 주요 이유입니다.",
  },
  {
    q: "SI 단위계(국제단위계)란 무엇인가요?",
    a: "SI(Systeme International d'Unites)는 전 세계적으로 통용되는 표준 단위 체계입니다. 7개의 기본 단위(미터, 킬로그램, 초, 암페어, 켈빈, 몰, 칸델라)를 기반으로 하며, 과학, 공학, 국제 무역에서 일관된 측정을 가능하게 합니다.",
  },
  {
    q: "온도 변환을 쉽게 하는 방법이 있나요?",
    a: "간단한 암산법이 있습니다. 섭씨에서 화씨로: (섭씨 x 2) + 30 으로 대략적인 값을 구할 수 있습니다. 정확한 공식은 (°C x 9/5) + 32 = °F 입니다. 자주 쓰는 기준점을 외워두면 편합니다: 0°C=32°F, 100°C=212°F, 37°C=98.6°F(체온).",
  },
  {
    q: "1평은 몇 제곱미터(m2)인가요?",
    a: "1평은 약 3.306m2입니다. 평은 일본식 단위(坪)로, 한국에서 부동산 면적을 나타낼 때 관습적으로 사용됩니다. 법적으로는 m2를 사용해야 하지만, 일상에서는 여전히 평이 널리 쓰입니다. 역으로, 1m2 = 약 0.3025평입니다.",
  },
  {
    q: "킬로(kilo), 메가(mega), 기가(giga) 등 미터법 접두어는 어떻게 되나요?",
    a: "주요 접두어: 밀리(m)=10^-3, 센티(c)=10^-2, 킬로(k)=10^3, 메가(M)=10^6, 기가(G)=10^9, 테라(T)=10^12. 데이터 용량에서는 1KB=1,024B(이진법 기준)이지만, SI 표준에서는 1kB=1,000B입니다. 이진법 단위는 KiB, MiB, GiB로 구분합니다.",
  },
];

const conversionTable = [
  { from: "1 inch", to: "2.54 cm" },
  { from: "1 mile", to: "1.609 km" },
  { from: "1 lb", to: "0.4536 kg" },
  { from: "1 oz", to: "28.35 g" },
  { from: "1 gallon", to: "3.785 L" },
  { from: "°F", to: "(°C x 9/5) + 32" },
  { from: "1 평", to: "3.306 m2" },
  { from: "1 acre", to: "4,046.86 m2" },
];

const tips = [
  {
    title: "핵심 비율 암기하기",
    desc: "1인치=2.54cm, 1마일=1.6km, 1파운드=0.45kg 등 자주 쓰는 변환 비율만 외워도 일상생활에서 빠르게 계산할 수 있습니다.",
  },
  {
    title: "미터법 vs 야드파운드법 이해하기",
    desc: "미터법(SI)은 10진법 기반으로 변환이 쉽고, 야드파운드법은 12진법(1피트=12인치) 등 불규칙합니다. 국제적으로는 미터법이 표준입니다.",
  },
  {
    title: "한국 전통 단위 알아두기",
    desc: "평(3.306m2), 근(600g), 관(3.75kg), 리(약 0.393km) 등 한국 전통 단위는 부동산, 시장 등에서 여전히 사용되므로 알아두면 유용합니다.",
  },
  {
    title: "과학적 표기법 활용하기",
    desc: "매우 크거나 작은 수를 다룰 때는 과학적 표기법(예: 3.0x10^8 m/s)과 SI 접두어(킬로, 메가, 기가 등)를 활용하면 편리합니다.",
  },
];

export default function UnitInfoSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 space-y-10">
      {/* 단위 변환이 필요한 이유 */}
      <div className="rounded-xl border border-[var(--unit-border)] bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50">
            <Ruler className="w-5 h-5 text-[var(--unit-primary)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--unit-text)]">
            단위 변환이 필요한 이유
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
              요리 & 베이킹
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              해외 레시피를 따라할 때 컵(cup), 온스(oz), 밀리리터(ml) 간의
              변환이 필수적입니다. 정확한 계량이 요리의 맛을 좌우합니다.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
              해외 직구 & 쇼핑
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              미국/유럽 쇼핑몰에서 의류(인치/cm), 무게(파운드/kg) 단위가
              다르므로 정확한 변환이 필요합니다.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
              여행 & 이동
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              미국 여행 시 마일(mile)과 킬로미터(km), 화씨(°F)와 섭씨(°C) 변환을
              알아야 거리와 날씨를 정확히 파악할 수 있습니다.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-[var(--unit-primary)]">
              공학 & 기술
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              엔지니어링, 건축, 과학 분야에서는 다양한 단위계 간 정밀한 변환이
              프로젝트의 성패를 결정합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 주요 단위 변환 기준 */}
      <div className="rounded-xl border border-[var(--unit-border)] bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50">
            <ArrowLeftRight className="w-5 h-5 text-[var(--unit-primary)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--unit-text)]">
            주요 단위 변환 기준
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--unit-border)]">
                <th className="text-left py-2.5 px-3 font-semibold text-[var(--unit-primary)]">
                  기준
                </th>
                <th className="text-left py-2.5 px-3 font-semibold text-[var(--unit-primary)]">
                  변환 값
                </th>
              </tr>
            </thead>
            <tbody>
              {conversionTable.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-amber-50/30" : ""}`}
                >
                  <td className="py-2.5 px-3 font-medium text-[var(--unit-text)]">
                    {row.from}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600">{row.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 단위 변환 꿀팁 */}
      <div className="rounded-xl border border-[var(--unit-border)] bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50">
            <Lightbulb className="w-5 h-5 text-[var(--unit-primary)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--unit-text)]">
            단위 변환 꿀팁
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-100 bg-amber-50/30 p-4 space-y-1"
            >
              <h3 className="font-semibold text-sm text-[var(--unit-text)]">
                {i + 1}. {tip.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-xl border border-[var(--unit-border)] bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50">
            <HelpCircle className="w-5 h-5 text-[var(--unit-primary)]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--unit-text)]">
            자주 묻는 질문
          </h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-amber-50/50 transition-colors"
              >
                <span className="font-medium text-sm text-[var(--unit-text)] pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openFaq === i ? "max-h-60" : "max-h-0"
                }`}
              >
                <p className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
