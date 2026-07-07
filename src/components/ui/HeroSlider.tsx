"use client";

import { useState, useEffect } from "react";

// Add your image paths here when ready, e.g. ["/images/print-1.jpg", "/images/print-2.jpg"]
const SLIDES: string[] = [];

// Placeholder shades shown when no images are added yet
const PLACEHOLDERS = ["bg-mist", "bg-stone-200", "bg-zinc-200"];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const count = SLIDES.length > 0 ? SLIDES.length : PLACEHOLDERS.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % count);
    }, 3500);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden">
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

      {/* Slide dots */}
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
