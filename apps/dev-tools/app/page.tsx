"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Braces,
  FileKey,
  Link,
  Fingerprint,
  Hash,
  Regex,
  Type,
  Copy,
  Check,
  Menu,
  X,
} from "lucide-react";
import {
  formatJSON,
  minifyJSON,
  validateJSON,
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  generateMultipleUUIDs,
  generateAllHashes,
  testRegex,
  highlightMatches,
  generateLoremIpsum,
  REGEX_EXAMPLES,
} from "./lib/devUtils";
import type {
  JSONValidationResult,
  URLEncodeMode,
  UUIDOptions,
  HashAlgorithm,
  RegexMatch,
  LoremOptions,
} from "./lib/devUtils";

// ─── 탭 정의 ──────────────────────────────────────

type ToolTab =
  | "json"
  | "base64"
  | "url"
  | "uuid"
  | "hash"
  | "regex"
  | "lorem";

interface TabInfo {
  id: ToolTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabInfo[] = [
  { id: "json", label: "JSON 포맷터", icon: <Braces size={18} /> },
  { id: "base64", label: "Base64", icon: <FileKey size={18} /> },
  { id: "url", label: "URL 인코딩", icon: <Link size={18} /> },
  { id: "uuid", label: "UUID 생성", icon: <Fingerprint size={18} /> },
  { id: "hash", label: "해시 생성", icon: <Hash size={18} /> },
  { id: "regex", label: "정규식 테스트", icon: <Regex size={18} /> },
  { id: "lorem", label: "Lorem Ipsum", icon: <Type size={18} /> },
];

// ─── 복사 버튼 컴포넌트 ─────────────────────────────

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
        copied
          ? "bg-green-100 text-green-700"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      } ${className || ""}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

// ─── JSON 포맷터 ────────────────────────────────────

function JSONTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [validation, setValidation] = useState<JSONValidationResult | null>(null);

  const handleFormat = () => {
    try {
      const result = formatJSON(input, indent);
      setOutput(result);
      setValidation({ valid: true });
    } catch {
      const v = validateJSON(input);
      setValidation(v);
      setOutput("");
    }
  };

  const handleMinify = () => {
    try {
      const result = minifyJSON(input);
      setOutput(result);
      setValidation({ valid: true });
    } catch {
      const v = validateJSON(input);
      setValidation(v);
      setOutput("");
    }
  };

  const handleValidate = () => {
    const v = validateJSON(input);
    setValidation(v);
    if (v.valid) {
      setOutput("JSON이 유효합니다.");
    } else {
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">JSON 포맷터 / 검증기</h2>
      <p className="text-sm text-slate-500">
        JSON 문자열을 포맷팅, 압축, 검증할 수 있습니다.
      </p>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">들여쓰기:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value={2}>2 스페이스</option>
            <option value={4}>4 스페이스</option>
          </select>
        </div>
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          포맷 (Pretty Print)
        </button>
        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-slate-600 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          압축 (Minify)
        </button>
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm font-medium hover:bg-purple-600 transition-colors"
        >
          검증
        </button>
      </div>

      {validation && !validation.valid && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          <strong>오류:</strong> {validation.error}
          {validation.line && (
            <span className="ml-2">
              (줄: {validation.line}, 열: {validation.column})
            </span>
          )}
        </div>
      )}

      {validation?.valid && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          JSON이 유효합니다.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            입력
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="code-area w-full h-64 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">결과</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            className="code-area w-full h-64 p-3 rounded-md resize-y text-sm bg-[var(--dev-code-bg)] text-[var(--dev-code-text)] border border-slate-600"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Base64 인코딩/디코딩 ────────────────────────────

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleEncode = () => {
    try {
      setOutput(base64Encode(input));
      setError("");
    } catch {
      setError("인코딩 중 오류가 발생했습니다.");
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      setOutput(base64Decode(input));
      setError("");
    } catch {
      setError("유효하지 않은 Base64 문자열입니다.");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Base64 인코딩 / 디코딩</h2>
      <p className="text-sm text-slate-500">
        텍스트를 Base64로 인코딩/디코딩합니다. UTF-8 (한글 등)을 지원합니다.
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleEncode}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          인코딩
        </button>
        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-slate-600 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          디코딩
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            입력
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="인코딩 또는 디코딩할 텍스트를 입력하세요"
            className="code-area w-full h-48 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">결과</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            className="code-area w-full h-48 p-3 rounded-md resize-y text-sm bg-[var(--dev-code-bg)] text-[var(--dev-code-text)] border border-slate-600"
          />
        </div>
      </div>
    </div>
  );
}

// ─── URL 인코딩/디코딩 ──────────────────────────────

function URLTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<URLEncodeMode>("component");
  const [error, setError] = useState("");

  const handleEncode = () => {
    try {
      setOutput(urlEncode(input, mode));
      setError("");
    } catch {
      setError("인코딩 중 오류가 발생했습니다.");
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      setOutput(urlDecode(input, mode));
      setError("");
    } catch {
      setError("유효하지 않은 URL 인코딩 문자열입니다.");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">URL 인코딩 / 디코딩</h2>
      <p className="text-sm text-slate-500">
        URL 문자열을 인코딩/디코딩합니다.
      </p>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">모드:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as URLEncodeMode)}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="component">encodeURIComponent</option>
            <option value="uri">encodeURI</option>
          </select>
        </div>
        <button
          onClick={handleEncode}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          인코딩
        </button>
        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-slate-600 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          디코딩
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            입력
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/path?key=값"
            className="code-area w-full h-48 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">결과</label>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            className="code-area w-full h-48 p-3 rounded-md resize-y text-sm bg-[var(--dev-code-bg)] text-[var(--dev-code-text)] border border-slate-600"
          />
        </div>
      </div>
    </div>
  );
}

// ─── UUID 생성기 ────────────────────────────────────

function UUIDTool() {
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState<UUIDOptions>({
    uppercase: false,
    hyphen: true,
  });
  const [uuids, setUuids] = useState<string[]>([]);

  const handleGenerate = () => {
    const result = generateMultipleUUIDs(count, options);
    setUuids(result);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">UUID v4 생성기</h2>
      <p className="text-sm text-slate-500">
        랜덤 UUID v4를 생성합니다.
      </p>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">생성 개수:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={options.uppercase}
            onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
            className="rounded"
          />
          대문자
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={options.hyphen}
            onChange={(e) => setOptions({ ...options, hyphen: e.target.checked })}
            className="rounded"
          />
          하이픈 포함
        </label>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          생성
        </button>
      </div>

      {uuids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              생성 결과 ({uuids.length}개)
            </span>
            <CopyButton text={uuids.join("\n")} />
          </div>
          <div className="code-area bg-[var(--dev-code-bg)] text-[var(--dev-code-text)] p-4 rounded-md max-h-80 overflow-y-auto border border-slate-600">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between py-0.5">
                <span className="text-sm">{uuid}</span>
                <CopyButton text={uuid} className="!py-0.5 !px-2 !text-xs" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 해시 생성기 ────────────────────────────────────

function HashTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const result = await generateAllHashes(input);
      setHashes(result);
    } catch {
      setHashes(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">해시 생성기</h2>
      <p className="text-sm text-slate-500">
        입력 텍스트의 SHA-1, SHA-256, SHA-384, SHA-512 해시를 생성합니다.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          입력 텍스트
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="해시할 텍스트를 입력하세요"
          className="code-area w-full h-32 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !input}
        className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "생성 중..." : "해시 생성"}
      </button>

      {hashes && (
        <div className="space-y-3">
          {(Object.entries(hashes) as [HashAlgorithm, string][]).map(
            ([alg, hash]) => (
              <div
                key={alg}
                className="p-3 bg-[var(--dev-code-bg)] rounded-md border border-slate-600"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-400">
                    {alg}
                  </span>
                  <CopyButton text={hash} className="!py-0.5 !px-2 !text-xs" />
                </div>
                <p className="code-area text-sm text-[var(--dev-code-text)] break-all">
                  {hash}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── 정규식 테스터 ──────────────────────────────────

function RegexTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState("");

  const flagStr = [flags.g && "g", flags.i && "i", flags.m && "m"]
    .filter(Boolean)
    .join("");

  // 실시간 매칭
  useEffect(() => {
    if (!pattern || !testString) {
      setMatches([]);
      setError("");
      return;
    }
    const result = testRegex(pattern, flagStr, testString);
    if (result.error) {
      setError(result.error);
      setMatches([]);
    } else {
      setError("");
      setMatches(result.matches);
    }
  }, [pattern, flagStr, testString]);

  const segments = highlightMatches(testString, matches);

  const handleExample = (ex: { pattern: string; flags: string }) => {
    setPattern(ex.pattern);
    setFlags({
      g: ex.flags.includes("g"),
      i: ex.flags.includes("i"),
      m: ex.flags.includes("m"),
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">정규식 테스터</h2>
      <p className="text-sm text-slate-500">
        정규식 패턴을 실시간으로 테스트하고 매치 결과를 확인합니다.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          정규식 패턴
        </label>
        <div className="flex gap-2 items-center">
          <span className="text-slate-400 text-lg">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="[a-z]+"
            className="code-area flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          />
          <span className="text-slate-400 text-lg">/</span>
          <div className="flex gap-2">
            {(["g", "i", "m"] as const).map((f) => (
              <label
                key={f}
                className="flex items-center gap-1 text-sm text-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={flags[f]}
                  onChange={(e) =>
                    setFlags({ ...flags, [f]: e.target.checked })
                  }
                  className="rounded"
                />
                {f}
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          흔한 정규식 예제
        </label>
        <div className="flex flex-wrap gap-2">
          {REGEX_EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => handleExample(ex)}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs hover:bg-slate-200 transition-colors"
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          테스트 문자열
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="테스트할 문자열을 입력하세요"
          className="w-full h-32 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      {testString && pattern && !error && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              매칭 하이라이트
            </label>
            <div className="p-3 bg-white border border-slate-300 rounded-md text-sm whitespace-pre-wrap break-all min-h-[3rem]">
              {segments.map((seg, i) =>
                seg.isMatch ? (
                  <span key={i} className="match-highlight px-0.5">
                    {seg.text}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              매치 결과 ({matches.length}개)
            </label>
            {matches.length === 0 ? (
              <p className="text-sm text-slate-400">매치 없음</p>
            ) : (
              <div className="code-area bg-[var(--dev-code-bg)] text-[var(--dev-code-text)] p-3 rounded-md max-h-60 overflow-y-auto border border-slate-600 text-sm space-y-1">
                {matches.map((m, i) => (
                  <div key={i}>
                    <span className="text-blue-400">#{i + 1}</span>{" "}
                    <span className="text-green-400">
                      &quot;{m.match}&quot;
                    </span>{" "}
                    <span className="text-slate-400">
                      (인덱스: {m.index})
                    </span>
                    {m.groups.length > 0 && (
                      <span className="text-yellow-400 ml-2">
                        그룹: [{m.groups.map((g) => `"${g}"`).join(", ")}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Lorem Ipsum 생성기 ─────────────────────────────

function LoremTool() {
  const [options, setOptions] = useState<LoremOptions>({
    paragraphs: 3,
    wordsPerParagraph: 50,
    korean: false,
    htmlTags: false,
  });
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const result = generateLoremIpsum(options);
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Lorem Ipsum 생성기</h2>
      <p className="text-sm text-slate-500">
        더미 텍스트를 생성합니다. 한국어도 지원합니다.
      </p>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">단락 수:</label>
          <input
            type="number"
            min={1}
            max={20}
            value={options.paragraphs}
            onChange={(e) =>
              setOptions({
                ...options,
                paragraphs: Math.min(20, Math.max(1, Number(e.target.value))),
              })
            }
            className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">단락당 단어 수:</label>
          <input
            type="number"
            min={10}
            max={200}
            value={options.wordsPerParagraph}
            onChange={(e) =>
              setOptions({
                ...options,
                wordsPerParagraph: Math.min(200, Math.max(10, Number(e.target.value))),
              })
            }
            className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={options.korean}
            onChange={(e) => setOptions({ ...options, korean: e.target.checked })}
            className="rounded"
          />
          한국어
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={options.htmlTags}
            onChange={(e) =>
              setOptions({ ...options, htmlTags: e.target.checked })
            }
            className="rounded"
          />
          {"HTML <p> 태그"}
        </label>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          생성
        </button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">결과</label>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-3 rounded-md resize-y text-sm bg-[var(--dev-code-bg)] text-[var(--dev-code-text)] border border-slate-600"
          />
        </div>
      )}
    </div>
  );
}


// ─── 메인 페이지 ────────────────────────────────────

export default function DevToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>("json");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderTool = () => {
    switch (activeTab) {
      case "json":
        return <JSONTool />;
      case "base64":
        return <Base64Tool />;
      case "url":
        return <URLTool />;
      case "uuid":
        return <UUIDTool />;
      case "hash":
        return <HashTool />;
      case "regex":
        return <RegexTool />;
      case "lorem":
        return <LoremTool />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-[var(--dev-code-bg)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
              <Braces size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-[family-name:var(--font-space)]">
                개발자 도구
              </h1>
              <p className="text-xs text-slate-400">
                JSON, Base64, URL, UUID, Hash, Regex, Lorem Ipsum
              </p>
            </div>
          </div>
          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* 모바일 탭 바 */}
        <div
          className={`lg:hidden ${mobileMenuOpen ? "block" : "hidden"} bg-white border-b border-slate-200`}
        >
          <div className="flex flex-wrap gap-1 p-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`tool-tab flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  activeTab === tab.id ? "active" : "text-slate-600"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 데스크톱 사이드바 */}
        <aside className="hidden lg:block w-56 shrink-0 bg-white border-r border-slate-200 p-3">
          <nav className="space-y-1 sticky top-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
              도구 목록
            </p>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tool-tab w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left ${
                  activeTab === tab.id ? "active" : "text-slate-600"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{renderTool()}</main>
      </div>

      {/* 푸터 */}
      <footer className="bg-[var(--dev-code-bg)] text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex gap-4 items-start">
              <a
                href="/privacy"
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                개인정보처리방침
              </a>
              <a
                href="/terms"
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                이용약관
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} 개발자 도구. 모든 처리는
            브라우저에서 수행되며, 서버로 데이터가 전송되지 않습니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
