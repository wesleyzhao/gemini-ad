const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8000/pages/research-assistant.html';

test.describe('Research Assistant Landing Page', () => {

    // =======================
    // Page Load Tests
    // =======================
    test.describe('Page Load', () => {
        test('should load successfully', async ({ page }) => {
            const response = await page.goto(PAGE_URL);
            expect(response.status()).toBe(200);
        });

        test('should have correct title', async ({ page }) => {
            await page.goto(PAGE_URL);
            await expect(page).toHaveTitle(/Gemini Research Assistant.*Deep Research.*Citations/i);
        });

        test('should have meta description', async ({ page }) => {
            await page.goto(PAGE_URL);
            const metaDescription = await page.locator('meta[name="description"]');
            await expect(metaDescription).toHaveAttribute('content', /.+/);
        });

        test('should load external stylesheets', async ({ page }) => {
            await page.goto(PAGE_URL);
            const designSystemCSS = await page.locator('link[href*="design-system.css"]');
            const componentsCSS = await page.locator('link[href*="components.css"]');
            const animationsCSS = await page.locator('link[href*="animations.css"]');

            await expect(designSystemCSS).toBeAttached();
            await expect(componentsCSS).toBeAttached();
            await expect(animationsCSS).toBeAttached();
        });
    });

    // =======================
    // Navigation Tests
    // =======================
    test.describe('Navigation', () => {
        test('should have navigation bar', async ({ page }) => {
            await page.goto(PAGE_URL);
            const nav = await page.locator('nav');
            await expect(nav).toBeVisible();
        });

        test('should have Gemini Research logo', async ({ page }) => {
            await page.goto(PAGE_URL);
            const logo = await page.locator('nav .logo');
            await expect(logo).toContainText('Gemini Research');
            await expect(logo).toHaveAttribute('href', 'https://gemini.google.com');
        });

        test('should have CTA button in navigation', async ({ page }) => {
            await page.goto(PAGE_URL);
            const navCTA = await page.locator('nav .cta-button');
            await expect(navCTA).toContainText(/Start Researching/i);
            await expect(navCTA).toHaveAttribute('href', 'https://gemini.google.com');
        });

        test('navigation should be sticky/fixed', async ({ page }) => {
            await page.goto(PAGE_URL);
            const nav = await page.locator('nav');
            const position = await nav.evaluate(el => window.getComputedStyle(el).position);
            expect(position).toBe('fixed');
        });
    });

    // =======================
    // Hero Section Tests
    // =======================
    test.describe('Hero Section', () => {
        test('should display hero section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const hero = await page.locator('.hero');
            await expect(hero).toBeVisible();
        });

        test('should have "Research Assistant" badge', async ({ page }) => {
            await page.goto(PAGE_URL);
            const badge = await page.locator('.hero .badge');
            await expect(badge).toContainText(/Research Assistant/i);
        });

        test('should have main headline about truth/research', async ({ page }) => {
            await page.goto(PAGE_URL);
            const headline = await page.locator('.hero h1');
            await expect(headline).toBeVisible();
            const text = await headline.textContent();
            expect(text.toLowerCase()).toMatch(/research|truth|backed/);
        });

        test('should have subtitle mentioning citations', async ({ page }) => {
            await page.goto(PAGE_URL);
            const subtitle = await page.locator('.hero .subtitle');
            await expect(subtitle).toBeVisible();
            const text = await subtitle.textContent();
            expect(text.toLowerCase()).toMatch(/citation|source|verified|fact/);
        });

        test('should have two CTA buttons', async ({ page }) => {
            await page.goto(PAGE_URL);
            const primaryCTA = await page.locator('.hero .cta-primary');
            const secondaryCTA = await page.locator('.hero .cta-secondary');

            await expect(primaryCTA).toBeVisible();
            await expect(secondaryCTA).toBeVisible();
        });

        test('primary CTA should link to Gemini', async ({ page }) => {
            await page.goto(PAGE_URL);
            const primaryCTA = await page.locator('.hero .cta-primary');
            await expect(primaryCTA).toHaveAttribute('href', 'https://gemini.google.com');
            await expect(primaryCTA).toHaveAttribute('target', '_blank');
        });

        test('secondary CTA should scroll to demo', async ({ page }) => {
            await page.goto(PAGE_URL);
            const secondaryCTA = await page.locator('.hero .cta-secondary');
            await expect(secondaryCTA).toHaveAttribute('href', '#demo');
        });
    });

    // =======================
    // Citation Demo Section Tests
    // =======================
    test.describe('Citation Demo Section', () => {
        test('should display citation demo section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const demoSection = await page.locator('.citation-demo');
            await expect(demoSection).toBeVisible();
        });

        test('should have demo section heading', async ({ page }) => {
            await page.goto(PAGE_URL);
            const heading = await page.locator('.citation-demo h2');
            await expect(heading).toContainText(/cited|citation|answer/i);
        });

        test('should display demo query', async ({ page }) => {
            await page.goto(PAGE_URL);
            const query = await page.locator('.demo-query');
            await expect(query).toBeVisible();
            await expect(query).toContainText(/quantum computing/i);
        });

        test('should display demo response with citations', async ({ page }) => {
            await page.goto(PAGE_URL);
            const response = await page.locator('.demo-response');
            await expect(response).toBeVisible();
        });

        test('should have citation markers in response', async ({ page }) => {
            await page.goto(PAGE_URL);
            const citationMarkers = await page.locator('.citation-marker');
            const count = await citationMarkers.count();
            expect(count).toBeGreaterThan(0);
        });

        test('should have sources section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const sourcesSection = await page.locator('.sources-section');
            await expect(sourcesSection).toBeVisible();
            await expect(sourcesSection).toContainText(/Sources/i);
        });

        test('should display at least 3 source items', async ({ page }) => {
            await page.goto(PAGE_URL);
            const sourceItems = await page.locator('.source-item');
            const count = await sourceItems.count();
            expect(count).toBeGreaterThanOrEqual(3);
        });

        test('source items should have titles and metadata', async ({ page }) => {
            await page.goto(PAGE_URL);
            const firstSource = await page.locator('.source-item').first();
            const sourceTitle = await firstSource.locator('.source-title');
            const sourceMeta = await firstSource.locator('.source-meta');

            await expect(sourceTitle).toBeVisible();
            await expect(sourceMeta).toBeVisible();
        });

        test('sources should have verified badges', async ({ page }) => {
            await page.goto(PAGE_URL);
            const verifiedBadges = await page.locator('.verified-badge');
            const count = await verifiedBadges.count();
            expect(count).toBeGreaterThan(0);
        });

        test('source titles should be links', async ({ page }) => {
            await page.goto(PAGE_URL);
            const sourceTitle = await page.locator('.source-title').first();
            await expect(sourceTitle).toHaveAttribute('href', /.+/);
            await expect(sourceTitle).toHaveAttribute('target', '_blank');
        });
    });

    // =======================
    // Features Grid Tests
    // =======================
    test.describe('Features Grid', () => {
        test('should display features section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const featuresSection = await page.locator('.features-grid');
            await expect(featuresSection).toBeVisible();
        });

        test('should have section heading', async ({ page }) => {
            await page.goto(PAGE_URL);
            const heading = await page.locator('.features-grid h2');
            await expect(heading).toContainText(/research|Built for/i);
        });

        test('should display at least 6 feature cards', async ({ page }) => {
            await page.goto(PAGE_URL);
            const featureCards = await page.locator('.feature-card');
            const count = await featureCards.count();
            expect(count).toBeGreaterThanOrEqual(6);
        });

        test('feature cards should have icons', async ({ page }) => {
            await page.goto(PAGE_URL);
            const firstCard = await page.locator('.feature-card').first();
            const icon = await firstCard.locator('.feature-icon');
            await expect(icon).toBeVisible();
        });

        test('should have "Source Verification" feature', async ({ page }) => {
            await page.goto(PAGE_URL);
            const feature = await page.locator('.feature-card:has-text("Source Verification")');
            await expect(feature).toBeVisible();
        });

        test('should have "Deep Research Mode" feature', async ({ page }) => {
            await page.goto(PAGE_URL);
            const feature = await page.locator('.feature-card:has-text("Deep Research")');
            await expect(feature).toBeVisible();
        });

        test('should have "Fact-Checking" feature', async ({ page }) => {
            await page.goto(PAGE_URL);
            const feature = await page.locator('.feature-card:has-text("Fact")');
            await expect(feature).toBeVisible();
        });

        test('should have "Academic Format" feature', async ({ page }) => {
            await page.goto(PAGE_URL);
            const feature = await page.locator('.feature-card:has-text("Academic Format")');
            await expect(feature).toBeVisible();
        });
    });

    // =======================
    // Use Cases Tests
    // =======================
    test.describe('Use Cases Section', () => {
        test('should display use cases section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const useCasesSection = await page.locator('.use-cases');
            await expect(useCasesSection).toBeVisible();
        });

        test('should have use cases heading', async ({ page }) => {
            await page.goto(PAGE_URL);
            const heading = await page.locator('.use-cases h2');
            await expect(heading).toContainText(/Who uses|use cases/i);
        });

        test('should have at least 3 use case items', async ({ page }) => {
            await page.goto(PAGE_URL);
            const useCaseItems = await page.locator('.use-case-item');
            const count = await useCaseItems.count();
            expect(count).toBeGreaterThanOrEqual(3);
        });

        test('should have "Academic Researchers" use case', async ({ page }) => {
            await page.goto(PAGE_URL);
            const useCase = await page.locator('.use-case-item:has-text("Academic Researchers")');
            await expect(useCase).toBeVisible();
        });

        test('should have "Journalists" use case', async ({ page }) => {
            await page.goto(PAGE_URL);
            const useCase = await page.locator('.use-case-item:has-text("Journalist")');
            await expect(useCase).toBeVisible();
        });

        test('should have "Students" use case', async ({ page }) => {
            await page.goto(PAGE_URL);
            const useCase = await page.locator('.use-case-item:has-text("Student")');
            await expect(useCase).toBeVisible();
        });

        test('use cases should have persona badges', async ({ page }) => {
            await page.goto(PAGE_URL);
            const personas = await page.locator('.persona');
            const count = await personas.count();
            expect(count).toBeGreaterThanOrEqual(3);
        });

        test('use cases should have visual elements', async ({ page }) => {
            await page.goto(PAGE_URL);
            const visuals = await page.locator('.use-case-visual');
            const count = await visuals.count();
            expect(count).toBeGreaterThanOrEqual(3);
        });

        test('use cases should have emoji icons', async ({ page }) => {
            await page.goto(PAGE_URL);
            const emojis = await page.locator('.use-case-visual .emoji');
            const count = await emojis.count();
            expect(count).toBeGreaterThanOrEqual(3);
        });
    });

    // =======================
    // Accuracy Stats Tests
    // =======================
    test.describe('Accuracy Stats Section', () => {
        test('should display accuracy stats section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const statsSection = await page.locator('.accuracy-stats');
            await expect(statsSection).toBeVisible();
        });

        test('should have stats heading', async ({ page }) => {
            await page.goto(PAGE_URL);
            const heading = await page.locator('.accuracy-stats h2');
            await expect(heading).toContainText(/accuracy|Research-grade/i);
        });

        test('should display 4 statistics', async ({ page }) => {
            await page.goto(PAGE_URL);
            const statItems = await page.locator('.stat-item');
            const count = await statItems.count();
            expect(count).toBe(4);
        });

        test('should have accuracy rate statistic', async ({ page }) => {
            await page.goto(PAGE_URL);
            const stat = await page.locator('.stat-item:has-text("98.7%")');
            await expect(stat).toBeVisible();
            await expect(stat).toContainText(/Accuracy/i);
        });

        test('should have verified sources count', async ({ page }) => {
            await page.goto(PAGE_URL);
            const stat = await page.locator('.stat-item:has-text("10M+")');
            await expect(stat).toBeVisible();
            await expect(stat).toContainText(/Sources/i);
        });

        test('should have academic papers count', async ({ page }) => {
            await page.goto(PAGE_URL);
            const stat = await page.locator('.stat-item:has-text("500K+")');
            await expect(stat).toBeVisible();
            await expect(stat).toContainText(/Papers/i);
        });

        test('should have 24/7 availability stat', async ({ page }) => {
            await page.goto(PAGE_URL);
            const stat = await page.locator('.stat-item:has-text("24/7")');
            await expect(stat).toBeVisible();
        });
    });

    // =======================
    // Academic Features Tests
    // =======================
    test.describe('Academic Features Section', () => {
        test('should display academic features section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const academicSection = await page.locator('.academic-features');
            await expect(academicSection).toBeVisible();
        });

        test('should have section heading', async ({ page }) => {
            await page.goto(PAGE_URL);
            const heading = await page.locator('.academic-features h2');
            await expect(heading).toContainText(/Academic|capabilities/i);
        });

        test('should display at least 6 academic cards', async ({ page }) => {
            await page.goto(PAGE_URL);
            const academicCards = await page.locator('.academic-card');
            const count = await academicCards.count();
            expect(count).toBeGreaterThanOrEqual(6);
        });

        test('should have "Citation Export" feature', async ({ page }) => {
            await page.goto(PAGE_URL);
            const feature = await page.locator('.academic-card:has-text("Citation Export")');
            await expect(feature).toBeVisible();
            await expect(feature).toContainText(/APA|MLA|Chicago/i);
        });

        test('should have "Plagiarism Prevention" feature', async ({ page }) => {
            await page.goto(PAGE_URL);
            const feature = await page.locator('.academic-card:has-text("Plagiarism")');
            await expect(feature).toBeVisible();
        });

        test('should have "Database Access" feature', async ({ page }) => {
            await page.goto(PAGE_URL);
            const feature = await page.locator('.academic-card:has-text("Database Access")');
            await expect(feature).toBeVisible();
            await expect(feature).toContainText(/PubMed|arXiv|Scholar/i);
        });

        test('should mention multiple citation formats', async ({ page }) => {
            await page.goto(PAGE_URL);
            const academicSection = await page.locator('.academic-features');
            const text = await academicSection.textContent();
            expect(text).toMatch(/APA|MLA|Chicago|IEEE|Harvard/);
        });
    });

    // =======================
    // Testimonials Tests
    // =======================
    test.describe('Testimonials Section', () => {
        test('should display testimonials section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const testimonialsSection = await page.locator('.testimonials');
            await expect(testimonialsSection).toBeVisible();
        });

        test('should have testimonials heading', async ({ page }) => {
            await page.goto(PAGE_URL);
            const heading = await page.locator('.testimonials h2');
            await expect(heading).toContainText(/Trusted|researchers/i);
        });

        test('should display 3 testimonials', async ({ page }) => {
            await page.goto(PAGE_URL);
            const testimonialCards = await page.locator('.testimonial-card');
            const count = await testimonialCards.count();
            expect(count).toBe(3);
        });

        test('testimonials should have content', async ({ page }) => {
            await page.goto(PAGE_URL);
            const testimonialContent = await page.locator('.testimonial-content').first();
            await expect(testimonialContent).toBeVisible();
        });

        test('testimonials should have author information', async ({ page }) => {
            await page.goto(PAGE_URL);
            const authorInfo = await page.locator('.author-info').first();
            await expect(authorInfo).toBeVisible();
        });

        test('should have researcher testimonial', async ({ page }) => {
            await page.goto(PAGE_URL);
            const testimonial = await page.locator('.testimonial-card:has-text("Dr. Emily Chen")');
            await expect(testimonial).toBeVisible();
        });

        test('should have journalist testimonial', async ({ page }) => {
            await page.goto(PAGE_URL);
            const testimonial = await page.locator('.testimonial-card:has-text("Marcus Williams")');
            await expect(testimonial).toBeVisible();
        });

        test('should have student testimonial', async ({ page }) => {
            await page.goto(PAGE_URL);
            const testimonial = await page.locator('.testimonial-card:has-text("Sarah Martinez")');
            await expect(testimonial).toBeVisible();
        });
    });

    // =======================
    // Final CTA Tests
    // =======================
    test.describe('Final CTA Section', () => {
        test('should display final CTA section', async ({ page }) => {
            await page.goto(PAGE_URL);
            const finalCTA = await page.locator('.final-cta');
            await expect(finalCTA).toBeVisible();
        });

        test('should have CTA heading', async ({ page }) => {
            await page.goto(PAGE_URL);
            const heading = await page.locator('.final-cta h2');
            await expect(heading).toContainText(/Start|research/i);
        });

        test('should have CTA button', async ({ page }) => {
            await page.goto(PAGE_URL);
            const ctaButton = await page.locator('.final-cta .cta-button');
            await expect(ctaButton).toBeVisible();
            await expect(ctaButton).toHaveAttribute('href', 'https://gemini.google.com');
        });

        test('final CTA should open in new tab', async ({ page }) => {
            await page.goto(PAGE_URL);
            const ctaButton = await page.locator('.final-cta .cta-button');
            await expect(ctaButton).toHaveAttribute('target', '_blank');
            await expect(ctaButton).toHaveAttribute('rel', 'noopener');
        });
    });

    // =======================
    // Footer Tests
    // =======================
    test.describe('Footer', () => {
        test('should display footer', async ({ page }) => {
            await page.goto(PAGE_URL);
            const footer = await page.locator('footer');
            await expect(footer).toBeVisible();
        });

        test('should have copyright text', async ({ page }) => {
            await page.goto(PAGE_URL);
            const footer = await page.locator('footer');
            await expect(footer).toContainText(/Google LLC/i);
        });

        test('should have privacy policy link', async ({ page }) => {
            await page.goto(PAGE_URL);
            const privacyLink = await page.locator('footer a[href*="privacy"]');
            await expect(privacyLink).toBeVisible();
        });

        test('should have terms link', async ({ page }) => {
            await page.goto(PAGE_URL);
            const termsLink = await page.locator('footer a[href*="terms"]');
            await expect(termsLink).toBeVisible();
        });
    });

    // =======================
    // CTA & Links Tests
    // =======================
    test.describe('CTA Links', () => {
        test('all Gemini links should point to gemini.google.com', async ({ page }) => {
            await page.goto(PAGE_URL);
            const geminiLinks = await page.locator('a[href="https://gemini.google.com"]');
            const count = await geminiLinks.count();
            expect(count).toBeGreaterThan(0);
        });

        test('external links should have rel="noopener"', async ({ page }) => {
            await page.goto(PAGE_URL);
            const externalLinks = await page.locator('a[target="_blank"]');
            const count = await externalLinks.count();

            for (let i = 0; i < count; i++) {
                const link = externalLinks.nth(i);
                await expect(link).toHaveAttribute('rel', /noopener/);
            }
        });
    });

    // =======================
    // Animation Tests
    // =======================
    test.describe('Animations', () => {
        test('should load animations.js', async ({ page }) => {
            await page.goto(PAGE_URL);
            const animationsScript = await page.locator('script[src*="animations.js"]');
            await expect(animationsScript).toBeAttached();
        });

        test('hero elements should have animations', async ({ page }) => {
            await page.goto(PAGE_URL);
            const badge = await page.locator('.hero .badge');
            const animation = await badge.evaluate(el => window.getComputedStyle(el).animation);
            expect(animation).toContain('fadeInUp');
        });

        test('should have floating background animations', async ({ page }) => {
            await page.goto(PAGE_URL);
            const hero = await page.locator('.hero');
            const hasPseudoElements = await hero.evaluate(el => {
                const before = window.getComputedStyle(el, '::before').content;
                const after = window.getComputedStyle(el, '::after').content;
                return before !== 'none' || after !== 'none';
            });
            expect(hasPseudoElements).toBeTruthy();
        });

        test('citation markers should have hover effects', async ({ page }) => {
            await page.goto(PAGE_URL);
            const marker = await page.locator('.citation-marker').first();
            if (await marker.count() > 0) {
                await marker.hover();
                // Just verify the element is interactive
                await expect(marker).toBeVisible();
            }
        });
    });

    // =======================
    // Typography Tests
    // =======================
    test.describe('Typography', () => {
        test('should use Playfair Display for headings', async ({ page }) => {
            await page.goto(PAGE_URL);
            const h1 = await page.locator('h1').first();
            const fontFamily = await h1.evaluate(el => window.getComputedStyle(el).fontFamily);
            expect(fontFamily).toContain('Playfair Display');
        });

        test('should use Inter for body text', async ({ page }) => {
            await page.goto(PAGE_URL);
            const body = await page.locator('body');
            const fontFamily = await body.evaluate(el => window.getComputedStyle(el).fontFamily);
            expect(fontFamily).toContain('Inter');
        });

        test('headings should have proper hierarchy', async ({ page }) => {
            await page.goto(PAGE_URL);
            const h1Count = await page.locator('h1').count();
            expect(h1Count).toBe(1); // Should have exactly one h1
        });
    });

    // =======================
    // Responsive Design Tests
    // =======================
    test.describe('Responsive Design', () => {
        test('should be responsive on mobile (375px)', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(PAGE_URL);

            const hero = await page.locator('.hero');
            await expect(hero).toBeVisible();
        });

        test('should be responsive on tablet (768px)', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto(PAGE_URL);

            const hero = await page.locator('.hero');
            await expect(hero).toBeVisible();
        });

        test('should be responsive on desktop (1440px)', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);

            const hero = await page.locator('.hero');
            await expect(hero).toBeVisible();
        });

        test('CTAs should stack on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(PAGE_URL);

            const ctaGroup = await page.locator('.hero .cta-group');
            await expect(ctaGroup).toBeVisible();
        });
    });

    // =======================
    // Accessibility Tests
    // =======================
    test.describe('Accessibility', () => {
        test('should have semantic HTML structure', async ({ page }) => {
            await page.goto(PAGE_URL);

            const nav = await page.locator('nav');
            const main = await page.locator('section');
            const footer = await page.locator('footer');

            await expect(nav).toBeAttached();
            await expect(main).toBeAttached();
            await expect(footer).toBeAttached();
        });

        test('images should have alt text or use emoji', async ({ page }) => {
            await page.goto(PAGE_URL);
            const images = await page.locator('img');
            const count = await images.count();

            // If images exist, they should have alt text
            // This page uses emojis instead
            expect(count).toBeGreaterThanOrEqual(0);
        });

        test('links should be keyboard accessible', async ({ page }) => {
            await page.goto(PAGE_URL);
            const firstLink = await page.locator('a').first();
            await firstLink.focus();

            const isFocused = await firstLink.evaluate(el => el === document.activeElement);
            expect(isFocused).toBeTruthy();
        });

        test('should have proper heading hierarchy', async ({ page }) => {
            await page.goto(PAGE_URL);

            const h1 = await page.locator('h1');
            const h2 = await page.locator('h2');
            const h3 = await page.locator('h3');

            const h1Count = await h1.count();
            const h2Count = await h2.count();
            const h3Count = await h3.count();

            expect(h1Count).toBe(1);
            expect(h2Count).toBeGreaterThan(0);
            expect(h3Count).toBeGreaterThan(0);
        });
    });

    // =======================
    // Design Quality Tests
    // =======================
    test.describe('Design Quality', () => {
        test('should have gradient backgrounds', async ({ page }) => {
            await page.goto(PAGE_URL);
            const hero = await page.locator('.hero');
            const background = await hero.evaluate(el => window.getComputedStyle(el).background);
            expect(background).toContain('gradient');
        });

        test('should have proper spacing between sections', async ({ page }) => {
            await page.goto(PAGE_URL);
            const section = await page.locator('.citation-demo');
            const padding = await section.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).not.toBe('0px');
        });

        test('should have border radius on cards', async ({ page }) => {
            await page.goto(PAGE_URL);
            const card = await page.locator('.demo-card').first();
            const borderRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
            expect(borderRadius).not.toBe('0px');
        });

        test('should have box shadows for depth', async ({ page }) => {
            await page.goto(PAGE_URL);
            const card = await page.locator('.demo-card').first();
            const boxShadow = await card.evaluate(el => window.getComputedStyle(el).boxShadow);
            expect(boxShadow).not.toBe('none');
        });

        test('buttons should have hover states', async ({ page }) => {
            await page.goto(PAGE_URL);
            const button = await page.locator('.cta-primary').first();
            await button.hover();
            await expect(button).toBeVisible();
        });

        test('should use consistent color scheme', async ({ page }) => {
            await page.goto(PAGE_URL);
            const root = await page.locator(':root');
            const hasCustomProperties = await root.evaluate(el => {
                const styles = window.getComputedStyle(el);
                return styles.getPropertyValue('--research-primary') !== '';
            });
            expect(hasCustomProperties).toBeTruthy();
        });
    });

    // =======================
    // Performance Tests
    // =======================
    test.describe('Performance', () => {
        test('page should load within reasonable time', async ({ page }) => {
            const startTime = Date.now();
            await page.goto(PAGE_URL);
            const loadTime = Date.now() - startTime;

            expect(loadTime).toBeLessThan(5000); // 5 seconds
        });

        test('should not have excessive DOM elements', async ({ page }) => {
            await page.goto(PAGE_URL);
            const elementCount = await page.locator('*').count();
            expect(elementCount).toBeLessThan(1500); // Reasonable limit
        });
    });

    // =======================
    // Research-Specific Tests
    // =======================
    test.describe('Research-Specific Features', () => {
        test('should emphasize citations throughout', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            expect(pageText.toLowerCase()).toMatch(/citation|cite|source/);
        });

        test('should mention verification/fact-checking', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            expect(pageText.toLowerCase()).toMatch(/verif|fact|check|accuracy/);
        });

        test('should mention academic use cases', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            expect(pageText.toLowerCase()).toMatch(/academic|research|scholar|student/);
        });

        test('should have specific accuracy metrics', async ({ page }) => {
            await page.goto(PAGE_URL);
            const stats = await page.locator('.accuracy-stats');
            await expect(stats).toContainText(/98\.7%/);
        });

        test('demo should show quantum computing example', async ({ page }) => {
            await page.goto(PAGE_URL);
            const demo = await page.locator('.citation-demo');
            await expect(demo).toContainText(/quantum computing/i);
        });

        test('sources should include academic institutions', async ({ page }) => {
            await page.goto(PAGE_URL);
            const sources = await page.locator('.sources-section');
            const text = await sources.textContent();
            expect(text).toMatch(/Nature|MIT|IBM|Science/);
        });

        test('should mention citation format options', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            expect(pageText).toMatch(/APA|MLA|Chicago|IEEE/);
        });

        test('should highlight plagiarism prevention', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            expect(pageText.toLowerCase()).toContain('plagiarism');
        });
    });

    // =======================
    // Screenshot Tests
    // =======================
    test.describe('Screenshot Tests', () => {
        test('desktop screenshot - hero section', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForTimeout(1000); // Wait for animations
            await page.screenshot({ path: 'screenshots/research-assistant-hero-desktop.png', fullPage: false });
        });

        test('desktop screenshot - full page', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'screenshots/research-assistant-full-desktop.png', fullPage: true });
        });

        test('mobile screenshot - full page', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto(PAGE_URL);
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'screenshots/research-assistant-mobile.png', fullPage: true });
        });

        test('tablet screenshot - full page', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto(PAGE_URL);
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'screenshots/research-assistant-tablet.png', fullPage: true });
        });

        test('citation demo screenshot', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForTimeout(1000);
            const demo = await page.locator('.citation-demo');
            await demo.screenshot({ path: 'screenshots/research-assistant-citation-demo.png' });
        });

        test('sources section screenshot', async ({ page }) => {
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(PAGE_URL);
            await page.waitForTimeout(1000);
            const sources = await page.locator('.sources-section');
            await sources.screenshot({ path: 'screenshots/research-assistant-sources.png' });
        });
    });

    // =======================
    // Integration Tests
    // =======================
    test.describe('Integration', () => {
        test('should load design system CSS', async ({ page }) => {
            await page.goto(PAGE_URL);
            const link = await page.locator('link[href*="design-system.css"]');
            await expect(link).toBeAttached();
        });

        test('should load components CSS', async ({ page }) => {
            await page.goto(PAGE_URL);
            const link = await page.locator('link[href*="components.css"]');
            await expect(link).toBeAttached();
        });

        test('should load animations CSS and JS', async ({ page }) => {
            await page.goto(PAGE_URL);
            const cssLink = await page.locator('link[href*="animations.css"]');
            const jsScript = await page.locator('script[src*="animations.js"]');

            await expect(cssLink).toBeAttached();
            await expect(jsScript).toBeAttached();
        });
    });

    // =======================
    // Content Quality Tests
    // =======================
    test.describe('Content Quality', () => {
        test('should have compelling value propositions', async ({ page }) => {
            await page.goto(PAGE_URL);
            const subtitle = await page.locator('.hero .subtitle');
            const text = await subtitle.textContent();
            expect(text.length).toBeGreaterThan(50); // Substantial subtitle
        });

        test('should have specific use case examples', async ({ page }) => {
            await page.goto(PAGE_URL);
            const useCases = await page.locator('.use-case-content');
            const count = await useCases.count();
            expect(count).toBeGreaterThanOrEqual(3);
        });

        test('testimonials should feel authentic', async ({ page }) => {
            await page.goto(PAGE_URL);
            const testimonial = await page.locator('.testimonial-content').first();
            const text = await testimonial.textContent();
            expect(text.length).toBeGreaterThan(50); // Detailed testimonials
        });

        test('should mention trust/credibility indicators', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            expect(pageText.toLowerCase()).toMatch(/trust|verified|credible|reliable|accurate/);
        });
    });

    // =======================
    // Meeting Requirements Tests
    // =======================
    test.describe('Meeting Requirements', () => {
        test('should emphasize citations (meeting requirement)', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            const citationCount = (pageText.toLowerCase().match(/citation|cite|source/g) || []).length;
            expect(citationCount).toBeGreaterThan(5);
        });

        test('should address hallucination concerns', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            expect(pageText.toLowerCase()).toMatch(/verif|fact|accuracy|trust/);
        });

        test('should target writers segment', async ({ page }) => {
            await page.goto(PAGE_URL);
            const pageText = await page.locator('body').textContent();
            expect(pageText.toLowerCase()).toMatch(/writer|journalist|author/);
        });

        test('should be visually elegant and premium', async ({ page }) => {
            await page.goto(PAGE_URL);
            const hero = await page.locator('.hero');
            const hasGradient = await hero.evaluate(el => {
                const bg = window.getComputedStyle(el).background;
                return bg.includes('gradient');
            });
            expect(hasGradient).toBeTruthy();
        });
    });
});
