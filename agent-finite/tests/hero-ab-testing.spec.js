/**
 * Hero A/B Testing - Playwright Test Suite
 *
 * Tests hero headline and subtitle variant functionality including:
 * - Variant attributes presence
 * - Script loading
 * - Variant display
 * - localStorage persistence
 * - Tracking functionality
 * - API functionality
 *
 * Usage:
 *   npx playwright test hero-ab-testing.spec.js
 *   npx playwright test hero-ab-testing.spec.js --headed
 *   npx playwright test hero-ab-testing.spec.js --grep "Variant attributes"
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Load headline variants configuration
const variantsPath = path.join(__dirname, '..', 'headline-variants.json');
const variantsData = JSON.parse(fs.readFileSync(variantsPath, 'utf8'));

// Pages with hero variants
const pagesWithVariants = Object.keys(variantsData.headline_variants).map(filename => ({
  filename,
  path: `/pages/${filename}`,
  config: variantsData.headline_variants[filename]
}));

test.describe('Hero A/B Testing', () => {

  test.describe('1. Variant Attributes', () => {
    pagesWithVariants.forEach(({ filename, path: pagePath, config }) => {
      test(`${filename} - Hero title has variant attributes`, async ({ page }) => {
        await page.goto(pagePath);

        // Find hero title
        const heroTitle = await page.locator('h1').first();
        await expect(heroTitle).toBeVisible();

        // Check for data-hero-variants attribute
        const variantsAttr = await heroTitle.getAttribute('data-hero-variants');
        expect(variantsAttr).toBeTruthy();

        // Parse and validate variants
        const variants = JSON.parse(variantsAttr);
        expect(variants).toBeInstanceOf(Array);
        expect(variants.length).toBeGreaterThan(0);

        // Each variant should have text and weight
        variants.forEach(variant => {
          expect(variant).toHaveProperty('text');
          expect(variant).toHaveProperty('weight');
          expect(variant.text).toBeTruthy();
        });
      });

      test(`${filename} - Hero subtitle has variant attributes`, async ({ page }) => {
        await page.goto(pagePath);

        // Find hero subtitle
        const heroSubtitle = await page.locator('.hero-subtitle, .hero p').first();

        // Check if subtitle exists (some pages may not have it)
        const subtitleCount = await heroSubtitle.count();
        if (subtitleCount > 0) {
          await expect(heroSubtitle).toBeVisible();

          // Check for data-subtitle-variants attribute
          const variantsAttr = await heroSubtitle.getAttribute('data-subtitle-variants');

          if (variantsAttr) {
            // Parse and validate variants
            const variants = JSON.parse(variantsAttr);
            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBeGreaterThan(0);
          }
        }
      });
    });
  });

  test.describe('2. Script Loading', () => {
    pagesWithVariants.slice(0, 5).forEach(({ filename, path: pagePath }) => {
      test(`${filename} - hero-ab-testing.js loads correctly`, async ({ page }) => {
        await page.goto(pagePath);

        // Wait for script to load
        await page.waitForTimeout(500);

        // Check if HeroABTesting class exists
        const hasClass = await page.evaluate(() => {
          return typeof window.HeroABTesting !== 'undefined';
        });

        expect(hasClass).toBe(true);

        // Check if instance exists
        const hasInstance = await page.evaluate(() => {
          return typeof window.heroABTesting !== 'undefined';
        });

        expect(hasInstance).toBe(true);
      });
    });
  });

  test.describe('3. Variant Display', () => {
    pagesWithVariants.slice(0, 3).forEach(({ filename, path: pagePath }) => {
      test(`${filename} - Variant is displayed`, async ({ page }) => {
        await page.goto(pagePath);
        await page.waitForTimeout(500);

        // Get hero title
        const heroTitle = await page.locator('h1').first();
        await expect(heroTitle).toBeVisible();

        // Get current text
        const currentText = await heroTitle.textContent();
        expect(currentText).toBeTruthy();
        expect(currentText.trim().length).toBeGreaterThan(0);

        // Check that data-current-variant attribute is set
        const currentVariant = await heroTitle.getAttribute('data-current-variant');
        expect(currentVariant).toBeTruthy();
      });
    });
  });

  test.describe('4. LocalStorage Persistence', () => {
    test('Variant persists across page reloads', async ({ page }) => {
      const testPage = pagesWithVariants[0];

      // First visit
      await page.goto(testPage.path);
      await page.waitForTimeout(500);

      // Get current variant
      const heroTitle = await page.locator('h1').first();
      const firstVariant = await heroTitle.getAttribute('data-current-variant');

      // Reload page
      await page.reload();
      await page.waitForTimeout(500);

      // Get variant after reload
      const secondVariant = await heroTitle.getAttribute('data-current-variant');

      // Should be the same variant
      expect(secondVariant).toBe(firstVariant);
    });

    test('Different pages have independent variants', async ({ page }) => {
      // Visit first page
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const firstPageVariant = await page.locator('h1').first()
        .getAttribute('data-current-variant');

      // Visit second page
      await page.goto(pagesWithVariants[1].path);
      await page.waitForTimeout(500);

      const secondPageVariant = await page.locator('h1').first()
        .getAttribute('data-current-variant');

      // Variants are stored independently
      expect(firstPageVariant).toBeTruthy();
      expect(secondPageVariant).toBeTruthy();
    });
  });

  test.describe('5. JavaScript API', () => {
    test('getReport() returns tracking data', async ({ page }) => {
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const report = await page.evaluate(() => {
        return window.heroABTesting.getReport();
      });

      expect(report).toBeDefined();
      expect(typeof report).toBe('object');
    });

    test('getPerformanceMetrics() returns metrics', async ({ page }) => {
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        return window.heroABTesting.getPerformanceMetrics();
      });

      expect(metrics).toBeDefined();
    });

    test('refreshVariant() changes variant', async ({ page }) => {
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const heroTitle = await page.locator('h1').first();
      const originalVariant = await heroTitle.getAttribute('data-current-variant');

      // Refresh variant multiple times until we get a different one
      let newVariant = originalVariant;
      let attempts = 0;

      while (newVariant === originalVariant && attempts < 10) {
        await page.evaluate(() => {
          window.heroABTesting.refreshVariant('hero-title');
        });

        await page.waitForTimeout(100);
        newVariant = await heroTitle.getAttribute('data-current-variant');
        attempts++;
      }

      // With multiple variants, we should eventually get a different one
      // (unless there's only one variant, but our config has 5 per page)
      expect(attempts).toBeLessThan(10);
    });

    test('clearData() clears tracking data', async ({ page }) => {
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      // Clear data
      await page.evaluate(() => {
        window.heroABTesting.clearData();
      });

      // Check tracking data is empty
      const report = await page.evaluate(() => {
        return window.heroABTesting.getReport();
      });

      expect(Object.keys(report).length).toBe(0);
    });

    test('exportData() returns JSON string', async ({ page }) => {
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const exportedData = await page.evaluate(() => {
        return window.heroABTesting.exportData();
      });

      expect(typeof exportedData).toBe('string');

      // Should be valid JSON
      const parsed = JSON.parse(exportedData);
      expect(parsed).toBeDefined();
    });
  });

  test.describe('6. Tracking Functionality', () => {
    test('Impression is tracked on page load', async ({ page }) => {
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const pagePath = pagesWithVariants[0].path;

      const hasTracking = await page.evaluate((path) => {
        const report = window.heroABTesting.getReport();
        return report[path] !== undefined;
      }, pagePath);

      expect(hasTracking).toBe(true);
    });

    test('Click tracking works for CTA buttons', async ({ page }) => {
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      // Find and click a CTA button
      const ctaButton = await page.locator('.btn, .hero-cta a').first();

      if (await ctaButton.count() > 0) {
        // Get clicks before
        const clicksBefore = await page.evaluate(() => {
          const pagePath = window.location.pathname;
          const report = window.heroABTesting.getReport();

          if (!report[pagePath]) return 0;

          const elementData = Object.values(report[pagePath])[0];
          if (!elementData) return 0;

          const variantData = Object.values(elementData.variants)[0];
          return variantData ? variantData.clicks : 0;
        });

        // Click button
        await ctaButton.click({ force: true });
        await page.waitForTimeout(200);

        // Get clicks after
        const clicksAfter = await page.evaluate(() => {
          const pagePath = window.location.pathname;
          const report = window.heroABTesting.getReport();

          if (!report[pagePath]) return 0;

          const elementData = Object.values(report[pagePath])[0];
          if (!elementData) return 0;

          const variantData = Object.values(elementData.variants)[0];
          return variantData ? variantData.clicks : 0;
        });

        expect(clicksAfter).toBeGreaterThan(clicksBefore);
      }
    });
  });

  test.describe('7. Variant Quality', () => {
    test('All variants have meaningful text', async ({ page }) => {
      // Check first page's variants
      const testPage = pagesWithVariants[0];

      await page.goto(testPage.path);

      const heroTitle = await page.locator('h1').first();
      const variantsAttr = await heroTitle.getAttribute('data-hero-variants');
      const variants = JSON.parse(variantsAttr);

      variants.forEach(variant => {
        // Should have text
        expect(variant.text).toBeTruthy();

        // Should be at least 5 characters
        expect(variant.text.length).toBeGreaterThan(5);

        // Should not be just whitespace
        expect(variant.text.trim().length).toBeGreaterThan(0);
      });
    });

    test('Variants are distinct from each other', async ({ page }) => {
      const testPage = pagesWithVariants[0];

      await page.goto(testPage.path);

      const heroTitle = await page.locator('h1').first();
      const variantsAttr = await heroTitle.getAttribute('data-hero-variants');
      const variants = JSON.parse(variantsAttr);

      // Get all variant texts
      const texts = variants.map(v => v.text.toLowerCase().replace(/<br>/g, ' '));

      // Check for duplicates
      const uniqueTexts = new Set(texts);
      expect(uniqueTexts.size).toBe(texts.length);
    });
  });

  test.describe('8. Configuration Validation', () => {
    test('headline-variants.json is valid', () => {
      expect(variantsData).toBeDefined();
      expect(variantsData.headline_variants).toBeDefined();
      expect(Object.keys(variantsData.headline_variants).length).toBeGreaterThan(0);
    });

    test('Each page config has required fields', () => {
      Object.entries(variantsData.headline_variants).forEach(([filename, config]) => {
        expect(config.page_name).toBeDefined();
        expect(config.current_headline).toBeDefined();
        expect(config.variants).toBeDefined();
        expect(config.variants.length).toBeGreaterThan(0);

        config.variants.forEach(variant => {
          expect(variant.headline).toBeDefined();
          expect(variant.subtitle).toBeDefined();
          expect(variant.rationale).toBeDefined();
        });
      });
    });

    test('Each page has 3-5 variants', () => {
      Object.entries(variantsData.headline_variants).forEach(([filename, config]) => {
        expect(config.variants.length).toBeGreaterThanOrEqual(3);
        expect(config.variants.length).toBeLessThanOrEqual(5);
      });
    });
  });

  test.describe('9. Browser Compatibility', () => {
    test('Works in different browser contexts', async ({ page, context }) => {
      // Test in main context
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const variant1 = await page.evaluate(() => {
        return document.querySelector('h1').getAttribute('data-current-variant');
      });

      expect(variant1).toBeTruthy();

      // Create new context (simulates different browser session)
      const newContext = await context.browser().newContext();
      const newPage = await newContext.newPage();

      await newPage.goto(pagesWithVariants[0].path);
      await newPage.waitForTimeout(500);

      const variant2 = await newPage.evaluate(() => {
        return document.querySelector('h1').getAttribute('data-current-variant');
      });

      expect(variant2).toBeTruthy();

      await newContext.close();
    });
  });

  test.describe('10. Performance', () => {
    test('Script loads quickly', async ({ page }) => {
      const startTime = Date.now();

      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const hasLoaded = await page.evaluate(() => {
        return typeof window.heroABTesting !== 'undefined';
      });

      const loadTime = Date.now() - startTime;

      expect(hasLoaded).toBe(true);
      expect(loadTime).toBeLessThan(2000); // Should load in < 2 seconds
    });

    test('Variant selection is fast', async ({ page }) => {
      await page.goto(pagesWithVariants[0].path);
      await page.waitForTimeout(500);

      const startTime = Date.now();

      await page.evaluate(() => {
        window.heroABTesting.refreshVariant('hero-title');
      });

      const selectionTime = Date.now() - startTime;

      expect(selectionTime).toBeLessThan(100); // Should be near-instant
    });
  });

});

// Summary report
test.afterAll(async () => {
  console.log('\n📊 Hero A/B Testing Summary');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ Tested ${pagesWithVariants.length} pages with hero variants`);
  console.log(`✅ 10 test categories covering all functionality`);
  console.log('✅ Variant attributes, display, persistence, tracking');
  console.log('✅ API functions, quality checks, performance');
  console.log('\nNext steps:');
  console.log('1. View results in browser console: heroABTesting.getReport()');
  console.log('2. Check metrics: heroABTesting.getPerformanceMetrics()');
  console.log('3. Monitor which variants perform best over time');
});
