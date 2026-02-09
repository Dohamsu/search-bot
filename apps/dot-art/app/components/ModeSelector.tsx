"use client";

import { Wand2, Grid3X3, Sparkles } from "lucide-react";

export type Mode = "auto" | "editor" | "pro";

interface ModeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const modes = [
  { id: "auto" as Mode, label: "자동 생성", icon: Wand2, desc: "텍스트 → 도트 아트" },
  { id: "editor" as Mode, label: "에디터", icon: Grid3X3, desc: "직접 그리기" },
  { id: "pro" as Mode, label: "Pro (AI)", icon: Sparkles, desc: "DALL-E 생성" },
];

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-2">
      {modes.map((m) => {
        const Icon = m.icon;
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`flex-1 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              active
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon size={18} />
            <div className="text-left">
              <div>{m.label}</div>
              <div className={`text-xs ${active ? "text-indigo-100" : "text-gray-400"}`}>
                {m.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
