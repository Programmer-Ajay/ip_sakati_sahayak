"use client";

import type { ClarifyingQuestion, FormulationCategory } from "@/lib/types";

interface Props {
  data: ClarifyingQuestion;
  onSelect: (value: FormulationCategory) => void;
  language: "en" | "hi";
}

export default function ClarifyingQuestionCard({ data, onSelect, language }: Props) {
  return (
    <div className="assistant-message clarifying-question">
      <div className="assistant-avatar" aria-hidden="true">⚖</div>
      <div className="clarifying-question__body">
        <p className="clarifying-question__text">{data.questionText}</p>
        <div className="clarifying-question__options" role="group" aria-label="Select formulation type">
          {data.options.map((opt) => (
            <button
              key={opt.value}
              id={`clarify-${opt.value}`}
              className="clarifying-question__option"
              onClick={() => onSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
