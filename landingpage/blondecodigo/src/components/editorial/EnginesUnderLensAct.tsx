'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { FlutedEmeraldGlass } from '@/components/stage/FlutedEmeraldGlass';
import { VectorVsMeltLoupe } from '@/components/interactions/VectorVsMeltLoupe';
import { OpticalTelemetryText } from '@/components/interactions/OpticalTelemetryText';

export function EnginesUnderLensAct() {
  const { t } = useLocale();

  return (
    <section
      id="act-vector-engine"
      data-testid="act-4-engines-lens"
      className="relative z-10 py-20 sm:py-28 lg:py-36 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 space-y-12 sm:space-y-16"
    >
      {/* Section Header */}
      <div className="space-y-4 broadsheet-reading-shield p-5 sm:p-8 rounded-2xl border border-[#EAE2D3]/15">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE2D3]/20 font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase">
          <OpticalTelemetryText text={t.act4.kicker} />
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF29]" />
            <span className="text-[#EAE2D3]/80">ROYAL EMERALD REFRACTION // Z-1</span>
          </div>
        </div>

        <h2 className="font-display font-extrabold uppercase text-[#EAE2D3] act-headline-scale pt-2">
          <span>{t.act4.headline.before} </span>
          <em className="font-serifItalic italic font-normal text-[#CCFF29] capitalize px-1.5">
            {t.act4.headline.italicFlash}
          </em>{' '}
          <span className="block sm:inline">{t.act4.headline.after}</span>
        </h2>
      </div>

      {/* Two Coupled Engines Framed in Fluted Royal Emerald Architectural Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <FlutedEmeraldGlass
          intensity="strong"
          className="rounded-2xl p-6 sm:p-9"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t border-l border-[#CCFF29]/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-t border-r border-[#CCFF29]/60"
          />
          <div className="flex items-center justify-between font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase pb-4 mb-5 border-b border-[#EAE2D3]/15">
            <span className="font-bold">{t.act4.engine1Code}</span>
            <span className="text-[#EAE2D3]/75">01 // CREATORS & FOUNDERS</span>
          </div>
          <h3 className="font-display font-extrabold uppercase text-2xl sm:text-3xl lg:text-4xl text-[#EAE2D3] tracking-tight">
            {t.act4.engine1Title}
          </h3>
          <p className="mt-3 font-sans text-base sm:text-lg text-[#F5EFE4]/92 leading-relaxed">
            {t.act4.engine1Body}
          </p>
          <div className="mt-6 pt-4 border-t border-[#EAE2D3]/12 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.12em] text-[#CCFF29] uppercase">
            <span className="px-2.5 py-1 rounded bg-[#090B0A]/80 border border-[#CCFF29]/30">
              REMOTION REACT ENGINE
            </span>
            <span className="px-2.5 py-1 rounded bg-[#090B0A]/80 border border-[#CCFF29]/30">
              FFMPEG + LIBASS VECTOR
            </span>
            <span className="px-2.5 py-1 rounded bg-[#090B0A]/80 border border-[#CCFF29]/30">
              OPTICAL FLOW B-ROLL
            </span>
          </div>
        </FlutedEmeraldGlass>

        <FlutedEmeraldGlass
          intensity="strong"
          className="rounded-2xl p-6 sm:p-9"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t border-l border-[#CCFF29]/60"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-t border-r border-[#CCFF29]/60"
          />
          <div className="flex items-center justify-between font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase pb-4 mb-5 border-b border-[#EAE2D3]/15">
            <span className="font-bold">{t.act4.engine2Code}</span>
            <span className="text-[#EAE2D3]/75">02 // REAL PRODUCTS & BRANDS</span>
          </div>
          <h3 className="font-display font-extrabold uppercase text-2xl sm:text-3xl lg:text-4xl text-[#EAE2D3] tracking-tight">
            {t.act4.engine2Title}
          </h3>
          <p className="mt-3 font-sans text-base sm:text-lg text-[#F5EFE4]/92 leading-relaxed">
            {t.act4.engine2Body}
          </p>
          <div className="mt-6 pt-4 border-t border-[#EAE2D3]/12 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.12em] text-[#CCFF29] uppercase">
            <span className="px-2.5 py-1 rounded bg-[#090B0A]/80 border border-[#CCFF29]/30">
              SAM 2 ZERO-MELT LOCK
            </span>
            <span className="px-2.5 py-1 rounded bg-[#090B0A]/80 border border-[#CCFF29]/30">
              IC-LIGHT STUDIO RELIGHT
            </span>
            <span className="px-2.5 py-1 rounded bg-[#090B0A]/80 border border-[#CCFF29]/30">
              60FPS DETERMINISTIC AD
            </span>
          </div>
        </FlutedEmeraldGlass>
      </div>

      {/* INTERACTION #4: AI MELT VS DETERMINISTIC VECTOR LOUPE */}
      <FlutedEmeraldGlass
        intensity="medium"
        className="rounded-2xl p-4 sm:p-8 lg:p-10"
      >
        <VectorVsMeltLoupe />
      </FlutedEmeraldGlass>
    </section>
  );
}
