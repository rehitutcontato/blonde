export type GpuQualityTier = 'high' | 'medium' | 'fallback';

export interface GpuCapabilityReport {
  tier: GpuQualityTier;
  dpr: [number, number];
  enableRaymarching: boolean;
  enableGlassRefraction: boolean;
  enableBloom: boolean;
  prefersReducedMotion: boolean;
  isMobileViewport: boolean;
  reason: string;
}

export function detectGpuQualityTier(): GpuCapabilityReport {
  if (typeof window === 'undefined') {
    return {
      tier: 'high',
      dpr: [1, 1.5],
      enableRaymarching: true,
      enableGlassRefraction: true,
      enableBloom: true,
      prefersReducedMotion: false,
      isMobileViewport: false,
      reason: 'ssr-default',
    };
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const isMobileViewport = window.innerWidth < 768;

  const nav = window.navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  const saveData = Boolean(nav.connection?.saveData);
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;

  // Check WebGL availability
  let webglAvailable = false;
  let isSoftwareRenderer = false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    if (gl && 'getParameter' in gl) {
      webglAvailable = true;
      const debugInfo = (gl as WebGLRenderingContext).getExtension(
        'WEBGL_debug_renderer_info'
      );
      if (debugInfo) {
        const renderer = String(
          (gl as WebGLRenderingContext).getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
          ) || ''
        ).toLowerCase();
        if (
          renderer.includes('swiftshader') ||
          renderer.includes('llvmpipe') ||
          renderer.includes('software')
        ) {
          isSoftwareRenderer = true;
        }
      }
    }
  } catch {
    webglAvailable = false;
  }

  if (
    !webglAvailable ||
    prefersReducedMotion ||
    saveData ||
    isSoftwareRenderer
  ) {
    return {
      tier: 'fallback',
      dpr: [1, 1],
      enableRaymarching: false,
      enableGlassRefraction: false,
      enableBloom: false,
      prefersReducedMotion,
      isMobileViewport,
      reason: !webglAvailable
        ? 'no-webgl'
        : prefersReducedMotion
          ? 'reduced-motion'
          : saveData
            ? 'save-data'
            : 'software-renderer',
    };
  }

  if (isMobileViewport) {
    // On mobile (<768px): use lightweight hybrid mode (video loop + optimized shader accents) per como-criar/08
    if (cores <= 4 || memory <= 3) {
      return {
        tier: 'fallback',
        dpr: [1, 1],
        enableRaymarching: false,
        enableGlassRefraction: false,
        enableBloom: false,
        prefersReducedMotion,
        isMobileViewport: true,
        reason: 'mobile-low-spec',
      };
    }
    return {
      tier: 'medium',
      dpr: [1, 1.25],
      enableRaymarching: true,
      enableGlassRefraction: false,
      enableBloom: false,
      prefersReducedMotion,
      isMobileViewport: true,
      reason: 'mobile-capable',
    };
  }

  if (window.innerWidth < 1024 || cores <= 6 || memory < 4) {
    return {
      tier: 'medium',
      dpr: [1, 1.25],
      enableRaymarching: true,
      enableGlassRefraction: true,
      enableBloom: false,
      prefersReducedMotion,
      isMobileViewport: false,
      reason: 'medium-laptop-or-tablet',
    };
  }

  return {
    tier: 'high',
    dpr: [1, 1.75],
    enableRaymarching: true,
    enableGlassRefraction: true,
    enableBloom: true,
    prefersReducedMotion: false,
    isMobileViewport: false,
    reason: 'desktop-high-tier',
  };
}
