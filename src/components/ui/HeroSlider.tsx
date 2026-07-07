"use client";

import { useState, useEffect, useCallback } from "react";

// Add your image paths here when ready, e.g. ["/images/print-1.jpg", "/images/print-2.jpg"]
const SLIDES: string[] = [];

const PLACEHOLDERS = ["bg-mist", "bg-stone-200", "bg-zinc-200"];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const count = SLIDES.length > 0 ? SLIDES.length : PLACEHOLDERS.length;

  const prev = useCallback(() => setCurrent((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % count), [count]);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Slides */}
      {SLIDES.length > 0
        ? SLIDES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={[
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
                i === current ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          ))
        : PLACEHOLDERS.map((cls, i) => (
            <div
              key={cls}
              className={[
                "absolute inset-0 transition-opacity duration-1000",
                cls,
                i === current ? "opacity-100" : "opacity-0",
              ].join(" ")}
            />
          ))}

      {/* Left arrow */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center border border-ink/20 bg-chalk/70 text-ink backdrop-blur-sm transition hover:bg-chalk"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center border border-ink/20 bg-chalk/70 text-ink backdrop-blur-sm transition hover:bg-chalk"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={[
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-6 bg-ink" : "w-1.5 bg-ink/30",
            ].join(" ")}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
