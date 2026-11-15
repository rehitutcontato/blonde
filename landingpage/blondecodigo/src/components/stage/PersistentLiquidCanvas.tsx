'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  detectGpuQualityTier,
  type GpuCapabilityReport,
} from '@/lib/gpu-tier';
import { scrollBridge } from '@/lib/scroll-bridge';

/**
 * Custom Organic Liquid Metal Vertex Shader (como-criar/03 Section 1.1)
 * - Two-octave 3D organic mercury ripple + cursor proximity displacement + scroll velocity stretch
 * - Includes polynomial smin() smooth field bulge and finite-difference normal recalculation
 *   so MatCap & thin-film iridescent reflections flow like real liquid mercury at 60fps.
 */
const LIQUID_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uScrollProgress;
  uniform vec2 uMouseNDC;
  uniform float uRippleAmp;
  uniform float uStretchY;

  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPos;
  varying float vCrest;

  // Smooth minimum (polynomial smin) for liquid mercury proximity bulge
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / max(k, 0.0001), 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float liquidField(vec3 p, vec3 n) {
    float t = uTime * 0.55;
    float velBoost = clamp(abs(uScrollVelocity) * 0.015, 0.0, 0.35);

    // Octave 1: viscous long-wavelength mercury swell
    float wave1 = sin(p.x * 2.3 + t * 1.15) * cos(p.y * 2.1 - t * 0.95) * sin(p.z * 2.4 + t * 0.85);
    // Octave 2: tighter surface tension ripples driven by cursor & scroll velocity
    float wave2 = sin(p.x * 5.6 - t * 2.1 + uMouseNDC.x * 2.2) * cos(p.y * 5.2 + t * 1.8 - uMouseNDC.y * 2.0);

    // Smooth smin-like organic droplet pull toward cursor axis
    float dCenter = length(p.xy);
    float dCursor = length(p.xy - uMouseNDC * 0.95);
    float mergedPull = smin(dCenter, dCursor + 0.35, 0.45);
    float cursorSwell = exp(-mergedPull * 1.4) * 0.055;

    float disp = (wave1 * 0.045 + wave2 * (0.016 + velBoost * 0.025) + cursorSwell) * uRippleAmp;
    return disp;
  }

  vec3 deformPoint(vec3 pos, vec3 nor) {
    float d = liquidField(pos, nor);
    vec3 p = pos + nor * d;
    p.y *= uStretchY;
    return p;
  }

  void main() {
    vec3 baseNor = normalize(normal);
    float d0 = liquidField(position, baseNor);
    vec3 displaced = position + baseNor * d0;
    displaced.y *= uStretchY;

    // Orthonormal tangent basis for finite-difference normal recalculation
    vec3 upVec = abs(baseNor.y) < 0.92 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 t1 = normalize(cross(upVec, baseNor));
    vec3 t2 = normalize(cross(baseNor, t1));

    const float eps = 0.028;
    vec3 p1 = deformPoint(position + t1 * eps, baseNor);
    vec3 p2 = deformPoint(position + t2 * eps, baseNor);
    vec3 recalcNormal = normalize(cross(p1 - displaced, p2 - displaced));
    if (dot(recalcNormal, baseNor) < 0.0) {
      recalcNormal = -recalcNormal;
    }

    vec4 mvPos = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPos.xyz;
    vViewNormal = normalize(normalMatrix * recalcNormal);
    vWorldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
    vCrest = clamp(d0 * 14.0 + 0.5, 0.0, 1.0);

    gl_Position = projectionMatrix * mvPos;
  }
