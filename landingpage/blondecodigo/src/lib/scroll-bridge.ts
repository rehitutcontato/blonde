'use client';

export interface ScrollBridgeState {
  scrollY: number;
  scrollProgress: number; // 0.000 -> 1.000 across the whole page
  scrollVelocity: number; // smoothed instantaneous velocity from Lenis
  targetMouseX: number; // NDC -1..+1
  targetMouseY: number; // NDC -1..+1
  smoothMouseX: number; // lerped (0.06) NDC -1..+1
  smoothMouseY: number; // lerped (0.06) NDC -1..+1
  pointerFine: boolean;
  preloaderDone: boolean;
  activeAct: number; // 1..7
}

export const scrollBridge: ScrollBridgeState = {
  scrollY: 0,
  scrollProgress: 0,
  scrollVelocity: 0,
  targetMouseX: 0,
  targetMouseY: 0,
  smoothMouseX: 0,
  smoothMouseY: 0,
  pointerFine: false,
  preloaderDone: false,
  activeAct: 1,
};

export function computeActiveAct(progress: number): number {
  if (progress < 0.14) return 1;
  if (progress < 0.3) return 2;
  if (progress < 0.52) return 3;
  if (progress < 0.72) return 4;
  if (progress < 0.82) return 5;
  if (progress < 0.92) return 6;
  return 7;
}
