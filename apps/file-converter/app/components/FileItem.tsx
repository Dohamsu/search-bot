"use client";

import { Download, FileText, Loader2, CheckCircle2, Clock, X, RotateCcw, AlertCircle } from "lucide-react";
import { formatFileSize } from "../lib/fileUtils";
import type { FileItem as FileItemType } from "../lib/fileUtils";

interface FileItemProps {
  item: FileItemType;
  onDelete?: (id: string) => void;
  onRetry?: (id: string) => void;
}

const statusConfig = {
  done: {
    label: "완료",
    bgClass: "bg-[#DCFCE7]",
    textClass: "text-[#16A34A]",
    icon: CheckCircle2,
  },
  converting: {
    label: "변환중",
    bgClass: "bg-[#FEF9C3]",
    textClass: "text-[#CA8A04]",
    icon: Loader2,
  },
  pending: {
    label: "대기",
    bgClass: "bg-[#F5F5F4]",
    textClass: "text-[#78716C]",
    icon: Clock,
  },
  error: {
    label: "오류",
    bgClass: "bg-[#FEE2E2]",
    textClass: "text-[#DC2626]",
    icon: AlertCircle,
  },
};

export default function FileItemRow({ item, onDelete, onRetry }: FileItemProps) {
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;

  const handleDownload = () => {
    if (item.outputUrl) {
      const a = document.createElement("a");
      a.href = item.outputUrl;
      const ext = item.convertedExt ? `.${item.convertedExt}` : "";
      a.download = item.name.replace(/\.[^.]+$/, "") + "_converted" + ext;
      a.click();
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#E7E5E4] bg-white px-4 py-3">
      <FileText className="shrink-0 text-[#A8A29E]" size={20} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-[var(--file-text)]">
          {item.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#A8A29E]">
            {formatFileSize(item.size)}
          </span>
          {item.errorMessage && (
            <span className="text-xs text-[#DC2626]">{item.errorMessage}</span>
          )}
        </div>
      </div>
      {item.status === "converting" && (
        <div className="hidden sm:flex w-24 items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-[#E7E5E4]">
            <div
              className="h-1.5 rounded-full bg-[var(--file-primary)] transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <span className="text-xs text-[#78716C]">{item.progress}%</span>
        </div>
      )}
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${status.bgClass} ${status.textClass}`}
      >
        <StatusIcon
          size={12}
          className={item.status === "converting" ? "animate-spin" : ""}
        />
        {status.label}
      </span>

      {/* Retry button for error state */}
      {item.status === "error" && onRetry && (
        <button
          onClick={() => onRetry(item.id)}
          className="shrink-0 text-[#A8A29E] transition-colors hover:text-[var(--file-accent)]"
          title="재시도"
        >
          <RotateCcw size={16} />
        </button>
      )}

      {/* Download button for done state */}
      {item.status === "done" && (
        <button
          onClick={handleDownload}
          className="shrink-0 text-[#A8A29E] transition-colors hover:text-[var(--file-primary)]"
          title="다운로드"
        >
          <Download size={18} />
        </button>
      )}

      {/* Delete button - always visible except during conversion */}
      {item.status !== "converting" && onDelete && (
        <button
          onClick={() => onDelete(item.id)}
          className="shrink-0 text-[#D6D3D1] transition-colors hover:text-[#DC2626]"
          title="삭제"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
