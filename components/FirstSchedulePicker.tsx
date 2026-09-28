"use client";

import { useState } from "react";
import firstScheduleData from "@/data/first-schedule.json";

interface Props {
  onSelect: (text: string) => void;
}

interface FirstScheduleData {
  actName: string;
  sectionReference: string;
  status: string;
  verifiedEntries: { no: number; name: string }[];
  wellKnownEntriesPendingVerification: string[];
  note: string;
}

const data = firstScheduleData as FirstScheduleData;

const allEntries = [
  ...data.verifiedEntries.map((e) => ({ name: e.name, verified: true })),
  ...data.wellKnownEntriesPendingVerification.map((name) => ({ name, verified: false })),
];

export default function FirstSchedulePicker({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = allEntries.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div className="assistant-message first-schedule-picker">
      <div className="assistant-avatar" aria-hidden="true">⚖</div>
      <div className="first-schedule-picker__body">
        <p className="first-schedule-picker__question">
          Which authoritative text from the First Schedule (Drugs &amp; Cosmetics Act, 1940) is this formulation drawn from?
        </p>
        <p className="first-schedule-picker__note" aria-live="polite">
          ⚠ Partial list — verified entries shown with ✓. Pending-verification entries are marked accordingly. Full list pending complete extraction.
        </p>
        <input
          id="first-schedule-search"
          type="text"
          className="first-schedule-picker__search"
          placeholder="Search classical texts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search classical texts"
        />
        <ul className="first-schedule-picker__list" role="listbox" aria-label="Classical texts">
          {filtered.map((entry) => (
            <li
              key={entry.name}
              role="option"
              aria-selected={selected === entry.name}
              className={`first-schedule-picker__item ${selected === entry.name ? "first-schedule-picker__item--selected" : ""}`}
              onClick={() => setSelected(entry.name)}
            >
              <span className="first-schedule-picker__name">{entry.name}</span>
              {entry.verified ? (
                <span className="first-schedule-picker__verified" title="Verified extraction">✓</span>
              ) : (
                <span className="first-schedule-picker__pending" title="Pending verification">~</span>
              )}
            </li>
          ))}
        </ul>
        {selected && (
          <div className="first-schedule-picker__confirm">
            <span>Selected: <strong>{selected}</strong></span>
            <button
              id="confirm-first-schedule"
              className="btn-primary"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
