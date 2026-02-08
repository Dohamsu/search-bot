export async function convertImage(
  file: File,
  targetFormat: string
): Promise<{ blob: Blob; url: string } | null> {
  const imageFormats = ["PNG", "JPG", "JPEG", "WEBP"];
  const sourceExt = file.name.split(".").pop()?.toUpperCase() || "";

  if (!imageFormats.includes(sourceExt) || !imageFormats.includes(targetFormat.toUpperCase())) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }

        if (targetFormat.toUpperCase() === "JPG" || targetFormat.toUpperCase() === "JPEG") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const mimeMap: Record<string, string> = {
          PNG: "image/png",
          JPG: "image/jpeg",
          JPEG: "image/jpeg",
          WEBP: "image/webp",
        };

        const mime = mimeMap[targetFormat.toUpperCase()] || "image/png";

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
          0.92
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function isImageConversion(from: string, to: string): boolean {
  const imageFormats = ["PNG", "JPG", "JPEG", "WEBP"];
  return imageFormats.includes(from.toUpperCase()) && imageFormats.includes(to.toUpperCase());
}
