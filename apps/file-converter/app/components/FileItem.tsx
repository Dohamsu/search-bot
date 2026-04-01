"use client";

import { Download, FileText, Loader2, CheckCircle2, Clock, X, RotateCcw, AlertCircle } from "lucide-react";
import { formatFileSize } from "../lib/fileUtils";
import type { FileItem as FileItemType } from "../lib/fileUtils";
import { useTranslation } from "../i18n";

interface FileItemProps {
  item: FileItemType;
  onDelete?: (id: string) => void;
  onRetry?: (id: string) => void;
}

const statusIcons = {
  done: CheckCircle2,
  converting: Loader2,
  pending: Clock,
  error: AlertCircle,
};

const statusStyles = {
  done: {
    bgClass: "bg-[#DCFCE7]",
    textClass: "text-[#16A34A]",
  },
  converting: {
    bgClass: "bg-[#FEF9C3]",
    textClass: "text-[#CA8A04]",
  },
  pending: {
    bgClass: "bg-[#F5F5F4]",
    textClass: "text-[#78716C]",
  },
  error: {
    bgClass: "bg-[#FEE2E2]",
    textClass: "text-[#DC2626]",
  },
};

export default function FileItemRow({ item, onDelete, onRetry }: FileItemProps) {
  const { t } = useTranslation();

  const statusLabels: Record<string, string> = {
    done: t("fileItem.done"),
    converting: t("fileItem.converting"),
    pending: t("fileItem.pending"),
    error: t("fileItem.error"),
  };

  const style = statusStyles[item.status];
  const StatusIcon = statusIcons[item.status];
  const label = statusLabels[item.status];

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
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${style.bgClass} ${style.textClass}`}
      >
        <StatusIcon
          size={12}
          className={item.status === "converting" ? "animate-spin" : ""}
        />
        {label}
      </span>

      {/* Retry button for error state */}
      {item.status === "error" && onRetry && (
        <button
          onClick={() => onRetry(item.id)}
          className="shrink-0 text-[#A8A29E] transition-colors hover:text-[var(--file-accent)]"
          title={t("fileItem.retry")}
        >
          <RotateCcw size={16} />
        </button>
      )}

      {/* Download button for done state */}
      {item.status === "done" && (
        <button
          onClick={handleDownload}
          className="shrink-0 text-[#A8A29E] transition-colors hover:text-[var(--file-primary)]"
          title={t("fileItem.download")}
        >
          <Download size={18} />
        </button>
      )}

      {/* Delete button - always visible except during conversion */}
      {item.status !== "converting" && onDelete && (
        <button
          onClick={() => onDelete(item.id)}
          className="shrink-0 text-[#D6D3D1] transition-colors hover:text-[#DC2626]"
          title={t("fileItem.delete")}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
