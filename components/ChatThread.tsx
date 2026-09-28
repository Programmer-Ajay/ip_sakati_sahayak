"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage, FormulationCategory } from "@/lib/types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  language: "en" | "hi";
  classification: FormulationCategory | null;
  onSelectCategory: (value: FormulationCategory) => void;
  onSelectClassicalText: (text: string) => void;
  onEscalate: () => void;
  onOpenABSCalculator: () => void;
  onOpenPathwayEngine: () => void;
  onSubmit?: (text: string) => void;
  sampleQueries?: string[];
}

export default function ChatThread({
  messages,
  language,
  classification,
  onSelectCategory,
  onSelectClassicalText,
  onEscalate,
  onOpenABSCalculator,
  onOpenPathwayEngine,
  onSubmit,
  sampleQueries,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="chat-thread chat-thread--empty">
        <div className="empty-state">
          <h2 className="empty-state__heading">
            {language === "hi"
              ? "नमस्ते। मैं IP-SAKTI सहायक हूँ।"
              : "Namaste. I am IP-SAKTI Sahayak."}
          </h2>
          <p className="empty-state__subheading">
            {language === "hi"
              ? "पेटेंट, GI टैग, ABS अनुपालन, TKDL पूर्व कला, या अपने आयुर्वेदिक उत्पाद के वर्गीकरण के बारे में पूछें।"
              : "Ask me about patents, GI tags, ABS compliance, TKDL prior art, or formulation classification for your Ayurvedic product."}
          </p>
          {sampleQueries && sampleQueries.length > 0 && (
            <div className="empty-state__examples">
              <p className="empty-state__examples-label">
                {language === "hi" ? "कुछ प्रश्न आज़माएं:" : "Try asking:"}
              </p>
              <ul className="empty-state__example-list">
                {sampleQueries.map((q, i) => (
                  <li key={i}>
                    <button
                      className="empty-state__example-btn"
                      onClick={() => onSubmit?.(q)}
                      aria-label={`Ask: ${q}`}
                    >
                      <span className="empty-state__example-icon" aria-hidden="true">→</span>
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-thread" role="log" aria-live="polite" aria-label="Conversation">
      {messages.map((message, i) => (
        <div key={i} className={`chat-thread__message ${message.type === "user_text" ? "chat-thread__message--user" : "chat-thread__message--assistant"}`}>
          <MessageBubble
            message={message}
            language={language}
            classification={classification}
            onSelectCategory={onSelectCategory}
            onSelectClassicalText={onSelectClassicalText}
            onEscalate={onEscalate}
            onOpenABSCalculator={onOpenABSCalculator}
            onOpenPathwayEngine={onOpenPathwayEngine}
          />
        </div>
      ))}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
