export default function NavBar() {
  return (
    <nav className="hidden md:flex h-16 items-center justify-between border-b border-[#E7E5E4] bg-white px-8">
      <div className="flex items-center gap-8">
        <span className="text-[22px] font-bold text-[var(--file-primary)]">
          FileFlow
        </span>
        <span className="text-sm font-medium text-[var(--file-primary)]">
          이미지 변환기
        </span>
      </div>
      <div />
    </nav>
  );
}
