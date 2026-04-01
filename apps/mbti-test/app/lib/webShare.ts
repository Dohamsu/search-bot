interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

interface ShareResult {
  success: boolean;
  method: "webshare" | "clipboard" | "none";
}

/**
 * navigator.share() wrapper with clipboard fallback
 */
export async function shareResult(options: ShareOptions): Promise<ShareResult> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return { success: true, method: "webshare" };
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        return { success: false, method: "none" };
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(options.url);
      return { success: true, method: "clipboard" };
    } catch {
      // clipboard API failed -> execCommand fallback
    }
  }

  if (typeof document !== "undefined") {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = options.url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return { success: true, method: "clipboard" };
    } catch {
      // all methods failed
    }
  }

  return { success: false, method: "none" };
}

/**
 * MBTI result share helper
 */
export async function shareMBTIResult(
  type: string,
  title: string
): Promise<ShareResult> {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/result/${type.toLowerCase()}`
      : "";

  return shareResult({
    title,
    text: title,
    url,
  });
}

/**
 * Compatibility result share helper
 */
export async function shareCompatibility(
  type1: string,
  type2: string,
  title: string
): Promise<ShareResult> {
  const sorted = [type1, type2].sort();
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/compatibility/${sorted[0].toLowerCase()}-${sorted[1].toLowerCase()}`
      : "";

  return shareResult({
    title,
    text: title,
    url,
  });
}
