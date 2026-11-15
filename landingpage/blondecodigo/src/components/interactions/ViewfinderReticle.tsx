'use client';

import React, { useEffect, useRef, useState } from 'react';
import { scrollBridge } from '@/lib/scroll-bridge';

const CURSOR_LABELS: Record<string, string> = {
  default: '[ + ]',
  waitlist: '[ ↗ ENTER CIRCLE ]',
  blade: '[ ⇄ DRAG BLADE ]',
  loupe: '[ ⊕ INSPECT PIXELS ]',
  sound: '[ ♪ AUDIO ]',
};

export function ViewfinderReticle() {
  const reticleRef = useRef<HTMLDivElement>(null);
  const [cursorMode, setCursorMode] = useState<string>('default');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updatePointerCapability = () => {
      const isFine = mq.matches;
      scrollBridge.pointerFine = isFine;
      setEnabled(isFine);
    };
    updatePointerCapability();
    mq.addEventListener('change', updatePointerCapability);

    let mouseX = -100;
    let mouseY = -100;
    let curX = -100;
    let curY = -100;
    let rafId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update NDC for WebGL & spatial parallax
      scrollBridge.targetMouseX = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      scrollBridge.targetMouseY = -((e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);

      const targetEl = (e.target as HTMLElement | null)?.closest?.('[data-cursor]');
      const nextMode = targetEl?.getAttribute('data-cursor') || 'default';
      setCursorMode((prev) => (prev === nextMode ? prev : nextMode));
    };

    const loop = () => {
      curX += (mouseX - curX) * 0.32;
      curY += (mouseY - curY) * 0.32;
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0)`;
      }
      rafId = window.requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    rafId = window.requestAnimationFrame(loop);

    return () => {
      mq.removeEventListener('change', updatePointerCapability);
      window.removeEventListener('pointermove', handlePointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  const isHighlighted = cursorMode !== 'default';

  return (
    <div
      ref={reticleRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[60] -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center gap-2 select-none will-change-transform"
    >
      <div
        className={`relative flex items-center justify-center transition-all duration-150 ${
          isHighlighted
            ? 'w-7 h-7 border border-[#CCFF29] bg-[#090B0A]/80 rounded-full'
            : 'w-5 h-5'
        }`}
      >
        <span className="w-1 h-1 rounded-full bg-[#CCFF29]" />
        {!isHighlighted && (
          <>
            <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#EAE2D3]/60" />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-[#EAE2D3]/60" />
            <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-[#EAE2D3]/60" />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#EAE2D3]/60" />
          </>
        )}
      </div>
      <span
        className={`font-mono text-[10px] tracking-[0.14em] px-2 py-0.5 rounded transition-all duration-150 ${
          isHighlighted
            ? 'bg-[#CCFF29] text-[#090B0A] font-bold shadow-md'
            : 'bg-[#090B0A]/70 text-[#EAE2D3]/75 border border-[#EAE2D3]/15'
        }`}
      >
        {CURSOR_LABELS[cursorMode] || CURSOR_LABELS.default}
      </span>
    </div>
  );
}
