export interface ZipFileItem {
  name: string;
  blob: Blob;
  extension: string;
}

export async function downloadAsZip(
  files: ZipFileItem[],
  onProgress?: (progress: number) => void
): Promise<void> {
  if (files.length === 0) {
    throw new Error("다운로드할 파일이 없습니다");
  }

  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  for (const file of files) {
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const fileName = `${baseName}_converted.${file.extension}`;
    zip.file(fileName, file.blob);
  }

  const zipBlob = await zip.generateAsync(
    { type: "blob" },
    (metadata) => {
      onProgress?.(Math.round(metadata.percent));
    }
  );

  const now = new Date();
  const dateStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `converted_files_${dateStr}.zip`;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
