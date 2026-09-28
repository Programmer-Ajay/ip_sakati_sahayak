import type { FormulationCategory } from "./types";
import guidanceData from "../data/patent-office-guidance.json";

export interface PathwayOption {
  key: string;
  label: string;
  whenRecommended: string;
  evidenceNeeded: string[];
  recommended: boolean;
}

const evidence = guidanceData.pathwayEvidence;

/**
 * Returns recommended patentability pathways for a given formulation category.
 * Rationale follows patent-office-guidance.json's pathwayEvidence entries.
 */
export function getPathwayOptions(
  classification: FormulationCategory | null
): PathwayOption[] {
  const options: PathwayOption[] = [
    {
      key: "productPatent",
      label: evidence.productPatent.label,
      whenRecommended: evidence.productPatent.whenRecommended,
      evidenceNeeded: evidence.productPatent.evidenceNeeded,
      recommended: false,
    },
    {
      key: "processPatent",
      label: evidence.processPatent.label,
      whenRecommended: evidence.processPatent.whenRecommended,
      evidenceNeeded: evidence.processPatent.evidenceNeeded,
      recommended: false,
    },
    {
      key: "design",
      label: evidence.design.label,
      whenRecommended: evidence.design.whenRecommended,
      evidenceNeeded: evidence.design.evidenceNeeded,
      recommended: false,
    },
    {
      key: "tradeSecret",
      label: evidence.tradeSecret.label,
      whenRecommended: evidence.tradeSecret.whenRecommended,
      evidenceNeeded: evidence.tradeSecret.evidenceNeeded,
      recommended: false,
    },
  ];

  // Mark recommended based on classification
  switch (classification) {
    case "new":
    case "phytopharmaceutical":
      options[0].recommended = true; // Product Patent
      options[1].recommended = true; // Process Patent
      break;
    case "proprietary":
      options[1].recommended = true; // Process Patent
      options[3].recommended = true; // Trade Secret
      break;
    case "classical":
      options[3].recommended = true; // Trade Secret (if any novel aspect at all)
      break;
    case "cosmetic":
      options[2].recommended = true; // Design
      options[3].recommended = true; // Trade Secret
      break;
    case "nutraceutical":
      options[3].recommended = true; // Trade Secret
      break;
    default:
      options[1].recommended = true; // Process Patent as safe default
  }

  return options;
}
