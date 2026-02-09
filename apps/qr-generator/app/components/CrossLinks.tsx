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
    name: "파일 변환기",
    desc: "이미지 변환 및 압축",
    url: process.env.NEXT_PUBLIC_FILE_URL || "https://file.example.com",
    color: "#0D6E6E",
  },
];

export default function CrossLinks() {
  return (
    <div className="hidden lg:block border-t border-zinc-200 bg-white px-10 py-6">
      <p className="mb-3 text-sm font-semibold text-zinc-400">다른 도구도 사용해 보세요</p>
      <div className="flex gap-3">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: tool.color }}
            />
            {tool.name}
          </a>
        ))}
      </div>
    </div>
  );
}
