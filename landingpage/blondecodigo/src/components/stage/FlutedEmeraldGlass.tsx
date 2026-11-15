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
      ? 'bg-[#06231A]/94'
      : intensity === 'medium'
        ? 'bg-[#07281E]/90'
        : 'bg-[#082C21]/78';

  return (
    <Tag
      className={clsx(
        'relative overflow-hidden border border-[#13634C]/85 backdrop-blur-xl shadow-[0_28px_90px_rgba(9,11,10,0.88)]',
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
