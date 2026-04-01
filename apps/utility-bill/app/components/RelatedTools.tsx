"use client";

const ALL_TOOLS = [
  { id: "salary", name: "연봉 계산기", url: "https://salary.onekit.co.kr", desc: "실수령액·4대보험 계산", icon: "💰" },
  { id: "mbti", name: "MBTI 테스트", url: "https://mbti.onekit.co.kr", desc: "16가지 성격유형 검사", icon: "🧠" },
  { id: "qr", name: "QR 코드", url: "https://qr.onekit.co.kr", desc: "QR 코드 생성기", icon: "📱" },
  { id: "file", name: "파일 변환", url: "https://file.onekit.co.kr", desc: "이미지·문서 변환", icon: "📂" },
  { id: "dot", name: "도트 아트", url: "https://dot.onekit.co.kr", desc: "픽셀 아트 생성", icon: "🎨" },
  { id: "loan", name: "대출 계산기", url: "https://loan.onekit.co.kr", desc: "대출 이자 계산", icon: "🏦" },
  { id: "text", name: "글자수 세기", url: "https://text.onekit.co.kr", desc: "글자수·바이트 계산", icon: "📝" },
  { id: "date", name: "날짜 계산기", url: "https://date.onekit.co.kr", desc: "D-day·날짜 계산", icon: "📅" },
  { id: "unit", name: "단위 변환기", url: "https://unit.onekit.co.kr", desc: "길이·무게·온도 변환", icon: "📏" },
  { id: "health", name: "건강 계산기", url: "https://health.onekit.co.kr", desc: "BMI·체지방·칼로리", icon: "💪" },
  { id: "color", name: "색상 도구", url: "https://color.onekit.co.kr", desc: "색상 변환·팔레트", icon: "🎨" },
  { id: "dev", name: "개발자 도구", url: "https://dev.onekit.co.kr", desc: "JSON·Base64·UUID", icon: "🛠️" },
  { id: "bill", name: "공과금 계산기", url: "https://bill.onekit.co.kr", desc: "전기·수도·가스 요금", icon: "⚡" },
];

interface RelatedToolsProps {
  currentToolId: string;
}

export default function RelatedTools({ currentToolId }: RelatedToolsProps) {
  const tools = ALL_TOOLS.filter((t) => t.id !== currentToolId);

  return (
    <section className="mt-12 mb-8 px-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        다른 도구 둘러보기
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm group"
          >
            <span className="text-xl flex-shrink-0">{tool.icon}</span>
            <div className="min-w-0">
              <div className="font-medium text-gray-800 group-hover:text-blue-600 truncate">
                {tool.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {tool.desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
