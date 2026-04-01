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
  getRegexExamples,
} from "./lib/devUtils";
import type {
  JSONValidationResult,
  URLEncodeMode,
  UUIDOptions,
  HashAlgorithm,
  RegexMatch,
  LoremOptions,
} from "./lib/devUtils";
import { useTranslation } from "./i18n";
import LanguageSwitcher from "./i18n/LanguageSwitcher";
import RelatedTools from "./components/RelatedTools";
import DevToolsInfoSection from "./components/DevToolsInfoSection";

// ─── Tab definition ──────────────────────────────────────

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
  labelKey: string;
  icon: React.ReactNode;
}

const TABS: TabInfo[] = [
  { id: "json", labelKey: "tabs.json", icon: <Braces size={18} /> },
  { id: "base64", labelKey: "tabs.base64", icon: <FileKey size={18} /> },
  { id: "url", labelKey: "tabs.url", icon: <Link size={18} /> },
  { id: "uuid", labelKey: "tabs.uuid", icon: <Fingerprint size={18} /> },
  { id: "hash", labelKey: "tabs.hash", icon: <Hash size={18} /> },
  { id: "regex", labelKey: "tabs.regex", icon: <Regex size={18} /> },
  { id: "lorem", labelKey: "tabs.lorem", icon: <Type size={18} /> },
];

// ─── Copy button component ─────────────────────────────

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

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
      {copied ? t("common.copied") : t("common.copy")}
    </button>
  );
}

// ─── JSON Formatter ────────────────────────────────────

function JSONTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [validation, setValidation] = useState<JSONValidationResult | null>(null);
  const { t } = useTranslation();

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
      setOutput(t("json.validJson"));
    } else {
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">{t("json.title")}</h2>
      <p className="text-sm text-slate-500">
        {t("json.description")}
      </p>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">{t("json.indent")}</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="px-2 py-1 border border-slate-300 rounded text-sm"
          >
            <option value={2}>{t("json.spaces2")}</option>
            <option value={4}>{t("json.spaces4")}</option>
          </select>
        </div>
        <button
          onClick={handleFormat}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {t("json.format")}
        </button>
        <button
          onClick={handleMinify}
          className="px-4 py-2 bg-slate-600 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          {t("json.minify")}
        </button>
        <button
          onClick={handleValidate}
          className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm font-medium hover:bg-purple-600 transition-colors"
        >
          {t("json.validate")}
        </button>
      </div>

      {validation && !validation.valid && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          <strong>{t("json.errorLabel")}</strong> {validation.error}
          {validation.line && (
            <span className="ml-2">
              {t("json.lineCol", { line: validation.line, column: validation.column ?? 0 })}
            </span>
          )}
        </div>
      )}

      {validation?.valid && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          {t("json.validJson")}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("json.placeholder")}
            className="code-area w-full h-64 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">{t("common.result")}</label>
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

// ─── Base64 Encode/Decode ────────────────────────────

function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleEncode = () => {
    try {
      setOutput(base64Encode(input));
      setError("");
    } catch {
      setError(t("base64.encodeError"));
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      setOutput(base64Decode(input));
      setError("");
    } catch {
      setError(t("base64.decodeError"));
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">{t("base64.title")}</h2>
      <p className="text-sm text-slate-500">
        {t("base64.description")}
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleEncode}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {t("common.encode")}
        </button>
        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-slate-600 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          {t("common.decode")}
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
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("base64.placeholder")}
            className="code-area w-full h-48 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">{t("common.result")}</label>
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

// ─── URL Encode/Decode ──────────────────────────────

function URLTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<URLEncodeMode>("component");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleEncode = () => {
    try {
      setOutput(urlEncode(input, mode));
      setError("");
    } catch {
      setError(t("url.encodeError"));
      setOutput("");
    }
  };

  const handleDecode = () => {
    try {
      setOutput(urlDecode(input, mode));
      setError("");
    } catch {
      setError(t("url.decodeError"));
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">{t("url.title")}</h2>
      <p className="text-sm text-slate-500">
        {t("url.description")}
      </p>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">{t("url.mode")}</label>
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
          {t("common.encode")}
        </button>
        <button
          onClick={handleDecode}
          className="px-4 py-2 bg-slate-600 text-white rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          {t("common.decode")}
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
            {t("common.input")}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("url.placeholder")}
            className="code-area w-full h-48 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">{t("common.result")}</label>
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

// ─── UUID Generator ────────────────────────────────────

function UUIDTool() {
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState<UUIDOptions>({
    uppercase: false,
    hyphen: true,
  });
  const [uuids, setUuids] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleGenerate = () => {
    const result = generateMultipleUUIDs(count, options);
    setUuids(result);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">{t("uuid.title")}</h2>
      <p className="text-sm text-slate-500">
        {t("uuid.description")}
      </p>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">{t("uuid.count")}</label>
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
          {t("uuid.uppercase")}
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={options.hyphen}
            onChange={(e) => setOptions({ ...options, hyphen: e.target.checked })}
            className="rounded"
          />
          {t("uuid.hyphen")}
        </label>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {t("common.generate")}
        </button>
      </div>

      {uuids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              {t("uuid.resultCount", { count: uuids.length })}
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

// ─── Hash Generator ────────────────────────────────────

function HashTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
      <h2 className="text-xl font-bold text-slate-800">{t("hash.title")}</h2>
      <p className="text-sm text-slate-500">
        {t("hash.description")}
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("hash.inputLabel")}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("hash.placeholder")}
          className="code-area w-full h-32 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !input}
        className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? t("hash.generating") : t("hash.generateHash")}
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

// ─── Regex Tester ──────────────────────────────────

function RegexTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState("");
  const { t, locale } = useTranslation();

  const regexExamples = getRegexExamples(locale);

  const flagStr = [flags.g && "g", flags.i && "i", flags.m && "m"]
    .filter(Boolean)
    .join("");

  // Real-time matching
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
      <h2 className="text-xl font-bold text-slate-800">{t("regex.title")}</h2>
      <p className="text-sm text-slate-500">
        {t("regex.description")}
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("regex.patternLabel")}
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
          {t("regex.examplesLabel")}
        </label>
        <div className="flex flex-wrap gap-2">
          {regexExamples.map((ex) => (
            <button
              key={ex.nameKey}
              onClick={() => handleExample(ex)}
              className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs hover:bg-slate-200 transition-colors"
            >
              {t(ex.nameKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {t("regex.testStringLabel")}
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t("regex.testStringPlaceholder")}
          className="w-full h-32 p-3 border border-slate-300 rounded-md resize-y text-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none"
        />
      </div>

      {testString && pattern && !error && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("regex.highlightLabel")}
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
              {t("regex.matchResultLabel", { count: matches.length })}
            </label>
            {matches.length === 0 ? (
              <p className="text-sm text-slate-400">{t("regex.noMatch")}</p>
            ) : (
              <div className="code-area bg-[var(--dev-code-bg)] text-[var(--dev-code-text)] p-3 rounded-md max-h-60 overflow-y-auto border border-slate-600 text-sm space-y-1">
                {matches.map((m, i) => (
                  <div key={i}>
                    <span className="text-blue-400">#{i + 1}</span>{" "}
                    <span className="text-green-400">
                      &quot;{m.match}&quot;
                    </span>{" "}
                    <span className="text-slate-400">
                      ({t("regex.index", { index: m.index })})
                    </span>
                    {m.groups.length > 0 && (
                      <span className="text-yellow-400 ml-2">
                        {t("regex.groups")} [{m.groups.map((g) => `"${g}"`).join(", ")}]
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

// ─── Lorem Ipsum Generator ─────────────────────────────

function LoremTool() {
  const [options, setOptions] = useState<LoremOptions>({
    paragraphs: 3,
    wordsPerParagraph: 50,
    korean: false,
    htmlTags: false,
  });
  const [output, setOutput] = useState("");
  const { t } = useTranslation();

  const handleGenerate = () => {
    const result = generateLoremIpsum(options);
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">{t("lorem.title")}</h2>
      <p className="text-sm text-slate-500">
        {t("lorem.description")}
      </p>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">{t("lorem.paragraphs")}</label>
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
          <label className="text-sm text-slate-600">{t("lorem.wordsPerParagraph")}</label>
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
          {t("lorem.korean")}
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
          {t("lorem.htmlTags")}
        </label>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          {t("common.generate")}
        </button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">{t("common.result")}</label>
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


// ─── Main Page ────────────────────────────────────

export default function DevToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>("json");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

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
      {/* Header */}
      <header className="bg-[var(--dev-code-bg)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
              <Braces size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-[family-name:var(--font-space)]">
                {t("common.devTools")}
              </h1>
              <p className="text-xs text-slate-400">
                {t("common.headerSubtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* Mobile tab bar */}
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
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 bg-white border-r border-slate-200 p-3">
          <nav className="space-y-1 sticky top-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
              {t("common.toolList")}
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
                {t(tab.labelKey)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">{renderTool()}</main>
      </div>

      <DevToolsInfoSection />
      <RelatedTools currentToolId="dev" />

      {/* Footer */}
      <footer className="bg-[var(--dev-code-bg)] text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex gap-4 items-start">
              <a
                href="/privacy"
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                {t("common.privacy")}
              </a>
              <a
                href="/terms"
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                {t("common.terms")}
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {t("common.footerDesc")}
          </div>
        </div>
      </footer>
    </div>
  );
}
