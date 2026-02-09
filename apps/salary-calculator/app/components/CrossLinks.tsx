const tools = [
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
  {
    name: "파일 변환기",
    desc: "이미지 변환 및 압축",
    url: process.env.NEXT_PUBLIC_FILE_URL || "https://file.example.com",
    color: "#0D6E6E",
  },
];

export default function CrossLinks() {
  return (
    <div className="border-t border-[var(--salary-border)] bg-white px-6 py-8 md:px-8">
      <p className="mb-4 text-sm font-semibold text-slate-500">다른 도구도 사용해 보세요</p>
      <div className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: tool.color }}
            />
            <span>{tool.name}</span>
            <span className="hidden text-xs text-slate-400 sm:inline">- {tool.desc}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
