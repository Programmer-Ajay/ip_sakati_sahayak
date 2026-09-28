"use client";

import type { ConfidenceLevel } from "@/lib/types";

interface Props {
  level: ConfidenceLevel;
}

const config: Record<ConfidenceLevel, { label: string; className: string; title: string }> = {
  High: {
    label: "High Confidence",
    className: "confidence-badge confidence-badge--high",
    title: "Answer grounded in directly applicable statutory text",
  },
  Medium: {
    label: "Medium Confidence",
    className: "confidence-badge confidence-badge--medium",
    title: "Answer grounded in related provisions; verify the specific application",
  },
  Low: {
    label: "Low Confidence",
    className: "confidence-badge confidence-badge--low",
    title: "Query is at or beyond the boundary of this corpus — escalation recommended",
  },
};

export default function ConfidenceBadge({ level }: Props) {
  const { label, className, title } = config[level];
  return (
    <span className={className} title={title} aria-label={`Confidence: ${label}`}>
      {label}
    </span>
  );
}