`;

/**
 * Iridescent Dark Liquid Chrome Fragment Shader (como-criar/03 Section 1.2)
 * - Samples matcap-liquid-chrome-volt.jpg via recalculated View-Space normals
 * - Fresnel Thin-Film Iridescence (Inigo Quilez cosine spectrum) strictly on grazing rims
 * - Dynamic 30deg Blonde Volt (#CCFF29) cursor spotlight + Royal Emerald & Travertine studio bounce
 */
const LIQUID_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uMatCap;
  uniform float uHasMatCap;
  uniform vec2 uMouseNDC;
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uEmeraldBoost;
  uniform float uGlobalDim;
  uniform float uVoltRimBoost;

  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPos;
  varying float vCrest;

  vec3 thinFilmSpectrum(float t) {
    vec3 a = vec3(0.44, 0.52, 0.60);
    vec3 b = vec3(0.32, 0.30, 0.40);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.06, 0.34, 0.68);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec3 N = normalize(vViewNormal);
    vec3 V = normalize(vViewPosition);

    // 1. Calibrated Studio MatCap lookup
    vec2 matcapUv = N.xy * 0.485 + 0.5;
    vec3 matcapCol;
    if (uHasMatCap > 0.5) {
      matcapCol = texture2D(uMatCap, clamp(matcapUv, 0.01, 0.99)).rgb;
    } else {
      float specFallback = pow(max(dot(reflect(-V, N), normalize(vec3(0.5, 0.85, 0.6))), 0.0), 32.0);
      matcapCol = mix(vec3(0.06, 0.08, 0.07), vec3(0.92, 0.89, 0.83), specFallback * 0.72);
    }

    // 2. Grazing Fresnel factor (pow 3.2 per como-criar/03)
    float ndotv = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - ndotv, 3.2);

    // 3. Controlled Thin-Film Iridescence on grazing edges (capped <= 0.36)
    float iridPhase = ndotv * 6.28318 + uTime * 0.28 + vWorldPos.y * 0.85 + vCrest * 0.6;
    vec3 iridCol = thinFilmSpectrum(iridPhase);

    // 4. Brand Structural Studio Lights
    vec3 royalEmerald = vec3(0.043, 0.275, 0.208);
    vec3 editorialBeige = vec3(0.918, 0.886, 0.827);
    vec3 blondeVolt = vec3(0.800, 1.000, 0.161);

    float emeraldBounce = max(dot(N, normalize(vec3(-0.85, 0.15, 0.45))), 0.0);
    float beigeBounce = max(dot(N, normalize(vec3(0.15, -0.92, 0.35))), 0.0);

    // 5. Dynamic 30deg Cursor Spotlight (shininess 96.0)
    vec3 voltKeyDir = normalize(vec3(0.52 + uMouseNDC.x * 0.38, 0.86 + uMouseNDC.y * 0.28, 0.65));
    float voltSpec = pow(max(dot(reflect(-voltKeyDir, N), V), 0.0), 96.0);
    float voltRim = pow(1.0 - ndotv, 3.8) * max(dot(N, voltKeyDir), 0.0);

    vec3 col = matcapCol * 0.92;
    col += royalEmerald * emeraldBounce * (0.42 + uEmeraldBoost * 0.55);
    col += editorialBeige * beigeBounce * 0.20;
    col = mix(col, iridCol, fresnel * 0.34);
    col += blondeVolt * (voltSpec * 0.95 + voltRim * (0.72 + uVoltRimBoost * 0.35));

    col *= uGlobalDim;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Volumetric 30-degree Blonde Volt Beam Shader (como-criar/03 Section 3)
 */
const BEAM_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BEAM_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;

  void main() {
    float centerDist = abs(vUv.x - 0.5) * 2.0;
    float core = exp(-centerDist * centerDist * 14.0);
    float softHalo = exp(-centerDist * centerDist * 3.2) * 0.38;
    float verticalFade = smoothstep(0.0, 0.28, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
    float dustShimmer = 0.86 + 0.14 * sin(vUv.y * 9.0 - uTime * 0.85) * cos(vUv.x * 12.0 + uTime * 0.4);

    vec3 volt = vec3(0.800, 1.000, 0.161);
    vec3 emerald = vec3(0.043, 0.275, 0.208);
    vec3 col = mix(emerald, volt, clamp(core * 1.4, 0.0, 1.0));

    float alpha = (core * 0.26 + softHalo * 0.12) * verticalFade * dustShimmer * uIntensity;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

/**
 * Fluted Royal Emerald Architectural Glass Wing Shader (como-criar/03 Section 2)
 */
const GLASS_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLASS_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;

  void main() {
    float flutes = 34.0;
    float phase = vUv.x * flutes * 6.28318;
    float ridge = sin(phase);
    float highlight = pow(max(ridge, 0.0), 6.0);
    float chroma = pow(max(sin(phase + 0.35), 0.0), 8.0);

    vec3 emeraldDark = vec3(0.025, 0.16, 0.12);
    vec3 emeraldBright = vec3(0.05, 0.34, 0.25);
    vec3 voltTip = vec3(0.80, 1.00, 0.16);

    vec3 col = mix(emeraldDark, emeraldBright, 0.5 + 0.5 * ridge);
    col += voltTip * highlight * 0.22;
    col += vec3(0.22, 0.89, 0.84) * chroma * 0.08;

    float edgeFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    float vFade = smoothstep(0.0, 0.14, vUv.y) * smoothstep(1.0, 0.86, vUv.y);
    float alpha = (0.34 + highlight * 0.28) * edgeFade * vFade * uOpacity;

    gl_FragColor = vec4(col, alpha);
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

  // CSS Scroll Parallax & Exclusive Video Crossfade ONLY when in Fallback mode (no-WebGL / reduced-motion / save-data)
  useEffect(() => {
    if (!forceVideoFallback) return;
    let rafId = 0;
    const updateFallbackParallax = () => {
      const sp = scrollBridge.scrollProgress;
      if (fallbackWrapRef.current) {
        const shiftY = -(sp * 36).toFixed(1);
        fallbackWrapRef.current.style.transform = `translate3d(0, ${shiftY}px, 0) scale(1.04)`;
      }
      const morphAlpha = Math.max(0, Math.min(1, (sp - 0.12) / 0.10));
      const colophonFade =
        1 - Math.max(0, Math.min(1, (sp - 0.86) / 0.12)) * 0.65;
      if (heroVideoWrapRef.current) {
        const heroOpacity = (1 - morphAlpha) * 0.55 * colophonFade;
        heroVideoWrapRef.current.style.opacity = heroOpacity.toFixed(3);
      }
      if (morphVideoWrapRef.current) {
        const morphOpacity = morphAlpha * 0.48 * colophonFade;
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
        antialias: gpuReport.tier === 'high',
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setForceVideoFallback(true);
      return;
    }

    const isHigh = gpuReport.tier === 'high';
    const maxDpr = isHigh ? 1.5 : 1.15;
    const activeDpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    renderer.setPixelRatio(activeDpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x090b0a, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      Math.max(window.innerWidth, 1) / Math.max(window.innerHeight, 1),
      0.1,
      40
    );
    let currentEntryZoom = 1.18;
    camera.position.set(0, 0, 5.2);

    // Load calibrated studio MatCap texture (matcap-liquid-chrome-volt.jpg)
    const textureLoader = new THREE.TextureLoader();
    let loadedMatCap: THREE.Texture | null = null;
    textureLoader.load('/assets/images/matcap-liquid-chrome-volt.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      loadedMatCap = tex;
      liquidUniforms.uMatCap.value = tex;
      liquidUniforms.uHasMatCap.value = 1.0;
    });

    const liquidUniforms = {
      uMatCap: { value: null as THREE.Texture | null },
      uHasMatCap: { value: 0.0 },
      uMouseNDC: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uScrollProgress: { value: 0 },
      uRippleAmp: { value: 1.0 },
      uStretchY: { value: 1.0 },
      uEmeraldBoost: { value: 0.0 },
      uGlobalDim: { value: 1.0 },
      uVoltRimBoost: { value: 0.0 },
      uEntryZoom: { value: 1.18 },
    };

    const liquidMat = new THREE.ShaderMaterial({
      vertexShader: LIQUID_VERTEX_SHADER,
      fragmentShader: LIQUID_FRAGMENT_SHADER,
      uniforms: liquidUniforms,
    });

    // Dark anodized inner anamorphic optical ring & Volt bevel accents
    const lensRingMat = new THREE.MeshBasicMaterial({
      color: 0x111513,
      transparent: true,
      opacity: 0.92,
    });
    const voltRimMat = new THREE.MeshBasicMaterial({
      color: 0xccff29,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    // Primary Sculpted 'O b Holofote' Group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // 1. Liquid Chrome Optical Torus ('O')
    const torusGeo = new THREE.TorusGeometry(
      0.86,
      0.24,
      isHigh ? 48 : 28,
      isHigh ? 128 : 72
    );
    const torusMesh = new THREE.Mesh(torusGeo, liquidMat);
    sculptureGroup.add(torusMesh);

    // 2. Inner Anamorphic Aperture Housing & 30deg Precision Bevel
    const innerRingGeo = new THREE.TorusGeometry(
      0.56,
      0.045,
      16,
      isHigh ? 96 : 56
    );
    const innerRingMesh = new THREE.Mesh(innerRingGeo, lensRingMat);
    sculptureGroup.add(innerRingMesh);

    const innerVoltGeo = new THREE.TorusGeometry(
      0.62,
      0.012,
      10,
      isHigh ? 96 : 56
    );
    const innerVoltMesh = new THREE.Mesh(innerVoltGeo, voltRimMat);
    sculptureGroup.add(innerVoltMesh);

    // 3. The 'b' Slanted 30-degree Ascender Stem + Top Volt Cut
    const stemGeo = new THREE.CapsuleGeometry(
      0.165,
      1.68,
      isHigh ? 16 : 10,
      isHigh ? 32 : 20
    );
    const stemMesh = new THREE.Mesh(stemGeo, liquidMat);
    stemMesh.position.set(-0.62, 0.72, 0.04);
    stemMesh.rotation.z = -0.42; // echoes the 30-degree spotlight cut in liquid-metal-sculpt-b.jpg
    sculptureGroup.add(stemMesh);

    // Crisp Volt Rim Slash along the 'b' 30-degree cut edge
    const slashGeo = new THREE.CylinderGeometry(0.014, 0.014, 1.85, 12);
    const slashMesh = new THREE.Mesh(slashGeo, voltRimMat);
    slashMesh.position.set(-0.78, 0.78, 0.14);
    slashMesh.rotation.z = -0.42;
    sculptureGroup.add(slashMesh);

    // 4. Orbiting Liquid Mercury Droplets (5 organic metaball spheres)
    const dropletGeo = new THREE.IcosahedronGeometry(1, isHigh ? 4 : 3);
    const dropletConfigs = [
      { radius: 0.24, orbitR: 1.55, speed: 0.72, phase: 0.2, yAmp: 0.65 },
      { radius: 0.18, orbitR: 1.82, speed: -0.58, phase: 2.1, yAmp: 0.85 },
      { radius: 0.14, orbitR: 1.38, speed: 0.92, phase: 3.9, yAmp: 0.55 },
      { radius: 0.12, orbitR: 2.05, speed: -0.44, phase: 5.1, yAmp: 0.75 },
      { radius: 0.21, orbitR: 1.25, speed: 0.48, phase: 1.3, yAmp: 0.45 },
    ];
    const droplets = dropletConfigs.map((cfg) => {
      const m = new THREE.Mesh(dropletGeo, liquidMat);
      m.scale.setScalar(cfg.radius);
      scene.add(m);
      return { mesh: m, cfg };
    });

    // 5. Flanking Split Stream Mirror Group (for Act III editorial margins)
    const mirrorStreamGeo = new THREE.TorusGeometry(
      0.58,
      0.19,
      isHigh ? 32 : 20,
      isHigh ? 72 : 48
    );
    const leftStream = new THREE.Mesh(mirrorStreamGeo, liquidMat);
    const rightStream = new THREE.Mesh(mirrorStreamGeo, liquidMat);
    leftStream.visible = false;
    rightStream.visible = false;
    scene.add(leftStream);
    scene.add(rightStream);

    // 6. Volumetric 30-degree Blonde Volt Beam Plane
    const beamUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
    };
    const beamGeo = new THREE.PlaneGeometry(3.2, 11.0);
    const beamMat = new THREE.ShaderMaterial({
      vertexShader: BEAM_VERTEX_SHADER,
      fragmentShader: BEAM_FRAGMENT_SHADER,
      uniforms: beamUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(1.1, 0.2, -1.8);
    beamMesh.rotation.z = -0.5236; // Exact 30 degrees (-pi/6)
    scene.add(beamMesh);

    // 7. Fluted Royal Emerald Architectural Glass Side Wings (como-criar/03 Section 2)
    const glassUniforms = {
      uTime: { value: 0 },
      uOpacity: { value: 0.35 },
    };
    const glassGeo = new THREE.PlaneGeometry(2.1, 6.8);
    const glassMat = new THREE.ShaderMaterial({
      vertexShader: GLASS_VERTEX_SHADER,
      fragmentShader: GLASS_FRAGMENT_SHADER,
      uniforms: glassUniforms,
      transparent: true,
      depthWrite: false,
    });
    const leftGlassWing = new THREE.Mesh(glassGeo, glassMat);
    const rightGlassWing = new THREE.Mesh(glassGeo, glassMat);
    leftGlassWing.position.set(-3.4, 0, -0.8);
    rightGlassWing.position.set(3.4, 0, -0.8);
    const showGlassWings = gpuReport.enableGlassRefraction;
    leftGlassWing.visible = showGlassWings;
    rightGlassWing.visible = showGlassWings;
    scene.add(leftGlassWing);
    scene.add(rightGlassWing);

    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let rafId = 0;
    let isPageHidden = document.hidden;
    const startTime = performance.now();
    let lastFrameTime = startTime;
    let lowFpsAccumMs = 0;

    const handleResize = () => {
      if (!renderer) return;
      const w = Math.max(window.innerWidth, 1);
      const h = Math.max(window.innerHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const handleVisibility = () => {
      isPageHidden = document.hidden;
      if (!isPageHidden) {
        lastFrameTime = performance.now();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    let smoothedScroll = scrollBridge.scrollProgress;
    let smoothedVel = 0;

    const renderLoop = (now: number) => {
      rafId = window.requestAnimationFrame(renderLoop);
      if (isPageHidden || !renderer) return;

      const dt = now - lastFrameTime;
      lastFrameTime = now;
      const elapsedSinceStart = now - startTime;

      // Only activate emergency video fallback AFTER 3s warm-up if hardware sustains < 14 FPS
      if (elapsedSinceStart > 3000) {
        if (dt > 70 && dt < 260) {
          lowFpsAccumMs += dt;
          if (lowFpsAccumMs > 3800) {
            setForceVideoFallback(true);
            return;
          }
        } else {
          lowFpsAccumMs = Math.max(0, lowFpsAccumMs - dt * 0.5);
        }
      }

      // Smooth cursor gaze & scroll state
      scrollBridge.smoothMouseX +=
        (scrollBridge.targetMouseX - scrollBridge.smoothMouseX) * 0.06;
      scrollBridge.smoothMouseY +=
        (scrollBridge.targetMouseY - scrollBridge.smoothMouseY) * 0.06;

      smoothedScroll += (scrollBridge.scrollProgress - smoothedScroll) * 0.1;
      smoothedVel += (scrollBridge.scrollVelocity - smoothedVel) * 0.14;
      scrollBridge.scrollVelocity *= 0.92;

      const elapsed = elapsedSinceStart * 0.001;
      const mx = scrollBridge.smoothMouseX;
      const my = scrollBridge.smoothMouseY;
      const sp = smoothedScroll;
      const isPortrait = camera.aspect < 0.9;

      // Preloader optical dolly-out (uEntryZoom)
      const targetZoom =
        scrollBridge.preloaderOpening || scrollBridge.preloaderDone
          ? 1.56
          : 1.18;
      currentEntryZoom += (targetZoom - currentEntryZoom) * 0.065;
      liquidUniforms.uEntryZoom.value = currentEntryZoom;

      // Camera gaze micro-parallax (±0.22 units per como-criar/02)
      camera.position.x = mx * 0.22;
      camera.position.y = my * 0.16;
      camera.position.z = 5.2 - (currentEntryZoom - 1.18) * 1.4;
      camera.lookAt(0, 0, 0);

      // 6-Act Scroll Choreography (como-criar/02 Section 4)
      const t1 = smoothstep(0.0, 0.18, sp); // Act I -> Act II
      const t2 = smoothstep(0.18, 0.36, sp); // Act II -> Act III (split)
      const t3 = smoothstep(0.46, 0.62, sp); // Act III -> Act IV (emerald lens)
      const t4 = smoothstep(0.66, 0.80, sp); // Act IV -> Act V-VI (founding halo)
      const t5 = smoothstep(0.86, 0.99, sp); // Act VI -> Act VII (colophon sink)

      const heroX = isPortrait ? 0.05 : 0.92;
      let targetX = lerp(heroX, isPortrait ? 0.35 : 1.38, t1);
      targetX = lerp(targetX, 0.0, t2);
      targetX = lerp(targetX, isPortrait ? -0.1 : -0.35, t3);
      targetX = lerp(targetX, 0.0, t4);

      const targetY = lerp(0.08, 0.05, t3) - t5 * 1.65;
      const baseScale = isPortrait ? 0.78 : 1.0;
      const actScale =
        baseScale *
        lerp(1.0, 0.92, t2) *
        lerp(1.0, 1.08, t4) *
        lerp(1.0, 0.78, t5);

      const act3Split =
        smoothstep(0.26, 0.34, sp) * (1.0 - smoothstep(0.48, 0.56, sp));
      const act4Emerald =
        smoothstep(0.48, 0.56, sp) * (1.0 - smoothstep(0.70, 0.78, sp));
      const act6VoltPulse =
        smoothstep(0.72, 0.80, sp) * (1.0 - smoothstep(0.88, 0.96, sp));

      // Apply sculptural positioning & rotation
      sculptureGroup.position.set(targetX, targetY, -act3Split * 1.2);
      sculptureGroup.scale.setScalar(actScale * (1.0 - act3Split * 0.45));
      sculptureGroup.rotation.y =
        mx * 0.28 + Math.sin(elapsed * 0.4) * 0.14 + sp * 1.3;
      sculptureGroup.rotation.x =
        -my * 0.22 + Math.cos(elapsed * 0.32) * 0.1;
      sculptureGroup.rotation.z = Math.sin(elapsed * 0.25) * 0.06;

      // Inner aperture gentle counter-rotation
      innerRingMesh.rotation.z = -elapsed * 0.18 + sp * 2.4;
      innerVoltMesh.rotation.z = elapsed * 0.25;

      // Act III Dual Margin Liquid Streams
      const showSplitStreams = act3Split > 0.04;
      leftStream.visible = showSplitStreams;
      rightStream.visible = showSplitStreams;
      if (showSplitStreams) {
        const marginX = (isPortrait ? 1.45 : 2.55) * act3Split;
        leftStream.position.set(-marginX, Math.sin(elapsed * 0.6) * 0.25, -0.3);
        rightStream.position.set(marginX, -Math.sin(elapsed * 0.6) * 0.25, -0.3);
        leftStream.rotation.set(elapsed * 0.3, 0.4, elapsed * 0.15);
        rightStream.rotation.set(-elapsed * 0.3, -0.4, -elapsed * 0.15);
        leftStream.scale.setScalar(act3Split * (isPortrait ? 0.65 : 0.92));
        rightStream.scale.setScalar(act3Split * (isPortrait ? 0.65 : 0.92));
      }

      // Orbiting Liquid Mercury Droplets
      for (let i = 0; i < droplets.length; i++) {
        const { mesh, cfg } = droplets[i];
        const ang = elapsed * cfg.speed + cfg.phase + sp * 2.2;
        const r = cfg.orbitR * actScale;
        mesh.position.set(
          targetX + Math.cos(ang) * r + mx * 0.35,
          targetY + Math.sin(ang * 0.85) * cfg.yAmp * actScale + my * 0.28,
          Math.sin(ang * 1.1) * 0.65
        );
        const pulseScale = cfg.radius * actScale * (0.9 + 0.15 * Math.sin(elapsed * 1.8 + i));
        mesh.scale.setScalar(pulseScale);
        mesh.rotation.set(elapsed * 0.3 + i, elapsed * 0.4, 0);
      }

      // Update Uniforms
      liquidUniforms.uTime.value = elapsed;
      liquidUniforms.uScrollVelocity.value = smoothedVel;
      liquidUniforms.uScrollProgress.value = sp;
      liquidUniforms.uMouseNDC.value.set(mx, my);
      liquidUniforms.uStretchY.value =
        1.0 +
        0.32 * (t1 * (1.0 - t2)) +
        Math.min(0.22, Math.abs(smoothedVel) * 0.012);
      liquidUniforms.uRippleAmp.value = 1.0 + act4Emerald * 0.35;
      liquidUniforms.uEmeraldBoost.value = act4Emerald;
      liquidUniforms.uVoltRimBoost.value = act6VoltPulse;
      liquidUniforms.uGlobalDim.value = 1.0 - t5 * 0.58;

      // 30deg Volumetric Beam & Fluted Glass Wings
      beamUniforms.uTime.value = elapsed;
      beamUniforms.uIntensity.value =
        (0.85 + act6VoltPulse * 0.35) * (1.0 - t5 * 0.65);
      beamMesh.position.x = lerp(1.05, 0.25, t4) + mx * 0.18;

      if (showGlassWings) {
        glassUniforms.uTime.value = elapsed;
        glassUniforms.uOpacity.value = 0.28 + act4Emerald * 0.62 - t5 * 0.2;
        const wingX = isPortrait ? 2.2 : 3.25 - act4Emerald * 0.35;
        leftGlassWing.position.x = -wingX + mx * -0.1;
        rightGlassWing.position.x = wingX + mx * 0.1;
      }

      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(renderLoop);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      torusGeo.dispose();
      innerRingGeo.dispose();
      innerVoltGeo.dispose();
      stemGeo.dispose();
      slashGeo.dispose();
      dropletGeo.dispose();
      mirrorStreamGeo.dispose();
      beamGeo.dispose();
      glassGeo.dispose();
      liquidMat.dispose();
      lensRingMat.dispose();
      voltRimMat.dispose();
      beamMat.dispose();
      glassMat.dispose();
      if (loadedMatCap) loadedMatCap.dispose();
      renderer?.dispose();
    };
  }, [gpuReport, forceVideoFallback]);

  return (
    <div
      aria-hidden="true"
      data-testid="persistent-liquid-stage"
      data-engine={forceVideoFallback ? 'video-fallback' : 'webgl'}
      data-tier={gpuReport?.tier ?? 'initializing'}
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

      {/* Pre-rendered 3D Studio Video Fallback (Reduced Motion / Save-Data / No-WebGL per como-criar/08) */}
      {forceVideoFallback && (
        <div
          ref={fallbackWrapRef}
          className="relative w-full h-full bg-[#090B0A] will-change-transform"
        >
          <div
            ref={heroVideoWrapRef}
            style={{ opacity: 0.55 }}
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

          <div className="absolute inset-0 bg-gradient-to-r from-[#090B0A]/85 via-[#090B0A]/55 to-[#090B0A]/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090B0A]/65 via-transparent to-[#090B0A]/85" />
        </div>
      )}

      {/* Ambient 30-degree Blonde Volt (#CCFF29) Optical Beam Accent */}
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
