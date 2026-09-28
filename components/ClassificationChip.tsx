"use client";

import type { FormulationCategory } from "@/lib/types";

interface Props {
  category: FormulationCategory;
  onEdit: () => void;
  language: "en" | "hi";
}

const categoryLabels: Record<FormulationCategory, { en: string; hi: string }> = {
  classical: { en: "Classical / Generic", hi: "शास्त्रीय / जेनेरिक" },
  proprietary: { en: "Proprietary Medicine", hi: "स्वामित्व औषधि" },
  new: { en: "New / Non-classical Drug", hi: "नई / गैर-शास्त्रीय दवा" },
  phytopharmaceutical: { en: "Phytopharmaceutical", hi: "फाइटोफार्मास्युटिकल" },
  nutraceutical: { en: "Ayurveda-Aahar / Nutraceutical", hi: "आयुर्वेद-आहार / न्यूट्रास्युटिकल" },
  cosmetic: { en: "Cosmetic", hi: "सौंदर्य प्रसाधन" },
};

export default function ClassificationChip({ category, onEdit, language }: Props) {
  return (
    <div className="classification-chip">
      <span className="classification-chip__label">
        {language === "hi" ? "वर्गीकृत:" : "Detected:"}
      </span>
      <span className="classification-chip__value">
        {categoryLabels[category][language]}
      </span>
      <button
        className="classification-chip__edit"
        onClick={onEdit}
        aria-label="Change classification"
      >
        {language === "hi" ? "बदलें" : "change"}
      </button>
    </div>
  );
}
