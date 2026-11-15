'use client';

import React from 'react';
import { useLocale } from '@/lib/i18n/dictionary';

export function VisionariesCastAct() {
  const { t } = useLocale();

  return (
    <section
      id="act-visionaries-cast"
      data-testid="act-5-cast"
      className="relative z-10 py-20 sm:py-28 lg:py-36 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 space-y-12 sm:space-y-16"
    >
      {/* Top Broadsheet Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D3]/20 font-mono text-xs tracking-[0.14em] text-[#CCFF29] uppercase">
          <span>{t.act5.kicker}</span>
          <span className="text-[#9CA39E]">DOSSIER // ICP ARCHITECTURE</span>
        </div>

        <h2 className="font-display font-extrabold uppercase text-[#EAE2D3] act-headline-scale pt-2">
          <span>{t.act5.headline.before} </span>
          <em className="font-serifItalic italic font-normal text-[#CCFF29] capitalize px-1.5">
            {t.act5.headline.italicFlash}
          </em>{' '}
          {t.act5.headline.after && <span>{t.act5.headline.after}</span>}
        </h2>
      </div>

      {/* Asymmetric Broadsheet Columns: 01 Core Cast (7 cols) vs 02 Coupled Verticals (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4 border-t border-[#EAE2D3]/15">
        {/* Column 01: Core Focus (Creators, Founders & Infoproducers) */}
        <article className="lg:col-span-7 p-6 sm:p-9 rounded-2xl bg-[#121614]/82 border border-[#CCFF29]/35 backdrop-blur-md flex flex-col justify-between space-y-6 shadow-[0_24px_70px_rgba(9,11,10,0.65)]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFF29]/12 border border-[#CCFF29]/40 font-mono text-[11px] tracking-[0.12em] text-[#CCFF29] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF29]" />
              <span>{t.act5.col1Kicker}</span>
            </div>

            <h3 className="font-display font-extrabold uppercase text-3xl sm:text-4xl text-[#EAE2D3] tracking-tight">
              {t.act5.col1Title}
            </h3>

            <p className="font-sans text-base sm:text-lg text-[#EAE2D3]/88 leading-relaxed max-w-[58ch]">
              {t.act5.col1Body}
            </p>
          </div>

          <div className="pt-5 border-t border-[#EAE2D3]/12 flex flex-wrap gap-2">
            {t.act5.col1Tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded bg-[#090B0A] border border-[#EAE2D3]/15 font-mono text-[10px] tracking-[0.12em] text-[#CCFF29] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>

        {/* Column 02: Coupled Verticals (Physical Brands, D2C & Performance Operators) */}
        <article className="lg:col-span-5 p-6 sm:p-9 rounded-2xl bg-[#0B4635]/40 border border-[#13634C]/70 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#090B0A]/60 border border-[#EAE2D3]/20 font-mono text-[11px] tracking-[0.12em] text-[#EAE2D3] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAE2D3]" />
              <span>{t.act5.col2Kicker}</span>
            </div>

            <h3 className="font-display font-extrabold uppercase text-2xl sm:text-3xl text-[#EAE2D3] tracking-tight">
              {t.act5.col2Title}
            </h3>

            <p className="font-sans text-base text-[#F5EFE4]/85 leading-relaxed">
              {t.act5.col2Body}
            </p>
          </div>

          <div className="pt-5 border-t border-[#EAE2D3]/15 flex flex-wrap gap-2">
            {t.act5.col2Tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded bg-[#090B0A]/80 border border-[#EAE2D3]/15 font-mono text-[10px] tracking-[0.12em] text-[#EAE2D3] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
