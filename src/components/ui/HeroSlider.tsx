"use client";

import { useState, useEffect } from "react";

// Add your image paths here when ready, e.g. ["/images/print-club-1.jpg", ...]
const SLIDES: string[] = [];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (SLIDES.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 bg-mist overflow-hidden">
      {SLIDES.length === 0 && <div className="absolute inset-0 bg-mist" />}
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={[
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000",
            i === current ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
