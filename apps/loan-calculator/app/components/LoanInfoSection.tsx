"use client";

import { useState } from "react";
import {
  Scale,
  TrendingUp,
  Lightbulb,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Landmark,
  ShieldCheck,
  CreditCard,
  BarChart3,
} from "lucide-react";

/* ───── FAQ data ───── */
const FAQ_ITEMS = [
  {
    q: "어떤 상환 방식이 이자를 가장 적게 낼까요?",
    a: "총 이자 부담이 가장 적은 방식은 원금균등상환입니다. 매달 동일한 원금을 갚아 나가기 때문에 잔금이 빠르게 줄어들고, 그만큼 이자도 적게 발생합니다. 반면 만기일시상환은 원금을 마지막에 한꺼번에 갚기 때문에 총 이자가 가장 많습니다.",
  },
  {
    q: "DTI와 DSR은 무엇인가요?",
    a: "DTI(총부채상환비율)는 연소득 대비 주택담보대출 원리금 상환액과 기타 부채의 이자 상환액 비율입니다. DSR(총부채원리금상환비율)은 모든 대출의 원리금 상환액을 연소득으로 나눈 비율로, DTI보다 더 엄격한 기준입니다. 일반적으로 DSR 40~50% 이내여야 대출이 가능합니다.",
  },
  {
    q: "대출 중간에 상환 방식을 변경할 수 있나요?",
    a: "대부분의 은행에서 대출 상환 방식 변경이 가능하지만, 별도의 수수료가 발생할 수 있습니다. 변경 시에는 잔여 원금을 기준으로 새로운 상환 스케줄이 적용됩니다. 자세한 조건은 거래 은행에 직접 문의하는 것이 좋습니다.",
  },
  {
    q: "고정금리와 변동금리, 언제 어떤 것을 선택해야 하나요?",
    a: "금리 상승기에는 고정금리가 유리하고, 금리 하락기에는 변동금리가 유리합니다. 현재 금리가 역사적으로 낮은 수준이라면 고정금리로 확정하는 것이 안전합니다. 단, 고정금리는 보통 변동금리보다 0.3~0.5%p 높게 시작하므로 대출 기간과 금리 전망을 종합적으로 고려해야 합니다.",
  },
  {
    q: "신용점수가 대출 금리에 어떤 영향을 주나요?",
    a: "신용점수가 높을수록 금리 우대를 받을 수 있습니다. 일반적으로 신용등급 1~2등급(NICE 기준 900점 이상)은 최저 금리를 적용받고, 등급이 내려갈수록 0.5~2%p까지 금리가 높아질 수 있습니다. 연체 없이 꾸준히 대출을 상환하면 신용점수가 개선됩니다.",
  },
];

