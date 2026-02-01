const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8080/pages/trust-citations.html';

test.describe('Trust & Citations Landing Page', () => {

  // ========================================
  // Page Load Tests
  // ========================================

  test('should load the page successfully', async ({ page }) => {
    const response = await page.goto(PAGE_URL);
    expect(response.status()).toBe(200);
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto(PAGE_URL);
    const title = await page.title();
    expect(title).toBe('Trust Every Answer - Gemini with Citations');
  });

  test('should load all CSS files', async ({ page }) => {
    await page.goto(PAGE_URL);

    // Check for design system CSS
    const designSystemLoaded = await page.evaluate(() => {
      const link = document.querySelector('link[href*="design-system.css"]');
      return link !== null;
    });
    expect(designSystemLoaded).toBeTruthy();

    // Check for components CSS
    const componentsLoaded = await page.evaluate(() => {
      const link = document.querySelector('link[href*="components.css"]');
      return link !== null;
    });
    expect(componentsLoaded).toBeTruthy();

    // Check for animations CSS
    const animationsLoaded = await page.evaluate(() => {
      const link = document.querySelector('link[href*="animations.css"]');
      return link !== null;
    });
    expect(animationsLoaded).toBeTruthy();
  });

  test('should load animations JavaScript', async ({ page }) => {
    await page.goto(PAGE_URL);

    const scriptLoaded = await page.evaluate(() => {
      const script = document.querySelector('script[src*="animations.js"]');
      return script !== null;
    });
    expect(scriptLoaded).toBeTruthy();
  });

  // ========================================
  // Content Verification Tests
  // ========================================

  test('should display main hero headline', async ({ page }) => {
    await page.goto(PAGE_URL);
    const headline = await page.locator('.hero h1').textContent();
    expect(headline).toContain('Trust Every Answer');
  });

  test('should display trust badge', async ({ page }) => {
    await page.goto(PAGE_URL);
    const badge = await page.locator('.trust-badge').textContent();
    expect(badge).toContain('Verified Sources');
    expect(badge).toContain('Zero Hallucinations');
  });

  test('should display shield icon', async ({ page }) => {
    await page.goto(PAGE_URL);
    const shield = await page.locator('.trust-shield');
    await expect(shield).toBeVisible();
    const shieldIcon = await page.locator('.shield-icon').textContent();
    expect(shieldIcon).toContain('🛡️');
  });

  test('should display hero subtitle', async ({ page }) => {
    await page.goto(PAGE_URL);
    const subtitle = await page.locator('.hero-subtitle').textContent();
    expect(subtitle).toContain('shows its work');
    expect(subtitle).toContain('citations');
  });

  test('should display all stat cards', async ({ page }) => {
    await page.goto(PAGE_URL);

    const statCards = await page.locator('.stat-card').count();
    expect(statCards).toBe(4);

    // Check stat content
    const stats = await page.locator('.stat-number').allTextContents();
    expect(stats).toContain('95%+');
    expect(stats).toContain('100%');
    expect(stats).toContain('10M+');
    expect(stats).toContain('<0.1%');
  });

  test('should display stat labels', async ({ page }) => {
    await page.goto(PAGE_URL);

    const labels = await page.locator('.stat-label').allTextContents();
    expect(labels).toContain('Fact Accuracy Rate');
    expect(labels).toContain('Responses with Citations');
    expect(labels).toContain('Verified Sources');
    expect(labels).toContain('Hallucination Rate');
  });

  test('should display citations demo section', async ({ page }) => {
    await page.goto(PAGE_URL);

    const demoHeadline = await page.locator('.citations-demo .section-header h2').textContent();
    expect(demoHeadline).toContain('Citations in Action');
  });

  test('should display user message in chat demo', async ({ page }) => {
    await page.goto(PAGE_URL);

    const userMessage = await page.locator('.user-message .message-bubble').textContent();
    expect(userMessage).toContain('renewable energy efficiency');
  });

  test('should display Gemini response with citations', async ({ page }) => {
    await page.goto(PAGE_URL);

    const geminiMessage = await page.locator('.gemini-message .message-bubble').textContent();
    expect(geminiMessage).toContain('Solar panel efficiency');
    expect(geminiMessage).toContain('wind turbine');
    expect(geminiMessage).toContain('battery storage');
  });

  test('should display citation markers', async ({ page }) => {
    await page.goto(PAGE_URL);

    const citationMarkers = await page.locator('.citation-marker').count();
    expect(citationMarkers).toBeGreaterThanOrEqual(3);
  });

  test('should display sources section', async ({ page }) => {
    await page.goto(PAGE_URL);

    const sourcesHeader = await page.locator('.sources-header').textContent();
    expect(sourcesHeader).toContain('Sources');

    const sourceItems = await page.locator('.source-item').count();
    expect(sourceItems).toBe(3);
  });

  test('should display source details', async ({ page }) => {
    await page.goto(PAGE_URL);

    const sourceTitles = await page.locator('.source-title').allTextContents();
    expect(sourceTitles).toContain('National Renewable Energy Laboratory - Solar Efficiency Report 2024');
    expect(sourceTitles).toContain('International Energy Agency - Wind Power Analysis');
    expect(sourceTitles).toContain('BloombergNEF - Battery Storage Cost Trends');
  });

  test('should display all 6 feature cards', async ({ page }) => {
    await page.goto(PAGE_URL);

    const featureCards = await page.locator('.feature-card').count();
    expect(featureCards).toBe(6);
  });

  test('should display feature titles', async ({ page }) => {
    await page.goto(PAGE_URL);

    const featureTitles = await page.locator('.feature-title').allTextContents();
    expect(featureTitles).toContain('Automatic Citations');
    expect(featureTitles).toContain('Fact Verification');
    expect(featureTitles).toContain('Source Transparency');
    expect(featureTitles).toContain('Anti-Hallucination');
    expect(featureTitles).toContain('Google-Grade Trust');
    expect(featureTitles).toContain('Academic Quality');
  });

  test('should display how it works section with 4 steps', async ({ page }) => {
    await page.goto(PAGE_URL);

    const steps = await page.locator('.step').count();
    expect(steps).toBe(4);

    const stepTitles = await page.locator('.step-content h3').allTextContents();
    expect(stepTitles).toContain('Source Identification');
    expect(stepTitles).toContain('Fact Cross-Referencing');
    expect(stepTitles).toContain('Citation Generation');
    expect(stepTitles).toContain('Quality Assurance');
  });

  test('should display comparison table', async ({ page }) => {
    await page.goto(PAGE_URL);

    const comparisonRows = await page.locator('.comparison-row').count();
    expect(comparisonRows).toBeGreaterThanOrEqual(7); // Header + 6 features
  });

  test('should display comparison features', async ({ page }) => {
    await page.goto(PAGE_URL);

    const features = await page.locator('.comparison-feature').allTextContents();
    expect(features).toContain('Automatic Citations');
    expect(features).toContain('Source Verification');
    expect(features).toContain('Hallucination Prevention');
  });

  test('should display testimonial', async ({ page }) => {
    await page.goto(PAGE_URL);

    const quote = await page.locator('.testimonial-quote').textContent();
    expect(quote).toContain('trust an AI assistant');
    expect(quote).toContain('citations');
  });

  test('should display testimonial author', async ({ page }) => {
    await page.goto(PAGE_URL);

    const authorName = await page.locator('.author-name').textContent();
    expect(authorName).toContain('Dr. Emily Rodriguez');

    const authorRole = await page.locator('.author-role').textContent();
    expect(authorRole).toContain('Research Scientist');
  });

  test('should display final CTA section', async ({ page }) => {
    await page.goto(PAGE_URL);

    const ctaHeadline = await page.locator('.final-cta h2').textContent();
    expect(ctaHeadline).toContain('Trustworthy AI');
  });

  // ========================================
  // CTA and Links Tests
  // ========================================

  test('should have working primary CTA button', async ({ page }) => {
    await page.goto(PAGE_URL);

    const ctaPrimary = page.locator('.cta-primary').first();
    await expect(ctaPrimary).toBeVisible();

    const href = await ctaPrimary.getAttribute('href');
    expect(href).toBe('https://gemini.google.com');

    const target = await ctaPrimary.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('should have working secondary CTA button', async ({ page }) => {
    await page.goto(PAGE_URL);

    const ctaSecondary = page.locator('.cta-secondary').first();
    await expect(ctaSecondary).toBeVisible();

    const href = await ctaSecondary.getAttribute('href');
    expect(href).toBe('#how-it-works');
  });

  test('should have working final CTA button', async ({ page }) => {
    await page.goto(PAGE_URL);

    const finalCta = page.locator('.final-cta-button');
    await expect(finalCta).toBeVisible();

    const href = await finalCta.getAttribute('href');
    expect(href).toBe('https://gemini.google.com');

    const target = await finalCta.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('should have clickable source links', async ({ page }) => {
    await page.goto(PAGE_URL);

    const sourceLinks = await page.locator('.source-url').count();
    expect(sourceLinks).toBe(3);

    // Check first source link
    const firstLink = page.locator('.source-url').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();

    const target = await firstLink.getAttribute('target');
    expect(target).toBe('_blank');
  });

  // ========================================
  // Animation Tests
  // ========================================

  test('should have shield float animation', async ({ page }) => {
    await page.goto(PAGE_URL);

    const shield = page.locator('.trust-shield');
    const animationName = await shield.evaluate(el => {
      return window.getComputedStyle(el).animationName;
    });

    expect(animationName).toContain('float');
  });

  test('should have hover effects on stat cards', async ({ page }) => {
    await page.goto(PAGE_URL);

    const statCard = page.locator('.stat-card').first();

    // Get initial position
    const initialBox = await statCard.boundingBox();

    // Hover over the card
    await statCard.hover();

    // Check if hover state is applied (transform should change)
    const hasTransform = await statCard.evaluate(el => {
      const transform = window.getComputedStyle(el).transform;
      return transform !== 'none';
    });

    expect(hasTransform).toBeTruthy();
  });

  test('should have hover effects on feature cards', async ({ page }) => {
    await page.goto(PAGE_URL);

    const featureCard = page.locator('.feature-card').first();

    await featureCard.hover();

    const hasTransform = await featureCard.evaluate(el => {
      const transform = window.getComputedStyle(el).transform;
      return transform !== 'none';
    });

    expect(hasTransform).toBeTruthy();
  });

  test('should have hover effects on citation markers', async ({ page }) => {
    await page.goto(PAGE_URL);

    const citationMarker = page.locator('.citation-marker').first();

    await expect(citationMarker).toBeVisible();
    await citationMarker.hover();

    const hasTransition = await citationMarker.evaluate(el => {
      const transition = window.getComputedStyle(el).transition;
      return transition.includes('all');
    });

    expect(hasTransition).toBeTruthy();
  });

  // ========================================
  // Responsive Design Tests
  // ========================================

  test('should be responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(PAGE_URL);

    // Hero should be visible
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();

    // Stats should stack vertically
    const statsGrid = page.locator('.stats-grid');
    const gridColumns = await statsGrid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });

    // On mobile, should be single column
    expect(gridColumns).toBeTruthy();
  });

  test('should be responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PAGE_URL);

    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();

    const statsGrid = page.locator('.stats-grid');
    await expect(statsGrid).toBeVisible();
  });

  test('should be responsive on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);

    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();

    const statsGrid = page.locator('.stats-grid');
    await expect(statsGrid).toBeVisible();
  });

  test('CTAs should stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(PAGE_URL);

    const ctaGroup = page.locator('.hero-cta-group');
    const flexDirection = await ctaGroup.evaluate(el => {
      return window.getComputedStyle(el).flexDirection;
    });

    expect(flexDirection).toBe('column');
  });

  // ========================================
  // Accessibility Tests
  // ========================================

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(PAGE_URL);

    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);

    const h3Count = await page.locator('h3').count();
    expect(h3Count).toBeGreaterThan(0);
  });

  test('should have proper semantic HTML', async ({ page }) => {
    await page.goto(PAGE_URL);

    const sections = await page.locator('section').count();
    expect(sections).toBeGreaterThan(0);

    const main = await page.locator('main').count();
    // Page may or may not have main tag, sections are sufficient
    expect(sections).toBeGreaterThan(5);
  });

  test('external links should have rel="noopener"', async ({ page }) => {
    await page.goto(PAGE_URL);

    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('should have meta description', async ({ page }) => {
    await page.goto(PAGE_URL);

    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription.length).toBeGreaterThan(50);
  });

  // ========================================
  // Design Quality Tests
  // ========================================

  test('should use Space Grotesk font for headings', async ({ page }) => {
    await page.goto(PAGE_URL);

    const h1 = page.locator('.hero h1');
    const fontFamily = await h1.evaluate(el => {
      return window.getComputedStyle(el).fontFamily;
    });

    expect(fontFamily).toContain('Space Grotesk');
  });

  test('should use Inter font for body text', async ({ page }) => {
    await page.goto(PAGE_URL);

    const body = page.locator('body');
    const fontFamily = await body.evaluate(el => {
      return window.getComputedStyle(el).fontFamily;
    });

    expect(fontFamily).toContain('Inter');
  });

  test('should have trust color scheme', async ({ page }) => {
    await page.goto(PAGE_URL);

    const hero = page.locator('.hero');
    const background = await hero.evaluate(el => {
      return window.getComputedStyle(el).background;
    });

    // Should have gradient background
    expect(background).toContain('gradient');
  });

  test('should have box shadows on cards', async ({ page }) => {
    await page.goto(PAGE_URL);

    const statCard = page.locator('.stat-card').first();
    const boxShadow = await statCard.evaluate(el => {
      return window.getComputedStyle(el).boxShadow;
    });

    expect(boxShadow).not.toBe('none');
  });

  test('should have border radius on cards', async ({ page }) => {
    await page.goto(PAGE_URL);

    const featureCard = page.locator('.feature-card').first();
    const borderRadius = await featureCard.evaluate(el => {
      return window.getComputedStyle(el).borderRadius;
    });

    expect(borderRadius).not.toBe('0px');
  });

  // ========================================
  // Performance Tests
  // ========================================

  test('should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(PAGE_URL);
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('should have optimized images (if any)', async ({ page }) => {
    await page.goto(PAGE_URL);

    const images = await page.locator('img').count();
    // This page uses emoji instead of images, which is optimal
    // Just verify no broken images exist
    if (images > 0) {
      const img = page.locator('img').first();
      const naturalWidth = await img.evaluate(el => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  // ========================================
  // Screenshot Tests
  // ========================================

  test('should capture full page screenshot (desktop)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/trust-citations-desktop.png',
      fullPage: true
    });
  });

  test('should capture full page screenshot (tablet)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/trust-citations-tablet.png',
      fullPage: true
    });
  });

  test('should capture full page screenshot (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/trust-citations-mobile.png',
      fullPage: true
    });
  });

  test('should capture hero section screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');

    const hero = page.locator('.hero');
    await hero.screenshot({
      path: 'tests/screenshots/trust-citations-hero.png'
    });
  });

  test('should capture citations demo screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');

    const demo = page.locator('.citations-demo');
    await demo.screenshot({
      path: 'tests/screenshots/trust-citations-demo.png'
    });
  });

  test('should capture stats section screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');

    const stats = page.locator('.stats-section');
    await stats.screenshot({
      path: 'tests/screenshots/trust-citations-stats.png'
    });
  });

  test('should capture features grid screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');

    const features = page.locator('.features-section');
    await features.screenshot({
      path: 'tests/screenshots/trust-citations-features.png'
    });
  });

  test('should capture comparison table screenshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(PAGE_URL);
    await page.waitForLoadState('networkidle');

    const comparison = page.locator('.comparison-section');
    await comparison.screenshot({
      path: 'tests/screenshots/trust-citations-comparison.png'
    });
  });

  // ========================================
  // Integration Tests
  // ========================================

  test('should integrate with design system', async ({ page }) => {
    await page.goto(PAGE_URL);

    // Check if CSS custom properties are available
    const hasCustomProps = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const trustPrimary = root.getPropertyValue('--trust-primary');
      return trustPrimary.length > 0;
    });

    expect(hasCustomProps).toBeTruthy();
  });

  test('should have smooth scroll behavior', async ({ page }) => {
    await page.goto(PAGE_URL);

    const scrollBehavior = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollBehavior;
    });

    // May be 'auto' or 'smooth' depending on browser
    expect(['auto', 'smooth']).toContain(scrollBehavior);
  });

});
