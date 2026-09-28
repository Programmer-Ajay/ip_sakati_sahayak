"use client";

interface Props {
  language: "en" | "hi";
  onChange: (lang: "en" | "hi") => void;
}

const labels = {
  en: { en: "English", hi: "English" },
  hi: { en: "हिन्दी", hi: "हिन्दी" },
};

export default function LanguageToggle({ language, onChange }: Props) {
  return (
    <div className="lang-toggle" role="group" aria-label="Select language">
      {(["en", "hi"] as const).map((lang) => (
        <button
          key={lang}
          id={`lang-${lang}`}
          className={`lang-btn ${language === lang ? "lang-btn--active" : ""}`}
          onClick={() => onChange(lang)}
          aria-pressed={language === lang}
        >
          {labels[lang][lang]}
        </button>
      ))}
    </div>
  );
}
