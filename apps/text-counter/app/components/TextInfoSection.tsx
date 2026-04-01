"use client";

import { useState } from "react";
import { Type, FileText, Lightbulb, HelpCircle, ChevronDown } from "lucide-react";

const platformLimits = [
  { platform: "Twitter (X)", limit: "280자" },
  { platform: "Instagram 바이오", limit: "150자" },
  { platform: "Facebook 게시물", limit: "63,206자" },
  { platform: "YouTube 제목", limit: "100자" },
  { platform: "네이버 블로그 제목", limit: "40자" },
  { platform: "Google 메타 디스크립션", limit: "160자" },
  { platform: "카카오톡 메시지", limit: "1,000자" },
];

const writingTips = [
  {
    title: "간결하게 쓰기",
    desc: "불필요한 수식어와 반복 표현을 줄이면 글의 전달력이 높아집니다. 한 문장에 하나의 메시지만 담는 것이 효과적입니다.",
  },
  {
    title: "키워드 배치",
    desc: "제목과 첫 문단에 핵심 키워드를 자연스럽게 배치하면 검색 엔진 최적화(SEO)에 도움이 됩니다.",
  },
  {
    title: "가독성 높이기",
    desc: "짧은 문장, 적절한 문단 나누기, 소제목 활용으로 독자가 내용을 빠르게 파악할 수 있게 합니다.",
  },
  {
    title: "구조화된 글쓰기",
    desc: "서론-본론-결론 또는 문제-해결 구조를 사용하면 논리적이고 설득력 있는 글을 작성할 수 있습니다.",
  },
];

const faqs = [
  {
    q: "공백도 글자수에 포함되나요?",
    a: "네, 공백(스페이스)도 하나의 문자로 카운트됩니다. 다만 대부분의 글자수 세기 도구에서는 '공백 포함'과 '공백 제외' 두 가지 수치를 모두 제공합니다. SNS나 플랫폼에 따라 공백 포함 여부가 다르므로 해당 플랫폼의 기준을 확인하세요.",
  },
  {
    q: "한글과 영어의 글자수 계산이 다른가요?",
    a: "글자수(문자 수) 자체는 한글이든 영어든 1자로 동일하게 카운트됩니다. 그러나 바이트 수는 다릅니다. UTF-8 기준으로 영어는 1바이트, 한글은 3바이트를 차지합니다. EUC-KR에서는 한글이 2바이트입니다.",
  },
  {
    q: "바이트(Byte)란 무엇인가요?",
    a: "바이트는 컴퓨터가 문자를 저장하는 데 사용하는 단위입니다. 인코딩 방식에 따라 같은 문자도 다른 바이트 수를 차지합니다. 예를 들어 '가'는 UTF-8에서 3바이트, EUC-KR에서 2바이트입니다. SMS 발송이나 데이터베이스 저장 시 바이트 수가 중요합니다.",
  },
  {
    q: "글자수를 줄이려면 어떻게 해야 하나요?",
    a: "불필요한 조사와 접속사를 줄이고, 중복 표현을 제거하세요. '~하는 것이 가능하다' 대신 '~할 수 있다'처럼 간결한 표현을 사용합니다. 또한 한자어나 외래어를 적절히 활용하면 글자수를 효과적으로 줄일 수 있습니다.",
  },
  {
    q: "UTF-8과 EUC-KR의 바이트 차이는?",
    a: "UTF-8은 전 세계 문자를 지원하는 유니코드 인코딩으로, 한글은 3바이트, 영어는 1바이트입니다. EUC-KR은 한국어 전용 인코딩으로, 한글은 2바이트, 영어는 1바이트입니다. 현재 대부분의 웹사이트는 UTF-8을 사용하지만, 일부 레거시 시스템에서는 EUC-KR을 사용합니다.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[var(--text-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800 pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed bg-gray-50/50 border-t border-[var(--text-border)]">
          {a}
        </div>
      )}
    </div>
  );
}

export default function TextInfoSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <div className="space-y-10">
        {/* 1. 글자수 세기가 중요한 이유 */}
        <div className="rounded-xl border border-[var(--text-border)] bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Type size={20} style={{ color: "var(--text-primary)" }} />
            글자수 세기가 중요한 이유
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              디지털 시대에서 글자수 관리는 효과적인 커뮤니케이션의 핵심입니다.
              SNS 플랫폼마다 고유한 글자수 제한이 있어 메시지를 정확하게
              전달하려면 글자수를 미리 확인해야 합니다.
            </p>
            <p>
              <strong>Twitter(X)</strong>는 280자, <strong>Instagram 바이오</strong>는
              150자, <strong>블로그 메타 디스크립션</strong>은 160자로 제한됩니다.
              학술 논문의 초록, 비즈니스 이메일의 제목, SEO 메타 태그 등에서도
              적절한 글자수를 지키는 것이 중요합니다.
            </p>
            <p>
              글자수를 최적화하면 검색 엔진에서의 노출도 향상되고, 독자의 집중도도
              높일 수 있습니다. 특히 모바일 환경에서는 제한된 화면에 핵심
              메시지를 효과적으로 전달하는 것이 더욱 중요합니다.
            </p>
          </div>
        </div>

        {/* 2. 플랫폼별 글자수 제한 */}
        <div className="rounded-xl border border-[var(--text-border)] bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} style={{ color: "var(--text-accent)" }} />
            플랫폼별 글자수 제한
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--text-border)]">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    플랫폼
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    글자수 제한
                  </th>
                </tr>
              </thead>
              <tbody>
                {platformLimits.map((item, i) => (
                  <tr
                    key={item.platform}
                    className={
                      i < platformLimits.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }
                  >
                    <td className="py-3 px-4 text-gray-700">{item.platform}</td>
                    <td className="py-3 px-4 text-right font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.limit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. 효과적인 글쓰기 팁 */}
        <div className="rounded-xl border border-[var(--text-border)] bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb size={20} style={{ color: "#F59E0B" }} />
            효과적인 글쓰기 팁
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {writingTips.map((tip, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-100 bg-gray-50/50 p-4"
              >
                <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                    style={{ background: "var(--text-primary)" }}
                  >
                    {i + 1}
                  </span>
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. FAQ */}
        <div className="rounded-xl border border-[var(--text-border)] bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle size={20} style={{ color: "var(--text-primary)" }} />
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
