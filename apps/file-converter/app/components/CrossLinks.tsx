const tools = [
  {
    name: "연봉 계산기",
    desc: "2025 실수령액 계산",
    url: process.env.NEXT_PUBLIC_SALARY_URL || "https://salary.example.com",
    color: "#2563EB",
  },
  {
    name: "MBTI 테스트",
    desc: "16가지 성격 유형 검사",
    url: process.env.NEXT_PUBLIC_MBTI_URL || "https://mbti.example.com",
    color: "#8B5CF6",
  },
  {
    name: "QR 생성기",
    desc: "무료 QR코드 생성",
    url: process.env.NEXT_PUBLIC_QR_URL || "https://qr.example.com",
    color: "#2563EB",
  },
];

export default function CrossLinks() {
  return (
    <div className="border-t border-[#E7E5E4] bg-white px-6 py-8 md:px-10">
      <p className="mb-4 text-sm font-semibold text-[#A8A29E]">다른 도구도 사용해 보세요</p>
      <div className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-[#E7E5E4] px-4 py-2.5 text-sm font-medium text-[#57534E] transition-colors hover:bg-[#FAFAF9]"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: tool.color }}
            />
            <span>{tool.name}</span>
            <span className="hidden text-xs text-[#A8A29E] sm:inline">- {tool.desc}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
