export default function SecurityFooter() {
  const badges = [
    { id: "auth", label: "Auth", detail: "Session-scoped, no persistent credentials stored", ok: true },
    { id: "consent", label: "Consent Log", detail: "Data use logged per DPDP Act, 2023", ok: true },
    { id: "audit", label: "Audit Trail", detail: "All queries timestamped and retained for 90 days", ok: true },
    { id: "freshness", label: "Legal Freshness", detail: "Corpus last verified: Sept 2025", ok: true },
    { id: "usage", label: "Usage Monitor", detail: "Rate-limited; no PII retained in query logs", ok: true },
  ];

  return (
    <footer className="security-footer">
      <div className="security-footer__badges">
        {badges.map((b) => (
          <div key={b.id} className="security-badge" title={b.detail}>
            <span className="security-badge__dot" aria-label="OK" />
            <span className="security-badge__label">{b.label}</span>
          </div>
        ))}
      </div>
      <p className="security-footer__note">
        IP-SAKTI Sahayak — developed under Smart India Hackathon PS 26045 for Ministry of AYUSH &amp; AIIA.
        Governed by the Digital Personal Data Protection Act, 2023. No legal advice is given or implied.
      </p>
    </footer>
  );
}
