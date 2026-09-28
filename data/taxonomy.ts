import taxonomyData from "../data/taxonomy.json";

export interface TaxonomyEntry {
  localNames: string[];
  botanicalName: string;
  family: string | null;
  regionalNote: string | null;
}

interface TaxonomyData {
  entries: TaxonomyEntry[];
  note: string;
}

const taxonomy = taxonomyData as TaxonomyData;

export interface TaxonomyMatch {
  matchedLocalName: string;
  entry: TaxonomyEntry;
}

/**
 * Scans free text for any recognized local/vernacular ingredient name
 * and returns every match found, so the UI can render a "local name →
 * botanical ID" note before or alongside the answer (this is the
 * Taxonomy Enrichment stage from the architecture — previously built
 * but never wired into the mock chat flow).
 *
 * Returns an empty array when nothing is recognized — that's the
 * expected, non-error case for most queries (e.g. "what is Section
 * 3(p)" mentions no ingredient at all).
 */
export function findTaxonomyMatches(text: string): TaxonomyMatch[] {
  const normalized = text.toLowerCase();
  const matches: TaxonomyMatch[] = [];

  for (const entry of taxonomy.entries) {
    for (const localName of entry.localNames) {
      if (normalized.includes(localName.toLowerCase())) {
        matches.push({ matchedLocalName: localName, entry });
        break; // one hit per entry is enough — don't double-count synonyms
      }
    }
  }

  return matches;
}

export function getAllTaxonomyEntries(): TaxonomyEntry[] {
  return taxonomy.entries;
}
