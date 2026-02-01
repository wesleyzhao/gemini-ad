const { test, expect } = require('@playwright/test');

test.describe('Bundling Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/pages/bundling.html');
    });

    // Page Load Tests
    test('page loads successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/Gemini Complete/);
    });

    test('page has correct meta description', async ({ page }) => {
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
        expect(metaDescription).toContain('Gemini AI with full Google Workspace integration');
    });

    test('all stylesheets load correctly', async ({ page }) => {
        const stylesheets = await page.locator('link[rel="stylesheet"]').count();
        expect(stylesheets).toBeGreaterThanOrEqual(3); // design-system, components, animations
    });

    test('fonts load from Google Fonts', async ({ page }) => {
        const fontLinks = await page.locator('link[href*="fonts.googleapis.com"]').count();
        expect(fontLinks).toBeGreaterThanOrEqual(2); // preconnect + actual fonts
    });

    // Hero Section Tests
    test('hero section displays correctly', async ({ page }) => {
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();
    });

    test('hero badge is present', async ({ page }) => {
        const badge = page.locator('.hero-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toContainText('Gemini Complete');
    });

    test('hero title is present', async ({ page }) => {
        const title = page.locator('.hero h1');
        await expect(title).toBeVisible();
        await expect(title).toContainText('Everything you need');
    });

    test('hero subtitle is present', async ({ page }) => {
        const subtitle = page.locator('.hero-subtitle');
        await expect(subtitle).toBeVisible();
        await expect(subtitle).toContainText('Powerful AI meets seamless productivity');
    });

    test('hero has two CTA buttons', async ({ page }) => {
        const ctaButtons = page.locator('.hero-cta-group .cta-button');
        await expect(ctaButtons).toHaveCount(2);
    });

    test('hero primary CTA links to gemini.google.com', async ({ page }) => {
        const primaryCta = page.locator('.hero-cta-group .cta-button.primary');
        const href = await primaryCta.getAttribute('href');
        expect(href).toBe('https://gemini.google.com');
    });

    test('hero secondary CTA links to comparison section', async ({ page }) => {
        const secondaryCta = page.locator('.hero-cta-group .cta-button.secondary');
        const href = await secondaryCta.getAttribute('href');
        expect(href).toBe('#comparison');
    });

    // Bundle Tiers Section Tests
    test('bundle tiers section displays correctly', async ({ page }) => {
        const section = page.locator('.bundle-tiers');
        await expect(section).toBeVisible();
    });

    test('section header is present', async ({ page }) => {
        const header = page.locator('.bundle-tiers .section-header h2');
        await expect(header).toBeVisible();
        await expect(header).toContainText('Choose the bundle');
    });

    test('displays 4 bundle cards', async ({ page }) => {
        const bundleCards = page.locator('.bundle-card');
        await expect(bundleCards).toHaveCount(4);
    });

    test('bundle card 1: Basic plan displays correctly', async ({ page }) => {
        const card = page.locator('.bundle-card').nth(0);
        await expect(card.locator('h3')).toContainText('Gemini Basic');
        await expect(card.locator('.bundle-price')).toContainText('Free');
        await expect(card.locator('.bundle-badge')).toContainText('Individual');
    });

    test('bundle card 2: Pro plan displays correctly and is featured', async ({ page }) => {
        const card = page.locator('.bundle-card').nth(1);
        await expect(card).toHaveClass(/featured/);
        await expect(card.locator('h3')).toContainText('Gemini Pro');
        await expect(card.locator('.bundle-price')).toContainText('$19.99');
        await expect(card.locator('.bundle-badge')).toContainText('Most Popular');
    });

    test('bundle card 3: Premium plan displays correctly', async ({ page }) => {
        const card = page.locator('.bundle-card').nth(2);
        await expect(card).toHaveClass(/premium/);
        await expect(card.locator('h3')).toContainText('Gemini Premium');
        await expect(card.locator('.bundle-price')).toContainText('$29.99');
        await expect(card.locator('.bundle-badge')).toContainText('Premium');
    });

    test('bundle card 4: Complete plan displays correctly', async ({ page }) => {
        const card = page.locator('.bundle-card').nth(3);
        await expect(card).toHaveClass(/complete/);
        await expect(card.locator('h3')).toContainText('Gemini Complete');
        await expect(card.locator('.bundle-price')).toContainText('Custom');
        await expect(card.locator('.bundle-badge')).toContainText('Enterprise');
    });

    test('all bundle cards have feature lists', async ({ page }) => {
        const featureLists = page.locator('.bundle-features');
        await expect(featureLists).toHaveCount(4);
    });

    test('all bundle cards have CTA buttons', async ({ page }) => {
        const ctaButtons = page.locator('.bundle-cta');
        await expect(ctaButtons).toHaveCount(4);
    });

    test('Basic plan features are visible', async ({ page }) => {
        const card = page.locator('.bundle-card').nth(0);
        const features = card.locator('.bundle-features li');
        await expect(features).toHaveCount(5);
        await expect(features.nth(0)).toContainText('Gemini AI chat');
        await expect(features.nth(1)).toContainText('Gmail integration');
    });

    test('Pro plan features are visible', async ({ page }) => {
        const card = page.locator('.bundle-card').nth(1);
        const features = card.locator('.bundle-features li');
        await expect(features).toHaveCount(7);
        await expect(features.nth(0)).toContainText('Advanced Gemini AI');
        await expect(features.nth(5)).toContainText('citation');
    });

    test('Premium plan features are visible', async ({ page }) => {
        const card = page.locator('.bundle-card').nth(2);
        const features = card.locator('.bundle-features li');
        await expect(features).toHaveCount(8);
        await expect(features.nth(2)).toContainText('multimodal AI');
        await expect(features.nth(4)).toContainText('API access');
    });

    test('Complete plan features are visible', async ({ page }) => {
        const card = page.locator('.bundle-card').nth(3);
        const features = card.locator('.bundle-features li');
        await expect(features).toHaveCount(8);
        await expect(features.nth(2)).toContainText('security');
        await expect(features.nth(6)).toContainText('99.9% uptime');
    });

    // Services Grid Section Tests
    test('services grid section displays correctly', async ({ page }) => {
        const section = page.locator('.services-grid');
        await expect(section).toBeVisible();
    });

    test('services section header is present', async ({ page }) => {
        const header = page.locator('.services-grid .section-header h2');
        await expect(header).toBeVisible();
        await expect(header).toContainText('Everything included');
    });

    test('displays 8 service items', async ({ page }) => {
        const serviceItems = page.locator('.service-item');
        await expect(serviceItems).toHaveCount(8);
    });

    test('service item 1: Gemini AI displays correctly', async ({ page }) => {
        const item = page.locator('.service-item').nth(0);
        await expect(item.locator('.service-icon')).toContainText('🧠');
        await expect(item.locator('h3')).toContainText('Gemini AI');
        await expect(item.locator('p')).toContainText('conversational AI');
    });

    test('service item 2: Gmail Pro displays correctly', async ({ page }) => {
        const item = page.locator('.service-item').nth(1);
        await expect(item.locator('.service-icon')).toContainText('📧');
        await expect(item.locator('h3')).toContainText('Gmail Pro');
    });

    test('service item 3: Google Docs displays correctly', async ({ page }) => {
        const item = page.locator('.service-item').nth(2);
        await expect(item.locator('.service-icon')).toContainText('📝');
        await expect(item.locator('h3')).toContainText('Google Docs');
    });

    test('service item 4: Google Sheets displays correctly', async ({ page }) => {
        const item = page.locator('.service-item').nth(3);
        await expect(item.locator('.service-icon')).toContainText('📊');
        await expect(item.locator('h3')).toContainText('Google Sheets');
    });

    test('service item 5: Smart Calendar displays correctly', async ({ page }) => {
        const item = page.locator('.service-item').nth(4);
        await expect(item.locator('.service-icon')).toContainText('📅');
        await expect(item.locator('h3')).toContainText('Smart Calendar');
    });

    test('service item 6: Google Drive displays correctly', async ({ page }) => {
        const item = page.locator('.service-item').nth(5);
        await expect(item.locator('.service-icon')).toContainText('💾');
        await expect(item.locator('h3')).toContainText('Google Drive');
    });

    test('service item 7: Google Meet displays correctly', async ({ page }) => {
        const item = page.locator('.service-item').nth(6);
        await expect(item.locator('.service-icon')).toContainText('🎥');
        await expect(item.locator('h3')).toContainText('Google Meet');
    });

    test('service item 8: Google Slides displays correctly', async ({ page }) => {
        const item = page.locator('.service-item').nth(7);
        await expect(item.locator('.service-icon')).toContainText('📑');
        await expect(item.locator('h3')).toContainText('Google Slides');
    });

    // Comparison Table Section Tests
    test('comparison section displays correctly', async ({ page }) => {
        const section = page.locator('.comparison-section');
        await expect(section).toBeVisible();
    });

    test('comparison section has correct ID for anchor link', async ({ page }) => {
        const section = page.locator('#comparison');
        await expect(section).toBeVisible();
    });

    test('comparison table is present', async ({ page }) => {
        const table = page.locator('.comparison-table table');
        await expect(table).toBeVisible();
    });

    test('comparison table has correct headers', async ({ page }) => {
        const headers = page.locator('thead th');
        await expect(headers).toHaveCount(5);
        await expect(headers.nth(0)).toContainText('Feature');
        await expect(headers.nth(1)).toContainText('Basic');
        await expect(headers.nth(2)).toContainText('Pro');
        await expect(headers.nth(3)).toContainText('Premium');
        await expect(headers.nth(4)).toContainText('Complete');
    });

    test('comparison table has at least 10 feature rows', async ({ page }) => {
        const rows = page.locator('tbody tr');
        const count = await rows.count();
        expect(count).toBeGreaterThanOrEqual(10);
    });

    test('comparison table shows Gemini AI Chat feature', async ({ page }) => {
        const firstRow = page.locator('tbody tr').nth(0);
        await expect(firstRow.locator('td').nth(0)).toContainText('Gemini AI Chat');
    });

    test('comparison table uses checkmarks for included features', async ({ page }) => {
        const checkmarks = page.locator('.check');
        const count = await checkmarks.count();
        expect(count).toBeGreaterThan(15); // Multiple features across multiple plans
    });

    test('comparison table uses minus signs for excluded features', async ({ page }) => {
        const minuses = page.locator('.minus');
        const count = await minuses.count();
        expect(count).toBeGreaterThan(5); // Some features not in Basic
    });

    // Stats Section Tests
    test('stats section displays correctly', async ({ page }) => {
        const section = page.locator('.stats-section');
        await expect(section).toBeVisible();
    });

    test('stats section has gradient background', async ({ page }) => {
        const section = page.locator('.stats-section');
        const bgColor = await section.evaluate(el => getComputedStyle(el).background);
        expect(bgColor).toContain('gradient');
    });

    test('stats section header is present', async ({ page }) => {
        const header = page.locator('.stats-section h2');
        await expect(header).toBeVisible();
        await expect(header).toContainText('Trusted by millions');
    });

    test('displays 4 stat items', async ({ page }) => {
        const statItems = page.locator('.stat-item');
        await expect(statItems).toHaveCount(4);
    });

    test('stat 1: Active Users displays correctly', async ({ page }) => {
        const stat = page.locator('.stat-item').nth(0);
        await expect(stat.locator('.stat-number')).toContainText('50M+');
        await expect(stat.locator('.stat-label')).toContainText('Active Users');
    });

    test('stat 2: Uptime SLA displays correctly', async ({ page }) => {
        const stat = page.locator('.stat-item').nth(1);
        await expect(stat.locator('.stat-number')).toContainText('99.9%');
        await expect(stat.locator('.stat-label')).toContainText('Uptime SLA');
    });

    test('stat 3: Countries displays correctly', async ({ page }) => {
        const stat = page.locator('.stat-item').nth(2);
        await expect(stat.locator('.stat-number')).toContainText('150+');
        await expect(stat.locator('.stat-label')).toContainText('Countries');
    });

    test('stat 4: User Rating displays correctly', async ({ page }) => {
        const stat = page.locator('.stat-item').nth(3);
        await expect(stat.locator('.stat-number')).toContainText('4.8');
        await expect(stat.locator('.stat-label')).toContainText('User Rating');
    });

    // Testimonials Section Tests
    test('testimonials section displays correctly', async ({ page }) => {
        const section = page.locator('.testimonials');
        await expect(section).toBeVisible();
    });

    test('testimonials section header is present', async ({ page }) => {
        const header = page.locator('.testimonials .section-header h2');
        await expect(header).toBeVisible();
        await expect(header).toContainText('What our customers');
    });

    test('displays 3 testimonial cards', async ({ page }) => {
        const testimonialCards = page.locator('.testimonial-card');
        await expect(testimonialCards).toHaveCount(3);
    });

    test('testimonial 1: Sarah Martinez displays correctly', async ({ page }) => {
        const card = page.locator('.testimonial-card').nth(0);
        await expect(card.locator('.testimonial-quote')).toContainText('Gemini Pro was a game-changer');
        await expect(card.locator('.testimonial-info h4')).toContainText('Sarah Martinez');
        await expect(card.locator('.testimonial-info p')).toContainText('Marketing Director');
        await expect(card.locator('.testimonial-avatar')).toContainText('👩‍💼');
    });

    test('testimonial 2: James Chen displays correctly', async ({ page }) => {
        const card = page.locator('.testimonial-card').nth(1);
        await expect(card.locator('.testimonial-quote')).toContainText('multimodal AI');
        await expect(card.locator('.testimonial-info h4')).toContainText('James Chen');
        await expect(card.locator('.testimonial-info p')).toContainText('Creative Lead');
        await expect(card.locator('.testimonial-avatar')).toContainText('👨‍🎨');
    });

    test('testimonial 3: Michael Roberts displays correctly', async ({ page }) => {
        const card = page.locator('.testimonial-card').nth(2);
        await expect(card.locator('.testimonial-quote')).toContainText('Gemini Complete transformed');
        await expect(card.locator('.testimonial-info h4')).toContainText('Michael Roberts');
        await expect(card.locator('.testimonial-info p')).toContainText('CTO');
        await expect(card.locator('.testimonial-avatar')).toContainText('👔');
    });

    // FAQ Section Tests
    test('FAQ section displays correctly', async ({ page }) => {
        const section = page.locator('.faq-section');
        await expect(section).toBeVisible();
    });

    test('FAQ section header is present', async ({ page }) => {
        const header = page.locator('.faq-section .section-header h2');
        await expect(header).toBeVisible();
        await expect(header).toContainText('Frequently asked questions');
    });

    test('displays at least 5 FAQ items', async ({ page }) => {
        const faqItems = page.locator('.faq-item');
        const count = await faqItems.count();
        expect(count).toBeGreaterThanOrEqual(5);
    });

    test('FAQ 1: Can I switch between plans?', async ({ page }) => {
        const faq = page.locator('.faq-item').nth(0);
        await expect(faq.locator('.faq-question')).toContainText('Can I switch between plans');
        await expect(faq.locator('.faq-answer')).toContainText('upgrade or downgrade');
    });

    test('FAQ 2: What\'s included in the free trial?', async ({ page }) => {
        const faq = page.locator('.faq-item').nth(1);
        await expect(faq.locator('.faq-question')).toContainText('free trial');
        await expect(faq.locator('.faq-answer')).toContainText('14-day');
    });

    test('FAQ 3: How does family sharing work?', async ({ page }) => {
        const faq = page.locator('.faq-item').nth(2);
        await expect(faq.locator('.faq-question')).toContainText('family sharing');
        await expect(faq.locator('.faq-answer')).toContainText('5 family members');
    });

    test('FAQ 4: Is my data secure?', async ({ page }) => {
        const faq = page.locator('.faq-item').nth(3);
        await expect(faq.locator('.faq-question')).toContainText('data secure');
        await expect(faq.locator('.faq-answer')).toContainText('encryption');
    });

    test('FAQ 5: What if I need more storage?', async ({ page }) => {
        const faq = page.locator('.faq-item').nth(4);
        await expect(faq.locator('.faq-question')).toContainText('more storage');
        await expect(faq.locator('.faq-answer')).toContainText('additional storage');
    });

    // Final CTA Section Tests
    test('final CTA section displays correctly', async ({ page }) => {
        const section = page.locator('.final-cta');
        await expect(section).toBeVisible();
    });

    test('final CTA heading is present', async ({ page }) => {
        const heading = page.locator('.final-cta h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('Ready to get started');
    });

    test('final CTA has two buttons', async ({ page }) => {
        const ctaButtons = page.locator('.final-cta .cta-button');
        await expect(ctaButtons).toHaveCount(2);
    });

    test('final CTA primary button links to gemini.google.com', async ({ page }) => {
        const primaryCta = page.locator('.final-cta .cta-button.primary');
        const href = await primaryCta.getAttribute('href');
        expect(href).toBe('https://gemini.google.com');
    });

    test('final CTA secondary button links to gemini.google.com', async ({ page }) => {
        const secondaryCta = page.locator('.final-cta .cta-button.secondary');
        const href = await secondaryCta.getAttribute('href');
        expect(href).toBe('https://gemini.google.com');
    });

    // CTA & Links Tests
    test('all gemini.google.com links open in new tab', async ({ page }) => {
        const externalLinks = page.locator('a[href="https://gemini.google.com"]');
        const count = await externalLinks.count();

        for (let i = 0; i < count; i++) {
            const target = await externalLinks.nth(i).getAttribute('target');
            const rel = await externalLinks.nth(i).getAttribute('rel');
            expect(target).toBe('_blank');
            expect(rel).toBe('noopener');
        }
    });

    test('page has multiple CTAs for conversion', async ({ page }) => {
        const allCtas = page.locator('.cta-button, .bundle-cta');
        const count = await allCtas.count();
        expect(count).toBeGreaterThan(8); // Multiple conversion opportunities
    });

    // Animation Tests
    test('hero has floating background animations', async ({ page }) => {
        const hero = page.locator('.hero');
        const beforePseudo = await hero.evaluate(el => {
            const before = window.getComputedStyle(el, '::before');
            return before.animation || before.animationName;
        });
        expect(beforePseudo).toContain('float');
    });

    test('bundle cards have hover effects', async ({ page }) => {
        const firstCard = page.locator('.bundle-card').first();
        const box = await firstCard.boundingBox();

        // Hover over the card
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(500);

        // Card should have transform on hover
        const transform = await firstCard.evaluate(el => getComputedStyle(el).transform);
        expect(transform).not.toBe('none');
    });

    test('service items have hover effects', async ({ page }) => {
        const firstService = page.locator('.service-item').first();
        await firstService.scrollIntoViewIfNeeded();

        const box = await firstService.boundingBox();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(500);

        const transform = await firstService.evaluate(el => getComputedStyle(el).transform);
        expect(transform).not.toBe('none');
    });

    test('smooth scroll works for anchor links', async ({ page }) => {
        const comparisonLink = page.locator('a[href="#comparison"]').first();
        await comparisonLink.click();
        await page.waitForTimeout(1000);

        const comparisonSection = page.locator('#comparison');
        await expect(comparisonSection).toBeInViewport();
    });

    // Typography Tests
    test('uses Space Grotesk for headings', async ({ page }) => {
        const heading = page.locator('h1').first();
        const fontFamily = await heading.evaluate(el => getComputedStyle(el).fontFamily);
        expect(fontFamily).toContain('Space Grotesk');
    });

    test('uses Inter for body text', async ({ page }) => {
        const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
        expect(bodyFont).toContain('Inter');
    });

    test('headings have proper weight hierarchy', async ({ page }) => {
        const h1 = page.locator('h1').first();
        const h2 = page.locator('h2').first();
        const h3 = page.locator('h3').first();

        const h1Weight = await h1.evaluate(el => getComputedStyle(el).fontWeight);
        const h2Weight = await h2.evaluate(el => getComputedStyle(el).fontWeight);
        const h3Weight = await h3.evaluate(el => getComputedStyle(el).fontWeight);

        expect(parseInt(h1Weight)).toBeGreaterThanOrEqual(700);
        expect(parseInt(h2Weight)).toBeGreaterThanOrEqual(600);
        expect(parseInt(h3Weight)).toBeGreaterThanOrEqual(600);
    });

    // Responsive Design Tests
    test('mobile: hero text scales down', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const h1 = page.locator('h1').first();
        const fontSize = await h1.evaluate(el => getComputedStyle(el).fontSize);
        expect(parseInt(fontSize)).toBeLessThan(80); // Should scale down from desktop
    });

    test('mobile: bundle grid is single column', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const grid = page.locator('.bundle-grid');
        const gridTemplate = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
        // Should be single column or very narrow columns
        expect(gridTemplate).not.toContain('340px 340px 340px');
    });

    test('tablet: maintains proper spacing', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        const section = page.locator('.bundle-tiers');
        const padding = await section.evaluate(el => getComputedStyle(el).padding);
        expect(padding).toBeTruthy();
    });

    test('desktop: full layout displays correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const bundleCards = page.locator('.bundle-card');
        await expect(bundleCards).toHaveCount(4);

        // All cards should be visible
        for (let i = 0; i < 4; i++) {
            await expect(bundleCards.nth(i)).toBeVisible();
        }
    });

    // Accessibility Tests
    test('page has single h1 element', async ({ page }) => {
        const h1s = page.locator('h1');
        await expect(h1s).toHaveCount(1);
    });

    test('heading hierarchy is correct', async ({ page }) => {
        const h1 = await page.locator('h1').count();
        const h2 = await page.locator('h2').count();
        const h3 = await page.locator('h3').count();

        expect(h1).toBe(1);
        expect(h2).toBeGreaterThan(0);
        expect(h3).toBeGreaterThan(0);
    });

    test('all links have accessible text', async ({ page }) => {
        const links = page.locator('a');
        const count = await links.count();

        for (let i = 0; i < count; i++) {
            const text = await links.nth(i).textContent();
            expect(text.trim().length).toBeGreaterThan(0);
        }
    });

    test('interactive elements are keyboard accessible', async ({ page }) => {
        const firstCta = page.locator('.cta-button').first();
        await firstCta.focus();
        const focused = await page.evaluate(() => document.activeElement.tagName);
        expect(focused).toBe('A');
    });

    // Design Quality Tests
    test('uses gradient backgrounds effectively', async ({ page }) => {
        const hero = page.locator('.hero');
        const background = await hero.evaluate(el => getComputedStyle(el).background);
        expect(background).toContain('gradient');
    });

    test('bundle cards have proper visual hierarchy', async ({ page }) => {
        const featuredCard = page.locator('.bundle-card.featured');
        await expect(featuredCard).toHaveCount(1);

        const borderColor = await featuredCard.evaluate(el => getComputedStyle(el).borderColor);
        expect(borderColor).toBeTruthy();
    });

    test('color palette is consistent with bundling theme', async ({ page }) => {
        const styleContent = await page.locator('style').first().textContent();
        expect(styleContent).toContain('--bundle-primary');
        expect(styleContent).toContain('--bundle-gradient');
        expect(styleContent).toContain('--premium-gradient');
    });

    test('cards have rounded corners for modern look', async ({ page }) => {
        const card = page.locator('.bundle-card').first();
        const borderRadius = await card.evaluate(el => getComputedStyle(el).borderRadius);
        expect(parseInt(borderRadius)).toBeGreaterThan(10);
    });

    test('white space is generous (Apple-inspired)', async ({ page }) => {
        const section = page.locator('.bundle-tiers');
        const padding = await section.evaluate(el => getComputedStyle(el).padding);
        expect(parseInt(padding)).toBeGreaterThan(80);
    });

    test('icons are used effectively', async ({ page }) => {
        const icons = page.locator('.service-icon');
        const count = await icons.count();
        expect(count).toBeGreaterThanOrEqual(8);
    });

    // Performance Tests
    test('page loads within reasonable time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('http://localhost:8000/pages/bundling.html');
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    });

    test('no JavaScript errors on page', async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error));
        await page.goto('http://localhost:8000/pages/bundling.html');
        await page.waitForTimeout(2000);
        expect(errors.length).toBe(0);
    });

    // Bundling-Specific Tests
    test('displays clear pricing tiers', async ({ page }) => {
        const prices = page.locator('.bundle-price');
        await expect(prices).toHaveCount(4);

        const priceTexts = await Promise.all([
            prices.nth(0).textContent(),
            prices.nth(1).textContent(),
            prices.nth(2).textContent(),
            prices.nth(3).textContent()
        ]);

        expect(priceTexts[0]).toContain('Free');
        expect(priceTexts[1]).toContain('$19.99');
        expect(priceTexts[2]).toContain('$29.99');
        expect(priceTexts[3]).toContain('Custom');
    });

    test('Pro plan is highlighted as featured', async ({ page }) => {
        const proCard = page.locator('.bundle-card').nth(1);
        await expect(proCard).toHaveClass(/featured/);
    });

    test('showcases Google Workspace integration', async ({ page }) => {
        const content = await page.textContent('body');
        expect(content).toContain('Gmail');
        expect(content).toContain('Google Docs');
        expect(content).toContain('Google Sheets');
        expect(content).toContain('Google Drive');
        expect(content).toContain('Google Calendar');
    });

    test('emphasizes bundle value proposition', async ({ page }) => {
        const content = await page.textContent('body');
        expect(content).toContain('Everything');
        expect(content).toContain('One');
        expect(content).toContain('seamless');
        expect(content).toContain('integration');
    });

    test('includes storage tiers across plans', async ({ page }) => {
        const content = await page.textContent('body');
        expect(content).toContain('15 GB');
        expect(content).toContain('100 GB');
        expect(content).toContain('2 TB');
        expect(content).toContain('Unlimited');
    });

    test('mentions VO3 multimodal AI', async ({ page }) => {
        const content = await page.textContent('body');
        expect(content).toContain('VO3');
        expect(content).toContain('multimodal');
    });

    test('includes API access for premium tiers', async ({ page }) => {
        const premiumCard = page.locator('.bundle-card.premium');
        await expect(premiumCard.locator('.bundle-features')).toContainText('API access');
    });

    test('displays family sharing option', async ({ page }) => {
        const content = await page.textContent('body');
        expect(content).toContain('Family');
        expect(content).toContain('5');
    });

    // Screenshot Tests
    test('screenshot: full page desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.screenshot({ path: 'screenshots/bundling-desktop-full.png', fullPage: true });
    });

    test('screenshot: hero section desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const hero = page.locator('.hero');
        await hero.screenshot({ path: 'screenshots/bundling-hero.png' });
    });

    test('screenshot: bundle cards desktop', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const bundleSection = page.locator('.bundle-tiers');
        await bundleSection.screenshot({ path: 'screenshots/bundling-cards.png' });
    });

    test('screenshot: comparison table', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const comparisonSection = page.locator('.comparison-section');
        await comparisonSection.screenshot({ path: 'screenshots/bundling-comparison.png' });
    });

    test('screenshot: mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.screenshot({ path: 'screenshots/bundling-mobile-full.png', fullPage: true });
    });

    test('screenshot: tablet view', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.screenshot({ path: 'screenshots/bundling-tablet-full.png', fullPage: true });
    });

    // Integration Tests
    test('integrates with design system', async ({ page }) => {
        const designSystemLink = page.locator('link[href*="design-system.css"]');
        await expect(designSystemLink).toHaveCount(1);
    });

    test('integrates with components library', async ({ page }) => {
        const componentsLink = page.locator('link[href*="components.css"]');
        await expect(componentsLink).toHaveCount(1);
    });

    test('integrates with animations library', async ({ page }) => {
        const animationsLink = page.locator('link[href*="animations.css"]');
        await expect(animationsLink).toHaveCount(1);

        const animationsScript = page.locator('script[src*="animations.js"]');
        await expect(animationsScript).toHaveCount(1);
    });

    // Content Quality Tests
    test('has compelling hero copy', async ({ page }) => {
        const hero = page.locator('.hero');
        const content = await hero.textContent();
        expect(content).toContain('Everything you need');
        expect(content).toContain('One simple plan');
        expect(content).toContain('Powerful AI');
    });

    test('feature descriptions are clear and benefit-focused', async ({ page }) => {
        const features = page.locator('.bundle-features li');
        const count = await features.count();
        expect(count).toBeGreaterThan(20); // Across all bundle cards
    });

    test('testimonials are credible and specific', async ({ page }) => {
        const testimonials = page.locator('.testimonial-quote');
        const count = await testimonials.count();
        expect(count).toBe(3);

        for (let i = 0; i < count; i++) {
            const text = await testimonials.nth(i).textContent();
            expect(text.length).toBeGreaterThan(50); // Substantial testimonials
        }
    });

    test('CTAs are action-oriented', async ({ page }) => {
        const ctas = page.locator('.cta-button, .bundle-cta');
        const count = await ctas.count();

        for (let i = 0; i < count; i++) {
            const text = await ctas.nth(i).textContent();
            const actionWords = ['Get', 'Start', 'Go', 'Choose', 'Contact', 'Compare'];
            const hasActionWord = actionWords.some(word => text.includes(word));
            expect(hasActionWord).toBe(true);
        }
    });
});
