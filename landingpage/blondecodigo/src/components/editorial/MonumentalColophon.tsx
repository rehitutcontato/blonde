'use client';

import React from 'react';
import {
  SUPPORTED_LOCALES,
  useLocale,
  type LocaleCode,
} from '@/lib/i18n/dictionary';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';
import { WHATSAPP_WAITLIST_URL } from '@/lib/phase-gate';

export function MonumentalColophon() {
  const { locale, setLocale, t } = useLocale();
  const {
    soundEnabled,
    toggleSound,
    playLocaleSwitch,
    playWaitlistPulse,
  } = useStudioAudio();

  const handleLocaleClick = (code: LocaleCode) => {
    playLocaleSwitch();
    setLocale(code);
  };

  return (
    <footer
      data-testid="act-7-colophon"
      className="relative z-10 pt-16 sm:pt-24 pb-12 sm:pb-16 border-t border-[#EAE2D3]/15 bg-gradient-to-t from-[#090B0A] via-[#090B0A]/90 to-transparent"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 space-y-12 sm:space-y-16">
        {/* Telemetry Control Row: 6 Languages + Sound Toggle + Direct WhatsApp Link */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-[#EAE2D3]/15">
          {/* 6-Locale Switcher */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase mr-2">
              LOCALE:
            </span>
            {SUPPORTED_LOCALES.map((item) => {
              const isActive = locale === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  lang={item.code}
                  aria-current={isActive ? 'true' : undefined}
                  data-testid={`lang-btn-footer-${item.code}`}
                  onClick={() => handleLocaleClick(item.code)}
                  className={`min-h-[36px] px-3 py-1 rounded-full font-mono text-xs tracking-[0.1em] uppercase border transition-all ${
                    isActive
                      ? 'bg-[#CCFF29] text-[#090B0A] border-[#CCFF29] font-bold'
                      : 'bg-[#121614] text-[#9CA39E] border-[#EAE2D3]/15 hover:text-[#EAE2D3]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Sound Toggle & WhatsApp Genesis Circle Link */}
          <div className="md:col-span-6 flex flex-wrap md:justify-end items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={soundEnabled}
              data-testid="footer-sound-toggle"
              onClick={toggleSound}
              className={`min-h-[38px] px-4 py-1.5 rounded-full border font-mono text-xs tracking-[0.12em] uppercase transition-all ${
                soundEnabled
                  ? 'border-[#CCFF29] bg-[#CCFF29]/15 text-[#CCFF29]'
                  : 'border-[#EAE2D3]/20 bg-[#121614] text-[#9CA39E] hover:text-[#EAE2D3]'
              }`}
            >
              [ {soundEnabled ? t.nav.soundOn : t.nav.soundOff} ]
            </button>

            <a
              href={WHATSAPP_WAITLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="waitlist"
              data-testid="footer-waitlist-cta"
              onClick={() => playWaitlistPulse()}
              className="min-h-[38px] px-4 py-1.5 rounded-full bg-[#0B4635] hover:bg-[#13634C] border border-[#CCFF29]/50 text-[#CCFF29] font-mono text-xs tracking-[0.12em] uppercase inline-flex items-center gap-2 transition-colors"
            >
              <span>{t.colophon.whatsappCircleLabel}</span>
            </a>
          </div>
        </div>

        {/* Monumental Full-Width Lockup & Wordmark with 30-degree Blonde Volt Beam Slash */}
        <div className="relative py-4 sm:py-6 flex flex-col items-center text-center overflow-hidden">
          <div className="relative inline-flex items-center justify-center gap-3 sm:gap-6 select-none">
            <img
              src="/assets/brand/blonde-ai-mark-volt.svg"
              alt="blonde AI Master Emblem"
              className="w-14 h-14 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl shadow-[0_0_40px_rgba(204,255,41,0.2)]"
            />
            <span className="font-sans font-extrabold tracking-[-0.04em] text-[3.5rem] sm:text-[6.5rem] md:text-[9rem] lg:text-[11rem] leading-none text-[#EAE2D3]">
              blonde
            </span>
            <span className="px-3 py-1 sm:px-5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#CCFF29] text-[#090B0A] font-mono font-bold text-xl sm:text-4xl md:text-5xl tracking-wider shadow-[0_0_35px_rgba(204,255,41,0.4)]">
              AI
            </span>
          </div>

          {/* Official Global Tagline */}
          <div className="mt-6 space-y-1">
            <p className="font-display font-bold text-xl sm:text-3xl tracking-[0.26em] text-[#EAE2D3] uppercase">
              STAND OUT IN THE{' '}
              <span className="text-[#CCFF29]">CROWD.</span>
            </p>
            {t.colophon.sloganAux && (
              <p className="font-mono text-xs tracking-[0.2em] text-[#9CA39E] uppercase">
                {t.colophon.sloganAux}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Status Telemetry & Copyright */}
        <div className="pt-8 border-t border-[#EAE2D3]/12 flex flex-col lg:flex-row items-center justify-between gap-4 font-mono text-[10px] sm:text-xs tracking-[0.12em] text-[#9CA39E] uppercase text-center lg:text-left">
          <span>{t.colophon.statusLine}</span>
          <span>{t.colophon.rights}</span>
        </div>
      </div>
    </footer>
  );
}
