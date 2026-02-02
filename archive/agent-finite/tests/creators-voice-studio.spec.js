/**
 * Playwright Test Suite for Creators Voice Studio Landing Page
 * Tests functionality, design, responsiveness, accessibility, and performance
 */

const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8080/pages/creators-voice-studio.html';

test.describe('Creators Voice Studio Landing Page', () => {

    // Page Load Tests
    test.describe('Page Load and Basic Functionality', () => {
        test('should load successfully', async ({ page }) => {
            const response = await page.goto(PAGE_URL);
            expect(response.status()).toBe(200);
        });

        test('should have correct title and meta tags', async ({ page }) => {
            await page.goto(PAGE_URL);

            const title = await page.title();
            expect(title).toBe('Your Voice, Amplified - Gemini for Creators');

            const description = await page.getAttribute('meta[name="description"]', 'content');
            expect(description).toContain('voice output');
            expect(description).toContain('creators');
        });

        test('should load all CSS files', async ({ page }) => {
            await page.goto(PAGE_URL);

            const designSystem = await page.locator('link[href*="design-system.css"]').count();
            const components = await page.locator('link[href*="components.css"]').count();
            const animations = await page.locator('link[href*="animations.css"]').count();

            expect(designSystem).toBe(1);
            expect(components).toBe(1);
            expect(animations).toBe(1);
        });

        test('should load animations.js', async ({ page }) => {
            await page.goto(PAGE_URL);

            const animationsJs = await page.locator('script[src*="animations.js"]').count();
            expect(animationsJs).toBe(1);

            // Check if GeminiAnimations is available
            const hasGeminiAnimations = await page.evaluate(() => {
                return typeof window.GeminiAnimations !== 'undefined';
            });
            expect(hasGeminiAnimations).toBe(true);
        });
    });

    // Content Verification Tests
    test.describe('Content Verification', () => {
        test('should display hero section with correct content', async ({ page }) => {
            await page.goto(PAGE_URL);

            const eyebrow = await page.locator('.hero-eyebrow').textContent();
            expect(eyebrow).toContain('For Creators & Writers');

            const headline = await page.locator('.hero-headline').textContent();
            expect(headline).toContain('Your Voice');
            expect(headline).toContain('Amplified');

            const subheadline = await page.locator('.hero-subheadline').textContent();
            expect(subheadline).toContain('voice output');
            expect(subheadline).toContain('creative AI tools');
        });

        test('should have both CTA buttons in hero', async ({ page }) => {
            await page.goto(PAGE_URL);

            const primaryCTA = await page.locator('.btn-hero-primary').textContent();
            expect(primaryCTA).toContain('Start Creating');

            const secondaryCTA = await page.locator('.btn-hero-secondary').textContent();
            expect(secondaryCTA).toContain('Explore Features');
        });

        test('should display Voice Output 3 (VO3) section', async ({ page }) => {
            await page.goto(PAGE_URL);

            const vo3Eyebrow = await page.locator('.section-vo3 .section-eyebrow').textContent();
            expect(vo3Eyebrow).toContain('Voice Output 3.0');

            const vo3Title = await page.locator('.section-vo3 .section-title').textContent();
            expect(vo3Title).toContain('Your Words, Brought to Life');

            // Check for voice features list
            const featuresList = await page.locator('.voice-features-list li');
            const featuresCount = await featuresList.count();
            expect(featuresCount).toBeGreaterThanOrEqual(5);
        });

        test('should display Nano Banana section', async ({ page }) => {
            await page.goto(PAGE_URL);

            const nanoTitle = await page.locator('.section-nano h2').textContent();
            expect(nanoTitle).toContain('Nano Banana');

            const nanoEmoji = await page.locator('.nano-emoji').textContent();
            expect(nanoEmoji).toBe('🍌');

            // Check for stats
            const stats = await page.locator('.nano-stat');
            const statsCount = await stats.count();
            expect(statsCount).toBe(2);
        });

        test('should display 6 use case cards', async ({ page }) => {
            await page.goto(PAGE_URL);

            const useCaseCards = await page.locator('.use-case-card');
            const cardCount = await useCaseCards.count();
            expect(cardCount).toBe(6);

            // Verify each card has icon, title, and description
            for (let i = 0; i < cardCount; i++) {
                const card = useCaseCards.nth(i);
                const icon = await card.locator('.use-case-icon').count();
                const title = await card.locator('h3').count();
                const description = await card.locator('p').count();

                expect(icon).toBe(1);
                expect(title).toBe(1);
                expect(description).toBe(1);
            }
        });

        test('should display testimonial section', async ({ page }) => {
            await page.goto(PAGE_URL);

            const testimonialQuote = await page.locator('.testimonial-quote').textContent();
            expect(testimonialQuote).toContain('transformed my content workflow');

            const authorName = await page.locator('.testimonial-name').textContent();
            expect(authorName).toContain('Sarah Chen');
        });

        test('should display final CTA section', async ({ page }) => {
            await page.goto(PAGE_URL);

            const finalCTA = await page.locator('.cta-button-large').textContent();
            expect(finalCTA).toContain('Start Creating Now');
        });
    });

    // Animation Tests
    test.describe('Animations and Interactions', () => {
        test('should have waveform animation in hero', async ({ page }) => {
            await page.goto(PAGE_URL);

            const waveformBars = await page.locator('.waveform-bar');
            const barCount = await waveformBars.count();
            expect(barCount).toBe(8);
        });

        test('should have pulsing voice icon', async ({ page }) => {
            await page.goto(PAGE_URL);

            const voiceIcon = await page.locator('.voice-icon');
            const isVisible = await voiceIcon.isVisible();
            expect(isVisible).toBe(true);

            const emoji = await voiceIcon.textContent();
            expect(emoji).toBe('🎙️');
        });

        test('should have scroll-triggered animations', async ({ page }) => {
            await page.goto(PAGE_URL);

            // Check for animation classes
            const fadeSlideUp = await page.locator('.animate-fade-slide-up').count();
            expect(fadeSlideUp).toBeGreaterThan(0);

            const stagger = await page.locator('.animate-stagger').count();
            expect(stagger).toBeGreaterThan(0);
        });

        test('should trigger smooth scroll on secondary CTA click', async ({ page }) => {
            await page.goto(PAGE_URL);

            const secondaryCTA = page.locator('.btn-hero-secondary');
            await secondaryCTA.click();

            // Wait for scroll animation to complete
            await page.waitForTimeout(1000);

            // Check if page has scrolled
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBeGreaterThan(0);
        });

        test('should have hover effects on use case cards', async ({ page }) => {
            await page.goto(PAGE_URL);

            const firstCard = page.locator('.use-case-card').first();

            // Get initial position
            const initialBB = await firstCard.boundingBox();

            // Hover over card
            await firstCard.hover();
            await page.waitForTimeout(400); // Wait for transition

            // Check if transform was applied (card should move up)
            const transform = await firstCard.evaluate(el =>
                window.getComputedStyle(el).transform
            );
            expect(transform).not.toBe('none');
        });

        test('should have parallax effect on hero content', async ({ page }) => {
            await page.goto(PAGE_URL);

            // Scroll down
            await page.evaluate(() => window.scrollTo(0, 300));
            await page.waitForTimeout(100);

            const heroContent = page.locator('.hero-content');
            const transform = await heroContent.evaluate(el =>
                window.getComputedStyle(el).transform
            );

            // Should have transform applied
            expect(transform).not.toBe('none');
        });
    });

    // Design and Visual Tests
    test.describe('Design Quality Checks', () => {
        test('should have creator gradient colors', async ({ page }) => {
            await page.goto(PAGE_URL);

            const heroSection = page.locator('.hero-creator');
            const background = await heroSection.evaluate(el =>
                window.getComputedStyle(el).background
            );

            expect(background).toContain('gradient');
        });

        test('should load Google Fonts (Space Grotesk, Inter)', async ({ page }) => {
            await page.goto(PAGE_URL);

            const fontLinks = await page.locator('link[href*="fonts.googleapis.com"]').count();
            expect(fontLinks).toBeGreaterThanOrEqual(1);
        });

        test('should have proper spacing and layout', async ({ page }) => {
            await page.goto(PAGE_URL);

            // Check that sections have proper padding
            const vo3Section = page.locator('.section-vo3');
            const padding = await vo3Section.evaluate(el =>
                window.getComputedStyle(el).paddingTop
            );

            // Should have substantial padding (converted from pixels)
            const paddingValue = parseInt(padding);
            expect(paddingValue).toBeGreaterThan(50);
        });

        test('should have rounded corners on cards', async ({ page }) => {
            await page.goto(PAGE_URL);

            const voiceCard = page.locator('.voice-demo-card');
            const borderRadius = await voiceCard.evaluate(el =>
                window.getComputedStyle(el).borderRadius
            );

            expect(borderRadius).not.toBe('0px');
        });

        test('should display banana emoji in nano section background', async ({ page }) => {
            await page.goto(PAGE_URL);

            const nanoSection = page.locator('.section-nano');
            const beforeContent = await nanoSection.evaluate(el =>
                window.getComputedStyle(el, '::before').content
            );

            expect(beforeContent).toContain('🍌');
        });
    });

    // Responsive Design Tests
    test.describe('Responsive Design', () => {
        test('should be responsive on mobile (375px)', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(PAGE_URL);

            // Hero should be visible
            const hero = page.locator('.hero-creator');
            await expect(hero).toBeVisible();

            // CTAs should stack vertically (check if they're in a column)
            const ctaGroup = page.locator('.hero-cta-group');
            const flexDirection = await ctaGroup.evaluate(el =>
                window.getComputedStyle(el).flexDirection
            );
            expect(flexDirection).toBe('column');
        });

        test('should hide waveform on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(PAGE_URL);

            const waveform = page.locator('.waveform-container');
            const display = await waveform.evaluate(el =>
                window.getComputedStyle(el).display
            );
            expect(display).toBe('none');
        });

        test('should stack voice demo grid on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(PAGE_URL);

            const voiceGrid = page.locator('.voice-demo-grid');
            const gridColumns = await voiceGrid.evaluate(el =>
                window.getComputedStyle(el).gridTemplateColumns
            );

            // Should be single column on mobile
            expect(gridColumns).not.toContain('1fr 1fr');
        });

        test('should stack nano grid on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(PAGE_URL);

            const nanoGrid = page.locator('.nano-grid');
            const gridColumns = await nanoGrid.evaluate(el =>
                window.getComputedStyle(el).gridTemplateColumns
            );

            // Should be single column on mobile
            expect(gridColumns).not.toContain('1fr 1fr');
        });

        test('should be responsive on tablet (768px)', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto(PAGE_URL);

            // All sections should be visible
            await expect(page.locator('.hero-creator')).toBeVisible();
            await expect(page.locator('.section-vo3')).toBeVisible();
            await expect(page.locator('.section-nano')).toBeVisible();
            await expect(page.locator('.section-use-cases')).toBeVisible();
        });

        test('should be responsive on desktop (1440px)', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);

            // Grids should be multi-column on desktop
            const voiceGrid = page.locator('.voice-demo-grid');
            const gridColumns = await voiceGrid.evaluate(el =>
                window.getComputedStyle(el).gridTemplateColumns
            );

            // Should have 2 columns
            expect(gridColumns).toContain('1fr 1fr');
        });
    });

    // Accessibility Tests
    test.describe('Accessibility', () => {
        test('should have proper heading hierarchy', async ({ page }) => {
            await page.goto(PAGE_URL);

            // Should have h1
            const h1Count = await page.locator('h1').count();
            expect(h1Count).toBe(1);

            // Should have multiple h2s for sections
            const h2Count = await page.locator('h2').count();
            expect(h2Count).toBeGreaterThan(3);

            // Should have h3s for cards
            const h3Count = await page.locator('h3').count();
            expect(h3Count).toBeGreaterThan(5);
        });

        test('should have semantic HTML structure', async ({ page }) => {
            await page.goto(PAGE_URL);

            const sections = await page.locator('section').count();
            expect(sections).toBeGreaterThanOrEqual(5);
        });

        test('should have accessible buttons', async ({ page }) => {
            await page.goto(PAGE_URL);

            const buttons = await page.locator('button, a[class*="btn"], a[class*="cta"]');
            const buttonCount = await buttons.count();

            // All buttons should have text content
            for (let i = 0; i < buttonCount; i++) {
                const text = await buttons.nth(i).textContent();
                expect(text.trim().length).toBeGreaterThan(0);
            }
        });

        test('should not have accessibility violations', async ({ page }) => {
            await page.goto(PAGE_URL);

            // Basic accessibility checks
            const missingAltImages = await page.locator('img:not([alt])').count();
            expect(missingAltImages).toBe(0);

            const emptyLinks = await page.locator('a:not([href])').count();
            expect(emptyLinks).toBe(0);
        });
    });

    // Performance Tests
    test.describe('Performance', () => {
        test('should load within 3 seconds', async ({ page }) => {
            const startTime = Date.now();
            await page.goto(PAGE_URL);
            await page.waitForLoadState('networkidle');
            const loadTime = Date.now() - startTime;

            expect(loadTime).toBeLessThan(3000);
        });

        test('should have minimal layout shift', async ({ page }) => {
            await page.goto(PAGE_URL);

            // Wait for page to stabilize
            await page.waitForTimeout(2000);

            // Measure Cumulative Layout Shift
            const cls = await page.evaluate(() => {
                return new Promise((resolve) => {
                    let clsValue = 0;
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                            }
                        }
                    });
                    observer.observe({ type: 'layout-shift', buffered: true });

                    setTimeout(() => {
                        resolve(clsValue);
                    }, 1000);
                });
            });

            // CLS should be less than 0.1 (good score)
            expect(cls).toBeLessThan(0.1);
        });
    });

    // Screenshot Tests
    test.describe('Visual Screenshot Tests', () => {
        test('should capture full page on desktop', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000); // Wait for animations

            await page.screenshot({
                path: 'tests/screenshots/creators-voice-studio-desktop.png',
                fullPage: true
            });
        });

        test('should capture full page on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto(PAGE_URL);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            await page.screenshot({
                path: 'tests/screenshots/creators-voice-studio-tablet.png',
                fullPage: true
            });
        });

        test('should capture full page on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(PAGE_URL);
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            await page.screenshot({
                path: 'tests/screenshots/creators-voice-studio-mobile.png',
                fullPage: true
            });
        });

        test('should capture hero section', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForLoadState('networkidle');

            const hero = page.locator('.hero-creator');
            await hero.screenshot({
                path: 'tests/screenshots/creators-voice-studio-hero.png'
            });
        });

        test('should capture VO3 section', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForLoadState('networkidle');

            const vo3 = page.locator('.section-vo3');
            await vo3.screenshot({
                path: 'tests/screenshots/creators-voice-studio-vo3.png'
            });
        });

        test('should capture Nano Banana section', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForLoadState('networkidle');

            const nano = page.locator('.section-nano');
            await nano.screenshot({
                path: 'tests/screenshots/creators-voice-studio-nano.png'
            });
        });

        test('should capture use cases section', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForLoadState('networkidle');

            const useCases = page.locator('.section-use-cases');
            await useCases.screenshot({
                path: 'tests/screenshots/creators-voice-studio-use-cases.png'
            });
        });
    });

    // Integration Tests
    test.describe('External Links and CTAs', () => {
        test('should have working external links', async ({ page }) => {
            await page.goto(PAGE_URL);

            // Check primary CTA link
            const primaryCTA = page.locator('.btn-hero-primary');
            const onclick = await primaryCTA.getAttribute('onclick');
            expect(onclick).toContain('gemini.google.com');

            // Check final CTA link
            const finalCTA = page.locator('.cta-button-large');
            const href = await finalCTA.getAttribute('href');
            expect(href).toContain('gemini.google.com');
        });

        test('should open links in new tab', async ({ page }) => {
            await page.goto(PAGE_URL);

            const finalCTA = page.locator('.cta-button-large');
            const target = await finalCTA.getAttribute('target');
            expect(target).toBe('_blank');
        });
    });
});
