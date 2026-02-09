export interface ConvertOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
}

export async function convertImage(
  file: File,
  targetFormat: string,
  options?: ConvertOptions
): Promise<{ blob: Blob; url: string } | null> {
  const imageFormats = ["PNG", "JPG", "JPEG", "WEBP", "GIF"];
  const sourceExt = file.name.split(".").pop()?.toUpperCase() || "";

  if (!imageFormats.includes(sourceExt) && sourceExt !== "HEIC" && sourceExt !== "HEIF") {
    return null;
  }
  if (!imageFormats.includes(targetFormat.toUpperCase())) {
    return null;
  }

  let imgSrc: string;
  if (sourceExt === "HEIC" || sourceExt === "HEIF") {
    const heic2any = (await import("heic2any")).default;
    const convBlob = (await heic2any({ blob: file, toType: "image/png" })) as Blob;
    imgSrc = URL.createObjectURL(convBlob);
  } else {
    imgSrc = await readFileAsDataURL(file);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (options?.maxWidth || options?.maxHeight) {
        const ratio = img.width / img.height;
        if (options.maxWidth && options.maxHeight) {
          if (options.maintainAspectRatio !== false) {
            if (width > options.maxWidth) {
              width = options.maxWidth;
              height = width / ratio;
            }
            if (height > options.maxHeight) {
              height = options.maxHeight;
              width = height * ratio;
            }
          } else {
            width = options.maxWidth;
            height = options.maxHeight;
          }
        } else if (options.maxWidth) {
          width = options.maxWidth;
          height = options.maintainAspectRatio !== false ? width / ratio : height;
        } else if (options.maxHeight) {
          height = options.maxHeight;
          width = options.maintainAspectRatio !== false ? height * ratio : width;
        }
      }

      width = Math.round(width);
      height = Math.round(height);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      if (targetFormat.toUpperCase() === "JPG" || targetFormat.toUpperCase() === "JPEG") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const mimeMap: Record<string, string> = {
        PNG: "image/png",
        JPG: "image/jpeg",
        JPEG: "image/jpeg",
        WEBP: "image/webp",
        GIF: "image/gif",
      };
      const mime = mimeMap[targetFormat.toUpperCase()] || "image/png";
      const quality = options?.quality ?? 0.92;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({ blob, url });
          } else {
            reject(new Error("Conversion failed"));
          }
        },
        mime,
        mime === "image/png" ? undefined : quality
      );

      if (sourceExt === "HEIC" || sourceExt === "HEIF") {
        URL.revokeObjectURL(imgSrc);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imgSrc;
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function isImageConversion(from: string, to: string): boolean {
  const imageFormats = ["PNG", "JPG", "JPEG", "WEBP", "GIF"];
  const sourceFormats = [...imageFormats, "HEIC", "HEIF"];
  return sourceFormats.includes(from.toUpperCase()) && imageFormats.includes(to.toUpperCase());
}
