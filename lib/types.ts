export type Jurisdiction = "india" | "international";

export type FormulationCategory =
  | "classical" | "proprietary" | "new"
  | "phytopharmaceutical" | "nutraceutical" | "cosmetic";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface SupersededBy {
  actName: string;
  sectionOrRule: string;
  effectiveDate: string;
  supersededNote: string;
}

export interface Citation {
  actName: string;
  sectionOrRule: string;
  validFrom?: string;
  supersededBy?: SupersededBy | null;
  sourceUrl?: string;
}

// confidence and citations are REQUIRED, never optional — a
// CitedAnswer with an empty citations array is only valid when
// confidence is "Low" and escalationRecommended is true.
export interface CitedAnswer {
  answerText: string;
  citations: Citation[];
  confidence: ConfidenceLevel;
  jurisdiction: Jurisdiction;
  classification: FormulationCategory | null;
  disclaimer: string;
  escalationRecommended: boolean;
}

export interface ClarifyingQuestion {
  questionText: string;
  options: { label: string; value: FormulationCategory }[];
}

export interface TaxonomyNote {
  matchedLocalName: string;
  botanicalName: string;
  family: string | null;
  regionalNote: string | null;
}

// Every message in the chat thread is one of these — this is what
// replaces a separate classify/chat route split with one continuous
// conversation.
export type ChatMessage =
  | { type: "user_text"; text: string }
  | { type: "taxonomy_note"; data: TaxonomyNote[] }
  | { type: "clarifying_question"; data: ClarifyingQuestion }
  | { type: "first_schedule_picker" }
  | { type: "cited_answer"; data: CitedAnswer }
  | {
      type: "widget";
      widget: "abs_calculator" | "pathway_engine" | "timestamp_certificate";
    };
