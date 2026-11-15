export type GpuQualityTier = 'high' | 'medium' | 'fallback';

export interface GpuCapabilityReport {
  tier: GpuQualityTier;
  dpr: [number, number];
  enableRaymarching: boolean;
  enableGlassRefraction: boolean;
  enableBloom: boolean;
  prefersReducedMotion: boolean;
  isMobileViewport: boolean;
  rendererLabel: string;
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
      rendererLabel: 'ssr',
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
  let rendererLabel = 'unknown';

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
        rendererLabel = String(
          (gl as WebGLRenderingContext).getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
          ) || 'webgl'
        );
        const lower = rendererLabel.toLowerCase();
        if (
          lower.includes('swiftshader') ||
          lower.includes('llvmpipe') ||
          lower.includes('software') ||
          lower.includes('basic render')
        ) {
          isSoftwareRenderer = true;
        }
      }
    }
  } catch {
    webglAvailable = false;
  }

  // Only fall back to static/video mode if WebGL is unavailable, user prefers reduced motion, or data-saver is active
  if (!webglAvailable || prefersReducedMotion || saveData) {
    return {
      tier: 'fallback',
      dpr: [1, 1],
      enableRaymarching: false,
      enableGlassRefraction: false,
      enableBloom: false,
      prefersReducedMotion,
      isMobileViewport,
      rendererLabel,
      reason: !webglAvailable
        ? 'no-webgl'
        : prefersReducedMotion
          ? 'reduced-motion'
          : 'save-data',
    };
  }

  // Lightweight 3D Mesh WebGL runs smoothly on mobile, integrated laptops, and software renderers
  if (isMobileViewport || isSoftwareRenderer || window.innerWidth < 1024 || cores <= 6 || memory < 4) {
    return {
      tier: 'medium',
      dpr: [1, isMobileViewport ? 1.15 : 1.25],
      enableRaymarching: false,
      enableGlassRefraction: !isMobileViewport && !isSoftwareRenderer,
      enableBloom: false,
      prefersReducedMotion,
      isMobileViewport,
      rendererLabel,
      reason: isSoftwareRenderer
        ? 'software-webgl-optimized-mesh'
        : isMobileViewport
          ? 'mobile-optimized-mesh'
          : 'medium-laptop-or-tablet',
    };
  }

  return {
    tier: 'high',
    dpr: [1, 1.5],
    enableRaymarching: true,
    enableGlassRefraction: true,
    enableBloom: true,
    prefersReducedMotion: false,
    isMobileViewport: false,
    rendererLabel,
    reason: 'desktop-high-tier',
  };
}
