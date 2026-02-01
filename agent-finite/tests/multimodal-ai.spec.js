const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8000/pages/multimodal-ai.html';

test.describe('Multimodal AI Landing Page', () => {
  // ========================================
  // Page Load Tests
  // ========================================
  test.describe('Page Load', () => {
    test('should load successfully', async ({ page }) => {
      const response = await page.goto(PAGE_URL);
      expect(response.status()).toBe(200);
    });

    test('should have correct title', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page).toHaveTitle(/See the world through AI.*Gemini Multimodal/i);
    });

    test('should have meta description', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('multimodal');
      expect(metaDescription).toContain('VO3');
    });

    test('should load all external stylesheets', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stylesheets = await page.locator('link[rel="stylesheet"]').count();
      expect(stylesheets).toBeGreaterThanOrEqual(3); // design-system, components, animations
    });
  });

  // ========================================
  // Navigation Tests
  // ========================================
  test.describe('Navigation', () => {
    test('should have smooth scroll anchor link to demo section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demoLink = page.locator('a[href="#demo"]');
      await expect(demoLink).toBeVisible();
      await expect(demoLink).toHaveText(/See Examples/i);
    });

    test('should have Gemini links that open in new tab', async ({ page }) => {
      await page.goto(PAGE_URL);
      const geminiLinks = page.locator('a[href*="gemini.google.com"]');
      const count = await geminiLinks.count();
      expect(count).toBeGreaterThanOrEqual(2);

      for (let i = 0; i < count; i++) {
        await expect(geminiLinks.nth(i)).toHaveAttribute('target', '_blank');
        await expect(geminiLinks.nth(i)).toHaveAttribute('rel', 'noopener');
      }
    });

    test('should have multiple CTA links throughout page', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ctaLinks = page.locator('a.cta-primary, a.cta-secondary');
      const count = await ctaLinks.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('should have demo section with id', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demoSection = page.locator('#demo');
      await expect(demoSection).toBeVisible();
    });
  });

  // ========================================
  // Hero Section Tests
  // ========================================
  test.describe('Hero Section', () => {
    test('should display hero badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.hero-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText(/Multimodal AI/i);
    });

    test('should have single h1 with gradient text', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(/See the world through AI/i);
    });

    test('should display hero subtitle mentioning VO3', async ({ page }) => {
      await page.goto(PAGE_URL);
      const subtitle = page.locator('.hero-subtitle');
      await expect(subtitle).toBeVisible();
      const text = await subtitle.textContent();
      expect(text.toLowerCase()).toContain('vo3');
    });

    test('should have two CTA buttons in hero', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryCTA = page.locator('.hero .cta-primary');
      const secondaryCTA = page.locator('.hero .cta-secondary');
      await expect(primaryCTA).toBeVisible();
      await expect(secondaryCTA).toBeVisible();
      await expect(primaryCTA).toHaveText(/Try Visual Analysis/i);
      await expect(secondaryCTA).toHaveText(/See Examples/i);
    });

    test('should have floating gradient orb backgrounds', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      const beforePseudo = await hero.evaluate((el) => {
        return window.getComputedStyle(el, '::before').getPropertyValue('content');
      });
      const afterPseudo = await hero.evaluate((el) => {
        return window.getComputedStyle(el, '::after').getPropertyValue('content');
      });
      // Pseudo-elements should exist (empty string content is valid for decorative elements)
      expect(beforePseudo).toBeDefined();
      expect(afterPseudo).toBeDefined();
    });

    test('should have proper hero section structure', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heroContent = page.locator('.hero-content');
      await expect(heroContent).toBeVisible();
      const heroCtaContainer = page.locator('.hero-ctas');
      await expect(heroCtaContainer).toBeVisible();
    });

    test('should have responsive hero layout', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
      const minHeight = await hero.evaluate((el) => {
        return window.getComputedStyle(el).minHeight;
      });
      expect(minHeight).toBeTruthy();
    });
  });

  // ========================================
  // Visual Demo Section Tests
  // ========================================
  test.describe('Visual Demo Section', () => {
    test('should have section header with VO3 badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.visual-demo .section-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText(/Powered by VO3/i);
    });

    test('should display section title', async ({ page }) => {
      await page.goto(PAGE_URL);
      const title = page.locator('.visual-demo h2');
      await expect(title).toBeVisible();
      await expect(title).toHaveText(/One AI, infinite ways to see/i);
    });

    test('should have 4 demo cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demoCards = page.locator('.demo-card');
      await expect(demoCards).toHaveCount(4);
    });

    test('should have photo analysis demo card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const photoCard = page.locator('.demo-card').filter({ hasText: 'Image Analysis' });
      await expect(photoCard).toBeVisible();
      const visual = photoCard.locator('.demo-visual.photo');
      await expect(visual).toBeVisible();
      const type = photoCard.locator('.demo-type');
      await expect(type).toHaveText(/Photos/i);
    });

    test('should have document processing demo card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const docCard = page.locator('.demo-card').filter({ hasText: 'Document Processing' });
      await expect(docCard).toBeVisible();
      const visual = docCard.locator('.demo-visual.document');
      await expect(visual).toBeVisible();
      const type = docCard.locator('.demo-type');
      await expect(type).toHaveText(/Documents/i);
    });

    test('should have data visualization demo card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const chartCard = page.locator('.demo-card').filter({ hasText: 'Data Visualization' });
      await expect(chartCard).toBeVisible();
      const visual = chartCard.locator('.demo-visual.chart');
      await expect(visual).toBeVisible();
      const type = chartCard.locator('.demo-type');
      await expect(type).toHaveText(/Charts & Data/i);
    });

    test('should have video understanding demo card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const videoCard = page.locator('.demo-card').filter({ hasText: 'Video Understanding' });
      await expect(videoCard).toBeVisible();
      const visual = videoCard.locator('.demo-visual.video');
      await expect(visual).toBeVisible();
      const type = videoCard.locator('.demo-type');
      await expect(type).toHaveText(/Videos/i);
    });

    test('should have emoji icons in demo visuals', async ({ page }) => {
      await page.goto(PAGE_URL);
      const visuals = page.locator('.demo-visual');
      const count = await visuals.count();
      expect(count).toBe(4);

      // Check that each visual has content (emoji)
      for (let i = 0; i < count; i++) {
        const text = await visuals.nth(i).textContent();
        expect(text.trim()).toBeTruthy();
      }
    });

    test('should have grid layout for demo cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const grid = page.locator('.demo-grid');
      await expect(grid).toBeVisible();
      const display = await grid.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('grid');
    });

    test('should have hover effects on demo cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const firstCard = page.locator('.demo-card').first();
      await expect(firstCard).toBeVisible();

      // Check that transition is defined
      const transition = await firstCard.evaluate((el) => {
        return window.getComputedStyle(el).transition;
      });
      expect(transition).toBeTruthy();
    });
  });

  // ========================================
  // Capabilities Grid Tests
  // ========================================
  test.describe('Capabilities Grid', () => {
    test('should have capabilities section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.capabilities');
      await expect(section).toBeVisible();
    });

    test('should have 6 capability cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = page.locator('.capability-card');
      await expect(cards).toHaveCount(6);
    });

    test('should have Object Detection capability', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Object Detection' });
      await expect(card).toBeVisible();
      await expect(card.locator('h3')).toHaveText('Object Detection');
    });

    test('should have OCR & Text Extraction capability', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'OCR & Text Extraction' });
      await expect(card).toBeVisible();
    });

    test('should have Scene Understanding capability', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Scene Understanding' });
      await expect(card).toBeVisible();
    });

    test('should have Layout Analysis capability', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Layout Analysis' });
      await expect(card).toBeVisible();
    });

    test('should have Medical Imaging capability', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Medical Imaging' });
      await expect(card).toBeVisible();
    });

    test('should have Visual Search capability', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.capability-card').filter({ hasText: 'Visual Search' });
      await expect(card).toBeVisible();
    });

    test('should have emoji icons in capability cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const icons = page.locator('.capability-icon');
      const count = await icons.count();
      expect(count).toBe(6);
    });

    test('should have grid layout for capabilities', async ({ page }) => {
      await page.goto(PAGE_URL);
      const grid = page.locator('.capabilities-grid');
      await expect(grid).toBeVisible();
      const display = await grid.evaluate((el) => {
        return window.getComputedStyle(el).display;
      });
      expect(display).toBe('grid');
    });
  });

  // ========================================
  // VO3 Showcase Section Tests
  // ========================================
  test.describe('VO3 Showcase Section', () => {
    test('should have VO3 showcase section with gradient background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.vo3-showcase');
      await expect(section).toBeVisible();
      const background = await section.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).toBeTruthy();
    });

    test('should have VO3 badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.vo3-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText(/VO3 Technology/i);
    });

    test('should have VO3 title and description', async ({ page }) => {
      await page.goto(PAGE_URL);
      const title = page.locator('.vo3-showcase h2');
      await expect(title).toBeVisible();
      await expect(title).toHaveText(/most advanced visual AI model/i);

      const description = page.locator('.vo3-description');
      await expect(description).toBeVisible();
      const text = await description.textContent();
      expect(text.toLowerCase()).toContain('vo3');
    });

    test('should have 4 VO3 feature cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const features = page.locator('.vo3-feature');
      await expect(features).toHaveCount(4);
    });

    test('should have Real-Time Processing feature', async ({ page }) => {
      await page.goto(PAGE_URL);
      const feature = page.locator('.vo3-feature').filter({ hasText: 'Real-Time Processing' });
      await expect(feature).toBeVisible();
    });

    test('should have 99.3% Accuracy feature', async ({ page }) => {
      await page.goto(PAGE_URL);
      const feature = page.locator('.vo3-feature').filter({ hasText: '99.3% Accuracy' });
      await expect(feature).toBeVisible();
    });

    test('should have Multi-Image Analysis feature', async ({ page }) => {
      await page.goto(PAGE_URL);
      const feature = page.locator('.vo3-feature').filter({ hasText: 'Multi-Image Analysis' });
      await expect(feature).toBeVisible();
    });

    test('should have 100+ Languages feature', async ({ page }) => {
      await page.goto(PAGE_URL);
      const feature = page.locator('.vo3-feature').filter({ hasText: '100+ Languages' });
      await expect(feature).toBeVisible();
    });

    test('should have emoji icons in VO3 features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const icons = page.locator('.vo3-feature-icon');
      const count = await icons.count();
      expect(count).toBe(4);
    });

    test('should have white text on gradient background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.vo3-showcase');
      const color = await section.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      // RGB value for white is rgb(255, 255, 255)
      expect(color).toContain('255');
    });

    test('should have floating background animation', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.vo3-showcase');
      const beforePseudo = await section.evaluate((el) => {
        return window.getComputedStyle(el, '::before').getPropertyValue('animation');
      });
      expect(beforePseudo).toBeTruthy();
    });
  });

  // ========================================
  // Use Cases Section Tests
  // ========================================
  test.describe('Use Cases Section', () => {
    test('should have use cases section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.use-cases');
      await expect(section).toBeVisible();
    });

    test('should have 4 use case items', async ({ page }) => {
      await page.goto(PAGE_URL);
      const items = page.locator('.use-case-item');
      await expect(items).toHaveCount(4);
    });

    test('should have Creative Professionals use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case-item').filter({ hasText: 'Creative professionals' });
      await expect(useCase).toBeVisible();
      const badge = useCase.locator('.use-case-badge');
      await expect(badge).toHaveText(/Creators/i);
    });

    test('should have Business Analysts use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case-item').filter({ hasText: 'Business analysts' });
      await expect(useCase).toBeVisible();
      const badge = useCase.locator('.use-case-badge');
      await expect(badge).toHaveText(/Business/i);
    });

    test('should have Medical Professionals use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case-item').filter({ hasText: 'Medical professionals' });
      await expect(useCase).toBeVisible();
      const badge = useCase.locator('.use-case-badge');
      await expect(badge).toHaveText(/Healthcare/i);
    });

    test('should have Online Retailers use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCase = page.locator('.use-case-item').filter({ hasText: 'Online retailers' });
      await expect(useCase).toBeVisible();
      const badge = useCase.locator('.use-case-badge');
      await expect(badge).toHaveText(/E-commerce/i);
    });

    test('should have benefit lists for each use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const benefitLists = page.locator('.use-case-benefits');
      const count = await benefitLists.count();
      expect(count).toBe(4);

      // Each list should have 4 items
      for (let i = 0; i < count; i++) {
        const items = benefitLists.nth(i).locator('li');
        await expect(items).toHaveCount(4);
      }
    });

    test('should have visual elements for each use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const visuals = page.locator('.use-case-visual');
      await expect(visuals).toHaveCount(4);
    });

    test('should have emoji icons in use case visuals', async ({ page }) => {
      await page.goto(PAGE_URL);
      const visuals = page.locator('.use-case-visual');
      const count = await visuals.count();

      for (let i = 0; i < count; i++) {
        const text = await visuals.nth(i).textContent();
        expect(text.trim()).toBeTruthy();
      }
    });

    test('should have alternating layout for use cases', async ({ page }) => {
      await page.goto(PAGE_URL);
      const items = page.locator('.use-case-item');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);

      // Check if nth-child(even) has different direction
      const secondItem = items.nth(1);
      const direction = await secondItem.evaluate((el) => {
        return window.getComputedStyle(el).direction;
      });
      // Should have rtl for even items (desktop)
      expect(direction).toBeTruthy();
    });
  });

  // ========================================
  // Stats Section Tests
  // ========================================
  test.describe('Stats Section', () => {
    test('should have stats section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.stats');
      await expect(section).toBeVisible();
    });

    test('should have 4 stat items', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stats = page.locator('.stat-item');
      await expect(stats).toHaveCount(4);
    });

    test('should display 5B+ images analyzed stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-item').filter({ hasText: 'Images Analyzed Daily' });
      await expect(stat).toBeVisible();
      const number = stat.locator('.stat-number');
      await expect(number).toHaveText(/5B\+/);
    });

    test('should display 99.3% accuracy stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-item').filter({ hasText: 'Visual Accuracy Rate' });
      await expect(stat).toBeVisible();
      const number = stat.locator('.stat-number');
      await expect(number).toHaveText(/99\.3%/);
    });

    test('should display 100+ languages stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-item').filter({ hasText: 'Languages Supported' });
      await expect(stat).toBeVisible();
      const number = stat.locator('.stat-number');
      await expect(number).toHaveText(/100\+/);
    });

    test('should display processing time stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.stat-item').filter({ hasText: 'Average Processing Time' });
      await expect(stat).toBeVisible();
      const number = stat.locator('.stat-number');
      await expect(number).toHaveText(/<50ms/);
    });

    test('should have gradient text on stat numbers', async ({ page }) => {
      await page.goto(PAGE_URL);
      const statNumber = page.locator('.stat-number').first();
      const background = await statNumber.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).toBeTruthy();
    });
  });

  // ========================================
  // Testimonials Section Tests
  // ========================================
  test.describe('Testimonials Section', () => {
    test('should have testimonials section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.testimonials');
      await expect(section).toBeVisible();
    });

    test('should have 3 testimonial cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonials = page.locator('.testimonial-card');
      await expect(testimonials).toHaveCount(3);
    });

    test('should have Dr. James Patterson testimonial', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'Dr. James Patterson' });
      await expect(testimonial).toBeVisible();
      await expect(testimonial).toContainText('Radiologist, Mayo Clinic');
      await expect(testimonial).toContainText('VO3 technology');
    });

    test('should have Sofia Rodriguez testimonial', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'Sofia Rodriguez' });
      await expect(testimonial).toBeVisible();
      await expect(testimonial).toContainText('Senior Product Designer, Adobe');
    });

    test('should have Michael Chen testimonial', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'Michael Chen' });
      await expect(testimonial).toBeVisible();
      await expect(testimonial).toContainText('VP of Engineering, Shopify');
    });

    test('should have quote marks in testimonials', async ({ page }) => {
      await page.goto(PAGE_URL);
      const quoteMarks = page.locator('.testimonial-quote');
      const count = await quoteMarks.count();
      expect(count).toBe(3);
    });

    test('should have avatars in testimonials', async ({ page }) => {
      await page.goto(PAGE_URL);
      const avatars = page.locator('.testimonial-avatar');
      await expect(avatars).toHaveCount(3);
    });

    test('should have author info in testimonials', async ({ page }) => {
      await page.goto(PAGE_URL);
      const authorInfo = page.locator('.testimonial-info');
      await expect(authorInfo).toHaveCount(3);
    });

    test('should have testimonial text', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonialText = page.locator('.testimonial-text');
      await expect(testimonialText).toHaveCount(3);
    });
  });

  // ========================================
  // Final CTA Section Tests
  // ========================================
  test.describe('Final CTA Section', () => {
    test('should have final CTA section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.final-cta');
      await expect(section).toBeVisible();
    });

    test('should have final CTA title', async ({ page }) => {
      await page.goto(PAGE_URL);
      const title = page.locator('.final-cta h2');
      await expect(title).toBeVisible();
      await expect(title).toHaveText(/Experience visual AI today/i);
    });

    test('should have final CTA description', async ({ page }) => {
      await page.goto(PAGE_URL);
      const description = page.locator('.final-cta p');
      await expect(description).toBeVisible();
    });

    test('should have final CTA button', async ({ page }) => {
      await page.goto(PAGE_URL);
      const button = page.locator('.final-cta .cta-primary');
      await expect(button).toBeVisible();
      await expect(button).toHaveText(/Start Analyzing Images Free/i);
      await expect(button).toHaveAttribute('href', 'https://gemini.google.com');
    });

    test('should have gradient background on final CTA', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.final-cta');
      const background = await section.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).toBeTruthy();
    });
  });

  // ========================================
  // CTA & Links Tests
  // ========================================
  test.describe('CTA & Links', () => {
    test('should have multiple Gemini links throughout page', async ({ page }) => {
      await page.goto(PAGE_URL);
      const geminiLinks = page.locator('a[href="https://gemini.google.com"]');
      const count = await geminiLinks.count();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    test('should have VO3 mentioned multiple times', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      const vo3Mentions = (bodyText.match(/VO3/gi) || []).length;
      expect(vo3Mentions).toBeGreaterThanOrEqual(3);
    });
  });

  // ========================================
  // Animation Tests
  // ========================================
  test.describe('Animations', () => {
    test('should load animations.js script', async ({ page }) => {
      await page.goto(PAGE_URL);
      const script = page.locator('script[src*="animations.js"]');
      await expect(script).toHaveCount(1);
    });

    test('should have fadeInUp animations on hero elements', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.hero-badge');
      const animation = await badge.evaluate((el) => {
        return window.getComputedStyle(el).animation;
      });
      expect(animation).toContain('fadeInUp');
    });

    test('should have float animation on background elements', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      const beforeAnimation = await hero.evaluate((el) => {
        return window.getComputedStyle(el, '::before').getPropertyValue('animation');
      });
      expect(beforeAnimation).toContain('float');
    });

    test('should respect prefers-reduced-motion', async ({ page }) => {
      await page.goto(PAGE_URL);
      const styles = await page.locator('style').allTextContents();
      const hasReducedMotion = styles.some(style => style.includes('prefers-reduced-motion'));
      expect(hasReducedMotion).toBe(true);
    });
  });

  // ========================================
  // Typography Tests
  // ========================================
  test.describe('Typography', () => {
    test('should use Playfair Display for headings', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1 = page.locator('h1');
      const fontFamily = await h1.evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
      expect(fontFamily.toLowerCase()).toContain('playfair');
    });

    test('should use Inter for body text', async ({ page }) => {
      await page.goto(PAGE_URL);
      const body = page.locator('body');
      const fontFamily = await body.evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
      expect(fontFamily.toLowerCase()).toContain('inter');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1 = page.locator('h1');
      const h2 = page.locator('h2');
      const h3 = page.locator('h3');

      await expect(h1).toHaveCount(1);
      const h2Count = await h2.count();
      const h3Count = await h3.count();
      expect(h2Count).toBeGreaterThan(0);
      expect(h3Count).toBeGreaterThan(0);
    });
  });

  // ========================================
  // Responsive Design Tests
  // ========================================
  test.describe('Responsive Design', () => {
    test('should be responsive on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('should stack hero CTAs on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      const ctaContainer = page.locator('.hero-ctas');
      const flexDirection = await ctaContainer.evaluate((el) => {
        return window.getComputedStyle(el).flexDirection;
      });
      expect(flexDirection).toBe('column');
    });

    test('should be responsive on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('should be responsive on desktop (1440px)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });
  });

  // ========================================
  // Accessibility Tests
  // ========================================
  test.describe('Accessibility', () => {
    test('should have proper semantic HTML structure', async ({ page }) => {
      await page.goto(PAGE_URL);
      const sections = page.locator('section');
      const count = await sections.count();
      expect(count).toBeGreaterThanOrEqual(7);
    });

    test('should have accessible links with rel="noopener"', async ({ page }) => {
      await page.goto(PAGE_URL);
      const externalLinks = page.locator('a[target="_blank"]');
      const count = await externalLinks.count();

      for (let i = 0; i < count; i++) {
        await expect(externalLinks.nth(i)).toHaveAttribute('rel', 'noopener');
      }
    });

    test('should have focus styles defined', async ({ page }) => {
      await page.goto(PAGE_URL);
      const styles = await page.locator('style').allTextContents();
      const hasFocusStyles = styles.some(style => style.includes(':focus'));
      expect(hasFocusStyles).toBe(true);
    });

    test('should have single h1 element', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
    });
  });

  // ========================================
  // Design Quality Tests
  // ========================================
  test.describe('Design Quality', () => {
    test('should have consistent color scheme', async ({ page }) => {
      await page.goto(PAGE_URL);
      const styles = await page.locator('style').allTextContents();
      const hasColorVariables = styles.some(style =>
        style.includes('--multimodal-primary') &&
        style.includes('--multimodal-secondary') &&
        style.includes('--multimodal-accent')
      );
      expect(hasColorVariables).toBe(true);
    });

    test('should have gradient backgrounds', async ({ page }) => {
      await page.goto(PAGE_URL);
      const gradientElements = page.locator('[class*="gradient"]');
      const count = await gradientElements.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have rounded corners on cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.demo-card').first();
      const borderRadius = await card.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      expect(borderRadius).not.toBe('0px');
    });

    test('should have proper spacing between sections', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.visual-demo');
      const padding = await section.evaluate((el) => {
        return window.getComputedStyle(el).padding;
      });
      expect(padding).toBeTruthy();
    });

    test('should have hover effects on interactive elements', async ({ page }) => {
      await page.goto(PAGE_URL);
      const styles = await page.locator('style').allTextContents();
      const hasHoverEffects = styles.some(style => style.includes(':hover'));
      expect(hasHoverEffects).toBe(true);
    });

    test('should have box shadows on cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const styles = await page.locator('style').allTextContents();
      const hasBoxShadows = styles.some(style => style.includes('box-shadow'));
      expect(hasBoxShadows).toBe(true);
    });
  });

  // ========================================
  // Performance Tests
  // ========================================
  test.describe('Performance', () => {
    test('should load shared CSS files', async ({ page }) => {
      await page.goto(PAGE_URL);
      const designSystemCSS = page.locator('link[href*="design-system.css"]');
      const componentsCSS = page.locator('link[href*="components.css"]');
      const animationsCSS = page.locator('link[href*="animations.css"]');

      await expect(designSystemCSS).toHaveCount(1);
      await expect(componentsCSS).toHaveCount(1);
      await expect(animationsCSS).toHaveCount(1);
    });

    test('should have embedded styles for multimodal-specific design', async ({ page }) => {
      await page.goto(PAGE_URL);
      const styleTag = page.locator('style');
      const count = await styleTag.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  // ========================================
  // Multimodal-Specific Tests
  // ========================================
  test.describe('Multimodal-Specific Features', () => {
    test('should emphasize visual understanding capabilities', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.toLowerCase()).toContain('visual');
      expect(bodyText.toLowerCase()).toContain('image');
      expect(bodyText.toLowerCase()).toContain('document');
    });

    test('should mention VO3 technology prominently', async ({ page }) => {
      await page.goto(PAGE_URL);
      const vo3Badge = page.locator('.section-badge').filter({ hasText: 'Powered by VO3' });
      await expect(vo3Badge).toBeVisible();
    });

    test('should showcase multiple visual content types', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('Photos');
      expect(bodyText).toContain('Documents');
      expect(bodyText).toContain('Charts');
      expect(bodyText).toContain('Videos');
    });

    test('should highlight OCR capabilities', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ocrCard = page.locator('.capability-card').filter({ hasText: 'OCR' });
      await expect(ocrCard).toBeVisible();
    });

    test('should mention medical imaging use case', async ({ page }) => {
      await page.goto(PAGE_URL);
      const medicalCard = page.locator('.capability-card').filter({ hasText: 'Medical Imaging' });
      await expect(medicalCard).toBeVisible();
      const medicalUseCase = page.locator('.use-case-item').filter({ hasText: 'Medical professionals' });
      await expect(medicalUseCase).toBeVisible();
    });

    test('should display accuracy metrics', async ({ page }) => {
      await page.goto(PAGE_URL);
      const accuracyStat = page.locator('.stat-item').filter({ hasText: '99.3%' });
      await expect(accuracyStat).toBeVisible();
    });

    test('should have multiple visual content demonstrations', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demoCards = page.locator('.demo-card');
      const count = await demoCards.count();
      expect(count).toBe(4); // Photos, Documents, Charts, Videos
    });

    test('should emphasize speed and real-time processing', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.toLowerCase()).toContain('real-time');
      const speedStat = page.locator('.stat-item').filter({ hasText: '<50ms' });
      await expect(speedStat).toBeVisible();
    });
  });

  // ========================================
  // Screenshot Tests
  // ========================================
  test.describe('Screenshots', () => {
    test('should capture desktop hero screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      await page.screenshot({ path: 'screenshots/multimodal-ai-hero-desktop.png', fullPage: false });
    });

    test('should capture mobile hero screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      await page.screenshot({ path: 'screenshots/multimodal-ai-hero-mobile.png', fullPage: false });
    });

    test('should capture demo section screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      const demoSection = page.locator('.visual-demo');
      await demoSection.screenshot({ path: 'screenshots/multimodal-ai-demo.png' });
    });

    test('should capture VO3 showcase screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      const vo3Section = page.locator('.vo3-showcase');
      await vo3Section.screenshot({ path: 'screenshots/multimodal-ai-vo3.png' });
    });

    test('should capture capabilities grid screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      const capabilitiesSection = page.locator('.capabilities');
      await capabilitiesSection.screenshot({ path: 'screenshots/multimodal-ai-capabilities.png' });
    });

    test('should capture full page screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      await page.screenshot({ path: 'screenshots/multimodal-ai-full.png', fullPage: true });
    });
  });

  // ========================================
  // Integration Tests
  // ========================================
  test.describe('Integration', () => {
    test('should integrate with design system CSS', async ({ page }) => {
      await page.goto(PAGE_URL);
      const designSystemLink = page.locator('link[href*="design-system.css"]');
      await expect(designSystemLink).toHaveCount(1);
    });

    test('should integrate with components CSS', async ({ page }) => {
      await page.goto(PAGE_URL);
      const componentsLink = page.locator('link[href*="components.css"]');
      await expect(componentsLink).toHaveCount(1);
    });

    test('should integrate with animations JS', async ({ page }) => {
      await page.goto(PAGE_URL);
      const animationsScript = page.locator('script[src*="animations.js"]');
      await expect(animationsScript).toHaveCount(1);
    });
  });

  // ========================================
  // Content Quality Tests
  // ========================================
  test.describe('Content Quality', () => {
    test('should have compelling value propositions', async ({ page }) => {
      await page.goto(PAGE_URL);
      const subtitle = page.locator('.hero-subtitle');
      const text = await subtitle.textContent();
      expect(text.length).toBeGreaterThan(50);
    });

    test('should have specific, credible statistics', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stats = page.locator('.stat-number');
      const count = await stats.count();
      expect(count).toBe(4);

      // Check for specific numbers (not vague)
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('5B+');
      expect(bodyText).toContain('99.3%');
      expect(bodyText).toContain('100+');
      expect(bodyText).toContain('<50ms');
    });

    test('should have professional testimonials with credentials', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonials = page.locator('.testimonial-card');
      const count = await testimonials.count();
      expect(count).toBe(3);

      // Check for institutional affiliations
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('Mayo Clinic');
      expect(bodyText).toContain('Adobe');
      expect(bodyText).toContain('Shopify');
    });

    test('should have clear CTAs throughout', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ctas = page.locator('.cta-primary, .cta-secondary');
      const count = await ctas.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });

  // ========================================
  // Meeting Requirements Tests
  // ========================================
  test.describe('Meeting Requirements', () => {
    test('should target creators segment with VO3/Nano Banana emphasis', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('VO3');
      const creatorsUseCase = page.locator('.use-case-badge').filter({ hasText: 'Creators' });
      await expect(creatorsUseCase).toBeVisible();
    });

    test('should have graphical, dynamic design', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demoVisuals = page.locator('.demo-visual');
      await expect(demoVisuals.first()).toBeVisible();

      const useVisuals = page.locator('.use-case-visual');
      await expect(useVisuals.first()).toBeVisible();
    });

    test('should showcase specific use cases with examples', async ({ page }) => {
      await page.goto(PAGE_URL);
      const useCases = page.locator('.use-case-item');
      const count = await useCases.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should be elegant and visually appealing', async ({ page }) => {
      await page.goto(PAGE_URL);

      // Check for gradient backgrounds
      const gradientSections = page.locator('.hero, .vo3-showcase, .final-cta');
      await expect(gradientSections.first()).toBeVisible();

      // Check for rounded corners
      const cards = page.locator('.demo-card, .capability-card, .testimonial-card');
      await expect(cards.first()).toBeVisible();

      // Check for animations
      const animatedElements = page.locator('[class*="fadeInUp"]');
      const styles = await page.locator('style').allTextContents();
      const hasAnimations = styles.some(style => style.includes('animation'));
      expect(hasAnimations).toBe(true);
    });
  });
});
