import landingTokens from '@/tokens/landing-tokens.json';
import copyManifest from '@/tokens/copy-and-routes-manifest.json';

export type PhaseGateStage =
  | 'PHASE_0_WAITLIST_MODE_B'
  | 'PHASE_1_FOUNDER_DROP'
  | 'PHASE_2_PUBLIC_LAUNCH';

export interface PhaseGateConfig {
  currentPhase: PhaseGateStage;
  showPublicPricing: boolean;
  showFounderSlotsCounter: boolean;
  showFounderTeaserBadge: boolean;
  ctaMode: 'WHATSAPP_WAITLIST' | 'FOUNDER_PRESALE' | 'APP_AUTH_OR_STRIPE';
  whatsappWaitlistUrl: string;
  targetDomainFuture: string;
  milestones: {
    betaV05DateIso: string;
    officialLaunchMonthIso: string;
  };
}

const activeStage =
  (process.env.NEXT_PUBLIC_PHASE_GATE as PhaseGateStage | undefined) ||
  (landingTokens.phaseGateFlags.currentPhase as PhaseGateStage) ||
  'PHASE_0_WAITLIST_MODE_B';

export const PHASE_GATE_CONFIG: PhaseGateConfig = {
  currentPhase: activeStage,
  // Mode B Golden Rule: Zero public pricing or plans during Waitlist Phase 0
  showPublicPricing: activeStage === 'PHASE_2_PUBLIC_LAUNCH',
  showFounderSlotsCounter: activeStage === 'PHASE_1_FOUNDER_DROP',
  showFounderTeaserBadge: activeStage !== 'PHASE_0_WAITLIST_MODE_B',
  ctaMode:
    activeStage === 'PHASE_2_PUBLIC_LAUNCH'
      ? 'APP_AUTH_OR_STRIPE'
      : activeStage === 'PHASE_1_FOUNDER_DROP'
        ? 'FOUNDER_PRESALE'
        : 'WHATSAPP_WAITLIST',
  whatsappWaitlistUrl:
    copyManifest.cta.url ||
    landingTokens.phaseGateFlags.whatsappWaitlistUrl ||
    'https://chat.whatsapp.com/KFrb3XFq1wwK1qwguXSD1Q',
  targetDomainFuture: copyManifest.brand.targetDomainFuture || 'blonde.ai',
  milestones: {
    betaV05DateIso: landingTokens.phaseGateFlags.milestones.betaV05DateIso,
    officialLaunchMonthIso:
      landingTokens.phaseGateFlags.milestones.officialLaunchMonthIso,
  },
};

export const WHATSAPP_WAITLIST_URL =
  'https://chat.whatsapp.com/KFrb3XFq1wwK1qwguXSD1Q';
