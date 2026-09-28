"use client";

import { type Jurisdiction } from "@/lib/types";

interface Props {
  value: Jurisdiction;
  onChange: (j: Jurisdiction) => void;
}

export default function JurisdictionToggle({ value, onChange }: Props) {
  return (
    <div className="jurisdiction-toggle" role="group" aria-label="Select jurisdiction">
      <button
        id="jur-india"
        className={`jur-btn ${value === "india" ? "jur-btn--active" : ""}`}
        onClick={() => onChange("india")}
        aria-pressed={value === "india"}
      >
        <span className="jur-icon">🇮🇳</span>
        <span className="jur-label">India</span>
      </button>
      <div className="jur-divider" aria-hidden="true" />
      <button
        id="jur-international"
        className={`jur-btn ${value === "international" ? "jur-btn--active" : ""}`}
        onClick={() => onChange("international")}
        aria-pressed={value === "international"}
      >
        <span className="jur-icon">🌐</span>
        <span className="jur-label">International</span>
      </button>
    </div>
  );
}
