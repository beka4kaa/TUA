"use client";

import { useLanguage, Language } from "@/contexts/language-context";

interface LanguageSwitcherProps {
  /** Compact mode: shows "EN / RU" inline */
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const langs: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
  ];

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-[#EDEDED] dark:border-[#333] p-0.5 bg-transparent ${
        compact ? "text-xs" : "text-xs"
      }`}
      aria-label="Language switcher"
    >
      {langs.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
          className={`px-2.5 py-1 rounded-full font-medium transition-all duration-200 ${
            language === code
              ? "bg-[#111111] dark:bg-white text-white dark:text-[#111111]"
              : "text-[#6B6B6B] dark:text-[#888] hover:text-[#111111] dark:hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
