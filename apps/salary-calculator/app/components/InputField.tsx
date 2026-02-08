"use client";

interface InputFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  suffix?: string;
}

export default function InputField({
  label,
  value,
  placeholder,
  onChange,
  suffix,
}: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "").replace(/[^0-9]/g, "");
    if (raw === "") {
      onChange("");
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      onChange(num.toLocaleString("ko-KR"));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--salary-text)]">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          className="h-11 w-full rounded-lg border border-[var(--salary-border)] bg-white px-3 text-sm text-[var(--salary-text)] outline-none transition-colors placeholder:text-slate-300 focus:border-[var(--salary-primary)] focus:ring-1 focus:ring-[var(--salary-primary)]"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
