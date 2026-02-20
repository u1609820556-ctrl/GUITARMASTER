const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const OUT = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const log = (...args) => console.log('[QA]', ...args);

async function shot(page, name, selector) {
    const p = path.join(OUT, `${name}.png`);
    if (selector) {
        const el = await page.$(selector);
        if (el) { await el.screenshot({ path: p }); return; }
    }
    await page.screenshot({ path: p, fullPage: false });
    log(`screenshot: ${name}.png`);
}

async function clickLevel(page, n) {
    await page.click(`[data-level="${n}"]`);
    await page.waitForTimeout(400);
}

(async () => {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 120,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();

    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // ── 0. First impression
    await shot(page, '00-landing');

    // ── 1. Nivel 1 — Intervalos
    await clickLevel(page, 1);
    await shot(page, '01-intervalos');
    // Click first interval button
    const firstBtn = await page.$('.interval-btn, .ctrl-btn');
    if (firstBtn) { await firstBtn.click(); await page.waitForTimeout(300); }
    await shot(page, '01-intervalos-active');

    // ── 2. Nivel 2 — Escalas
    await clickLevel(page, 2);
    await shot(page, '02-escalas');

    // ── 3. Nivel 3 — Acordes básicos
    await clickLevel(page, 3);
    await shot(page, '03-acordes-basicos');

    // ── 4. Nivel 4 — Acordes extendidos (MAIN FOCUS)
    await clickLevel(page, 4);
    await page.waitForTimeout(500);
    await shot(page, '04-ext-intro');

    // Click first chord card in intro
    const introCard = await page.$('.ext4-intro-chord-card');
    if (introCard) {
        await introCard.click();
        await page.waitForTimeout(500);
        await shot(page, '04-ext-chord-selected');
        // Scroll to see full page
        await page.evaluate(() => document.getElementById('level4TopSection')?.scrollTo(0, 0));
        await shot(page, '04-ext-chord-top');
        await page.evaluate(() => document.getElementById('level4TopSection')?.scrollTo(0, 500));
        await shot(page, '04-ext-chord-mid');
        await page.evaluate(() => document.getElementById('level4TopSection')?.scrollTo(0, 9999));
        await shot(page, '04-ext-chord-bottom');
    }

    // Reset scroll, click next
    await page.evaluate(() => document.getElementById('level4TopSection')?.scrollTo(0, 0));
    const nextBtn = await page.$('#ext4-next-btn');
    if (nextBtn) {
        await nextBtn.click();
        await page.waitForTimeout(400);
        await shot(page, '04-ext-chord-next');
    }

    // Try a different category tab
    const colorTab = await page.$('[data-ext-category="color9"]');
    if (colorTab) {
        await colorTab.click();
        await page.waitForTimeout(400);
        await shot(page, '04-ext-category-color9');
    }

    // Try "Voicings Libres" tab (known broken)
    const freeTab = await page.$('[data-ext-category="free-voicings"]');
    if (freeTab) {
        await freeTab.click();
        await page.waitForTimeout(400);
        await shot(page, '04-ext-free-voicings-BUG');
    }

    // Back to essential, select chord, open voicings dropdown
    const essTab = await page.$('[data-ext-category="essential"]');
    if (essTab) { await essTab.click(); await page.waitForTimeout(300); }
    const matrixBtn = await page.$('.ext-matrix-btn');
    if (matrixBtn) {
        await matrixBtn.click();
        await page.waitForTimeout(400);
        const details = await page.$('.ext4-voicings-details');
        if (details) {
            await details.click();
            await page.waitForTimeout(300);
            await shot(page, '04-ext-voicings-open');
        }
    }

    // ── 5. Nivel 5 — Círculo de quintas
    await clickLevel(page, 5);
    await page.waitForTimeout(600);
    await shot(page, '05-circulo-quintas');

    // ── 6. Nivel 6 — Progresiones
    await clickLevel(page, 6);
    await page.waitForTimeout(400);
    await shot(page, '06-progresiones');

    // ── 7. Nivel 11 — Chord Lab
    await clickLevel(page, 11);
    await page.waitForTimeout(400);
    await shot(page, '11-chord-lab');

    // ── Responsive check at 375px
    await page.setViewportSize({ width: 375, height: 812 });
    await clickLevel(page, 4);
    await page.waitForTimeout(500);
    await shot(page, 'responsive-375-nivel4-intro');
    const introCard2 = await page.$('.ext4-intro-chord-card');
    if (introCard2) {
        await introCard2.click();
        await page.waitForTimeout(400);
        await shot(page, 'responsive-375-nivel4-chord');
    }

    log('\n✓ Done. Screenshots saved to:', OUT);
    log('Review the images and run this analysis.');

    await browser.close();
})();
