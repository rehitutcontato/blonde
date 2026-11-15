'use client';

import React from 'react';
import clsx from 'clsx';

interface FlutedEmeraldGlassProps {
  children?: React.ReactNode;
  className?: string;
  fluteCount?: number;
  intensity?: 'subtle' | 'medium' | 'strong';
  as?: 'div' | 'section' | 'article';
}

export function FlutedEmeraldGlass({
  children,
  className,
  intensity = 'medium',
  as: Tag = 'div',
}: FlutedEmeraldGlassProps) {
  const bgOpacity =
    intensity === 'strong'
      ? 'bg-[#0B4635]/78'
      : intensity === 'medium'
        ? 'bg-[#0B4635]/62'
        : 'bg-[#0B4635]/42';

  return (
    <Tag
      className={clsx(
        'relative overflow-hidden border border-[#13634C]/65 backdrop-blur-md shadow-[0_24px_80px_rgba(9,11,10,0.72)]',
        bgOpacity,
        className
      )}
    >
      {/* Architectural Fluted Emerald Glass Ridges (32-48 cylindrical ribs + subtle 30deg Volt caustic) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45 mix-blend-soft-light fluted-emerald-ribs"
      />
      <div
        aria-hidden="true"
        style={{
          backgroundImage: 'url(/assets/images/texture-fluted-emerald-glass.jpg)',
        }}
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.14] mix-blend-luminosity"
      />
      {/* Top 30deg Specular Rim Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#CCFF29]/55 to-transparent"
      />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}
