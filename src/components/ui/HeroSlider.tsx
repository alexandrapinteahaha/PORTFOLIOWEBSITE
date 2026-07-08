"use client";

import { useState, useEffect, useCallback } from "react";

// Add more image paths here as new prints are released
const SLIDES: string[] = ["/print-club-feature.png"];

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
                "absolute inset-0 w-full h-full object-cover scale-110 blur-[6px] transition-opacity duration-1000",
                i === current ? "opacity-70" : "opacity-0",
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

      {/* Left arrow — no box, just the icon */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 text-white/80 transition hover:text-white"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 5L9 14l9 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Right arrow — no box, just the icon */}
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 text-white/80 transition hover:text-white"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 5l9 9-9 9" strokeLinecap="round" strokeLinejoin="round" />
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
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/40",
            ].join(" ")}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
