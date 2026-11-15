'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const SESSION_SOUND_KEY = 'blonde_sound_enabled';

export class StudioSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private enabled = false;
  private lastBladeTickAt = 0;
  private lastLoupeAt = 0;
  private lastMetalHoverAt = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;

      try {
        this.ctx = new AudioCtx();
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(
          this.enabled ? 1.0 : 0.0001,
          this.ctx.currentTime
        );

        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
        this.noiseBuffer = this.createWhiteNoiseBuffer(this.ctx, 1.0);
      } catch {
        return null;
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private createWhiteNoiseBuffer(
    ctx: AudioContext,
    durationSec: number
  ): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private jitterPitch(baseHz: number): number {
    // ±4% organic pitch variation (anti-fatigue per como-criar/06)
    const factor = 1 + (Math.random() * 0.08 - 0.04);
    return baseHz * factor;
  }

  private jitterGain(baseGain: number): number {
    // ±1dB subtle dynamic variation
    const factor = 1 + (Math.random() * 0.16 - 0.08);
    return Math.max(0.001, baseGain * factor);
  }

  public setEnabled(next: boolean): boolean {
    this.enabled = next;
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(SESSION_SOUND_KEY, next ? '1' : '0');
      } catch {}
    }

    if (next) {
      const ctx = this.ensureContext();
      if (ctx && this.masterGain) {
        const now = ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(
          Math.max(0.0001, this.masterGain.gain.value),
          now
        );
        // 120ms smooth fade-in (never dry click)
        this.masterGain.gain.linearRampToValueAtTime(1.0, now + 0.12);
      }
    } else if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(
        Math.max(0.0001, this.masterGain.gain.value),
        now
      );
      // 120ms smooth fade-out
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.12);
    }

    return this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 1. irisOpen — Preloader exit: Sub-bass drop 110Hz -> 38Hz (650ms) + Bandpass White Noise 400Hz -> 1800Hz (420ms)
   */
  public irisOpen(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;

    // Sub-bass sine drop
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.65);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.28, now + 0.04);
    oscGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.65);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.68);

    // Bandpass noise sweep
    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.5, now);
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.42);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.001, now);
      nGain.gain.linearRampToValueAtTime(0.11, now + 0.05);
      nGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.42);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.45);
    }
  }

  /**
   * 2. shutterClick — Leica M6 micro-click (14ms highpass 2400Hz noise + Triangle 1600Hz -> 420Hz in 18ms)
   */
  public shutterClick(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const peakGain = this.jitterGain(0.07);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(this.jitterPitch(1600), now);
    osc.frequency.exponentialRampToValueAtTime(
      this.jitterPitch(420),
      now + 0.018
    );

    oscGain.gain.setValueAtTime(peakGain, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.018);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.022);

    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.setValueAtTime(2400, now);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(peakGain * 0.65, now);
      nGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.014);

      noise.connect(hp);
      hp.connect(nGain);
      nGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.016);
    }
  }

  /**
   * 3. bladeTick — Interaction #2 drag tick (9ms bandpass 3200Hz Q 6.0, pitch rises with splitPercent 0..100)
   */
  public bladeTick(splitPercent = 50): void {
    if (!this.enabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastBladeTickAt < 45) return;
    this.lastBladeTickAt = nowMs;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const clamped = Math.max(0, Math.min(100, splitPercent));
    const centerFreq = 2600 + (clamped / 100) * 1100;

    if (this.noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(this.jitterPitch(centerFreq), now);
      bp.Q.setValueAtTime(6.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.jitterGain(0.08), now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.011);

      noise.connect(bp);
      bp.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.014);
    }
  }

  /**
   * 4. loupeFocus — Interaction #4 optical glass slide + focus (Sine 520Hz -> 780Hz 90ms + Lowpass 900Hz 120ms)
   */
  public loupeFocus(): void {
    if (!this.enabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastLoupeAt < 180) return;
    this.lastLoupeAt = nowMs;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(this.jitterPitch(520), now);
    osc.frequency.exponentialRampToValueAtTime(
      this.jitterPitch(780),
      now + 0.09
    );

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.jitterGain(0.09), now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.11);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * 5. metalHover — Subtle harmonic resonance of liquid chrome (146.8Hz + 220.2Hz perfect fifth through Lowpass 380Hz)
   */
  public metalHover(): void {
    if (!this.enabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastMetalHoverAt < 380) return;
    this.lastMetalHoverAt = nowMs;

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, now);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0005, now);
    env.gain.linearRampToValueAtTime(0.032, now + 0.08);
    env.gain.exponentialRampToValueAtTime(0.0005, now + 0.36);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(146.8, now);
    osc2.frequency.setValueAtTime(220.2, now);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.38);
  }

  /**
   * 6. broadsheetTurn — Editorial Beige newspaper sheet reveal (Bandpass 650Hz -> 1200Hz, Q 1.2, 280ms)
   */
  public broadsheetTurn(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || !this.noiseBuffer) return;

    const now = ctx.currentTime;
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.setValueAtTime(1.2, now);
    bp.frequency.setValueAtTime(650, now);
    bp.frequency.exponentialRampToValueAtTime(1200, now + 0.28);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0005, now);
    gain.gain.linearRampToValueAtTime(0.085, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.28);

    noise.connect(bp);
    bp.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.3);
  }

  /**
   * 7. localeSwitch — Analog dial double click separated by 32ms (1900Hz -> 1400Hz)
   */
  public localeSwitch(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const triggerClick = (offset: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(this.jitterPitch(freq), now + offset);
      osc.frequency.exponentialRampToValueAtTime(480, now + offset + 0.016);

      gain.gain.setValueAtTime(0.085, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + offset + 0.016);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + offset);
      osc.stop(now + offset + 0.02);
    };

    triggerClick(0, 1900);
    triggerClick(0.032, 1400);
  }

  /**
   * 8. waitlistPulse — Warm authority chord (110Hz + 165Hz + 220Hz, attack 15ms, release 380ms, lowpass 750Hz)
   */
  public waitlistPulse(): void {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(750, now);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0008, now);
    env.gain.linearRampToValueAtTime(0.16, now + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0005, now + 0.38);

    const freqs = [110, 165, 220];
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      osc.connect(lp);
      osc.start(now);
      osc.stop(now + 0.4);
    });

    lp.connect(env);
    env.connect(this.masterGain);
  }
}

