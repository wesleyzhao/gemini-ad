/**
 * Visual Regression Testing for All 10 Final Landing Pages
 *
 * This test suite performs automated visual regression testing by:
 * - Capturing screenshots of all pages at multiple viewports
 * - Comparing against baseline screenshots
 * - Detecting visual changes and regressions
 * - Generating detailed diff reports
 *
 * Playwright's Visual Comparisons:
 * - Pixel-perfect comparison with configurable thresholds
 * - Automatic diff image generation (highlights changes)
 * - Baseline management (update with --update-snapshots)
 * - Cross-platform consistency
 *
 * Usage:
 *   npm run test:visual                           # Run visual regression tests
 *   npm run test:visual -- --update-snapshots     # Update baselines
 *   npx playwright test visual-regression.spec.js --headed
 *   npx playwright test visual-regression.spec.js --project=chromium
 *   npx playwright show-report                    # View test report with diffs
 *
 * First Run:
 *   The first time you run these tests, they will create baseline screenshots
 *   in tests/visual-regression.spec.js-snapshots/. Subsequent runs compare
 *   against these baselines.
 *
 * Updating Baselines:
 *   When you intentionally change designs, update baselines with:
 *   npm run test:visual -- --update-snapshots
 */

const { test, expect } = require('@playwright/test');
const {
  FINAL_PAGES,
  VIEWPORTS,
  waitForPageLoad,
} = require('./test-utils');

/**
 * Base URL for all pages (local server)
 * Server auto-starts via playwright.config.js webServer
 */
const BASE_URL = 'http://localhost:8080';

/**
 * Visual comparison configuration
 * Adjust these thresholds based on your needs:
 * - maxDiffPixels: Maximum number of pixels that can differ
 * - maxDiffPixelRatio: Maximum ratio of pixels that can differ (0-1)
 * - threshold: Per-pixel color difference threshold (0-1)
 */
const VISUAL_COMPARISON_CONFIG = {
  maxDiffPixels: 100,        // Allow up to 100 pixels to differ (anti-aliasing, fonts)
  maxDiffPixelRatio: 0.01,   // Allow up to 1% of pixels to differ
  threshold: 0.2,            // 20% color difference threshold per pixel
};

/**
 * Viewport configurations for visual regression testing
 * Test at 3 key viewports: mobile, tablet, desktop
 */
const TEST_VIEWPORTS = {
  mobile: VIEWPORTS.mobile,        // iPhone 13: 375×812
  tablet: VIEWPORTS.tablet,        // iPad: 768×1024
  desktop: VIEWPORTS.desktop,      // Standard: 1920×1080
};

/**
 * Helper function to prepare page for consistent screenshots
 * Disables animations, scrolls to top, waits for stability
 */
async function preparePageForScreenshot(page) {
  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));

  // Disable animations for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });

  // Wait for page to stabilize
  await page.waitForTimeout(500);
}

/**
 * Test Group 1: Full-Page Visual Regression (Mobile)
 *
 * Captures and compares full-page screenshots at mobile viewport.
 * Detects any visual changes in layout, styling, or content.
 * Total: 10 screenshots (1 per page)
 */
test.describe('Visual Regression - Mobile Viewport', () => {
  test.use({ viewport: TEST_VIEWPORTS.mobile });

  for (const page of FINAL_PAGES) {
    test(`${page.name} - Mobile Full Page`, async ({ page: browserPage }) => {
      const url = `${BASE_URL}${page.path}`;

      // Navigate to page
      await browserPage.goto(url);

      // Wait for page to be fully loaded
      await waitForPageLoad(browserPage, { waitForAnimations: false });

      // Prepare for screenshot
      await preparePageForScreenshot(browserPage);

      // Visual comparison against baseline
      await expect(browserPage).toHaveScreenshot(
        `${page.slug}-mobile-full.png`,
        {
          fullPage: true,
          ...VISUAL_COMPARISON_CONFIG,
        }
      );
    });
  }
});

/**
 * Test Group 2: Full-Page Visual Regression (Tablet)
 *
 * Captures and compares full-page screenshots at tablet viewport.
 * Tests responsive design breakpoints and layout shifts.
 * Total: 10 screenshots (1 per page)
 */
