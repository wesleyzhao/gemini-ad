// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Cross-Browser Smoke Test
 * Quick validation that all browsers can load a sample page
 */

test.describe('Cross-Browser Smoke Test', () => {

  test('should load index page', async ({ page, browserName }) => {
    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toBeTruthy();

    console.log(`✓ ${browserName}: Page loaded with title "${title}"`);
  });

  test('should load a landing page', async ({ page, browserName }) => {
    await page.goto('/pages/trust.html');
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    expect(title).toBeTruthy();

    console.log(`✓ ${browserName}: Trust page loaded`);
  });

  test('should have no JavaScript errors', async ({ page, browserName }) => {
    const errors = [];

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/index.html');
    await page.waitForLoadState('networkidle');

    expect(errors.length).toBe(0);

    console.log(`✓ ${browserName}: No JavaScript errors`);
  });

});
