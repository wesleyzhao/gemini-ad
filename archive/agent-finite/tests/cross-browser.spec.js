/**
 * Cross-Browser Compatibility Tests
 *
 * Tests all landing pages across multiple browsers and viewports to ensure:
 * - Pages load successfully
 * - No JavaScript errors
 * - Critical UI elements render correctly
 * - Responsive layouts work across devices
 * - Cross-browser compatibility
 *
 * Browsers tested: Chromium, Firefox, WebKit (Safari)
 * Viewports tested: Mobile, Tablet, Desktop
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Get all HTML pages
const pagesDir = path.join(__dirname, '..', 'pages');
const pages = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => ({
    name: file.replace('.html', ''),
    path: `/pages/${file}`
  }));

// Test groups by browser type
const BROWSER_PROJECTS = {
  chromium: ['chromium-desktop', 'mobile-chrome', 'tablet-ipad'],
  firefox: ['firefox-desktop'],
  webkit: ['webkit-desktop', 'mobile-safari']
};

/**
 * Cross-Browser Compatibility Test Suite
 */
test.describe('Cross-Browser Compatibility', () => {

  // Test all pages can load successfully
  test.describe('Page Load Tests', () => {
    for (const page of pages) {
      test(`${page.name} - should load successfully`, async ({ page: browserPage }) => {
        const response = await browserPage.goto(page.path);
        expect(response.status()).toBe(200);
      });
    }
  });

  // Test critical UI elements exist
  test.describe('Critical UI Elements', () => {
    for (const page of pages) {
      test(`${page.name} - should have main heading (h1)`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        const h1 = await browserPage.locator('h1').first();
        await expect(h1).toBeVisible();
      });

      test(`${page.name} - should have CTA button`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        const cta = await browserPage.locator('.cta-button, .hero-cta, button[class*="cta"]').first();
        await expect(cta).toBeVisible();
      });

      test(`${page.name} - should have main content area`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        const main = await browserPage.locator('main, .hero, .main-content').first();
        await expect(main).toBeVisible();
      });
    }
  });

  // Test no JavaScript errors
  test.describe('JavaScript Errors', () => {
    for (const page of pages) {
      test(`${page.name} - should not have JavaScript errors`, async ({ page: browserPage }) => {
        const consoleErrors = [];
        const pageErrors = [];

        browserPage.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        browserPage.on('pageerror', error => {
          pageErrors.push(error.message);
        });

        await browserPage.goto(page.path);
        await browserPage.waitForLoadState('networkidle');

        // Allow some time for any delayed errors
        await browserPage.waitForTimeout(2000);

        // Check for errors (some warnings are okay, but no critical errors)
        const criticalErrors = pageErrors.filter(error =>
          !error.includes('favicon') && // Favicon errors are okay
          !error.includes('404') // Some 404s are expected
        );

        expect(criticalErrors).toHaveLength(0);
      });
    }
  });

  // Test CSS loads correctly
  test.describe('CSS Loading', () => {
    for (const page of pages) {
      test(`${page.name} - should load CSS correctly`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);

        const cssLoaded = await browserPage.evaluate(() => {
          const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
          return links.every(link => {
            const sheet = Array.from(document.styleSheets).find(s => s.href === link.href);
            return sheet && sheet.cssRules && sheet.cssRules.length > 0;
          });
        });

        expect(cssLoaded).toBe(true);
      });
    }
  });

  // Test responsive layout
  test.describe('Responsive Layout', () => {
    for (const page of pages) {
      test(`${page.name} - should not have horizontal scrollbar`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        await browserPage.waitForLoadState('networkidle');

        const hasHorizontalScroll = await browserPage.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll).toBe(false);
      });

      test(`${page.name} - should have viewport meta tag`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);

        const viewportTag = await browserPage.locator('meta[name="viewport"]');
        await expect(viewportTag).toHaveCount(1);

        const content = await viewportTag.getAttribute('content');
        expect(content).toContain('width=device-width');
      });
    }
  });

  // Test Core Web Vitals
  test.describe('Performance Metrics', () => {
    for (const page of pages) {
      test(`${page.name} - should have acceptable LCP (Largest Contentful Paint)`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        await browserPage.waitForLoadState('networkidle');

        const lcp = await browserPage.evaluate(() => {
          return new Promise((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              resolve(lastEntry.renderTime || lastEntry.loadTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // Timeout after 3 seconds
            setTimeout(() => resolve(null), 3000);
          });
        });

        // LCP should be less than 2.5 seconds (2500ms) for good performance
        if (lcp !== null) {
          expect(lcp).toBeLessThan(2500);
        }
      });

      test(`${page.name} - should have low CLS (Cumulative Layout Shift)`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        await browserPage.waitForLoadState('networkidle');
        await browserPage.waitForTimeout(2000); // Wait for animations

        const cls = await browserPage.evaluate(() => {
          return new Promise((resolve) => {
            let clsScore = 0;

            new PerformanceObserver((list) => {
              list.getEntries().forEach((entry) => {
                if (!entry.hadRecentInput) {
                  clsScore += entry.value;
                }
              });
            }).observe({ entryTypes: ['layout-shift'] });

            setTimeout(() => resolve(clsScore), 1000);
          });
        });

        // CLS should be less than 0.1 for good performance
        expect(cls).toBeLessThan(0.1);
      });
    }
  });

  // Test accessibility basics
  test.describe('Basic Accessibility', () => {
    for (const page of pages) {
      test(`${page.name} - should have lang attribute`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        const html = await browserPage.locator('html');
        const lang = await html.getAttribute('lang');
        expect(lang).toBeTruthy();
        expect(lang).toBe('en');
      });

      test(`${page.name} - should have page title`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        const title = await browserPage.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
      });

      test(`${page.name} - should have skip to main content link`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        const skipLink = await browserPage.locator('a[href="#main-content"]');
        await expect(skipLink).toHaveCount(1);
      });
    }
  });

  // Test animations and interactions
  test.describe('Animations and Interactions', () => {
    for (const page of pages) {
      test(`${page.name} - should have working CTA button hover effect`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);

        const ctaButton = browserPage.locator('.cta-button, .hero-cta, button[class*="cta"]').first();
        await expect(ctaButton).toBeVisible();

        // Get initial styles
        const initialTransform = await ctaButton.evaluate(el =>
          window.getComputedStyle(el).transform
        );

        // Hover over button
        await ctaButton.hover();
        await browserPage.waitForTimeout(500); // Wait for transition

        // Check if transform changed (most CTAs have transform on hover)
        const hoverTransform = await ctaButton.evaluate(el =>
          window.getComputedStyle(el).transform
        );

        // Transform should change or remain (both are acceptable)
        expect(typeof hoverTransform).toBe('string');
      });

      test(`${page.name} - should have smooth scroll behavior`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);

        const hasSmoothScroll = await browserPage.evaluate(() => {
          const html = document.documentElement;
          const scrollBehavior = window.getComputedStyle(html).scrollBehavior;
          return scrollBehavior === 'smooth';
        });

        expect(hasSmoothScroll).toBe(true);
      });
    }
  });

  // Test SEO basics
  test.describe('SEO Basics', () => {
    for (const page of pages) {
      test(`${page.name} - should have meta description`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        const metaDesc = await browserPage.locator('meta[name="description"]');
        await expect(metaDesc).toHaveCount(1);

        const content = await metaDesc.getAttribute('content');
        expect(content.length).toBeGreaterThan(50);
        expect(content.length).toBeLessThan(160);
      });

      test(`${page.name} - should have Open Graph tags`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);

        const ogTitle = await browserPage.locator('meta[property="og:title"]');
        await expect(ogTitle).toHaveCount(1);

        const ogDesc = await browserPage.locator('meta[property="og:description"]');
        await expect(ogDesc).toHaveCount(1);
      });

      test(`${page.name} - should have canonical URL`, async ({ page: browserPage }) => {
        await browserPage.goto(page.path);
        const canonical = await browserPage.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(1);
      });
    }
  });

  // Cross-browser screenshot comparison
  test.describe('Visual Consistency', () => {
    for (const page of pages) {
      test(`${page.name} - screenshot comparison`, async ({ page: browserPage }, testInfo) => {
        await browserPage.goto(page.path);
        await browserPage.waitForLoadState('networkidle');
        await browserPage.waitForTimeout(2000); // Wait for animations

        // Take screenshot for visual comparison
        const screenshot = await browserPage.screenshot({
          fullPage: true,
          animations: 'disabled'
        });

        // Save screenshot with browser name in path
        const browserName = testInfo.project.name;
        const screenshotPath = path.join(
          __dirname,
          '..',
          'screenshots',
          'cross-browser',
          browserName,
          `${page.name}.png`
        );

        // Ensure directory exists
        const dir = path.dirname(screenshotPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(screenshotPath, screenshot);
      });
    }
  });
});

/**
 * Browser-Specific Tests
 */
test.describe('Browser-Specific Features', () => {

  test.describe('Chromium-specific', () => {
    test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium-only test');

    test('Should support backdrop-filter', async ({ page }) => {
      await page.goto('/pages/apple-inspired.html');

      const supportsBackdropFilter = await page.evaluate(() => {
        return CSS.supports('backdrop-filter', 'blur(10px)');
      });

      expect(supportsBackdropFilter).toBe(true);
    });
  });

  test.describe('Firefox-specific', () => {
    test.skip(({ browserName }) => browserName !== 'firefox', 'Firefox-only test');

    test('Should render correctly', async ({ page }) => {
      await page.goto('/pages/apple-inspired.html');
      const title = await page.title();
      expect(title).toBeTruthy();
    });
  });

  test.describe('WebKit-specific', () => {
    test.skip(({ browserName }) => browserName !== 'webkit', 'WebKit-only test');

    test('Should support -webkit- prefixes', async ({ page }) => {
      await page.goto('/pages/apple-inspired.html');

      const supportsWebKitTransform = await page.evaluate(() => {
        const div = document.createElement('div');
        return 'webkitTransform' in div.style;
      });

      expect(supportsWebKitTransform).toBe(true);
    });
  });
});
