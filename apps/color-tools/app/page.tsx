"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Pipette,
  Palette,
  Eye,
  Blend,
  ImageIcon,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  getContrastRatio,
  generateAnalogous,
  generateComplementary,
  generateTriadic,
  generateSplitComplementary,
  generateMonochromatic,
  generateRandomHex,
  extractColorsFromImageData,
} from "./lib/colorUtils";

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
type TabId = "picker" | "palette" | "contrast" | "gradient" | "extract";

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

type HarmonyRule =
  | "analogous"
  | "complementary"
  | "triadic"
  | "split"
  | "monochromatic";

type GradientDirection =
  | "to right"
  | "to bottom"
  | "to bottom right"
  | "circle";

// -------------------------------------------------------------------
// Clipboard helper
// -------------------------------------------------------------------
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(null), 1500);
    });
  }, []);

  return { copied, copy };
}

// -------------------------------------------------------------------
// Small reusable UI bits
// -------------------------------------------------------------------
function CopyBtn({
  text,
  copied,
  onCopy,
  className,
}: {
  text: string;
  copied: string | null;
  onCopy: (t: string) => void;
  className?: string;
}) {
  const isCopied = copied === text;
  return (
    <button
      type="button"
      onClick={() => onCopy(text)}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
        isCopied
          ? "bg-emerald-100 text-emerald-700"
          : "bg-white/70 text-gray-600 hover:bg-white hover:text-gray-900"
      } ${className ?? ""}`}
      title="복사"
    >
      {isCopied ? <Check size={12} /> : <Copy size={12} />}
      {isCopied ? "복사됨" : text}
    </button>
  );
}

function ColorSwatch({
  hex,
  size = "md",
  copied,
  onCopy,
}: {
  hex: string;
  size?: "sm" | "md" | "lg";
  copied: string | null;
  onCopy: (t: string) => void;
}) {
  const dim =
    size === "sm" ? "w-10 h-10" : size === "lg" ? "w-20 h-20" : "w-14 h-14";
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${dim} rounded-lg border border-gray-200 shadow-sm`}
        style={{ backgroundColor: hex }}
      />
      <CopyBtn text={hex} copied={copied} onCopy={onCopy} />
    </div>
  );
}

