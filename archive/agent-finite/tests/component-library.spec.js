/**
 * Playwright Test Suite - Component Library
 *
 * Tests and screenshots for the reusable component library
 */

const { test, expect } = require('@playwright/test');

test.describe('Component Library Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/tests/component-library-test.html');
  });

  test('should load component library test page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Component Library Test');
  });

  test('should display all button variants', async ({ page }) => {
    await expect(page.locator('.btn-primary')).toBeVisible();
    await expect(page.locator('.btn-secondary')).toBeVisible();
    await expect(page.locator('.btn-tertiary')).toBeVisible();
    await expect(page.locator('.btn-ghost')).toBeVisible();
    await expect(page.locator('.btn-gemini')).toBeVisible();
  });

  test('should display all card types', async ({ page }) => {
    await expect(page.locator('.card-product')).toHaveCount(2);
    await expect(page.locator('.card-feature')).toHaveCount(3);
    await expect(page.locator('.card-testimonial')).toBeVisible();
    await expect(page.locator('.card-stat')).toHaveCount(3);
  });

  test('should display hero sections', async ({ page }) => {
    await expect(page.locator('.hero-fullbleed')).toBeVisible();
    await expect(page.locator('.hero-split')).toBeVisible();
  });

  test('should display CTA components', async ({ page }) => {
    await expect(page.locator('.cta-inline')).toBeVisible();
    await expect(page.locator('.cta-banner')).toBeVisible();
    await expect(page.locator('.cta-section')).toBeVisible();
  });

  test('should display navigation components', async ({ page }) => {
    await expect(page.locator('.navbar')).toBeVisible();
    await expect(page.locator('.footer')).toBeVisible();
    await expect(page.locator('.breadcrumbs')).toBeVisible();
  });

  test('should display form elements', async ({ page }) => {
    await expect(page.locator('.form-input')).toBeVisible();
    await expect(page.locator('.form-textarea')).toBeVisible();
    await expect(page.locator('.form-select')).toBeVisible();
  });

  test('should display badges and tags', async ({ page }) => {
    await expect(page.locator('.badge')).toHaveCount(6);
    await expect(page.locator('.tag')).toHaveCount(4);
    await expect(page.locator('.trust-indicator')).toBeVisible();
    await expect(page.locator('.citation-badge')).toBeVisible();
  });

  test('button hover states work', async ({ page }) => {
    const primaryBtn = page.locator('.btn-primary').first();

    // Get initial transform
    const initialTransform = await primaryBtn.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    // Hover over button
    await primaryBtn.hover();

    // Small delay for transition
    await page.waitForTimeout(300);

    // Transform should have changed on hover
    const hoverTransform = await primaryBtn.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    expect(hoverTransform).not.toBe(initialTransform);
  });

  test('mobile menu toggle works', async ({ page }) => {
    // Resize to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const menuToggle = page.locator('.navbar-toggle');
    const menu = page.locator('.navbar-menu');

    // Toggle button should be visible on mobile
    await expect(menuToggle).toBeVisible();

    // Click toggle
    await menuToggle.click();

    // Menu should have active class
    await expect(menu).toHaveClass(/active/);
  });

  test('navbar scroll effect works', async ({ page }) => {
    const navbar = page.locator('.navbar');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 100));
    await page.waitForTimeout(100);

    // Navbar should have scrolled class
    await expect(navbar).toHaveClass(/navbar-scrolled/);

    // Scroll back up
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    // Scrolled class should be removed
    const classes = await navbar.getAttribute('class');
    expect(classes).not.toContain('navbar-scrolled');
  });
});

test.describe('Component Library Screenshots', () => {
  // Desktop screenshots
  test('desktop - full page screenshot', async ({ page }) => {
    await page.goto('http://localhost:8080/tests/component-library-test.html');
    await page.screenshot({
      path: 'assets/screenshots/component-library-desktop.png',
      fullPage: true
    });
  });

  test('desktop - buttons section', async ({ page }) => {
    await page.goto('http://localhost:8080/tests/component-library-test.html');
    const section = page.locator('#buttons');
    await section.screenshot({
      path: 'assets/screenshots/components-buttons-desktop.png'
    });
  });

  test('desktop - cards section', async ({ page }) => {
    await page.goto('http://localhost:8080/tests/component-library-test.html');
    const section = page.locator('#cards');
    await section.screenshot({
      path: 'assets/screenshots/components-cards-desktop.png'
    });
  });

  test('desktop - heroes section', async ({ page }) => {
    await page.goto('http://localhost:8080/tests/component-library-test.html');
    const section = page.locator('#heroes');
    await section.screenshot({
      path: 'assets/screenshots/components-heroes-desktop.png'
    });
  });

  test('desktop - ctas section', async ({ page }) => {
    await page.goto('http://localhost:8080/tests/component-library-test.html');
    const section = page.locator('#ctas');
    await section.screenshot({
      path: 'assets/screenshots/components-ctas-desktop.png'
    });
  });

  // Tablet screenshots
  test('tablet - full page screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:8080/tests/component-library-test.html');
    await page.screenshot({
      path: 'assets/screenshots/component-library-tablet.png',
      fullPage: true
    });
  });

  // Mobile screenshots
  test('mobile - full page screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8080/tests/component-library-test.html');
    await page.screenshot({
      path: 'assets/screenshots/component-library-mobile.png',
      fullPage: true
    });
  });

  test('mobile - navbar with menu open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8080/tests/component-library-test.html');

    // Open mobile menu
    await page.locator('.navbar-toggle').click();
    await page.waitForTimeout(300); // Wait for animation

    await page.screenshot({
      path: 'assets/screenshots/components-mobile-menu.png'
    });
  });
});
