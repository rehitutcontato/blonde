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
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-[#EAE2D3]/15 font-mono text-[10px] sm:text-xs tracking-[0.14em] text-[#EAE2D3]/85 uppercase">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#CCFF29] animate-pulse" />
          <span data-testid="hero-genesis-badge">{t.hero.badge}</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[#9CA39E]">
          <span>LATENCY: 0.0MS</span>
          <span>·</span>
          <span>SHADER: THIN-FILM LIQUID CHROME</span>
        </div>
      </div>

      {/* Main Hero Broadsheet Grid (12 Columns on Desktop) */}
      <div className="my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
        {/* Left 8 Columns: Monumental Headline + AaaS Subheadline + Primary Waitlist CTA */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          <h1
            data-testid="hero-headline"
            className="font-display font-extrabold uppercase text-[#EAE2D3] hero-display-scale select-none"
          >
            <span className="block">{t.hero.headline.before}</span>
            <span className="block mt-1">
              <em className="font-serifItalic italic font-normal text-[#CCFF29] capitalize pr-2 sm:pr-3 inline-block">
                {t.hero.headline.italicFlash}
              </em>
              <span>{t.hero.headline.after}</span>
            </span>
          </h1>

          <p
            data-testid="hero-subheadline"
            className="max-w-[56ch] font-sans text-base sm:text-lg md:text-xl text-[#EAE2D3]/90 leading-relaxed"
          >
            {t.hero.subheadline}
          </p>

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
                className="min-h-[44px] px-5 py-3 rounded-full border border-[#EAE2D3]/20 hover:border-[#CCFF29]/60 text-[#EAE2D3]/85 hover:text-[#CCFF29] font-mono text-xs tracking-[0.12em] uppercase inline-flex items-center justify-center transition-colors"
              >
                {t.hero.scrollCue}
              </a>
            </div>
            <p className="font-mono text-[11px] sm:text-xs text-[#9CA39E] tracking-[0.04em] max-w-[62ch]">
              {t.hero.microcopy}
            </p>
          </div>
        </div>

        {/* Right 4 Columns: Optical Viewfinder Studio Reel & Fluted Emerald Glass Frame */}
        <div className="lg:col-span-4">
          <div ref={hudCardRef} className="transition-transform duration-150">
            <FlutedEmeraldGlass
              intensity="medium"
              className="rounded-xl p-3 sm:p-4"
            >
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#EAE2D3]/85 uppercase mb-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF29]" />
                  <span>{t.hero.reelLabel}</span>
                </span>
                <span className="text-[#CCFF29]">REC ●</span>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#EAE2D3]/15 bg-[#090B0A]">
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
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1.5 rounded bg-[#090B0A]/85 border border-[#EAE2D3]/15 backdrop-blur-sm font-mono text-[10px] text-[#EAE2D3]">
                  <span>O b HOLOFOTE // 30°</span>
                  <span className="text-[#CCFF29]">AaaS ENGINE</span>
                </div>
              </div>
            </FlutedEmeraldGlass>
          </div>
        </div>
      </div>

      {/* Bottom Capillary Hairline Rule */}
      <div className="pt-4 border-t border-[#EAE2D3]/15 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase">
        <span>01 // THE SPOTLIGHT BREAK</span>
        <span>BRAZIL FIRST · GLOBAL STANDARD</span>
      </div>
    </section>
  );
}
