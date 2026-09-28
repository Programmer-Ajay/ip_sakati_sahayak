"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type {
  ChatMessage,
  FormulationCategory,
  Jurisdiction,
  TaxonomyNote,
} from "@/lib/types";
import { classifyFromQuery, getAnswer } from "@/lib/answer-engine";
import { findTaxonomyMatches } from "@/lib/taxonomy";
import ChatThread from "@/components/ChatThread";
import ClassificationChip from "@/components/ClassificationChip";
import categoriesData from "@/data/classification-categories.json";

interface CategoryEntry {
  id: string;
  label: string;
  description: string;
  inferenceKeywords: string[];
}
const categories = categoriesData as CategoryEntry[];

const SAMPLE_QUERIES = [
  "Can I patent my herbal face cream with ashwagandha?",
  "How much ABS fee do I owe on ₹20 crore turnover?",
  "Is my Charaka Samhita formulation patentable?",
  "What is the IP status of Brahmi-based formulations?",
];

const DIFFERENTIATORS = [
  { icon: "⏳", title: "Time-Aware Legal Grounding", desc: "Citations show which law is current and which was superseded, so you never cite a repealed provision." },
  { icon: "💰", title: "ABS Financial Liability Calculator", desc: "Estimates your Access & Benefit-Sharing fee under the 2025 NBA Regulations with slab comparison." },
  { icon: "🧭", title: "Patentability Pathway Engine", desc: "Recommends product patent, process patent, design, or trade-secret routes based on your formulation type." },
  { icon: "🔏", title: "Prior-Possession Timestamp Certificate", desc: "SHA-256 hash generated client-side — plaintext never leaves your device. Defensive prior-art evidence." },
  { icon: "🌿", title: "Taxonomy Normalization", desc: "Maps local/vernacular names (e.g. 'Ashwagandha') to botanical IDs, flagging ambiguities like Brahmi." },
];

const SECURITY_BADGES = [
  { id: "auth", label: "Auth", detail: "Session-scoped" },
  { id: "consent", label: "Consent Log", detail: "DPDP Act, 2023" },
  { id: "audit", label: "Audit Trail", detail: "90-day retention" },
  { id: "freshness", label: "Legal Freshness", detail: "Verified Sept 2025" },
  { id: "usage", label: "Usage Monitor", detail: "No PII in query logs" },
];

