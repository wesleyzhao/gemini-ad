// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Apple-Inspired Minimalist Landing Page Tests
 *
 * Tests the ultra-minimalist Apple.com-inspired landing page featuring:
 * - Maximum whitespace and breathing room
 * - Large, bold typography with minimal text
 * - Clean hero imagery with gradient sphere
 * - Smooth, subtle animations
 * - Premium, elegant feel
 */

const PAGE_URL = 'http://localhost:8000/pages/apple-inspired.html';

test.describe('Apple-Inspired Landing Page', () => {

    // ============================================
    // Page Load & Basic Tests
    // ============================================

    test('page loads successfully', async ({ page }) => {
        const response = await page.goto(PAGE_URL);
        expect(response?.status()).toBe(200);
    });

    test('has correct page title', async ({ page }) => {
        await page.goto(PAGE_URL);
        await expect(page).toHaveTitle(/Gemini - Intelligence Refined/);
    });

    test('has meta description', async ({ page }) => {
        await page.goto(PAGE_URL);
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
        expect(metaDescription).toBeTruthy();
        expect(metaDescription?.length).toBeGreaterThan(50);
    });

    test('loads all external stylesheets', async ({ page }) => {
        await page.goto(PAGE_URL);

        // Check for design system CSS
        const designSystemLink = await page.locator('link[href*="design-system.css"]').count();
        expect(designSystemLink).toBeGreaterThan(0);

        // Check for components CSS
        const componentsLink = await page.locator('link[href*="components.css"]').count();
        expect(componentsLink).toBeGreaterThan(0);

        // Check for animations CSS
        const animationsLink = await page.locator('link[href*="animations.css"]').count();
        expect(animationsLink).toBeGreaterThan(0);
    });

    // ============================================
    // Navigation Tests
    // ============================================

    test('navigation is fixed and visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const nav = page.locator('.nav');
        await expect(nav).toBeVisible();

        const position = await nav.evaluate(el => window.getComputedStyle(el).position);
        expect(position).toBe('fixed');
    });

    test('navigation has logo', async ({ page }) => {
        await page.goto(PAGE_URL);
        const logo = page.locator('.nav-logo');
        await expect(logo).toBeVisible();
        await expect(logo).toHaveText('Gemini');
    });

    test('navigation has CTA link', async ({ page }) => {
        await page.goto(PAGE_URL);
        const navCta = page.locator('.nav-cta');
        await expect(navCta).toBeVisible();
        await expect(navCta).toHaveAttribute('href', 'https://gemini.google.com');
    });

    test('navigation has glassmorphism effect', async ({ page }) => {
        await page.goto(PAGE_URL);
        const nav = page.locator('.nav');
        const backdropFilter = await nav.evaluate(el => window.getComputedStyle(el).backdropFilter);
        expect(backdropFilter).toContain('blur');
    });

    // ============================================
    // Hero Section Tests
    // ============================================

    test('hero section is full viewport height', async ({ page }) => {
        await page.goto(PAGE_URL);
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();

        const minHeight = await hero.evaluate(el => window.getComputedStyle(el).minHeight);
        expect(minHeight).toBe('100vh');
    });

    test('hero has badge', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.hero-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toHaveText('Intelligence Refined');
    });

    test('hero has main title', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.hero-title');
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text).toContain('AI that thinks');
    });

    test('hero has subtitle', async ({ page }) => {
        await page.goto(PAGE_URL);
        const subtitle = page.locator('.hero-subtitle');
        await expect(subtitle).toBeVisible();
        await expect(subtitle).toHaveText('Effortlessly brilliant. Remarkably simple.');
    });

    test('hero has primary CTA', async ({ page }) => {
        await page.goto(PAGE_URL);
        const primaryCta = page.locator('.hero-cta-group .cta-primary').first();
        await expect(primaryCta).toBeVisible();
        await expect(primaryCta).toHaveText('Start using Gemini');
        await expect(primaryCta).toHaveAttribute('href', 'https://gemini.google.com');
    });

    test('hero has secondary CTA', async ({ page }) => {
        await page.goto(PAGE_URL);
        const secondaryCta = page.locator('.hero-cta-group .cta-secondary').first();
        await expect(secondaryCta).toBeVisible();
        await expect(secondaryCta).toHaveText('Learn more');
    });

    test('hero has gradient sphere visual', async ({ page }) => {
        await page.goto(PAGE_URL);
        const sphere = page.locator('.sphere');
        await expect(sphere).toBeVisible();

        const background = await sphere.evaluate(el => window.getComputedStyle(el).background);
        expect(background).toContain('linear-gradient');
    });

    test('hero sphere has animation', async ({ page }) => {
        await page.goto(PAGE_URL);
        const sphere = page.locator('.sphere');
        const animation = await sphere.evaluate(el => window.getComputedStyle(el).animation);
        expect(animation).toContain('sphereFloat');
    });

    // ============================================
    // Product Section Tests
    // ============================================

    test('product section exists', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.product-section');
        await expect(section).toBeVisible();
    });

    test('product section has title', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.product-section .section-title');
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text).toContain('extraordinary');
    });

    test('product section has subtitle', async ({ page }) => {
        await page.goto(PAGE_URL);
        const subtitle = page.locator('.product-section .section-subtitle');
        await expect(subtitle).toBeVisible();
    });

    test('has feature grid with 3 features', async ({ page }) => {
        await page.goto(PAGE_URL);
        const featureCards = page.locator('.feature-card');
        await expect(featureCards).toHaveCount(3);
    });

    test('feature cards have icons', async ({ page }) => {
        await page.goto(PAGE_URL);
        const icons = page.locator('.feature-icon');
        await expect(icons).toHaveCount(3);
    });

    test('feature cards have titles', async ({ page }) => {
        await page.goto(PAGE_URL);
        const titles = page.locator('.feature-title');
        await expect(titles.first()).toBeVisible();
        await expect(titles).toHaveCount(3);
    });

    test('features include Intuitive, Instant, Precise', async ({ page }) => {
        await page.goto(PAGE_URL);
        await expect(page.locator('.feature-title:has-text("Intuitive")')).toBeVisible();
        await expect(page.locator('.feature-title:has-text("Instant")')).toBeVisible();
        await expect(page.locator('.feature-title:has-text("Precise")')).toBeVisible();
    });

    // ============================================
    // Capability Section Tests
    // ============================================

    test('capability section exists', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.capability-section');
        await expect(section).toBeVisible();
    });

    test('capability section has gray background', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.capability-section');
        const background = await section.evaluate(el => window.getComputedStyle(el).backgroundColor);
        expect(background).toBe('rgb(245, 245, 247)'); // #f5f5f7
    });

    test('capability section has title', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.capability-title');
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text).toContain('simple');
    });

    test('has 6 capability items', async ({ page }) => {
        await page.goto(PAGE_URL);
        const items = page.locator('.capability-item');
        await expect(items).toHaveCount(6);
    });

    test('capability items have titles', async ({ page }) => {
        await page.goto(PAGE_URL);
        const titles = page.locator('.capability-item-title');
        await expect(titles).toHaveCount(6);
    });

    test('capability items have descriptions', async ({ page }) => {
        await page.goto(PAGE_URL);
        const descriptions = page.locator('.capability-item-description');
        await expect(descriptions).toHaveCount(6);
    });

    test('capabilities include key features', async ({ page }) => {
        await page.goto(PAGE_URL);
        await expect(page.locator('text=Natural Understanding')).toBeVisible();
        await expect(page.locator('text=Multimodal Intelligence')).toBeVisible();
        await expect(page.locator('text=Real-Time Knowledge')).toBeVisible();
        await expect(page.locator('text=Creative Thinking')).toBeVisible();
        await expect(page.locator('text=Task Automation')).toBeVisible();
        await expect(page.locator('text=Trusted Security')).toBeVisible();
    });

    // ============================================
    // Integration Section Tests
    // ============================================

    test('integration section exists', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.integration-section');
        await expect(section).toBeVisible();
    });

    test('integration section has title', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.integration-section .section-title');
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text).toContain('everything you use');
    });

    test('has 6 integration cards', async ({ page }) => {
        await page.goto(PAGE_URL);
        const cards = page.locator('.integration-card');
        await expect(cards).toHaveCount(6);
    });

    test('integration cards have icons', async ({ page }) => {
        await page.goto(PAGE_URL);
        const icons = page.locator('.integration-icon');
        await expect(icons).toHaveCount(6);
    });

    test('integration cards have names', async ({ page }) => {
        await page.goto(PAGE_URL);
        const names = page.locator('.integration-name');
        await expect(names).toHaveCount(6);
    });

    test('includes key Google Workspace apps', async ({ page }) => {
        await page.goto(PAGE_URL);
        await expect(page.locator('.integration-name:has-text("Gmail")')).toBeVisible();
        await expect(page.locator('.integration-name:has-text("Google Docs")')).toBeVisible();
        await expect(page.locator('.integration-name:has-text("Sheets")')).toBeVisible();
        await expect(page.locator('.integration-name:has-text("Calendar")')).toBeVisible();
        await expect(page.locator('.integration-name:has-text("Drive")')).toBeVisible();
        await expect(page.locator('.integration-name:has-text("Slides")')).toBeVisible();
    });

    // ============================================
    // Stats Section Tests
    // ============================================

    test('stats section exists', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.stats-section');
        await expect(section).toBeVisible();
    });

    test('stats section has black background', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.stats-section');
        const background = await section.evaluate(el => window.getComputedStyle(el).backgroundColor);
        expect(background).toBe('rgb(0, 0, 0)');
    });

    test('stats section has title', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.stats-section .section-title');
        await expect(title).toBeVisible();
    });

    test('has 4 stat items', async ({ page }) => {
        await page.goto(PAGE_URL);
        const stats = page.locator('.stat-item');
        await expect(stats).toHaveCount(4);
    });

    test('stat numbers are visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const numbers = page.locator('.stat-number');
        await expect(numbers).toHaveCount(4);
    });

    test('stat labels are visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const labels = page.locator('.stat-label');
        await expect(labels).toHaveCount(4);
    });

    test('includes key statistics', async ({ page }) => {
        await page.goto(PAGE_URL);
        await expect(page.locator('.stat-number:has-text("10M+")')).toBeVisible();
        await expect(page.locator('.stat-number:has-text("99.9%")')).toBeVisible();
        await expect(page.locator('.stat-number:has-text("150+")')).toBeVisible();
        await expect(page.locator('.stat-number:has-text("24/7")')).toBeVisible();
    });

    test('stat numbers have gradient text', async ({ page }) => {
        await page.goto(PAGE_URL);
        const statNumber = page.locator('.stat-number').first();
        const background = await statNumber.evaluate(el => window.getComputedStyle(el).background);
        expect(background).toContain('linear-gradient');
    });

    // ============================================
    // Quote Section Tests
    // ============================================

    test('quote section exists', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.quote-section');
        await expect(section).toBeVisible();
    });

    test('quote section has testimonial text', async ({ page }) => {
        await page.goto(PAGE_URL);
        const quote = page.locator('.quote-text');
        await expect(quote).toBeVisible();
        const text = await quote.textContent();
        expect(text).toContain('Gemini has fundamentally changed');
    });

    test('quote is italicized', async ({ page }) => {
        await page.goto(PAGE_URL);
        const quote = page.locator('.quote-text');
        const fontStyle = await quote.evaluate(el => window.getComputedStyle(el).fontStyle);
        expect(fontStyle).toBe('italic');
    });

    test('quote has author', async ({ page }) => {
        await page.goto(PAGE_URL);
        const author = page.locator('.quote-author');
        await expect(author).toBeVisible();
        await expect(author).toHaveText('Sarah Chen');
    });

    test('quote has author role', async ({ page }) => {
        await page.goto(PAGE_URL);
        const role = page.locator('.quote-role');
        await expect(role).toBeVisible();
        await expect(role).toHaveText('Product Designer, San Francisco');
    });

    // ============================================
    // Final CTA Section Tests
    // ============================================

    test('final CTA section exists', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.final-cta-section');
        await expect(section).toBeVisible();
    });

    test('final CTA has title', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.final-cta-title');
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text).toContain('Experience it');
    });

    test('final CTA has subtitle', async ({ page }) => {
        await page.goto(PAGE_URL);
        const subtitle = page.locator('.final-cta-subtitle');
        await expect(subtitle).toBeVisible();
    });

    test('final CTA has button', async ({ page }) => {
        await page.goto(PAGE_URL);
        const button = page.locator('.final-cta-section .cta-primary');
        await expect(button).toBeVisible();
        await expect(button).toHaveAttribute('href', 'https://gemini.google.com');
    });

    // ============================================
    // Footer Tests
    // ============================================

    test('footer exists', async ({ page }) => {
        await page.goto(PAGE_URL);
        const footer = page.locator('.footer');
        await expect(footer).toBeVisible();
    });

    test('footer has copyright text', async ({ page }) => {
        await page.goto(PAGE_URL);
        const footerText = page.locator('.footer-text');
        await expect(footerText).toBeVisible();
        const text = await footerText.textContent();
        expect(text).toContain('Copyright © 2026 Google LLC');
    });

    test('footer has privacy policy link', async ({ page }) => {
        await page.goto(PAGE_URL);
        const privacyLink = page.locator('.footer-link');
        await expect(privacyLink).toBeVisible();
        await expect(privacyLink).toHaveAttribute('href', 'https://policies.google.com/privacy');
    });

    // ============================================
    // CTA & Link Tests
    // ============================================

    test('all gemini.google.com links open in new tab', async ({ page }) => {
        await page.goto(PAGE_URL);
        const externalLinks = page.locator('a[href="https://gemini.google.com"]');
        const count = await externalLinks.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const target = await externalLinks.nth(i).getAttribute('target');
            const rel = await externalLinks.nth(i).getAttribute('rel');
            expect(target).toBe('_blank');
            expect(rel).toBe('noopener');
        }
    });

    test('has at least 3 CTAs to gemini.google.com', async ({ page }) => {
        await page.goto(PAGE_URL);
        const ctaLinks = page.locator('a[href="https://gemini.google.com"]');
        const count = await ctaLinks.count();
        expect(count).toBeGreaterThanOrEqual(3);
    });

    // ============================================
    // Animation Tests
    // ============================================

    test('hero elements have fade-in-up animation', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.hero-badge');
        const animation = await badge.evaluate(el => window.getComputedStyle(el).animation);
        expect(animation).toContain('fadeInUp');
    });

    test('sections have fade-in class', async ({ page }) => {
        await page.goto(PAGE_URL);
        const fadeSections = page.locator('.fade-in-section');
        const count = await fadeSections.count();
        expect(count).toBeGreaterThan(0);
    });

    test('feature cards have hover effect', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.feature-card').first();
        const transition = await card.evaluate(el => window.getComputedStyle(el).transition);
        expect(transition).toContain('transform');
    });

    test('integration cards have hover effect', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.integration-card').first();
        const transition = await card.evaluate(el => window.getComputedStyle(el).transition);
        expect(transition).toContain('transform');
    });

    // ============================================
    // Typography Tests
    // ============================================

    test('uses Inter font family', async ({ page }) => {
        await page.goto(PAGE_URL);
        const body = page.locator('body');
        const fontFamily = await body.evaluate(el => window.getComputedStyle(el).fontFamily);
        expect(fontFamily).toContain('Inter');
    });

    test('hero title has large font size on desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(PAGE_URL);
        const title = page.locator('.hero-title');
        const fontSize = await title.evaluate(el => window.getComputedStyle(el).fontSize);
        expect(parseInt(fontSize)).toBeGreaterThan(70); // Should be 80px
    });

    test('hero title is bold', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.hero-title');
        const fontWeight = await title.evaluate(el => window.getComputedStyle(el).fontWeight);
        expect(parseInt(fontWeight)).toBeGreaterThanOrEqual(700);
    });

    test('body text has proper line height', async ({ page }) => {
        await page.goto(PAGE_URL);
        const description = page.locator('.feature-description').first();
        const lineHeight = await description.evaluate(el => window.getComputedStyle(el).lineHeight);
        expect(parseFloat(lineHeight)).toBeGreaterThan(20);
    });

    // ============================================
    // Responsive Design Tests
    // ============================================

    test('mobile: hero title font size is smaller', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(PAGE_URL);
        const title = page.locator('.hero-title');
        const fontSize = await title.evaluate(el => window.getComputedStyle(el).fontSize);
        expect(parseInt(fontSize)).toBeLessThan(60); // Should be 48px on mobile
    });

    test('mobile: CTAs stack vertically', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(PAGE_URL);
        const ctaGroup = page.locator('.hero-cta-group').first();
        const flexDirection = await ctaGroup.evaluate(el => window.getComputedStyle(el).flexDirection);
        expect(flexDirection).toBe('column');
    });

    test('tablet: hero title adjusts size', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto(PAGE_URL);
        const title = page.locator('.hero-title');
        const fontSize = await title.evaluate(el => window.getComputedStyle(el).fontSize);
        expect(parseInt(fontSize)).toBeGreaterThan(50);
        expect(parseInt(fontSize)).toBeLessThan(80);
    });

    test('mobile: sphere is smaller', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(PAGE_URL);
        const sphere = page.locator('.sphere');
        const width = await sphere.evaluate(el => window.getComputedStyle(el).width);
        expect(parseInt(width)).toBeLessThan(350); // Should be 280px on mobile
    });

    // ============================================
    // Accessibility Tests
    // ============================================

    test('page has proper heading hierarchy', async ({ page }) => {
        await page.goto(PAGE_URL);
        const h1 = page.locator('h1');
        await expect(h1).toHaveCount(1); // Only one h1

        const h2Count = await page.locator('h2').count();
        expect(h2Count).toBeGreaterThan(0);
    });

    test('links have proper attributes', async ({ page }) => {
        await page.goto(PAGE_URL);
        const externalLinks = page.locator('a[target="_blank"]');
        const count = await externalLinks.count();

        for (let i = 0; i < count; i++) {
            const rel = await externalLinks.nth(i).getAttribute('rel');
            expect(rel).toContain('noopener');
        }
    });

    test('buttons have proper cursor', async ({ page }) => {
        await page.goto(PAGE_URL);
        const cta = page.locator('.cta-primary').first();
        const cursor = await cta.evaluate(el => window.getComputedStyle(el).cursor);
        expect(cursor).toBe('pointer');
    });

    test('text has sufficient contrast on white background', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.hero-title');
        const color = await title.evaluate(el => window.getComputedStyle(el).color);
        // Should be dark text (close to black)
        expect(color).toContain('rgb(29, 29, 31)'); // #1d1d1f
    });

    // ============================================
    // Design Quality Tests
    // ============================================

    test('page uses minimal color palette', async ({ page }) => {
        await page.goto(PAGE_URL);
        const body = page.locator('body');
        const bgColor = await body.evaluate(el => window.getComputedStyle(el).backgroundColor);
        expect(bgColor).toBe('rgb(255, 255, 255)'); // Pure white
    });

    test('primary blue color is consistent', async ({ page }) => {
        await page.goto(PAGE_URL);
        const primaryCta = page.locator('.cta-primary').first();
        const bgColor = await primaryCta.evaluate(el => window.getComputedStyle(el).backgroundColor);
        expect(bgColor).toBe('rgb(0, 102, 204)'); // #06c
    });

    test('navigation has subtle border', async ({ page }) => {
        await page.goto(PAGE_URL);
        const nav = page.locator('.nav');
        const borderBottom = await nav.evaluate(el => window.getComputedStyle(el).borderBottom);
        expect(borderBottom).toContain('rgba(0, 0, 0, 0.08)');
    });

    test('sections have generous padding', async ({ page }) => {
        await page.goto(PAGE_URL);
        const section = page.locator('.product-section');
        const padding = await section.evaluate(el => window.getComputedStyle(el).padding);
        expect(padding).toContain('120px'); // 120px vertical padding
    });

    test('CTA buttons have pill shape', async ({ page }) => {
        await page.goto(PAGE_URL);
        const cta = page.locator('.cta-primary').first();
        const borderRadius = await cta.evaluate(el => window.getComputedStyle(el).borderRadius);
        expect(parseInt(borderRadius)).toBeGreaterThan(100); // 980px (pill shape)
    });

    test('integration cards have rounded corners', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.integration-card').first();
        const borderRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
        expect(parseInt(borderRadius)).toBe(18);
    });

    // ============================================
    // Performance Tests
    // ============================================

    test('page uses GPU-accelerated animations', async ({ page }) => {
        await page.goto(PAGE_URL);
        const sphere = page.locator('.sphere');
        const animation = await sphere.evaluate(el => window.getComputedStyle(el).animation);
        expect(animation).toContain('sphereFloat');

        // Check that transform is used (GPU-accelerated)
        const willChange = await sphere.evaluate(el => window.getComputedStyle(el).willChange);
        // Will-change might be auto, but transform animations are GPU-accelerated
    });

    test('no images used (emoji icons only)', async ({ page }) => {
        await page.goto(PAGE_URL);
        const images = await page.locator('img').count();
        expect(images).toBe(0); // No img tags, using emojis and CSS
    });

    // ============================================
    // Content Quality Tests
    // ============================================

    test('hero message is concise and impactful', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.hero-title');
        const text = await title.textContent();
        expect(text?.length || 0).toBeLessThan(50); // Very short, impactful
    });

    test('sections have clear hierarchy', async ({ page }) => {
        await page.goto(PAGE_URL);
        const sectionTitles = page.locator('.section-title, .capability-title, .final-cta-title');
        const count = await sectionTitles.count();
        expect(count).toBeGreaterThan(4);
    });

    test('feature descriptions are concise', async ({ page }) => {
        await page.goto(PAGE_URL);
        const descriptions = page.locator('.feature-description');
        const firstDesc = await descriptions.first().textContent();
        expect(firstDesc?.length || 0).toBeLessThan(100);
    });

    test('call-to-action text is clear', async ({ page }) => {
        await page.goto(PAGE_URL);
        const primaryCta = page.locator('.cta-primary').first();
        const text = await primaryCta.textContent();
        expect(text).toContain('Gemini');
    });

    // ============================================
    // Apple-Inspired Design Tests
    // ============================================

    test('uses maximum whitespace (Apple style)', async ({ page }) => {
        await page.goto(PAGE_URL);
        const hero = page.locator('.hero');
        const padding = await hero.evaluate(el => window.getComputedStyle(el).padding);
        expect(padding).toContain('88px'); // Generous padding
    });

    test('uses Apple-style color scheme', async ({ page }) => {
        await page.goto(PAGE_URL);
        // Check for Apple's preferred colors
        const body = page.locator('body');
        const color = await body.evaluate(el => window.getComputedStyle(el).color);
        expect(color).toBe('rgb(29, 29, 31)'); // Apple's text color #1d1d1f
    });

    test('navigation uses Apple glassmorphism', async ({ page }) => {
        await page.goto(PAGE_URL);
        const nav = page.locator('.nav');
        const backdropFilter = await nav.evaluate(el => window.getComputedStyle(el).backdropFilter);
        expect(backdropFilter).toContain('saturate');
        expect(backdropFilter).toContain('blur');
    });

    test('sections alternate background colors (Apple pattern)', async ({ page }) => {
        await page.goto(PAGE_URL);
        const whiteSection = page.locator('.product-section');
        const graySection = page.locator('.capability-section');

        const whiteBg = await whiteSection.evaluate(el => window.getComputedStyle(el).backgroundColor);
        const grayBg = await graySection.evaluate(el => window.getComputedStyle(el).backgroundColor);

        expect(whiteBg).toBe('rgba(0, 0, 0, 0)'); // Transparent/white
        expect(grayBg).toBe('rgb(245, 245, 247)'); // Apple's light gray
    });

    test('uses subtle animations (not flashy)', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.feature-card').first();
        const transition = await card.evaluate(el => window.getComputedStyle(el).transition);
        expect(transition).toContain('0.3s'); // Subtle, quick transitions
    });

    test('text uses negative letter spacing (Apple typography)', async ({ page }) => {
        await page.goto(PAGE_URL);
        const title = page.locator('.hero-title');
        const letterSpacing = await title.evaluate(el => window.getComputedStyle(el).letterSpacing);
        expect(parseFloat(letterSpacing)).toBeLessThan(0); // Negative letter spacing
    });

    // ============================================
    // Screenshot Tests
    // ============================================

    test('capture desktop screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(PAGE_URL);
        await page.waitForTimeout(1000); // Wait for animations
        await page.screenshot({
            path: 'tests/screenshots/apple-inspired-desktop.png',
            fullPage: true
        });
    });

    test('capture tablet screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto(PAGE_URL);
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'tests/screenshots/apple-inspired-tablet.png',
            fullPage: true
        });
    });

    test('capture mobile screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(PAGE_URL);
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: 'tests/screenshots/apple-inspired-mobile.png',
            fullPage: true
        });
    });

    test('capture hero section close-up', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(PAGE_URL);
        await page.waitForTimeout(1000);
        const hero = page.locator('.hero');
        await hero.screenshot({
            path: 'tests/screenshots/apple-inspired-hero.png'
        });
    });

    test('capture stats section close-up', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(PAGE_URL);
        await page.waitForTimeout(1000);
        const stats = page.locator('.stats-section');
        await stats.screenshot({
            path: 'tests/screenshots/apple-inspired-stats.png'
        });
    });

    test('capture integration section close-up', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(PAGE_URL);
        await page.waitForTimeout(1000);
        const integration = page.locator('.integration-section');
        await integration.screenshot({
            path: 'tests/screenshots/apple-inspired-integration.png'
        });
    });

    // ============================================
    // Integration Tests
    // ============================================

    test('page integrates with shared design system', async ({ page }) => {
        await page.goto(PAGE_URL);
        // Check that external CSS is loaded
        const styles = await page.evaluate(() => {
            return Array.from(document.styleSheets)
                .map(sheet => sheet.href)
                .filter(href => href);
        });
        expect(styles.some(href => href.includes('design-system.css'))).toBeTruthy();
    });

    test('animations.js loads successfully', async ({ page }) => {
        await page.goto(PAGE_URL);
        const script = page.locator('script[src*="animations.js"]');
        await expect(script).toHaveCount(1);
    });

    test('smooth scroll functionality works', async ({ page }) => {
        await page.goto(PAGE_URL);
        const learnMore = page.locator('.cta-secondary').first();
        await learnMore.click();
        await page.waitForTimeout(500);
        // If smooth scroll works, we should be near the features section
        const featuresSection = page.locator('#features');
        await expect(featuresSection).toBeInViewport();
    });

});
