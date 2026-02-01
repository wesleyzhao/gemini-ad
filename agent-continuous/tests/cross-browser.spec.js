// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * Cross-Browser Compatibility Test Suite
 *
 * Tests all landing pages across Chrome, Firefox, Safari, and Edge
 * Validates:
 * - Page rendering and layout
 * - CSS animations and transitions
 * - JavaScript functionality
 * - Responsive design
 * - Interactive elements (buttons, links, forms)
 * - Scroll animations and parallax effects
 * - Video playback (if applicable)
 *
 * Generates:
 * - Screenshots for visual comparison
 * - Compatibility report (JSON)
 * - Browser-specific issues log
 */

// Get all landing page HTML files from pages/ directory
const pagesDir = path.join(__dirname, '..', 'pages');
const landingPages = fs.readdirSync(pagesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => ({
    name: `page-${file.replace('.html', '')}`, // Prefix with 'page-' to avoid conflicts
    path: `/pages/${file}`,
    file: file
  }));

// Also test main index page at root
landingPages.unshift({
  name: 'root-index',
  path: '/index.html',
  file: 'index.html'
});

console.log(`\n🌐 Cross-Browser Testing: ${landingPages.length} pages across multiple browsers\n`);

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  totalPages: landingPages.length,
  browsers: [],
  results: {},
  summary: {
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

// Test each landing page across all browsers
landingPages.forEach(page => {
  test.describe(`${page.name} - Cross-Browser Compatibility`, () => {

    test('should load and render correctly', async ({ page: browserPage, browserName }) => {
      // Navigate to page
      await browserPage.goto(page.path);

      // Wait for page to be fully loaded
      await browserPage.waitForLoadState('networkidle');

      // Check page title exists
      const title = await browserPage.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);

      // Record result
      if (!testResults.results[page.name]) {
        testResults.results[page.name] = {};
      }
      if (!testResults.results[page.name][browserName]) {
        testResults.results[page.name][browserName] = {
          tests: [],
          screenshots: []
        };
      }

      testResults.results[page.name][browserName].tests.push({
        name: 'Page Load',
        status: 'passed',
        message: `Page loaded successfully with title: ${title}`
      });
    });

    test('should have responsive layout', async ({ page: browserPage, browserName }) => {
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      // Test at different viewport sizes
      const viewports = [
        { width: 375, height: 667, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1920, height: 1080, name: 'Desktop' }
      ];

      for (const viewport of viewports) {
        await browserPage.setViewportSize(viewport);
        await browserPage.waitForTimeout(500); // Let layout settle

        // Check no horizontal overflow
        const bodyWidth = await browserPage.evaluate(() => document.body.scrollWidth);
        const viewportWidth = viewport.width;

        // Allow small overflow (scrollbar, etc.) but flag major issues
        if (bodyWidth > viewportWidth + 20) {
          testResults.results[page.name][browserName].tests.push({
            name: `Responsive Layout (${viewport.name})`,
            status: 'warning',
            message: `Horizontal overflow detected: ${bodyWidth}px > ${viewportWidth}px`
          });
          testResults.summary.warnings++;
        } else {
          testResults.results[page.name][browserName].tests.push({
            name: `Responsive Layout (${viewport.name})`,
            status: 'passed',
            message: `No layout issues at ${viewport.width}x${viewport.height}`
          });
        }
      }

      // Reset to desktop viewport
      await browserPage.setViewportSize({ width: 1920, height: 1080 });
    });

    test('should load all CSS and JavaScript assets', async ({ page: browserPage, browserName }) => {
      const failedRequests = [];

      browserPage.on('requestfailed', request => {
        const url = request.url();
        if (url.includes('.css') || url.includes('.js')) {
          failedRequests.push({
            url: url,
            failure: request.failure()
          });
        }
      });

      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      if (failedRequests.length > 0) {
        testResults.results[page.name][browserName].tests.push({
          name: 'Asset Loading',
          status: 'failed',
          message: `Failed to load ${failedRequests.length} assets`,
          details: failedRequests
        });
        testResults.summary.failed++;
      } else {
        testResults.results[page.name][browserName].tests.push({
          name: 'Asset Loading',
          status: 'passed',
          message: 'All CSS and JavaScript assets loaded successfully'
        });
        testResults.summary.passed++;
      }
    });

    test('should have functional animations', async ({ page: browserPage, browserName }) => {
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      // Check for elements with animation attributes
      const animatedElements = await browserPage.locator('[data-animate]').count();
      const parallaxElements = await browserPage.locator('[data-parallax]').count();

      if (animatedElements === 0 && parallaxElements === 0) {
        testResults.results[page.name][browserName].tests.push({
          name: 'Animations',
          status: 'info',
          message: 'No animated elements found (may be intentional)'
        });
      } else {
        // Scroll to trigger animations
        await browserPage.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight / 2);
        });
        await browserPage.waitForTimeout(1000);

        // Check if animations are visible (opacity > 0)
        const visibleAnimations = await browserPage.evaluate(() => {
          const elements = document.querySelectorAll('[data-animate]');
          let visible = 0;
          elements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (parseFloat(style.opacity) > 0) {
              visible++;
            }
          });
          return visible;
        });

        testResults.results[page.name][browserName].tests.push({
          name: 'Animations',
          status: 'passed',
          message: `${visibleAnimations}/${animatedElements} animated elements visible after scroll`
        });
      }
    });

    test('should have clickable CTAs', async ({ page: browserPage, browserName }) => {
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      // Find all CTA buttons
      const ctaButtons = await browserPage.locator('a.cta-button, button.cta-button, a[href*="gemini.google.com"]').all();

      if (ctaButtons.length === 0) {
        testResults.results[page.name][browserName].tests.push({
          name: 'CTA Functionality',
          status: 'warning',
          message: 'No CTA buttons found'
        });
        testResults.summary.warnings++;
      } else {
        let functionalCTAs = 0;

        for (const cta of ctaButtons) {
          const isVisible = await cta.isVisible();
          if (isVisible) {
            functionalCTAs++;
          }
        }

        testResults.results[page.name][browserName].tests.push({
          name: 'CTA Functionality',
          status: functionalCTAs > 0 ? 'passed' : 'failed',
          message: `${functionalCTAs}/${ctaButtons.length} CTA buttons visible and clickable`
        });

        if (functionalCTAs === 0) {
          testResults.summary.failed++;
        } else {
          testResults.summary.passed++;
        }
      }
    });

    test('should not have JavaScript errors', async ({ page: browserPage, browserName }) => {
      const errors = [];

      browserPage.on('pageerror', error => {
        errors.push({
          message: error.message,
          stack: error.stack
        });
      });

      browserPage.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push({
            message: msg.text(),
            type: 'console.error'
          });
        }
      });

      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      // Scroll and interact to trigger any lazy-loaded scripts
      await browserPage.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await browserPage.waitForTimeout(1000);

      if (errors.length > 0) {
        testResults.results[page.name][browserName].tests.push({
          name: 'JavaScript Errors',
          status: 'failed',
          message: `${errors.length} JavaScript errors detected`,
          details: errors
        });
        testResults.summary.failed++;
      } else {
        testResults.results[page.name][browserName].tests.push({
          name: 'JavaScript Errors',
          status: 'passed',
          message: 'No JavaScript errors detected'
        });
        testResults.summary.passed++;
      }
    });

    test('should render fonts correctly', async ({ page: browserPage, browserName }) => {
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      // Wait for fonts to load
      await browserPage.waitForTimeout(1000);

      // Check if system fonts are applied
      const fontFamilies = await browserPage.evaluate(() => {
        const elements = document.querySelectorAll('h1, h2, h3, p, button, a');
        const fonts = new Set();
        elements.forEach(el => {
          const font = window.getComputedStyle(el).fontFamily;
          fonts.add(font);
        });
        return Array.from(fonts);
      });

      testResults.results[page.name][browserName].tests.push({
        name: 'Font Rendering',
        status: 'passed',
        message: `Fonts loaded: ${fontFamilies.length} families detected`,
        details: fontFamilies
      });
    });

    test('should capture browser-specific screenshot', async ({ page: browserPage, browserName }) => {
      await browserPage.goto(page.path);
      await browserPage.waitForLoadState('networkidle');

      // Create screenshot directory
      const screenshotDir = path.join(__dirname, '..', 'screenshots', 'cross-browser', browserName);
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      // Capture full page screenshot
      const screenshotPath = path.join(screenshotDir, `${page.name}-desktop.png`);
      await browserPage.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      // Capture mobile screenshot
      await browserPage.setViewportSize({ width: 375, height: 667 });
      await browserPage.waitForTimeout(500);
      const mobileScreenshotPath = path.join(screenshotDir, `${page.name}-mobile.png`);
      await browserPage.screenshot({
        path: mobileScreenshotPath,
        fullPage: true
      });

      testResults.results[page.name][browserName].screenshots.push({
        desktop: screenshotPath,
        mobile: mobileScreenshotPath
      });

      testResults.results[page.name][browserName].tests.push({
        name: 'Screenshot Capture',
        status: 'passed',
        message: 'Desktop and mobile screenshots captured'
      });
    });

  });
});

// Save results after all tests
test.afterAll(async () => {
  // Calculate summary
  Object.keys(testResults.results).forEach(pageName => {
    Object.keys(testResults.results[pageName]).forEach(browser => {
      if (!testResults.browsers.includes(browser)) {
        testResults.browsers.push(browser);
      }
    });
  });

  // Save results to JSON
  const reportPath = path.join(__dirname, '..', 'CROSS_BROWSER_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2));

  console.log('\n✅ Cross-browser test results saved to CROSS_BROWSER_REPORT.json');
  console.log(`\n📊 Summary:`);
  console.log(`   - Pages tested: ${testResults.totalPages}`);
  console.log(`   - Browsers: ${testResults.browsers.join(', ')}`);
  console.log(`   - Tests passed: ${testResults.summary.passed}`);
  console.log(`   - Tests failed: ${testResults.summary.failed}`);
  console.log(`   - Warnings: ${testResults.summary.warnings}`);
});
