'use client';

import React from 'react';

export function BroadsheetGridOverlay() {
  return (
    <>
      {/* Continuous 1px Capillary Newspaper Vertical Grid (Charles Leclerc / Swiss Broadsheet Grammar) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[2] mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12"
      >
        <div className="grid h-full w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 border-x border-[#EAE2D3]/[0.07]">
          <div className="border-r border-[#EAE2D3]/[0.05] h-full" />
          <div className="hidden md:block border-r border-[#EAE2D3]/[0.05] h-full" />
          <div className="hidden md:block border-r border-[#EAE2D3]/[0.05] h-full" />
          <div className="hidden lg:block border-r border-[#EAE2D3]/[0.05] h-full" />
          <div className="hidden lg:block border-r border-[#EAE2D3]/[0.05] h-full" />
          <div className="h-full" />
        </div>
      </div>

      {/* Global 35mm Cinema Film & Editorial Paper Grain Overlay (opacity: 0.035, pointer-events: none) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[45] opacity-[0.035] mix-blend-overlay cinema-grain-overlay"
      />
    </>
  );
}
