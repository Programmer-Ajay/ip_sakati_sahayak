"use client";

import type { CitedAnswer } from "@/lib/types";
import ConfidenceBadge from "./ConfidenceBadge";
import TimeAwareBadge from "./TimeAwareBadge";

interface Props {
  data: CitedAnswer;
  onEscalate: () => void;
  onOpenABSCalculator: () => void;
  onOpenPathwayEngine: () => void;
}

export default function CitedAnswerCard({
  data,
  onEscalate,
  onOpenABSCalculator,
  onOpenPathwayEngine,
}: Props) {
  const jurisdictionLabel =
    data.jurisdiction === "india" ? "India" : "International";

  return (
    <div className="cited-answer-card">
      <div className="cited-answer-card__header">
        <div className="cited-answer-card__meta">
          <span className="cited-answer-card__jurisdiction-tag">
            {data.jurisdiction === "india" ? "🇮🇳" : "🌐"} {jurisdictionLabel}
          </span>
          {data.classification && (
            <span className="cited-answer-card__category-tag">
              {data.classification}
            </span>
          )}
        </div>
        <ConfidenceBadge level={data.confidence} />
      </div>

      <div className="cited-answer-card__body">
        <p className="cited-answer-card__answer-text">{data.answerText}</p>
      </div>

      {data.citations.length > 0 && (
        <div className="cited-answer-card__citations">
          <h3 className="cited-answer-card__citations-heading">Sources</h3>
          <ol className="citations-list">
            {data.citations.map((cit, i) => (
              <li key={i} className="citation-item">
                <div className="citation-item__ref">
                  <span className="citation-item__number">[{i + 1}]</span>
                  <div className="citation-item__text">
                    <span className="citation-item__act">{cit.actName}</span>
                    <span className="citation-item__section">{cit.sectionOrRule}</span>
                  </div>
                </div>
                <TimeAwareBadge
                  validFrom={cit.validFrom}
                  supersededBy={cit.supersededBy}
                />
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="cited-answer-card__actions">
        <button
          id="open-pathway-engine"
          className="btn-secondary"
          onClick={onOpenPathwayEngine}
          title="View recommended IP protection pathways"
        >
          IP Pathway Analysis
        </button>
        <button
          id="open-abs-calculator"
          className="btn-secondary"
          onClick={onOpenABSCalculator}
          title="Calculate ABS benefit-sharing fee estimate"
        >
          ABS Calculator
        </button>
        {(data.escalationRecommended) && (
          <button
            id="escalate-btn"
            className="btn-escalate"
            onClick={onEscalate}
          >
            Escalate to Human Facilitator
          </button>
        )}
      </div>

      <div className="cited-answer-card__disclaimer" role="note" aria-live="polite">
        <span className="disclaimer-icon">ⓘ</span>
        <span className="disclaimer-text">{data.disclaimer}</span>
      </div>
    </div>
  );
}
