"use client";

import { useState } from "react";
import {
  Heart,
  Activity,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  Scale,
} from "lucide-react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[var(--health-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-[var(--health-border)]">
          <div className="pt-3">{answer}</div>
        </div>
      )}
    </div>
  );
}

export default function HealthInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <div className="space-y-8">
        {/* 1. 건강 지표 이해하기 */}
        <div className="rounded-xl border border-[var(--health-border)] bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[var(--health-primary)]" />
            <h2 className="text-lg font-bold text-gray-800">
              건강 지표 이해하기
            </h2>
          </div>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">
                BMI (체질량지수)
              </h3>
              <p>
                BMI는 체중(kg)을 신장(m)의 제곱으로 나눈 값으로, 비만도를 간접적으로
                평가하는 가장 널리 사용되는 지표입니다. 간편하게 계산할 수 있어
                건강검진이나 자가 건강 관리에서 1차 스크리닝 도구로 활용됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">
                체지방률 (Body Fat %)
              </h3>
              <p>
                체지방률은 체중 대비 지방이 차지하는 비율로, BMI보다 더 정확하게
                신체 구성을 파악할 수 있습니다. 같은 BMI라도 근육량과 체지방 비율에
                따라 건강 상태가 크게 다를 수 있어, 체지방률을 함께 확인하는 것이
                중요합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">
                기초대사량 (BMR)
              </h3>
              <p>
                기초대사량은 생명을 유지하기 위해 최소한으로 필요한 에너지(칼로리)를
                의미합니다. 숨 쉬기, 심장 박동, 체온 유지 등 기본적인 생체 활동에
                소모되는 에너지로, 체중 관리와 식단 계획의 기초가 됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">
                심박수 존 (Heart Rate Zone)
              </h3>
              <p>
                목표 심박수 존은 운동 강도를 최적화하는 데 활용됩니다. 최대
                심박수(220 - 나이)를 기준으로 지방 연소 구간(60~70%), 유산소
                구간(70~80%), 고강도 구간(80~90%) 등으로 나뉘며, 운동 목적에 맞는
                적절한 강도 설정에 도움을 줍니다.
              </p>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              이러한 건강 지표들을 정기적으로 확인하고 종합적으로 관리하면, 질병
              예방과 건강한 생활습관 유지에 큰 도움이 됩니다.
            </p>
          </div>
        </div>

        {/* 2. BMI 판정 기준표 */}
        <div className="rounded-xl border border-[var(--health-border)] bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-[var(--health-primary)]" />
            <h2 className="text-lg font-bold text-gray-800">
              BMI 판정 기준표
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--health-border)]">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                    분류
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700">
                    BMI 범위
                  </th>
                  <th className="text-left py-2 font-semibold text-gray-700">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#3B82F6" }}
                      />
                      저체중
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">18.5 미만</td>
                  <td className="py-2.5 text-gray-400">영양 부족 위험</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#22C55E" }}
                      />
                      정상
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">18.5 ~ 22.9</td>
                  <td className="py-2.5 text-gray-400">건강 체중 유지</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#EAB308" }}
                      />
                      과체중
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">23.0 ~ 24.9</td>
                  <td className="py-2.5 text-gray-400">체중 관리 필요</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#F97316" }}
                      />
                      비만 1단계
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">25.0 ~ 29.9</td>
                  <td className="py-2.5 text-gray-400">건강 위험 증가</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#EF4444" }}
                      />
                      비만 2단계
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">30.0 ~ 34.9</td>
                  <td className="py-2.5 text-gray-400">고위험군</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: "#991B1B" }}
                      />
                      고도비만
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">35.0 이상</td>
                  <td className="py-2.5 text-gray-400">즉각적 관리 필요</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            * 위 기준은 대한비만학회의 아시아-태평양 기준입니다. WHO 국제 기준은
            과체중 25.0 이상, 비만 30.0 이상으로, 아시아인 기준보다 높게
            설정되어 있습니다. 아시아인은 같은 BMI에서도 내장지방이 더 많은
            경향이 있어, 보다 엄격한 기준이 적용됩니다.
          </p>
        </div>

        {/* 3. 건강 관리 꿀팁 */}
        <div className="rounded-xl border border-[var(--health-border)] bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[var(--health-primary)]" />
            <h2 className="text-lg font-bold text-gray-800">
              건강 관리 꿀팁
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="font-semibold text-gray-700 text-sm mb-2">
                균형 잡힌 식단
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                탄수화물, 단백질, 지방의 비율을 5:3:2로 유지하고, 매 끼니 채소를
                포함하세요. 가공식품과 당류 섭취를 줄이고, 하루 2L 이상의 물을
                마시는 것이 좋습니다.
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="font-semibold text-gray-700 text-sm mb-2">
                규칙적인 운동
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                WHO는 성인 기준 주 150분 이상의 중강도 유산소 운동 또는 주 75분
                이상의 고강도 운동을 권장합니다. 근력 운동을 주 2회 이상 병행하면
                기초대사량 향상에도 도움이 됩니다.
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <h3 className="font-semibold text-gray-700 text-sm mb-2">
                충분한 수면
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                성인은 하루 7~9시간의 수면이 권장됩니다. 수면 부족은 식욕 호르몬
                (렙틴, 그렐린)의 불균형을 초래해 체중 증가 위험을 높이고, 면역력
                저하와 집중력 감소의 원인이 됩니다.
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <h3 className="font-semibold text-gray-700 text-sm mb-2">
                스트레스 관리
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                만성 스트레스는 코르티솔 분비를 증가시켜 복부 비만과 대사증후군의
                원인이 됩니다. 명상, 호흡법, 산책 등으로 스트레스를 관리하고, 취미
                활동이나 사회적 교류를 통해 정신 건강을 돌보세요.
              </p>
            </div>
          </div>
        </div>

        {/* 4. FAQ */}
        <div className="rounded-xl border border-[var(--health-border)] bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-[var(--health-primary)]" />
            <h2 className="text-lg font-bold text-gray-800">
              자주 묻는 질문
            </h2>
          </div>
          <div className="space-y-3">
            <FAQItem
              question="BMI는 운동선수에게도 정확한가요?"
              answer="BMI는 체중과 키만으로 계산하기 때문에, 근육량이 많은 운동선수의 경우 실제보다 비만으로 판정될 수 있습니다. 근육은 지방보다 밀도가 높아 같은 부피에서도 더 무겁기 때문입니다. 운동선수나 보디빌더는 BMI 대신 체지방률, 허리둘레, DEXA 스캔 등을 활용하여 보다 정확한 체성분 분석을 하는 것이 권장됩니다."
            />
            <FAQItem
              question="집에서 체지방률을 측정하는 방법은?"
              answer="가정에서 체지방률을 추정하는 방법으로는 생체전기 임피던스 분석(BIA) 체중계 사용, 줄자를 이용한 미 해군 공식 계산(본 계산기에서 사용하는 방법), 캘리퍼를 이용한 피부주름 측정 등이 있습니다. 정확한 측정을 위해서는 매일 같은 조건(기상 직후, 공복 상태)에서 측정하고, 여러 번의 측정값을 평균내어 활용하는 것이 좋습니다."
            />
            <FAQItem
              question="기초대사량(BMR)이란 무엇인가요?"
              answer="기초대사량(BMR)은 신체가 완전히 휴식 상태에서 생명 유지를 위해 소비하는 최소 에너지량입니다. 전체 에너지 소비의 약 60~75%를 차지하며, 나이, 성별, 체중, 키, 근육량 등에 영향을 받습니다. BMR이 높을수록 같은 활동량에서도 더 많은 칼로리를 소모하므로, 근력 운동으로 근육량을 늘리면 기초대사량을 높이는 데 도움이 됩니다."
            />
            <FAQItem
              question="목표 심박수 존은 어떻게 찾나요?"
              answer="목표 심박수 존은 최대 심박수(220 - 나이)에 원하는 운동 강도 비율을 곱하여 계산합니다. 예를 들어, 30세의 경우 최대 심박수는 190bpm이며, 지방 연소 존(60~70%)은 114~133bpm, 유산소 존(70~80%)은 133~152bpm입니다. 운동 시 스마트워치나 가슴 벨트형 심박계를 활용하면 실시간으로 심박수 존을 확인할 수 있습니다."
            />
            <FAQItem
              question="BMI와 체지방률, 어떤 것이 더 정확한가요?"
              answer="두 지표는 서로 보완적인 역할을 합니다. BMI는 계산이 간편하고 대규모 건강 통계에 유용하지만, 개인의 근육량과 체지방 분포를 반영하지 못합니다. 체지방률은 실제 신체 구성을 더 정확히 보여주지만, 측정 방법에 따라 오차가 있을 수 있습니다. 가장 좋은 방법은 두 지표를 함께 활용하고, 허리둘레 등 추가 지표도 참고하여 종합적으로 판단하는 것입니다."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
