/**
 * A/B Test Variations - Comprehensive Test Suite
 * Tests all 4 new variation pages created for A/B testing
 *
 * Tests:
 * - Trust Variation B (Competitive Positioning)
 * - Writers Variation B (Outcome Focus)
 * - Creators Variation B (Design Minimalism)
 * - Operators Variation B (Time Savings)
 */

const { test, expect } = require('@playwright/test');

// ============================================================================
// TRUST VARIATION B - Competitive Positioning Test
// ============================================================================

test.describe('Trust Variation B - Competitive Positioning', () => {
  test('should load page successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    expect(response.status()).toBe(200);
  });

  test('should display competitive comparison hero text', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    await expect(page.locator('h1')).toContainText('The Only AI That');
    await expect(page.locator('h1')).toContainText('Shows Its Work');
  });

  test('should contain comparison table', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    const comparisonTable = page.locator('.comparison-table');
    await expect(comparisonTable).toBeVisible();
  });

  test('should list competitor names', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    await expect(page.locator('text=ChatGPT')).toBeVisible();
    await expect(page.locator('text=Claude')).toBeVisible();
    await expect(page.locator('text=Perplexity')).toBeVisible();
  });

  test('should display competitive advantages', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    await expect(page.locator('text=Why Users Are Switching')).toBeVisible();
    const advantages = page.locator('.advantage-list');
    await expect(advantages.first()).toBeVisible();
  });

  test('should have migration guide', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    await expect(page.locator('text=Switching Is Easy')).toBeVisible();
    await expect(page.locator('text=Export Your Chat History')).toBeVisible();
  });

  test('should capture desktop screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    await page.screenshot({
      path: 'tests/screenshots/trust-variation-b-desktop.png',
      fullPage: true
    });
  });

  test('should capture mobile screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    await page.screenshot({
      path: 'tests/screenshots/trust-variation-b-mobile.png',
      fullPage: true
    });
  });

  test('should have working CTAs', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/trust-variation-b.html');
    const primaryCTA = page.locator('a.btn-primary').first();
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toHaveAttribute('href', /gemini\.google\.com/);
  });

  test('should load shared CSS and JS', async ({ page }) => {
    const responses = [];
    page.on('response', response => responses.push(response));

    await page.goto('http://localhost:8000/pages/trust-variation-b.html');

    const cssResponse = responses.find(r => r.url().includes('shared-styles.css'));
    const jsResponse = responses.find(r => r.url().includes('animations.js'));

    expect(cssResponse?.status()).toBe(200);
    expect(jsResponse?.status()).toBe(200);
  });
});

// ============================================================================
// WRITERS VARIATION B - Outcome Focus Test
// ============================================================================

test.describe('Writers Variation B - Outcome Focus', () => {
  test('should load page successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    expect(response.status()).toBe(200);
  });

  test('should display outcome-focused hero text', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await expect(page.locator('h1')).toContainText('Publish More');
    await expect(page.locator('h1')).toContainText('Write Less');
  });

  test('should show before/after comparison', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await expect(page.locator('.before-card')).toBeVisible();
    await expect(page.locator('.after-card')).toBeVisible();
  });

  test('should display completion rate metrics', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await expect(page.locator('text=92% completion rate')).toBeVisible();
  });

  test('should show timeline from blank page to published', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await expect(page.locator('text=Blank Page to Published')).toBeVisible();
    const timeline = page.locator('.timeline-outcome');
    await expect(timeline).toBeVisible();
  });

  test('should display finished work examples', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await expect(page.locator('text=Real Finished Work')).toBeVisible();
    const workSamples = page.locator('.work-sample');
    await expect(workSamples.first()).toBeVisible();
  });

  test('should show outcome statistics by writer type', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await expect(page.locator('text=Results by Writer Type')).toBeVisible();
    await expect(page.locator('.outcome-card')).toHaveCount(4);
  });

  test('should capture desktop screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await page.screenshot({
      path: 'tests/screenshots/writers-variation-b-desktop.png',
      fullPage: true
    });
  });

  test('should capture mobile screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await page.screenshot({
      path: 'tests/screenshots/writers-variation-b-mobile.png',
      fullPage: true
    });
  });

  test('should have outcome-focused CTAs', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/writers-variation-b.html');
    await expect(page.locator('text=Finish Your First Piece')).toBeVisible();
    await expect(page.locator('text=Publish Your First Piece')).toBeVisible();
  });
});

// ============================================================================
// CREATORS VARIATION B - Design Minimalism Test
// ============================================================================

