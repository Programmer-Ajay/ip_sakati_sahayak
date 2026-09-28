"use client";

export default function EscalationCard() {
  return (
    <div className="escalation-card">
      <div className="escalation-card__icon" aria-hidden="true">⚠</div>
      <div className="escalation-card__body">
        <h3 className="escalation-card__title">Escalation Requested</h3>
        <p className="escalation-card__text">
          This query has been flagged for review by a qualified IP facilitator. In a production
          deployment, this would notify a human expert who can provide jurisdiction-specific legal
          guidance within your organisation&apos;s SLA.
        </p>
        <div className="escalation-card__contact">
          <p className="escalation-card__contact-label">Suggested next steps:</p>
          <ul className="escalation-card__steps">
            <li>Contact the CGPDTM helpdesk for patent-specific queries: <strong>cgpdtm-helpdesk@nic.in</strong></li>
            <li>For ABS/biodiversity queries, contact NBA: <strong>nba-india@nic.in</strong></li>
            <li>For AYUSH regulatory queries, contact AIIA: <strong>aiia@gov.in</strong></li>
          </ul>
        </div>
        <p className="cited-answer-card__disclaimer" role="note">
          <span className="disclaimer-icon">ⓘ</span>
          This provides information, not legal advice. Consult a qualified IP or AYUSH legal professional before acting on any information provided.
        </p>
      </div>
    </div>
  );
}
