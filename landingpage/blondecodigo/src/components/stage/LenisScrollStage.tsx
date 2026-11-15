'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { computeActiveAct, scrollBridge } from '@/lib/scroll-bridge';

export function LenisScrollStage({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const updateScrollMetrics = (scrollY: number, velocity = 0) => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      scrollBridge.scrollY = scrollY;
      scrollBridge.scrollProgress = progress;
      scrollBridge.scrollVelocity = velocity;
      scrollBridge.activeAct = computeActiveAct(progress);
    };

    if (prefersReducedMotion) {
      const onNativeScroll = () => {
        updateScrollMetrics(window.scrollY, 0);
      };
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      onNativeScroll();
      return () => window.removeEventListener('scroll', onNativeScroll);
    }

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
    });

    lenis.on('scroll', (e: { scroll: number; velocity: number }) => {
      updateScrollMetrics(e.scroll, e.velocity);
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    updateScrollMetrics(window.scrollY, 0);
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
