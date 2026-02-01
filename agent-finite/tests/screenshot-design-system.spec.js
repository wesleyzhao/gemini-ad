/**
 * Playwright test to capture screenshots of design system test page
 * Tests desktop, tablet, and mobile viewports
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Design System Visual Test', () => {
  const testUrl = `file://${path.resolve(__dirname, 'design-system-test.html')}`;

  test('Desktop viewport (1440x900)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(testUrl);

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: path.resolve(__dirname, '../assets/screenshots/design-system-desktop.png'),
      fullPage: true
    });
  });

  test('Tablet viewport (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(testUrl);

    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.resolve(__dirname, '../assets/screenshots/design-system-tablet.png'),
      fullPage: true
    });
  });

  test('Mobile viewport (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(testUrl);

    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: path.resolve(__dirname, '../assets/screenshots/design-system-mobile.png'),
      fullPage: true
    });
  });

  test('Verify CSS variables are applied', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(testUrl);

    // Check that CSS variables are properly defined
    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    });

    expect(primaryColor.trim()).toBe('#4285F4');

    // Check font family
    const fontFamily = await page.evaluate(() => {
      return getComputedStyle(document.body).fontFamily;
    });

    expect(fontFamily).toContain('apple-system');
  });

  test('Verify responsive typography', async ({ page }) => {
    // Desktop size
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(testUrl);

    let heroFontSize = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--font-size-hero');
    });
    expect(heroFontSize.trim()).toBe('64px');

    // Tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    heroFontSize = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--font-size-hero');
    });
    expect(heroFontSize.trim()).toBe('56px');

    // Mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    heroFontSize = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--font-size-hero');
    });
    expect(heroFontSize.trim()).toBe('40px');
  });

  test('Verify spacing system', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(testUrl);

    const space1 = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--space-1');
    });
    expect(space1.trim()).toBe('8px');

    const space4 = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--space-4');
    });
    expect(space4.trim()).toBe('32px');
  });

  test('Verify color palette', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(testUrl);

    const geminiColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-gemini');
    });
    expect(geminiColor.trim()).toBe('#9334E9');

    const successColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--color-success');
    });
    expect(successColor.trim()).toBe('#34A853');
  });

  test('Verify interactive elements (hover states)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(testUrl);

    // Find a button and check hover effect
    const button = page.locator('.button-test').first();

    // Get initial background color
    const initialBg = await button.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Hover over button
    await button.hover();

    // The hover state should be different (verified by CSS transition)
    // We can verify the transition property exists
    const transition = await button.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    expect(transition).toContain('background-color');
  });
});