// -------------------------------------------------------------------
// Tab 1: Color Picker & Conversion
// -------------------------------------------------------------------
function PickerTab() {
  const { copied, copy } = useCopy();
  const [hex, setHex] = useState("#A855F7");
  const [r, setR] = useState(168);
  const [g, setG] = useState(85);
  const [b, setB] = useState(247);
  const [h, setH] = useState(263);
  const [s, setS] = useState(90);
  const [l, setL] = useState(65);

  const syncFromHex = useCallback((newHex: string) => {
    const rgb = hexToRgb(newHex);
    if (!rgb) return;
    setR(rgb.r);
    setG(rgb.g);
    setB(rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setH(hsl.h);
    setS(hsl.s);
    setL(hsl.l);
  }, []);

  const syncFromRgb = useCallback(
    (nr: number, ng: number, nb: number) => {
      const newHex = rgbToHex(nr, ng, nb);
      setHex(newHex);
      const hsl = rgbToHsl(nr, ng, nb);
      setH(hsl.h);
      setS(hsl.s);
      setL(hsl.l);
    },
    []
  );

  const syncFromHsl = useCallback(
    (nh: number, ns: number, nl: number) => {
      const rgb = hslToRgb(nh, ns, nl);
      setR(rgb.r);
      setG(rgb.g);
      setB(rgb.b);
      setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
    },
    []
  );

  const handleHexInput = (val: string) => {
    let v = val;
    if (!v.startsWith("#")) v = "#" + v;
    setHex(v.toUpperCase());
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
      syncFromHex(v);
    }
  };

  const handleNative = (val: string) => {
    setHex(val.toUpperCase());
    syncFromHex(val);
  };

  const handleR = (v: number) => {
    setR(v);
    syncFromRgb(v, g, b);
  };
  const handleG = (v: number) => {
    setG(v);
    syncFromRgb(r, v, b);
  };
  const handleB = (v: number) => {
    setB(v);
    syncFromRgb(r, g, v);
  };

  const handleH = (v: number) => {
    setH(v);
    syncFromHsl(v, s, l);
  };
  const handleS = (v: number) => {
    setS(v);
    syncFromHsl(h, v, l);
  };
  const handleL = (v: number) => {
    setL(v);
    syncFromHsl(h, s, v);
  };

  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const hslStr = `hsl(${h}, ${s}%, ${l}%)`;

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div
          className="w-36 h-36 rounded-2xl border-2 border-[var(--color-border)] shadow-lg"
          style={{ backgroundColor: hex }}
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-500">
            네이티브 피커
          </label>
          <input
            type="color"
            value={hex.length === 7 ? hex : "#A855F7"}
            onChange={(e) => handleNative(e.target.value)}
            className="w-16 h-10 rounded-lg cursor-pointer border border-[var(--color-border)]"
          />
        </div>
      </div>

      {/* HEX */}
      <fieldset className="rounded-xl border border-[var(--color-border)] p-4 bg-white/60">
        <legend className="px-2 text-sm font-semibold text-[var(--color-primary)]">
          HEX
        </legend>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHexInput(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            maxLength={7}
          />
          <CopyBtn text={hex} copied={copied} onCopy={copy} />
        </div>
      </fieldset>

      {/* RGB */}
      <fieldset className="rounded-xl border border-[var(--color-border)] p-4 bg-white/60">
        <legend className="px-2 text-sm font-semibold text-[var(--color-primary)]">
          RGB
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "R", value: r, set: handleR, max: 255 },
            { label: "G", value: g, set: handleG, max: 255 },
            { label: "B", value: b, set: handleB, max: 255 },
          ].map((ch) => (
            <div key={ch.label} className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">{ch.label}</label>
              <input
                type="number"
                min={0}
                max={ch.max}
                value={ch.value}
                onChange={(e) =>
                  ch.set(
                    Math.max(0, Math.min(ch.max, Number(e.target.value) || 0))
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          ))}
        </div>
        <div className="mt-2">
          <CopyBtn text={rgbStr} copied={copied} onCopy={copy} />
        </div>
      </fieldset>

      {/* HSL */}
      <fieldset className="rounded-xl border border-[var(--color-border)] p-4 bg-white/60">
        <legend className="px-2 text-sm font-semibold text-[var(--color-primary)]">
          HSL
        </legend>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "H", value: h, set: handleH, max: 360 },
            { label: "S", value: s, set: handleS, max: 100 },
            { label: "L", value: l, set: handleL, max: 100 },
          ].map((ch) => (
            <div key={ch.label} className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">
                {ch.label}
                {ch.label === "H" ? " (0-360)" : " (0-100)"}
              </label>
              <input
                type="number"
                min={0}
                max={ch.max}
                value={ch.value}
                onChange={(e) =>
                  ch.set(
                    Math.max(0, Math.min(ch.max, Number(e.target.value) || 0))
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          ))}
        </div>
        <div className="mt-2">
          <CopyBtn text={hslStr} copied={copied} onCopy={copy} />
        </div>
      </fieldset>
    </div>
  );
}

// -------------------------------------------------------------------
// Tab 2: Palette Generator
// -------------------------------------------------------------------
function PaletteTab() {
  const { copied, copy } = useCopy();
  const [baseColor, setBaseColor] = useState("#A855F7");
  const [rule, setRule] = useState<HarmonyRule>("analogous");

  const generate = useCallback(
    (hex: string, r: HarmonyRule) => {
      switch (r) {
        case "analogous":
          return generateAnalogous(hex);
        case "complementary":
          return generateComplementary(hex);
        case "triadic":
          return generateTriadic(hex);
        case "split":
          return generateSplitComplementary(hex);
        case "monochromatic":
          return generateMonochromatic(hex);
      }
    },
    []
  );

  const palette = generate(baseColor, rule);

  const rules: { id: HarmonyRule; label: string }[] = [
    { id: "analogous", label: "유사색" },
    { id: "complementary", label: "보색" },
    { id: "triadic", label: "삼색" },
    { id: "split", label: "분할보색" },
    { id: "monochromatic", label: "단색조" },
  ];

  const randomize = () => {
    setBaseColor(generateRandomHex());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">기준 색상</label>
          <input
            type="color"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value.toUpperCase())}
            className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--color-border)]"
          />
          <span className="font-mono text-sm">{baseColor}</span>
        </div>
        <button
          type="button"
          onClick={randomize}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={14} />
          랜덤
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {rules.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRule(r.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              rule === r.id
                ? "bg-[var(--color-primary)] text-white shadow"
                : "bg-white border border-[var(--color-border)] text-gray-700 hover:bg-purple-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {palette.map((c, i) => (
          <ColorSwatch
            key={`${c}-${i}`}
            hex={c}
            size="lg"
            copied={copied}
            onCopy={copy}
          />
        ))}
      </div>

      {/* All-at-once copy */}
      <div className="text-center">
        <CopyBtn
          text={palette.join(", ")}
          copied={copied}
          onCopy={copy}
          className="!text-sm !px-4 !py-2"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Tab 3: Contrast Checker (WCAG)
