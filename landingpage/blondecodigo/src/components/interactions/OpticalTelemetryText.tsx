'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const [locked, setLocked] = useState(true);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timerId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          setLocked(false);
          timerId = window.setTimeout(() => {
            setLocked(true);
          }, 160);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  return (
    <span
      ref={spanRef}
      data-testid={testId}
      className={`inline-block transition-[opacity,filter,transform] duration-200 ease-out ${
        locked ? 'opacity-100 blur-0 translate-y-0' : 'opacity-65 blur-[1px] translate-y-[1px]'
      } ${className || ''}`}
    >
      {text}
    </span>
  );
}
