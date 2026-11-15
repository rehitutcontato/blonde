'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from '@/lib/i18n/dictionary';
import {
  scrollBridge,
  subscribePreloaderState,
} from '@/lib/scroll-bridge';
import { SystemImmersionGate } from '@/components/preloader/SystemImmersionGate';
import { LivingBroadsheetHeader } from '@/components/editorial/LivingBroadsheetHeader';
import { HeroSpotlightAct } from '@/components/editorial/HeroSpotlightAct';
import { DiagnosisNewspaperAct } from '@/components/editorial/DiagnosisNewspaperAct';
import { AaaSBroadsheetAct } from '@/components/editorial/AaaSBroadsheetAct';
import { EnginesUnderLensAct } from '@/components/editorial/EnginesUnderLensAct';
import { VisionariesCastAct } from '@/components/editorial/VisionariesCastAct';
import { FoundingCircleAct } from '@/components/editorial/FoundingCircleAct';
import { MonumentalColophon } from '@/components/editorial/MonumentalColophon';

export default function BlondeGenesisPage() {
  const { isTransitioning } = useLocale();
  const [preloaderCleared, setPreloaderCleared] = useState(false);

  useEffect(() => {
    if (scrollBridge.preloaderOpening || scrollBridge.preloaderDone) {
      setPreloaderCleared(true);
    }
    return subscribePreloaderState(({ opening, done }) => {
      if (opening || done) {
        setPreloaderCleared(true);
      }
    });
  }, []);

  return (
    <>
      {/* Act 0: System Immersion Gate Preloader (<= 2.2s, optical iris + sound entry) */}
      <SystemImmersionGate />

      {/* Persistent Minimalist Header + Mobile Navigation Drawer */}
      <LivingBroadsheetHeader />

      {/* Continuous Single-Stage Broadsheet Flow over Persistent WebGL Liquid Metal */}
      <main
        id="broadsheet-main-stage"
        className={`relative z-10 bg-transparent transition-[opacity,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isTransitioning
            ? 'opacity-45 blur-[2px]'
            : !preloaderCleared
              ? 'opacity-90 blur-[12px]'
              : 'opacity-100 blur-0'
        }`}
      >
        {/* Act I: Hero — The Spotlight Break */}
        <HeroSpotlightAct />

        {/* Act II: The Newspaper Diagnosis — The Grey Crowd */}
        <DiagnosisNewspaperAct />

        {/* Act III: The AaaS Vision & Interaction #2 (Floating Beige Broadsheet + Optical Blade) */}
        <AaaSBroadsheetAct />

        {/* Act IV: Engineering Under the Lens & Interaction #4 (Fluted Emerald Glass + Vector Loupe) */}
        <EnginesUnderLensAct />

        {/* Act V: The Cast — Creators, Founders, Infoproducers & Coupled Verticals */}
        <VisionariesCastAct />

        {/* Act VI: The Founding Room — Mode B Private WhatsApp Circle & Roadmap */}
        <FoundingCircleAct />
      </main>

      {/* Act VII: Monumental Colophon Footer */}
      <MonumentalColophon />
    </>
  );
}
