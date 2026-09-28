"use client";

import type { SupersededBy } from "@/lib/types";
import { useState } from "react";

interface Props {
  validFrom?: string;
  supersededBy?: SupersededBy | null;
}

export default function TimeAwareBadge({ validFrom, supersededBy }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!validFrom && !supersededBy) return null;

  return (
    <div className="time-badge">
      {validFrom && (
        <span className="time-badge__valid-from">
          Valid from {validFrom}
        </span>
      )}
      {supersededBy && (
        <div className="time-badge__superseded-wrapper">
          <button
            className="time-badge__superseded-trigger"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label="Show superseded law details"
          >
            <span className="time-badge__superseded-icon">⚖</span>
            Supersedes earlier rule
            <span className="time-badge__chevron">{expanded ? "▲" : "▼"}</span>
          </button>
          {expanded && (
            <div className="time-badge__superseded-panel">
              <p className="time-badge__superseded-note">{supersededBy.supersededNote}</p>
              <p className="time-badge__superseded-ref">
                Replaced: <em>{supersededBy.actName}</em>, {supersededBy.sectionOrRule}
              </p>
              <p className="time-badge__superseded-date">
                Effective from: {supersededBy.effectiveDate}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
