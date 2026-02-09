const tools = [
  {
    name: "연봉 계산기",
    desc: "2025 실수령액 계산",
    url: process.env.NEXT_PUBLIC_SALARY_URL || "https://salary.example.com",
    color: "#2563EB",
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
    <div className="mx-auto w-full max-w-lg px-5 py-6">
      <p className="mb-3 text-sm font-semibold text-gray-400">다른 도구도 사용해 보세요</p>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: tool.color }}
            />
            {tool.name}
          </a>
        ))}
      </div>
    </div>
  );
}
