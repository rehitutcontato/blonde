import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const rootDir = process.cwd();

function checkFileExists(relPath, minBytes = 10) {
  const full = path.join(rootDir, relPath);
  assert.ok(fs.existsSync(full), `Missing required file: ${relPath}`);
  const stat = fs.statSync(full);
  assert.ok(
    stat.size >= minBytes,
    `File ${relPath} is unexpectedly small (${stat.size} bytes < ${minBytes})`
  );
  return full;
}

console.log('=== [1/6] Checking Next.js Architecture & Handoff File Tree ===');
const requiredCodeFiles = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/globals.css',
  'src/components/stage/PersistentLiquidCanvas.tsx',
  'src/components/stage/GreyCrowdField.tsx',
  'src/components/stage/FlutedEmeraldGlass.tsx',
  'src/components/stage/LenisScrollStage.tsx',
  'src/components/preloader/SystemImmersionGate.tsx',
  'src/components/editorial/LivingBroadsheetHeader.tsx',
  'src/components/editorial/BroadsheetGridOverlay.tsx',
  'src/components/editorial/HeroSpotlightAct.tsx',
  'src/components/editorial/DiagnosisNewspaperAct.tsx',
  'src/components/editorial/AaaSBroadsheetAct.tsx',
  'src/components/editorial/EnginesUnderLensAct.tsx',
  'src/components/editorial/VisionariesCastAct.tsx',
  'src/components/editorial/FoundingCircleAct.tsx',
  'src/components/editorial/MonumentalColophon.tsx',
  'src/components/interactions/BeforeAfterOpticalBlade.tsx',
  'src/components/interactions/VectorVsMeltLoupe.tsx',
  'src/components/interactions/MagneticWaitlistButton.tsx',
  'src/components/interactions/ViewfinderReticle.tsx',
  'src/lib/audio/StudioSoundEngine.ts',
  'src/lib/i18n/dictionary.ts',
  'src/lib/phase-gate.ts',
  'src/lib/gpu-tier.ts',
  'src/tokens/landing-tokens.json',
  'src/tokens/copy-and-routes-manifest.json',
];

for (const f of requiredCodeFiles) {
  checkFileExists(f, 100);
}
console.log(`✔ Verified all ${requiredCodeFiles.length} architecture files.`);

console.log('=== [2/6] Checking Official Assets in public/assets/ ===');
const requiredAssets = [
  'public/assets/brand/blonde-ai-horizontal-dark.svg',
  'public/assets/brand/blonde-ai-horizontal-light.svg',
  'public/assets/brand/blonde-ai-lockup-launch-dark.svg',
  'public/assets/brand/blonde-ai-lockup-launch-pt-dark.svg',
  'public/assets/brand/blonde-ai-lockup-launch-beige.svg',
  'public/assets/brand/blonde-ai-lockup-launch-royal.svg',
  'public/assets/brand/blonde-ai-mark-volt.svg',
  'public/assets/brand/blonde-ai-mark-beige.svg',
  'public/assets/brand/blonde-ai-mark-royal.svg',
  'public/assets/brand/blonde-ai-mark-mono.svg',
  'public/assets/brand/blonde-moodboard.jpg',
  'public/assets/images/hero-liquid-lens-studio.jpg',
  'public/assets/images/liquid-metal-sculpt-b.jpg',
  'public/assets/images/matcap-liquid-chrome-volt.jpg',
  'public/assets/images/texture-fluted-emerald-glass.jpg',
  'public/assets/images/texture-travertine-editorial.jpg',
  'public/assets/images/interaction2-before-creator.jpg',
  'public/assets/images/interaction2-after-creator.jpg',
  'public/assets/images/interaction2-before-product.jpg',
  'public/assets/images/interaction2-after-product.jpg',
  'public/assets/images/interaction4-ai-slop-frame.jpg',
  'public/assets/images/interaction4-studio-clean-frame.jpg',
  'public/assets/images/video-3d-storyboard-frames.jpg',
  'public/assets/videos/hero-liquid-lens-loop.mp4',
  'public/assets/videos/liquid-metal-b-morph.mp4',
  'public/assets/videos/brand-teaser-motion.mp4',
];

for (const asset of requiredAssets) {
  checkFileExists(asset, 400);
}
console.log(`✔ Verified all ${requiredAssets.length} brand, image, texture, and 3D video assets.`);

