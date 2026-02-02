/**
 * CTA Optimization & A/B Testing Tests
 * =====================================
 * Comprehensive test suite for CTA variants and A/B testing framework
 *
 * Test Coverage:
 * - CTA variant rendering
 * - Style combinations
 * - A/B test initialization
 * - Variant assignment
 * - Click tracking
 * - Conversion tracking
 * - Results analysis
 * - LocalStorage persistence
 * - Responsive design
 * - Accessibility
 *
 * Run: npx playwright test tests/cta-optimization.spec.js
 */

const { test, expect } = require('@playwright/test');

test.describe('CTA Optimization & A/B Testing', () => {

    test.describe('Demo Page Loading', () => {
        test('should load demo page successfully', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');
            await expect(page).toHaveTitle(/CTA Optimization/);
            await expect(page.locator('h1')).toContainText('CTA Optimization');
        });

        test('should load all required CSS and JS files', async ({ page }) => {
            const responses = [];
            page.on('response', response => responses.push(response));

            await page.goto('/pages/cta-optimization-demo.html');

            // Check CSS files loaded
            const cssLoaded = responses.some(r => r.url().includes('cta-variants.css') && r.status() === 200);
            expect(cssLoaded).toBeTruthy();

            // Check JS files loaded
            const jsLoaded = responses.some(r => r.url().includes('ab-testing.js') && r.status() === 200);
            expect(jsLoaded).toBeTruthy();
        });

        test('should have ABTest global object available', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const abTestExists = await page.evaluate(() => typeof window.ABTest !== 'undefined');
            expect(abTestExists).toBeTruthy();
        });

        test('should have CTACopyVariants global object available', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const copyVariantsExist = await page.evaluate(() => typeof window.CTACopyVariants !== 'undefined');
            expect(copyVariantsExist).toBeTruthy();
        });
    });

    test.describe('CTA Variants Rendering', () => {
        test('should display all color variants', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // Check primary
            const primary = page.locator('.cta-primary').first();
            await expect(primary).toBeVisible();
            await expect(primary).toHaveCSS('background', /4285f4|66, 133, 244/);

            // Check secondary
            const secondary = page.locator('.cta-secondary').first();
            await expect(secondary).toBeVisible();

            // Check tertiary
            const tertiary = page.locator('.cta-tertiary').first();
            await expect(tertiary).toBeVisible();

            // Check danger
            const danger = page.locator('.cta-danger').first();
            await expect(danger).toBeVisible();

            // Check dark
            const dark = page.locator('.cta-dark').first();
            await expect(dark).toBeVisible();
        });

        test('should display all size variants', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const small = page.locator('.cta-small').first();
            const large = page.locator('.cta-large').first();
            const xlarge = page.locator('.cta-xlarge').first();

            await expect(small).toBeVisible();
            await expect(large).toBeVisible();
            await expect(xlarge).toBeVisible();
        });

        test('should display all shape variants', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const pill = page.locator('.cta-pill').first();
            const square = page.locator('.cta-square').first();
            const soft = page.locator('.cta-soft').first();

            await expect(pill).toBeVisible();
            await expect(square).toBeVisible();
            await expect(soft).toBeVisible();
        });

        test('should display special effects variants', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const glow = page.locator('.cta-glow').first();
            const pulse = page.locator('.cta-pulse').first();
            const arrow = page.locator('.cta-arrow').first();

            await expect(glow).toBeVisible();
            await expect(pulse).toBeVisible();
            await expect(arrow).toBeVisible();
        });

        test('should apply hover effects', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-primary').first();

            // Get initial transform
            const initialTransform = await cta.evaluate(el =>
                window.getComputedStyle(el).transform
            );

            // Hover
            await cta.hover();
            await page.waitForTimeout(100);

            // Should have transform on hover
            const hoverTransform = await cta.evaluate(el =>
                window.getComputedStyle(el).transform
            );

            // Transform should change on hover (translateY)
            expect(hoverTransform).not.toBe(initialTransform);
        });
    });

    test.describe('A/B Testing Framework', () => {
        test('should initialize A/B testing framework', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const initialized = await page.evaluate(() => {
                return typeof window.ABTest !== 'undefined' &&
                       typeof window.ABTest.init === 'function' &&
                       typeof window.ABTest.trackConversion === 'function';
            });

            expect(initialized).toBeTruthy();
        });

        test('should discover all A/B tests on page', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const tests = await page.evaluate(() => {
                const allResults = window.ABTest.getAllResults();
                return Object.keys(allResults);
            });

            // Should find hero-cta, secondary-cta, urgency-cta
            expect(tests.length).toBeGreaterThanOrEqual(3);
            expect(tests).toContain('hero-cta');
            expect(tests).toContain('secondary-cta');
            expect(tests).toContain('urgency-cta');
        });

        test('should assign user to a variant', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const variant = await page.evaluate(() => {
                return window.ABTest.getVariant('hero-cta');
            });

            // Should be assigned to A, B, C, or D
            expect(['A', 'B', 'C', 'D']).toContain(variant);
        });

        test('should show only assigned variant', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const visibleVariants = await page.locator('[data-ab-test="hero-cta"]:visible').count();

            // Only 1 variant should be visible
            expect(visibleVariants).toBe(1);
        });

        test('should hide non-assigned variants', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const hiddenVariants = await page.locator('[data-ab-test="hero-cta"][style*="display: none"]').count();

            // At least 3 variants should be hidden (total 4 variants, 1 visible)
            expect(hiddenVariants).toBeGreaterThanOrEqual(3);
        });

        test('should persist variant assignment across page reloads', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const variant1 = await page.evaluate(() => window.ABTest.getVariant('hero-cta'));

            // Reload page
            await page.reload();

            const variant2 = await page.evaluate(() => window.ABTest.getVariant('hero-cta'));

            // Should be same variant after reload
            expect(variant1).toBe(variant2);
        });
    });

    test.describe('Click Tracking', () => {
        test('should track clicks on CTA variants', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // Get initial click count
            const initialClicks = await page.evaluate(() => {
                const results = window.ABTest.getResults('hero-cta');
                return results.totalClicks;
            });

            // Click the visible variant
            const visibleVariant = page.locator('[data-ab-test="hero-cta"]:visible');
            await visibleVariant.click();

            // Wait a bit for tracking
            await page.waitForTimeout(100);

            // Get new click count
            const newClicks = await page.evaluate(() => {
                const results = window.ABTest.getResults('hero-cta');
                return results.totalClicks;
            });

            // Should have one more click
            expect(newClicks).toBe(initialClicks + 1);
        });

        test('should track impressions when variant is shown', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const impressions = await page.evaluate(() => {
                const results = window.ABTest.getResults('hero-cta');
                return results.totalImpressions;
            });

            // Should have at least 1 impression (the shown variant)
            expect(impressions).toBeGreaterThanOrEqual(1);
        });
    });

    test.describe('Conversion Tracking', () => {
        test('should track conversions', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // Get initial conversion count
            const initialConversions = await page.evaluate(() => {
                const results = window.ABTest.getResults('hero-cta');
                return results.totalConversions;
            });

            // Track a conversion
            await page.evaluate(() => {
                window.ABTest.trackConversion('hero-cta');
            });

            // Get new conversion count
            const newConversions = await page.evaluate(() => {
                const results = window.ABTest.getResults('hero-cta');
                return results.totalConversions;
            });

            // Should have one more conversion
            expect(newConversions).toBe(initialConversions + 1);
        });

        test('should calculate conversion rate', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // Click and convert
            const visibleVariant = page.locator('[data-ab-test="hero-cta"]:visible');
            await visibleVariant.click();
            await page.waitForTimeout(100);

            await page.evaluate(() => {
                window.ABTest.trackConversion('hero-cta');
            });

            // Get results
            const results = await page.evaluate(() => {
                return window.ABTest.getResults('hero-cta');
            });

            // Should have CVR calculated
            expect(results.variants.length).toBeGreaterThan(0);
            expect(results.variants[0]).toHaveProperty('cvr');
        });
    });

    test.describe('Results Analysis', () => {
        test('should get results for specific test', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const results = await page.evaluate(() => {
                return window.ABTest.getResults('hero-cta');
            });

            expect(results).toBeTruthy();
            expect(results).toHaveProperty('testName');
            expect(results).toHaveProperty('variants');
            expect(results).toHaveProperty('totalClicks');
            expect(results).toHaveProperty('totalConversions');
        });

        test('should get all results', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const allResults = await page.evaluate(() => {
                return window.ABTest.getAllResults();
            });

            expect(allResults).toBeTruthy();
            expect(Object.keys(allResults).length).toBeGreaterThanOrEqual(3);
        });

        test('should display results in results panel', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // Click "View Results" button
            await page.click('button:has-text("View Results")');

            // Wait for results to appear
            await page.waitForSelector('.results-panel', { timeout: 5000 });

            // Check results panel is visible
            const resultsPanel = page.locator('.results-panel');
            await expect(resultsPanel).toBeVisible();
        });
    });

    test.describe('LocalStorage Persistence', () => {
        test('should save data to localStorage', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const hasData = await page.evaluate(() => {
                const data = localStorage.getItem('abtest_data');
                return data !== null;
            });

            expect(hasData).toBeTruthy();
        });

        test('should load data from localStorage on init', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // Set some data
            await page.evaluate(() => {
                window.ABTest.trackConversion('hero-cta');
            });

            // Reload page
            await page.reload();

            // Check data persisted
            const results = await page.evaluate(() => {
                return window.ABTest.getResults('hero-cta');
            });

            expect(results.totalConversions).toBeGreaterThanOrEqual(1);
        });
    });

    test.describe('Copy Variants API', () => {
        test('should get variants by category', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const variants = await page.evaluate(() => {
                return window.CTACopyVariants.getVariants('signup');
            });

            expect(variants.length).toBeGreaterThan(0);
        });

        test('should get random variant', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const random = await page.evaluate(() => {
                return window.CTACopyVariants.getRandom('signup', 'value');
            });

            expect(typeof random).toBe('string');
            expect(random.length).toBeGreaterThan(0);
        });

        test('should get recommended variants for context', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const recommended = await page.evaluate(() => {
                return window.CTACopyVariants.getRecommended('hero');
            });

            expect(Array.isArray(recommended)).toBeTruthy();
            expect(recommended.length).toBeGreaterThan(0);
        });

        test('should add emoji to copy', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const withEmoji = await page.evaluate(() => {
                return window.CTACopyVariants.withEmoji('Get Started', 'action');
            });

            expect(withEmoji).toContain('Get Started');
            // Should have emoji added
            expect(withEmoji.length).toBeGreaterThan('Get Started'.length);
        });

        test('should search variants by keyword', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const results = await page.evaluate(() => {
                return window.CTACopyVariants.search('free');
            });

            expect(results.length).toBeGreaterThan(0);
            expect(results[0]).toHaveProperty('category');
            expect(results[0]).toHaveProperty('subcategory');
            expect(results[0]).toHaveProperty('copy');
        });
    });

    test.describe('Responsive Design', () => {
        test('should render correctly on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-primary').first();
            await expect(cta).toBeVisible();

            // Check button is not too large for mobile
            const box = await cta.boundingBox();
            expect(box.width).toBeLessThan(375);
        });

        test('should render correctly on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-primary').first();
            await expect(cta).toBeVisible();
        });

        test('should render correctly on desktop', async ({ page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-primary').first();
            await expect(cta).toBeVisible();
        });
    });

    test.describe('Accessibility', () => {
        test('should have proper focus states', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-primary').first();

            // Tab to CTA
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            // Check if CTA has focus (outline)
            const outline = await cta.evaluate(el =>
                window.getComputedStyle(el).outline
            );

            // Should have outline on focus
            expect(outline).toBeTruthy();
        });

        test('should be keyboard navigable', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // Tab through page
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            // Check if a CTA is focused
            const focusedElement = await page.evaluate(() => {
                return document.activeElement.classList.contains('cta');
            });

            expect(focusedElement).toBeTruthy();
        });

        test('should have proper ARIA labels where needed', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // All CTAs should have accessible text
            const ctas = page.locator('.cta');
            const count = await ctas.count();

            for (let i = 0; i < Math.min(count, 10); i++) {
                const text = await ctas.nth(i).textContent();
                expect(text.trim().length).toBeGreaterThan(0);
            }
        });

        test('should respect prefers-reduced-motion', async ({ page }) => {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-pulse').first();
            await expect(cta).toBeVisible();

            // Animation should be reduced or disabled
            // Check animation-duration is very short
            const animationDuration = await cta.evaluate(el =>
                window.getComputedStyle(el).animationDuration
            );

            // Should be 0.01ms or less when reduced motion is on
            const duration = parseFloat(animationDuration);
            expect(duration).toBeLessThan(0.1); // Less than 0.1 seconds
        });
    });

    test.describe('Control Functions', () => {
        test('should reset tests', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            // Add some data
            await page.evaluate(() => {
                window.ABTest.trackConversion('hero-cta');
            });

            // Click reset button (with confirmation)
            page.on('dialog', dialog => dialog.accept());
            await page.click('button:has-text("Reset All Tests")');

            // Wait for reload
            await page.waitForLoadState('load');

            // Check data is reset
            const results = await page.evaluate(() => {
                return window.ABTest.getResults('hero-cta');
            });

            expect(results.totalConversions).toBe(0);
        });

        test('should simulate clicks', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            page.on('dialog', dialog => dialog.accept());
            await page.click('button:has-text("Simulate 100 Clicks")');

            // Wait for simulation
            await page.waitForTimeout(500);

            // Check results have data
            const results = await page.evaluate(() => {
                return window.ABTest.getResults('hero-cta');
            });

            expect(results.totalConversions).toBeGreaterThan(0);
        });

        test('should toggle dev mode', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            page.on('dialog', dialog => dialog.accept());
            await page.click('button:has-text("Toggle Dev Mode")');

            const hasDevMode = await page.evaluate(() => {
                return document.body.classList.contains('dev-mode');
            });

            expect(hasDevMode).toBeTruthy();
        });
    });

    test.describe('Visual Regression', () => {
        test('should match screenshot for primary CTA', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-primary').first();
            await expect(cta).toHaveScreenshot('cta-primary.png');
        });

        test('should match screenshot for secondary CTA', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-secondary').first();
            await expect(cta).toHaveScreenshot('cta-secondary.png');
        });

        test('should match screenshot for outline CTA', async ({ page }) => {
            await page.goto('/pages/cta-optimization-demo.html');

            const cta = page.locator('.cta-outline-primary').first();
            await expect(cta).toHaveScreenshot('cta-outline-primary.png');
        });
    });

    test.describe('Performance', () => {
        test('should load page in reasonable time', async ({ page }) => {
            const startTime = Date.now();

            await page.goto('/pages/cta-optimization-demo.html');

            const loadTime = Date.now() - startTime;

            // Should load in less than 3 seconds
            expect(loadTime).toBeLessThan(3000);
        });

        test('should not have console errors', async ({ page }) => {
            const errors = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    errors.push(msg.text());
                }
            });

            await page.goto('/pages/cta-optimization-demo.html');

            // Should have no console errors
            expect(errors.length).toBe(0);
        });
    });
});
