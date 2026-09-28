"use client";

import { useState } from "react";
import { getPathwayOptions } from "@/lib/pathway-engine";
import type { FormulationCategory } from "@/lib/types";

interface Props {
  classification: FormulationCategory | null;
}

export default function PathwayEngineWidget({ classification }: Props) {
  const options = getPathwayOptions(classification);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="widget-card pathway-engine">
      <div className="widget-card__header">
        <span className="widget-badge">Differentiator</span>
        <h3 className="widget-card__title">Patentability Pathway Recommendation</h3>
        <p className="widget-card__subtitle">
          Based on your formulation category
          {classification ? ` (${classification})` : ""}, here are the recommended IP protection routes:
        </p>
      </div>

      <div className="pathway-options">
        {options.map((opt) => (
          <div
            key={opt.key}
            className={`pathway-option ${opt.recommended ? "pathway-option--recommended" : ""}`}
          >
            <button
              id={`pathway-${opt.key}`}
              className="pathway-option__header"
              onClick={() => setExpanded(expanded === opt.key ? null : opt.key)}
              aria-expanded={expanded === opt.key}
            >
              <div className="pathway-option__title-row">
                {opt.recommended && (
                  <span className="pathway-option__rec-badge">Recommended</span>
                )}
                <span className="pathway-option__label">{opt.label}</span>
              </div>
              <span className="pathway-option__chevron">
                {expanded === opt.key ? "▲" : "▼"}
              </span>
            </button>

            {expanded === opt.key && (
              <div className="pathway-option__body">
                <p className="pathway-option__when">
                  <strong>When applicable:</strong> {opt.whenRecommended}
                </p>
                <div className="pathway-option__evidence">
                  <strong>Evidence needed:</strong>
                  <ul className="pathway-evidence-list">
                    {opt.evidenceNeeded.map((ev, i) => (
                      <li key={i} className="pathway-evidence-item">
                        <span className="pathway-evidence-check">☐</span>
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="cited-answer-card__disclaimer" role="note">
        <span className="disclaimer-icon">ⓘ</span>
        <span className="disclaimer-text">
          This provides information, not legal advice. Pathway recommendations are based on the general profile of the formulation category; specific claim drafting requires a qualified patent attorney.
        </span>
      </div>
    </div>
  );
}