test.describe('Creators Variation B - Design Minimalism', () => {
  test('should load page successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    expect(response.status()).toBe(200);
  });

  test('should display ultra-minimal hero text', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    await expect(page.locator('.minimal-headline')).toContainText('Create');
  });

  test('should have minimal subheadline', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    await expect(page.locator('.minimal-subhead')).toContainText('Everything you need to create');
  });

  test('should display large number statistics', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    const numbers = page.locator('.number-minimal');
    await expect(numbers).toHaveCount(3);
    await expect(page.locator('text=10×')).toBeVisible();
    await expect(page.locator('text=100K')).toBeVisible();
  });

  test('should have minimal feature sections', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    await expect(page.locator('text=Ideas to execution')).toBeVisible();
    await expect(page.locator('text=Your voice. Amplified')).toBeVisible();
    await expect(page.locator('text=Built for creators')).toBeVisible();
  });

  test('should include testimonial', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    const testimonial = page.locator('.testimonial-minimal blockquote');
    await expect(testimonial).toBeVisible();
    await expect(page.locator('text=Marcus Chen')).toBeVisible();
  });

  test('should have video placeholder', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    const video = page.locator('.video-container-minimal');
    await expect(video).toBeVisible();
    await expect(page.locator('.play-minimal')).toBeVisible();
  });

  test('should capture desktop screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    await page.screenshot({
      path: 'tests/screenshots/creators-variation-b-desktop.png',
      fullPage: true
    });
  });

  test('should capture mobile screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    await page.screenshot({
      path: 'tests/screenshots/creators-variation-b-mobile.png',
      fullPage: true
    });
  });

  test('should use minimal color palette', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Should use minimal white/light background
    expect(bodyBg).toBeTruthy();
  });

  test('should have simple CTAs', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/creators-variation-b.html');
    await expect(page.locator('.minimal-cta').first()).toContainText('Start Creating');
    await expect(page.locator('text=Learn More')).toBeVisible();
  });
});

// ============================================================================
// OPERATORS VARIATION B - Time Savings Test
// ============================================================================

test.describe('Operators Variation B - Time Savings', () => {
  test('should load page successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    expect(response.status()).toBe(200);
  });

  test('should display time savings hero statistic', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await expect(page.locator('.time-stat-hero')).toContainText('15 Hours');
  });

  test('should show detailed time breakdown table', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await expect(page.locator('.time-breakdown')).toBeVisible();
    await expect(page.locator('text=Task-by-Task Time Savings')).toBeVisible();
  });

  test('should display specific task time savings', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await expect(page.locator('text=Morning email triage')).toBeVisible();
    await expect(page.locator('text=Draft client proposal')).toBeVisible();
    await expect(page.locator('text=Analyze sales data')).toBeVisible();
  });

  test('should show weekly schedule comparison', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await expect(page.locator('text=Your Week: Before & After')).toBeVisible();
    const schedules = page.locator('.weekly-schedule');
    await expect(schedules).toHaveCount(2);
  });

  test('should display ROI calculator', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await expect(page.locator('.calculator-card')).toBeVisible();
    await expect(page.locator('text=Your Personal ROI')).toBeVisible();
    await expect(page.locator('.calculator-result')).toBeVisible();
  });

  test('should show testimonials with time highlights', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await expect(page.locator('text=Real Users. Real Time Saved')).toBeVisible();
    const testimonials = page.locator('.testimonial-time');
    await expect(testimonials.first()).toBeVisible();
  });

  test('should display per-feature time savings', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await expect(page.locator('text=How We Save You 15+ Hours')).toBeVisible();
    const features = page.locator('.feature-time');
    await expect(features).toHaveCount(6);
  });

  test('should capture desktop screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await page.screenshot({
      path: 'tests/screenshots/operators-variation-b-desktop.png',
      fullPage: true
    });
  });

  test('should capture mobile screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await page.screenshot({
      path: 'tests/screenshots/operators-variation-b-mobile.png',
      fullPage: true
    });
  });

  test('should have time-focused CTAs', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    await expect(page.locator('text=Start Saving Time')).toBeVisible();
    await expect(page.locator('text=Calculate My Savings')).toBeVisible();
  });

  test('should display hours badge', async ({ page }) => {
    await page.goto('http://localhost:8000/pages/operators-variation-b.html');
    const badge = page.locator('.hours-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('15.3 hours/week');
  });
});

// ============================================================================
// CROSS-VARIATION TESTS
// ============================================================================

test.describe('All Variations - Common Requirements', () => {
  const variations = [
    { name: 'Trust', url: 'trust-variation-b.html' },
    { name: 'Writers', url: 'writers-variation-b.html' },
    { name: 'Creators', url: 'creators-variation-b.html' },
    { name: 'Operators', url: 'operators-variation-b.html' }
  ];

  for (const variation of variations) {
    test(`${variation.name}: should be mobile responsive`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`http://localhost:8000/pages/${variation.url}`);

      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Check that content doesn't overflow
      const bodyWidth = await body.evaluate(el => el.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);
    });

    test(`${variation.name}: should have accessible navigation`, async ({ page }) => {
      await page.goto(`http://localhost:8000/pages/${variation.url}`);

      const header = page.locator('header');
      await expect(header).toBeVisible();

      const homeLink = header.locator('a').first();
      await expect(homeLink).toBeVisible();
    });

    test(`${variation.name}: should have footer with privacy links`, async ({ page }) => {
      await page.goto(`http://localhost:8000/pages/${variation.url}`);

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      await expect(footer.locator('text=Privacy')).toBeVisible();
    });

    test(`${variation.name}: should load without console errors`, async ({ page }) => {
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(`http://localhost:8000/pages/${variation.url}`);
      await page.waitForLoadState('networkidle');

      expect(consoleErrors.length).toBe(0);
    });
  }
});
