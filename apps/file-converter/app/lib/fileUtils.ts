export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), units.length - 1);
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${size} ${units[i]}`;
}

export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() || "";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "pending" | "converting" | "done" | "error";
  progress: number;
  outputUrl?: string;
  convertedExt?: string;
  errorMessage?: string;
  file: File;
}

export const SUPPORTED_FORMATS = ["PDF", "DOCX", "PNG", "JPG", "HEIC", "WEBP", "GIF"];

export const FORMAT_OPTIONS = {
  from: ["PNG", "JPG", "HEIC", "WEBP", "GIF", "PDF", "DOCX"],
  to: ["PNG", "JPG", "WEBP", "GIF", "PDF", "DOCX"],
};
