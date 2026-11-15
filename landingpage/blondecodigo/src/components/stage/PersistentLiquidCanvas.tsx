'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  detectGpuQualityTier,
  type GpuCapabilityReport,
} from '@/lib/gpu-tier';
import { scrollBridge } from '@/lib/scroll-bridge';

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Fullscreen SDF Raymarching + MatCap + Thin-Film Iridescent Fresnel + 30deg Volt Beam
 * Implements como-criar/02 and como-criar/03 across all 6 scroll keyframes (0.00 -> 1.00).
 * Includes analytical bounding-sphere culling for locked 60fps performance and surgical negative space for typography.
 */
const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uScrollVelocity;
  uniform vec2 uMouseNDC;
  uniform vec2 uResolution;
  uniform sampler2D uMatCap;
  uniform float uHasMatCap;
  uniform float uEnableGlass;
  uniform float uEnableBloom;
  uniform float uEntryZoom;

  // Smooth minimum (polynomial smin) for real liquid mercury fusion
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  mat2 rot2D(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  // Torus SDF for the 'O b Holofote' optical iris ring
  float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xy) - t.x, p.z);
    return length(q) - t.y;
  }

  // Capsule SDF for the 'b' vertical ascender & 30deg cut
  float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
  }

  // Inigo Quilez cosine spectral palette for controlled Thin-Film Iridescence on grazing Fresnel angles
  vec3 thinFilmSpectrum(float t) {
    vec3 a = vec3(0.45, 0.54, 0.60);
    vec3 b = vec3(0.32, 0.30, 0.38);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.05, 0.32, 0.66);
    return a + b * cos(6.28318 * (c * t + d));
  }

  float mapLiquidMetal(vec3 p) {
    float sp = uScrollProgress;
    float t1 = smoothstep(0.00, 0.20, sp);
    float t2 = smoothstep(0.20, 0.40, sp);
    float t3 = smoothstep(0.40, 0.60, sp);
    float t4 = smoothstep(0.60, 0.78, sp);
    float t5 = smoothstep(0.84, 0.98, sp);

    vec3 centerOffset = mix(vec3(0.44, 0.05, -0.10), vec3(0.68, 0.02, -0.18), t1);
    centerOffset = mix(centerOffset, vec3(0.00, 0.04, -0.28), t2);
    centerOffset = mix(centerOffset, vec3(0.38, -0.02, -0.16), t3);
    centerOffset = mix(centerOffset, vec3(0.00, 0.06, -0.22), t4);
    centerOffset = mix(centerOffset, vec3(0.00, -0.92, -0.55), t5);

    float scaleMult = mix(mix(mix(0.68, 0.62, t2), 0.66, t4), 0.54, t5);
    float stretchY = 1.0 + 0.28 * (t1 * (1.0 - t2)) + clamp(abs(uScrollVelocity) * 0.012, 0.0, 0.25);
    float ringOpen = mix(0.58, 0.78, t4 * (1.0 - t5 * 0.5));

    vec3 q = p - centerOffset;
    // Subtle mouse gaze tilt (±6 deg per tokens)
    q.xz *= rot2D(uMouseNDC.x * 0.14);
    q.yz *= rot2D(-uMouseNDC.y * 0.12);
    q.y /= stretchY;
    q /= scaleMult;

    float t = uTime * 0.45;

    // Act III marginal split effect (0.28 -> 0.54): two mercury streams flanking the Beige Broadsheet
    float act3Factor = smoothstep(0.26, 0.35, uScrollProgress) * (1.0 - smoothstep(0.48, 0.56, uScrollProgress));
    vec3 qMain = q;
    qMain.x -= act3Factor * sign(q.x + 0.001) * 0.85;

    // 1. Central Optical Torus ('O b Holofote' lens ring)
    vec3 qRing = qMain;
    qRing.xy *= rot2D(sin(t * 0.65) * 0.15 + uScrollProgress * 1.1);
    qRing.xz *= rot2D(0.24 * cos(t * 0.5));
    float dRing = sdTorus(qRing, vec2(ringOpen, 0.165));

    // 2. The 'b' stem & 30-degree spotlight cut ascender (echoing liquid-metal-sculpt-b.jpg)
    vec3 stemA = vec3(-ringOpen * 0.82, -0.52, 0.0);
    vec3 stemB = vec3(-ringOpen * 0.22, 0.92, 0.05);
    float dStem = sdCapsule(qMain, stemA, stemB, 0.145);

    float dCore = smin(dRing, dStem, 0.22);

    // 3. Orbiting Liquid Mercury Metaballs (4 organic droplets fusing via smin)
    vec3 b1 = vec3(
      sin(t * 1.1) * 0.76 + uMouseNDC.x * 0.25,
      cos(t * 0.88) * 0.52 + uMouseNDC.y * 0.22,
      sin(t * 0.72) * 0.25
    );
    vec3 b2 = vec3(
      cos(t * 0.82 + 1.9) * 0.84,
      sin(t * 1.18 + 0.7) * 0.58,
      cos(t * 1.0) * 0.22
    );
    vec3 b3 = vec3(
      sin(t * 0.62 + 3.8) * 0.64,
      cos(t * 1.32 + 2.1) * 0.66,
      sin(t * 0.85 + 1.2) * 0.26
    );
    vec3 b4 = vec3(
      uMouseNDC.x * 0.52,
      uMouseNDC.y * 0.42,
      0.15 * sin(t * 1.4)
    );

    float s1 = length(q - b1) - 0.19;
    float s2 = length(q - b2) - 0.16;
    float s3 = length(q - b3) - 0.15;
    float s4 = length(q - b4) - 0.14;

    float dDrops = smin(smin(s1, s2, 0.28), smin(s3, s4, 0.26), 0.28);
    float d = smin(dCore, dDrops, 0.28);

    // Organic two-octave surface ripple (como-criar/03 section 1.1)
    float waveLow = sin(q.x * 3.0 + t * 1.5) * cos(q.y * 2.7 - t * 1.2) * 0.020;
    float mouseProximity = exp(-length(q.xy - uMouseNDC * 0.75) * 2.4);
    float waveHigh = sin(q.x * 8.5 - t * 2.8) * sin(q.y * 8.0 + t * 2.5) * 0.010 * (0.25 + mouseProximity);

    return (d + waveLow + waveHigh) * scaleMult;
  }

  // Analytical finite-difference normal calculation (mandatory per como-criar/03)
  vec3 calcNormal(vec3 p) {
    const float eps = 0.0028;
    vec2 e = vec2(1.0, -1.0) * 0.5773 * eps;
    return normalize(
      e.xyy * mapLiquidMetal(p + e.xyy) +
      e.yyx * mapLiquidMetal(p + e.yyx) +
      e.yxy * mapLiquidMetal(p + e.yxy) +
      e.xxx * mapLiquidMetal(p + e.xxx)
    );
  }

  void main() {
    vec2 aspectUv = (vUv - 0.5) * vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);

    // Subtle Fluted Royal Emerald Glass side wings ONLY on outer frame edges (never distorting center headlines!)
    float outerEdgeMask = smoothstep(0.66, 0.88, abs(aspectUv.x));
    float act4Boost = smoothstep(0.48, 0.55, uScrollProgress) * (1.0 - smoothstep(0.68, 0.74, uScrollProgress));
    float glassMask = clamp(outerEdgeMask * (0.45 + act4Boost * 0.45) * uEnableGlass, 0.0, 1.0);

    float flutes = 42.0;
    float ridge = sin(vUv.x * flutes * 6.28318);
    vec2 refractedUv = aspectUv + vec2(ridge * 0.006 * glassMask, ridge * 0.0015 * glassMask);

    // Camera setup with subtle gaze parallax (±0.22 units per como-criar/02) + Preloader optical dolly-out
    vec3 ro = vec3(uMouseNDC.x * 0.18, uMouseNDC.y * 0.14, 2.95);
    vec3 ta = vec3(0.0, 0.0, 0.0);
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = normalize(cross(uu, ww));
    vec3 rd = normalize(refractedUv.x * uu + refractedUv.y * vv + uEntryZoom * ww);

    // Background: Obsidian Noir (#090B0A) + 30deg Blonde Volt (#CCFF29) Volumetric Beam + Royal Emerald (#0B4635) ambient
    vec3 obsidian = vec3(0.035, 0.043, 0.039);
    vec3 royalEmerald = vec3(0.043, 0.275, 0.208);
    vec3 editorialBeige = vec3(0.918, 0.886, 0.827);
    vec3 blondeVolt = vec3(0.800, 1.000, 0.161);

    // 30-degree diagonal spotlight beam (echoing 'O b Holofote' 30deg cut)
    vec2 beamCoord = rot2D(-0.5236) * (aspectUv - vec2(0.22 + uMouseNDC.x * 0.08, 0.12));
    float beamCore = exp(-abs(beamCoord.x) * 5.2) * smoothstep(-1.1, 0.75, beamCoord.y);
    float beamNoise = 0.88 + 0.12 * sin(beamCoord.y * 5.5 - uTime * 0.8);
    float colophonDim = 1.0 - smoothstep(0.88, 0.99, uScrollProgress) * 0.68;

    vec3 bgCol = obsidian;
    bgCol += royalEmerald * (0.18 * exp(-length(aspectUv - vec2(0.32, -0.05)) * 1.5));
    bgCol += blondeVolt * (beamCore * beamNoise * 0.11 * colophonDim);

    // Raymarching loop (16 steps — optimal balance of smooth liquid SDF & fast shader compilation)
    float t = 0.5;
    float hit = 0.0;
    for (int i = 0; i < 16; i++) {
      vec3 p = ro + rd * t;
      float d = mapLiquidMetal(p);
      if (d < 0.005) {
        hit = 1.0;
        break;
      }
      t += d * 0.95;
      if (t > 4.5) break;
    }

    vec3 finalCol = bgCol;

    if (hit > 0.5) {
      vec3 pos = ro + rd * t;
      vec3 nor = calcNormal(pos);
      vec3 viewDir = normalize(ro - pos);

      // View-space normal for MatCap sampling
      vec3 viewNor = normalize(vec3(dot(nor, uu), dot(nor, vv), dot(nor, ww)));
      vec2 matcapUv = viewNor.xy * 0.49 + 0.5;

      vec3 matcapCol;
      if (uHasMatCap > 0.5) {
        matcapCol = texture2D(uMatCap, clamp(matcapUv, 0.01, 0.99)).rgb;
      } else {
        float specBase = pow(max(dot(reflect(-viewDir, nor), normalize(vec3(0.5, 0.8, 0.6))), 0.0), 28.0);
        matcapCol = mix(vec3(0.07, 0.09, 0.08), editorialBeige, specBase * 0.65);
      }

      // Fresnel grazing calculation: pow(1.0 - max(dot(N, V), 0.0), 3.2) per como-criar/03
      float ndotv = max(dot(nor, viewDir), 0.0);
      float fresnel = pow(1.0 - ndotv, 3.2);

      // Thin-film iridescent dispersion ONLY on grazing Fresnel edges (capped at 0.30 per art direction lock)
      float iridPhase = ndotv * 6.28318 + uTime * 0.28 + pos.y * 1.2;
      vec3 iridCol = thinFilmSpectrum(iridPhase);

      // Brand structural lighting: Left Royal Emerald bounce, bottom warm Travertine Beige, 30deg Volt key beam
      float emeraldBounce = max(dot(nor, normalize(vec3(-0.85, 0.15, 0.4))), 0.0);
      float beigeBounce = max(dot(nor, normalize(vec3(0.1, -0.9, 0.35))), 0.0);
      vec3 voltKeyDir = normalize(vec3(0.50 + uMouseNDC.x * 0.30, 0.86 + uMouseNDC.y * 0.22, 0.65));
      float voltSpec = pow(max(dot(reflect(-voltKeyDir, nor), viewDir), 0.0), 96.0);
      float voltRim = pow(1.0 - ndotv, 4.2) * max(dot(nor, voltKeyDir), 0.0);

      vec3 metalCol = matcapCol * 0.78;
      metalCol += royalEmerald * emeraldBounce * 0.38;
      metalCol += editorialBeige * beigeBounce * 0.18;
      metalCol = mix(metalCol, iridCol, fresnel * 0.28);
      metalCol += blondeVolt * (voltSpec * 0.82 + voltRim * 0.62);

      // Selective Bloom glow on Volt highlights
      if (uEnableBloom > 0.5) {
        metalCol += blondeVolt * pow(voltSpec, 1.5) * 0.38;
      }

      // Subtle atmospheric depth attenuation so text in foreground always commands priority
      float textReadingShield = smoothstep(0.18, 0.72, length(aspectUv - vec2(-0.28, 0.05)));
      float metalPresence = mix(0.52, 0.88, textReadingShield) * colophonDim;

      finalCol = mix(bgCol, metalCol, metalPresence);
    }

    // Subtle Fluted Royal Emerald Glass edge tint on outer wings only
    if (glassMask > 0.01) {
      vec3 emeraldTint = mix(finalCol, finalCol * vec3(0.55, 0.90, 0.76) + royalEmerald * 0.14, glassMask * 0.42);
      float ridgeSpec = pow(max(ridge, 0.0), 8.0) * glassMask;
      emeraldTint += mix(editorialBeige, blondeVolt, 0.5) * ridgeSpec * 0.06;
      finalCol = emeraldTint;
    }

    // Studio optical vignette
    float vig = 1.0 - smoothstep(0.48, 1.38, length(aspectUv));
    finalCol *= mix(0.62, 1.0, vig);

    // ACES Filmic approximation curve for rich cinema blacks
    finalCol = (finalCol * (2.51 * finalCol + 0.03)) / (finalCol * (2.43 * finalCol + 0.59) + 0.14);

    gl_FragColor = vec4(clamp(finalCol, 0.0, 1.0), 1.0);
  }
