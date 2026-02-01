/**
 * Playwright Test Utilities for Gemini Ads Landing Pages
 *
 * Common helper functions for testing landing pages:
 * - Screenshot capture across multiple viewports
 * - Animation testing
 * - Accessibility testing
 * - Performance metrics
 * - Visual regression testing
 */

const { expect } = require('@playwright/test');

/**
 * Viewport configurations for responsive testing
 */
const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  'small-mobile': { width: 320, height: 568 },
  'large-desktop': { width: 2560, height: 1440 },
};

/**
 * Wait for page to be fully loaded including animations
 * @param {import('@playwright/test').Page} page
 * @param {Object} options
 */
async function waitForPageLoad(page, options = {}) {
  const {
    waitForAnimations = true,
    timeout = 5000,
  } = options;

  // Wait for load event
  await page.waitForLoadState('load');

  // Wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Wait for animations to complete (if requested)
  if (waitForAnimations) {
    await page.waitForTimeout(2000); // Allow CSS animations to complete
  }
}

/**
 * Capture full-page screenshot with proper viewport sizing
 * @param {import('@playwright/test').Page} page
 * @param {string} name - Screenshot name
 * @param {Object} options
 */
async function captureScreenshot(page, name, options = {}) {
  const {
    fullPage = true,
    waitForAnimations = true,
    viewport = null,
  } = options;

  // Set viewport if specified
  if (viewport) {
    await page.setViewportSize(viewport);
  }

  // Wait for page to load
  await waitForPageLoad(page, { waitForAnimations });

  // Scroll to top
  await page.evaluate(() => window.scrollTo(0, 0));

  // Capture screenshot
  return await page.screenshot({
    fullPage,
    path: `screenshots/${name}.png`,
    animations: 'disabled', // Disable animations for consistent screenshots
  });
}

/**
 * Capture screenshots at multiple viewports
 * @param {import('@playwright/test').Page} page
 * @param {string} pageName - Base name for screenshots
 * @param {Array<string>} viewportNames - Array of viewport names from VIEWPORTS
 */
async function captureMultiViewportScreenshots(page, pageName, viewportNames = ['mobile', 'tablet', 'desktop']) {
  const screenshots = {};

  for (const viewportName of viewportNames) {
    const viewport = VIEWPORTS[viewportName];
    if (!viewport) {
      throw new Error(`Unknown viewport: ${viewportName}`);
    }

    const screenshotName = `${pageName}-${viewportName}`;
    screenshots[viewportName] = await captureScreenshot(page, screenshotName, {
      viewport,
      fullPage: true,
      waitForAnimations: true,
    });
  }

  return screenshots;
}

/**
 * Test basic accessibility requirements
 * @param {import('@playwright/test').Page} page
 */
async function testAccessibility(page) {
  // Check for viewport meta tag
  const viewportMeta = await page.locator('meta[name="viewport"]').count();
  expect(viewportMeta).toBeGreaterThan(0);

  // Check for lang attribute
  const htmlLang = await page.locator('html[lang]').count();
  expect(htmlLang).toBeGreaterThan(0);

  // Check for main heading (h1)
  const h1Count = await page.locator('h1').count();
  expect(h1Count).toBeGreaterThan(0);

  // Check for descriptive title
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
  expect(title).not.toBe('Document'); // Should not be default title

  // Check all buttons have text or aria-label
  const buttons = await page.locator('button, a.btn, .cta').all();
  for (const button of buttons) {
    const text = await button.textContent();
    const ariaLabel = await button.getAttribute('aria-label');
    expect(text || ariaLabel).toBeTruthy();
  }
}

/**
 * Test responsive behavior at different breakpoints
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 */
async function testResponsiveBreakpoints(page, url) {
  const results = {};

  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    await page.setViewportSize(viewport);
    await page.goto(url);
    await waitForPageLoad(page);

    // Check if content is visible
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);

    // Check for horizontal scroll (should not exist)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    results[name] = {
      viewport,
      bodyVisible,
      hasHorizontalScroll,
      passed: bodyVisible && !hasHorizontalScroll,
    };
  }

  return results;
}

/**
 * Test animation performance (no janky animations)
 * @param {import('@playwright/test').Page} page
 */
