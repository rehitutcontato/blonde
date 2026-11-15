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
      className="relative z-10 py-20 sm:py-28 lg:py-36 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12"
    >
      {/* Top Broadsheet Edition Header */}
      <div className="flex items-center justify-between pb-4 mb-10 sm:mb-14 border-b border-[#EAE2D3]/20 font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase">
        <OpticalTelemetryText text={t.act2.kicker} />
        <span className="text-[#9CA39E]">ACT II // LIVING BROADSHEET</span>
      </div>

      {/* Asymmetric Newspaper Layout: Left 7 cols Diagnosis & Columns, Right 5 cols Open Window to Liquid Metal River + Sculpture Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-7 space-y-8">
          <h2 className="font-display font-extrabold uppercase text-[#EAE2D3] act-headline-scale">
            <span className="block">{t.act2.headline.before}</span>
            <span className="block mt-1">
              <em className="font-serifItalic italic font-normal text-[#CCFF29] capitalize pr-2.5">
                {t.act2.headline.italicFlash}
              </em>
              <span>{t.act2.headline.after}</span>
            </span>
          </h2>

          {/* Multi-Column Newspaper Body & Pull Quote */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-[#EAE2D3]/15">
            <div className="md:col-span-7 md:pr-6 md:border-r border-[#EAE2D3]/15">
              <p className="font-sans text-base sm:text-lg text-[#EAE2D3]/88 leading-relaxed">
                {t.act2.body}
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <blockquote className="font-serifItalic italic text-xl sm:text-2xl text-[#F5EFE4] leading-snug border-l-2 border-[#CCFF29] pl-4">
                {t.act2.quote}
              </blockquote>
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase">
                <img
                  src="/assets/brand/blonde-ai-mark-beige.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-4 h-4 opacity-80"
                />
                <span>OPTICAL LAW // 0.4s THRESHOLD</span>
              </div>
            </div>
          </div>

          {/* 3 Telemetry Blocks (Leclerc Telemetry Grammar) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#EAE2D3]/15">
            <div className="p-4 rounded-lg bg-[#121614]/75 border border-[#EAE2D3]/12 backdrop-blur-sm">
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase">
                {t.act2.telemetry.skipLatencyLabel}
              </div>
              <div className="mt-1.5 font-display font-extrabold text-3xl sm:text-4xl text-[#CCFF29] tabular-nums">
                {t.act2.telemetry.skipLatencyValue}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#121614]/75 border border-[#EAE2D3]/12 backdrop-blur-sm">
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase">
                {t.act2.telemetry.greySaturationLabel}
              </div>
              <div className="mt-1.5 font-display font-extrabold text-3xl sm:text-4xl text-[#EAE2D3] tabular-nums">
                {t.act2.telemetry.greySaturationValue}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0B4635]/45 border border-[#CCFF29]/40 backdrop-blur-sm">
              <div className="font-mono text-[10px] tracking-[0.14em] text-[#CCFF29] uppercase">
                {t.act2.telemetry.modeLabel}
              </div>
              <div className="mt-1.5 font-display font-extrabold text-3xl sm:text-4xl text-[#EAE2D3]">
                {t.act2.telemetry.modeValue}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Window Over the Liquid Chrome River + Liquid Sculpture Reference */}
        <div className="lg:col-span-5 lg:pl-6">
          <div className="relative rounded-xl border border-[#EAE2D3]/18 bg-[#090B0A]/55 backdrop-blur-sm p-3 sm:p-4 shadow-2xl">
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase mb-3">
              <span>FIG 01 // LIQUID METAL ANATOMY</span>
              <span className="text-[#CCFF29]">Z-1 FIELD</span>
            </div>
            <div className="relative aspect-[4/4] w-full overflow-hidden rounded-lg border border-[#EAE2D3]/12">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#090B0A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] tracking-[0.12em] text-[#EAE2D3]">
                <span>THIN-FILM IRIDESCENT CHROME</span>
                <span className="text-[#CCFF29]">30° CUT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