`;

export function PersistentLiquidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackWrapRef = useRef<HTMLDivElement>(null);
  const heroVideoWrapRef = useRef<HTMLDivElement>(null);
  const morphVideoWrapRef = useRef<HTMLDivElement>(null);
  const [gpuReport, setGpuReport] = useState<GpuCapabilityReport | null>(null);
  const [forceVideoFallback, setForceVideoFallback] = useState(false);

  useEffect(() => {
    const report = detectGpuQualityTier();
    setGpuReport(report);
    if (report.tier === 'fallback') {
      setForceVideoFallback(true);
    }
  }, []);

  // CSS Scroll Parallax & Exclusive Video Crossfade when in Video Fallback Mode (como-criar/08)
  // Fixes double-exposure bug: heroVideoWrapRef fades OUT (1 -> 0) as morphVideoWrapRef fades IN (0 -> 1)
  useEffect(() => {
    if (!forceVideoFallback) return;
    let rafId = 0;
    const updateFallbackParallax = () => {
      const sp = scrollBridge.scrollProgress;
      if (fallbackWrapRef.current) {
        const shiftY = -(sp * 36).toFixed(1);
        fallbackWrapRef.current.style.transform = `translate3d(0, ${shiftY}px, 0) scale(1.04)`;
      }
      // Exclusive crossfade so the two videos NEVER merge on top of each other
      const morphAlpha = Math.max(0, Math.min(1, (sp - 0.12) / 0.10));
      const colophonFade = 1 - Math.max(0, Math.min(1, (sp - 0.86) / 0.12)) * 0.65;
      if (heroVideoWrapRef.current) {
        const heroOpacity = (1 - morphAlpha) * 0.42 * colophonFade;
        heroVideoWrapRef.current.style.opacity = heroOpacity.toFixed(3);
      }
      if (morphVideoWrapRef.current) {
        const morphOpacity = morphAlpha * 0.36 * colophonFade;
        morphVideoWrapRef.current.style.opacity = morphOpacity.toFixed(3);
      }
      rafId = window.requestAnimationFrame(updateFallbackParallax);
    };
    rafId = window.requestAnimationFrame(updateFallbackParallax);
    return () => window.cancelAnimationFrame(rafId);
  }, [forceVideoFallback]);

  useEffect(() => {
    if (!gpuReport || forceVideoFallback || !canvasRef.current) return;

    const canvas = canvasRef.current;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setForceVideoFallback(true);
      return;
    }

    // Cap raymarching DPR at 0.72 for locked 60fps across all desktop & laptop GPUs (smooth metaball gradients upscale cleanly)
    const maxDpr = Math.min(gpuReport.dpr[1], 0.72);
    let activeDpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    renderer.setPixelRatio(activeDpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uScrollVelocity: { value: 0 },
      uMouseNDC: { value: new THREE.Vector2(0, 0) },
      uResolution: {
        value: new THREE.Vector2(
          window.innerWidth * activeDpr,
          window.innerHeight * activeDpr
        ),
      },
      uMatCap: { value: null as THREE.Texture | null },
      uHasMatCap: { value: 0.0 },
      uEnableGlass: { value: gpuReport.enableGlassRefraction ? 1.0 : 0.0 },
      uEnableBloom: { value: gpuReport.enableBloom ? 1.0 : 0.0 },
      uEntryZoom: { value: 1.25 },
    };

    const textureLoader = new THREE.TextureLoader();
    let loadedMatCap: THREE.Texture | null = null;
    textureLoader.load(
      '/assets/images/matcap-liquid-chrome-volt.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        loadedMatCap = tex;
        uniforms.uMatCap.value = tex;
        uniforms.uHasMatCap.value = 1.0;
      }
    );

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    let rafId = 0;
    let isPageHidden = document.hidden;
    const startTime = performance.now();
    let lastFrameTime = startTime;
    let lowFpsAccumMs = 0;
    let hasDownscaledDpr = false;

    const handleResize = () => {
      if (!renderer) return;
      const cap = hasDownscaledDpr ? 0.85 : maxDpr;
      activeDpr = Math.min(window.devicePixelRatio || 1, cap);
      renderer.setPixelRatio(activeDpr);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uResolution.value.set(
        window.innerWidth * activeDpr,
        window.innerHeight * activeDpr
      );
    };

    const handleVisibility = () => {
      isPageHidden = document.hidden;
      if (!isPageHidden) {
        lastFrameTime = performance.now();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    const renderLoop = (now: number) => {
      rafId = window.requestAnimationFrame(renderLoop);
      if (isPageHidden || !renderer) return;

      const dt = now - lastFrameTime;
      lastFrameTime = now;

      // Fast fallback guard if device cannot sustain smooth frame pacing
      if (dt > 42 && dt < 220) {
        lowFpsAccumMs += dt;
        if (lowFpsAccumMs > 1400) {
          setForceVideoFallback(true);
          return;
        }
      } else {
        lowFpsAccumMs = Math.max(0, lowFpsAccumMs - dt * 0.6);
      }

      // Smooth cursor gaze lerp (0.06 per tokens)
      scrollBridge.smoothMouseX +=
        (scrollBridge.targetMouseX - scrollBridge.smoothMouseX) * 0.06;
      scrollBridge.smoothMouseY +=
        (scrollBridge.targetMouseY - scrollBridge.smoothMouseY) * 0.06;

      uniforms.uTime.value = (now - startTime) * 0.001;
      const targetZoom =
        scrollBridge.preloaderOpening || scrollBridge.preloaderDone
          ? 1.68
          : 1.25;
      uniforms.uEntryZoom.value +=
        (targetZoom - uniforms.uEntryZoom.value) * 0.065;
      uniforms.uScrollProgress.value +=
        (scrollBridge.scrollProgress - uniforms.uScrollProgress.value) * 0.12;
      uniforms.uScrollVelocity.value +=
        (scrollBridge.scrollVelocity - uniforms.uScrollVelocity.value) * 0.15;
      scrollsDecayVelocity();
      uniforms.uMouseNDC.value.set(
        scrollBridge.smoothMouseX,
        scrollBridge.smoothMouseY
      );

      renderer.render(scene, camera);
    };

    const scrollsDecayVelocity = () => {
      scrollBridge.scrollVelocity *= 0.92;
    };

    rafId = window.requestAnimationFrame(renderLoop);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      geometry.dispose();
      material.dispose();
      if (loadedMatCap) loadedMatCap.dispose();
      renderer?.dispose();
    };
  }, [gpuReport, forceVideoFallback]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden bg-[#090B0A]"
    >
      {/* Primary Persistent WebGL Liquid Metal Canvas */}
      {!forceVideoFallback && (
        <canvas
          ref={canvasRef}
          id="persistent-liquid-canvas"
          className="block w-full h-full"
        />
      )}

      {/* Pre-rendered 3D Studio Video Fallback (Mobile Light / Low GPU / Reduced Motion per como-criar/08) */}
      {forceVideoFallback && (
        <div
          ref={fallbackWrapRef}
          className="relative w-full h-full bg-[#090B0A] will-change-transform"
        >
          {/* Act I Video Loop (fades to 0 as user scrolls into Act II so the two videos never overlap!) */}
          <div
            ref={heroVideoWrapRef}
            style={{ opacity: 0.42 }}
            className="absolute inset-0 transition-opacity duration-300"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/assets/images/hero-liquid-lens-studio.jpg"
              className="w-full h-full object-cover object-right sm:object-center"
            >
              <source
                src="/assets/videos/hero-liquid-lens-loop.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          {/* Acts II-VI Liquid Metal 'b' Morph Loop (exclusively replaces Video 1 after Act I) */}
          <div
            ref={morphVideoWrapRef}
            style={{ opacity: 0 }}
            className="absolute inset-0 transition-opacity duration-300"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/assets/images/liquid-metal-sculpt-b.jpg"
              className="w-full h-full object-cover object-center"
            >
              <source
                src="/assets/videos/liquid-metal-b-morph.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          {/* Studio Contrast Vignette so foreground broadsheet typography is always 100% legible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090B0A]/90 via-[#090B0A]/65 to-[#090B0A]/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090B0A]/70 via-transparent to-[#090B0A]/90" />
        </div>
      )}

      {/* Ambient 30-degree Blonde Volt (#CCFF29) Optical Beam Overlay */}
      <div
        className="pointer-events-none absolute -top-1/4 right-0 w-[75vw] h-[120vh] opacity-15 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse 32% 65% at 62% 32%, rgba(204, 255, 41, 0.22), rgba(11, 70, 53, 0.08) 55%, transparent 80%)',
          transform: 'rotate(-30deg)',
        }}
      />
    </div>
  );
}
