"use client";

import type { TaxonomyNote } from "@/lib/types";

interface Props {
  data: TaxonomyNote[];
}

export default function TaxonomyNoteCard({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <div className="assistant-message taxonomy-note">
      <div className="assistant-avatar assistant-avatar--taxonomy" aria-hidden="true">🌿</div>
      <div className="taxonomy-note__body">
        <p className="taxonomy-note__heading">
          <span className="taxonomy-note__label">Taxonomy Agent</span>
          Ingredient identification
        </p>
        <div className="taxonomy-note__cards">
          {data.map((note, i) => (
            <div key={i} className="taxonomy-card">
              <div className="taxonomy-card__mapping">
                <span className="taxonomy-card__local">{note.matchedLocalName}</span>
                <span className="taxonomy-card__arrow" aria-hidden="true">→</span>
                <span className="taxonomy-card__botanical">
                  <em>{note.botanicalName}</em>
                </span>
                {note.family && (
                  <span className="taxonomy-card__family">({note.family})</span>
                )}
              </div>
              {note.regionalNote && (
                <div className="taxonomy-card__ambiguity" role="alert">
                  <span className="taxonomy-card__ambiguity-icon" aria-hidden="true">⚠</span>
                  <div className="taxonomy-card__ambiguity-content">
                    <span className="taxonomy-card__ambiguity-tag">Naming Ambiguity</span>
                    <p className="taxonomy-card__ambiguity-text">{note.regionalNote}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
