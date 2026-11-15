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
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE2D3]/20 font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase">
          <OpticalTelemetryText text={t.act4.kicker} />
          <div className="flex items-center gap-3">
            <img
              src="/assets/brand/blonde-ai-lockup-launch-royal.svg"
              alt=""
              aria-hidden="true"
              className="h-7 w-auto rounded border border-[#CCFF29]/25 hidden sm:block"
            />
            <span className="text-[#9CA39E]">ROYAL EMERALD REFRACTION // Z-1</span>
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
          className="rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase mb-4">
            <span>{t.act4.engine1Code}</span>
            <span>01 // CREATORS & FOUNDERS</span>
          </div>
          <h3 className="font-display font-extrabold uppercase text-2xl sm:text-3xl text-[#EAE2D3] tracking-tight">
            {t.act4.engine1Title}
          </h3>
          <p className="mt-3 font-sans text-base sm:text-lg text-[#F5EFE4]/90 leading-relaxed">
            {t.act4.engine1Body}
          </p>
        </FlutedEmeraldGlass>

        <FlutedEmeraldGlass
          intensity="strong"
          className="rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase mb-4">
            <span>{t.act4.engine2Code}</span>
            <span>02 // REAL PRODUCTS & BRANDS</span>
          </div>
          <h3 className="font-display font-extrabold uppercase text-2xl sm:text-3xl text-[#EAE2D3] tracking-tight">
            {t.act4.engine2Title}
          </h3>
          <p className="mt-3 font-sans text-base sm:text-lg text-[#F5EFE4]/90 leading-relaxed">
            {t.act4.engine2Body}
          </p>
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