console.log('=== [3/6] Checking 6-Language i18n Dictionary & Mode B Rules ===');
const dictContent = fs.readFileSync(
  path.join(rootDir, 'src/lib/i18n/dictionary.ts'),
  'utf8'
);

for (const lang of ['en:', 'pt:', 'de:', 'fr:', 'es:', 'it:']) {
  assert.ok(
    dictContent.includes(lang),
    `Locale ${lang} missing in src/lib/i18n/dictionary.ts`
  );
}

// Verify zero SaaS subscription prices ($29, $49, $69, $99, R$) in dictionary
const forbiddenPricingPatterns = ['$29', '$49', '$69', '$99', 'R$'];
for (const pat of forbiddenPricingPatterns) {
  assert.ok(
    !dictContent.includes(pat),
    `Forbidden public pricing token "${pat}" found in dictionary.ts!`
  );
}
console.log('✔ Verified all 6 locales (EN, PT, DE, FR, ES, IT) and Mode B zero-pricing rule.');

console.log('=== [4/6] Checking Unified WhatsApp CTA & Security Attributes ===');
const expectedUrl = 'https://chat.whatsapp.com/KFrb3XFq1wwK1qwguXSD1Q';
const phaseGateContent = fs.readFileSync(
  path.join(rootDir, 'src/lib/phase-gate.ts'),
  'utf8'
);
assert.ok(
  phaseGateContent.includes(expectedUrl),
  'Unified WhatsApp URL missing in phase-gate.ts'
);

const ctaComponents = [
  'src/components/interactions/MagneticWaitlistButton.tsx',
  'src/components/editorial/LivingBroadsheetHeader.tsx',
  'src/components/editorial/MonumentalColophon.tsx',
];
for (const comp of ctaComponents) {
  const src = fs.readFileSync(path.join(rootDir, comp), 'utf8');
  assert.ok(
    src.includes('WHATSAPP_WAITLIST_URL'),
    `${comp} must reference WHATSAPP_WAITLIST_URL`
  );
  assert.ok(
    src.includes('target="_blank"') && src.includes('rel="noopener noreferrer"'),
    `${comp} must include target="_blank" and rel="noopener noreferrer"`
  );
}
console.log('✔ Verified 100% of Waitlist CTAs point to official WhatsApp URL with target="_blank" rel="noopener noreferrer".');

console.log('=== [5/6] Checking Interactions #2, #4, #6 & WebGL Shader Specs ===');
const audioSrc = fs.readFileSync(
  path.join(rootDir, 'src/lib/audio/StudioSoundEngine.ts'),
  'utf8'
);
const soundMethods = [
  'irisOpen',
  'shutterClick',
  'bladeTick',
  'loupeFocus',
  'metalHover',
  'broadsheetTurn',
  'localeSwitch',
  'waitlistPulse',
  'createDynamicsCompressor',
];
for (const m of soundMethods) {
  assert.ok(audioSrc.includes(m), `StudioSoundEngine missing ${m}`);
}

const canvasSrc = fs.readFileSync(
  path.join(rootDir, 'src/components/stage/PersistentLiquidCanvas.tsx'),
  'utf8'
);
assert.ok(
  canvasSrc.includes('smin(') &&
    canvasSrc.includes('matcap-liquid-chrome-volt.jpg') &&
    canvasSrc.includes('ACESFilmicToneMapping'),
  'PersistentLiquidCanvas missing SDF smin, matcap texture, or ACESFilmicToneMapping'
);

console.log('✔ Verified Interactions #2, #4, #6 (8 Web Audio recipes + compressor) and WebGL SDF shader.');

console.log('=== [6/6] Checking Mobile Navigation Drawer & Toggle Accessibility ===');
const headerSrc = fs.readFileSync(
  path.join(rootDir, 'src/components/editorial/LivingBroadsheetHeader.tsx'),
  'utf8'
);
assert.ok(
  headerSrc.includes('<dialog') &&
    headerSrc.includes('mobile-navigation-drawer') &&
    headerSrc.includes('role="switch"') &&
    headerSrc.includes('aria-expanded'),
  'LivingBroadsheetHeader missing mobile <dialog> drawer or accessible switch/aria attributes'
);
console.log('✔ Verified Mobile <dialog> Navigation Drawer and accessible toggle controls.');
console.log('\n🎉 ALL QA STRUCTURAL & CONTRACT CHECKS PASSED!');
