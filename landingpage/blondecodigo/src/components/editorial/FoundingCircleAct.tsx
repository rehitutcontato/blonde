'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { MagneticWaitlistButton } from '@/components/interactions/MagneticWaitlistButton';
import { OpticalTelemetryText } from '@/components/interactions/OpticalTelemetryText';

export function FoundingCircleAct() {
  const { t } = useLocale();

  return (
    <section
      id="act-founding-circle"
      data-testid="act-6-founding-circle"
      className="relative z-10 py-20 sm:py-28 lg:py-36 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12"
    >
      {/* Private Invitation Ticket / Founding Room Card over the Liquid Metal Halo */}
      <div className="relative rounded-3xl border border-[#CCFF29]/55 bg-[#090B0A]/95 backdrop-blur-2xl p-6 sm:p-12 lg:p-16 shadow-[0_0_90px_rgba(11,70,53,0.45),0_30px_100px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* 30-degree Blonde Volt Spotlight Beam Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#CCFF29]/12 blur-3xl"
        />

        {/* Viewfinder Corner Brackets */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#CCFF29]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#CCFF29]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#CCFF29]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#CCFF29]"
        />

        <div className="relative z-10 space-y-10 sm:space-y-12">
          {/* Top Kicker */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE2D3]/15 font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#CCFF29] animate-pulse" />
              <OpticalTelemetryText text={t.act6.kicker} />
            </span>
            <span className="text-[#EAE2D3]/75">MODE B // PRIVATE CIRCLE</span>
          </div>

          {/* Headline & Subtitle */}
          <div className="max-w-4xl space-y-5">
            <h2 className="font-display font-extrabold uppercase text-[#EAE2D3] act-headline-scale">
              <span>{t.act6.headline.before} </span>
              <em className="font-serifItalic italic font-normal text-[#CCFF29] capitalize px-1.5">
                {t.act6.headline.italicFlash}
              </em>{' '}
              <span>{t.act6.headline.after}</span>
            </h2>
            <p className="font-sans text-lg sm:text-xl text-[#EAE2D3]/88 leading-relaxed max-w-[60ch]">
              {t.act6.subtitle}
            </p>
          </div>

          {/* The 4 Pillars Inside the Private WhatsApp Circle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {t.act6.pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="p-5 rounded-xl bg-[#121614]/90 border border-[#EAE2D3]/15 hover:border-[#CCFF29]/60 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between font-mono text-xs text-[#CCFF29]">
                  <span>PILLAR // {pillar.num}</span>
                  <span>✦</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-base sm:text-lg text-[#EAE2D3]">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#9CA39E] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Official Genesis Roadmap Timeline (NOW -> 09 APR 2027 -> MAY 2027) */}
          <div className="p-5 sm:p-7 rounded-2xl bg-[#0B4635]/35 border border-[#13634C] space-y-6">
            <p className="font-mono text-xs sm:text-sm text-[#CCFF29] tracking-[0.06em] leading-relaxed">
              {t.act6.datesNote}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#EAE2D3]/15">
              <div className="space-y-1">
                <div className="font-mono text-xs font-bold tracking-[0.14em] text-[#CCFF29] uppercase">
                  ● {t.act6.timeline.step1Date}
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#EAE2D3]/90">
                  {t.act6.timeline.step1Label}
                </div>
              </div>

              <div className="space-y-1 md:border-l border-[#EAE2D3]/15 md:pl-4">
                <div className="font-mono text-xs font-bold tracking-[0.14em] text-[#EAE2D3] uppercase">
                  ◎ {t.act6.timeline.step2Date}
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#EAE2D3]/85">
                  {t.act6.timeline.step2Label}
                </div>
              </div>

              <div className="space-y-1 md:border-l border-[#EAE2D3]/15 md:pl-4">
                <div className="font-mono text-xs font-bold tracking-[0.14em] text-[#9CA39E] uppercase">
                  ○ {t.act6.timeline.step3Date}
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#9CA39E]">
                  {t.act6.timeline.step3Label}
                </div>
              </div>
            </div>
          </div>

          {/* Final Giant Magnetic Waitlist CTA */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <MagneticWaitlistButton
              label={t.act6.cta}
              variant="volt"
              testId="act6-final-waitlist-cta"
              className="w-full sm:w-auto text-sm sm:text-base px-8 py-5"
            />
            <div className="font-mono text-[11px] tracking-[0.12em] text-[#9CA39E] uppercase">
              WHATSAPP DIRECT ENCRYPTED INVITE · ZERO PUBLIC PRICING
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
