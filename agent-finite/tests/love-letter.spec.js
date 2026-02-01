/**
 * Playwright Test Suite for Love Letter to Productivity Landing Page
 * Tests design quality, animations, responsive behavior, and accessibility
 */

const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8080/pages/love-letter-to-productivity.html';

test.describe('Love Letter to Productivity Landing Page', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(PAGE_URL);
    });

    // ============================================
    // BASIC FUNCTIONALITY TESTS
    // ============================================

    test('should load the page successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Love Letter to Productivity/);

        // Check that main elements are present
        const envelope = page.locator('#envelope');
        const letter = page.locator('.letter');
        const cta = page.locator('.cta-button');

        await expect(envelope).toBeVisible();
        await expect(letter).toBeVisible();
        await expect(cta).toBeVisible();
    });

    test('should have correct meta tags', async ({ page }) => {
        const description = await page.locator('meta[name="description"]').getAttribute('content');
        expect(description).toContain('Fall in love with writing again');

        const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
        expect(ogTitle).toContain('Love Letter to Productivity');
    });

    test('should load all required stylesheets', async ({ page }) => {
        const stylesheets = await page.locator('link[rel="stylesheet"]').count();
        expect(stylesheets).toBeGreaterThanOrEqual(3); // design-system, components, animations
    });

    // ============================================
    // ANIMATION TESTS
    // ============================================

    test('should display floating hearts animation', async ({ page }) => {
        const hearts = page.locator('.hearts-background .heart');
        const heartCount = await hearts.count();

        expect(heartCount).toBe(6);

        // Check that hearts have animation
        const firstHeart = hearts.first();
        const animationName = await firstHeart.evaluate(el =>
            window.getComputedStyle(el).animationName
        );
        expect(animationName).toBe('float-heart');
    });

    test('should show tap hint initially', async ({ page }) => {
        const tapHint = page.locator('#tapHint');
        await expect(tapHint).toBeVisible();

        const text = await tapHint.textContent();
        expect(text).toContain('Tap to open');
    });

    test('should open envelope on click', async ({ page }) => {
        const envelope = page.locator('#envelope');
        const tapHint = page.locator('#tapHint');

        // Initially, envelope should not be opened
        const initialClass = await envelope.getAttribute('class');
        expect(initialClass).not.toContain('opened');

        // Click envelope
        await envelope.click();

        // Wait for animation
        await page.waitForTimeout(500);

        // Check that envelope has 'opened' class
        const openedClass = await envelope.getAttribute('class');
        expect(openedClass).toContain('opened');

        // Check that tap hint is hidden
        const opacity = await tapHint.evaluate(el =>
            window.getComputedStyle(el).opacity
        );
        expect(parseFloat(opacity)).toBeLessThan(1);
    });

    test('should auto-open envelope after 2 seconds', async ({ page }) => {
        const envelope = page.locator('#envelope');

        // Wait for auto-open
        await page.waitForTimeout(2500);

        // Check that envelope is opened
        const openedClass = await envelope.getAttribute('class');
        expect(openedClass).toContain('opened');
    });

    test('should display letter content after opening', async ({ page }) => {
        const envelope = page.locator('#envelope');
        await envelope.click();

        // Wait for letter animation
        await page.waitForTimeout(2000);

        // Check letter content visibility
        const letterContent = page.locator('.letter-content');
        const opacity = await letterContent.evaluate(el =>
            window.getComputedStyle(el).opacity
        );
        expect(parseFloat(opacity)).toBeGreaterThan(0.5);
    });

    test('should display CTA after opening', async ({ page }) => {
        const envelope = page.locator('#envelope');
        await envelope.click();

        // Wait for CTA animation
        await page.waitForTimeout(2500);

        // Check CTA visibility
        const cta = page.locator('.cta-section');
        const opacity = await cta.evaluate(el =>
            window.getComputedStyle(el).opacity
        );
        expect(parseFloat(opacity)).toBeGreaterThan(0.5);
    });

    // ============================================
    // CONTENT TESTS
    // ============================================

    test('should contain letter content with correct text', async ({ page }) => {
        const greeting = page.locator('.letter-greeting');
        await expect(greeting).toContainText('Dear Writer');

        const body = page.locator('.letter-body');
        await expect(body).toContainText('Remember when writing felt effortless');
        await expect(body).toContainText('Gemini understands your voice');

        const signature = page.locator('.letter-signature');
        await expect(signature).toContainText('With love');
        await expect(signature).toContainText('Gemini');
    });

    test('should have CTA with correct text and link', async ({ page }) => {
        const ctaButton = page.locator('.cta-button');
        await expect(ctaButton).toContainText('Start Your Love Story');

        const href = await ctaButton.getAttribute('href');
        expect(href).toBe('https://gemini.google.com');
    });

    test('should display all feature cards', async ({ page }) => {
        const featureCards = page.locator('.feature-card');
        const count = await featureCards.count();

        expect(count).toBe(6);

        // Check feature titles
        await expect(page.locator('.feature-title').first()).toBeVisible();
    });

    test('should have correct feature titles', async ({ page }) => {
        const expectedTitles = [
            'Your Voice, Amplified',
            'Endless Inspiration',
            'Research Made Easy',
            'Seamless Integration',
            'Lightning Fast',
            'Perfect Precision'
        ];

        const titles = await page.locator('.feature-title').allTextContents();
        expect(titles.length).toBe(6);

        expectedTitles.forEach(title => {
            expect(titles.some(t => t.includes(title))).toBeTruthy();
        });
    });

    // ============================================
    // VISUAL & DESIGN TESTS
    // ============================================

    test('should have romantic gradient background', async ({ page }) => {
        const body = page.locator('body');
        const background = await body.evaluate(el =>
            window.getComputedStyle(el).background
        );

        expect(background).toContain('gradient');
    });

    test('should have heartbeat animation on heart accent', async ({ page }) => {
        const envelope = page.locator('#envelope');
        await envelope.click();
        await page.waitForTimeout(2000);

        const heartAccent = page.locator('.heart-accent').first();
        const animationName = await heartAccent.evaluate(el =>
            window.getComputedStyle(el).animationName
        );

        expect(animationName).toBe('heartbeat');
    });

    test('should apply hover effect to envelope', async ({ page }) => {
        const envelopeWrapper = page.locator('.envelope-wrapper');

        // Hover over envelope
        await envelopeWrapper.hover();

        // Check transform (lift effect)
        await page.waitForTimeout(300);
        const transform = await envelopeWrapper.evaluate(el =>
            window.getComputedStyle(el).transform
        );

        expect(transform).not.toBe('none');
    });

    test('should apply hover effect to CTA button', async ({ page }) => {
        const ctaButton = page.locator('.cta-button');

        await ctaButton.hover();
        await page.waitForTimeout(300);

        const transform = await ctaButton.evaluate(el =>
            window.getComputedStyle(el).transform
        );

        expect(transform).not.toBe('none');
    });

    test('should apply hover effect to feature cards', async ({ page }) => {
        const firstCard = page.locator('.feature-card').first();

        await firstCard.hover();
        await page.waitForTimeout(300);

        const transform = await firstCard.evaluate(el =>
            window.getComputedStyle(el).transform
        );

        expect(transform).not.toBe('none');
    });

    // ============================================
    // RESPONSIVE DESIGN TESTS
    // ============================================

    test('should be responsive on mobile (375x667)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const envelope = page.locator('.envelope-wrapper');
        await expect(envelope).toBeVisible();

        const features = page.locator('.features-grid');
        await expect(features).toBeVisible();
    });

    test('should be responsive on tablet (768x1024)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });

        const envelope = page.locator('.envelope-wrapper');
        await expect(envelope).toBeVisible();

        const features = page.locator('.features-grid');
        await expect(features).toBeVisible();
    });

    test('should be responsive on desktop (1440x900)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });

        const envelope = page.locator('.envelope-wrapper');
        await expect(envelope).toBeVisible();

        const features = page.locator('.features-grid');
        await expect(features).toBeVisible();
    });

    // ============================================
    // ACCESSIBILITY TESTS
    // ============================================

    test('should have proper semantic HTML', async ({ page }) => {
        const sections = page.locator('section');
        const sectionCount = await sections.count();
        expect(sectionCount).toBeGreaterThanOrEqual(2);

        const headings = page.locator('h2, h3');
        const headingCount = await headings.count();
        expect(headingCount).toBeGreaterThan(0);
    });

    test('should have accessible links', async ({ page }) => {
        const ctaButton = page.locator('.cta-button');
        const text = await ctaButton.textContent();

        expect(text.trim().length).toBeGreaterThan(0);
    });

    test('should respect prefers-reduced-motion', async ({ page }) => {
        // Simulate reduced motion preference
        await page.emulateMedia({ reducedMotion: 'reduce' });

        // Page should still be functional
        const envelope = page.locator('#envelope');
        await expect(envelope).toBeVisible();
    });

    // ============================================
    // PERFORMANCE TESTS
    // ============================================

    test('should load in under 3 seconds', async ({ page }) => {
        const startTime = Date.now();
        await page.goto(PAGE_URL);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(3000);
    });

    test('should have no console errors', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto(PAGE_URL);
        await page.waitForTimeout(3000);

        expect(errors.length).toBe(0);
    });

    // ============================================
    // SCREENSHOT TESTS
    // ============================================

    test('should capture desktop screenshot (initial state)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.screenshot({
            path: 'tests/screenshots/love-letter-desktop-initial.png',
            fullPage: true
        });
    });

    test('should capture desktop screenshot (opened state)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });

        const envelope = page.locator('#envelope');
        await envelope.click();
        await page.waitForTimeout(3000);

        await page.screenshot({
            path: 'tests/screenshots/love-letter-desktop-opened.png',
            fullPage: true
        });
    });

    test('should capture tablet screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });

        const envelope = page.locator('#envelope');
        await envelope.click();
        await page.waitForTimeout(3000);

        await page.screenshot({
            path: 'tests/screenshots/love-letter-tablet.png',
            fullPage: true
        });
    });

    test('should capture mobile screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const envelope = page.locator('#envelope');
        await envelope.click();
        await page.waitForTimeout(3000);

        await page.screenshot({
            path: 'tests/screenshots/love-letter-mobile.png',
            fullPage: true
        });
    });

    test('should capture features section screenshot', async ({ page }) => {
        const featuresSection = page.locator('.features-section');
        await featuresSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);

        await featuresSection.screenshot({
            path: 'tests/screenshots/love-letter-features.png'
        });
    });

    // ============================================
    // INTEGRATION TESTS
    // ============================================

    test('should load animations.js successfully', async ({ page }) => {
        const animationsLoaded = await page.evaluate(() => {
            return typeof window.GeminiAnimations !== 'undefined';
        });

        expect(animationsLoaded).toBeTruthy();
    });

    test('should apply scroll animations to feature cards', async ({ page }) => {
        const featureCard = page.locator('.feature-card').first();

        // Scroll to features section
        await featureCard.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);

        // Check if animation class is present
        const classes = await featureCard.getAttribute('class');
        expect(classes).toContain('animate-fade-slide-up');
    });

});
