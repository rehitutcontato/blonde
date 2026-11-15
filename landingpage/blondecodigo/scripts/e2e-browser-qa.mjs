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

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // 1. Preloader Verification
    const preloaderVisible = await page
      .locator('[data-testid="system-immersion-gate"]')
      .isVisible();
    assert.ok(preloaderVisible, 'Preloader should be visible on initial entry');
    await page.locator('[data-testid="preloader-enter-sound"]').click();
    await page.waitForTimeout(800);
    const preloaderCount = await page
      .locator('[data-testid="system-immersion-gate"]')
      .count();
    assert.equal(preloaderCount, 0, 'Preloader should unmount after opening iris');
    console.log('✔ Act 0 Preloader [ENTER WITH SOUND] transition verified.');

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

    // 7. Mobile Navigation Drawer & Toggles on 390x844
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    const mobileTrigger = page.locator('[data-testid="mobile-menu-trigger"]');
    assert.ok(await mobileTrigger.isVisible(), 'Mobile menu trigger must be visible on 390px');
    assert.equal(await mobileTrigger.getAttribute('aria-expanded'), 'false');

    await mobileTrigger.click();
    await page.waitForTimeout(350);
    assert.equal(await mobileTrigger.getAttribute('aria-expanded'), 'true');

    const drawerOpen = await page.evaluate(() => {
      const dlg = document.getElementById('mobile-navigation-drawer');
      return Boolean(dlg && dlg.hasAttribute('open'));
    });
    assert.ok(drawerOpen, 'Mobile <dialog> drawer must have [open] attribute when opened');

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

    // Close mobile drawer via close button
    await page.locator('[data-testid="mobile-drawer-close"]').click();
    await page.waitForTimeout(350);
    assert.equal(await mobileTrigger.getAttribute('aria-expanded'), 'false');
    console.log('✔ Mobile Navigation Drawer (<dialog>), sound switch, and mobile language selector verified.');

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
    server.kill();
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