// -------------------------------------------------------------------
function ContrastTab() {
  const { copied, copy } = useCopy();
  const [fg, setFg] = useState("#0F172A");
  const [bg, setBg] = useState("#FFFFFF");

  const ratio = getContrastRatio(fg, bg);
  const ratioStr = ratio.toFixed(2);

  const passAA = ratio >= 4.5;
  const passAAA = ratio >= 7;
  const passLargeAA = ratio >= 3;

  const badge = (pass: boolean) =>
    pass ? (
      <span className="inline-block rounded px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700">
        PASS
      </span>
    ) : (
      <span className="inline-block rounded px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600">
        FAIL
      </span>
    );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">전경색 (텍스트)</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value.toUpperCase())}
              className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--color-border)]"
            />
            <input
              type="text"
              value={fg}
              onChange={(e) => {
                const v = e.target.value.toUpperCase();
                setFg(v);
              }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              maxLength={7}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">배경색</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value.toUpperCase())}
              className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--color-border)]"
            />
            <input
              type="text"
              value={bg}
              onChange={(e) => {
                const v = e.target.value.toUpperCase();
                setBg(v);
              }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="rounded-xl p-6 border border-[var(--color-border)] shadow-sm"
        style={{ backgroundColor: bg }}
      >
        <p style={{ color: fg }} className="text-2xl font-bold mb-1">
          큰 텍스트 미리보기 (24px)
        </p>
        <p style={{ color: fg }} className="text-base">
          일반 텍스트 미리보기 (16px) - 가나다라마바사 ABCDEFG 0123456789
        </p>
      </div>

      {/* Ratio */}
      <div className="rounded-xl bg-white/80 border border-[var(--color-border)] p-6 text-center space-y-4">
        <p className="text-sm text-gray-500">대비율</p>
        <p className="text-5xl font-bold font-[family-name:var(--font-space)]">
          {ratioStr}:1
        </p>
        <CopyBtn
          text={`대비율 ${ratioStr}:1`}
          copied={copied}
          onCopy={copy}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500 mb-1">
              AA 일반 텍스트 (4.5:1)
            </p>
            {badge(passAA)}
          </div>
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500 mb-1">
              AAA 일반 텍스트 (7:1)
            </p>
            {badge(passAAA)}
          </div>
          <div className="rounded-lg border border-gray-200 p-3">
            <p className="text-xs text-gray-500 mb-1">
              AA 큰 텍스트 (3:1)
            </p>
            {badge(passLargeAA)}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Tab 4: Gradient Generator
// -------------------------------------------------------------------
interface GradientStop {
  id: number;
  color: string;
}

function GradientTab() {
  const { copied, copy } = useCopy();
  const [stops, setStops] = useState<GradientStop[]>([
    { id: 1, color: "#A855F7" },
    { id: 2, color: "#EC4899" },
  ]);
  const [direction, setDirection] = useState<GradientDirection>("to right");
  const nextId = useRef(3);

  const directions: { id: GradientDirection; label: string }[] = [
    { id: "to right", label: "수평 →" },
    { id: "to bottom", label: "수직 ↓" },
    { id: "to bottom right", label: "대각선 ↘" },
    { id: "circle", label: "원형" },
  ];

  const addStop = () => {
    if (stops.length >= 5) return;
    setStops((prev) => [
      ...prev,
      { id: nextId.current++, color: generateRandomHex() },
    ]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStop = (id: number, color: string) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, color: color.toUpperCase() } : s))
    );
  };

  const colors = stops.map((s) => s.color).join(", ");
  const cssValue =
    direction === "circle"
      ? `radial-gradient(circle, ${colors})`
      : `linear-gradient(${direction}, ${colors})`;
  const cssProp = `background: ${cssValue};`;

  return (
    <div className="space-y-6">
      {/* Direction */}
      <div className="flex flex-wrap gap-2">
        {directions.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDirection(d.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              direction === d.id
                ? "bg-[var(--color-primary)] text-white shadow"
                : "bg-white border border-[var(--color-border)] text-gray-700 hover:bg-purple-50"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Color stops */}
      <div className="space-y-3">
        {stops.map((stop, idx) => (
          <div key={stop.id} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-5">{idx + 1}</span>
            <input
              type="color"
              value={stop.color.length === 7 ? stop.color : "#000000"}
              onChange={(e) => updateStop(stop.id, e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--color-border)]"
            />
            <input
              type="text"
              value={stop.color}
              onChange={(e) => updateStop(stop.id, e.target.value)}
              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              maxLength={7}
            />
            {stops.length > 2 && (
              <button
                type="button"
                onClick={() => removeStop(stop.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="삭제"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        {stops.length < 5 && (
          <button
            type="button"
            onClick={addStop}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-[var(--color-border)] px-4 py-2 text-sm text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Plus size={14} />
            중간색 추가
          </button>
        )}
      </div>

      {/* Preview */}
      <div
        className="w-full h-40 rounded-2xl border border-[var(--color-border)] shadow-sm"
        style={{ background: cssValue }}
      />

      {/* CSS output */}
      <div className="rounded-xl bg-gray-900 text-gray-100 p-4 font-mono text-sm relative">
        <pre className="whitespace-pre-wrap break-all">{cssProp}</pre>
        <div className="absolute top-2 right-2">
          <CopyBtn text={cssProp} copied={copied} onCopy={copy} />
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Tab 5: Image Color Extraction
// -------------------------------------------------------------------
function ExtractTab() {
  const { copied, copy } = useCopy();
  const [palette, setPalette] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setPreview(src);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 200;
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractColorsFromImageData(data, 8);
        setPalette(colors);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`w-full min-h-[200px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
          isDragging
            ? "border-[var(--color-primary)] bg-purple-50"
            : "border-[var(--color-border)] bg-white/40 hover:bg-white/60"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="업로드된 이미지"
            className="max-h-60 rounded-lg object-contain"
          />
        ) : (
          <>
            <ImageIcon size={40} className="text-gray-300" />
            <p className="text-sm text-gray-500">
              이미지를 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
          </>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Extracted palette */}
      {palette.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-600">
            추출된 색상 ({palette.length}개)
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {palette.map((c, i) => (
              <ColorSwatch
                key={`${c}-${i}`}
                hex={c}
                size="lg"
                copied={copied}
                onCopy={copy}
              />
            ))}
          </div>
          <div className="text-center">
            <CopyBtn
              text={palette.join(", ")}
              copied={copied}
              onCopy={copy}
              className="!text-sm !px-4 !py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// Cross Links & Footer
// -------------------------------------------------------------------
function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--color-border)] pt-8 pb-10 text-center text-xs text-gray-400 space-y-4">
      <div className="flex justify-center gap-4">
        <a href="/privacy" className="hover:underline">
          개인정보처리방침
        </a>
        <a href="/terms" className="hover:underline">
          이용약관
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} 색상 도구. All rights reserved.</p>
    </footer>
  );
}

// -------------------------------------------------------------------
// Main Page
// -------------------------------------------------------------------
export default function ColorToolsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("picker");

  const tabs: TabDef[] = [
    { id: "picker", label: "컬러 피커", icon: <Pipette size={18} /> },
    { id: "palette", label: "팔레트", icon: <Palette size={18} /> },
    { id: "contrast", label: "대비율", icon: <Eye size={18} /> },
    { id: "gradient", label: "그라디언트", icon: <Blend size={18} /> },
    { id: "extract", label: "색상 추출", icon: <ImageIcon size={18} /> },
  ];

  // Prevent hydration issues
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-inter)]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-space)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            색상 도구
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            컬러 피커 &middot; 팔레트 생성 &middot; 대비율 검사 &middot;
            그라디언트 &middot; 색상 추출
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {/* Tabs */}
        <nav className="flex overflow-x-auto gap-1 mb-6 pb-1 -mx-1 px-1 scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTab === t.id
                  ? "bg-[var(--color-primary)] text-white shadow-md shadow-purple-200"
                  : "text-gray-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="rounded-2xl bg-white/50 border border-[var(--color-border)] p-4 sm:p-6 shadow-sm">
          {activeTab === "picker" && <PickerTab />}
          {activeTab === "palette" && <PaletteTab />}
          {activeTab === "contrast" && <ContrastTab />}
          {activeTab === "gradient" && <GradientTab />}
          {activeTab === "extract" && <ExtractTab />}
        </div>

        <Footer />
      </main>
    </div>
  );
}
