"use client";

import Link from "next/link";

const DIFFERENTIATORS = [
  { icon: "⏳", title: "Time-Aware Legal Grounding", desc: "Citations show which law is current and which was superseded, so you never cite a repealed provision." },
  { icon: "💰", title: "ABS Financial Liability", desc: "Estimates your Access & Benefit-Sharing fee under the 2025 NBA Regulations with slab comparison." },
  { icon: "🧭", title: "Patentability Pathway", desc: "Recommends product patent, process patent, design, or trade-secret routes based on your formulation." },
  { icon: "🔏", title: "Prior-Possession Timestamp", desc: "SHA-256 hash generated client-side — plaintext never leaves your device. Defensive prior-art evidence." },
  { icon: "🌿", title: "Taxonomy Normalization", desc: "Maps local/vernacular names (e.g. 'Ashwagandha') to botanical IDs, flagging ambiguities." },
];

export default function LandingPage() {
  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="landing-brand">
          <span className="landing-logo" aria-hidden="true">⚖</span>
          <h1 className="landing-title">IP-SAKTI Sahayak</h1>
        </div>
        <Link href="/chat" className="btn-primary" style={{ padding: '10px 24px', textDecoration: 'none' }}>
          Launch App
        </Link>
      </nav>

      <main className="hero-section">
        <div className="hero-badge">Smart India Hackathon 2026</div>
        <h1 className="hero-heading">
          Intellectual Property Guidance for <span>Ayurveda</span>
        </h1>
        <p className="hero-subtitle">
          AI-powered, source-cited guidance on patents, GI tags, ABS compliance, TKDL prior art, and regulatory classification for Ayurvedic products.
        </p>
        <Link href="/chat" className="cta-button">
          Open IP-SAKTI Sahayak <span aria-hidden="true">→</span>
        </Link>
      </main>

      <section className="taxonomy-highlight">
        <div className="taxonomy-highlight-content">
          <div className="hero-badge" style={{ marginBottom: '16px', background: 'transparent' }}>Core Feature</div>
          <h2>Taxonomy Normalization Engine</h2>
          <p>
            Ayurvedic formulations often use regional vernacular names that vary across texts. Our Taxonomy Engine automatically maps local names to their precise botanical IDs before legal classification.
          </p>
          <p>
            <strong>Example:</strong> When you mention "Brahmi", the engine flags the well-documented naming ambiguity between <em>Bacopa monnieri</em> (North Indian use) and <em>Centella asiatica</em> (South Indian use), rather than silently guessing.
          </p>
          <Link href="/chat" className="btn-secondary" style={{ display: 'inline-flex', padding: '12px 24px', textDecoration: 'none', marginTop: '16px' }}>
            Try it in the Chat
          </Link>
        </div>
        <div className="taxonomy-preview">
           <div className="taxonomy-note__body" style={{ animation: 'none' }}>
            <p className="taxonomy-note__heading">
              <span className="taxonomy-note__label">Taxonomy Agent</span>
              Ingredient identification
            </p>
            <div className="taxonomy-note__cards">
              <div className="taxonomy-card">
                <div className="taxonomy-card__mapping">
                  <span className="taxonomy-card__local">Brahmi</span>
                  <span className="taxonomy-card__arrow" aria-hidden="true">→</span>
                  <span className="taxonomy-card__botanical" style={{ color: 'var(--alert-amber)' }}>Ambiguous</span>
                </div>
                <div className="taxonomy-card__ambiguity" role="alert">
                  <span className="taxonomy-card__ambiguity-icon" aria-hidden="true">⚠</span>
                  <div className="taxonomy-card__ambiguity-content">
                    <span className="taxonomy-card__ambiguity-tag">Naming Ambiguity</span>
                    <p className="taxonomy-card__ambiguity-text">"Brahmi" refers to two different plants depending on region and text: Bacopa monnieri or Centella asiatica.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Comprehensive IP Capabilities</h2>
        <div className="features-grid">
          {DIFFERENTIATORS.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
