'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';
import { scrollBridge } from '@/lib/scroll-bridge';

export function VectorVsMeltLoupe() {
  const { t } = useLocale();
  const { playLoupeFocus, playShutter } = useStudioAudio();

  const stageRef = useRef<HTMLDivElement>(null);
  const [lensPos, setLensPos] = useState({ x: 70, y: 56 });
  const [inspectionMode, setInspectionMode] = useState<
    'loupe' | 'full-blonde' | 'full-generic'
  >('loupe');
  const [isActive, setIsActive] = useState(false);
  const [loupeRadiusPx, setLoupeRadiusPx] = useState(136);
  const isPointerDownRef = useRef(false);

  // Dynamically size the optical loupe ring so its diameter is always strictly smaller than the stage height on mobile & desktop
  useEffect(() => {
    const updateLoupeSize = () => {
      if (typeof window === 'undefined') return;
      const stageEl = stageRef.current;
      const stageH = stageEl?.getBoundingClientRect().height || 260;
      const maxAllowedRadius = Math.floor(Math.min(stageH * 0.36, window.innerWidth < 640 ? 68 : 144));
      setLoupeRadiusPx(Math.max(48, maxAllowedRadius));
    };
    updateLoupeSize();
    window.addEventListener('resize', updateLoupeSize, { passive: true });
    return () => window.removeEventListener('resize', updateLoupeSize);
  }, []);

  // Subtle desktop pointer-fine eye-gaze 3D perspective (como-criar/04 section 3.2)
  useEffect(() => {
    let rafId = 0;
    const updateTilt = () => {
      if (
        stageRef.current &&
        scrollBridge.pointerFine &&
        !isPointerDownRef.current
      ) {
        const rx = (-scrollBridge.smoothMouseY * 1.0).toFixed(2);
        const ry = (scrollBridge.smoothMouseX * 1.3).toFixed(2);
        stageRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      rafId = window.requestAnimationFrame(updateTilt);
    };
    rafId = window.requestAnimationFrame(updateTilt);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const updateLensFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const xPct = ((clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const yPct = ((clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      setLensPos({
        x: Math.max(10, Math.min(90, xPct)),
        y: Math.max(12, Math.min(88, yPct)),
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
    if (e.pointerType === 'touch' && !isPointerDownRef.current) return;
    updateLensFromPoint(e.clientX, e.clientY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    setIsActive(true);
    playLoupeFocus();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    if (inspectionMode === 'loupe') {
      updateLensFromPoint(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const clipPathStyle =
    inspectionMode === 'full-blonde'
      ? 'circle(150% at 50% 50%)'
      : inspectionMode === 'full-generic'
        ? 'circle(0% at 50% 50%)'
        : `circle(${loupeRadiusPx}px at ${lensPos.x}% ${lensPos.y}%)`;

  const loupeDiameter = loupeRadiusPx * 2;

  return (
    <div
      data-testid="interaction-4-vector-loupe"
      className="relative w-full space-y-4"
    >
      {/* Top Telemetry & Mobile/Accessibility Inspection Switch (>= 44x44px touch targets) */}
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
            className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase border transition-all ${
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
            className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase border transition-all ${
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
            className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase border transition-all ${
              inspectionMode === 'full-blonde'
                ? 'bg-[#CCFF29] text-[#090B0A] border-[#CCFF29] font-bold'
                : 'bg-[#090B0A]/60 text-[#EAE2D3]/80 border-[#EAE2D3]/20 hover:border-[#CCFF29]/50'
            }`}
          >
            {t.act4.i4.toggleBlonde}
          </button>
        </div>
      </div>

      {/* Main Optical Inspection Stage (4:3 on mobile for clean vertical separation, 16:9 on sm+) */}
      <div
        ref={stageRef}
        data-cursor="loupe"
        data-testid="i4-loupe-stage"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#13634C] bg-[#090B0A] shadow-[0_30px_90px_rgba(9,11,10,0.8)] select-none cursor-crosshair touch-pan-y transition-transform duration-150"
      >
        {/* Viewfinder Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30 w-3.5 h-3.5 border-t-2 border-l-2 border-[#EAE2D3]/50"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 w-3.5 h-3.5 border-t-2 border-r-2 border-[#CCFF29]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-30 w-3.5 h-3.5 border-b-2 border-l-2 border-[#EAE2D3]/50"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-30 w-3.5 h-3.5 border-b-2 border-r-2 border-[#CCFF29]"
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
          <div className="absolute top-2 left-2 sm:top-5 sm:left-5 flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-[#090B0A]/90 border border-red-500/40 max-w-[46%]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 shrink-0 rounded-full bg-red-500" />
            <span className="font-mono text-[9px] sm:text-xs tracking-[0.08em] sm:tracking-[0.12em] text-[#EAE2D3] truncate">
              {t.act4.i4.labelLeft}
            </span>
          </div>

          <div className="absolute bottom-2 left-2 sm:bottom-5 sm:left-5 px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-[#090B0A]/85 border border-red-500/30 max-w-[46%]">
            <span className="block font-mono text-[8px] sm:text-[10px] tracking-[0.08em] sm:tracking-[0.12em] text-red-300 uppercase truncate">
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
          <div className="absolute top-2 right-2 sm:top-5 sm:right-5 flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-[#0B4635]/95 border border-[#CCFF29] max-w-[48%]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 shrink-0 rounded-full bg-[#CCFF29] animate-pulse" />
            <span className="font-mono text-[9px] sm:text-xs tracking-[0.08em] sm:tracking-[0.12em] text-[#CCFF29] font-bold truncate">
              {t.act4.i4.labelRight}
            </span>
          </div>

          {/* Deterministic FFmpeg + libass Vector Typography Overlay on Right Third (compact on mobile so zero overlap with top/bottom badges!) */}
          <div className="absolute right-2.5 sm:right-8 top-1/2 -translate-y-1/2 bg-[#090B0A]/90 border border-[#CCFF29]/80 rounded-lg p-2 sm:p-5 backdrop-blur-md shadow-[0_0_40px_rgba(9,11,10,0.85)] max-w-[165px] sm:max-w-[280px]">
            <div className="flex items-center justify-between gap-2 border-b border-[#EAE2D3]/15 pb-1 sm:pb-2 mb-1 sm:mb-2.5">
              <div className="flex items-center gap-1.5">
                <img
                  src="/assets/brand/blonde-ai-mark-volt.svg"
                  alt="blonde AI emblem"
                  className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                />
                <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.12em] text-[#CCFF29] uppercase">
                  VECTOR LOCKED
                </span>
              </div>
              <span className="font-mono text-[8px] sm:text-[10px] text-[#EAE2D3]/70 tabular-nums">
                00:04:12
              </span>
            </div>

            <div className="font-display font-extrabold text-2xl sm:text-5xl text-[#EAE2D3] tracking-tight leading-none tabular-nums">
              {t.act4.i4.vectorOverlayTitle}
            </div>
            <div className="mt-0.5 sm:mt-1 font-mono text-[8px] sm:text-xs font-bold tracking-[0.12em] sm:tracking-[0.16em] text-[#CCFF29] uppercase">
              {t.act4.i4.vectorOverlaySub}
            </div>
            <p className="hidden sm:block mt-2 font-mono text-[10px] leading-relaxed text-[#EAE2D3]/80">
              {t.act4.i4.vectorOverlaySpec}
            </p>
          </div>

          <div className="absolute bottom-2 right-2 sm:bottom-5 sm:right-5 px-2 py-1 sm:px-3 sm:py-1.5 rounded bg-[#090B0A]/90 border border-[#CCFF29]/50 max-w-[48%]">
            <span className="block font-mono text-[8px] sm:text-[10px] tracking-[0.08em] sm:tracking-[0.12em] text-[#CCFF29] uppercase truncate">
              {t.act4.i4.cleanStatus}
            </span>
          </div>
        </div>

        {/* OPTICAL LOUPE RING (dynamically sized so loupeDiameter < stageHeight at all viewports) */}
        {inspectionMode === 'loupe' && (
          <div
            style={{
              left: `${lensPos.x}%`,
              top: `${lensPos.y}%`,
              width: `${loupeDiameter}px`,
              height: `${loupeDiameter}px`,
            }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#CCFF29] shadow-[0_0_35px_rgba(204,255,41,0.35),inset_0_0_24px_rgba(204,255,41,0.2)] flex items-center justify-center"
          >
            {/* Inner millimeter reticle ring */}
            <div
              style={{
                width: `${Math.max(20, loupeDiameter - 14)}px`,
                height: `${Math.max(20, loupeDiameter - 14)}px`,
              }}
              className="rounded-full border border-dashed border-[#EAE2D3]/40"
            />
            <span className="hidden sm:inline-block absolute -bottom-7 px-2.5 py-0.5 rounded bg-[#090B0A]/90 border border-[#CCFF29]/60 font-mono text-[9px] tracking-[0.14em] text-[#CCFF29] uppercase whitespace-nowrap">
              1.18x OPTICAL VECTOR LENS
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
