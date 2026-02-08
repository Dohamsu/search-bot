"use client";

import type { FileItem as FileItemType } from "../lib/fileUtils";
import FileItemRow from "./FileItem";

interface FileListProps {
  files: FileItemType[];
  onDelete?: (id: string) => void;
  onRetry?: (id: string) => void;
}

export default function FileList({ files, onDelete, onRetry }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--file-text)]">
          파일 목록
        </h3>
        <span className="text-xs text-[#A8A29E]">{files.length}개 파일</span>
      </div>
      <div className="flex flex-col gap-2">
        {files.map((file) => (
          <FileItemRow
            key={file.id}
            item={file}
            onDelete={onDelete}
            onRetry={onRetry}
          />
        ))}
      </div>
    </div>
  );
}
