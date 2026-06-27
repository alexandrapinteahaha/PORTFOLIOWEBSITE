"use client";

import { useState } from "react";

type AccordionItem = {
  question: string;
  answer: React.ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-ink/10">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left"
          >
            <span className="font-title text-base font-bold uppercase tracking-[0.1em] text-ink">
              {item.question}
            </span>
            <span className="ml-4 shrink-0 text-graphite transition-transform duration-300" style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
          </button>

          <div
            className="overflow-hidden transition-all duration-400 ease-in-out"
            style={{ maxHeight: open === i ? "600px" : "0px" }}
          >
            <div className="pb-6 pt-1">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
