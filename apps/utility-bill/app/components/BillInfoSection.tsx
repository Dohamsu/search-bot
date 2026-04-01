"use client";

import { useState } from "react";
import {
  Zap,
  Droplets,
  Flame,
  Lightbulb,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

const faqItems = [
  {
    q: "전기요금이 갑자기 크게 오른 이유는?",
    a: "한국의 주택용 전기요금은 누진제를 적용합니다. 사용량이 200kWh를 넘으면 2구간, 400kWh를 넘으면 3구간 요금이 적용되어 단가가 급격히 올라갑니다. 예를 들어 1구간 대비 3구간은 kWh당 약 3배 이상 비쌉니다. 여름철 에어컨 사용 등으로 사용량이 구간을 넘기면 요금이 크게 뛸 수 있습니다.",
  },
  {
    q: "전력산업기반기금이란 무엇인가요?",
    a: "전력산업기반기금은 전기요금의 3.7%에 해당하는 부담금으로, 전력산업 기반 조성을 위해 부과됩니다. 전력시설 확충, 신재생에너지 개발, 전력수급 안정 등에 사용되며 부가가치세(10%)와 함께 전기요금 고지서에 별도로 표시됩니다.",
  },
  {
    q: "가스 계량기는 어떻게 읽나요? (MJ vs m³)",
    a: "가정용 가스 계량기는 m³(세제곱미터) 단위로 표시됩니다. 하지만 실제 요금은 MJ(메가줄) 단위로 계산합니다. m³를 MJ로 변환할 때는 지역 도시가스의 열량환산계수(보통 약 42~44 MJ/m³)를 곱합니다. 고지서에는 사용량(m³)과 환산 열량(MJ)이 함께 표시되니 확인해 보세요.",
  },
  {
    q: "여름과 겨울 요금 차이가 나는 이유는?",
    a: "전기요금은 여름철(7~8월)에 냉방용 전력 수요 증가를 반영해 별도의 계절 요금 체계를 적용합니다. 가스요금은 겨울철(12~3월) 난방 수요 증가로 사용량이 크게 늘어 요금이 올라갑니다. 수도요금은 계절별 차등이 없지만, 여름철 물 사용량 증가로 요금이 높아질 수 있습니다.",
  },
  {
    q: "복지할인은 어떻게 신청하나요?",
    a: "전기요금 복지할인은 한국전력공사(KEPCO)에 신청합니다. 장애인, 기초생활수급자, 차상위계층, 다자녀가구, 출산가구 등이 대상입니다. 주민센터 또는 한전 고객센터(123)에 전화하거나, 한전 홈페이지에서 온라인으로 신청할 수 있습니다. 증빙서류(복지카드, 수급자증명서 등)가 필요합니다.",
  },
];

export default function BillInfoSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 space-y-10">
      {/* 섹션 제목 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          공과금 요금 안내
        </h2>
        <p className="text-sm text-gray-500">
          한국 공과금 체계를 이해하고 절약하는 방법을 알아보세요
        </p>
      </div>

      {/* 1. 공과금 요금 체계 이해하기 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          공과금 요금 체계 이해하기
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          한국의 공과금은 전기, 수도, 가스 세 가지로 나뉘며, 각각 다른 요금 체계를 적용합니다.
          특히 전기요금은 <strong>누진제</strong>가 적용되어 사용량이 늘수록 단가가 크게 올라가므로
          사용 구간을 관리하는 것이 중요합니다.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* 전기 */}
          <div className="rounded-lg border border-yellow-100 bg-yellow-50/50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-sm text-gray-900">전기요금</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              주택용 전기는 <strong>누진 구간제</strong>를 적용합니다. 사용량에 따라
              1구간(~200kWh), 2구간(201~400kWh), 3구간(401kWh~)으로 나뉘며,
              구간이 올라갈수록 kWh당 단가가 급격히 상승합니다. 기본요금 + 전력량요금 +
              기후환경요금 + 연료비조정액에 부가세와 전력산업기반기금이 추가됩니다.
            </p>
          </div>

          {/* 수도 */}
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-sm text-gray-900">수도요금</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              수도요금은 <strong>기본요금 + 사용량 요금</strong> 구조입니다.
              가정용의 경우 사용 구간별로 m³당 단가가 달라지며,
              상수도 요금 외에 하수도 요금과 물이용부담금이 별도로 부과됩니다.
              지자체별로 요금이 다르므로 거주 지역의 요금표를 확인하세요.
            </p>
          </div>

          {/* 가스 */}
          <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-sm text-gray-900">가스요금</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              도시가스 요금은 <strong>MJ(메가줄) 기반</strong>으로 산정됩니다.
              계량기의 m³ 사용량에 열량환산계수를 곱해 MJ로 변환한 뒤 단가를 적용합니다.
              계절별(하절기/동절기)로 요금이 다르며, 취사용과 난방용의 기본요금이 다릅니다.
              부가가치세 10%가 별도 부과됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 2. 2026년 전기요금 구간표 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          2026년 주택용 전기요금 구간표
        </h3>
        <p className="text-sm text-gray-500">
          주택용(저압) 기준, 부가세 및 전력산업기반기금 별도
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-slate-200">
                  구간
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b border-slate-200">
                  사용량 (kWh)
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700 border-b border-slate-200">
                  기본요금 (원/호)
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700 border-b border-slate-200">
                  전력량요금 (원/kWh)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-green-50/50 transition-colors">
                <td className="px-4 py-3 border-b border-slate-100">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    1구간
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-slate-100">~200kWh</td>
                <td className="px-4 py-3 border-b border-slate-100 text-right font-medium">
                  910
                </td>
                <td className="px-4 py-3 border-b border-slate-100 text-right font-medium text-green-700">
                  120.0
                </td>
              </tr>
              <tr className="hover:bg-yellow-50/50 transition-colors">
                <td className="px-4 py-3 border-b border-slate-100">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    2구간
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-slate-100">201~400kWh</td>
                <td className="px-4 py-3 border-b border-slate-100 text-right font-medium">
                  1,600
                </td>
                <td className="px-4 py-3 border-b border-slate-100 text-right font-medium text-yellow-700">
                  214.6
                </td>
              </tr>
              <tr className="hover:bg-red-50/50 transition-colors">
                <td className="px-4 py-3 border-b border-slate-100">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    3구간
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-slate-100">401kWh~</td>
                <td className="px-4 py-3 border-b border-slate-100 text-right font-medium">
                  7,300
                </td>
                <td className="px-4 py-3 border-b border-slate-100 text-right font-medium text-red-700">
                  307.3
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800 space-y-1">
          <p>
            <strong>참고:</strong> 위 요금에 <strong>기후환경요금</strong>(약 9원/kWh)과{" "}
            <strong>연료비조정액</strong>(약 5원/kWh)이 추가됩니다.
          </p>
          <p>
            최종 고지서에는 <strong>부가가치세</strong>(10%)와{" "}
            <strong>전력산업기반기금</strong>(3.7%)이 별도 부과됩니다.
          </p>
          <p>
            여름철(7~8월)에는 별도의 하계 요금 체계가 적용될 수 있습니다.
          </p>
        </div>
      </div>

      {/* 3. 공과금 절약 꿀팁 */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-green-500" />
          공과금 절약 꿀팁
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* 팁 1 */}
          <div className="rounded-lg border border-slate-100 p-4 space-y-2 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">
                심야 전력 활용하기
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              세탁기, 식기세척기 등 고전력 가전은 심야 시간대(23시~09시)에 사용하면
              경부하 요금이 적용되어 전기료를 절약할 수 있습니다. 타이머 기능을 활용해
              심야 시간에 자동 작동하도록 설정해 보세요.
            </p>
          </div>

          {/* 팁 2 */}
          <div className="rounded-lg border border-slate-100 p-4 space-y-2 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">
                절수 습관 들이기
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              샤워 시간을 1분 줄이면 월 약 1.2m³(약 1,000원)을 절약합니다.
              절수형 샤워헤드와 양변기 부속을 교체하면 추가 절약이 가능합니다.
              설거지할 때 물을 틀어놓지 말고 받아서 사용하는 것도 효과적입니다.
            </p>
          </div>

          {/* 팁 3 */}
          <div className="rounded-lg border border-slate-100 p-4 space-y-2 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">
                겨울철 가스비 줄이기
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              보일러 온도를 외출 모드(10~15°C)로 설정하면 재가열 비용을 줄일 수 있습니다.
              창문 틈새에 문풍지를 붙이고, 커튼을 두꺼운 것으로 교체하면 단열 효과가 높아집니다.
              실내 적정 온도 18~20°C를 유지하면 가스비를 최대 20% 절약할 수 있습니다.
            </p>
          </div>

          {/* 팁 4 */}
          <div className="rounded-lg border border-slate-100 p-4 space-y-2 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="font-semibold text-sm text-gray-900">
                에너지효율 1등급 가전 사용
              </h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              에너지소비효율 1등급 제품은 5등급 대비 최대 30~40% 전력을 절약합니다.
              냉장고, 에어컨, 세탁기 등 상시 사용 가전부터 교체하면 효과가 큽니다.
              정부의 에너지효율 가전 구매 보조금 제도도 활용해 보세요.
            </p>
          </div>
        </div>
      </div>

      {/* 4. FAQ */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          자주 묻는 질문 (FAQ)
        </h3>

        <div className="space-y-2">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-800 pr-4">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