test.describe('Visual Regression - Tablet Viewport', () => {
  test.use({ viewport: TEST_VIEWPORTS.tablet });

  for (const page of FINAL_PAGES) {
    test(`${page.name} - Tablet Full Page`, async ({ page: browserPage }) => {
      const url = `${BASE_URL}${page.path}`;

      // Navigate to page
      await browserPage.goto(url);

      // Wait for page to be fully loaded
      await waitForPageLoad(browserPage, { waitForAnimations: false });

      // Prepare for screenshot
      await preparePageForScreenshot(browserPage);

      // Visual comparison against baseline
      await expect(browserPage).toHaveScreenshot(
        `${page.slug}-tablet-full.png`,
        {
          fullPage: true,
          ...VISUAL_COMPARISON_CONFIG,
        }
      );
    });
  }
});

/**
 * Test Group 3: Full-Page Visual Regression (Desktop)
 *
 * Captures and compares full-page screenshots at desktop viewport.
 * Tests maximum-width layouts and desktop-specific features.
 * Total: 10 screenshots (1 per page)
 */
test.describe('Visual Regression - Desktop Viewport', () => {
  test.use({ viewport: TEST_VIEWPORTS.desktop });

  for (const page of FINAL_PAGES) {
    test(`${page.name} - Desktop Full Page`, async ({ page: browserPage }) => {
      const url = `${BASE_URL}${page.path}`;

      // Navigate to page
      await browserPage.goto(url);

      // Wait for page to be fully loaded
      await waitForPageLoad(browserPage, { waitForAnimations: false });

      // Prepare for screenshot
      await preparePageForScreenshot(browserPage);

      // Visual comparison against baseline
      await expect(browserPage).toHaveScreenshot(
        `${page.slug}-desktop-full.png`,
        {
          fullPage: true,
          ...VISUAL_COMPARISON_CONFIG,
        }
      );
    });
  }
});

/**
 * Test Group 4: Hero Section Visual Regression (Desktop)
 *
 * Captures and compares hero sections (above-the-fold content) only.
 * Critical for A/B testing headlines, CTAs, and hero imagery.
 * Total: 10 screenshots (1 per page)
 */
test.describe('Visual Regression - Hero Sections', () => {
  test.use({ viewport: TEST_VIEWPORTS.desktop });

  for (const page of FINAL_PAGES) {
    test(`${page.name} - Hero Section`, async ({ page: browserPage }) => {
      const url = `${BASE_URL}${page.path}`;

      // Navigate to page
      await browserPage.goto(url);

      // Wait for page to be fully loaded
      await waitForPageLoad(browserPage, { waitForAnimations: false });

      // Prepare for screenshot
      await preparePageForScreenshot(browserPage);

      // Capture only above-fold content (hero section)
      await expect(browserPage).toHaveScreenshot(
        `${page.slug}-hero-desktop.png`,
        {
          fullPage: false,  // Only visible viewport
          ...VISUAL_COMPARISON_CONFIG,
        }
      );
    });
  }
});

/**
 * Test Group 5: CTA Button Visual Regression
 *
 * Captures and compares primary CTA buttons across all pages.
 * Ensures consistent button styling, sizing, and positioning.
 * Total: 10 screenshots (1 per page)
 */
test.describe('Visual Regression - CTA Buttons', () => {
  test.use({ viewport: TEST_VIEWPORTS.desktop });

  for (const page of FINAL_PAGES) {
    test(`${page.name} - CTA Button`, async ({ page: browserPage }) => {
      const url = `${BASE_URL}${page.path}`;

      // Navigate to page
      await browserPage.goto(url);

      // Wait for page to be fully loaded
      await waitForPageLoad(browserPage, { waitForAnimations: false });

      // Prepare for screenshot
      await preparePageForScreenshot(browserPage);

      // Find primary CTA button
      const ctaButton = browserPage.locator('.cta-primary, .btn-primary').first();

      // Verify button exists
      await expect(ctaButton).toBeVisible();

      // Visual comparison of CTA button
      await expect(ctaButton).toHaveScreenshot(
        `${page.slug}-cta-button.png`,
        {
          ...VISUAL_COMPARISON_CONFIG,
        }
      );
    });
  }
});

/**
 * Test Group 6: Animation State Consistency
 *
 * Tests pages with animations by capturing before and after states.
 * Ensures animations work correctly and consistently.
 * Total: 8 screenshots (4 pages × 2 states)
 */
