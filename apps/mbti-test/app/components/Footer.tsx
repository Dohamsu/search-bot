export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white/50 py-4">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
          <a
            href="/privacy"
            className="hover:text-[var(--mbti-primary)] underline transition-colors"
          >
            개인정보처리방침
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="/terms"
            className="hover:text-[var(--mbti-primary)] underline transition-colors"
          >
            이용약관
          </a>
          <span className="hidden sm:inline">|</span>
          <a
            href="mailto:rlawlsdnjswk@gmail.com"
            className="hover:text-[var(--mbti-primary)] underline transition-colors"
          >
            문의: rlawlsdnjswk@gmail.com
          </a>
          <span className="hidden sm:inline">|</span>
          <span className="text-gray-400">© 2025 All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
