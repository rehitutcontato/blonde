'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';

export function VectorVsMeltLoupe() {
  const { t } = useLocale();
  const { playLoupeFocus, playShutter } = useStudioAudio();

  const stageRef = useRef<HTMLDivElement>(null);
  const [lensPos, setLensPos] = useState({ x: 64, y: 52 });
  const [inspectionMode, setInspectionMode] = useState<
    'loupe' | 'full-blonde' | 'full-generic'
  >('loupe');
  const [isActive, setIsActive] = useState(false);

  const updateLensFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const xPct = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const yPct = ((clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      setLensPos({
        x: Math.max(8, Math.min(92, xPct)),
        y: Math.max(10, Math.min(90, yPct)),
      });
    },
    []
  );

  const handlePointerEnter = () => {
    setIsActive(true);
    playLoupeFocus();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (inspectionMode !== 'loupe') return;
    updateLensFromPoint(e.clientX, e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsActive(true);
    playLoupeFocus();
    if (inspectionMode === 'loupe') {
      updateLensFromPoint(e.clientX, e.clientY);
    }
  };

  const clipPathStyle =
    inspectionMode === 'full-blonde'
      ? 'circle(150% at 50% 50%)'
      : inspectionMode === 'full-generic'
        ? 'circle(0% at 50% 50%)'
        : `circle(135px at ${lensPos.x}% ${lensPos.y}%)`;

  return (
    <div
      data-testid="interaction-4-vector-loupe"
      className="relative w-full space-y-4"
    >
      {/* Top Telemetry & Mobile/Accessibility Inspection Switch */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-[#CCFF29] uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF29]" />
          <span>{t.act4.i4.sectionKicker}</span>
        </div>

        {/* Accessible Mode Buttons (works for Mobile Tap, Keyboard & Desktop Override) */}
        <div
          role="group"
          aria-label="Pixel Integrity Inspection Mode"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            data-testid="i4-mode-loupe"
            aria-pressed={inspectionMode === 'loupe'}
            onClick={() => {
              setInspectionMode('loupe');
              playShutter();
            }}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase border transition-all ${
              inspectionMode === 'loupe'
                ? 'bg-[#CCFF29] text-[#090B0A] border-[#CCFF29] font-bold'
                : 'bg-[#090B0A]/60 text-[#EAE2D3] border-[#EAE2D3]/20 hover:border-[#CCFF29]/50'
            }`}
          >
            ⊕ {t.act4.i4.lensHint}
          </button>
          <button
            type="button"
            data-testid="i4-mode-generic"
            aria-pressed={inspectionMode === 'full-generic'}
            onClick={() => {
              setInspectionMode('full-generic');
              playShutter();
            }}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase border transition-all ${
              inspectionMode === 'full-generic'
                ? 'bg-red-500/90 text-white border-red-400 font-bold'
                : 'bg-[#090B0A]/60 text-[#EAE2D3]/80 border-[#EAE2D3]/20 hover:border-[#EAE2D3]/50'
            }`}
          >
            {t.act4.i4.toggleGeneric}
          </button>
          <button
            type="button"
            data-testid="i4-mode-blonde"
            aria-pressed={inspectionMode === 'full-blonde'}
            onClick={() => {
              setInspectionMode('full-blonde');
              playLoupeFocus();
            }}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase border transition-all ${
              inspectionMode === 'full-blonde'
                ? 'bg-[#CCFF29] text-[#090B0A] border-[#CCFF29] font-bold'
                : 'bg-[#090B0A]/60 text-[#EAE2D3]/80 border-[#EAE2D3]/20 hover:border-[#CCFF29]/50'
            }`}
          >
            {t.act4.i4.toggleBlonde}
          </button>
        </div>
      </div>

      {/* Main Optical Inspection Stage */}
      <div
        ref={stageRef}
        data-cursor="loupe"
        data-testid="i4-loupe-stage"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#13634C] bg-[#090B0A] shadow-[0_30px_90px_rgba(9,11,10,0.8)] select-none cursor-crosshair touch-pan-y"
      >
        {/* Viewfinder Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-3 z-30 w-3.5 h-3.5 border-t-2 border-l-2 border-[#EAE2D3]/50"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-3 z-30 w-3.5 h-3.5 border-t-2 border-r-2 border-[#CCFF29]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 z-30 w-3.5 h-3.5 border-b-2 border-l-2 border-[#EAE2D3]/50"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 z-30 w-3.5 h-3.5 border-b-2 border-r-2 border-[#CCFF29]"
        />

        {/* BASE PLATE: GENERIC AI SLOP FRAME (melted text & plastic wax mesh) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/assets/images/interaction4-ai-slop-frame.jpg"
            alt="Generic AI video frame with melted text artifacts"
            draggable={false}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B0A]/80 via-transparent to-[#090B0A]/40" />

          {/* Left Top Label: GENERIC AI VIDEO // TEXT MELT */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 px-3 py-1.5 rounded bg-[#090B0A]/90 border border-red-500/40">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.12em] text-[#EAE2D3]">
              {t.act4.i4.labelLeft}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 px-3 py-1.5 rounded bg-[#090B0A]/85 border border-red-500/30">
            <span className="font-mono text-[10px] tracking-[0.12em] text-red-300 uppercase">
              {t.act4.i4.slopStatus}
            </span>
          </div>
        </div>

        {/* REVEALED VECTOR LAYER: blonde AI DETERMINISTIC STUDIO FRAME + RAZOR-SHARP VECTOR OVERLAY */}
        <div
          data-testid="i4-vector-layer"
          style={{
            clipPath: clipPathStyle,
          }}
          className="absolute inset-0 w-full h-full transition-[clip-path] duration-75 ease-out"
        >
          <img
            src="/assets/images/interaction4-studio-clean-frame.jpg"
            alt="blonde AI deterministic studio plate with intact product and vector typography"
            draggable={false}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              inspectionMode === 'loupe' && isActive ? 'scale-[1.06]' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B0A]/70 via-transparent to-[#090B0A]/25" />

          {/* Right Top Label: blonde AI // DETERMINISTIC VECTOR ENGINE */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 px-3 py-1.5 rounded bg-[#0B4635]/95 border border-[#CCFF29]">
            <span className="w-2 h-2 rounded-full bg-[#CCFF29] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.12em] text-[#CCFF29] font-bold">
              {t.act4.i4.labelRight}
            </span>
          </div>

          {/* Deterministic FFmpeg + libass Vector Typography Overlay on Right Third (como-criar/05 section 2.2) */}
          <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 bg-[#090B0A]/88 border border-[#CCFF29]/80 rounded-lg p-3.5 sm:p-5 backdrop-blur-md shadow-[0_0_40px_rgba(9,11,10,0.85)] max-w-[220px] sm:max-w-[280px]">
            <div className="flex items-center justify-between gap-3 border-b border-[#EAE2D3]/15 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/brand/blonde-ai-mark-volt.svg"
                  alt="blonde AI emblem"
                  className="w-5 h-5"
                />
                <span className="font-mono text-[10px] tracking-[0.14em] text-[#CCFF29] uppercase">
                  VECTOR LOCKED
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#EAE2D3]/70 tabular-nums">
                00:04:12
              </span>
            </div>

            <div className="font-display font-extrabold text-3xl sm:text-5xl text-[#EAE2D3] tracking-tight leading-none tabular-nums">
              {t.act4.i4.vectorOverlayTitle}
            </div>
            <div className="mt-1 font-mono text-[10px] sm:text-xs font-bold tracking-[0.16em] text-[#CCFF29] uppercase">
              {t.act4.i4.vectorOverlaySub}
            </div>
            <p className="mt-2 font-mono text-[9px] sm:text-[10px] leading-relaxed text-[#EAE2D3]/80">
              {t.act4.i4.vectorOverlaySpec}
            </p>
          </div>

          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 px-3 py-1.5 rounded bg-[#090B0A]/90 border border-[#CCFF29]/50">
            <span className="font-mono text-[10px] tracking-[0.12em] text-[#CCFF29] uppercase">
              {t.act4.i4.cleanStatus}
            </span>
          </div>
        </div>

        {/* OPTICAL LOUPE RING (visible in 'loupe' mode) */}
        {inspectionMode === 'loupe' && (
          <div
            style={{
              left: `${lensPos.x}%`,
              top: `${lensPos.y}%`,
            }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 w-[270px] h-[270px] rounded-full border-2 border-[#CCFF29] shadow-[0_0_35px_rgba(204,255,41,0.35),inset_0_0_24px_rgba(204,255,41,0.2)] flex items-center justify-center"
          >
            {/* Inner millimeter reticle ring */}
            <div className="w-[252px] h-[252px] rounded-full border border-dashed border-[#EAE2D3]/40" />
            <span className="absolute -bottom-7 px-2.5 py-0.5 rounded bg-[#090B0A]/90 border border-[#CCFF29]/60 font-mono text-[9px] tracking-[0.14em] text-[#CCFF29] uppercase whitespace-nowrap">
              1.18x OPTICAL VECTOR LENS
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
