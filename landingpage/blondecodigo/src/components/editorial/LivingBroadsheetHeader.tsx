'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SUPPORTED_LOCALES,
  useLocale,
  type LocaleCode,
} from '@/lib/i18n/dictionary';
import { useStudioAudio } from '@/lib/audio/StudioSoundEngine';
import { WHATSAPP_WAITLIST_URL } from '@/lib/phase-gate';

export function LivingBroadsheetHeader() {
  const { locale, setLocale, t } = useLocale();
  const {
    soundEnabled,
    toggleSound,
    playLocaleSwitch,
    playShutter,
    playWaitlistPulse,
  } = useStudioAudio();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const hasSettledOpenRef = useRef(false);
  const isClosingRef = useRef(false);

  // Modern Web Guidance (switch): Conditionally load input-switch-polyfill when native switch attribute is unsupported
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof HTMLInputElement !== 'undefined' &&
      !('switch' in HTMLInputElement.prototype)
    ) {
      const polyfillUrl = '/vendor/input-switch-polyfill.js';
      import(/* webpackIgnore: true */ polyfillUrl).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const finalizeClose = useCallback(() => {
    const drawer = dialogRef.current;
    hasSettledOpenRef.current = false;
    isClosingRef.current = false;
    setMobileMenuOpen(false);
    if (drawer && drawer.open) {
      drawer.close();
    }
    openBtnRef.current?.setAttribute('aria-expanded', 'false');
  }, []);

  // Modern Web Guidance (navigation-drawer): Top-layer <dialog> with scroll-snap & IntersectionObserver
  const openDrawer = useCallback(async () => {
    const drawer = dialogRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!drawer || !scroller || !sheet) return;

    playShutter();
    hasSettledOpenRef.current = false;
    isClosingRef.current = false;

    if (!drawer.open) {
      try {
        drawer.showModal();
      } catch {
        drawer.setAttribute('open', '');
      }
    }

    setMobileMenuOpen(true);
    openBtnRef.current?.setAttribute('aria-expanded', 'true');
    drawer.style.setProperty('--drawer-backdrop', '1');

    if (
      typeof CSS !== 'undefined' &&
      !CSS.supports('scroll-initial-target', 'nearest')
    ) {
      scroller.scrollTo({
        left: scroller.offsetWidth,
        behavior: 'instant' as ScrollBehavior,
      });
    }

    // Wait two animation frames so initial top-layer layout & scroll-initial-target commit before scrolling to 0
    await new Promise<void>((r) =>
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => r())
      )
    );

    scroller.scrollTo({ left: 0, behavior: 'auto' });

    // Ensure drawer settles at scrollLeft === 0 and arm swipe-to-dismiss observer
    window.setTimeout(() => {
      if (!isClosingRef.current && drawer.open) {
        if (scroller.scrollLeft > 4) {
          scroller.scrollTo({
            left: 0,
            behavior: 'instant' as ScrollBehavior,
          });
        }
        drawer.style.setProperty('--drawer-backdrop', '1');
        hasSettledOpenRef.current = true;
      }
    }, 240);
  }, [playShutter]);

  const closeDrawer = useCallback(() => {
    const drawer = dialogRef.current;
    const scroller = scrollerRef.current;
    if (!drawer || !drawer.open) {
      setMobileMenuOpen(false);
      return;
    }

    playShutter();
    isClosingRef.current = true;
    hasSettledOpenRef.current = true;
    setMobileMenuOpen(false);
    openBtnRef.current?.setAttribute('aria-expanded', 'false');

    if (scroller && scroller.offsetWidth > 0) {
      scroller.scrollTo({ left: scroller.offsetWidth, behavior: 'auto' });
      window.setTimeout(() => {
        finalizeClose();
      }, 260);
    } else {
      finalizeClose();
    }
  }, [playShutter, finalizeClose]);

  const toggleMobileMenu = useCallback(() => {
    if (mobileMenuOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }, [mobileMenuOpen, closeDrawer, openDrawer]);

  useEffect(() => {
    const drawer = dialogRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!drawer || !scroller || !sheet) return;

    const handleScroll = () => {
      const w = Math.max(sheet.offsetWidth, 1);
      const ratio = Math.max(0, Math.min(1, 1 - scroller.scrollLeft / w));
      if (
        typeof CSS !== 'undefined' &&
        !CSS.supports('animation-timeline: scroll()')
      ) {
        drawer.style.setProperty('--drawer-backdrop', String(ratio));
      }
      // Swipe-to-dismiss settle check once the drawer has opened
      if (
        hasSettledOpenRef.current &&
        drawer.open &&
        scroller.scrollLeft >= w - 4
      ) {
        finalizeClose();
      } else if (
        !isClosingRef.current &&
        drawer.open &&
        scroller.scrollLeft <= 2
      ) {
        hasSettledOpenRef.current = true;
      }
    };

    scroller.addEventListener('scroll', handleScroll, { passive: true });

    const visibleThreshold = 0.05;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry || !drawer.open) return;
        if (entry.intersectionRatio >= 0.95 && !isClosingRef.current) {
          hasSettledOpenRef.current = true;
          setMobileMenuOpen(true);
          openBtnRef.current?.setAttribute('aria-expanded', 'true');
        } else if (
          hasSettledOpenRef.current &&
          entry.intersectionRatio < visibleThreshold
        ) {
          finalizeClose();
        }
      },
      { root: drawer, threshold: [visibleThreshold, 0.95] }
    );

    observer.observe(sheet);

    const handleCancel = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
        closeDrawer();
      } else {
        finalizeClose();
      }
    };

    drawer.addEventListener('cancel', handleCancel);

    return () => {
      observer.disconnect();
      drawer.removeEventListener('cancel', handleCancel);
      scroller.removeEventListener('scroll', handleScroll);
    };
  }, [closeDrawer, finalizeClose]);

  const handleLocaleChange = (code: LocaleCode) => {
    playLocaleSwitch();
    setLocale(code);
  };

  const scrollToSection = (sectionId: string) => {
    closeDrawer();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header
        data-testid="living-broadsheet-header"
        className={`safe-top-header fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090B0A]/88 backdrop-blur-xl border-b border-[#EAE2D3]/12 py-2.5 sm:py-3'
            : 'bg-gradient-to-b from-[#090B0A]/90 via-[#090B0A]/45 to-transparent border-b border-[#EAE2D3]/[0.08] py-3 sm:py-4'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Official Horizontal Brand Lockup (blonde-ai-horizontal-dark.svg per README-ASSETS.md) */}
          <a
            href="#hero-spotlight"
            onClick={(e) => {
              e.preventDefault();
              playShutter();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="blonde AI Home"
            className="group min-h-[44px] min-w-[44px] flex items-center gap-2.5 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CCFF29] rounded-lg"
          >
            <img
              src="/assets/brand/blonde-ai-horizontal-dark.svg"
              alt="blonde AI"
              className="h-9 sm:h-10 w-auto rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="hidden xl:inline-block ml-1 pl-3 border-l border-[#EAE2D3]/15 font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase">
              EDITION 001 // AaaS
            </span>
          </a>

          {/* Center (Desktop lg+): 6-Language Switcher Pill */}
          <div className="hidden lg:flex items-center gap-2">
            <nav
              aria-label="Language switcher"
              data-testid="desktop-locale-switcher"
              className="flex items-center gap-0.5 p-1 rounded-full bg-[#121614]/90 border border-[#EAE2D3]/15 backdrop-blur-md"
            >
              {SUPPORTED_LOCALES.map((item) => {
                const isActive = locale === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    lang={item.code}
                    aria-label={`Switch language to ${item.name}`}
                    aria-current={isActive ? 'true' : undefined}
                    data-testid={`lang-btn-desktop-${item.code}`}
                    onClick={() => handleLocaleChange(item.code)}
                    className={`min-h-[34px] px-2.5 py-1 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase transition-all ${
                      isActive
                        ? 'bg-[#CCFF29] text-[#090B0A] font-bold shadow-[0_0_12px_rgba(204,255,41,0.35)]'
                        : 'text-[#9CA39E] hover:text-[#EAE2D3]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right (Desktop lg+): Native HTML Switch Sound Toggle (#6) + Magnetic Waitlist Pill */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <label
              htmlFor="desktop-sound-switch-input"
              role="switch"
              aria-checked={soundEnabled}
              data-cursor="sound"
              data-testid="desktop-sound-toggle"
              className={`cursor-pointer min-h-[40px] px-3.5 py-1.5 rounded-full border font-mono text-[11px] tracking-[0.12em] uppercase inline-flex items-center gap-2 transition-all select-none ${
                soundEnabled
                  ? 'border-[#CCFF29] bg-[#CCFF29]/12 text-[#CCFF29]'
                  : 'border-[#EAE2D3]/20 bg-[#121614]/80 text-[#9CA39E] hover:text-[#EAE2D3] hover:border-[#EAE2D3]/40'
              }`}
            >
              <input
                id="desktop-sound-switch-input"
                type="checkbox"
                {...({ switch: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
                checked={soundEnabled}
                onChange={toggleSound}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className="inline-flex items-end gap-0.5 h-3 w-3 justify-center"
              >
                <span
                  className={`w-0.5 bg-current transition-all ${
                    soundEnabled ? 'h-2.5 animate-pulse' : 'h-1 opacity-50'
                  }`}
                />
                <span
                  className={`w-0.5 bg-current transition-all ${
                    soundEnabled ? 'h-3 animate-pulse' : 'h-1 opacity-50'
                  }`}
                />
                <span
                  className={`w-0.5 bg-current transition-all ${
                    soundEnabled ? 'h-2 animate-pulse' : 'h-1 opacity-50'
                  }`}
                />
              </span>
              <span>[ {soundEnabled ? t.nav.soundOn : t.nav.soundOff} ]</span>
            </label>

            <a
              href={WHATSAPP_WAITLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="waitlist"
              data-testid="header-waitlist-cta"
              onClick={() => playWaitlistPulse()}
              className="min-h-[40px] px-4 py-2 rounded-full bg-[#CCFF29] hover:bg-[#D4FF33] text-[#090B0A] font-mono font-bold text-[11px] tracking-[0.12em] uppercase inline-flex items-center gap-2 shadow-[0_0_24px_rgba(204,255,41,0.3)] transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#090B0A]" />
              <span>{t.nav.cta}</span>
            </a>
          </div>

          {/* Mobile & Tablet (< lg): Quick Sound Switch (>= 44x44px) + Menu Drawer Trigger (>= 44x44px) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {/* Mobile Quick Sound Toggle Switch */}
            <label
              htmlFor="mobile-header-sound-switch-input"
              role="switch"
              aria-checked={soundEnabled}
              aria-label={soundEnabled ? t.nav.soundOn : t.nav.soundOff}
              data-testid="mobile-header-sound-toggle"
              className={`cursor-pointer min-h-[44px] min-w-[44px] px-3 rounded-full border font-mono text-[10px] tracking-[0.1em] uppercase inline-flex items-center justify-center gap-1.5 transition-all select-none ${
                soundEnabled
                  ? 'border-[#CCFF29] bg-[#CCFF29]/15 text-[#CCFF29]'
                  : 'border-[#EAE2D3]/20 bg-[#121614]/90 text-[#9CA39E]'
              }`}
            >
              <input
                id="mobile-header-sound-switch-input"
                type="checkbox"
                {...({ switch: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
                checked={soundEnabled}
                onChange={toggleSound}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className="inline-flex items-end gap-0.5 h-3"
              >
                <span
                  className={`w-0.5 bg-current ${
                    soundEnabled ? 'h-2 animate-pulse' : 'h-1 opacity-50'
                  }`}
                />
                <span
                  className={`w-0.5 bg-current ${
                    soundEnabled ? 'h-3 animate-pulse' : 'h-1 opacity-50'
                  }`}
                />
                <span
                  className={`w-0.5 bg-current ${
                    soundEnabled ? 'h-1.5 animate-pulse' : 'h-1 opacity-50'
                  }`}
                />
              </span>
              <span className="text-[10px] font-bold">
                {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </label>

            {/* Mobile Menu Trigger Button */}
            <button
              ref={openBtnRef}
              id="drawer-open"
              type="button"
              aria-label={
                mobileMenuOpen ? t.nav.menuCloseLabel : t.nav.menuOpenLabel
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              data-testid="mobile-menu-trigger"
              onClick={toggleMobileMenu}
              className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-full border font-mono text-[11px] tracking-[0.12em] uppercase inline-flex items-center justify-center gap-2 transition-all ${
                mobileMenuOpen
                  ? 'border-[#CCFF29] bg-[#CCFF29] text-[#090B0A] font-bold'
                  : 'border-[#EAE2D3]/25 bg-[#121614]/95 text-[#EAE2D3]'
              }`}
            >
              <span className="px-1.5 py-0.5 rounded bg-[#0B4635] text-[#CCFF29] text-[10px] font-bold">
                {locale.toUpperCase()}
              </span>
              <span>
                {mobileMenuOpen ? t.nav.menuCloseLabel : t.nav.menuOpenLabel}
              </span>
              <span
                aria-hidden="true"
                className="relative w-3.5 h-2.5 flex flex-col justify-between"
              >
                <span
                  className={`block h-[1.5px] w-full bg-current transition-transform duration-200 ${
                    mobileMenuOpen ? 'translate-y-[4px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-[1.5px] w-full bg-current transition-transform duration-200 ${
                    mobileMenuOpen ? '-translate-y-[4px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TOP-LAYER NAVIGATION DRAWER (<dialog> per modern-web-guidance navigation-drawer) */}
      <dialog
        ref={dialogRef}
        id="mobile-navigation-drawer"
        aria-label={t.nav.drawerTitle}
        data-testid="mobile-navigation-drawer"
        data-lenis-prevent
        onClick={(e) => {
          if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
            closeDrawer();
          }
        }}
        className="Drawer lg:hidden"
      >
        <div ref={scrollerRef} className="Drawer-scroller">
          <nav
            ref={sheetRef}
            aria-label="Mobile Primary Navigation"
            className="Drawer-sheet bg-[#090B0A] text-[#EAE2D3] border-r border-[#EAE2D3]/15 flex flex-col justify-between"
          >
            {/* Top Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D3]/15">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/brand/blonde-ai-mark-volt.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-7 h-7 rounded-md"
                  />
                  <span className="font-mono text-[10px] tracking-[0.14em] text-[#CCFF29] uppercase">
                    {t.nav.drawerTitle}
                  </span>
                </div>
                <button
                  id="drawer-close"
                  type="button"
                  autoFocus
                  aria-label={t.nav.menuCloseLabel}
                  data-testid="mobile-drawer-close"
                  onClick={closeDrawer}
                  className="min-h-[44px] min-w-[44px] px-3.5 rounded-full border border-[#EAE2D3]/20 hover:border-[#CCFF29] text-[#EAE2D3] hover:text-[#CCFF29] font-mono text-[11px] tracking-[0.12em] uppercase inline-flex items-center justify-center gap-1.5"
                >
                  <span>×</span>
                  <span>{t.nav.menuCloseLabel}</span>
                </button>
              </div>

              {/* 1. Broadsheet Section Jump Links */}
              <ul className="mt-4 space-y-1">
                {[
                  { id: 'hero-spotlight', label: t.nav.sections.spotlight },
                  { id: 'act-diagnosis', label: t.nav.sections.diagnosis },
                  { id: 'act-vision-aaas', label: t.nav.sections.vision },
                  { id: 'act-vector-engine', label: t.nav.sections.engine },
                  { id: 'act-visionaries-cast', label: t.nav.sections.cast },
                  { id: 'act-founding-circle', label: t.nav.sections.circle },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="w-full min-h-[44px] px-3 py-2.5 rounded-lg text-left font-mono text-xs tracking-[0.12em] text-[#EAE2D3] hover:bg-[#121614] hover:text-[#CCFF29] flex items-center justify-between transition-colors"
                    >
                      <span>{item.label}</span>
                      <span className="text-[#CCFF29]">↘</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* 2. 6-Language Switcher Grid */}
              <div className="mt-5 pt-4 border-t border-[#EAE2D3]/15">
                <p className="font-mono text-[10px] tracking-[0.14em] text-[#9CA39E] uppercase mb-2.5">
                  {t.nav.languageLabel}
                </p>
                <div
                  role="group"
                  aria-label={t.nav.languageLabel}
                  className="grid grid-cols-3 gap-2"
                >
                  {SUPPORTED_LOCALES.map((item) => {
                    const isActive = locale === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        lang={item.code}
                        aria-current={isActive ? 'true' : undefined}
                        data-testid={`lang-btn-mobile-${item.code}`}
                        onClick={() => handleLocaleChange(item.code)}
                        className={`min-h-[44px] min-w-[44px] px-2.5 py-2 rounded-lg border font-mono text-xs tracking-[0.08em] flex flex-col items-center justify-center transition-all ${
                          isActive
                            ? 'bg-[#CCFF29] text-[#090B0A] border-[#CCFF29] font-bold shadow-[0_0_16px_rgba(204,255,41,0.3)]'
                            : 'bg-[#121614] text-[#EAE2D3] border-[#EAE2D3]/15 hover:border-[#CCFF29]/50'
                        }`}
                      >
                        <span className="text-xs font-bold">{item.label}</span>
                        <span
                          className={`text-[9px] ${
                            isActive ? 'text-[#090B0A]/80' : 'text-[#9CA39E]'
                          }`}
                        >
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Studio Sound Tactile Switch Card (#6) using native <input type="checkbox" switch> */}
              <div className="mt-5 pt-4 border-t border-[#EAE2D3]/15">
                <label
                  htmlFor="mobile-drawer-sound-switch-input"
                  role="switch"
                  aria-checked={soundEnabled}
                  data-testid="mobile-drawer-sound-switch"
                  className={`cursor-pointer w-full min-h-[54px] p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all select-none ${
                    soundEnabled
                      ? 'bg-[#0B4635]/45 border-[#CCFF29] text-[#EAE2D3]'
                      : 'bg-[#121614] border-[#EAE2D3]/15 text-[#EAE2D3]'
                  }`}
                >
                  <div>
                    <div className="font-mono text-xs font-bold tracking-[0.12em] text-[#CCFF29] uppercase">
                      {soundEnabled ? t.nav.soundOn : t.nav.soundOff}
                    </div>
                    <div className="text-[11px] text-[#9CA39E] mt-0.5">
                      {t.nav.audioDesc}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      id="mobile-drawer-sound-switch-input"
                      type="checkbox"
                      {...({ switch: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
                      checked={soundEnabled}
                      onChange={toggleSound}
                      className="sr-only"
                    />
                    {/* Tactile Toggle Track & Thumb */}
                    <div
                      aria-hidden="true"
                      className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center ${
                        soundEnabled
                          ? 'bg-[#CCFF29] justify-end'
                          : 'bg-[#181E1B] border border-[#EAE2D3]/20 justify-start'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full transition-transform ${
                          soundEnabled ? 'bg-[#090B0A]' : 'bg-[#9CA39E]'
                        }`}
                      />
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Bottom Drawer Primary WhatsApp Waitlist CTA */}
            <div className="pt-5 mt-5 border-t border-[#EAE2D3]/15 space-y-3">
              <a
                href={WHATSAPP_WAITLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="mobile-drawer-waitlist-cta"
                onClick={() => {
                  playWaitlistPulse();
                  closeDrawer();
                }}
                className="w-full min-h-[48px] px-5 py-3.5 rounded-full bg-[#CCFF29] text-[#090B0A] font-mono font-bold text-xs tracking-[0.12em] uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(204,255,41,0.35)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#090B0A]" />
                <span>{t.hero.cta}</span>
              </a>
              <p className="font-mono text-[10px] tracking-[0.12em] text-center text-[#9CA39E] uppercase">
                BETA v0.5: 09 APR 2027 · LAUNCH: MAY 2027
              </p>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}
