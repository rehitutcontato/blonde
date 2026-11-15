'use client';

import React, { useEffect, useRef } from 'react';
import { scrollBridge } from '@/lib/scroll-bridge';

const CROWD_CARDS = Array.from({ length: 36 }, (_, idx) => {
  const col = idx % 9;
  const row = Math.floor(idx / 9);
  const baseX = (col - 4) * 11.5 + (row % 2 === 0 ? -2.5 : 2.5);
  const baseY = (row - 1.5) * 22 + ((idx * 7) % 9) - 4;
  const depth = 0.4 + ((idx * 13) % 10) * 0.06;
  return { id: idx, baseX, baseY, depth };
});

export function GreyCrowdField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId = 0;

    const animate = () => {
      const progress = scrollBridge.scrollProgress;
      const mx = scrollBridge.smoothMouseX;
      const my = scrollBridge.smoothMouseY;

      if (containerRef.current) {
        // Dissolve the grey crowd as scroll advances past Hero into Act II
        const heroFade = Math.max(0, 1 - progress * 4.2);
        containerRef.current.style.opacity = String(heroFade.toFixed(3));
        containerRef.current.style.transform = `translate3d(${(mx * -8).toFixed(2)}px, ${(my * -8 - progress * 180).toFixed(2)}px, 0)`;
      }

      // Spherical repulsion around center & cursor
      if (progress < 0.28) {
        const cursorPctX = mx * 36;
        const cursorPctY = -my * 36;

        for (let i = 0; i < CROWD_CARDS.length; i++) {
          const el = cardsRef.current[i];
          if (!el) continue;
          const card = CROWD_CARDS[i];
          const dx = card.baseX - cursorPctX;
          const dy = card.baseY - cursorPctY;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

          // Center spotlight repulsion + cursor repulsion
          const centerDist = Math.sqrt(
            card.baseX * card.baseX + card.baseY * card.baseY
          );
          const centerRepel = Math.max(0, (34 - centerDist) / 34);
          const cursorRepel = Math.max(0, (26 - dist) / 26);
          const totalRepel = Math.min(1, centerRepel * 0.75 + cursorRepel * 0.85);

          const pushX = (dx / dist) * totalRepel * 28 * card.depth;
          const pushY = (dy / dist) * totalRepel * 22 * card.depth;
          const alpha = Math.max(0.03, (1 - totalRepel * 0.82) * 0.18 * card.depth);

          el.style.opacity = alpha.toFixed(3);
          el.style.transform = `translate3d(${pushX.toFixed(1)}px, ${pushY.toFixed(1)}px, 0) scale(${(0.85 + card.depth * 0.25 - totalRepel * 0.18).toFixed(2)})`;
        }
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Ghost 9:16 Grey Crowd Frames that dissolve away from the central Liquid Metal Spotlight */}
      <div className="relative w-full h-full">
        {CROWD_CARDS.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            style={{
              left: `${50 + card.baseX}%`,
              top: `${50 + card.baseY}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-14 sm:w-20 aspect-[9/16] rounded-[3px] border border-[#EAE2D3]/10 bg-[#2A2E2C]/35 backdrop-blur-[1px] flex flex-col justify-between p-1.5 transition-none"
          >
            <div className="w-2/3 h-1 bg-[#9CA39E]/25 rounded-full" />
            <div className="w-full h-5 rounded-[2px] bg-[#181E1B]/50 border border-[#9CA39E]/10" />
            <div className="space-y-1">
              <div className="w-full h-0.5 bg-[#9CA39E]/20" />
              <div className="w-1/2 h-0.5 bg-[#9CA39E]/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
