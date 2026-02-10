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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://qr.example.com';

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

interface ShareViaKakaoOptions {
  /** QR 유형 이름 (예: "URL", "Wi-Fi", "연락처") */
  qrTypeName?: string;
  /** 사용자가 입력한 값 요약 */
  inputSummary?: string;
}

/**
 * 카카오톡으로 QR Studio 링크 공유
 * - QR 이미지는 data URL이라 카카오 API에 직접 전달 불가
 * - 사이트 링크 + 설명 텍스트로 공유
 * - 카카오 SDK 미로드 시 fallback: navigator.share() 또는 클립보드 복사
 */
export async function shareViaKakao(
  options?: ShareViaKakaoOptions,
): Promise<{ success: boolean; method: 'kakao' | 'webshare' | 'clipboard' | 'none' }> {
  const title = options?.qrTypeName
    ? `QR Studio - ${options.qrTypeName} QR코드`
    : 'QR Studio - 무료 QR코드 생성기';

  const description = options?.inputSummary
    ? `${options.inputSummary} QR코드를 만들어 보세요!`
    : '색상 커스텀, 로고 삽입 가능한 무료 QR코드 생성기';

  const shareUrl = SITE_URL;
  const ogImageUrl = `${SITE_URL}/og-image.png`;

  // 1) 카카오 SDK를 통한 공유 시도
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
            title: 'QR코드 만들기',
            link: {
              webUrl: shareUrl,
              mobileWebUrl: shareUrl,
            },
          },
        ],
      });
      return { success: true, method: 'kakao' };
    } catch {
      // 카카오 공유 실패 시 fallback으로 진행
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
      // 사용자가 취소하거나 실패 시 클립보드 fallback
    }
  }

  // 3) 클립보드 복사 fallback
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
