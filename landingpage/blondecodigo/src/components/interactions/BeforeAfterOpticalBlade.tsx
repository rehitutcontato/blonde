'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';

type BladeMode = 'creator' | 'product';

export function BeforeAfterOpticalBlade() {
  const { t } = useLocale();
  const { playBladeTick, playShutter } = useStudioAudio();

  const [mode, setMode] = useState<BladeMode>('creator');
  const [split, setSplit] = useState(50);
  const targetSplitRef = useRef(50);
  const currentSplitRef = useRef(50);
  const lastStepBucketRef = useRef(6);
  const isDraggingRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Smooth lerp (0.18 per como-criar/05) for liquid blade physics
  useEffect(() => {
    let rafId = 0;
    const animateBlade = () => {
      const diff = targetSplitRef.current - currentSplitRef.current;
      if (Math.abs(diff) > 0.05) {
        currentSplitRef.current += diff * 0.18;
        const rounded = Number(currentSplitRef.current.toFixed(2));
        setSplit(rounded);

        // Trigger bladeTick every 8% crossing
        const bucket = Math.floor(rounded / 8);
        if (bucket !== lastStepBucketRef.current) {
          lastStepBucketRef.current = bucket;
          playBladeTick(rounded);
        }
      }
      rafId = window.requestAnimationFrame(animateBlade);
    };
    rafId = window.requestAnimationFrame(animateBlade);
    return () => window.cancelAnimationFrame(rafId);
  }, [playBladeTick]);

  const updateFromClientX = useCallback((clientX: number) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const rawPct = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100;
    const clamped = Math.max(4, Math.min(96, rawPct));
    targetSplitRef.current = clamped;
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let nextVal: number | null = null;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextVal = Math.max(4, Math.round(targetSplitRef.current - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextVal = Math.min(96, Math.round(targetSplitRef.current + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextVal = 10;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextVal = 90;
    }

    if (nextVal !== null) {
      targetSplitRef.current = nextVal;
      currentSplitRef.current = nextVal;
      setSplit(nextVal);
      playBladeTick(nextVal);
    }
  };

  const beforeImg =
    mode === 'creator'
      ? '/assets/images/interaction2-before-creator.jpg'
      : '/assets/images/interaction2-before-product.jpg';
  const afterImg =
    mode === 'creator'
      ? '/assets/images/interaction2-after-creator.jpg'
      : '/assets/images/interaction2-after-product.jpg';

  const beforeBadge =
    mode === 'creator' ? t.act3.i2.beforeBadge : t.act3.i2.beforeProductBadge;
  const afterBadge =
    mode === 'creator' ? t.act3.i2.afterBadge : t.act3.i2.afterProductBadge;

  return (
    <div
      data-testid="interaction-2-optical-blade"
      className="relative w-full"
    >
      {/* Top Bar: Kicker + Mode Switcher Tabs (01 / CREATOR & FOUNDER vs 02 / REAL PRODUCT) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-[#090B0A]/75 uppercase">
          <span className="inline-block w-2 h-2 bg-[#0B4635]" />
          <span>{t.act3.i2.sectionKicker}</span>
        </div>

        <div
          role="tablist"
          aria-label="Before and After Comparison Modes"
          className="inline-flex rounded-full p-1 bg-[#090B0A] border border-[#090B0A]/20 self-start md:self-auto"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'creator'}
            data-testid="i2-tab-creator"
            onClick={() => {
              setMode('creator');
              playShutter();
            }}
            className={`min-h-[38px] px-4 py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase transition-all ${
              mode === 'creator'
                ? 'bg-[#CCFF29] text-[#090B0A] font-bold'
                : 'text-[#EAE2D3]/75 hover:text-[#EAE2D3]'
            }`}
          >
            {t.act3.i2.tabCreator}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'product'}
            data-testid="i2-tab-product"
            onClick={() => {
              setMode('product');
              playShutter();
            }}
            className={`min-h-[38px] px-4 py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase transition-all ${
              mode === 'product'
                ? 'bg-[#CCFF29] text-[#090B0A] font-bold'
                : 'text-[#EAE2D3]/75 hover:text-[#EAE2D3]'
            }`}
          >
            {t.act3.i2.tabProduct}
          </button>
        </div>
      </div>

      {/* Main 16:9 Viewfinder Comparison Stage */}
      <div className="relative p-1.5 sm:p-2.5 bg-[#090B0A] rounded-xl shadow-[0_28px_80px_rgba(9,11,10,0.45)] border border-[#090B0A]">
        {/* Viewfinder Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-3 z-30 w-3.5 h-3.5 border-t-2 border-l-2 border-[#CCFF29]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 z-30 w-3.5 h-3.5 border-t-2 border-r-2 border-[#CCFF29]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 z-30 w-3.5 h-3.5 border-b-2 border-l-2 border-[#CCFF29]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 z-30 w-3.5 h-3.5 border-b-2 border-r-2 border-[#CCFF29]"
        />

        <div
          ref={stageRef}
          role="slider"
          tabIndex={0}
          aria-label={t.act3.i2.dragHint}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          data-cursor="blade"
          data-testid="i2-slider-stage"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-lg select-none cursor-ew-resize touch-pan-y focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CCFF29]"
        >
          {/* LAYER 1: BEFORE (Full width & height underneath) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={beforeImg}
              alt="Raw unedited input footage"
              draggable={false}
              className="w-full h-full object-cover filter saturate-[0.75] contrast-[0.92]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090B0A]/80 via-transparent to-[#090B0A]/45" />

            {/* Before Telemetry HUD */}
            <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 px-3 py-1.5 rounded bg-[#090B0A]/85 border border-[#9CA39E]/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.12em] text-[#EAE2D3]">
                {beforeBadge}
              </span>
            </div>

            {/* Dead air waveform indicator on Before side */}
            <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 right-1/2 pr-4 hidden sm:flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-[#181E1B]/90 overflow-hidden flex items-center px-1">
                <div className="h-0.5 w-full bg-[#9CA39E]/35" />
              </div>
              <span className="font-mono text-[10px] text-[#9CA39E]">
                FLAT WAVE
              </span>
            </div>
          </div>

          {/* LAYER 2: AFTER (Full width & height, clipped via clip-path: inset(0 0 0 ${split}%) — zero image distortion!) */}
          <div
            data-testid="i2-after-layer"
            style={{
              clipPath: `inset(0 0 0 ${split}%)`,
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={afterImg}
              alt="blonde AI studio master output"
              draggable={false}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090B0A]/75 via-transparent to-[#090B0A]/30" />

            {/* After Telemetry HUD */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 px-3 py-1.5 rounded bg-[#0B4635]/90 border border-[#CCFF29]/60 backdrop-blur-sm shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#CCFF29] animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.12em] text-[#CCFF29] font-bold">
                {afterBadge}
              </span>
            </div>

            {/* Live Vector Editorial Subtitle Burn-in Preview on After Side */}
            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 max-w-[75%] text-right pointer-events-none">
              <div className="inline-block px-3.5 py-2 rounded bg-[#090B0A]/85 border-l-2 border-[#CCFF29] backdrop-blur-md">
                <p className="font-display font-extrabold uppercase tracking-tight text-sm sm:text-xl md:text-2xl text-[#EAE2D3] leading-none">
                  {mode === 'creator'
                    ? t.act3.i2.creatorOverlayTitle
                    : t.act3.i2.productOverlayTitle}{' '}
                  <span className="font-serifItalic italic font-normal text-[#CCFF29] capitalize">
                    {mode === 'creator'
                      ? t.act3.i2.creatorOverlayTag
                      : t.act3.i2.productOverlayTag}
                  </span>
                </p>
                <p className="mt-1 font-mono text-[9px] sm:text-[10px] tracking-[0.16em] text-[#CCFF29]/90 uppercase">
                  FFMPEG DETERMINISTIC VECTOR · 60FPS LOCKED
                </p>
              </div>
            </div>
          </div>

          {/* THE OPTICAL BLADE DIVIDER */}
          <div
            style={{ left: `${split}%` }}
            className="pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2 flex flex-col items-center justify-center"
          >
            {/* 2px Blonde Volt Glowing Blade Line */}
            <div className="w-[2px] h-full bg-[#CCFF29] shadow-[0_0_18px_#CCFF29,0_0_4px_#FFFFFF]" />

            {/* Tactile Chrome & Volt Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
              <div className="w-11 h-11 rounded-full bg-[#121614] border-2 border-[#CCFF29] shadow-[0_0_25px_rgba(204,255,41,0.55)] flex items-center justify-center text-[#CCFF29] font-mono text-sm font-bold">
                ⇄
              </div>
              <span className="px-2 py-0.5 rounded bg-[#090B0A]/90 border border-[#CCFF29]/40 font-mono text-[9px] tracking-[0.14em] text-[#CCFF29] whitespace-nowrap uppercase">
                {t.act3.i2.dragHint} · {Math.round(split)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
