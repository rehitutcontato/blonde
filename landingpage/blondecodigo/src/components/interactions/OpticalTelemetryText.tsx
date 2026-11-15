'use client';

import React, { useEffect, useRef, useState } from 'react';

const SCRAMBLE_GLYPHS = '01//:\\_#+=<>[]';

interface OpticalTelemetryTextProps {
  text: string;
  className?: string;
  testId?: string;
}

export function OpticalTelemetryText({
  text,
  className,
  testId,
}: OpticalTelemetryTextProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const hasScrambledRef = useRef(false);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasScrambledRef.current) {
          hasScrambledRef.current = true;
          const start = performance.now();
          const duration = 280;

          const step = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            if (p >= 1) {
              setDisplay(text);
              return;
            }
            const lockedCount = Math.floor(p * text.length);
            let out = '';
            for (let i = 0; i < text.length; i++) {
              const ch = text[i];
              if (i < lockedCount || ch === ' ' || ch === '·' || ch === '/') {
                out += ch;
              } else {
                out +=
                  SCRAMBLE_GLYPHS[(i + Math.floor(p * 18)) % SCRAMBLE_GLYPHS.length];
              }
            }
            setDisplay(out);
            rafId = window.requestAnimationFrame(step);
          };

          rafId = window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [text]);

  return (
    <span ref={spanRef} data-testid={testId} className={className}>
      {display}
    </span>
  );
}
