'use client';

import React, { useRef } from 'react';
import clsx from 'clsx';
import { WHATSAPP_WAITLIST_URL } from '@/lib/phase-gate';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';

interface MagneticWaitlistButtonProps {
  label: string;
  variant?: 'volt' | 'obsidian' | 'emerald' | 'compact';
  className?: string;
  testId?: string;
}

export function MagneticWaitlistButton({
  label,
  variant = 'volt',
  className,
  testId,
}: MagneticWaitlistButtonProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const { playWaitlistPulse, playShutter } = useStudioAudio();

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType === 'touch' || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const shiftX = Math.max(-8, Math.min(8, relX * 0.16));
    const shiftY = Math.max(-6, Math.min(6, relY * 0.22));
    anchorRef.current.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`;
  };

  const handlePointerLeave = () => {
    if (!anchorRef.current) return;
    anchorRef.current.style.transform = 'translate3d(0px, 0px, 0)';
  };

  const variantClasses =
    variant === 'volt'
      ? 'bg-[#CCFF29] text-[#090B0A] border border-[#CCFF29] hover:bg-[#D4FF33] shadow-[0_0_35px_rgba(204,255,41,0.28)] px-7 py-4 text-xs sm:text-sm font-bold'
      : variant === 'obsidian'
        ? 'bg-[#090B0A] text-[#CCFF29] border border-[#090B0A] hover:border-[#0B4635] hover:bg-[#121614] px-7 py-4 text-xs sm:text-sm font-bold shadow-[0_14px_34px_rgba(9,11,10,0.28)]'
        : variant === 'emerald'
          ? 'bg-[#0B4635] text-[#EAE2D3] border border-[#CCFF29]/50 hover:border-[#CCFF29] hover:text-[#CCFF29] px-6 py-3.5 text-xs font-semibold'
          : 'bg-[#CCFF29] text-[#090B0A] border border-[#CCFF29] hover:bg-[#D4FF33] px-4 py-2 text-[11px] font-bold';

  return (
    <a
      ref={anchorRef}
      href={WHATSAPP_WAITLIST_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="waitlist"
      data-testid={testId}
      onPointerEnter={() => playShutter()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={() => playWaitlistPulse()}
      className={clsx(
        'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-mono uppercase tracking-[0.12em] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none min-h-[44px]',
        variantClasses,
        className
      )}
    >
      {/* 30deg Spotlight Sweep on Hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-30deg]"
      />
      <span className="relative z-10 flex items-center gap-2">
        <span
          aria-hidden="true"
          className={clsx(
            'inline-block w-1.5 h-1.5 rounded-full',
            variant === 'obsidian' ? 'bg-[#CCFF29]' : 'bg-[#090B0A]'
          )}
        />
        <span>{label}</span>
      </span>
    </a>
  );
}