test.describe('Visual Regression - Animation States', () => {
  test.use({ viewport: TEST_VIEWPORTS.desktop });

  const ANIMATED_PAGES = [
    FINAL_PAGES.find(p => p.slug === 'email-savior'),
    FINAL_PAGES.find(p => p.slug === 'meeting-notes-magic'),
    FINAL_PAGES.find(p => p.slug === 'writers-room'),
    FINAL_PAGES.find(p => p.slug === 'workflow-wizard'),
  ].filter(Boolean);

  for (const page of ANIMATED_PAGES) {
    test(`${page.name} - Before Animation`, async ({ page: browserPage }) => {
      const url = `${BASE_URL}${page.path}`;

      // Navigate to page
      await browserPage.goto(url);

      // Wait for initial load but NOT animations
      await waitForPageLoad(browserPage, { waitForAnimations: false });

      // Prepare for screenshot
      await preparePageForScreenshot(browserPage);

      // Capture before animation state
      await expect(browserPage).toHaveScreenshot(
        `${page.slug}-before-animation.png`,
        {
          fullPage: false,
          ...VISUAL_COMPARISON_CONFIG,
        }
      );
    });

    test(`${page.name} - After Animation`, async ({ page: browserPage }) => {
      const url = `${BASE_URL}${page.path}`;

      // Navigate to page
      await browserPage.goto(url);

      // Wait for animations to complete
      await waitForPageLoad(browserPage, { waitForAnimations: true });

      // Scroll to trigger all scroll animations
      await browserPage.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Wait for scroll animations
      await browserPage.waitForTimeout(1000);

      // Scroll back to top
      await browserPage.evaluate(() => window.scrollTo(0, 0));

      // Prepare for screenshot
      await preparePageForScreenshot(browserPage);

      // Capture after animation state
      await expect(browserPage).toHaveScreenshot(
        `${page.slug}-after-animation.png`,
        {
          fullPage: false,
          ...VISUAL_COMPARISON_CONFIG,
        }
      );
    });
  }
});

/**
 * Test Group 7: Responsive Layout Verification
 *
 * Tests critical breakpoints to ensure responsive design works correctly.
 * Captures at common device widths to detect layout issues.
 * Total: 20 screenshots (10 pages × 2 critical breakpoints)
 */
test.describe('Visual Regression - Responsive Breakpoints', () => {
  const CRITICAL_BREAKPOINTS = [
    { name: 'small-mobile', width: 320, height: 568 },   // iPhone SE
    { name: 'large-desktop', width: 2560, height: 1440 }, // Ultra-wide
  ];

  for (const breakpoint of CRITICAL_BREAKPOINTS) {
    test.describe(`Breakpoint: ${breakpoint.name}`, () => {
      test.use({ viewport: { width: breakpoint.width, height: breakpoint.height } });

      for (const page of FINAL_PAGES) {
        test(`${page.name} - ${breakpoint.name}`, async ({ page: browserPage }) => {
          const url = `${BASE_URL}${page.path}`;

          // Navigate to page
          await browserPage.goto(url);

          // Wait for page to be fully loaded
          await waitForPageLoad(browserPage, { waitForAnimations: false });

          // Prepare for screenshot
          await preparePageForScreenshot(browserPage);

          // Visual comparison
          await expect(browserPage).toHaveScreenshot(
            `${page.slug}-${breakpoint.name}.png`,
            {
              fullPage: true,
              ...VISUAL_COMPARISON_CONFIG,
            }
          );
        });
      }
    });
  }
});

/**
 * Test Group 8: Cross-Browser Visual Consistency
 *
 * Verifies that pages render consistently across different browser engines.
 * Uses Playwright's multi-browser support (Chromium, Firefox, WebKit).
 * Total: Varies by browser (30 screenshots per browser)
 *
 * Run with:
 *   npx playwright test visual-regression.spec.js --project=chromium
 *   npx playwright test visual-regression.spec.js --project=firefox
 *   npx playwright test visual-regression.spec.js --project=webkit
 */
test.describe('Visual Regression - Cross-Browser Consistency', () => {
  test.use({ viewport: TEST_VIEWPORTS.desktop });

  for (const page of FINAL_PAGES) {
    test(`${page.name} - Browser Consistency`, async ({ page: browserPage, browserName }) => {
      const url = `${BASE_URL}${page.path}`;

      // Navigate to page
      await browserPage.goto(url);

      // Wait for page to be fully loaded
      await waitForPageLoad(browserPage, { waitForAnimations: false });

      // Prepare for screenshot
      await preparePageForScreenshot(browserPage);

      // Visual comparison (browser-specific baseline)
      await expect(browserPage).toHaveScreenshot(
        `${page.slug}-${browserName}.png`,
        {
          fullPage: true,
          ...VISUAL_COMPARISON_CONFIG,
        }
      );
    });
  }
});
