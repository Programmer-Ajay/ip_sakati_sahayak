import absData from "../data/abs-fee-slabs.json";

interface Slab {
  turnoverMin: number;
  turnoverMax: number | null;
  ratePercent: number;
  label: string;
}

interface ABSResult {
  fee: number;
  ratePercent: number;
  slabLabel: string;
  exempt: boolean;
  exemptionReason?: string;
  sourceName: string;
  effectiveFrom: string;
  disclaimer: string;
  supersededNote: string;
  supersededSource: {
    name: string;
    effectiveUntil: string;
    slabs: Slab[];
  };
}

const current = absData.current;
const superseded = absData.superseded;

/**
 * Computes benefit-sharing fee using CURRENT (2025) slabs only.
 * Never uses superseded slabs for calculation — those exist only for TimeAwareBadge demo.
 */
export function computeABSFee({
  turnover,
  isRegisteredPractitioner,
  isCultivated,
}: {
  turnover: number;
  isRegisteredPractitioner: boolean;
  isCultivated: boolean;
}): ABSResult {
  const DISCLAIMER =
    "Estimate only — confirm with the National Biodiversity Authority before acting. The 2025 effective date shown is approximate; verify the exact gazette notification date.";

  // Exemptions per Section 7 BDA and 2025 Rules
  if (isRegisteredPractitioner) {
    return {
      fee: 0,
      ratePercent: 0,
      slabLabel: "Exempt",
      exempt: true,
      exemptionReason:
        "Registered AYUSH practitioners using biological resources for indigenous medicine are exempt from prior NBA approval and ABS fees under Section 7(1) proviso of the Biological Diversity Act, 2002.",
      sourceName: current.sourceName,
      effectiveFrom: current.effectiveFrom,
      disclaimer: DISCLAIMER,
      supersededNote: superseded.supersededByNote,
      supersededSource: {
        name: superseded.sourceName,
        effectiveUntil: superseded.effectiveUntil,
        slabs: superseded.slabs as Slab[],
      },
    };
  }

  if (isCultivated) {
    return {
      fee: 0,
      ratePercent: 0,
      slabLabel: "Exempt (Cultivated Plant)",
      exempt: true,
      exemptionReason:
        "Cultivated medicinal plants are exempt from ABS fees under the 2025 Regulations, provided a certificate of origin is obtained from the Biodiversity Management Committee.",
      sourceName: current.sourceName,
      effectiveFrom: current.effectiveFrom,
      disclaimer: DISCLAIMER,
      supersededNote: superseded.supersededByNote,
      supersededSource: {
        name: superseded.sourceName,
        effectiveUntil: superseded.effectiveUntil,
        slabs: superseded.slabs as Slab[],
      },
    };
  }

  // Find the applicable slab
  const slabs = current.slabs as Slab[];
  const slab = slabs.find(
    (s) =>
      turnover >= s.turnoverMin &&
      (s.turnoverMax === null || turnover <= s.turnoverMax)
  );

  if (!slab) {
    throw new Error("No matching ABS slab found for turnover value");
  }

  const fee = (turnover * slab.ratePercent) / 100;

  return {
    fee,
    ratePercent: slab.ratePercent,
    slabLabel: slab.label,
    exempt: false,
    sourceName: current.sourceName,
    effectiveFrom: current.effectiveFrom,
    disclaimer: DISCLAIMER,
    supersededNote: superseded.supersededByNote,
    supersededSource: {
      name: superseded.sourceName,
      effectiveUntil: superseded.effectiveUntil,
      slabs: superseded.slabs as Slab[],
    },
  };
}
