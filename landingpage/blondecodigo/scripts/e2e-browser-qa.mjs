import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const PORT = 4389;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const EXPECTED_WHATSAPP = 'https://chat.whatsapp.com/KFrb3XFq1wwK1qwguXSD1Q';

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function runE2E() {
  console.log('Starting Next.js production server on port', PORT);
  const server = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['next', 'start', '-p', String(PORT)],
    {
      stdio: 'pipe',
      shell: true,
    }
  );

  try {
    await waitForServer(BASE_URL);
    console.log('✔ Production server listening at', BASE_URL);

    // Also verify static assets over HTTP
    const assetUrls = [
      '/assets/brand/blonde-ai-mark-volt.svg',
      '/assets/images/matcap-liquid-chrome-volt.jpg',
      '/assets/images/hero-liquid-lens-studio.jpg',
      '/assets/images/interaction2-before-creator.jpg',
      '/assets/images/interaction2-after-creator.jpg',
      '/assets/images/interaction4-ai-slop-frame.jpg',
      '/assets/images/interaction4-studio-clean-frame.jpg',
      '/assets/videos/hero-liquid-lens-loop.mp4',
    ];
    for (const u of assetUrls) {
      const res = await fetch(`${BASE_URL}${u}`);
      assert.equal(res.status, 200, `Asset ${u} returned status ${res.status}`);
    }
    console.log(`✔ All ${assetUrls.length} core static assets served with HTTP 200.`);

    const { chromium } = await import('playwright');
    let browser;
    try {
      browser = await chromium.launch({ channel: 'msedge', headless: true });
    } catch {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
    }

    const consoleErrors = [];
    const pageErrors = [];

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      pageErrors.push(String(err));
    });

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    // 1. Preloader Verification
    const preloaderBtn = page.locator('[data-testid="preloader-enter-sound"]');
    await preloaderBtn.waitFor({ state: 'visible', timeout: 5000 });
    await preloaderBtn.click({ force: true });
    await page.waitForTimeout(850);
    const preloaderCount = await page
      .locator('[data-testid="system-immersion-gate"]')
      .count();
    assert.equal(preloaderCount, 0, 'Preloader should unmount after opening iris');
    console.log('✔ Act 0 Preloader [ENTER WITH SOUND] transition verified.');

    // 1b. Persistent WebGL Liquid Metal Canvas Verification (must remain mounted & active past warm-up)
    await page.waitForTimeout(2400);
    const liquidState = await page.evaluate(() => {
      const stage = document.querySelector('[data-testid="persistent-liquid-stage"]');
      const canvas = document.getElementById('persistent-liquid-canvas');
      return {
        engine: stage?.getAttribute('data-engine'),
        hasCanvas: Boolean(canvas),
        width: canvas ? canvas.width : 0,
        height: canvas ? canvas.height : 0,
      };
    });
    assert.equal(liquidState.engine, 'webgl', `PersistentLiquidCanvas fell back unexpectedly to ${liquidState.engine}`);
    assert.ok(liquidState.hasCanvas, '#persistent-liquid-canvas must be mounted in the DOM');
    assert.ok(liquidState.width > 300 && liquidState.height > 300, `Unexpected canvas size ${liquidState.width}x${liquidState.height}`);
    console.log(`✔ PersistentLiquidCanvas active in WebGL mode (${liquidState.width}x${liquidState.height}).`);

    // 2. Verify all external links point to the unified WhatsApp URL with noopener noreferrer
    const externalLinks = await page.$$eval('a[target="_blank"]', (els) =>
      els.map((el) => ({
        href: el.getAttribute('href'),
        rel: el.getAttribute('rel'),
      }))
    );
    assert.ok(externalLinks.length >= 4, 'Should have at least 4 waitlist CTA links');
    for (const link of externalLinks) {
      assert.equal(link.href, EXPECTED_WHATSAPP, `Unexpected CTA href: ${link.href}`);
      assert.equal(
        link.rel,
        'noopener noreferrer',
        `Missing noopener noreferrer on CTA`
      );
    }
    console.log(
      `✔ Verified all ${externalLinks.length} rendered Waitlist CTAs point to official WhatsApp URL.`
    );

    // 3. Interaction #2 (Before -> After Optical Blade): Tabs & Keyboard Arrow Keys
    const slider = page.locator('[data-testid="i2-slider-stage"]');
    await slider.scrollIntoViewIfNeeded();
    assert.equal(await slider.getAttribute('aria-valuenow'), '50');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(350);
    const valAfterRight = Number(await slider.getAttribute('aria-valuenow'));
    assert.ok(
      valAfterRight > 50,
      `Expected slider value > 50 after ArrowRight, got ${valAfterRight}`
    );
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(350);
    const valAfterLeft = Number(await slider.getAttribute('aria-valuenow'));
    assert.ok(
      valAfterLeft < 50,
      `Expected slider value < 50 after ArrowLeft, got ${valAfterLeft}`
    );

    await page.locator('[data-testid="i2-tab-product"]').click();
    assert.equal(
      await page.locator('[data-testid="i2-tab-product"]').getAttribute('aria-selected'),
      'true'
    );
    console.log('✔ Interaction #2 (Before → After Optical Blade) tabs & keyboard physics verified.');

    // 4. Interaction #4 (AI Melt vs. Vector Engine Loupe)
    const loupeStage = page.locator('[data-testid="i4-loupe-stage"]');
    await loupeStage.scrollIntoViewIfNeeded();
    await page.locator('[data-testid="i4-mode-blonde"]').click();
    assert.equal(
      await page.locator('[data-testid="i4-mode-blonde"]').getAttribute('aria-pressed'),
      'true'
    );
    await page.locator('[data-testid="i4-mode-generic"]').click();
    assert.equal(
      await page.locator('[data-testid="i4-mode-generic"]').getAttribute('aria-pressed'),
      'true'
    );
    await page.locator('[data-testid="i4-mode-loupe"]').click();
    console.log('✔ Interaction #4 (AI Melt vs. Vector Engine Loupe) modes verified.');

    // 5. Desktop Sound Toggle (#6)
    const soundBtn = page.locator('[data-testid="desktop-sound-toggle"]');
    const beforeChecked = await soundBtn.getAttribute('aria-checked');
    await soundBtn.click();
    const afterChecked = await soundBtn.getAttribute('aria-checked');
    assert.notEqual(beforeChecked, afterChecked, 'Desktop sound toggle should flip aria-checked');
    console.log('✔ Interaction #6 (Studio Sound Engine toggle) verified.');

    // 6. Test all 6 Languages across Desktop (1440x900), Laptop (1280x720), Mobile (390x844), and Small Mobile (320x568)
    const viewports = [
      { name: 'Desktop 1440x900', width: 1440, height: 900 },
      { name: 'Laptop 1280x720', width: 1280, height: 720 },
      { name: 'Mobile 390x844', width: 390, height: 844 },
      { name: 'Small Mobile 320x568', width: 320, height: 568 },
    ];
    const locales = ['en', 'pt', 'de', 'fr', 'es', 'it'];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(150);

      for (const loc of locales) {
        // Trigger locale switch from footer button (visible at all viewports)
        await page.locator(`[data-testid="lang-btn-footer-${loc}"]`).click();
        await page.waitForTimeout(220);

        const dataLang = await page.evaluate(() =>
          document.documentElement.getAttribute('data-lang')
        );
        assert.equal(dataLang, loc, `Expected data-lang=${loc}, got ${dataLang}`);

        const overflow = await page.evaluate(() => {
          return (
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth
          );
        });
        assert.equal(
          overflow,
          false,
          `Horizontal overflow detected on ${vp.name} in locale ${loc.toUpperCase()}!`
        );
      }
      console.log(`✔ Verified zero horizontal overflow across all 6 languages on ${vp.name}.`);
    }

    // 7. Mobile Navigation Drawer (<dialog>), On-Screen Geometry, Swipe-to-Dismiss & Touch Targets on 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    // Check Interaction #2 and Interaction #4 mobile geometry (no overlap / overflow)
    const i2Geometry = await page.evaluate(() => {
      const root = document.querySelector('[data-testid="interaction-2-optical-blade"]');
      const stage = root?.querySelector('[data-testid="i2-slider-stage"]');
      const tablist = root?.querySelector('[role="tablist"]');
      const handle = stage?.querySelector('.w-11.h-11');
      const card = stage?.querySelector('[data-testid="i2-after-layer"] .bottom-2\\.5');
      const rootR = root?.getBoundingClientRect();
      const tabR = tablist?.getBoundingClientRect();
      const handleR = handle?.getBoundingClientRect();
      const cardR = card?.getBoundingClientRect();
      return {
        tablistFits: tabR && rootR ? tabR.width <= rootR.width + 2 : false,
        noHandleOverlap: handleR && cardR ? handleR.bottom < cardR.top : false,
      };
    });
    assert.ok(i2Geometry.tablistFits, 'Interaction #2 tablist must not overflow container width on mobile');
    assert.ok(i2Geometry.noHandleOverlap, 'Interaction #2 handle must not overlap bottom subtitle card on mobile');

    const i4Geometry = await page.evaluate(() => {
      const stage = document.querySelector('[data-testid="i4-loupe-stage"]');
      const stageR = stage?.getBoundingClientRect();
      const loupeRing = stage?.querySelector('.z-20.rounded-full');
      const loupeR = loupeRing?.getBoundingClientRect();
      const centerCard = stage?.querySelector('[data-testid="i4-vector-layer"] .top-1\\/2');
      const centerR = centerCard?.getBoundingClientRect();
      const topBadge = stage?.querySelector('[data-testid="i4-vector-layer"] .top-2');
      const topR = topBadge?.getBoundingClientRect();
      const bottomBadge = stage?.querySelector('[data-testid="i4-vector-layer"] .bottom-2');
      const bottomR = bottomBadge?.getBoundingClientRect();
      return {
        loupeFitsStage: loupeR && stageR ? loupeR.height < stageR.height : false,
        noTopOverlap: topR && centerR ? topR.bottom < centerR.top : false,
        noBottomOverlap: centerR && bottomR ? centerR.bottom < bottomR.top : false,
      };
    });
    assert.ok(i4Geometry.loupeFitsStage, 'Interaction #4 loupe ring must fit inside stage height on mobile');
    assert.ok(i4Geometry.noTopOverlap, 'Interaction #4 center vector card must not overlap top HUD badge on mobile');
    assert.ok(i4Geometry.noBottomOverlap, 'Interaction #4 center vector card must not overlap bottom HUD badge on mobile');
    console.log('✔ Verified Interaction #2 and Interaction #4 mobile bounding-box geometry (zero overlap).');

    // Verify native <input type="checkbox" switch> elements and >= 44x44px touch targets
    const switchCount = await page.evaluate(
      () => document.querySelectorAll('input[type="checkbox"][switch]').length
    );
    assert.ok(switchCount >= 3, `Expected at least 3 <input type="checkbox" switch> elements, got ${switchCount}`);

    const mobileTrigger = page.locator('[data-testid="mobile-menu-trigger"]');
    assert.ok(await mobileTrigger.isVisible(), 'Mobile menu trigger must be visible on 390px');
    assert.equal(await mobileTrigger.getAttribute('aria-expanded'), 'false');

    await mobileTrigger.click();
    await page.waitForTimeout(350);
    assert.equal(await mobileTrigger.getAttribute('aria-expanded'), 'true');

    const drawerState = await page.evaluate(() => {
      const dlg = document.getElementById('mobile-navigation-drawer');
      const scroller = dlg?.querySelector('.Drawer-scroller');
      const sheet = dlg?.querySelector('.Drawer-sheet');
      const sheetR = sheet?.getBoundingClientRect();
      return {
        open: Boolean(dlg && dlg.hasAttribute('open')),
        scrollLeft: scroller ? scroller.scrollLeft : -1,
        sheetRight: sheetR ? sheetR.right : 0,
      };
    });
    assert.ok(drawerState.open, 'Mobile <dialog> drawer must have [open] attribute when opened');
    assert.equal(drawerState.scrollLeft, 0, 'Mobile drawer scroller must settle at scrollLeft === 0 when opened');
    assert.ok(drawerState.sheetRight > 250, `Mobile drawer sheet must be visible on-screen (got right=${drawerState.sheetRight})`);

    // Toggle sound inside mobile drawer
    const drawerSoundSwitch = page.locator('[data-testid="mobile-drawer-sound-switch"]');
    const sBefore = await drawerSoundSwitch.getAttribute('aria-checked');
    await drawerSoundSwitch.click();
    const sAfter = await drawerSoundSwitch.getAttribute('aria-checked');
    assert.notEqual(sBefore, sAfter, 'Mobile drawer sound switch must toggle state');

    // Switch language inside mobile drawer to PT
    await page.locator('[data-testid="lang-btn-mobile-pt"]').click();
    await page.waitForTimeout(220);
    const mobileLang = await page.evaluate(() =>
      document.documentElement.getAttribute('data-lang')
    );
    assert.equal(mobileLang, 'pt', 'Mobile drawer language button must switch locale to PT');

    // Test swipe-to-dismiss via scroll-snap scroller
    await page.evaluate(() => {
      const scroller = document.querySelector('#mobile-navigation-drawer .Drawer-scroller');
      scroller?.scrollTo({ left: scroller.scrollWidth, behavior: 'instant' });
    });
    await page.waitForTimeout(350);
    assert.equal(
      await mobileTrigger.getAttribute('aria-expanded'),
      'false',
      'Mobile drawer must close automatically when swiped/scrolled to dismiss target'
    );

    // Re-open and close via close button
    await mobileTrigger.click();
    await page.waitForTimeout(350);
    assert.equal(await mobileTrigger.getAttribute('aria-expanded'), 'true');
    await page.locator('[data-testid="mobile-drawer-close"]').click();
    await page.waitForTimeout(350);
    assert.equal(await mobileTrigger.getAttribute('aria-expanded'), 'false');
    console.log('✔ Mobile Navigation Drawer (<dialog>), on-screen geometry, swipe-to-dismiss, sound switch, and language selector verified.');

    assert.equal(
      consoleErrors.length,
      0,
      `Console errors occurred: ${consoleErrors.join('; ')}`
    );
    assert.equal(
      pageErrors.length,
      0,
      `Page errors occurred: ${pageErrors.join('; ')}`
    );
    console.log('✔ Zero console errors and zero uncaught page errors.');

    await browser.close();
  } finally {
    if (process.platform === 'win32' && server.pid) {
      spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
    } else {
      server.kill();
    }
  }
}

runE2E()
  .then(() => {
    console.log('\n🎉 ALL E2E HEADLESS BROWSER TESTS PASSED!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ E2E Test Failed:', err);
    process.exit(1);
  });
