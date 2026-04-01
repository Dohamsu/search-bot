"use client";

import { useState } from "react";
import { Calendar, Clock, Lightbulb, HelpCircle, ChevronDown } from "lucide-react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[var(--date-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-medium text-[var(--date-text)] hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm sm:text-base">{question}</span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600 border-t border-[var(--date-border)] pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function DateInfoSection() {
  const faqs: { q: string; a: string }[] = [
    {
      q: "영업일(근무일)은 어떻게 계산하나요?",
      a: "영업일 계산은 토요일과 일요일을 제외한 평일만 카운트합니다. 공휴일은 국가마다 다르기 때문에 기본적으로 주말만 제외하며, 필요에 따라 공휴일을 추가로 제외할 수 있습니다. 예를 들어 월요일부터 금요일까지는 5영업일이 됩니다.",
    },
    {
      q: "윤년은 날짜 계산에 어떤 영향을 주나요?",
      a: "윤년에는 2월이 29일까지 있어 1년이 366일이 됩니다. 따라서 1월 1일부터 12월 31일까지의 일수가 평년(365일)과 1일 차이가 납니다. 날짜 계산기는 윤년을 자동으로 반영하여 정확한 결과를 제공합니다. 2월 29일 생일인 분은 평년에 3월 1일 또는 2월 28일을 생일로 간주합니다.",
    },
    {
      q: "D-100과 D+100의 차이는 무엇인가요?",
      a: "D-100은 목표일까지 100일 남았다는 의미이고, D+100은 기준일로부터 100일이 지났다는 의미입니다. D-Day는 목표일 당일을 뜻하며, D-Day 이전은 마이너스(−), 이후는 플러스(+)로 표시합니다. 예를 들어 시험이 D-30이면 시험까지 30일 남은 것이고, 사귄 지 D+100이면 만난 지 100일째라는 뜻입니다.",
    },
    {
      q: "한국 나이와 만 나이는 어떻게 다른가요?",
      a: "만 나이(국제 나이)는 태어난 날을 0세로 시작하여 생일이 지날 때마다 1세를 더합니다. 한국 전통 나이(세는 나이)는 태어나자마자 1살이고 매년 1월 1일에 1살씩 더했지만, 2023년 6월부터 한국도 공식적으로 만 나이를 사용합니다. 본 계산기는 두 가지 방식 모두 확인할 수 있습니다.",
    },
    {
      q: "ISO 8601이란 무엇인가요?",
      a: "ISO 8601은 국제 표준 날짜·시간 표기법으로, YYYY-MM-DD 형식(예: 2026-04-01)을 사용합니다. 이 형식은 전 세계적으로 혼동 없이 날짜를 표현할 수 있으며, 프로그래밍과 데이터 교환에서 널리 사용됩니다. 시간은 T로 구분하여 YYYY-MM-DDTHH:MM:SS 형태로 표기합니다.",
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <div className="space-y-10">
        {/* 날짜 계산기 활용법 */}
        <div className="rounded-xl border border-[var(--date-border)] bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--date-primary)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--date-text)]">
              날짜 계산기 활용법
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-600 mb-4">
            날짜 계산기는 일상생활과 업무에서 다양하게 활용할 수 있는 필수 도구입니다.
            정확한 날짜 계산이 필요한 모든 상황에서 유용하게 사용해 보세요.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--date-primary)] shrink-0" />
              <span><strong>D-Day 카운트다운</strong> — 시험, 기념일, 이벤트까지 남은 일수를 정확하게 파악</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--date-accent)] shrink-0" />
              <span><strong>근무일 계산</strong> — 프로젝트 일정, 납기일, 업무 마감일을 영업일 기준으로 산출</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--date-success)] shrink-0" />
              <span><strong>나이 계산</strong> — 만 나이와 한국 나이를 동시에 확인하고 띠까지 파악</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--date-primary)] shrink-0" />
              <span><strong>마감일 관리</strong> — 계약 만료일, 비자 기한, 각종 신청 기한을 놓치지 않도록 관리</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--date-accent)] shrink-0" />
              <span><strong>전역일 계산</strong> — 군 복무 시작일부터 전역일까지의 남은 기간을 D-Day로 확인</span>
            </li>
          </ul>
        </div>

        {/* 날짜 계산의 기본 원리 */}
        <div className="rounded-xl border border-[var(--date-border)] bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--date-accent)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--date-text)]">
              날짜 계산의 기본 원리
            </h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-gray-600">
            <p>
              날짜 계산은 <strong>그레고리력(양력)</strong>을 기준으로 합니다. 그레고리력은 1582년
              교황 그레고리우스 13세가 제정한 역법으로, 현재 전 세계적으로 사용되는 표준 달력입니다.
            </p>
            <p>
              <strong>윤년 규칙</strong>은 세 가지 조건으로 결정됩니다: (1) 4로 나누어 떨어지는 해는
              윤년, (2) 그중 100으로 나누어 떨어지는 해는 평년, (3) 그중 400으로 나누어 떨어지는
              해는 다시 윤년. 예를 들어 2000년은 윤년(400의 배수), 1900년은 평년(100의 배수이지만
              400의 배수가 아님), 2024년은 윤년(4의 배수)입니다.
            </p>
            <p>
              <strong>시간대(타임존)</strong>도 날짜 계산에서 중요합니다. 한국 표준시(KST, UTC+9)를
              기준으로 자정이 넘어가는 시점이 날짜 변경선이 됩니다. 국제 일정을 다룰 때는 UTC
              기준으로 변환하여 계산하는 것이 정확합니다.
            </p>
          </div>
        </div>

        {/* D-Day 활용 꿀팁 */}
        <div className="rounded-xl border border-[var(--date-border)] bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-[var(--date-text)]">
              D-Day 활용 꿀팁
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-[var(--date-text)] mb-1.5">
                1. 시험 D-Day 관리
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                수능, 자격증, 공무원 시험 등 중요한 시험일을 D-Day로 설정하면 남은 기간을
                체계적으로 관리할 수 있습니다. 주 단위로 학습 계획을 세울 때 유용합니다.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-[var(--date-text)] mb-1.5">
                2. 프로젝트 마감일 추적
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                업무 프로젝트의 마감일을 설정하고 영업일 기준으로 남은 근무일을 계산하면
                일정 관리가 훨씬 수월해집니다. 마일스톤별로 D-Day를 나누어 관리하세요.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-[var(--date-text)] mb-1.5">
                3. 기념일 리마인더
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                연인과의 100일, 200일, 1000일 등 기념일을 미리 계산해 두면 깜빡하지 않고
                준비할 수 있습니다. 날짜 더하기 기능으로 다음 기념일을 쉽게 확인하세요.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-[var(--date-text)] mb-1.5">
                4. 여행 일정 계획
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                출발일까지 남은 일수를 확인하고, 여행 기간이 며칠인지 정확히 계산할 수
                있습니다. 숙소 예약이나 항공권 구매 시점을 결정하는 데 활용하세요.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[var(--date-success)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--date-text)]">
              자주 묻는 질문
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
