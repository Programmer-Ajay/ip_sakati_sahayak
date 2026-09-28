// SWAP POINT for real backend — return shape (CitedAnswer) must not change.
// To connect the real FastAPI + Qdrant RAG pipeline, replace getAnswer() below
// with a fetch() to your API route while keeping the CitedAnswer return type identical.

import type { CitedAnswer, FormulationCategory, Jurisdiction } from "./types";
import { classifyFromQuery as classifyQuery } from "./classification-rules";
import qaPairsData from "../data/qa-pairs.json";

export { classifyQuery as classifyFromQuery };

interface QAPair {
  id: string;
  queryKeywords: string[];
  jurisdiction: string;
  classification: string | null;
  answerText: string;
  citations: Array<{
    actName: string;
    sectionOrRule: string;
    validFrom?: string;
    supersededBy?: {
      actName: string;
      sectionOrRule: string;
      effectiveDate: string;
      supersededNote: string;
    } | null;
    sourceUrl?: string;
  }>;
  confidence: "High" | "Medium" | "Low";
  escalationRecommended: boolean;
}

const qaPairs = qaPairsData as QAPair[];

const DISCLAIMER =
  "This provides information, not legal advice. Consult a qualified IP or AYUSH legal professional before acting on any information provided.";

interface GetAnswerParams {
  query: string;
  jurisdiction: Jurisdiction;
  classification: FormulationCategory | null;
}

/**
 * Matches query keywords against qa-pairs.json.
 * Special-case: if answerText === "__COMPUTE_VIA_ABS_CALCULATOR__",
 * returns a sentinel answer that the UI maps to the ABS calculator widget.
 */
export async function getAnswer({
  query,
  jurisdiction,
  classification,
}: GetAnswerParams): Promise<CitedAnswer> {
  // Artificial delay to simulate retrieval — remove or replace with real fetch()
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));

  const lower = query.toLowerCase();

  // Score each QA pair
  let bestScore = 0;
  let bestPair: QAPair | null = null;

  for (const pair of qaPairs) {
    // Jurisdiction must match (or pair has no jurisdiction restriction)
    if (pair.jurisdiction && pair.jurisdiction !== jurisdiction) continue;

    // Score keyword overlap
    let score = 0;
    for (const kw of pair.queryKeywords) {
      if (lower.includes(kw.toLowerCase())) score += 2;
    }
    // Boost if classification matches
    if (classification && pair.classification === classification) score += 1;

    if (score > bestScore) {
      bestScore = score;
      bestPair = pair;
    }
  }

  // Fallback — no good match → escalate
  if (!bestPair || bestScore === 0) {
    return {
      answerText:
        "This query falls outside the scope of what this corpus currently covers with confidence. Rather than provide an uncertain answer, this has been flagged for a human IP facilitator.",
      citations: [],
      confidence: "Low",
      jurisdiction,
      classification,
      disclaimer: DISCLAIMER,
      escalationRecommended: true,
    };
  }

  // Special case: ABS calculator trigger
  if (bestPair.answerText === "__COMPUTE_VIA_ABS_CALCULATOR__") {
    return {
      answerText: "__COMPUTE_VIA_ABS_CALCULATOR__",
      citations: bestPair.citations,
      confidence: bestPair.confidence,
      jurisdiction,
      classification,
      disclaimer: DISCLAIMER,
      escalationRecommended: bestPair.escalationRecommended,
    };
  }

  return {
    answerText: bestPair.answerText,
    citations: bestPair.citations,
    confidence: bestPair.confidence,
    jurisdiction,
    classification,
    disclaimer: DISCLAIMER,
    escalationRecommended: bestPair.escalationRecommended,
  };
}
