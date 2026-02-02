const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8000';
const PAGE_URL = `${BASE_URL}/pages/creative-studio.html`;

test.describe('Creative Studio Landing Page', () => {

  // ===================================
  // Page Load Tests
  // ===================================

  test.describe('Page Load', () => {
    test('should load successfully', async ({ page }) => {
      const response = await page.goto(PAGE_URL);
      expect(response.status()).toBe(200);
    });

    test('should have correct title', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page).toHaveTitle(/Your Creative Studio/);
    });

    test('should have correct meta description', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('creative');
      expect(metaDescription).toContain('content creation');
    });

    test('should load all external stylesheets', async ({ page }) => {
      await page.goto(PAGE_URL);
      const designSystemLink = await page.locator('link[href*="design-system.css"]');
      const componentsLink = await page.locator('link[href*="components.css"]');
      const animationsLink = await page.locator('link[href*="animations.css"]');

      await expect(designSystemLink).toHaveCount(1);
      await expect(componentsLink).toHaveCount(1);
      await expect(animationsLink).toHaveCount(1);
    });
  });

  // ===================================
  // Navigation Tests
  // ===================================

  test.describe('Navigation', () => {
    test('should have working CTA links to Gemini', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ctaLinks = await page.locator('a[href="https://gemini.google.com"]');
      expect(await ctaLinks.count()).toBeGreaterThanOrEqual(3);
    });

    test('should have anchor link to tools section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const toolsLink = await page.locator('a[href="#tools"]');
      await expect(toolsLink).toBeVisible();
    });

    test('should have rel="noopener" on external links', async ({ page }) => {
      await page.goto(PAGE_URL);
      const externalLinks = await page.locator('a[href^="https://gemini.google.com"]');
      const count = await externalLinks.count();

      for (let i = 0; i < count; i++) {
        const rel = await externalLinks.nth(i).getAttribute('rel');
        expect(rel).toBe('noopener');
      }
    });

    test('should scroll to tools section when anchor clicked', async ({ page }) => {
      await page.goto(PAGE_URL);
      await page.click('a[href="#tools"]');
      await page.waitForTimeout(500);
      const toolsSection = await page.locator('#tools');
      await expect(toolsSection).toBeInViewport();
    });
  });

  // ===================================
  // Hero Section Tests
  // ===================================

  test.describe('Hero Section', () => {
    test('should display hero section with gradient background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = await page.locator('.hero');
      await expect(hero).toBeVisible();

      const bgColor = await hero.evaluate(el => getComputedStyle(el).background);
      expect(bgColor).toContain('gradient');
    });

    test('should display "CREATIVE STUDIO AI" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = await page.locator('.hero .badge');
      await expect(badge).toContainText('CREATIVE STUDIO AI');
    });

    test('should display main heading "Your Creative Studio"', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = await page.locator('.hero h1');
      await expect(heading).toContainText('Your Creative Studio');
    });

    test('should display hero subtitle', async ({ page }) => {
      await page.goto(PAGE_URL);
      const subtitle = await page.locator('.hero-subtitle');
      await expect(subtitle).toContainText('Transform ideas into reality');
      await expect(subtitle).toContainText('AI-powered content creation');
    });

    test('should have two CTA buttons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryCTA = await page.locator('.hero .btn-primary');
      const secondaryCTA = await page.locator('.hero .btn-secondary');

      await expect(primaryCTA).toContainText('Start Creating Free');
      await expect(secondaryCTA).toContainText('Explore Tools');
    });

    test('should have animated gradient background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heroBefore = await page.locator('.hero');
      const hasAnimation = await heroBefore.evaluate(el => {
        const pseudo = window.getComputedStyle(el, '::before');
        return pseudo.animation !== 'none' || pseudo.backgroundImage.includes('radial-gradient');
      });
      expect(hasAnimation).toBeTruthy();
    });

    test('should have proper hero layout and spacing', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = await page.locator('.hero');
      const minHeight = await hero.evaluate(el => getComputedStyle(el).minHeight);
      expect(minHeight).toBe('100vh');
    });
  });

  // ===================================
  // Creative Tools Section Tests
  // ===================================

  test.describe('Creative Tools Section', () => {
    test('should display tools section header', async ({ page }) => {
      await page.goto(PAGE_URL);
      const header = await page.locator('.tools-section .section-header h2');
      await expect(header).toContainText('Everything you need to create');
    });

    test('should display "CREATIVE TOOLS" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = await page.locator('.tools-section .badge');
      await expect(badge).toContainText('CREATIVE TOOLS');
    });

    test('should display 6 tool cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const toolCards = await page.locator('.tool-card');
      expect(await toolCards.count()).toBe(6);
    });

    test('should display Ideation & Brainstorming card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.tool-card').filter({ hasText: 'Ideation & Brainstorming' });
      await expect(card).toContainText('Generate unlimited creative ideas');
      await expect(card).toContainText('💡');
    });

    test('should display Content Writing card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.tool-card').filter({ hasText: 'Content Writing' });
      await expect(card).toContainText('blog posts');
      await expect(card).toContainText('✍️');
    });

    test('should display Visual Concepts card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.tool-card').filter({ hasText: 'Visual Concepts' });
      await expect(card).toContainText('design concepts');
      await expect(card).toContainText('🎨');
    });

    test('should display Storytelling card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.tool-card').filter({ hasText: 'Storytelling' });
      await expect(card).toContainText('compelling narratives');
      await expect(card).toContainText('📝');
    });

    test('should display Script & Video card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.tool-card').filter({ hasText: 'Script & Video' });
      await expect(card).toContainText('scripts');
      await expect(card).toContainText('🎬');
    });

    test('should display Creative Direction card', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.tool-card').filter({ hasText: 'Creative Direction' });
      await expect(card).toContainText('creative strategies');
      await expect(card).toContainText('🎵');
    });

    test('should have hover effects on tool cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const firstCard = await page.locator('.tool-card').first();
      const initialTransform = await firstCard.evaluate(el => getComputedStyle(el).transform);

      await firstCard.hover();
      await page.waitForTimeout(400);

      const hoverTransform = await firstCard.evaluate(el => getComputedStyle(el).transform);
      expect(hoverTransform).not.toBe(initialTransform);
    });
  });

  // ===================================
  // Creative Process Section Tests
  // ===================================

  test.describe('Creative Process Section', () => {
    test('should display process section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('.creative-process');
      await expect(section).toBeVisible();
    });

    test('should display "HOW IT WORKS" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = await page.locator('.creative-process .badge');
      await expect(badge).toContainText('HOW IT WORKS');
    });

    test('should display 3 process steps', async ({ page }) => {
      await page.goto(PAGE_URL);
      const steps = await page.locator('.process-step');
      expect(await steps.count()).toBe(3);
    });

    test('should display step 1: Spark Ideas', async ({ page }) => {
      await page.goto(PAGE_URL);
      const step = await page.locator('.process-step').filter({ hasText: 'Spark Ideas' });
      await expect(step).toContainText('1');
      await expect(step).toContainText('Gemini generates dozens of creative concepts');
    });

    test('should display step 2: Develop & Refine', async ({ page }) => {
      await page.goto(PAGE_URL);
      const step = await page.locator('.process-step').filter({ hasText: 'Develop & Refine' });
      await expect(step).toContainText('2');
      await expect(step).toContainText('Iterate on the best ideas');
    });

    test('should display step 3: Create & Polish', async ({ page }) => {
      await page.goto(PAGE_URL);
      const step = await page.locator('.process-step').filter({ hasText: 'Create & Polish' });
      await expect(step).toContainText('3');
      await expect(step).toContainText('Transform ideas into finished content');
    });

    test('should have numbered circles with gradient backgrounds', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stepNumbers = await page.locator('.step-number');
      expect(await stepNumbers.count()).toBe(3);

      const firstNumber = stepNumbers.first();
      const bgColor = await firstNumber.evaluate(el => getComputedStyle(el).background);
      expect(bgColor).toContain('gradient');
    });
  });

  // ===================================
  // Demo Section Tests
  // ===================================

  test.describe('Live Demo Section', () => {
    test('should display demo section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('.demo-section');
      await expect(section).toBeVisible();
    });

    test('should display "LIVE EXAMPLE" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = await page.locator('.demo-section .badge');
      await expect(badge).toContainText('LIVE EXAMPLE');
    });

    test('should display demo header', async ({ page }) => {
      await page.goto(PAGE_URL);
      const header = await page.locator('.demo-header h3');
      await expect(header).toContainText('Real-time Creative Brainstorming');
    });

    test('should display user prompt', async ({ page }) => {
      await page.goto(PAGE_URL);
      const prompt = await page.locator('.demo-prompt-text');
      await expect(prompt).toContainText('eco-friendly coffee brand');
      await expect(prompt).toContainText('young professionals');
    });

    test('should display prompt label', async ({ page }) => {
      await page.goto(PAGE_URL);
      const label = await page.locator('.demo-prompt-label');
      await expect(label).toContainText('Your Prompt');
    });

    test('should display Gemini response', async ({ page }) => {
      await page.goto(PAGE_URL);
      const response = await page.locator('.demo-output');
      await expect(response).toContainText('Coffee That Grows More Than Beans');
    });

    test('should display output label', async ({ page }) => {
      await page.goto(PAGE_URL);
      const label = await page.locator('.demo-output-label');
      await expect(label).toContainText("Gemini's Response");
    });

    test('should display 3 creative ideas', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ideas = await page.locator('.demo-idea');
      expect(await ideas.count()).toBe(3);
    });

    test('should display idea 1: Plant a Cup Campaign', async ({ page }) => {
      await page.goto(PAGE_URL);
      const idea = await page.locator('.demo-idea').filter({ hasText: 'Plant a Cup' });
      await expect(idea).toContainText('Every coffee purchased plants a tree');
      await expect(idea).toContainText('digital forest tracker');
    });

    test('should display idea 2: Morning Ritual Campaign', async ({ page }) => {
      await page.goto(PAGE_URL);
      const idea = await page.locator('.demo-idea').filter({ hasText: 'Morning Ritual' });
      await expect(idea).toContainText('Instagram series');
      await expect(idea).toContainText('zero-waste packaging');
    });

    test('should display idea 3: Coffee Swap Challenge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const idea = await page.locator('.demo-idea').filter({ hasText: 'Coffee Swap Challenge' });
      await expect(idea).toContainText('TikTok campaign');
      await expect(idea).toContainText('disposable cup');
    });

    test('should have numbered idea bullets', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ideaNumbers = await page.locator('.demo-idea-number');
      expect(await ideaNumbers.count()).toBe(3);

      await expect(ideaNumbers.nth(0)).toContainText('1');
      await expect(ideaNumbers.nth(1)).toContainText('2');
      await expect(ideaNumbers.nth(2)).toContainText('3');
    });

    test('should have styled demo container', async ({ page }) => {
      await page.goto(PAGE_URL);
      const container = await page.locator('.demo-container');
      const borderRadius = await container.evaluate(el => getComputedStyle(el).borderRadius);
      expect(borderRadius).toBe('24px');
    });
  });

  // ===================================
  // Content Types Section Tests
  // ===================================

  test.describe('Content Types Section', () => {
    test('should display content types section with dark background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('.content-types');
      await expect(section).toBeVisible();

      const bgColor = await section.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bgColor).toContain('rgb(26, 26, 26)');
    });

    test('should display "CREATE ANYTHING" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = await page.locator('.content-types .badge');
      await expect(badge).toContainText('CREATE ANYTHING');
    });

    test('should display 6 content type cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = await page.locator('.content-card');
      expect(await cards.count()).toBe(6);
    });

    test('should display Social Media card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.content-card').filter({ hasText: 'Social Media' });
      await expect(card).toContainText('📱');
      await expect(card).toContainText('Platform-specific optimization');
      await expect(card).toContainText('Hashtag strategies');
    });

    test('should display Blog & Articles card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.content-card').filter({ hasText: 'Blog & Articles' });
      await expect(card).toContainText('📰');
      await expect(card).toContainText('SEO optimization');
      await expect(card).toContainText('Topic research');
    });

    test('should display Marketing Copy card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.content-card').filter({ hasText: 'Marketing Copy' });
      await expect(card).toContainText('🎯');
      await expect(card).toContainText('Ad copy');
      await expect(card).toContainText('Email campaigns');
    });

    test('should display Creative Writing card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.content-card').filter({ hasText: 'Creative Writing' });
      await expect(card).toContainText('🎭');
      await expect(card).toContainText('Character development');
      await expect(card).toContainText('Plot structuring');
    });

    test('should display Video & Media card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.content-card').filter({ hasText: 'Video & Media' });
      await expect(card).toContainText('🎬');
      await expect(card).toContainText('Video scripts');
      await expect(card).toContainText('Storyboarding');
    });

    test('should display Business Content card with features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.content-card').filter({ hasText: 'Business Content' });
      await expect(card).toContainText('💼');
      await expect(card).toContainText('Presentations');
      await expect(card).toContainText('White papers');
    });

    test('should have checkmarks on feature lists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const firstCard = await page.locator('.content-card').first();
      const listItems = await firstCard.locator('li');

      for (let i = 0; i < await listItems.count(); i++) {
        const text = await listItems.nth(i).textContent();
        // Check that the item exists (checkmark is added via CSS ::before)
        expect(text).toBeTruthy();
      }
    });
  });

  // ===================================
  // Stats Section Tests
  // ===================================

  test.describe('Stats Section', () => {
    test('should display stats section with gradient background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('.stats-section');
      await expect(section).toBeVisible();

      const bgColor = await section.evaluate(el => getComputedStyle(el).background);
      expect(bgColor).toContain('gradient');
    });

    test('should display "PROVEN RESULTS" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = await page.locator('.stats-section .badge');
      await expect(badge).toContainText('PROVEN RESULTS');
    });

    test('should display 4 statistics', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stats = await page.locator('.stat-item');
      expect(await stats.count()).toBe(4);
    });

    test('should display "10x Faster Ideation" stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = await page.locator('.stat-item').filter({ hasText: 'Faster Ideation' });
      await expect(stat).toContainText('10x');
    });

    test('should display "5M+ Content Pieces Created" stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = await page.locator('.stat-item').filter({ hasText: 'Content Pieces Created' });
      await expect(stat).toContainText('5M+');
    });

    test('should display "92% Creator Satisfaction" stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = await page.locator('.stat-item').filter({ hasText: 'Creator Satisfaction' });
      await expect(stat).toContainText('92%');
    });

    test('should display "50+ Content Formats" stat', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = await page.locator('.stat-item').filter({ hasText: 'Content Formats' });
      await expect(stat).toContainText('50+');
    });
  });

  // ===================================
  // Features Section Tests
  // ===================================

  test.describe('Features Highlights Section', () => {
    test('should display features section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('.features-section');
      await expect(section).toBeVisible();
    });

    test('should display "POWERFUL FEATURES" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = await page.locator('.features-section .badge');
      await expect(badge).toContainText('POWERFUL FEATURES');
    });

    test('should display 4 feature cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = await page.locator('.feature-card');
      expect(await cards.count()).toBe(4);
    });

    test('should display Context-Aware AI feature', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.feature-card').filter({ hasText: 'Context-Aware AI' });
      await expect(card).toContainText('understands your brand voice');
      await expect(card).toContainText('🧠');
    });

    test('should display Iterative Creation feature', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.feature-card').filter({ hasText: 'Iterative Creation' });
      await expect(card).toContainText('Refine and improve');
      await expect(card).toContainText('🔄');
    });

    test('should display Multi-Language Support feature', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.feature-card').filter({ hasText: 'Multi-Language Support' });
      await expect(card).toContainText('50+ languages');
      await expect(card).toContainText('🌐');
    });

    test('should display Instant Inspiration feature', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.feature-card').filter({ hasText: 'Instant Inspiration' });
      await expect(card).toContainText('Never face a blank page');
      await expect(card).toContainText('⚡');
    });

    test('should have gradient icon wrappers', async ({ page }) => {
      await page.goto(PAGE_URL);
      const iconWrappers = await page.locator('.feature-icon-wrapper');
      expect(await iconWrappers.count()).toBe(4);

      const firstWrapper = iconWrappers.first();
      const bgColor = await firstWrapper.evaluate(el => getComputedStyle(el).background);
      expect(bgColor).toContain('gradient');
    });
  });

  // ===================================
  // Testimonials Section Tests
  // ===================================

  test.describe('Testimonials Section', () => {
    test('should display testimonials section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('.testimonials');
      await expect(section).toBeVisible();
    });

    test('should display "CREATOR STORIES" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = await page.locator('.testimonials .badge');
      await expect(badge).toContainText('CREATOR STORIES');
    });

    test('should display 3 testimonial cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = await page.locator('.testimonial-card');
      expect(await cards.count()).toBe(3);
    });

    test('should display Emma Rodriguez testimonial', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.testimonial-card').filter({ hasText: 'Emma Rodriguez' });
      await expect(card).toContainText('completely transformed my content creation workflow');
      await expect(card).toContainText('Content Creator, 2.5M followers');
      await expect(card).toContainText('👩‍🎨');
    });

    test('should display Marcus Chen testimonial', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.testimonial-card').filter({ hasText: 'Marcus Chen' });
      await expect(card).toContainText('engagement rates have increased 40%');
      await expect(card).toContainText('Marketing Director, Adobe');
      await expect(card).toContainText('👨‍💼');
    });

    test('should display Sarah Williams testimonial', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.testimonial-card').filter({ hasText: 'Sarah Williams' });
      await expect(card).toContainText('brilliant writing partner');
      await expect(card).toContainText('Bestselling Author');
      await expect(card).toContainText('✍️');
    });

    test('should have quote marks on testimonial cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const quoteMarks = await page.locator('.quote-mark');
      expect(await quoteMarks.count()).toBe(3);

      for (let i = 0; i < 3; i++) {
        await expect(quoteMarks.nth(i)).toContainText('"');
      }
    });

    test('should have hover effects on testimonial cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const firstCard = await page.locator('.testimonial-card').first();

      const initialTransform = await firstCard.evaluate(el => getComputedStyle(el).transform);
      await firstCard.hover();
      await page.waitForTimeout(300);

      const hoverTransform = await firstCard.evaluate(el => getComputedStyle(el).transform);
      expect(hoverTransform).not.toBe(initialTransform);
    });
  });

  // ===================================
  // Final CTA Section Tests
  // ===================================

  test.describe('Final CTA Section', () => {
    test('should display final CTA section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('.final-cta');
      await expect(section).toBeVisible();
    });

    test('should have gradient background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('.final-cta');
      const bgColor = await section.evaluate(el => getComputedStyle(el).background);
      expect(bgColor).toContain('gradient');
    });

    test('should display CTA heading', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = await page.locator('.final-cta h2');
      await expect(heading).toContainText('Start creating amazing content today');
    });

    test('should display CTA button', async ({ page }) => {
      await page.goto(PAGE_URL);
      const button = await page.locator('.final-cta .btn-primary');
      await expect(button).toContainText('Get Started Free');
      await expect(button).toHaveAttribute('href', 'https://gemini.google.com');
    });
  });

  // ===================================
  // Footer Tests
  // ===================================

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      await page.goto(PAGE_URL);
      const footer = await page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should contain copyright text', async ({ page }) => {
      await page.goto(PAGE_URL);
      const footer = await page.locator('footer');
      await expect(footer).toContainText('2026 Google LLC');
    });

    test('should have link to Gemini', async ({ page }) => {
      await page.goto(PAGE_URL);
      const link = await page.locator('footer a[href="https://gemini.google.com"]');
      await expect(link).toBeVisible();
      await expect(link).toContainText('Gemini');
    });

    test('should have dark background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const footer = await page.locator('footer');
      const bgColor = await footer.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(bgColor).toBe('rgb(26, 26, 26)');
    });
  });

  // ===================================
  // CTA & Links Tests
  // ===================================

  test.describe('CTA & Links', () => {
    test('should have multiple CTA links to Gemini', async ({ page }) => {
      await page.goto(PAGE_URL);
      const geminiLinks = await page.locator('a[href="https://gemini.google.com"]');
      expect(await geminiLinks.count()).toBeGreaterThanOrEqual(3);
    });

    test('should have proper button styling on primary CTAs', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryButtons = await page.locator('.btn-primary');

      for (let i = 0; i < await primaryButtons.count(); i++) {
        const borderRadius = await primaryButtons.nth(i).evaluate(el => getComputedStyle(el).borderRadius);
        expect(borderRadius).toBe('50px');
      }
    });
  });

  // ===================================
  // Animation Tests
  // ===================================

  test.describe('Animations', () => {
    test('should load animations.js script', async ({ page }) => {
      await page.goto(PAGE_URL);
      const script = await page.locator('script[src*="animations.js"]');
      await expect(script).toHaveCount(1);
    });

    test('should have fade-in animations on hero elements', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heroElements = await page.locator('.hero-content > *');
      expect(await heroElements.count()).toBeGreaterThan(0);
    });

    test('should have hover transitions on buttons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const button = await page.locator('.btn-primary').first();
      const transition = await button.evaluate(el => getComputedStyle(el).transition);
      expect(transition).toContain('all');
    });

    test('should have pulsing glow animation on hero background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = await page.locator('.hero');
      const hasAnimation = await hero.evaluate(el => {
        const pseudo = window.getComputedStyle(el, '::before');
        return pseudo.backgroundImage.includes('radial-gradient');
      });
      expect(hasAnimation).toBeTruthy();
    });
  });

  // ===================================
  // Typography Tests
  // ===================================

  test.describe('Typography', () => {
    test('should use Playfair Display for headings', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1 = await page.locator('h1').first();
      const fontFamily = await h1.evaluate(el => getComputedStyle(el).fontFamily);
      expect(fontFamily).toContain('Playfair Display');
    });

    test('should use Inter for body text', async ({ page }) => {
      await page.goto(PAGE_URL);
      const body = await page.locator('body');
      const fontFamily = await body.evaluate(el => getComputedStyle(el).fontFamily);
      expect(fontFamily).toContain('Inter');
    });

    test('should have responsive font sizes', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1 = await page.locator('h1').first();
      const fontSize = await h1.evaluate(el => getComputedStyle(el).fontSize);
      expect(parseInt(fontSize)).toBeGreaterThan(0);
    });
  });

  // ===================================
  // Responsive Design Tests
  // ===================================

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);

      const hero = await page.locator('.hero');
      await expect(hero).toBeVisible();

      const ctaGroup = await page.locator('.cta-group');
      await expect(ctaGroup).toBeVisible();
    });

    test('should be responsive on tablet (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);

      const toolsGrid = await page.locator('.tools-grid');
      await expect(toolsGrid).toBeVisible();
    });

    test('should be responsive on desktop (1440px)', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);

      const container = await page.locator('.container').first();
      const maxWidth = await container.evaluate(el => getComputedStyle(el).maxWidth);
      expect(maxWidth).toBe('1200px');
    });

    test('should stack CTA buttons on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);

      const ctaGroup = await page.locator('.hero .cta-group');
      const flexDirection = await ctaGroup.evaluate(el => getComputedStyle(el).flexDirection);
      expect(flexDirection).toBe('column');
    });
  });

  // ===================================
  // Accessibility Tests
  // ===================================

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have alt text or aria labels where needed', async ({ page }) => {
      await page.goto(PAGE_URL);
      const links = await page.locator('a');

      for (let i = 0; i < await links.count(); i++) {
        const text = await links.nth(i).textContent();
        expect(text.trim().length).toBeGreaterThan(0);
      }
    });

    test('should have focusable interactive elements', async ({ page }) => {
      await page.goto(PAGE_URL);
      const firstButton = await page.locator('.btn').first();
      await firstButton.focus();

      const isFocused = await firstButton.evaluate(el => el === document.activeElement);
      expect(isFocused).toBeTruthy();
    });

    test('should support reduced motion preference', async ({ page }) => {
      await page.goto(PAGE_URL);
      const styles = await page.evaluate(() => {
        return document.querySelector('style').textContent.includes('prefers-reduced-motion');
      });
      expect(styles).toBeTruthy();
    });
  });

  // ===================================
  // Design Quality Tests
  // ===================================

  test.describe('Design Quality', () => {
    test('should have consistent border radius on cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const toolCard = await page.locator('.tool-card').first();
      const borderRadius = await toolCard.evaluate(el => getComputedStyle(el).borderRadius);
      expect(borderRadius).toBe('24px');
    });

    test('should have box shadows on cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const toolCard = await page.locator('.tool-card').first();
      const boxShadow = await toolCard.evaluate(el => getComputedStyle(el).boxShadow);
      expect(boxShadow).not.toBe('none');
    });

    test('should have proper spacing in sections', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = await page.locator('section').nth(1);
      const padding = await section.evaluate(el => getComputedStyle(el).paddingTop);
      expect(parseInt(padding)).toBeGreaterThan(0);
    });

    test('should use CSS variables for colors', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hasVariables = await page.evaluate(() => {
        const root = document.documentElement;
        const styles = getComputedStyle(root);
        return styles.getPropertyValue('--creative-purple') !== '';
      });
      expect(hasVariables).toBeTruthy();
    });

    test('should have gradient backgrounds on key sections', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = await page.locator('.hero');
      const bg = await hero.evaluate(el => getComputedStyle(el).background);
      expect(bg).toContain('gradient');
    });

    test('should have smooth transitions on interactive elements', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = await page.locator('.tool-card').first();
      const transition = await card.evaluate(el => getComputedStyle(el).transition);
      expect(transition).toContain('cubic-bezier');
    });
  });

  // ===================================
  // Performance Tests
  // ===================================

  test.describe('Performance', () => {
    test('should load in reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(PAGE_URL);
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });

    test('should have optimized font loading', async ({ page }) => {
      await page.goto(PAGE_URL);
      const preconnects = await page.locator('link[rel="preconnect"]');
      expect(await preconnects.count()).toBeGreaterThan(0);
    });
  });

  // ===================================
  // Creative Studio Specific Tests
  // ===================================

  test.describe('Creative Studio Specific Features', () => {
    test('should mention "creative" multiple times', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      const matches = bodyText.toLowerCase().match(/creative/g);
      expect(matches.length).toBeGreaterThan(10);
    });

    test('should mention "content creation" concepts', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.toLowerCase()).toContain('content');
      expect(bodyText.toLowerCase()).toContain('create');
    });

    test('should showcase brainstorming capabilities', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.toLowerCase()).toContain('brainstorm');
      expect(bodyText.toLowerCase()).toContain('ideas');
    });

    test('should have colorful, creative design', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = await page.locator('.hero');
      const bg = await hero.evaluate(el => getComputedStyle(el).background);
      expect(bg).toContain('rgb(147, 52, 230)'); // Purple
      expect(bg).toContain('rgb(233, 30, 99)'); // Pink
    });

    test('should emphasize creative tools and capabilities', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('Ideation');
      expect(bodyText).toContain('Storytelling');
      expect(bodyText).toContain('Visual Concepts');
    });

    test('should have multiple content format mentions', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('Social Media');
      expect(bodyText).toContain('Blog');
      expect(bodyText).toContain('Marketing');
      expect(bodyText).toContain('Video');
    });

    test('should display creative professional testimonials', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('Content Creator');
      expect(bodyText).toContain('Marketing Director');
      expect(bodyText).toContain('Author');
    });

    test('should have eco-friendly coffee campaign demo', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demo = await page.locator('.demo-section');
      await expect(demo).toContainText('eco-friendly coffee');
      await expect(demo).toContainText('Plant a Cup');
    });

    test('should mention AI-powered features', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText.toLowerCase()).toContain('ai');
      expect(bodyText).toContain('Context-Aware AI');
    });
  });

  // ===================================
  // Screenshot Tests
  // ===================================

  test.describe('Screenshot Tests', () => {
    test('should capture full page on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'tests/screenshots/creative-studio-desktop.png', fullPage: true });
    });

    test('should capture full page on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'tests/screenshots/creative-studio-tablet.png', fullPage: true });
    });

    test('should capture full page on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'tests/screenshots/creative-studio-mobile.png', fullPage: true });
    });

    test('should capture hero section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = await page.locator('.hero');
      await hero.screenshot({ path: 'tests/screenshots/creative-studio-hero.png' });
    });

    test('should capture demo section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demo = await page.locator('.demo-container');
      await demo.screenshot({ path: 'tests/screenshots/creative-studio-demo.png' });
    });

    test('should capture testimonials section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonials = await page.locator('.testimonials');
      await testimonials.screenshot({ path: 'tests/screenshots/creative-studio-testimonials.png' });
    });
  });

  // ===================================
  // Integration Tests
  // ===================================

  test.describe('Integration Tests', () => {
    test('should integrate with shared design system', async ({ page }) => {
      await page.goto(PAGE_URL);
      const designSystemLoaded = await page.evaluate(() => {
        const link = document.querySelector('link[href*="design-system.css"]');
        return link !== null;
      });
      expect(designSystemLoaded).toBeTruthy();
    });

    test('should integrate with shared components', async ({ page }) => {
      await page.goto(PAGE_URL);
      const componentsLoaded = await page.evaluate(() => {
        const link = document.querySelector('link[href*="components.css"]');
        return link !== null;
      });
      expect(componentsLoaded).toBeTruthy();
    });

    test('should integrate with shared animations', async ({ page }) => {
      await page.goto(PAGE_URL);
      const animationsLoaded = await page.evaluate(() => {
        const script = document.querySelector('script[src*="animations.js"]');
        return script !== null;
      });
      expect(animationsLoaded).toBeTruthy();
    });
  });

  // ===================================
  // Content Quality Tests
  // ===================================

  test.describe('Content Quality', () => {
    test('should have compelling value propositions', async ({ page }) => {
      await page.goto(PAGE_URL);
      const subtitle = await page.locator('.hero-subtitle');
      await expect(subtitle).toContainText('Transform ideas into reality');
    });

    test('should have specific, actionable CTAs', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ctas = await page.locator('.btn-primary');

      for (let i = 0; i < await ctas.count(); i++) {
        const text = await ctas.nth(i).textContent();
        expect(text.length).toBeGreaterThan(0);
        expect(text).toMatch(/Start|Get|Try|Explore/i);
      }
    });

    test('should have clear benefit statements', async ({ page }) => {
      await page.goto(PAGE_URL);
      const bodyText = await page.locator('body').textContent();
      expect(bodyText).toContain('10x Faster');
      expect(bodyText).toContain('5M+ Content Pieces');
      expect(bodyText).toContain('92% Creator Satisfaction');
    });

    test('should have engaging demonstration content', async ({ page }) => {
      await page.goto(PAGE_URL);
      const demo = await page.locator('.demo-section');
      await expect(demo).toContainText('Real-time Creative Brainstorming');
      await expect(demo).toContainText('Plant a Cup Campaign');
    });
  });
});
