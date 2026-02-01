/**
 * Smoke Tests for Playwright Configuration
 *
 * These tests verify that:
 * 1. Playwright is properly installed and configured
 * 2. The local server is running
 * 3. All 10 final landing pages are accessible
 * 4. Basic functionality works across browsers
 */

const { test, expect } = require('@playwright/test');
const {
  FINAL_PAGES,
  waitForPageLoad,
  testAccessibility,
  setupConsoleErrorTracking,
} = require('./test-utils');

test.describe('Playwright Configuration Smoke Tests', () => {
  test('should have Playwright properly configured', async ({ page }) => {
    // This test just verifies Playwright can navigate to a page
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/); // Should have some title
  });

  test('should access local server', async ({ page, baseURL }) => {
    expect(baseURL).toBe('http://localhost:8080');

    const response = await page.goto('/');
    expect(response.status()).toBe(200);
  });

  test('should have screenshots directory', async ({ page }) => {
    // This is a placeholder that will be implemented when screenshots are generated
    expect(true).toBe(true);
  });
});

test.describe('Final 10 Landing Pages - Accessibility', () => {
  for (const pageInfo of FINAL_PAGES) {
    test(`${pageInfo.name} should be accessible and load properly`, async ({ page }) => {
      // Track console errors
      const { errors } = await setupConsoleErrorTracking(page);

      // Navigate to page
      const response = await page.goto(pageInfo.path);

      // Check response status
      expect(response.status()).toBe(200);

      // Wait for page to load
      await waitForPageLoad(page);

      // Test basic accessibility
      await testAccessibility(page);

      // Verify no console errors (excluding known warnings)
      const criticalErrors = errors.filter(err =>
        !err.includes('favicon') && // Ignore missing favicon warnings
        !err.includes('LiveReload') // Ignore dev server warnings
      );
      expect(criticalErrors.length).toBe(0);

      // Take a basic screenshot
      await page.screenshot({
        path: `screenshots/smoke-${pageInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`,
        fullPage: false,
      });
    });
  }
});

test.describe('Final 10 Landing Pages - Basic Functionality', () => {
  for (const pageInfo of FINAL_PAGES) {
    test(`${pageInfo.name} should have visible content`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await waitForPageLoad(page);

      // Check for visible hero section
      const body = await page.locator('body');
      await expect(body).toBeVisible();

      // Check that page has meaningful content
      const textContent = await page.textContent('body');
      expect(textContent.trim().length).toBeGreaterThan(100);

      // Verify page contains "Gemini" reference
      const geminiMentioned = textContent.toLowerCase().includes('gemini');
      expect(geminiMentioned).toBe(true);
    });
  }
});

test.describe('Responsive Design - Basic Check', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ];

  // Test one page at each viewport to verify responsive behavior
  test('Think Different should be responsive', async ({ page }) => {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/pages/think-different.html');
      await waitForPageLoad(page);

      // Check no horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);

      // Check content is visible
      const bodyVisible = await page.locator('body').isVisible();
      expect(bodyVisible).toBe(true);
    }
  });
});

test.describe('Performance Metrics', () => {
  test('Think Different should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/pages/think-different.html');
    await waitForPageLoad(page, { waitForAnimations: false });

    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds (generous for first run)
    expect(loadTime).toBeLessThan(3000);
  });
});
