'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { OpticalTelemetryText } from '@/components/interactions/OpticalTelemetryText';

export function DiagnosisNewspaperAct() {
  const { t } = useLocale();

  return (
    <section
      id="act-diagnosis"
      data-testid="act-2-diagnosis"
      className="broadsheet-parallax-section relative z-10 py-20 sm:py-28 lg:py-36 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12"
    >
      {/* Top Broadsheet Edition Header */}
      <div className="flex items-center justify-between pb-4 mb-10 sm:mb-14 border-b border-[#EAE2D3]/25 font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded bg-[#CCFF29] text-[#090B0A] font-bold text-[10px]">
            02
          </span>
          <OpticalTelemetryText text={t.act2.kicker} />
        </div>
        <span className="text-[#9CA39E]">ACT II // LIVING BROADSHEET</span>
      </div>

      {/* Asymmetric Newspaper Layout: Left 7 cols Diagnosis & Columns, Right 5 cols Open Window to Liquid Metal River + Sculpture Proof */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Protective Studio Reading Shield behind Left Newspaper Columns */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-3xl broadsheet-reading-shield -z-10"
        />

        <div className="lg:col-span-7 space-y-8">
          <h2 className="font-display font-extrabold uppercase text-[#EAE2D3] act-headline-scale drop-shadow-[0_6px_28px_rgba(9,11,10,0.9)]">
            <span className="block">{t.act2.headline.before}</span>
            <span className="block mt-1">
              <em className="font-serifItalic italic font-normal text-[#CCFF29] capitalize pr-2.5">
                {t.act2.headline.italicFlash}
              </em>
              <span>{t.act2.headline.after}</span>
            </span>
          </h2>

          {/* Multi-Column Newspaper Body & High-Contrast Pull Quote Dossier */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-[#EAE2D3]/20">
            <div className="md:col-span-7 md:pr-6 md:border-r border-[#EAE2D3]/15 bg-[#090B0A]/75 backdrop-blur-md p-5 rounded-xl border border-[#EAE2D3]/10">
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#CCFF29] uppercase mb-2">
                § 01 // FEED SATURATION REPORT
              </div>
              <p className="font-sans text-base sm:text-lg text-[#F5EFE4] leading-relaxed">
                {t.act2.body}
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col justify-between space-y-4 bg-[#0B1210]/92 backdrop-blur-md p-5 rounded-xl border border-[#CCFF29]/30 shadow-[0_20px_50px_rgba(0,0,0,0.75)]">
              <blockquote className="font-serifItalic italic text-xl sm:text-2xl text-[#F5EFE4] leading-snug border-l-2 border-[#CCFF29] pl-4">
                {t.act2.quote}
              </blockquote>
              <div className="pt-3 border-t border-[#EAE2D3]/12 flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-[#CCFF29] uppercase">
                <img
                  src="/assets/brand/blonde-ai-mark-volt.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-4 h-4"
                />
                <span>OPTICAL LAW // 0.4s THRESHOLD</span>
              </div>
            </div>
          </div>

          {/* 3 Telemetry Blocks (Charles Leclerc Telemetry Grammar) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="relative p-5 rounded-xl bg-[#0D1210]/94 border border-[#EAE2D3]/18 backdrop-blur-md shadow-xl">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 right-2 w-2 h-2 border-t border-r border-[#CCFF29]/60"
              />
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase">
                {t.act2.telemetry.skipLatencyLabel}
              </div>
              <div className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-[#CCFF29] tabular-nums">
                {t.act2.telemetry.skipLatencyValue}
              </div>
            </div>

            <div className="relative p-5 rounded-xl bg-[#0D1210]/94 border border-[#EAE2D3]/18 backdrop-blur-md shadow-xl">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 right-2 w-2 h-2 border-t border-r border-[#EAE2D3]/40"
              />
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase">
                {t.act2.telemetry.greySaturationLabel}
              </div>
              <div className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-[#EAE2D3] tabular-nums">
                {t.act2.telemetry.greySaturationValue}
              </div>
            </div>

            <div className="relative p-5 rounded-xl bg-[#07281E]/94 border border-[#CCFF29]/55 backdrop-blur-md shadow-xl">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 right-2 w-2 h-2 border-t border-r border-[#CCFF29]"
              />
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#CCFF29] uppercase">
                {t.act2.telemetry.modeLabel}
              </div>
              <div className="mt-2 font-display font-extrabold text-3xl sm:text-4xl text-[#EAE2D3]">
                {t.act2.telemetry.modeValue}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Architectural Viewfinder Window Over the Liquid Chrome Sculpture */}
        <div className="lg:col-span-5 lg:pl-4 broadsheet-parallax-layer">
          <div className="relative rounded-xl border border-[#EAE2D3]/25 bg-[#090B0A]/90 backdrop-blur-md p-3.5 sm:p-4 shadow-[0_30px_90px_rgba(0,0,0,0.88)]">
            {/* Viewfinder Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-2 z-20 w-3 h-3 border-t-2 border-l-2 border-[#CCFF29]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-2 right-2 z-20 w-3 h-3 border-t-2 border-r-2 border-[#CCFF29]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 left-2 z-20 w-3 h-3 border-b-2 border-l-2 border-[#CCFF29]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 right-2 z-20 w-3 h-3 border-b-2 border-r-2 border-[#CCFF29]"
            />

            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#EAE2D3]/85 uppercase mb-3 px-1">
              <span>FIG 01 // LIQUID METAL ANATOMY</span>
              <span className="text-[#CCFF29] font-bold">Z-1 FIELD</span>
            </div>
            <div className="relative aspect-[4/4] w-full overflow-hidden rounded-lg border border-[#EAE2D3]/15 bg-[#090B0A]">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/assets/images/liquid-metal-sculpt-b.jpg"
                className="w-full h-full object-cover"
              >
                <source
                  src="/assets/videos/liquid-metal-b-morph.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#090B0A]/85 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded bg-[#090B0A]/85 border border-[#EAE2D3]/15 backdrop-blur-sm font-mono text-[10px] tracking-[0.12em] text-[#EAE2D3]">
                <span>THIN-FILM IRIDESCENT CHROME</span>
                <span className="text-[#CCFF29] font-bold">30° CUT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