export const studioSound = new StudioSoundEngine();

interface StudioAudioContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  enableSoundWithIris: () => void;
  disableSound: () => void;
  playShutter: () => void;
  playBladeTick: (splitPercent?: number) => void;
  playLoupeFocus: () => void;
  playMetalHover: () => void;
  playBroadsheetTurn: () => void;
  playLocaleSwitch: () => void;
  playWaitlistPulse: () => void;
}

const StudioAudioContext = createContext<StudioAudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    // Per como-criar/06: Autoplay policy safe — start OFF until explicit user interaction
  }, []);

  const toggleSound = useCallback(() => {
    const next = ! studioSound.isEnabled();
    studioSound.setEnabled(next);
    setSoundEnabled(next);
    if (next) {
      studioSound.shutterClick();
    }
  }, []);

  const enableSoundWithIris = useCallback(() => {
    studioSound.setEnabled(true);
    setSoundEnabled(true);
    studioSound.irisOpen();
  }, []);

  const disableSound = useCallback(() => {
    studioSound.setEnabled(false);
    setSoundEnabled(false);
  }, []);

  const playShutter = useCallback(() => studioSound.shutterClick(), []);
  const playBladeTick = useCallback(
    (split?: number) => studioSound.bladeTick(split),
    []
  );
  const playLoupeFocus = useCallback(() => studioSound.loupeFocus(), []);
  const playMetalHover = useCallback(() => studioSound.metalHover(), []);
  const playBroadsheetTurn = useCallback(
    () => studioSound.broadsheetTurn(),
    []
  );
  const playLocaleSwitch = useCallback(() => studioSound.localeSwitch(), []);
  const playWaitlistPulse = useCallback(() => studioSound.waitlistPulse(), []);

  return React.createElement(
    StudioAudioContext.Provider,
    {
      value: {
        soundEnabled,
        toggleSound,
        enableSoundWithIris,
        disableSound,
        playShutter,
        playBladeTick,
        playLoupeFocus,
        playMetalHover,
        playBroadsheetTurn,
        playLocaleSwitch,
        playWaitlistPulse,
      },
    },
    children
  );
}

export function useStudioAudio(): StudioAudioContextValue {
  const context = useContext(StudioAudioContext);
  if (!context) {
    throw new Error('useStudioAudio must be used within an AudioProvider');
  }
  return context;
}
