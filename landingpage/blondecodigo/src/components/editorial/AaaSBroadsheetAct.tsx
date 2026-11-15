'use client';

import React, { useEffect, useRef } from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';
import { BeforeAfterOpticalBlade } from '@/components/interactions/BeforeAfterOpticalBlade';
import { MagneticWaitlistButton } from '@/components/interactions/MagneticWaitlistButton';
import { OpticalTelemetryText } from '@/components/interactions/OpticalTelemetryText';

export function AaaSBroadsheetAct() {
  const { t } = useLocale();
  const { playBroadsheetTurn } = useStudioAudio();
  const sheetRef = useRef<HTMLDivElement>(null);
  const hasPlayedTurnRef = useRef(false);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasPlayedTurnRef.current) {
          hasPlayedTurnRef.current = true;
          playBroadsheetTurn();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [playBroadsheetTurn]);

  return (
    <section
      id="act-vision-aaas"
      data-testid="act-3-aaas-broadsheet"
      className="relative z-10 py-12 sm:py-20 px-2 sm:px-6 lg:px-10"
    >
      {/* Floating Editorial Beige Broadsheet Sheet (88-94vw max-w-[1360px], leaving persistent WebGL Liquid Metal visible on margins!) */}
      <div
        ref={sheetRef}
        className="relative mx-auto max-w-[1360px] rounded-2xl bg-[#EAE2D3] text-[#090B0A] shadow-[0_40px_120px_rgba(0,0,0,0.85)] border border-[#090B0A]/15 overflow-hidden"
      >
        {/* Travertine Mineral & Paper Texture Overlay (mix-blend-mode: multiply, opacity 0.11 per 03-DIRECAO-ARTE) */}
        <div
          aria-hidden="true"
          style={{
            backgroundImage: 'url(/assets/images/texture-travertine-editorial.jpg)',
          }}
          className="pointer-events-none absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-[0.12]"
        />

        <div className="relative z-10 p-5 sm:p-10 lg:p-14 space-y-10 sm:space-y-14">
          {/* Broadsheet Newspaper Top Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#090B0A]/15">
            <div className="flex items-center gap-3">
              <img
                src="/assets/brand/blonde-ai-mark-royal.svg"
                alt=""
                aria-hidden="true"
                className="w-6 h-6"
              />
              <OpticalTelemetryText
                text={t.act3.kicker}
                className="font-mono text-xs font-bold tracking-[0.14em] text-[#0B4635] uppercase"
              />
            </div>
            <div className="font-mono text-[11px] tracking-[0.14em] text-[#090B0A]/65 uppercase">
              ACT III // LIVING BROADSHEET FOLIO
            </div>
          </div>

          {/* Headline & Editorial Manifesto Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <h2 className="font-display font-extrabold uppercase text-[#090B0A] act-headline-scale">
                <span>{t.act3.headline.before} </span>
                <em className="font-serifItalic italic font-normal text-[#0B4635] capitalize pr-2">
                  {t.act3.headline.italicFlash}
                </em>
                <span className="block mt-1">{t.act3.headline.after}</span>
              </h2>
            </div>

            <div className="lg:col-span-5 lg:border-l border-[#090B0A]/15 lg:pl-8">
              <p className="font-sans text-base sm:text-lg text-[#090B0A]/85 leading-relaxed">
                {t.act3.manifesto}
              </p>
            </div>
          </div>

          {/* SaaS vs AaaS Editorial Comparison Broadsheet Grid */}
          <div className="rounded-xl border border-[#090B0A]/15 bg-[#F5EFE4]/70 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#090B0A]/15 bg-[#090B0A] text-[#EAE2D3] font-mono text-[10px] sm:text-xs tracking-[0.14em] uppercase">
              <div className="p-3.5 md:col-span-3 border-b md:border-b-0 md:border-r border-[#EAE2D3]/15 text-[#9CA39E]">
                {t.act3.comparisonTable.colDimension}
              </div>
              <div className="p-3.5 md:col-span-4 border-b md:border-b-0 md:border-r border-[#EAE2D3]/15 text-[#9CA39E]">
                {t.act3.comparisonTable.colGreyCrowd}
              </div>
              <div className="p-3.5 md:col-span-5 text-[#CCFF29] font-bold">
                {t.act3.comparisonTable.colBlonde}
              </div>
            </div>

            {[
              {
                label: t.act3.comparisonTable.row1Label,
                grey: t.act3.comparisonTable.row1Grey,
                blonde: t.act3.comparisonTable.row1Blonde,
              },
              {
                label: t.act3.comparisonTable.row2Label,
                grey: t.act3.comparisonTable.row2Grey,
                blonde: t.act3.comparisonTable.row2Blonde,
              },
              {
                label: t.act3.comparisonTable.row3Label,
                grey: t.act3.comparisonTable.row3Grey,
                blonde: t.act3.comparisonTable.row3Blonde,
              },
            ].map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 border-b last:border-b-0 border-[#090B0A]/12 text-sm"
              >
                <div className="p-3.5 sm:p-4 md:col-span-3 font-mono font-bold text-xs uppercase tracking-[0.08em] text-[#090B0A] md:border-r border-[#090B0A]/12 bg-[#EAE2D3]/50">
                  {row.label}
                </div>
                <div className="p-3.5 sm:p-4 md:col-span-4 text-[#090B0A]/65 md:border-r border-[#090B0A]/12">
                  {row.grey}
                </div>
                <div className="p-3.5 sm:p-4 md:col-span-5 font-medium text-[#072E23] bg-[#0B4635]/[0.06]">
                  {row.blonde}
                </div>
              </div>
            ))}
          </div>

          {/* INTERACTION #2: BEFORE -> AFTER OPTICAL BLADE */}
          <div className="pt-2">
            <BeforeAfterOpticalBlade />
          </div>

          {/* Bottom Broadsheet Stamp & Direct Waitlist Entry */}
          <div className="pt-6 border-t border-[#090B0A]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <img
                src="/assets/brand/blonde-ai-horizontal-light.svg"
                alt="blonde AI editorial stamp"
                className="h-9 w-auto rounded"
              />
              <img
                src="/assets/brand/blonde-ai-lockup-launch-beige.svg"
                alt=""
                aria-hidden="true"
                className="h-8 w-auto hidden md:block rounded"
              />
              <span className="font-mono text-[11px] tracking-[0.1em] text-[#090B0A]/75 uppercase">
                VISION IN · STUDIO MASTER OUT
              </span>
            </div>
            <MagneticWaitlistButton
              label={t.hero.cta}
              variant="obsidian"
              testId="act3-waitlist-cta"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