export default function ChatPage() {
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("india");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [classification, setClassification] = useState<FormulationCategory | null>(null);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && leftPanelOpen) {
        setLeftPanelOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [leftPanelOpen]);

  const append = (msg: ChatMessage) =>
    setMessages((prev) => [...prev, msg]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isThinking) return;
    setInputValue("");
    setIsThinking(true);

    // 1. Append user message
    append({ type: "user_text", text });

    // 2. TAXONOMY AGENT: check for ingredient name matches BEFORE classification
    const taxonomyMatches = findTaxonomyMatches(text);
    if (taxonomyMatches.length > 0) {
      const taxonomyNotes: TaxonomyNote[] = taxonomyMatches.map((m) => ({
        matchedLocalName: m.matchedLocalName,
        botanicalName: m.entry.botanicalName,
        family: m.entry.family,
        regionalNote: m.entry.regionalNote,
      }));
      append({ type: "taxonomy_note", data: taxonomyNotes });
    }

    // 3. Try to classify
    const detected = classifyFromQuery(text);

    if (!detected) {
      // 3a. No confident match — ask clarifying question
      setClassification(null);
      setPendingQuery(text);
      append({
        type: "clarifying_question",
        data: {
          questionText:
            language === "hi"
              ? "आपका उत्पाद किस श्रेणी में आता है?"
              : "To give you the most accurate guidance, which best describes your product?",
          options: categories.map((c) => ({
            label: c.label,
            value: c.id as FormulationCategory,
          })),
        },
      });
      setIsThinking(false);
    } else {
      // 3b. Confident match
      setClassification(detected);
      setPendingQuery(text);

      if (detected === "classical") {
        // Need First Schedule picker before answering
        append({ type: "first_schedule_picker" });
        setIsThinking(false);
      } else {
        // Proceed to answer
        await resolveAndAnswer(text, detected);
      }
    }
  };

  const resolveAndAnswer = async (
    query: string,
    cat: FormulationCategory | null,
    classicalText?: string
  ) => {
    setIsThinking(true);
    const enriched = classicalText ? `${query} [classical text: ${classicalText}]` : query;
    const answer = await getAnswer({ query: enriched, jurisdiction, classification: cat });

    if (answer.answerText === "__COMPUTE_VIA_ABS_CALCULATOR__") {
      // Special case: inject the cited answer with citations (for time-aware badge),
      // then open the calculator widget
      append({
        type: "cited_answer",
        data: {
          ...answer,
          answerText:
            "Your query relates to ABS benefit-sharing fees. Use the calculator below to estimate your financial liability under the current 2025 Regulations — including a comparison with the superseded 2014 slabs.",
        },
      });
      append({ type: "widget", widget: "abs_calculator" });
    } else {
      append({ type: "cited_answer", data: answer });
    }
    setIsThinking(false);
  };

  // Called when user picks a category from the clarifying question
  const handleSelectCategory = async (value: FormulationCategory) => {
    setClassification(value);
    if (value === "classical") {
      append({ type: "first_schedule_picker" });
    } else if (pendingQuery) {
      await resolveAndAnswer(pendingQuery, value);
    }
  };

  // Called when user picks a classical text
  const handleSelectClassicalText = async (text: string) => {
    if (pendingQuery) {
      await resolveAndAnswer(pendingQuery, classification, text);
    }
  };

  const handleEscalate = () => {
    append({ type: "widget", widget: "abs_calculator" }); // reuse widget slot
    append({ type: "cited_answer", data: {
      answerText: "Your query has been flagged for human expert review. A qualified IP facilitator will be notified.",
      citations: [],
      confidence: "Low",
      jurisdiction,
      classification,
      disclaimer: "This provides information, not legal advice. Consult a qualified IP or AYUSH legal professional.",
      escalationRecommended: true,
    }});
  };

  const handleOpenABSCalculator = () => {
    append({ type: "widget", widget: "abs_calculator" });
  };

  const handleOpenPathwayEngine = () => {
    append({ type: "widget", widget: "pathway_engine" });
  };

  const handleOpenTimestampCertificate = () => {
    append({ type: "widget", widget: "timestamp_certificate" });
  };

  const handleResetClassification = () => {
    setClassification(null);
    if (pendingQuery) {
      append({
        type: "clarifying_question",
        data: {
          questionText: "Please select the correct category for your product:",
          options: categories.map((c) => ({
            label: c.label,
            value: c.id as FormulationCategory,
          })),
        },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(inputValue);
    }
  };

  return (
    <div className="app-shell">
      {/* ───── CHAT GLOBAL NAV (Desktop only) ───── */}
      <div className="chat-global-nav">
        <Link href="/" className="back-link">
          <span aria-hidden="true">←</span> Back to Home
        </Link>
      </div>

      {/* ───── MOBILE BACKDROP OVERLAY ───── */}
      {leftPanelOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setLeftPanelOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ───── LEFT PANEL (About / Features Drawer on Mobile, Sidebar on Desktop) ───── */}
      <aside className={`left-panel ${leftPanelOpen ? "left-panel--open" : ""}`} id="left-panel">
        {/* Mobile Drawer Header */}
        <div className="left-panel__mobile-header">
          <div className="left-panel__brand-mini">
            <span className="left-panel__logo-mini" aria-hidden="true">⚖</span>
            <span className="left-panel__title-mini">IP-SAKTI Sahayak</span>
          </div>
          <button
            className="left-panel__close-btn"
            onClick={() => setLeftPanelOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="left-panel__content">
          <Link
            href="/"
            className="left-panel__home-link"
            onClick={() => setLeftPanelOpen(false)}
          >
            <span aria-hidden="true">←</span> Back to Homepage
          </Link>

          {/* Brand */}
          <div className="left-panel__brand">
            <span className="left-panel__logo" aria-hidden="true">⚖</span>
            <div>
              <h1 className="left-panel__title">IP-SAKTI Sahayak</h1>
              <p className="left-panel__tagline">
                {language === "hi"
                  ? "आयुर्वेद के लिए बौद्धिक संपदा मार्गदर्शन"
                  : "Intellectual Property Guidance"}
              </p>
            </div>
          </div>

          {/* What this helps with */}
          <div className="left-panel__section">
            <h2 className="left-panel__section-title">Capabilities</h2>
            <ul className="left-panel__capability-list">
              <li>Jurisdiction-aware statutory citations</li>
              <li>Formulation classification (D&C Act, 1940)</li>
              <li>TK/prior-art checks via TKDL corpus</li>
              <li>ABS compliance under 2025 NBA Regs</li>
              <li>GI tag & trade secret advisory</li>
            </ul>
          </div>

          {/* Differentiators */}
          <div className="left-panel__section">
            <h2 className="left-panel__section-title">Features</h2>
            <div className="left-panel__diff-list">
              {DIFFERENTIATORS.map((d) => (
                <div key={d.title} className="diff-item">
                  <span className="diff-item__icon" aria-hidden="true">{d.icon}</span>
                  <div className="diff-item__content">
                    <span className="diff-item__title">{d.title}</span>
                    <span className="diff-item__desc">{d.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="left-panel__footer">
            <p className="left-panel__footer-text">
              Security & Privacy
            </p>
            <div className="left-panel__badges">
              {SECURITY_BADGES.map((b) => (
                <div key={b.id} className="security-badge" title={b.detail}>
                  <span className="security-badge__dot" aria-label="OK" />
                  <span className="security-badge__label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ───── RIGHT PANEL (Chat) ───── */}
      <div className="right-panel">
        {/* Header */}
        <header className="app-header">
          <div className="app-header__left">
            <button
              className="app-header__menu-btn"
              onClick={() => setLeftPanelOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className="menu-btn-icon" aria-hidden="true">☰</span>
              <span className="menu-btn-text">Menu</span>
            </button>
            <Link href="/" className="app-header__back-btn" title="Back to Homepage">
              <span aria-hidden="true">←</span>
              <span className="back-btn-text">Home</span>
            </Link>
          </div>
          <div className="app-header__controls">
            {/* Jurisdiction Toggle */}
            <div className="jurisdiction-toggle" role="group" aria-label="Select jurisdiction">
              <button
                id="jur-india"
                className={`jur-btn ${jurisdiction === "india" ? "jur-btn--active" : ""}`}
                onClick={() => setJurisdiction("india")}
                aria-pressed={jurisdiction === "india"}
              >
                <span className="jur-icon">🇮🇳</span>
                <span className="jur-label">{language === "hi" ? "भारत" : "India"}</span>
              </button>
              <div className="jur-divider" aria-hidden="true" />
              <button
                id="jur-international"
                className={`jur-btn ${jurisdiction === "international" ? "jur-btn--active" : ""}`}
                onClick={() => setJurisdiction("international")}
                aria-pressed={jurisdiction === "international"}
              >
                <span className="jur-icon">🌐</span>
                <span className="jur-label">{language === "hi" ? "अंतर्राष्ट्रीय" : "International"}</span>
              </button>
            </div>

            {/* Language Toggle */}
            <div className="lang-toggle" role="group" aria-label="Select language">
              {(["en", "hi"] as const).map((lang) => (
                <button
                  key={lang}
                  id={`lang-${lang}`}
                  className={`lang-btn ${language === lang ? "lang-btn--active" : ""}`}
                  onClick={() => setLanguage(lang)}
                  aria-pressed={language === lang}
                >
                  {lang === "en" ? "EN" : "हि"}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Classification chip if active */}
        {classification && messages.some((m) => m.type === "user_text") && (
          <div className="classification-chip-bar">
            <ClassificationChip
              category={classification}
              onEdit={handleResetClassification}
              language={language}
            />
          </div>
        )}

        {/* Chat thread */}
        <main className="chat-main" id="chat-main" role="main">
          <ChatThread
            messages={messages}
            language={language}
            classification={classification}
            onSelectCategory={handleSelectCategory}
            onSelectClassicalText={handleSelectClassicalText}
            onEscalate={handleEscalate}
            onOpenABSCalculator={handleOpenABSCalculator}
            onOpenPathwayEngine={handleOpenPathwayEngine}
            onSubmit={handleSubmit}
            sampleQueries={SAMPLE_QUERIES}
          />

          {/* Loading indicator */}
          {isThinking && (
            <div className="thinking-indicator" aria-live="polite" aria-label="Assistant is thinking">
              <div className="thinking-dot" />
              <div className="thinking-dot" />
              <div className="thinking-dot" />
            </div>
          )}
        </main>

        {/* Input area */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              id="chat-input"
              className="chat-input"
              placeholder={
                language === "hi"
                  ? "अपना प्रश्न यहाँ लिखें..."
                  : "Ask about patents, GI tags, ABS compliance, TKDL prior art..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={isThinking}
              aria-label="Chat input"
            />
            <div className="chat-input-actions">
              <button
                id="cert-shortcut"
                className="btn-icon"
                title="Generate Prior-Possession Timestamp Certificate"
                onClick={handleOpenTimestampCertificate}
                aria-label="Open Timestamp Certificate"
              >
                🔏
              </button>
              <button
                id="send-btn"
                className="btn-send"
                onClick={() => handleSubmit(inputValue)}
                disabled={!inputValue.trim() || isThinking}
                aria-label="Send message"
              >
                {language === "hi" ? "भेजें" : "Send"}
              </button>
            </div>
          </div>
          <p className="chat-input-disclaimer" role="note">
            {language === "hi"
              ? "यह जानकारी प्रदान करता है, कानूनी सलाह नहीं। किसी योग्य IP वकील से परामर्श लें।"
              : "This provides information, not legal advice. Always consult a qualified IP or AYUSH legal professional."}
          </p>
        </div>
      </div>
    </div>
  );
}
