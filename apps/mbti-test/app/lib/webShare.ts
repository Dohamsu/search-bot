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
 * navigator.share() 래핑, 클립보드 fallback
 */
export async function shareResult(options: ShareOptions): Promise<ShareResult> {
  // 1. Web Share API 지원 시 시도
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return { success: true, method: "webshare" };
    } catch (e) {
      // 사용자가 공유를 취소한 경우
      if (e instanceof Error && e.name === "AbortError") {
        return { success: false, method: "none" };
      }
      // 다른 에러 → 클립보드 fallback
    }
  }

  // 2. 클립보드 API fallback
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(options.url);
      return { success: true, method: "clipboard" };
    } catch {
      // 클립보드 API 실패 → execCommand fallback
    }
  }

  // 3. execCommand fallback
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
      // 모든 방법 실패
    }
  }

  return { success: false, method: "none" };
}

/**
 * MBTI 결과 공유용 헬퍼
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
    title: `나의 MBTI는 ${type}! - ${title}`,
    text: `${type} 유형의 성격을 확인해보세요!`,
    url,
  });
}

/**
 * 궁합 결과 공유용 헬퍼
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
    title: `${type1} x ${type2} MBTI 궁합 결과`,
    text: `우리의 궁합을 확인해보세요! ${title}`,
    url,
  });
}