/* ───── FAQ Accordion item ───── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[var(--loan-border)] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-sm font-medium text-gray-800">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-[var(--loan-border)]">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ───── Main component ───── */
export default function LoanInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 space-y-10">
      {/* ── 1. 대출 상환 방식 비교 ── */}
      <div className="rounded-xl border border-[var(--loan-border)] bg-white p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[var(--loan-primary)]" />
          <h2 className="text-lg font-bold text-gray-900">대출 상환 방식 비교</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          대출을 받을 때 상환 방식에 따라 매달 납부하는 금액과 총 이자가 크게 달라집니다.
          아래 세 가지 방식의 특징과 장단점을 비교해 보세요.
        </p>

        {/* Comparison Table */}
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-3 px-3 text-left font-semibold text-[var(--loan-primary)] rounded-tl-lg">
                  구분
                </th>
                <th className="py-3 px-3 text-left font-semibold text-[var(--loan-primary)]">
                  원리금균등상환
                </th>
                <th className="py-3 px-3 text-left font-semibold text-[var(--loan-primary)]">
                  원금균등상환
                </th>
                <th className="py-3 px-3 text-left font-semibold text-[var(--loan-primary)] rounded-tr-lg">
                  만기일시상환
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-[var(--loan-border)]">
                <td className="py-3 px-3 font-medium text-gray-800">월 납부액</td>
                <td className="py-3 px-3">매달 동일</td>
                <td className="py-3 px-3">점점 감소</td>
                <td className="py-3 px-3">이자만 납부</td>
              </tr>
              <tr className="border-b border-[var(--loan-border)]">
                <td className="py-3 px-3 font-medium text-gray-800">총 이자</td>
                <td className="py-3 px-3">중간</td>
                <td className="py-3 px-3 text-[var(--loan-success)] font-medium">가장 적음</td>
                <td className="py-3 px-3 text-[var(--loan-accent)] font-medium">가장 많음</td>
              </tr>
              <tr className="border-b border-[var(--loan-border)]">
                <td className="py-3 px-3 font-medium text-gray-800">초기 부담</td>
                <td className="py-3 px-3">보통</td>
                <td className="py-3 px-3">높음</td>
                <td className="py-3 px-3 text-[var(--loan-success)] font-medium">낮음</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-gray-800">추천 대상</td>
                <td className="py-3 px-3">안정적 수입자</td>
                <td className="py-3 px-3">이자 절감 중시</td>
                <td className="py-3 px-3">단기 자금 필요</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pros & Cons cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* 원리금균등 */}
          <div className="rounded-lg border border-[var(--loan-border)] p-4 space-y-2">
            <h3 className="text-sm font-semibold text-[var(--loan-primary)]">원리금균등상환</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-start gap-1.5 text-[var(--loan-success)]">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">매달 같은 금액으로 가계 계획이 쉬움</span>
              </div>
              <div className="flex items-start gap-1.5 text-[var(--loan-success)]">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">초기 상환 부담이 적당함</span>
              </div>
              <div className="flex items-start gap-1.5 text-red-400">
                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">원금균등 대비 총 이자 부담 큼</span>
              </div>
            </div>
          </div>
          {/* 원금균등 */}
          <div className="rounded-lg border border-[var(--loan-border)] p-4 space-y-2">
            <h3 className="text-sm font-semibold text-[var(--loan-primary)]">원금균등상환</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-start gap-1.5 text-[var(--loan-success)]">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">총 이자가 가장 적어 장기적으로 유리</span>
              </div>
              <div className="flex items-start gap-1.5 text-[var(--loan-success)]">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">시간이 지날수록 부담이 줄어듦</span>
              </div>
              <div className="flex items-start gap-1.5 text-red-400">
                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">초기 월 상환액이 가장 높음</span>
              </div>
            </div>
          </div>
          {/* 만기일시 */}
          <div className="rounded-lg border border-[var(--loan-border)] p-4 space-y-2">
            <h3 className="text-sm font-semibold text-[var(--loan-primary)]">만기일시상환</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-start gap-1.5 text-[var(--loan-success)]">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">매달 이자만 내므로 부담이 가장 적음</span>
              </div>
              <div className="flex items-start gap-1.5 text-[var(--loan-success)]">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">단기 운용 자금에 적합</span>
              </div>
              <div className="flex items-start gap-1.5 text-red-400">
                <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">총 이자 부담이 가장 크고 만기 시 목돈 필요</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. 대출 이자 계산 원리 ── */}
      <div className="rounded-xl border border-[var(--loan-border)] bg-white p-6 space-y-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--loan-primary)]" />
          <h2 className="text-lg font-bold text-gray-900">대출 이자 계산 원리</h2>
        </div>

        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">단리 vs 복리</h3>
            <p>
              <strong className="text-[var(--loan-primary)]">단리</strong>는 원금에만 이자가 붙는
              방식이고, <strong className="text-[var(--loan-primary)]">복리</strong>는 원금과 이자를
              합산한 금액에 이자가 붙는 방식입니다. 대부분의 대출 상품은 복리 방식으로 이자가
              계산되며, 이자가 쌓이지 않도록 매월 이자를 납부하는 구조입니다.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">연이율과 월이율의 관계</h3>
            <p>
              대출 금리는 보통 연이율(%)로 표시됩니다. 실제 매달 적용되는 월이율은{" "}
              <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[var(--loan-primary)]">
                연이율 ÷ 12
              </span>
              로 계산합니다. 예를 들어 연 3.6%라면 월이율은 0.3%이며, 대출금 1억 원 기준 첫 달
              이자는 약 30만 원입니다.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">이자 계산 공식</h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="text-xs text-gray-500">원리금균등상환 월 납입금 공식:</p>
              <p className="font-mono text-sm text-[var(--loan-primary)] font-medium">
                M = P × r(1+r)^n ÷ [(1+r)^n - 1]
              </p>
              <p className="text-xs text-gray-500 mt-1">
                M: 월 납입금 / P: 대출 원금 / r: 월이율 / n: 총 상환 개월 수
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. 대출 꿀팁 ── */}
      <div className="rounded-xl border border-[var(--loan-border)] bg-white p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[var(--loan-accent)]" />
          <h2 className="text-lg font-bold text-gray-900">대출 꿀팁</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Tip 1 */}
          <div className="flex gap-3 p-4 rounded-lg bg-gray-50">
            <Landmark className="w-5 h-5 text-[var(--loan-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">여러 은행 금리 비교</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                같은 대출 상품이라도 은행마다 금리가 0.3~1%p 이상 차이 날 수 있습니다.
                금융감독원 금융상품 비교 사이트나 대출 비교 플랫폼을 활용하세요.
              </p>
            </div>
          </div>
          {/* Tip 2 */}
          <div className="flex gap-3 p-4 rounded-lg bg-gray-50">
            <BarChart3 className="w-5 h-5 text-[var(--loan-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">고정금리 vs 변동금리</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                금리 상승기에는 고정금리가, 하락기에는 변동금리가 유리합니다.
                혼합형(5년 고정 후 변동)도 있으니 금리 전망에 따라 선택하세요.
              </p>
            </div>
          </div>
          {/* Tip 3 */}
          <div className="flex gap-3 p-4 rounded-lg bg-gray-50">
            <ShieldCheck className="w-5 h-5 text-[var(--loan-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">중도상환수수료 확인</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                대출을 조기에 갚으면 중도상환수수료(보통 원금의 1~1.5%)가 부과될 수 있습니다.
                3년 이후에는 면제되는 경우가 많으니 계약 조건을 반드시 확인하세요.
              </p>
            </div>
          </div>
          {/* Tip 4 */}
          <div className="flex gap-3 p-4 rounded-lg bg-gray-50">
            <CreditCard className="w-5 h-5 text-[var(--loan-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">신용점수 관리</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                신용점수가 높을수록 금리 우대를 받을 수 있습니다. 대출 전 불필요한 카드론이나
                현금서비스를 정리하고, 기존 대출을 성실히 상환하면 유리합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. 자주 묻는 질문 (FAQ) ── */}
      <div className="rounded-xl border border-[var(--loan-border)] bg-white p-6 space-y-5">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[var(--loan-primary)]" />
          <h2 className="text-lg font-bold text-gray-900">자주 묻는 질문</h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
