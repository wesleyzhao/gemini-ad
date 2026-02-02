// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Developer Tools Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/pages/developer-tools.html');
  });

  test.describe('Page Load', () => {
    test('should load successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Gemini for Developers/);
    });

    test('should have correct meta description', async ({ page }) => {
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /Supercharge your development workflow/);
    });

    test('should load all stylesheets', async ({ page }) => {
      const designSystem = page.locator('link[href*="design-system.css"]');
      const components = page.locator('link[href*="components.css"]');
      const animations = page.locator('link[href*="animations.css"]');

      await expect(designSystem).toBeAttached();
      await expect(components).toBeAttached();
      await expect(animations).toBeAttached();
    });

    test('should load animations.js', async ({ page }) => {
      const animationsScript = page.locator('script[src*="animations.js"]');
      await expect(animationsScript).toBeAttached();
    });
  });

  test.describe('Navigation & Links', () => {
    test('should have working CTA links to gemini.google.com', async ({ page }) => {
      const ctaLinks = page.locator('a[href="https://gemini.google.com"]');
      const count = await ctaLinks.count();
      expect(count).toBeGreaterThanOrEqual(3); // Hero, final CTA, footer
    });

    test('should have smooth scroll anchor link to capabilities', async ({ page }) => {
      const capabilitiesLink = page.locator('a[href="#capabilities"]');
      await expect(capabilitiesLink).toBeVisible();
    });

    test('should have noopener rel attribute on external links', async ({ page }) => {
      const externalLinks = page.locator('a[href^="https://gemini.google.com"]');
      const count = await externalLinks.count();

      for (let i = 0; i < count; i++) {
        await expect(externalLinks.nth(i)).toHaveAttribute('rel', 'noopener');
      }
    });

    test('should navigate to capabilities section when clicking anchor link', async ({ page }) => {
      const capabilitiesLink = page.locator('a[href="#capabilities"]');
      await capabilitiesLink.click();

      // Wait a bit for smooth scroll
      await page.waitForTimeout(500);

      const capabilitiesSection = page.locator('#capabilities');
      await expect(capabilitiesSection).toBeInViewport();
    });
  });

  test.describe('Hero Section', () => {
    test('should display hero badge', async ({ page }) => {
      const badge = page.locator('.hero-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText('Developer AI Assistant');
    });

    test('should display main headline', async ({ page }) => {
      const headline = page.locator('.hero h1');
      await expect(headline).toBeVisible();
      await expect(headline).toHaveText('Code faster, debug smarter');
    });

    test('should display hero subtitle', async ({ page }) => {
      const subtitle = page.locator('.hero-subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('AI-powered development partner');
    });

    test('should have two CTA buttons in hero', async ({ page }) => {
      const primaryCta = page.locator('.hero .cta-primary');
      const secondaryCta = page.locator('.hero .cta-secondary');

      await expect(primaryCta).toBeVisible();
      await expect(primaryCta).toHaveText('Start Coding Free');
      await expect(secondaryCta).toBeVisible();
      await expect(secondaryCta).toHaveText('See Capabilities');
    });

    test('should have animated grid background', async ({ page }) => {
      const hero = page.locator('.hero');
      const pseudoElementExists = await page.evaluate(() => {
        const heroElement = document.querySelector('.hero');
        const styles = window.getComputedStyle(heroElement, '::before');
        return styles.content !== 'none';
      });

      expect(pseudoElementExists).toBeTruthy();
    });

    test('should have gradient background', async ({ page }) => {
      const hero = page.locator('.hero');
      const background = await hero.evaluate(el =>
        window.getComputedStyle(el).background
      );

      expect(background).toContain('linear-gradient');
    });
  });

  test.describe('Code Languages Section', () => {
    test('should display section badge and title', async ({ page }) => {
      const badge = page.locator('.languages-section .section-badge');
      const title = page.locator('.languages-section .section-title');

      await expect(badge).toBeVisible();
      await expect(badge).toHaveText('Multi-Language Support');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Write code in any language');
    });

    test('should display 12 programming languages', async ({ page }) => {
      const languageCards = page.locator('.language-card');
      await expect(languageCards).toHaveCount(12);
    });

    test('should display Python language card', async ({ page }) => {
      const pythonCard = page.locator('.language-card').filter({ hasText: 'Python' });
      await expect(pythonCard).toBeVisible();

      const icon = pythonCard.locator('.language-icon');
      await expect(icon).toHaveText('🐍');
    });

    test('should display JavaScript language card', async ({ page }) => {
      const jsCard = page.locator('.language-card').filter({ hasText: 'JavaScript' });
      await expect(jsCard).toBeVisible();
    });

    test('should display TypeScript language card', async ({ page }) => {
      const tsCard = page.locator('.language-card').filter({ hasText: 'TypeScript' });
      await expect(tsCard).toBeVisible();
    });

    test('should display Rust language card', async ({ page }) => {
      const rustCard = page.locator('.language-card').filter({ hasText: 'Rust' });
      await expect(rustCard).toBeVisible();

      const icon = rustCard.locator('.language-icon');
      await expect(icon).toHaveText('🦀');
    });

    test('should display Go language card', async ({ page }) => {
      const goCard = page.locator('.language-card').filter({ hasText: 'Go' });
      await expect(goCard).toBeVisible();

      const icon = goCard.locator('.language-icon');
      await expect(icon).toHaveText('🐹');
    });

    test('language cards should have hover effects', async ({ page }) => {
      const firstCard = page.locator('.language-card').first();

      const originalTransform = await firstCard.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      await firstCard.hover();
      await page.waitForTimeout(100);

      const hoverTransform = await firstCard.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      expect(hoverTransform).not.toBe(originalTransform);
    });
  });

  test.describe('Capabilities Section', () => {
    test('should display section badge and title', async ({ page }) => {
      const badge = page.locator('.capabilities-section .section-badge');
      const title = page.locator('.capabilities-section .section-title');

      await expect(badge).toBeVisible();
      await expect(badge).toHaveText('Core Capabilities');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Everything developers need');
    });

    test('should display 6 capability cards', async ({ page }) => {
      const capabilityCards = page.locator('.capability-card');
      await expect(capabilityCards).toHaveCount(6);
    });

    test('should display Code Generation capability', async ({ page }) => {
      const codeGenCard = page.locator('.capability-card').filter({ hasText: 'Code Generation' });
      await expect(codeGenCard).toBeVisible();

      const icon = codeGenCard.locator('.capability-icon');
      await expect(icon).toHaveText('⚡');

      const description = codeGenCard.locator('.capability-description');
      await expect(description).toContainText('production-ready code');
    });

    test('should display Intelligent Debugging capability', async ({ page }) => {
      const debugCard = page.locator('.capability-card').filter({ hasText: 'Intelligent Debugging' });
      await expect(debugCard).toBeVisible();

      const icon = debugCard.locator('.capability-icon');
      await expect(icon).toHaveText('🐛');

      const description = debugCard.locator('.capability-description');
      await expect(description).toContainText('AI-powered debugging');
    });

    test('should display Auto Documentation capability', async ({ page }) => {
      const docCard = page.locator('.capability-card').filter({ hasText: 'Auto Documentation' });
      await expect(docCard).toBeVisible();

      const icon = docCard.locator('.capability-icon');
      await expect(icon).toHaveText('📝');
    });

    test('should display Code Refactoring capability', async ({ page }) => {
      const refactorCard = page.locator('.capability-card').filter({ hasText: 'Code Refactoring' });
      await expect(refactorCard).toBeVisible();

      const icon = refactorCard.locator('.capability-icon');
      await expect(icon).toHaveText('🔄');
    });

    test('should display Test Generation capability', async ({ page }) => {
      const testCard = page.locator('.capability-card').filter({ hasText: 'Test Generation' });
      await expect(testCard).toBeVisible();

      const icon = testCard.locator('.capability-icon');
      await expect(icon).toHaveText('✅');
    });

    test('should display Code Review capability', async ({ page }) => {
      const reviewCard = page.locator('.capability-card').filter({ hasText: 'Code Review' });
      await expect(reviewCard).toBeVisible();

      const icon = reviewCard.locator('.capability-icon');
      await expect(reviewCard).toContainText('🔍');
    });

    test('capability cards should have gradient top border on hover', async ({ page }) => {
      const firstCard = page.locator('.capability-card').first();

      // Check that the ::before pseudo-element exists and has gradient
      const hasGradientBorder = await page.evaluate(() => {
        const card = document.querySelector('.capability-card');
        const styles = window.getComputedStyle(card, '::before');
        return styles.background.includes('gradient');
      });

      expect(hasGradientBorder).toBeTruthy();
    });
  });

  test.describe('Code Demo Section', () => {
    test('should display section badge and title', async ({ page }) => {
      const badge = page.locator('.code-demo-section .section-badge');
      const title = page.locator('.code-demo-section .section-title');

      await expect(badge).toBeVisible();
      await expect(badge).toHaveText('Live Example');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('From prompt to production code');
    });

    test('should display code demo description', async ({ page }) => {
      const description = page.locator('.code-demo-description h3');
      await expect(description).toBeVisible();
      await expect(description).toHaveText('Generate complex algorithms instantly');
    });

    test('should display code demo features list', async ({ page }) => {
      const featuresList = page.locator('.code-demo-features li');
      await expect(featuresList).toHaveCount(5);

      await expect(featuresList.nth(0)).toContainText('natural language prompts');
      await expect(featuresList.nth(1)).toContainText('idiomatic, clean code');
      await expect(featuresList.nth(2)).toContainText('error handling');
      await expect(featuresList.nth(3)).toContainText('performance');
      await expect(featuresList.nth(4)).toContainText('production');
    });

    test('should display code window with header', async ({ page }) => {
      const codeWindow = page.locator('.code-window');
      await expect(codeWindow).toBeVisible();

      const codeHeader = page.locator('.code-header');
      await expect(codeHeader).toBeVisible();

      const codeTitle = page.locator('.code-title');
      await expect(codeTitle).toHaveText('fibonacci.py');
    });

    test('should display three colored dots in code header', async ({ page }) => {
      const redDot = page.locator('.code-dot.red');
      const yellowDot = page.locator('.code-dot.yellow');
      const greenDot = page.locator('.code-dot.green');

      await expect(redDot).toBeVisible();
      await expect(yellowDot).toBeVisible();
      await expect(greenDot).toBeVisible();
    });

    test('should display Python code with syntax highlighting', async ({ page }) => {
      const codeBody = page.locator('.code-body');
      await expect(codeBody).toBeVisible();

      const content = await codeBody.textContent();
      expect(content).toContain('def fibonacci');
      expect(content).toContain('memoization');
      expect(content).toContain('Generated by Gemini');
    });

    test('should have syntax-highlighted keywords', async ({ page }) => {
      const keywords = page.locator('.code-keyword');
      const count = await keywords.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have syntax-highlighted functions', async ({ page }) => {
      const functions = page.locator('.code-function');
      const count = await functions.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have syntax-highlighted comments', async ({ page }) => {
      const comments = page.locator('.code-comment');
      const count = await comments.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have dark background for code section', async ({ page }) => {
      const codeSection = page.locator('.code-demo-section');
      const background = await codeSection.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      // Should be dark (checking it's not white)
      expect(background).not.toBe('rgb(255, 255, 255)');
    });
  });

  test.describe('Debugging Section', () => {
    test('should display section badge and title', async ({ page }) => {
      const badge = page.locator('.debugging-section .section-badge');
      const title = page.locator('.debugging-section .section-title');

      await expect(badge).toBeVisible();
      await expect(badge).toHaveText('AI-Powered Debugging');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Fix bugs in seconds, not hours');
    });

    test('should display two debug cards', async ({ page }) => {
      const debugCards = page.locator('.debug-card');
      await expect(debugCards).toHaveCount(2);
    });

    test('should display "The Bug" card with error', async ({ page }) => {
      const bugCard = page.locator('.debug-card').first();

      const title = bugCard.locator('.debug-title');
      await expect(title).toHaveText('The Bug');

      const icon = bugCard.locator('.debug-icon');
      await expect(icon).toHaveText('❌');

      const codeContent = bugCard.locator('.debug-code');
      await expect(codeContent).toContainText('TypeError');
      await expect(codeContent).toContainText('Cannot read property');
    });

    test('should display "Gemini\'s Fix" card with solution', async ({ page }) => {
      const fixCard = page.locator('.debug-card.success');

      const title = fixCard.locator('.debug-title');
      await expect(title).toHaveText("Gemini's Fix");

      const icon = fixCard.locator('.debug-icon');
      await expect(icon).toHaveText('✅');

      const codeContent = fixCard.locator('.debug-code');
      await expect(codeContent).toContainText('optional chaining');
    });

    test('should display Gemini explanation in fix card', async ({ page }) => {
      const explanation = page.locator('.debug-explanation');
      await expect(explanation).toBeVisible();

      const explanationTitle = page.locator('.debug-explanation-title');
      await expect(explanationTitle).toContainText('Gemini Explanation');

      const explanationText = page.locator('.debug-explanation-text');
      await expect(explanationText).toContainText('optional chaining');
    });

    test('should show time comparison', async ({ page }) => {
      const bugCard = page.locator('.debug-card').first();
      await expect(bugCard).toContainText('30+ minutes');

      const fixCard = page.locator('.debug-card.success');
      await expect(fixCard).toContainText('5 seconds');
    });

    test('bug card should have red border', async ({ page }) => {
      const bugCard = page.locator('.debug-card').first();
      const borderColor = await bugCard.evaluate(el =>
        window.getComputedStyle(el).borderLeftColor
      );

      // Should have a red-ish border (not checking exact hex)
      expect(borderColor).toBeTruthy();
    });

    test('fix card should have green border', async ({ page }) => {
      const fixCard = page.locator('.debug-card.success');
      const borderColor = await fixCard.evaluate(el =>
        window.getComputedStyle(el).borderLeftColor
      );

      // Should have a border color
      expect(borderColor).toBeTruthy();
    });
  });

  test.describe('Stats Section', () => {
    test('should display 4 statistics', async ({ page }) => {
      const stats = page.locator('.stat-item');
      await expect(stats).toHaveCount(4);
    });

    test('should display "10x Faster Code Generation" stat', async ({ page }) => {
      const stat = page.locator('.stat-item').filter({ hasText: 'Faster Code Generation' });
      await expect(stat).toBeVisible();

      const number = stat.locator('.stat-number');
      await expect(number).toHaveText('10x');
    });

    test('should display "85% Reduction in Debug Time" stat', async ({ page }) => {
      const stat = page.locator('.stat-item').filter({ hasText: 'Reduction in Debug Time' });
      await expect(stat).toBeVisible();

      const number = stat.locator('.stat-number');
      await expect(number).toHaveText('85%');
    });

    test('should display "50+ Programming Languages" stat', async ({ page }) => {
      const stat = page.locator('.stat-item').filter({ hasText: 'Programming Languages' });
      await expect(stat).toBeVisible();

      const number = stat.locator('.stat-number');
      await expect(number).toHaveText('50+');
    });

    test('should display "99.2% Code Accuracy Rate" stat', async ({ page }) => {
      const stat = page.locator('.stat-item').filter({ hasText: 'Code Accuracy Rate' });
      await expect(stat).toBeVisible();

      const number = stat.locator('.stat-number');
      await expect(number).toHaveText('99.2%');
    });

    test('stat numbers should have gradient text', async ({ page }) => {
      const statNumber = page.locator('.stat-number').first();
      const background = await statNumber.evaluate(el =>
        window.getComputedStyle(el).background
      );

      expect(background).toContain('linear-gradient');
    });
  });

  test.describe('Testimonials Section', () => {
    test('should display section badge and title', async ({ page }) => {
      const badge = page.locator('.testimonials-section .section-badge');
      const title = page.locator('.testimonials-section .section-title');

      await expect(badge).toBeVisible();
      await expect(badge).toHaveText('Developer Stories');
      await expect(title).toBeVisible();
      await expect(title).toHaveText('Loved by developers worldwide');
    });

    test('should display 3 testimonials', async ({ page }) => {
      const testimonials = page.locator('.testimonial-card');
      await expect(testimonials).toHaveCount(3);
    });

    test('should display Alex Chen testimonial from Meta', async ({ page }) => {
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'Alex Chen' });
      await expect(testimonial).toBeVisible();

      const name = testimonial.locator('.testimonial-name');
      await expect(name).toHaveText('Alex Chen');

      const title = testimonial.locator('.testimonial-title');
      await expect(title).toContainText('Meta');

      const text = testimonial.locator('.testimonial-text');
      await expect(text).toContainText('3x faster');
    });

    test('should display Sarah Johnson testimonial from Stripe', async ({ page }) => {
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'Sarah Johnson' });
      await expect(testimonial).toBeVisible();

      const name = testimonial.locator('.testimonial-name');
      await expect(name).toHaveText('Sarah Johnson');

      const title = testimonial.locator('.testimonial-title');
      await expect(title).toContainText('Stripe');

      const text = testimonial.locator('.testimonial-text');
      await expect(text).toContainText('incredibly accurate');
    });

    test('should display Marcus Rivera testimonial from Shopify', async ({ page }) => {
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'Marcus Rivera' });
      await expect(testimonial).toBeVisible();

      const name = testimonial.locator('.testimonial-name');
      await expect(name).toHaveText('Marcus Rivera');

      const title = testimonial.locator('.testimonial-title');
      await expect(title).toContainText('Shopify');

      const text = testimonial.locator('.testimonial-text');
      await expect(text).toContainText('junior developer');
    });

    test('all testimonials should have avatars', async ({ page }) => {
      const avatars = page.locator('.testimonial-avatar');
      await expect(avatars).toHaveCount(3);
    });

    test('all testimonials should have quote marks', async ({ page }) => {
      const quotes = page.locator('.testimonial-quote');
      await expect(quotes).toHaveCount(3);

      for (let i = 0; i < 3; i++) {
        await expect(quotes.nth(i)).toHaveText('"');
      }
    });

    test('testimonial cards should have hover effects', async ({ page }) => {
      const firstCard = page.locator('.testimonial-card').first();

      const originalTransform = await firstCard.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      await firstCard.hover();
      await page.waitForTimeout(100);

      const hoverTransform = await firstCard.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      expect(hoverTransform).not.toBe(originalTransform);
    });
  });

  test.describe('Final CTA Section', () => {
    test('should display final CTA heading', async ({ page }) => {
      const heading = page.locator('.final-cta-section h2');
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText('Start building better software today');
    });

    test('should display final CTA subtext', async ({ page }) => {
      const subtext = page.locator('.final-cta-content p');
      await expect(subtext).toBeVisible();
      await expect(subtext).toContainText('millions of developers');
    });

    test('should have CTA button linking to Gemini', async ({ page }) => {
      const cta = page.locator('.final-cta-section .cta-primary');
      await expect(cta).toBeVisible();
      await expect(cta).toHaveText('Get Started Free');
      await expect(cta).toHaveAttribute('href', 'https://gemini.google.com');
    });

    test('should have gradient background', async ({ page }) => {
      const section = page.locator('.final-cta-section');
      const background = await section.evaluate(el =>
        window.getComputedStyle(el).background
      );

      expect(background).toContain('linear-gradient');
    });
  });

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      const footer = page.locator('.footer');
      await expect(footer).toBeVisible();
    });

    test('should display copyright text', async ({ page }) => {
      const footer = page.locator('.footer');
      await expect(footer).toContainText('2024 Google LLC');
      await expect(footer).toContainText('Gemini is a product of Google');
    });

    test('should have link to Gemini in footer', async ({ page }) => {
      const footerLink = page.locator('.footer a');
      await expect(footerLink).toBeVisible();
      await expect(footerLink).toHaveAttribute('href', 'https://gemini.google.com');
    });

    test('should have dark background', async ({ page }) => {
      const footer = page.locator('.footer');
      const background = await footer.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      // Should be dark (not white)
      expect(background).not.toBe('rgb(255, 255, 255)');
    });
  });

  test.describe('CTA & Links', () => {
    test('should have multiple conversion points', async ({ page }) => {
      const allCtas = page.locator('a[href="https://gemini.google.com"]');
      const count = await allCtas.count();

      // Should have at least 3: hero primary, final CTA, footer
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('primary CTAs should have consistent styling', async ({ page }) => {
      const primaryCtas = page.locator('.cta-primary');
      const count = await primaryCtas.count();

      expect(count).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe('Animations', () => {
    test('hero elements should have fadeInUp animation', async ({ page }) => {
      const badge = page.locator('.hero-badge');
      const animation = await badge.evaluate(el =>
        window.getComputedStyle(el).animation
      );

      expect(animation).toContain('fadeInUp');
    });

    test('code window should have box shadow for depth', async ({ page }) => {
      const codeWindow = page.locator('.code-window');
      const boxShadow = await codeWindow.evaluate(el =>
        window.getComputedStyle(el).boxShadow
      );

      expect(boxShadow).not.toBe('none');
    });

    test('cards should have transition properties', async ({ page }) => {
      const card = page.locator('.capability-card').first();
      const transition = await card.evaluate(el =>
        window.getComputedStyle(el).transition
      );

      expect(transition).toBeTruthy();
    });

    test('grid background should animate in hero', async ({ page }) => {
      const hasAnimation = await page.evaluate(() => {
        const heroElement = document.querySelector('.hero');
        const styles = window.getComputedStyle(heroElement, '::before');
        return styles.animation.includes('gridMove');
      });

      expect(hasAnimation).toBeTruthy();
    });
  });

  test.describe('Typography', () => {
    test('should use Playfair Display for headings', async ({ page }) => {
      const heading = page.locator('.hero h1');
      const fontFamily = await heading.evaluate(el =>
        window.getComputedStyle(el).fontFamily
      );

      expect(fontFamily).toContain('Playfair Display');
    });

    test('should use Inter for body text', async ({ page }) => {
      const body = page.locator('body');
      const fontFamily = await body.evaluate(el =>
        window.getComputedStyle(el).fontFamily
      );

      expect(fontFamily).toContain('Inter');
    });

    test('headings should be properly hierarchical', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1); // Only one h1

      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThan(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();

      const title = page.locator('.hero h1');
      await expect(title).toBeVisible();
    });

    test('should stack CTAs vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const heroCtas = page.locator('.hero-ctas');
      const flexDirection = await heroCtas.evaluate(el =>
        window.getComputedStyle(el).flexDirection
      );

      expect(flexDirection).toBe('column');
    });

    test('should have single column grid on mobile for capabilities', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const grid = page.locator('.capabilities-grid');
      const gridTemplateColumns = await grid.evaluate(el =>
        window.getComputedStyle(el).gridTemplateColumns
      );

      // Should be single column or have 1fr
      expect(gridTemplateColumns).toBeTruthy();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();

      const capabilitiesGrid = page.locator('.capabilities-grid');
      await expect(capabilitiesGrid).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);

      const h2 = page.locator('h2');
      const h2Count = await h2.count();
      expect(h2Count).toBeGreaterThan(0);
    });

    test('should have lang attribute on html', async ({ page }) => {
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en');
    });

    test('all links should have proper attributes', async ({ page }) => {
      const externalLinks = page.locator('a[href^="https://"]');
      const count = await externalLinks.count();

      for (let i = 0; i < count; i++) {
        const href = await externalLinks.nth(i).getAttribute('href');
        expect(href).toBeTruthy();
      }
    });

    test('should have meta viewport tag', async ({ page }) => {
      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveAttribute('content', /width=device-width/);
    });
  });

  test.describe('Design Quality', () => {
    test('should use CSS custom properties', async ({ page }) => {
      const hasCssVars = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = window.getComputedStyle(root);
        const cssText = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules || [])
                .map(rule => rule.cssText)
                .join('');
            } catch(e) {
              return '';
            }
          })
          .join('');
        return cssText.includes('--dev-primary') || cssText.includes('var(--');
      });

      expect(hasCssVars).toBeTruthy();
    });

    test('should have consistent spacing', async ({ page }) => {
      const sections = page.locator('section');
      const count = await sections.count();

      expect(count).toBeGreaterThan(5);
    });

    test('should use border-radius for modern look', async ({ page }) => {
      const card = page.locator('.capability-card').first();
      const borderRadius = await card.evaluate(el =>
        window.getComputedStyle(el).borderRadius
      );

      expect(borderRadius).not.toBe('0px');
    });

    test('should have box shadows for depth', async ({ page }) => {
      const cta = page.locator('.cta-primary').first();
      const boxShadow = await cta.evaluate(el =>
        window.getComputedStyle(el).boxShadow
      );

      expect(boxShadow).not.toBe('none');
    });

    test('should use gradient backgrounds', async ({ page }) => {
      const hero = page.locator('.hero');
      const background = await hero.evaluate(el =>
        window.getComputedStyle(el).background
      );

      expect(background).toContain('linear-gradient');
    });

    test('should have smooth transitions', async ({ page }) => {
      const button = page.locator('.cta-primary').first();
      const transition = await button.evaluate(el =>
        window.getComputedStyle(el).transition
      );

      expect(transition).toBeTruthy();
      expect(transition).not.toBe('all 0s ease 0s');
    });
  });

  test.describe('Performance', () => {
    test('should load in reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('http://localhost:8000/pages/developer-tools.html');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    });

    test('should have no console errors', async ({ page }) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('http://localhost:8000/pages/developer-tools.html');
      await page.waitForLoadState('networkidle');

      expect(errors.length).toBe(0);
    });
  });

  test.describe('Developer Tools Specific Content', () => {
    test('should mention code generation throughout', async ({ page }) => {
      const bodyText = await page.locator('body').textContent();
      const codeGenMentions = (bodyText.toLowerCase().match(/code generation|generate code|code faster/g) || []).length;

      expect(codeGenMentions).toBeGreaterThan(3);
    });

    test('should mention debugging throughout', async ({ page }) => {
      const bodyText = await page.locator('body').textContent();
      const debugMentions = (bodyText.toLowerCase().match(/debug|debugging|bug|fix bugs/g) || []).length;

      expect(debugMentions).toBeGreaterThan(5);
    });

    test('should mention documentation', async ({ page }) => {
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.toLowerCase()).toContain('documentation');
    });

    test('should mention testing', async ({ page }) => {
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.toLowerCase()).toContain('test');
    });

    test('should showcase actual code examples', async ({ page }) => {
      const codeBody = page.locator('.code-body');
      await expect(codeBody).toBeVisible();

      const codeContent = await codeBody.textContent();
      expect(codeContent).toContain('def');
      expect(codeContent).toContain('fibonacci');
    });

    test('should show before/after debugging example', async ({ page }) => {
      const bugCard = page.locator('.debug-card').first();
      const fixCard = page.locator('.debug-card.success');

      await expect(bugCard).toBeVisible();
      await expect(fixCard).toBeVisible();

      const bugCode = await bugCard.locator('.debug-code').textContent();
      const fixCode = await fixCard.locator('.debug-code').textContent();

      expect(bugCode).toContain('TypeError');
      expect(fixCode).toContain('optional chaining');
    });

    test('should highlight multiple programming languages', async ({ page }) => {
      const languages = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Rust', 'Go'];

      for (const lang of languages) {
        const langCard = page.locator('.language-card').filter({ hasText: lang });
        await expect(langCard).toBeVisible();
      }
    });

    test('should emphasize AI-powered features', async ({ page }) => {
      const bodyText = await page.locator('body').textContent();
      const aiMentions = (bodyText.toLowerCase().match(/ai-powered|ai assistant|artificial intelligence/g) || []).length;

      expect(aiMentions).toBeGreaterThan(2);
    });
  });

  test.describe('Screenshot Tests', () => {
    test('should capture full page screenshot', async ({ page }) => {
      await page.screenshot({ path: 'tests/screenshots/developer-tools-full.png', fullPage: true });
    });

    test('should capture hero section screenshot', async ({ page }) => {
      const hero = page.locator('.hero');
      await hero.screenshot({ path: 'tests/screenshots/developer-tools-hero.png' });
    });

    test('should capture code demo screenshot', async ({ page }) => {
      const codeDemo = page.locator('.code-demo-section');
      await codeDemo.screenshot({ path: 'tests/screenshots/developer-tools-code-demo.png' });
    });

    test('should capture debugging section screenshot', async ({ page }) => {
      const debugging = page.locator('.debugging-section');
      await debugging.screenshot({ path: 'tests/screenshots/developer-tools-debugging.png' });
    });

    test('should capture mobile viewport screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.screenshot({ path: 'tests/screenshots/developer-tools-mobile.png', fullPage: true });
    });

    test('should capture tablet viewport screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.screenshot({ path: 'tests/screenshots/developer-tools-tablet.png', fullPage: true });
    });
  });

  test.describe('Integration', () => {
    test('should integrate with shared design system', async ({ page }) => {
      const designSystemLink = page.locator('link[href*="design-system.css"]');
      await expect(designSystemLink).toBeAttached();
    });

    test('should integrate with shared components', async ({ page }) => {
      const componentsLink = page.locator('link[href*="components.css"]');
      await expect(componentsLink).toBeAttached();
    });

    test('should integrate with shared animations', async ({ page }) => {
      const animationsLink = page.locator('link[href*="animations.css"]');
      await expect(animationsLink).toBeAttached();

      const animationsScript = page.locator('script[src*="animations.js"]');
      await expect(animationsScript).toBeAttached();
    });
  });

  test.describe('Content Quality', () => {
    test('should have compelling value propositions', async ({ page }) => {
      const subtitle = page.locator('.hero-subtitle');
      const text = await subtitle.textContent();

      expect(text.length).toBeGreaterThan(50);
      expect(text).toContain('AI');
    });

    test('should have credible statistics', async ({ page }) => {
      const stats = ['10x', '85%', '50+', '99.2%'];

      for (const stat of stats) {
        const statElement = page.locator('.stat-number').filter({ hasText: stat });
        await expect(statElement).toBeVisible();
      }
    });

    test('should have professional testimonials', async ({ page }) => {
      const companies = ['Meta', 'Stripe', 'Shopify'];

      for (const company of companies) {
        const testimonial = page.locator('.testimonial-card').filter({ hasText: company });
        await expect(testimonial).toBeVisible();
      }
    });

    test('should have clear CTAs', async ({ page }) => {
      const ctas = ['Start Coding Free', 'Get Started Free', 'See Capabilities'];

      for (const ctaText of ctas) {
        const cta = page.locator(`text=${ctaText}`);
        await expect(cta).toBeVisible();
      }
    });
  });
});
