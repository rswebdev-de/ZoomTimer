#!/usr/bin/env node
// Generates documentation screenshots of the Zoom Timer App.
// Run: node scripts/screenshots.js
// Requires: @playwright/test installed, Chromium browser installed via `npx playwright install chromium`.
// The Express server must NOT be running before calling this script — it starts its own.

const { chromium } = require('@playwright/test');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 3099; // use a dedicated port to avoid conflicts
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
const VIEWPORT = { width: 360, height: 640 };

async function waitForServer(url, retries = 20, delay = 200) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        http.get(url, (res) => resolve(res)).on('error', reject);
      });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error(`Server at ${url} did not start in time`);
}

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  // Start the app server on a dedicated port
  process.env.PORT = String(PORT);
  const serverModule = require('../server');
  const server = serverModule.server ?? serverModule;
  await waitForServer(`http://localhost:${PORT}/health`);
  console.log(`Server ready on port ${PORT}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  const base = `http://localhost:${PORT}`;

  async function shot(name) {
    const dest = path.join(SCREENSHOTS_DIR, name);
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`  Saved: docs/screenshots/${name}`);
  }

  // ── 1. Timer — idle ─────────────────────────────────────────────────────────
  await page.goto(base);
  await page.waitForLoadState('networkidle');
  await shot('01-timer-idle.png');

  // ── 2. Timer — configured (5 min selected) ──────────────────────────────────
  await page.click('button:has-text("5 min")');
  await page.waitForTimeout(100);
  await shot('02-timer-configured.png');

  // ── 3. Timer — running ──────────────────────────────────────────────────────
  await page.click('button:has-text("Start")');
  await page.waitForTimeout(2000);
  await shot('03-timer-running.png');

  // ── 4. Timer — paused ───────────────────────────────────────────────────────
  await page.click('button:has-text("Pause")');
  await page.waitForTimeout(100);
  await shot('04-timer-paused.png');

  // ── 5. Timer — all options visible ──────────────────────────────────────────
  await page.click('button:has-text("Reset")');
  await page.setViewportSize({ width: 360, height: 900 });
  await page.waitForTimeout(100);
  await shot('05-timer-options.png');
  await page.setViewportSize(VIEWPORT);

  // ── 6. Stopwatch — idle ─────────────────────────────────────────────────────
  await page.click('button:has-text("Stopwatch")');
  await page.waitForTimeout(100);
  await shot('06-stopwatch-idle.png');

  // ── 7. Stopwatch — running ──────────────────────────────────────────────────
  await page.click('button:has-text("Start")');
  await page.waitForTimeout(2000);
  await shot('07-stopwatch-running.png');

  await browser.close();

  if (typeof server.close === 'function') {
    server.close();
  }

  console.log('\nAll screenshots saved to docs/screenshots/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
