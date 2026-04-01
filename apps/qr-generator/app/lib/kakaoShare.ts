declare global {
  interface Window {
    Kakao?: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: KakaoShareOptions) => void;
      };
    };
  }
}

interface KakaoShareButton {
  title: string;
  link: {
    webUrl: string;
    mobileWebUrl: string;
  };
}

interface KakaoShareOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      webUrl: string;
      mobileWebUrl: string;
    };
  };
  buttons: KakaoShareButton[];
}

const SITE_URL = "https://qr.onekit.co.kr";

/**
 * 카카오 SDK 초기화 (중복 초기화 방지)
 */
export function initKakao(appKey?: string): void {
  const key = appKey || process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
  if (!key) return;

  if (typeof window === 'undefined') return;
  if (!window.Kakao) return;
  if (window.Kakao.isInitialized()) return;

  window.Kakao.init(key);
}

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

interface ShareViaKakaoOptions {
  /** QR type name (e.g. "URL", "Wi-Fi", "Contact") */
  qrTypeName?: string;
  /** Summary of user input */
  inputSummary?: string;
  /** Translation function */
  t?: TranslateFn;
}

/**
 * Share QR Studio link via KakaoTalk
 * - QR images are data URLs so cannot be directly passed to Kakao API
 * - Shares site link + description text
 * - Falls back to navigator.share() or clipboard copy if Kakao SDK not loaded
 */
export async function shareViaKakao(
  options?: ShareViaKakaoOptions,
): Promise<{ success: boolean; method: 'kakao' | 'webshare' | 'clipboard' | 'none' }> {
  const t = options?.t;

  const title = options?.qrTypeName
    ? (t ? t('share.titleWithType', { type: options.qrTypeName }) : `QR Studio - ${options.qrTypeName} QR코드`)
    : (t ? t('share.titleDefault') : 'QR Studio - 무료 QR코드 생성기');

  const description = options?.inputSummary
    ? (t ? t('share.descWithInput', { input: options.inputSummary }) : `${options.inputSummary} QR코드를 만들어 보세요!`)
    : (t ? t('share.descDefault') : '색상 커스텀, 로고 삽입 가능한 무료 QR코드 생성기');

  const buttonLabel = t ? t('share.buttonLabel') : 'QR코드 만들기';

  const shareUrl = SITE_URL;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  // 1) Try sharing via Kakao SDK
  if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized()) {
    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl: ogImageUrl,
          link: {
            webUrl: shareUrl,
            mobileWebUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: buttonLabel,
            link: {
              webUrl: shareUrl,
              mobileWebUrl: shareUrl,
            },
          },
        ],
      });
      return { success: true, method: 'kakao' };
    } catch {
      // Fall through to fallback on Kakao share failure
    }
  }

  // 2) Web Share API fallback
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text: description,
        url: shareUrl,
      });
      return { success: true, method: 'webshare' };
    } catch {
      // Fall through to clipboard fallback on cancel or failure
    }
  }

  // 3) Clipboard copy fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return { success: true, method: 'clipboard' };
    } catch {
      return { success: false, method: 'none' };
    }
  }

  return { success: false, method: 'none' };
}
