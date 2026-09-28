"use client";

import type { ChatMessage, FormulationCategory } from "@/lib/types";
import ClarifyingQuestionCard from "./ClarifyingQuestionCard";
import FirstSchedulePicker from "./FirstSchedulePicker";
import CitedAnswerCard from "./CitedAnswerCard";
import EscalationCard from "./EscalationCard";
import ABSCalculatorWidget from "./ABSCalculatorWidget";
import PathwayEngineWidget from "./PathwayEngineWidget";
import TimestampCertificateWidget from "./TimestampCertificateWidget";
import TaxonomyNoteCard from "./TaxonomyNoteCard";

interface Props {
  message: ChatMessage;
  language: "en" | "hi";
  classification: FormulationCategory | null;
  onSelectCategory: (value: FormulationCategory) => void;
  onSelectClassicalText: (text: string) => void;
  onEscalate: () => void;
  onOpenABSCalculator: () => void;
  onOpenPathwayEngine: () => void;
}

export default function MessageBubble({
  message,
  language,
  classification,
  onSelectCategory,
  onSelectClassicalText,
  onEscalate,
  onOpenABSCalculator,
  onOpenPathwayEngine,
}: Props) {
  if (message.type === "user_text") {
    return (
      <div className="message-bubble message-bubble--user">
        <div className="message-bubble__user-content">
          <p>{message.text}</p>
        </div>
      </div>
    );
  }

  if (message.type === "taxonomy_note") {
    return <TaxonomyNoteCard data={message.data} />;
  }

  if (message.type === "clarifying_question") {
    return (
      <ClarifyingQuestionCard
        data={message.data}
        onSelect={onSelectCategory}
        language={language}
      />
    );
  }

  if (message.type === "first_schedule_picker") {
    return <FirstSchedulePicker onSelect={onSelectClassicalText} />;
  }

  if (message.type === "cited_answer") {
    return (
      <CitedAnswerCard
        data={message.data}
        onEscalate={onEscalate}
        onOpenABSCalculator={onOpenABSCalculator}
        onOpenPathwayEngine={onOpenPathwayEngine}
      />
    );
  }

  if (message.type === "widget") {
    if (message.widget === "abs_calculator") {
      return <ABSCalculatorWidget />;
    }
    if (message.widget === "pathway_engine") {
      return <PathwayEngineWidget classification={classification} />;
    }
    if (message.widget === "timestamp_certificate") {
      return <TimestampCertificateWidget />;
    }
    // escalation handled as separate message type
    return <EscalationCard />;
  }

  return null;
}
