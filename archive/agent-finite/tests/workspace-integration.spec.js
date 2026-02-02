const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8080/pages/workspace-integration.html';

test.describe('Workspace Integration Landing Page', () => {

  // Page Load Tests
  test.describe('Page Load', () => {
    test('should load the page successfully', async ({ page }) => {
      const response = await page.goto(PAGE_URL);
      expect(response.status()).toBe(200);
    });

    test('should have correct title', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page).toHaveTitle(/Gemini for Google Workspace/);
    });

    test('should load all external assets', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Check for design system CSS
      const designSystemLink = page.locator('link[href*="design-system.css"]');
      await expect(designSystemLink).toBeAttached();

      // Check for components CSS
      const componentsLink = page.locator('link[href*="components.css"]');
      await expect(componentsLink).toBeAttached();

      // Check for animations CSS
      const animationsLink = page.locator('link[href*="animations.css"]');
      await expect(animationsLink).toBeAttached();

      // Check for animations JS
      const animationsScript = page.locator('script[src*="animations.js"]');
      await expect(animationsScript).toBeAttached();
    });

    test('should load Google Fonts', async ({ page }) => {
      await page.goto(PAGE_URL);
      const googleFontsLink = page.locator('link[href*="fonts.googleapis.com"]');
      await expect(googleFontsLink).toBeAttached();
    });
  });

  // Content Tests
  test.describe('Hero Section Content', () => {
    test('should display hero title', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heroTitle = page.locator('.hero-title');
      await expect(heroTitle).toContainText('AI That Works Where You Do');
    });

    test('should display workspace badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.workspace-badge');
      await expect(badge).toContainText('Seamless Integration');
    });

    test('should display hero subtitle', async ({ page }) => {
      await page.goto(PAGE_URL);
      const subtitle = page.locator('.hero-subtitle');
      await expect(subtitle).toContainText('Gmail');
      await expect(subtitle).toContainText('Google Docs');
      await expect(subtitle).toContainText('Calendar');
      await expect(subtitle).toContainText('Drive');
    });

    test('should have floating app icons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const floatingApps = page.locator('.app-icon');
      const count = await floatingApps.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should display hero CTAs', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryCTA = page.locator('.cta-primary').first();
      const secondaryCTA = page.locator('.cta-secondary').first();

      await expect(primaryCTA).toBeVisible();
      await expect(secondaryCTA).toBeVisible();
      await expect(primaryCTA).toContainText(/Start Using Gemini|Get Started/i);
    });
  });

  test.describe('Apps Grid Section', () => {
    test('should display section title', async ({ page }) => {
      await page.goto(PAGE_URL);
      const sectionTitle = page.locator('.apps-section .section-title');
      await expect(sectionTitle).toContainText('Gemini in Every Google App');
    });

    test('should display all 6 app cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const appCards = page.locator('.app-card');
      const count = await appCards.count();
      expect(count).toBe(6);
    });

    test('should display Gmail card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const gmailCard = page.locator('.app-card.gmail');

      await expect(gmailCard).toBeVisible();
      await expect(gmailCard.locator('h3')).toContainText('Gmail');

      // Check for features
      const features = gmailCard.locator('.app-features li');
      const count = await features.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should display Google Docs card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const docsCard = page.locator('.app-card.docs');

      await expect(docsCard).toBeVisible();
      await expect(docsCard.locator('h3')).toContainText('Google Docs');

      const features = docsCard.locator('.app-features li');
      const count = await features.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should display Calendar card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const calendarCard = page.locator('.app-card.calendar');

      await expect(calendarCard).toBeVisible();
      await expect(calendarCard.locator('h3')).toContainText('Calendar');

      const features = calendarCard.locator('.app-features li');
      const count = await features.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should display Drive card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const driveCard = page.locator('.app-card.drive');

      await expect(driveCard).toBeVisible();
      await expect(driveCard.locator('h3')).toContainText('Drive');

      const features = driveCard.locator('.app-features li');
      const count = await features.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should display Sheets card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const sheetsCard = page.locator('.app-card.sheets');

      await expect(sheetsCard).toBeVisible();
      await expect(sheetsCard.locator('h3')).toContainText('Sheets');

      const features = sheetsCard.locator('.app-features li');
      const count = await features.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should display Slides card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const slidesCard = page.locator('.app-card.slides');

      await expect(slidesCard).toBeVisible();
      await expect(slidesCard.locator('h3')).toContainText('Slides');

      const features = slidesCard.locator('.app-features li');
      const count = await features.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should display app icons for each card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const appIcons = page.locator('.app-icon-large');
      const count = await appIcons.count();
      expect(count).toBe(6);
    });
  });

  test.describe('Integration Demo Section', () => {
    test('should display demo section title', async ({ page }) => {
      await page.goto(PAGE_URL);
      const sectionTitle = page.locator('.demo-section .section-title');
      await expect(sectionTitle).toContainText('See Integration in Action');
    });

    test('should display demo window with Gmail mockup', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demoWindow = page.locator('.demo-window');
      await expect(demoWindow).toBeVisible();
    });

    test('should display email items in demo', async ({ page }) => {
      await page.goto(PAGE_URL);
      const emailItems = page.locator('.email-item');
      const count = await emailItems.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('should display Gemini suggestion in demo', async ({ page }) => {
      await page.goto(PAGE_URL);
      const suggestion = page.locator('.gemini-suggestion');

      await expect(suggestion).toBeVisible();
      await expect(suggestion).toContainText('Gemini Suggestion');
      await expect(suggestion).toContainText('Action Items');
    });

    test('should display demo benefits', async ({ page }) => {
      await page.goto(PAGE_URL);
      const benefits = page.locator('.benefit-item');
      const count = await benefits.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('should mention 60% time savings', async ({ page }) => {
      await page.goto(PAGE_URL);
      const benefit = page.locator('.benefit-content:has-text("60%")');
      await expect(benefit).toBeVisible();
    });
  });

  test.describe('Stats Section', () => {
    test('should display stats section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const statsSection = page.locator('.stats-section');
      await expect(statsSection).toBeVisible();
    });

    test('should display 4 stat cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const statCards = page.locator('.stat-card');
      const count = await statCards.count();
      expect(count).toBe(4);
    });

    test('should display "4 Core Apps" stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-card:has-text("4")');
      await expect(stat).toContainText('Core Apps');
    });

    test('should display "60% Time Saved" stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-card:has-text("60%")');
      await expect(stat).toContainText('Time Saved');
    });

    test('should display "10M+ Active Users" stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-card:has-text("10M+")');
      await expect(stat).toContainText('Active Users');
    });

    test('should display "99.9% Uptime" stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-card:has-text("99.9%")');
      await expect(stat).toContainText('Uptime');
    });
  });

  test.describe('Use Cases Section', () => {
    test('should display use cases section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const usecasesSection = page.locator('.usecases-section');
      await expect(usecasesSection).toBeVisible();
    });

    test('should display 3 use case cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const usecaseCards = page.locator('.usecase-card');
      const count = await usecaseCards.count();
      expect(count).toBe(3);
    });

    test('should display "For Professionals" use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const usecase = page.locator('.usecase-card:has-text("For Professionals")');
      await expect(usecase).toBeVisible();
    });

    test('should display "For Teams" use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const usecase = page.locator('.usecase-card:has-text("For Teams")');
      await expect(usecase).toBeVisible();
    });

    test('should display "For Business Leaders" use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const usecase = page.locator('.usecase-card:has-text("For Business Leaders")');
      await expect(usecase).toBeVisible();
    });
  });

  test.describe('Workflow Section', () => {
    test('should display workflow section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const workflowSection = page.locator('.workflow-section');
      await expect(workflowSection).toBeVisible();
    });

    test('should display 4 workflow steps', async ({ page }) => {
      await page.goto(PAGE_URL);
      const steps = page.locator('.workflow-step');
      const count = await steps.count();
      expect(count).toBe(4);
    });

    test('should display step numbers 1-4', async ({ page }) => {
      await page.goto(PAGE_URL);

      for (let i = 1; i <= 4; i++) {
        const stepNumber = page.locator('.step-number').nth(i - 1);
        await expect(stepNumber).toContainText(i.toString());
      }
    });

    test('should display step 1: Enable Gemini', async ({ page }) => {
      await page.goto(PAGE_URL);
      const step = page.locator('.workflow-step:has-text("Enable Gemini")');
      await expect(step).toBeVisible();
    });

    test('should display step 2: Access AI Anywhere', async ({ page }) => {
      await page.goto(PAGE_URL);
      const step = page.locator('.workflow-step:has-text("Access AI Anywhere")');
      await expect(step).toBeVisible();
    });

    test('should display step 3: Ask for Help', async ({ page }) => {
      await page.goto(PAGE_URL);
      const step = page.locator('.workflow-step:has-text("Ask for Help")');
      await expect(step).toBeVisible();
    });

    test('should display step 4: Stay Productive', async ({ page }) => {
      await page.goto(PAGE_URL);
      const step = page.locator('.workflow-step:has-text("Stay Productive")');
      await expect(step).toBeVisible();
    });
  });

  test.describe('Testimonial Section', () => {
    test('should display testimonial section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonialSection = page.locator('.testimonial-section');
      await expect(testimonialSection).toBeVisible();
    });

    test('should display testimonial quote', async ({ page }) => {
      await page.goto(PAGE_URL);
      const quote = page.locator('.testimonial-quote');
      await expect(quote).toContainText('transformed');
      await expect(quote).toContainText('Google Workspace');
    });

    test('should display author information', async ({ page }) => {
      await page.goto(PAGE_URL);
      const authorName = page.locator('.author-info h4');
      const authorTitle = page.locator('.author-info p');

      await expect(authorName).toBeVisible();
      await expect(authorTitle).toBeVisible();
    });

    test('should display author avatar', async ({ page }) => {
      await page.goto(PAGE_URL);
      const avatar = page.locator('.author-avatar');
      await expect(avatar).toBeVisible();
    });
  });

  test.describe('Final CTA Section', () => {
    test('should display final CTA section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const finalCTA = page.locator('.final-cta-section');
      await expect(finalCTA).toBeVisible();
    });

    test('should display final CTA button', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ctaButton = page.locator('.cta-large');
      await expect(ctaButton).toBeVisible();
      await expect(ctaButton).toContainText(/Get Started|Start/i);
    });

    test('should have compelling final headline', async ({ page }) => {
      await page.goto(PAGE_URL);
      const headline = page.locator('.final-cta-content h2');
      await expect(headline).toContainText(/Experience|Join/i);
    });
  });

  // CTA and Links Tests
  test.describe('CTAs and External Links', () => {
    test('should have working primary CTA link', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryCTA = page.locator('.cta-primary').first();

      await expect(primaryCTA).toHaveAttribute('href', /gemini\.google\.com/);
      await expect(primaryCTA).toHaveAttribute('target', '_blank');
      await expect(primaryCTA).toHaveAttribute('rel', 'noopener');
    });

    test('should have working large CTA link', async ({ page }) => {
      await page.goto(PAGE_URL);
      const largeCTA = page.locator('.cta-large');

      await expect(largeCTA).toHaveAttribute('href', /gemini\.google\.com/);
      await expect(largeCTA).toHaveAttribute('target', '_blank');
      await expect(largeCTA).toHaveAttribute('rel', 'noopener');
    });

    test('should have working secondary anchor CTA', async ({ page }) => {
      await page.goto(PAGE_URL);
      const secondaryCTA = page.locator('.cta-secondary').first();

      await expect(secondaryCTA).toHaveAttribute('href', /#apps/);
    });

    test('should have multiple CTAs throughout the page', async ({ page }) => {
      await page.goto(PAGE_URL);
      const allCTAs = page.locator('.cta-primary, .cta-secondary, .cta-large');
      const count = await allCTAs.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });

  // Animation Tests
  test.describe('Animations and Interactions', () => {
    test('should have floating animation on app icons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const floatingIcon = page.locator('.app-icon').first();

      // Check if element has animation applied
      const animationName = await floatingIcon.evaluate(el =>
        getComputedStyle(el).animationName
      );
      expect(animationName).toContain('float');
    });

    test('should have hover effect on app cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const appCard = page.locator('.app-card').first();

      // Get initial transform
      const initialTransform = await appCard.evaluate(el =>
        getComputedStyle(el).transform
      );

      // Hover over card
      await appCard.hover();

      // Wait for transition
      await page.waitForTimeout(500);

      // Check that transform changed (should be translateY)
      const hoverTransform = await appCard.evaluate(el =>
        getComputedStyle(el).transform
      );

      // Transforms should be different (card should lift)
      expect(hoverTransform).not.toBe(initialTransform);
    });

    test('should have hover effect on workflow steps', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stepNumber = page.locator('.step-number').first();

      await expect(stepNumber).toBeVisible();
      await stepNumber.hover();

      // Should have gradient background
      const background = await stepNumber.evaluate(el =>
        getComputedStyle(el).background
      );
      expect(background).toBeTruthy();
    });

    test('should have smooth scroll behavior', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Click on anchor link
      const anchorLink = page.locator('a[href="#apps"]');
      await anchorLink.click();

      // Wait for scroll to complete
      await page.waitForTimeout(1000);

      // Check that we scrolled to the apps section
      const appsSection = page.locator('#apps');
      await expect(appsSection).toBeInViewport();
    });
  });

  // Responsive Design Tests
  test.describe('Responsive Design', () => {
    test('should be responsive on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);

      const heroTitle = page.locator('.hero-title');
      await expect(heroTitle).toBeVisible();

      const appCards = page.locator('.app-card');
      await expect(appCards.first()).toBeVisible();
    });

    test('should be responsive on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);

      const heroTitle = page.locator('.hero-title');
      await expect(heroTitle).toBeVisible();

      const appsGrid = page.locator('.apps-grid');
      await expect(appsGrid).toBeVisible();
    });

    test('should be responsive on desktop (1440px)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);

      const heroTitle = page.locator('.hero-title');
      await expect(heroTitle).toBeVisible();

      const demoGrid = page.locator('.demo-grid');
      await expect(demoGrid).toBeVisible();
    });

    test('should stack CTAs vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);

      const heroCTAs = page.locator('.hero-ctas');
      const flexDirection = await heroCTAs.evaluate(el =>
        getComputedStyle(el).flexDirection
      );

      // Should be column or wrap on mobile
      expect(['column', 'wrap'].some(dir => flexDirection.includes(dir))).toBeTruthy();
    });
  });

  // Accessibility Tests
  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(PAGE_URL);

      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      expect(h1Count).toBe(1); // Should have exactly one h1

      const h2 = page.locator('h2');
      const h2Count = await h2.count();
      expect(h2Count).toBeGreaterThan(0); // Should have h2 elements

      const h3 = page.locator('h3');
      const h3Count = await h3.count();
      expect(h3Count).toBeGreaterThan(0); // Should have h3 elements
    });

    test('should have semantic HTML5 sections', async ({ page }) => {
      await page.goto(PAGE_URL);

      const sections = page.locator('section');
      const count = await sections.count();
      expect(count).toBeGreaterThanOrEqual(7); // Multiple semantic sections
    });

    test('should have proper link attributes for security', async ({ page }) => {
      await page.goto(PAGE_URL);

      const externalLinks = page.locator('a[target="_blank"]');
      const count = await externalLinks.count();

      for (let i = 0; i < count; i++) {
        const link = externalLinks.nth(i);
        await expect(link).toHaveAttribute('rel', 'noopener');
      }
    });

    test('should have descriptive meta description', async ({ page }) => {
      await page.goto(PAGE_URL);

      const metaDescription = page.locator('meta[name="description"]');
      const content = await metaDescription.getAttribute('content');

      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(50);
    });
  });

  // Design Quality Tests
  test.describe('Design Quality', () => {
    test('should use Google Workspace colors', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Check if CSS variables are defined
      const gmailColor = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--workspace-gmail')
      );

      const docsColor = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--workspace-docs')
      );

      expect(gmailColor).toBeTruthy();
      expect(docsColor).toBeTruthy();
    });

    test('should use Space Grotesk font for headings', async ({ page }) => {
      await page.goto(PAGE_URL);

      const h1 = page.locator('h1').first();
      const fontFamily = await h1.evaluate(el =>
        getComputedStyle(el).fontFamily
      );

      expect(fontFamily).toContain('Space Grotesk');
    });

    test('should use Inter font for body text', async ({ page }) => {
      await page.goto(PAGE_URL);

      const body = page.locator('body');
      const fontFamily = await body.evaluate(el =>
        getComputedStyle(el).fontFamily
      );

      expect(fontFamily).toContain('Inter');
    });

    test('should have consistent border radius', async ({ page }) => {
      await page.goto(PAGE_URL);

      const appCard = page.locator('.app-card').first();
      const borderRadius = await appCard.evaluate(el =>
        getComputedStyle(el).borderRadius
      );

      // Should have border radius (Apple-style rounded corners)
      expect(borderRadius).not.toBe('0px');
    });

    test('should have box shadows for depth', async ({ page }) => {
      await page.goto(PAGE_URL);

      const appCard = page.locator('.app-card').first();
      const boxShadow = await appCard.evaluate(el =>
        getComputedStyle(el).boxShadow
      );

      expect(boxShadow).not.toBe('none');
    });
  });

  // Performance Tests
  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(PAGE_URL);
      const loadTime = Date.now() - startTime;

      // Should load in less than 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should have minimal DOM complexity', async ({ page }) => {
      await page.goto(PAGE_URL);

      const elementCount = await page.evaluate(() =>
        document.querySelectorAll('*').length
      );

      // Should have reasonable number of elements (not too complex)
      expect(elementCount).toBeLessThan(1000);
    });
  });

  // Screenshot Tests
  test.describe('Visual Regression', () => {
    test('should match desktop screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      await page.waitForLoadState('networkidle');

      // Take screenshot of full page
      await expect(page).toHaveScreenshot('workspace-integration-desktop.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match tablet screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('workspace-integration-tablet.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match mobile screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('workspace-integration-mobile.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match hero section screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      await page.waitForLoadState('networkidle');

      const heroSection = page.locator('.workspace-hero');
      await expect(heroSection).toHaveScreenshot('workspace-hero-section.png', {
        animations: 'disabled'
      });
    });

    test('should match apps grid screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      await page.waitForLoadState('networkidle');

      const appsSection = page.locator('.apps-section');
      await expect(appsSection).toHaveScreenshot('workspace-apps-grid.png', {
        animations: 'disabled'
      });
    });

    test('should match demo section screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      await page.waitForLoadState('networkidle');

      const demoSection = page.locator('.demo-section');
      await expect(demoSection).toHaveScreenshot('workspace-demo-section.png', {
        animations: 'disabled'
      });
    });

    test('should match stats section screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      await page.waitForLoadState('networkidle');

      const statsSection = page.locator('.stats-section');
      await expect(statsSection).toHaveScreenshot('workspace-stats-section.png', {
        animations: 'disabled'
      });
    });

    test('should match workflow section screenshot', async ({ page }) => {
      await page.goto(PAGE_URL);
      await page.waitForLoadState('networkidle');

      const workflowSection = page.locator('.workflow-section');
      await expect(workflowSection).toHaveScreenshot('workspace-workflow-section.png', {
        animations: 'disabled'
      });
    });
  });

  // Integration Tests
  test.describe('Integration with Design System', () => {
    test('should use design system CSS variables', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Check if root element has CSS variables
      const hasVariables = await page.evaluate(() => {
        const rootStyles = getComputedStyle(document.documentElement);
        return rootStyles.getPropertyValue('--workspace-gmail') !== '';
      });

      expect(hasVariables).toBeTruthy();
    });

    test('should load animations.js for scroll effects', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Check if animations script is loaded
      const scriptLoaded = await page.evaluate(() => {
        const scripts = Array.from(document.querySelectorAll('script'));
        return scripts.some(script => script.src.includes('animations.js'));
      });

      expect(scriptLoaded).toBeTruthy();
    });
  });

  // Content Quality Tests
  test.describe('Content Quality', () => {
    test('should mention key Google Workspace apps', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.textContent('body');

      expect(bodyText).toContain('Gmail');
      expect(bodyText).toContain('Google Docs');
      expect(bodyText).toContain('Calendar');
      expect(bodyText).toContain('Drive');
    });

    test('should emphasize integration benefits', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.textContent('body');

      expect(bodyText).toMatch(/seamless|integration|workflow/i);
    });

    test('should include specific time-saving stats', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.textContent('body');

      expect(bodyText).toContain('60%');
    });

    test('should have compelling value propositions', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.textContent('body');

      expect(bodyText).toMatch(/faster|smarter|easier|productive/i);
    });
  });
});
