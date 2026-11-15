'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';
import { notifyPreloaderState } from '@/lib/scroll-bridge';

const INTRO_SEEN_KEY = 'blonde_intro_seen';

export function SystemImmersionGate() {
  const { t } = useLocale();
  const { enableSoundWithIris, disableSound } = useStudioAudio();

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'opening' | 'done'>('loading');
  const [reducedMotion, setReducedMotion] = useState(false);
  const closingRef = useRef(false);

  const finishPreloader = useCallback(
    (withSound: boolean) => {
      if (closingRef.current) return;
      closingRef.current = true;

      if (withSound) {
        enableSoundWithIris();
      } else {
        disableSound();
      }

      try {
        window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
      } catch {}

      notifyPreloaderState(true, false);
      setPhase('opening');
      const exitDuration = reducedMotion ? 220 : 620;
      window.setTimeout(() => {
        notifyPreloaderState(true, true);
        setPhase('done');
      }, exitDuration);
    },
    [enableSoundWithIris, disableSound, reducedMotion]
  );

  useEffect(() => {
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    setReducedMotion(isReduced);

    let seenBefore = false;
    try {
      seenBefore = window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
    } catch {}

    const targetDurationMs = isReduced ? 650 : seenBefore ? 600 : 1550;
    const maxTimeoutMs = 2150;
    const startMs = performance.now();

    let assetsReady = false;

    const fontsPromise =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready.catch(() => {})
        : Promise.resolve();

    const preloadImg = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    Promise.all([
      fontsPromise,
      preloadImg('/assets/images/matcap-liquid-chrome-volt.jpg'),
      preloadImg('/assets/images/hero-liquid-lens-studio.jpg'),
    ]).then(() => {
      assetsReady = true;
    });

    let rafId = 0;
    const tick = (now: number) => {
      if (closingRef.current) return;
      const elapsed = now - startMs;
      const timeRatio = Math.min(1, elapsed / targetDurationMs);
      // Smooth optical easing curve
      const eased = 1 - Math.pow(1 - timeRatio, 2.6);
      const cap = assetsReady || elapsed > maxTimeoutMs ? 100 : 92;
      const currentPct = Math.min(cap, Math.round(eased * 100));
      setProgress(currentPct);

      if (
        (currentPct >= 100 && elapsed >= targetDurationMs) ||
        elapsed >= maxTimeoutMs
      ) {
        setProgress(100);
        window.setTimeout(() => {
          finishPreloader(false);
        }, seenBefore ? 120 : 380);
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [finishPreloader]);

  if (phase === 'done') return null;

  const statusLog =
    progress <= 35
      ? t.preloader.log1
      : progress <= 70
        ? t.preloader.log2
        : t.preloader.log3;

  const paddedProgress = String(progress).padStart(3, '0');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="blonde AI System Immersion Preloader"
      data-testid="system-immersion-gate"
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#090B0A] text-[#EAE2D3] px-5 py-6 sm:px-10 sm:py-8 overflow-hidden transition-all ${
        phase === 'opening'
          ? reducedMotion
            ? 'pointer-events-none opacity-0 duration-200'
            : 'pointer-events-none opacity-0 backdrop-blur-0 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
          : 'opacity-100'
      }`}
    >
      {/* Top Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between text-[11px] sm:text-xs font-mono tracking-[0.14em] text-[#9CA39E]">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF29] animate-pulse" />
          <span className="text-[#EAE2D3]">blonde AI // GENESIS SYSTEM v0.5</span>
        </div>
        <div className="flex items-center gap-4 tabular-nums">
          <span className="hidden sm:inline text-[#9CA39E]">{statusLog}</span>
          <span
            data-testid="preloader-counter"
            className="text-[#CCFF29] font-bold text-xs sm:text-sm"
          >
            {paddedProgress}%
          </span>
        </div>
      </div>

      {/* Center Optical Iris ('O b Holofote' R=27u / R=13.5u geometry) + Kinetic Welcome Manifesto */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <div
          className={`relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            phase === 'opening' && !reducedMotion
              ? 'scale-[16] opacity-0'
              : 'scale-100 opacity-100'
          }`}
        >
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            {/* Outer millimeter focus ring */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#EAE2D3"
              strokeOpacity="0.16"
              strokeWidth="1"
              strokeDasharray="2 6"
              style={{
                transformOrigin: '60px 60px',
                transform: `rotate(${progress * 1.8}deg)`,
              }}
            />
            {/* Royal Emerald optical housing ring */}
            <circle
              cx="60"
              cy="60"
              r="44"
              fill="none"
              stroke="#0B4635"
              strokeOpacity="0.85"
              strokeWidth="1.5"
            />
            {/* Progress arc in Blonde Volt (#CCFF29) */}
            <circle
              cx="60"
              cy="60"
              r="44"
              fill="none"
              stroke="#CCFF29"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 * (1 - progress / 100)}
              style={{
                transformOrigin: '60px 60px',
                transform: 'rotate(-90deg)',
              }}
            />
            {/* Exact 'O b Holofote' Emblem Centered */}
            <g transform="translate(10, 10)">
              {/* 30deg Spotlight Beam Polygon */}
              <polygon
                points="21,41.17 21,19.08 35,11.00 35,33.09"
                fill="#CCFF29"
                fillOpacity={0.25 + (progress / 100) * 0.75}
              />
              {/* The 'b' Optical Iris R=27u / R=13.5u */}
              <path
                fillRule="evenodd"
                fill="#EAE2D3"
                fillOpacity={0.3 + (progress / 100) * 0.7}
                d="M 21,48.10 L 35,40.02 A 27,27 0 1 1 52,88 L 21,88 Z M 65.5,61 A 13.5,13.5 0 1 0 38.5,61 A 13.5,13.5 0 1 0 65.5,61 Z"
              />
            </g>
          </svg>
        </div>

        {/* Mobile telemetry stage log */}
        <p className="mt-4 sm:hidden font-mono text-[10px] tracking-[0.16em] text-[#9CA39E] uppercase">
          {statusLog}
        </p>

        {/* Split-line kinetic welcome manifesto */}
        <div className="mt-6 sm:mt-8 space-y-1 overflow-hidden">
          <p className="text-lg sm:text-2xl md:text-3xl font-sans font-medium tracking-tight text-[#EAE2D3] leading-snug">
            {t.preloader.line1}{' '}
            <span className="font-serifItalic italic font-normal text-[#CCFF29] text-2xl sm:text-3xl md:text-4xl px-1">
              {t.preloader.line2Italic}
            </span>{' '}
            {t.preloader.line2After}
          </p>
        </div>
      </div>

      {/* Bottom Interactive Sound / Silent Entry Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pt-4">
        <button
          type="button"
          data-testid="preloader-enter-sound"
          onClick={() => finishPreloader(true)}
          className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full border border-[#CCFF29] bg-[#CCFF29]/10 hover:bg-[#CCFF29] text-[#CCFF29] hover:text-[#090B0A] font-mono text-xs tracking-[0.14em] uppercase transition-all duration-200 flex items-center justify-center gap-2.5"
        >
          <span className="inline-flex items-end gap-0.5 h-3" aria-hidden="true">
            <span className="w-0.5 h-2 bg-current animate-pulse" />
            <span className="w-0.5 h-3 bg-current animate-pulse" />
            <span className="w-0.5 h-1.5 bg-current animate-pulse" />
          </span>
          <span>[ {t.preloader.ctaSound} ]</span>
        </button>

        <button
          type="button"
          data-testid="preloader-enter-silent"
          onClick={() => finishPreloader(false)}
          className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-full border border-[#EAE2D3]/15 hover:border-[#EAE2D3]/40 text-[#9CA39E] hover:text-[#EAE2D3] font-mono text-xs tracking-[0.14em] uppercase transition-colors"
        >
          {t.preloader.skip}
        </button>
      </div>
    </div>
  );
}
