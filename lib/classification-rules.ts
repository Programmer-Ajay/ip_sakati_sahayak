import type { FormulationCategory } from "./types";
import categoriesData from "../data/classification-categories.json";

interface CategoryEntry {
  id: string;
  label: string;
  description: string;
  inferenceKeywords: string[];
}

const categories = categoriesData as CategoryEntry[];

/**
 * Scores a query against each category's inferenceKeywords.
 * Returns the best-matching FormulationCategory above the confidence threshold, or null.
 */
export function classifyFromQuery(text: string): FormulationCategory | null {
  const lower = text.toLowerCase();
  const THRESHOLD = 1; // At least 1 keyword must match

  let bestScore = 0;
  let bestCategory: FormulationCategory | null = null;

  for (const category of categories) {
    let score = 0;
    for (const kw of category.inferenceKeywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category.id as FormulationCategory;
    }
  }

  return bestScore >= THRESHOLD ? bestCategory : null;
}
