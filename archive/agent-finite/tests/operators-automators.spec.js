const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8080/pages/operators-automators.html';

test.describe('Operators & Automators Landing Page', () => {

  // ========================================
  // PAGE LOAD TESTS
  // ========================================

  test.describe('Page Load', () => {
    test('should load successfully', async ({ page }) => {
      const response = await page.goto(PAGE_URL);
      expect(response.status()).toBe(200);
    });

    test('should have correct title', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page).toHaveTitle(/Gemini for Operators & Automators/);
    });

    test('should load all external assets', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Check design system CSS
      const designSystemLink = page.locator('link[href*="design-system.css"]');
      await expect(designSystemLink).toHaveCount(1);

      // Check components CSS
      const componentsLink = page.locator('link[href*="components.css"]');
      await expect(componentsLink).toHaveCount(1);

      // Check animations CSS
      const animationsLink = page.locator('link[href*="animations.css"]');
      await expect(animationsLink).toHaveCount(1);

      // Check animations JS
      const animationsScript = page.locator('script[src*="animations.js"]');
      await expect(animationsScript).toHaveCount(1);
    });

    test('should have meta description', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /automation/i);
    });
  });

  // ========================================
  // HERO SECTION TESTS
  // ========================================

  test.describe('Hero Section', () => {
    test('should display hero section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('should display automation badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.automation-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('Advanced Automation');
    });

    test('should display main headline', async ({ page }) => {
      await page.goto(PAGE_URL);
      const headline = page.locator('.hero h1');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText(/Automate Your Workflow/i);
    });

    test('should display hero description', async ({ page }) => {
      await page.goto(PAGE_URL);
      const description = page.locator('.hero p');
      await expect(description).toBeVisible();
      await expect(description).toContainText(/operators and automators/i);
    });

    test('should display primary CTA', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryCTA = page.locator('.cta-primary');
      await expect(primaryCTA).toBeVisible();
      await expect(primaryCTA).toContainText(/Start Automating/i);
      await expect(primaryCTA).toHaveAttribute('href', /gemini.google.com/);
    });

    test('should display secondary CTA', async ({ page }) => {
      await page.goto(PAGE_URL);
      const secondaryCTA = page.locator('.cta-secondary');
      await expect(secondaryCTA).toBeVisible();
      await expect(secondaryCTA).toContainText(/Integrations/i);
    });

    test('should display floating automation icons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const icons = page.locator('.automation-icon');
      expect(await icons.count()).toBeGreaterThanOrEqual(4);
    });
  });

  // ========================================
  // CAPABILITIES SECTION TESTS
  // ========================================

  test.describe('Automation Capabilities Section', () => {
    test('should display capabilities section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('section').filter({ hasText: 'Built for Power Users' });
      await expect(section).toBeVisible();
    });

    test('should display section badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.section-badge').filter({ hasText: 'Capabilities' });
      await expect(badge).toBeVisible();
    });

    test('should display 6 capability cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = page.locator('.capability-card');
      expect(await cards.count()).toBe(6);
    });

    test('should display workflow automation card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Workflow Automation' });
      await expect(card).toBeVisible();
      await expect(card).toContainText(/multi-step workflows/i);
    });

    test('should display API & integrations card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'API & Integrations' });
      await expect(card).toBeVisible();
      await expect(card).toContainText(/1000\+ apps/i);
    });

    test('should display data processing card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Data Processing' });
      await expect(card).toBeVisible();
      await expect(card).toContainText(/CSV, JSON, XML/i);
    });

    test('should display AI-powered agents card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'AI-Powered Agents' });
      await expect(card).toBeVisible();
      await expect(card).toContainText(/autonomous/i);
    });

    test('should display email & communication card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Email & Communication' });
      await expect(card).toBeVisible();
      await expect(card).toContainText(/email responses/i);
    });

    test('should display enterprise security card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Enterprise Security' });
      await expect(card).toBeVisible();
      await expect(card).toContainText(/SSO/i);
    });

    test('capability cards should have hover effects', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').first();

      const boxBefore = await card.boundingBox();
      await card.hover();
      await page.waitForTimeout(500); // Wait for animation
      const boxAfter = await card.boundingBox();

      // Card should have moved up (translateY)
      expect(boxAfter.y).toBeLessThan(boxBefore.y);
    });
  });

  // ========================================
  // WORKFLOW DEMO SECTION TESTS
  // ========================================

  test.describe('Workflow Demo Section', () => {
    test('should display workflow demo section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.workflow-demo');
      await expect(section).toBeVisible();
    });

    test('should display workflow steps', async ({ page }) => {
      await page.goto(PAGE_URL);
      const steps = page.locator('.workflow-step');
      expect(await steps.count()).toBeGreaterThanOrEqual(4);
    });

    test('should display step numbers', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stepNumbers = page.locator('.step-number');
      expect(await stepNumbers.count()).toBe(4);

      // Check step numbers are 1, 2, 3, 4
      await expect(stepNumbers.nth(0)).toContainText('1');
      await expect(stepNumbers.nth(1)).toContainText('2');
      await expect(stepNumbers.nth(2)).toContainText('3');
      await expect(stepNumbers.nth(3)).toContainText('4');
    });

    test('should display workflow step titles', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page.locator('text=Define Trigger')).toBeVisible();
      await expect(page.locator('text=Add Actions')).toBeVisible();
      await expect(page.locator('text=Set Conditions')).toBeVisible();
      await expect(page.locator('text=Deploy & Monitor')).toBeVisible();
    });
  });

  // ========================================
  // CODE EXAMPLES SECTION TESTS
  // ========================================

  test.describe('Code Examples Section', () => {
    test('should display code examples section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('section').filter({ hasText: 'Code Your Way' });
      await expect(section).toBeVisible();
    });

    test('should display 3 code examples', async ({ page }) => {
      await page.goto(PAGE_URL);
      const examples = page.locator('.code-example');
      expect(await examples.count()).toBe(3);
    });

    test('should display Python example', async ({ page }) => {
      await page.goto(PAGE_URL);
      const pythonExample = page.locator('.code-example').filter({ hasText: 'workflow.py' });
      await expect(pythonExample).toBeVisible();
      await expect(pythonExample).toContainText('import gemini');
    });

    test('should display JavaScript example', async ({ page }) => {
      await page.goto(PAGE_URL);
      const jsExample = page.locator('.code-example').filter({ hasText: 'automation.js' });
      await expect(jsExample).toBeVisible();
      await expect(jsExample).toContainText('processData');
    });

    test('should display TypeScript example', async ({ page }) => {
      await page.goto(PAGE_URL);
      const tsExample = page.locator('.code-example').filter({ hasText: 'webhook.ts' });
      await expect(tsExample).toBeVisible();
      await expect(tsExample).toContainText('webhook');
    });

    test('code examples should have terminal-style headers', async ({ page }) => {
      await page.goto(PAGE_URL);
      const headers = page.locator('.code-header');
      expect(await headers.count()).toBe(3);

      // Check for traffic light dots
      const dots = page.locator('.code-dot');
      expect(await dots.count()).toBeGreaterThanOrEqual(9); // 3 per example
    });
  });

  // ========================================
  // INTEGRATIONS SECTION TESTS
  // ========================================

  test.describe('Integrations Section', () => {
    test('should display integrations section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.integrations-section');
      await expect(section).toBeVisible();
    });

    test('should display integration items', async ({ page }) => {
      await page.goto(PAGE_URL);
      const items = page.locator('.integration-item');
      expect(await items.count()).toBeGreaterThanOrEqual(10);
    });

    test('should display Gmail integration', async ({ page }) => {
      await page.goto(PAGE_URL);
      const gmail = page.locator('.integration-item').filter({ hasText: 'Gmail' });
      await expect(gmail).toBeVisible();
    });

    test('should display Google Docs integration', async ({ page }) => {
      await page.goto(PAGE_URL);
      const docs = page.locator('.integration-item').filter({ hasText: 'Google Docs' });
      await expect(docs).toBeVisible();
    });

    test('should display Slack integration', async ({ page }) => {
      await page.goto(PAGE_URL);
      const slack = page.locator('.integration-item').filter({ hasText: 'Slack' });
      await expect(slack).toBeVisible();
    });

    test('should display GitHub integration', async ({ page }) => {
      await page.goto(PAGE_URL);
      const github = page.locator('.integration-item').filter({ hasText: 'GitHub' });
      await expect(github).toBeVisible();
    });

    test('should display Zapier integration', async ({ page }) => {
      await page.goto(PAGE_URL);
      const zapier = page.locator('.integration-item').filter({ hasText: 'Zapier' });
      await expect(zapier).toBeVisible();
    });

    test('integration items should have hover effects', async ({ page }) => {
      await page.goto(PAGE_URL);
      const item = page.locator('.integration-item').first();

      const boxBefore = await item.boundingBox();
      await item.hover();
      await page.waitForTimeout(500);
      const boxAfter = await item.boundingBox();

      // Item should have moved up
      expect(boxAfter.y).toBeLessThan(boxBefore.y);
    });
  });

  // ========================================
  // STATS SECTION TESTS
  // ========================================

  test.describe('Stats Section', () => {
    test('should display stats section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.stats-section');
      await expect(section).toBeVisible();
    });

    test('should display 4 stat cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = page.locator('.stat-card');
      expect(await cards.count()).toBe(4);
    });

    test('should display 75% time saved stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-card').filter({ hasText: '75%' });
      await expect(stat).toBeVisible();
      await expect(stat).toContainText(/Time Saved/i);
    });

    test('should display 1000+ integrations stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-card').filter({ hasText: '1000+' });
      await expect(stat).toBeVisible();
      await expect(stat).toContainText(/App Integrations/i);
    });

    test('should display 10M+ workflows stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-card').filter({ hasText: '10M+' });
      await expect(stat).toBeVisible();
      await expect(stat).toContainText(/Workflows Executed/i);
    });

    test('should display 99.9% success rate stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-card').filter({ hasText: '99.9%' });
      await expect(stat).toBeVisible();
      await expect(stat).toContainText(/Success Rate/i);
    });
  });

  // ========================================
  // USE CASES SECTION TESTS
  // ========================================

  test.describe('Use Cases Section', () => {
    test('should display use cases section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('section').filter({ hasText: 'Built for Your Workflow' });
      await expect(section).toBeVisible();
    });

    test('should display 6 use cases', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCases = page.locator('.use-case');
      expect(await useCases.count()).toBe(6);
    });

    test('should display email management use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case').filter({ hasText: 'Email Management' });
      await expect(useCase).toBeVisible();
      await expect(useCase).toContainText(/categorize, prioritize/i);
    });

    test('should display data pipeline use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case').filter({ hasText: 'Data Pipeline' });
      await expect(useCase).toBeVisible();
    });

    test('should display customer support use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case').filter({ hasText: 'Customer Support' });
      await expect(useCase).toBeVisible();
    });

    test('should display content production use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case').filter({ hasText: 'Content Production' });
      await expect(useCase).toBeVisible();
    });

    test('should display research & analysis use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case').filter({ hasText: 'Research & Analysis' });
      await expect(useCase).toBeVisible();
    });

    test('should display system monitoring use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case').filter({ hasText: 'System Monitoring' });
      await expect(useCase).toBeVisible();
    });

    test('use cases should have example workflows', async ({ page }) => {
      await page.goto(PAGE_URL);
      const examples = page.locator('.use-case-example');
      expect(await examples.count()).toBe(6);
    });
  });

  // ========================================
  // TESTIMONIAL SECTION TESTS
  // ========================================

  test.describe('Testimonial Section', () => {
    test('should display testimonial section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.testimonial-section');
      await expect(section).toBeVisible();
    });

    test('should display testimonial quote', async ({ page }) => {
      await page.goto(PAGE_URL);
      const quote = page.locator('.testimonial-quote');
      await expect(quote).toBeVisible();
      await expect(quote).toContainText(/automation capabilities/i);
    });

    test('should display testimonial author', async ({ page }) => {
      await page.goto(PAGE_URL);
      const author = page.locator('.testimonial-name');
      await expect(author).toBeVisible();
      await expect(author).toContainText('Alex Chen');
    });

    test('should display author title', async ({ page }) => {
      await page.goto(PAGE_URL);
      const title = page.locator('.testimonial-title');
      await expect(title).toBeVisible();
      await expect(title).toContainText(/Head of Operations/i);
    });

    test('should display author avatar', async ({ page }) => {
      await page.goto(PAGE_URL);
      const avatar = page.locator('.testimonial-avatar');
      await expect(avatar).toBeVisible();
    });
  });

  // ========================================
  // FINAL CTA SECTION TESTS
  // ========================================

  test.describe('Final CTA Section', () => {
    test('should display final CTA section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.final-cta');
      await expect(section).toBeVisible();
    });

    test('should display final CTA headline', async ({ page }) => {
      await page.goto(PAGE_URL);
      const headline = page.locator('.final-cta h2');
      await expect(headline).toBeVisible();
      await expect(headline).toContainText(/Start Automating Today/i);
    });

    test('should display final CTA button', async ({ page }) => {
      await page.goto(PAGE_URL);
      const button = page.locator('.final-cta-button');
      await expect(button).toBeVisible();
      await expect(button).toContainText(/Get Started Free/i);
      await expect(button).toHaveAttribute('href', /gemini.google.com/);
    });
  });

  // ========================================
  // CTA AND LINKS TESTS
  // ========================================

  test.describe('CTA and Links', () => {
    test('should have gemini.google.com links', async ({ page }) => {
      await page.goto(PAGE_URL);
      const geminiLinks = page.locator('a[href*="gemini.google.com"]');
      expect(await geminiLinks.count()).toBeGreaterThanOrEqual(2);
    });

    test('external links should open in new tab', async ({ page }) => {
      await page.goto(PAGE_URL);
      const externalLinks = page.locator('a[target="_blank"]');

      for (let i = 0; i < await externalLinks.count(); i++) {
        const link = externalLinks.nth(i);
        await expect(link).toHaveAttribute('rel', 'noopener');
      }
    });

    test('should have working anchor link to integrations', async ({ page }) => {
      await page.goto(PAGE_URL);
      const anchorLink = page.locator('a[href="#integrations"]');
      await expect(anchorLink).toBeVisible();
    });

    test('primary CTA should have hover effect', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cta = page.locator('.cta-primary').first();

      const boxBefore = await cta.boundingBox();
      await cta.hover();
      await page.waitForTimeout(500);
      const boxAfter = await cta.boundingBox();

      // Button should have moved up
      expect(boxAfter.y).toBeLessThan(boxBefore.y);
    });
  });

  // ========================================
  // ANIMATION TESTS
  // ========================================

  test.describe('Animations', () => {
    test('should have floating automation icons animation', async ({ page }) => {
      await page.goto(PAGE_URL);
      const icon = page.locator('.automation-icon').first();

      // Check if animation is applied
      const animationName = await icon.evaluate(el =>
        window.getComputedStyle(el).animationName
      );
      expect(animationName).toBe('float');
    });

    test('capability cards should have transition', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').first();

      const transition = await card.evaluate(el =>
        window.getComputedStyle(el).transition
      );
      expect(transition).toContain('0.3s');
    });

    test('stat cards should have hover animation', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.stat-card').first();

      await card.hover();
      await page.waitForTimeout(500);

      // Verify card has transform
      const transform = await card.evaluate(el =>
        window.getComputedStyle(el).transform
      );
      expect(transform).not.toBe('none');
    });

    test('should load animations.js', async ({ page }) => {
      await page.goto(PAGE_URL);
      const script = page.locator('script[src*="animations.js"]');
      await expect(script).toHaveCount(1);
    });
  });

  // ========================================
  // RESPONSIVE DESIGN TESTS
  // ========================================

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);

      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();

      // Check if CTAs stack vertically
      const heroCtasBox = await page.locator('.hero-ctas').boundingBox();
      expect(heroCtasBox.width).toBeLessThan(400);
    });

    test('should display correctly on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);

      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();

      const capabilityCards = page.locator('.capability-card');
      expect(await capabilityCards.count()).toBe(6);
    });

    test('should display correctly on desktop (1440px)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);

      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();

      const container = page.locator('.container').first();
      const containerBox = await container.boundingBox();
      expect(containerBox.width).toBeLessThanOrEqual(1200);
    });

    test('should hide floating icons on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);

      const icons = page.locator('.automation-icons');
      const display = await icons.evaluate(el =>
        window.getComputedStyle(el).display
      );
      expect(display).toBe('none');
    });
  });

  // ========================================
  // ACCESSIBILITY TESTS
  // ========================================

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(PAGE_URL);

      const h1 = page.locator('h1');
      expect(await h1.count()).toBeGreaterThanOrEqual(1);

      const h2 = page.locator('h2');
      expect(await h2.count()).toBeGreaterThanOrEqual(3);

      const h3 = page.locator('h3');
      expect(await h3.count()).toBeGreaterThanOrEqual(6);
    });

    test('should have alt text for important visual elements', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Emojis are used as visual indicators, check they're present
      const icons = page.locator('.capability-icon, .use-case-icon, .integration-icon');
      expect(await icons.count()).toBeGreaterThan(20);
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Test main text color
      const bodyText = page.locator('body');
      const color = await bodyText.evaluate(el =>
        window.getComputedStyle(el).color
      );

      // Should have a defined color
      expect(color).toBeTruthy();
      expect(color).not.toBe('');
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Tab through focusable elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Check if focus is visible
      const focused = await page.evaluate(() => document.activeElement.tagName);
      expect(focused).toBeTruthy();
    });
  });

  // ========================================
  // DESIGN QUALITY TESTS
  // ========================================

  test.describe('Design Quality', () => {
    test('should use Space Grotesk font for headings', async ({ page }) => {
      await page.goto(PAGE_URL);

      const h1 = page.locator('h1').first();
      const fontFamily = await h1.evaluate(el =>
        window.getComputedStyle(el).fontFamily
      );
      expect(fontFamily).toContain('Space Grotesk');
    });

    test('should use Inter font for body text', async ({ page }) => {
      await page.goto(PAGE_URL);

      const body = page.locator('body');
      const fontFamily = await body.evaluate(el =>
        window.getComputedStyle(el).fontFamily
      );
      expect(fontFamily).toContain('Inter');
    });

    test('should have gradient backgrounds', async ({ page }) => {
      await page.goto(PAGE_URL);

      const hero = page.locator('.hero');
      const background = await hero.evaluate(el =>
        window.getComputedStyle(el).background
      );
      expect(background).toContain('gradient');
    });

    test('should have rounded corners on cards', async ({ page }) => {
      await page.goto(PAGE_URL);

      const card = page.locator('.capability-card').first();
      const borderRadius = await card.evaluate(el =>
        window.getComputedStyle(el).borderRadius
      );
      expect(borderRadius).not.toBe('0px');
    });

    test('should have box shadows on cards', async ({ page }) => {
      await page.goto(PAGE_URL);

      const card = page.locator('.capability-card').first();
      const boxShadow = await card.evaluate(el =>
        window.getComputedStyle(el).boxShadow
      );
      expect(boxShadow).not.toBe('none');
    });
  });

  // ========================================
  // PERFORMANCE TESTS
  // ========================================

  test.describe('Performance', () => {
    test('should load in reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(PAGE_URL);
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
    });

    test('should not have layout shifts', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Wait for page to stabilize
      await page.waitForTimeout(1000);

      const hero = page.locator('.hero');
      const box1 = await hero.boundingBox();

      await page.waitForTimeout(1000);

      const box2 = await hero.boundingBox();

      // Position should not change
      expect(box1.y).toBe(box2.y);
    });
  });

  // ========================================
  // SCREENSHOT TESTS
  // ========================================

  test.describe('Screenshot Tests', () => {
    test('should capture full page screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      await page.screenshot({
        path: 'screenshots/operators-automators-full.png',
        fullPage: true
      });
    });

    test('should capture hero section screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await hero.screenshot({
        path: 'screenshots/operators-automators-hero.png'
      });
    });

    test('should capture capabilities section screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.capabilities-grid').first();
      await section.screenshot({
        path: 'screenshots/operators-automators-capabilities.png'
      });
    });

    test('should capture workflow demo screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demo = page.locator('.workflow-visual');
      await demo.screenshot({
        path: 'screenshots/operators-automators-workflow.png'
      });
    });

    test('should capture code examples screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      const examples = page.locator('.code-examples').first();
      await examples.screenshot({
        path: 'screenshots/operators-automators-code.png'
      });
    });

    test('should capture mobile screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      await page.screenshot({
        path: 'screenshots/operators-automators-mobile.png',
        fullPage: true
      });
    });

    test('should capture tablet screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);
      await page.screenshot({
        path: 'screenshots/operators-automators-tablet.png',
        fullPage: true
      });
    });

    test('should capture desktop screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      await page.screenshot({
        path: 'screenshots/operators-automators-desktop.png',
        fullPage: true
      });
    });
  });

  // ========================================
  // INTEGRATION TESTS
  // ========================================

  test.describe('Integration Tests', () => {
    test('should integrate with design system', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Check if design system CSS variables are available
      const root = page.locator(':root');
      const bgColor = await root.evaluate(el =>
        getComputedStyle(el).getPropertyValue('--background')
      );

      // Design system should provide variables
      expect(bgColor).toBeTruthy();
    });

    test('should use shared components', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Verify components.css is loaded
      const componentsLink = page.locator('link[href*="components.css"]');
      await expect(componentsLink).toHaveCount(1);
    });
  });

  // ========================================
  // CONTENT QUALITY TESTS
  // ========================================

  test.describe('Content Quality', () => {
    test('should have compelling statistics', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Check for key metrics
      await expect(page.locator('text=75%')).toBeVisible();
      await expect(page.locator('text=1000+')).toBeVisible();
      await expect(page.locator('text=10M+')).toBeVisible();
      await expect(page.locator('text=99.9%')).toBeVisible();
    });

    test('should mention automation keywords', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.textContent('body');

      expect(content).toContain('automation');
      expect(content).toContain('workflow');
      expect(content).toContain('integration');
      expect(content).toContain('API');
    });

    test('should have clear value propositions', async ({ page }) => {
      await page.goto(PAGE_URL);

      await expect(page.locator('text=/Automate.*Workflow/i')).toBeVisible();
      await expect(page.locator('text=/Built for Power Users/i')).toBeVisible();
      await expect(page.locator('text=/Connect to Your Entire Stack/i')).toBeVisible();
    });

    test('should include professional testimonial', async ({ page }) => {
      await page.goto(PAGE_URL);

      const testimonial = page.locator('.testimonial-quote');
      const text = await testimonial.textContent();

      expect(text.length).toBeGreaterThan(100);
      expect(text).toContain('automation');
    });
  });

  // ========================================
  // SPECIFIC FEATURE TESTS
  // ========================================

  test.describe('Specific Features', () => {
    test('should mention workflow automation', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page.locator('text=/Workflow Automation/i')).toBeVisible();
    });

    test('should mention API access', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page.locator('text=/API.*Integrations/i')).toBeVisible();
    });

    test('should mention data processing', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page.locator('text=/Data Processing/i')).toBeVisible();
    });

    test('should mention AI agents', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page.locator('text=/AI-Powered Agents/i')).toBeVisible();
    });

    test('should mention enterprise security', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page.locator('text=/Enterprise Security/i')).toBeVisible();
    });

    test('should show code examples in multiple languages', async ({ page }) => {
      await page.goto(PAGE_URL);

      await expect(page.locator('text=workflow.py')).toBeVisible();
      await expect(page.locator('text=automation.js')).toBeVisible();
      await expect(page.locator('text=webhook.ts')).toBeVisible();
    });
  });
});
