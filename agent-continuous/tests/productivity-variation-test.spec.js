const { test, expect } = require('@playwright/test');

test.describe('Productivity Variation B - Emotional Appeal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/pages/productivity-variation-b.html');
  });

  test('should load page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Reclaim Your Life/);
  });

  test('should display emotional hero text', async ({ page }) => {
    const heroHeading = page.locator('h1#hero-heading');
    await expect(heroHeading).toContainText('Stop Working');
    await expect(heroHeading).toContainText('Start Living');
  });

  test('should display lifestyle benefits cards', async ({ page }) => {
    const lifestyleCards = page.locator('.lifestyle-card');
    const count = await lifestyleCards.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should show "20 Hours" emotional appeal', async ({ page }) => {
    const timeNumber = page.locator('.time-number');
    await expect(timeNumber).toContainText('20 Hours');
  });

  test('should display testimonial section', async ({ page }) => {
    const testimonial = page.locator('.testimonial-card');
    await expect(testimonial).toBeVisible();
    await expect(testimonial).toContainText('Sarah Mitchell');
  });

  test('should have "Reclaim Your Time" CTA', async ({ page }) => {
    const ctaButton = page.locator('a.btn-primary').first();
    await expect(ctaButton).toContainText('Reclaim Your Time');
    await expect(ctaButton).toHaveAttribute('href', 'https://gemini.google.com');
  });

  test('should display moment badges', async ({ page }) => {
    const momentBadges = page.locator('.moment-badge');
    const count = await momentBadges.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const heroHeading = page.locator('h1#hero-heading');
    await expect(heroHeading).toBeVisible();
  });

  test('should take desktop screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({
      path: 'screenshots/productivity-variation-b-desktop.png',
      fullPage: true
    });
  });

  test('should take mobile screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({
      path: 'screenshots/productivity-variation-b-mobile.png',
      fullPage: true
    });
  });
});
