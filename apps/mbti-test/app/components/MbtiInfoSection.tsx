"use client";

import { useState } from "react";
import {
  Brain,
  Users,
  Compass,
  HelpCircle,
  ChevronDown,
  Lightbulb,
  Heart,
  Briefcase,
  Search,
  Grid3X3,
} from "lucide-react";

/* ───────── 16 types data ───────── */
const MBTI_TYPES: { type: string; label: string; color: string }[] = [
  { type: "INTJ", label: "전략가", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { type: "INTP", label: "논리술사", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { type: "ENTJ", label: "통솔자", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { type: "ENTP", label: "변론가", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { type: "INFJ", label: "옹호자", color: "bg-green-100 text-green-700 border-green-200" },
  { type: "INFP", label: "중재자", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { type: "ENFJ", label: "선도자", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { type: "ENFP", label: "활동가", color: "bg-lime-100 text-lime-700 border-lime-200" },
  { type: "ISTJ", label: "현실주의자", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { type: "ISFJ", label: "수호자", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { type: "ESTJ", label: "경영자", color: "bg-stone-100 text-stone-700 border-stone-200" },
  { type: "ESFJ", label: "외교관", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { type: "ISTP", label: "장인", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { type: "ISFP", label: "모험가", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { type: "ESTP", label: "사업가", color: "bg-red-100 text-red-700 border-red-200" },
  { type: "ESFP", label: "연예인", color: "bg-pink-100 text-pink-700 border-pink-200" },
];

/* ───────── FAQ data ───────── */
const FAQ_ITEMS = [
  {
    q: "MBTI는 과학적으로 검증되었나요?",
    a: "MBTI는 칼 융(Carl Jung)의 심리 유형론에 기반하여 캐서린 브릭스(Katharine Briggs)와 이사벨 마이어스(Isabel Myers)가 개발한 성격 유형 검사입니다. 학술적으로 신뢰도와 타당도에 대한 논의가 있지만, 자기 이해와 타인과의 소통을 위한 도구로 전 세계에서 가장 널리 사용되고 있습니다. 심리학 연구에서는 Big Five(5요인 모델)가 더 높은 과학적 타당성을 인정받고 있으나, MBTI는 직관적이고 이해하기 쉬워 실용적 활용도가 높습니다.",
  },
  {
    q: "MBTI 유형이 바뀔 수 있나요?",
    a: "MBTI 유형은 기본적으로 선천적 성향을 반영하므로 크게 변하지 않는다고 보지만, 환경이나 경험에 따라 일부 지표가 바뀌는 경우가 있습니다. 특히 경계선에 있는 선호 지표(예: T/F 50:50)는 시기에 따라 다르게 나올 수 있습니다. 이는 유형이 변한 것이 아니라, 상황에 따라 다른 면이 강조된 것으로 볼 수 있습니다. 주기적으로 검사해보면 자신의 핵심 성향과 변화 양상을 파악할 수 있습니다.",
  },
  {
    q: "가장 희귀한 MBTI 유형은 무엇인가요?",
    a: "전 세계적으로 가장 희귀한 MBTI 유형은 INFJ(옹호자)로, 전체 인구의 약 1~2%를 차지하는 것으로 알려져 있습니다. 반대로 가장 흔한 유형은 ISFJ(수호자)와 ESFJ(외교관)로, 각각 약 12~13%의 비율을 보입니다. 다만 이 비율은 문화권과 조사 방법에 따라 달라질 수 있으며, 한국에서는 ISTJ, ISFJ, INFP 비율이 상대적으로 높게 나타나는 경향이 있습니다.",
  },
  {
    q: "MBTI 검사를 더 정확하게 받으려면 어떻게 해야 하나요?",
    a: "검사 정확도를 높이려면 다음 사항을 지켜보세요. 첫째, '되고 싶은 나'가 아닌 '평소의 나'를 기준으로 답하세요. 둘째, 직장이나 특정 상황에서의 모습이 아닌 편안한 일상에서의 행동을 떠올리세요. 셋째, 너무 오래 고민하지 말고 직관적으로 응답하세요. 넷째, 컨디션이 좋을 때 검사하면 결과가 더 안정적입니다. 마지막으로, 한 번이 아닌 여러 번 검사하여 일관된 결과를 확인해보세요.",
  },
  {
    q: "MBTI와 Big Five(5요인 모델)는 어떻게 다른가요?",
    a: "MBTI는 4가지 이분법으로 16개 유형을 분류하는 '유형론'이고, Big Five는 개방성·성실성·외향성·친화성·신경증의 5가지 연속 스펙트럼으로 성격을 측정하는 '특성론'입니다. Big Five는 학술 연구에서 더 높은 신뢰도를 인정받지만, MBTI는 결과가 직관적이고 기억하기 쉬워 자기소개, 팀 빌딩, 진로 탐색 등 실생활에서 더 폭넓게 활용됩니다. 두 검사는 서로 보완적으로 사용할 수 있습니다.",
  },
];

/* ───────── FAQ Item ───────── */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[var(--mbti-text)]">
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

/* ───────── Main Section ───────── */
export default function MbtiInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      {/* ── 1. MBTI란 무엇인가요? ── */}
      <div className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--mbti-primary)] to-[var(--mbti-secondary)]">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-[var(--mbti-text)]">
            MBTI란 무엇인가요?
          </h2>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          MBTI(Myers-Briggs Type Indicator)는 캐서린 브릭스(Katharine Briggs)와 그녀의 딸 이사벨 마이어스(Isabel Myers)가
          칼 융(Carl Jung)의 심리 유형론을 토대로 1940년대에 개발한 성격 유형 검사입니다.
          4가지 선호 지표의 조합으로 총 16가지 성격 유형을 분류하며, 전 세계에서 가장 널리 사용되는 성격 검사 도구 중 하나입니다.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              axis: "E / I",
              title: "외향(Extraversion) vs 내향(Introversion)",
              desc: "에너지의 방향을 나타냅니다. 외향형은 사람들과의 교류에서, 내향형은 혼자만의 시간에서 에너지를 얻습니다.",
            },
            {
              axis: "S / N",
              title: "감각(Sensing) vs 직관(Intuition)",
              desc: "정보를 인식하는 방식입니다. 감각형은 현재의 사실과 경험을, 직관형은 가능성과 의미를 중시합니다.",
            },
            {
              axis: "T / F",
              title: "사고(Thinking) vs 감정(Feeling)",
              desc: "의사결정 방식을 나타냅니다. 사고형은 논리와 원칙을, 감정형은 사람과 관계를 우선시합니다.",
            },
            {
              axis: "J / P",
              title: "판단(Judging) vs 인식(Perceiving)",
              desc: "생활 방식을 보여줍니다. 판단형은 계획적이고 체계적인 것을, 인식형은 유연하고 자율적인 것을 선호합니다.",
            },
          ].map((item) => (
            <div
              key={item.axis}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <span className="mb-1 inline-block rounded-md bg-gradient-to-r from-[var(--mbti-primary)] to-[var(--mbti-secondary)] px-2.5 py-0.5 text-xs font-bold text-white">
                {item.axis}
              </span>
              <h3 className="mt-1.5 text-sm font-semibold text-[var(--mbti-text)]">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. 16가지 성격 유형 한눈에 보기 ── */}
      <div className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--mbti-primary)] to-[var(--mbti-secondary)]">
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-[var(--mbti-text)]">
            16가지 성격 유형 한눈에 보기
          </h2>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          4가지 선호 지표의 조합으로 만들어지는 16가지 성격 유형입니다. 각 유형을 클릭하면 상세 결과를 확인할 수 있습니다.
        </p>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {MBTI_TYPES.map(({ type, label, color }) => (
            <a
              key={type}
              href={`/result/${type}`}
              className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-all hover:scale-[1.03] hover:shadow-md ${color}`}
            >
              <span className="text-base font-extrabold tracking-wide">
                {type}
              </span>
              <span className="text-xs font-medium opacity-80">{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── 3. MBTI 활용 가이드 ── */}
      <div className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--mbti-primary)] to-[var(--mbti-secondary)]">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-[var(--mbti-text)]">
            MBTI 활용 가이드
          </h2>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-slate-600">
          MBTI 결과는 자기 이해를 넘어 다양한 영역에서 실질적으로 활용할 수 있습니다.
          아래 가이드를 참고하여 일상과 커리어에 적용해보세요.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              icon: <Search className="h-5 w-5 text-white" />,
              title: "자기 이해와 성장",
              desc: "자신의 강점과 약점을 객관적으로 파악하세요. 선호하는 의사소통 방식, 스트레스 반응 패턴을 이해하면 자기 관리가 한층 수월해집니다. 약한 기능을 의식적으로 개발하면 균형 잡힌 성장이 가능합니다.",
            },
            {
              icon: <Briefcase className="h-5 w-5 text-white" />,
              title: "진로와 직업 탐색",
              desc: "MBTI 유형별로 적합한 직업군과 업무 환경이 다릅니다. 예를 들어 INTJ는 전략 기획, ESFP는 이벤트·엔터테인먼트 분야에서 강점을 발휘합니다. 유형에 맞는 커리어를 탐색해보세요.",
            },
            {
              icon: <Heart className="h-5 w-5 text-white" />,
              title: "대인 관계 개선",
              desc: "상대방의 MBTI 유형을 이해하면 갈등을 줄이고 소통을 원활하게 할 수 있습니다. T형과 F형의 갈등, E형과 I형의 에너지 차이 등을 인식하면 서로를 더 깊이 이해할 수 있습니다.",
            },
            {
              icon: <Lightbulb className="h-5 w-5 text-white" />,
              title: "팀워크와 리더십",
              desc: "팀 구성원들의 MBTI를 파악하면 각자의 강점을 최대한 발휘하는 역할 분배가 가능합니다. S형에게는 실행력이 필요한 업무를, N형에게는 아이디어 도출 과제를 맡기는 식으로 활용해보세요.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-slate-100 bg-slate-50 p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--mbti-primary)] to-[var(--mbti-secondary)]">
                {item.icon}
              </div>
              <h3 className="mb-1.5 text-sm font-bold text-[var(--mbti-text)]">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. 자주 묻는 질문 ── */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--mbti-primary)] to-[var(--mbti-secondary)]">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-[var(--mbti-text)]">
            자주 묻는 질문 (FAQ)
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
