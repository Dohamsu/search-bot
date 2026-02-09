"use client";

import { ArrowRightLeft, Image, ImagePlus } from "lucide-react";

interface PopularCardProps {
  from: string;
  to: string;
  variant: "red" | "blue" | "green";
  onClick?: (from: string, to: string) => void;
}

const variantConfig = {
  red: {
    icon: ArrowRightLeft,
    bgClass: "bg-[#FEF2F2]",
  },
  blue: {
    icon: Image,
    bgClass: "bg-[#EFF6FF]",
  },
  green: {
    icon: ImagePlus,
    bgClass: "bg-[#F0FDF4]",
  },
};

export default function PopularCard({
  from,
  to,
  variant,
  onClick,
}: PopularCardProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <button
      onClick={() => onClick?.(from, to)}
      className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#E7E5E4] bg-white p-4 transition-shadow hover:shadow-md text-left"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.bgClass}`}
      >
        <Icon size={20} className="text-[var(--file-text)]" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[var(--file-text)]">
          {from} &rarr; {to}
        </span>
        <span className="text-xs text-[#A8A29E]">인기 변환</span>
      </div>
    </button>
  );
}
