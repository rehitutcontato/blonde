'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { OpticalTelemetryText } from '@/components/interactions/OpticalTelemetryText';
import { MagneticWaitlistButton } from '@/components/interactions/MagneticWaitlistButton';

export function VisionariesCastAct() {
  const { t } = useLocale();

  return (
    <section
      id="act-visionaries-cast"
      data-testid="act-5-cast"
      className="relative z-10 py-20 sm:py-28 lg:py-36 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 space-y-10 sm:space-y-14"
    >
      {/* Top Broadsheet Header with Protective Studio Shield */}
      <div className="space-y-4 broadsheet-reading-shield p-5 sm:p-8 rounded-2xl border border-[#EAE2D3]/15">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE2D3]/20 font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF29]" />
            <OpticalTelemetryText text={t.act5.kicker} />
          </div>
          <span className="text-[#EAE2D3]/75">DOSSIER // ICP ARCHITECTURE</span>
        </div>

        <h2 className="font-display font-extrabold uppercase text-[#EAE2D3] act-headline-scale pt-2">
          <span>{t.act5.headline.before} </span>
          <em className="font-serifItalic italic font-normal text-[#CCFF29] capitalize px-1.5">
            {t.act5.headline.italicFlash}
          </em>{' '}
          {t.act5.headline.after && <span>{t.act5.headline.after}</span>}
        </h2>
      </div>

      {/* Asymmetric Broadsheet Dossier Modules: 01 Core Cast (7 cols) vs 02 Coupled Verticals (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Column 01: Core Focus (Creators, Founders & Infoproducers) */}
        <article className="relative lg:col-span-7 p-6 sm:p-10 rounded-2xl bg-[#0B0F0D]/95 border border-[#CCFF29]/45 backdrop-blur-2xl flex flex-col justify-between space-y-8 shadow-[0_32px_90px_rgba(0,0,0,0.92)] overflow-hidden">
          {/* Viewfinder Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#CCFF29]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#CCFF29]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3.5 left-3.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#CCFF29]/50"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#CCFF29]/50"
          />

          <div className="space-y-6">
            {/* Architectural Dossier Header Bar */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#EAE2D3]/15">
              <div className="flex items-center gap-2.5 font-mono text-xs tracking-[0.12em] text-[#CCFF29] uppercase font-bold">
                <span className="w-2 h-2 shrink-0 rounded-full bg-[#CCFF29] animate-pulse" />
                <span>{t.act5.col1Kicker}</span>
              </div>
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#CCFF29]/25 leading-none select-none">
                01
              </span>
            </div>

            <h3 className="font-display font-extrabold uppercase text-3xl sm:text-4xl lg:text-[2.75rem] text-[#EAE2D3] tracking-tight leading-[0.96]">
              {t.act5.col1Title}
            </h3>

            <p className="font-sans text-base sm:text-lg text-[#EAE2D3]/92 leading-relaxed max-w-[60ch]">
              {t.act5.col1Body}
            </p>
          </div>

          <div className="pt-6 border-t border-[#EAE2D3]/15 flex flex-wrap gap-2.5">
            {t.act5.col1Tags.map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded bg-[#121815] border border-[#CCFF29]/35 font-mono text-[10px] sm:text-[11px] tracking-[0.12em] text-[#CCFF29] uppercase font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>

        {/* Column 02: Coupled Verticals (Physical Brands, D2C & Performance Operators) */}
        <article className="relative lg:col-span-5 p-6 sm:p-10 rounded-2xl bg-[#072018]/95 border border-[#13634C] backdrop-blur-2xl flex flex-col justify-between space-y-8 shadow-[0_32px_90px_rgba(0,0,0,0.92)] overflow-hidden">
          {/* Viewfinder Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#EAE2D3]/50"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#CCFF29]/70"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3.5 left-3.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#EAE2D3]/40"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#CCFF29]/50"
          />

          <div className="space-y-6">
            {/* Architectural Dossier Header Bar */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#EAE2D3]/15">
              <div className="flex items-center gap-2.5 font-mono text-xs tracking-[0.12em] text-[#EAE2D3] uppercase font-bold">
                <span className="w-2 h-2 shrink-0 rounded-full bg-[#CCFF29]" />
                <span>{t.act5.col2Kicker}</span>
              </div>
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#EAE2D3]/20 leading-none select-none">
                02
              </span>
            </div>

            <h3 className="font-display font-extrabold uppercase text-2xl sm:text-3xl lg:text-4xl text-[#EAE2D3] tracking-tight leading-[0.98]">
              {t.act5.col2Title}
            </h3>

            <p className="font-sans text-base sm:text-lg text-[#F5EFE4]/90 leading-relaxed">
              {t.act5.col2Body}
            </p>
          </div>

          <div className="pt-6 border-t border-[#EAE2D3]/15 flex flex-wrap gap-2.5">
            {t.act5.col2Tags.map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded bg-[#090B0A]/90 border border-[#EAE2D3]/25 font-mono text-[10px] sm:text-[11px] tracking-[0.12em] text-[#EAE2D3] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      </div>

      {/* Editorial Conversion Bridge Bar */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#0B0F0D]/95 border border-[#EAE2D3]/15 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
        <div className="flex items-center gap-3 font-mono text-xs tracking-[0.12em] text-[#EAE2D3]/85 uppercase">
          <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF29]" />
          <span>ZERO CREATIVE DRIFT · ENGINE 01 + ENGINE 02 COUPLED PIPELINE</span>
        </div>
        <MagneticWaitlistButton
          label={t.hero.cta}
          variant="volt"
          testId="act5-waitlist-cta"
          className="w-full sm:w-auto"
        />
      </div>
    </section>
  );
}
