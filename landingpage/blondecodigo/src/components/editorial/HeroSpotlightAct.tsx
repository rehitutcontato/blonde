'use client';

import React, { useEffect, useRef } from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';
import { MagneticWaitlistButton } from '@/components/interactions/MagneticWaitlistButton';
import { FlutedEmeraldGlass } from '@/components/stage/FlutedEmeraldGlass';
import { scrollBridge } from '@/lib/scroll-bridge';

export function HeroSpotlightAct() {
  const { t } = useLocale();
  const { playMetalHover } = useStudioAudio();
  const hudCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    const updateTilt = () => {
      if (hudCardRef.current && scrollBridge.pointerFine) {
        const rx = (-scrollBridge.smoothMouseY * 1.4).toFixed(2);
        const ry = (scrollBridge.smoothMouseX * 1.8).toFixed(2);
        hudCardRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      rafId = window.requestAnimationFrame(updateTilt);
    };
    rafId = window.requestAnimationFrame(updateTilt);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      id="hero-spotlight"
      data-testid="act-1-hero"
      onPointerMove={() => playMetalHover()}
      className="relative z-10 min-h-[100svh] pt-24 sm:pt-32 pb-16 sm:pb-24 flex flex-col justify-between mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12"
    >
      {/* Top Editorial Broadsheet Masthead Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-lg bg-[#090B0A]/80 backdrop-blur-md border border-[#EAE2D3]/15 font-mono text-[10px] sm:text-xs tracking-[0.14em] text-[#EAE2D3]/90 uppercase">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF29] animate-pulse shadow-[0_0_8px_#CCFF29]" />
          <span data-testid="hero-genesis-badge">{t.hero.badge}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[#9CA39E]">
          <span>LATENCY: 0.0MS</span>
          <span>·</span>
          <span className="text-[#CCFF29]">SHADER: THIN-FILM LIQUID CHROME</span>
        </div>
      </div>

      {/* Main Hero Broadsheet Grid (12 Columns on Desktop) */}
      <div className="relative my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
        {/* Protective Studio Reading Shield behind Left Editorial Column */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-3xl broadsheet-reading-shield -z-10"
        />

        {/* Left 8 Columns: Monumental Headline + AaaS Subheadline + Primary Waitlist CTA */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          <h1
            data-testid="hero-headline"
            className="font-display font-extrabold uppercase text-[#EAE2D3] hero-display-scale select-none drop-shadow-[0_8px_32px_rgba(9,11,10,0.9)]"
          >
            <span className="block">{t.hero.headline.before}</span>
            <span className="block mt-1">
              <em className="font-serifItalic italic font-normal text-[#CCFF29] capitalize pr-2 sm:pr-3 inline-block drop-shadow-[0_0_24px_rgba(204,255,41,0.28)]">
                {t.hero.headline.italicFlash}
              </em>
              <span>{t.hero.headline.after}</span>
            </span>
          </h1>

          <div className="max-w-[58ch] pl-4 border-l-2 border-[#CCFF29]/70 bg-[#090B0A]/65 backdrop-blur-sm py-2 pr-4 rounded-r-lg">
            <p
              data-testid="hero-subheadline"
              className="font-sans text-base sm:text-lg md:text-xl text-[#F5EFE4] leading-relaxed"
            >
              {t.hero.subheadline}
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <MagneticWaitlistButton
                label={t.hero.cta}
                variant="volt"
                testId="hero-primary-waitlist-cta"
                className="w-full sm:w-auto"
              />
              <a
                href="#act-vision-aaas"
                className="min-h-[44px] px-5 py-3 rounded-full bg-[#090B0A]/80 backdrop-blur-md border border-[#EAE2D3]/25 hover:border-[#CCFF29] text-[#EAE2D3] hover:text-[#CCFF29] font-mono text-xs tracking-[0.12em] uppercase inline-flex items-center justify-center transition-colors"
              >
                {t.hero.scrollCue}
              </a>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-[#EAE2D3]/80 tracking-[0.04em] max-w-[62ch] bg-[#090B0A]/60 inline-block px-2.5 py-1 rounded">
              {t.hero.microcopy}
            </p>
          </div>
        </div>

        {/* Right 4 Columns: Optical Viewfinder Studio Reel & Fluted Emerald Glass Frame */}
        <div className="lg:col-span-4">
          <div ref={hudCardRef} className="transition-transform duration-150">
            <FlutedEmeraldGlass
              intensity="strong"
              className="rounded-xl p-3.5 sm:p-4 relative"
            >
              {/* Viewfinder Corner Brackets ⌜ ⌝ ⌞ ⌟ */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 left-2 z-20 w-2.5 h-2.5 border-t border-l border-[#CCFF29]/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-2 right-2 z-20 w-2.5 h-2.5 border-t border-r border-[#CCFF29]/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 left-2 z-20 w-2.5 h-2.5 border-b border-l border-[#CCFF29]/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 right-2 z-20 w-2.5 h-2.5 border-b border-r border-[#CCFF29]/80"
              />

              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#EAE2D3] uppercase mb-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF29]" />
                  <span>{t.hero.reelLabel}</span>
                </span>
                <span className="text-[#CCFF29] font-bold">REC ●</span>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#EAE2D3]/20 bg-[#090B0A]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/assets/images/hero-liquid-lens-studio.jpg"
                  className="w-full h-full object-cover"
                >
                  <source
                    src="/assets/videos/brand-teaser-motion.mp4"
                    type="video/mp4"
                  />
                </video>
                {/* 30deg Spotlight Slash Badge */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1.5 rounded bg-[#090B0A]/90 border border-[#EAE2D3]/20 backdrop-blur-md font-mono text-[10px] text-[#EAE2D3]">
                  <span>O b HOLOFOTE // 30°</span>
                  <span className="text-[#CCFF29] font-bold">AaaS ENGINE</span>
                </div>
              </div>
            </FlutedEmeraldGlass>
          </div>
        </div>
      </div>

      {/* Bottom Capillary Hairline Rule */}
      <div className="pt-4 border-t border-[#EAE2D3]/20 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase">
        <span>01 // THE SPOTLIGHT BREAK</span>
        <span>BRAZIL FIRST · GLOBAL STANDARD</span>
      </div>
    </section>
  );
}
