"use client";

import { useState } from "react";
import { computeABSFee } from "@/lib/abs-calculator";

export default function ABSCalculatorWidget() {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isCultivated, setIsCultivated] = useState<boolean | null>(null);
  const [turnoverStr, setTurnoverStr] = useState("");
  const [result, setResult] = useState<ReturnType<typeof computeABSFee> | null>(null);
  const [showSuperseded, setShowSuperseded] = useState(false);

  const canCompute =
    isRegistered !== null && isCultivated !== null && turnoverStr !== "";

  const handleCompute = () => {
    const turnover = parseFloat(turnoverStr.replace(/,/g, "")) || 0;
    const res = computeABSFee({
      turnover,
      isRegisteredPractitioner: isRegistered!,
      isCultivated: isCultivated!,
    });
    setResult(res);
  };

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="widget-card abs-calculator">
      <div className="widget-card__header">
        <span className="widget-badge">Differentiator</span>
        <h3 className="widget-card__title">ABS Financial Liability Calculator</h3>
        <p className="widget-card__subtitle">
          Estimates your Access and Benefit-Sharing fee under the 2025 NBA Regulations
        </p>
      </div>

      <div className="abs-calculator__form">
        {/* Question 1 */}
        <fieldset className="abs-form-group">
          <legend className="abs-form-label">
            Are you a registered AYUSH practitioner (Vaid / Hakim)?
          </legend>
          <div className="abs-form-options">
            <label className="abs-radio-label">
              <input
                type="radio"
                name="isRegistered"
                value="yes"
                checked={isRegistered === true}
                onChange={() => setIsRegistered(true)}
              />
              <span>Yes</span>
            </label>
            <label className="abs-radio-label">
              <input
                type="radio"
                name="isRegistered"
                value="no"
                checked={isRegistered === false}
                onChange={() => setIsRegistered(false)}
              />
              <span>No</span>
            </label>
          </div>
        </fieldset>

        {/* Question 2 */}
        <fieldset className="abs-form-group">
          <legend className="abs-form-label">
            Is the biological resource cultivated (not wild-harvested)?
          </legend>
          <div className="abs-form-options">
            <label className="abs-radio-label">
              <input
                type="radio"
                name="isCultivated"
                value="yes"
                checked={isCultivated === true}
                onChange={() => setIsCultivated(true)}
              />
              <span>Cultivated</span>
            </label>
            <label className="abs-radio-label">
              <input
                type="radio"
                name="isCultivated"
                value="no"
                checked={isCultivated === false}
                onChange={() => setIsCultivated(false)}
              />
              <span>Wild-harvested</span>
            </label>
          </div>
        </fieldset>

        {/* Turnover input */}
        <div className="abs-form-group">
          <label htmlFor="abs-turnover" className="abs-form-label">
            Annual turnover from the product (₹)
          </label>
          <input
            id="abs-turnover"
            type="number"
            className="abs-form-input"
            placeholder="e.g. 75000000"
            value={turnoverStr}
            onChange={(e) => setTurnoverStr(e.target.value)}
            min="0"
          />
          <span className="abs-form-hint">Enter amount in rupees (e.g. 75000000 = ₹7.5 crore)</span>
        </div>

        <button
          id="compute-abs"
          className="btn-primary"
          onClick={handleCompute}
          disabled={!canCompute}
        >
          Compute Estimate
        </button>
      </div>

      {result && (
        <div className="abs-result">
          {result.exempt ? (
            <div className="abs-result__exempt">
              <span className="abs-result__exempt-icon">✓</span>
              <div>
                <p className="abs-result__exempt-title">Likely Exempt</p>
                <p className="abs-result__exempt-reason">{result.exemptionReason}</p>
              </div>
            </div>
          ) : (
            <div className="abs-result__fee">
              <div className="abs-result__fee-row">
                <span className="abs-result__fee-label">Applicable slab:</span>
                <span className="abs-result__fee-value">{result.slabLabel}</span>
              </div>
              <div className="abs-result__fee-row">
                <span className="abs-result__fee-label">Rate:</span>
                <span className="abs-result__fee-value">{result.ratePercent}%</span>
              </div>
              <div className="abs-result__fee-row abs-result__fee-row--total">
                <span className="abs-result__fee-label">Estimated ABS fee:</span>
                <span className="abs-result__fee-total">{formatINR(result.fee)}</span>
              </div>
            </div>
          )}

          {/* Source information */}
          <div className="abs-result__source">
            <p>Source: <strong>{result.sourceName}</strong> (effective {result.effectiveFrom})</p>
          </div>

          {/* TimeAware: superseded law reveal */}
          <div className="abs-result__superseded">
            <button
              className="time-badge__superseded-trigger"
              onClick={() => setShowSuperseded((v) => !v)}
              aria-expanded={showSuperseded}
            >
              <span className="time-badge__superseded-icon">⚖</span>
              What changed from the 2014 Regulations?
              <span className="time-badge__chevron">{showSuperseded ? "▲" : "▼"}</span>
            </button>
            {showSuperseded && (
              <div className="time-badge__superseded-panel">
                <p className="time-badge__superseded-note">{result.supersededNote}</p>
                <table className="abs-comparison-table">
                  <thead>
                    <tr>
                      <th>2014 Slabs (Superseded)</th>
                      <th>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.supersededSource.slabs.map((s, i) => (
                      <tr key={i}>
                        <td>{s.label}</td>
                        <td className="abs-table-rate">{s.ratePercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="abs-superseded-until">
                  Valid until: {result.supersededSource.effectiveUntil}
                </p>
              </div>
            )}
          </div>

          {/* Persistent disclaimer */}
          <div className="cited-answer-card__disclaimer" role="note">
            <span className="disclaimer-icon">ⓘ</span>
            <span className="disclaimer-text">{result.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}