async function testAnimationPerformance(page) {
  // Check for animations using transform/opacity (GPU-accelerated)
  const animations = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    const animatedElements = [];

    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.animationName !== 'none' || styles.transition !== 'all 0s ease 0s') {
        animatedElements.push({
          tag: el.tagName,
          animation: styles.animationName,
          transition: styles.transition,
        });
      }
    });

    return animatedElements;
  });

  return animations;
}

/**
 * Get page performance metrics
 * @param {import('@playwright/test').Page} page
 */
async function getPerformanceMetrics(page) {
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const paintData = performance.getEntriesByType('paint');

    return {
      // Navigation timing
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      domInteractive: perfData.domInteractive - perfData.fetchStart,

      // Paint timing
      firstPaint: paintData.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paintData.find(p => p.name === 'first-contentful-paint')?.startTime || 0,

      // Resource timing
      transferSize: perfData.transferSize,
      encodedBodySize: perfData.encodedBodySize,
      decodedBodySize: perfData.decodedBodySize,
    };
  });

  return metrics;
}

/**
 * Check if page meets performance targets
 * @param {import('@playwright/test').Page} page
 * @param {Object} targets
 */
async function assertPerformanceTargets(page, targets = {}) {
  const {
    maxLoadTime = 2000, // 2 seconds
    maxDOMContentLoaded = 1000, // 1 second
    maxFirstContentfulPaint = 1000, // 1 second
    maxTransferSize = 100000, // 100 KB
  } = targets;

  const metrics = await getPerformanceMetrics(page);

  expect(metrics.loadComplete).toBeLessThan(maxLoadTime);
  expect(metrics.domContentLoaded).toBeLessThan(maxDOMContentLoaded);
  expect(metrics.firstContentfulPaint).toBeLessThan(maxFirstContentfulPaint);
  expect(metrics.transferSize).toBeLessThan(maxTransferSize);

  return metrics;
}

/**
 * Wait for all images to load
 * @param {import('@playwright/test').Page} page
 */
async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      })
    );
  });
}

/**
 * Check for console errors
 * @param {import('@playwright/test').Page} page
 */
async function setupConsoleErrorTracking(page) {
  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  return { errors, warnings };
}

/**
 * Test CTA button visibility and clickability
 * @param {import('@playwright/test').Page} page
 */
async function testCTAButtons(page) {
  const ctaButtons = await page.locator('.cta, button.btn, a.btn, .btn-primary').all();

  for (const button of ctaButtons) {
    // Check visibility
    await expect(button).toBeVisible();

    // Check if it has text
    const text = await button.textContent();
    expect(text.trim().length).toBeGreaterThan(0);

    // Check if it's clickable (enabled)
    await expect(button).toBeEnabled();

    // Check if it has proper styling
    const backgroundColor = await button.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // Should not be transparent
  }

  return ctaButtons.length;
}

/**
 * Verify all final 10 landing pages exist
 */
const FINAL_PAGES = [
  { path: '/pages/think-different.html', name: 'Think Different' },
  { path: '/pages/workspace-infinity.html', name: 'Workspace Infinity' },
  { path: '/pages/truth-matters.html', name: 'Truth Matters' },
  { path: '/pages/love-letter-to-productivity.html', name: 'Love Letter' },
  { path: '/pages/secret-weapon.html', name: 'Secret Weapon' },
  { path: '/pages/pro.html', name: 'Pro' },
  { path: '/pages/email-savior.html', name: 'Email Savior' },
  { path: '/pages/meeting-notes-magic.html', name: 'Meeting Notes Magic' },
  { path: '/pages/writers-room.html', name: "The Writer's Room" },
  { path: '/pages/workflow-wizard.html', name: 'Workflow Wizard' },
];

module.exports = {
  VIEWPORTS,
  FINAL_PAGES,
  waitForPageLoad,
  captureScreenshot,
  captureMultiViewportScreenshots,
  testAccessibility,
  testResponsiveBreakpoints,
  testAnimationPerformance,
  getPerformanceMetrics,
  assertPerformanceTargets,
  waitForImages,
  setupConsoleErrorTracking,
  testCTAButtons,
};
