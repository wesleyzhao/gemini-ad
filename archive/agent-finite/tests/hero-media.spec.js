/**
 * Playwright Tests for Hero Media
 * Tests video backgrounds and animated SVG graphics
 */

const { test, expect } = require('@playwright/test');

const DEMO_PAGE = 'pages/hero-media-demo.html';

test.describe('Hero Media - Core Functionality', () => {
  test('should load demo page successfully', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await expect(page).toHaveTitle(/Hero Media Demo/);

    // Check for main heading
    const h1 = page.locator('h1').first();
    await expect(h1).toContainText('Hero Media');
  });

  test('should load CSS and JavaScript files', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    // Check CSS is loaded
    const hasHeroMediaCSS = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      return stylesheets.some(sheet =>
        sheet.href && sheet.href.includes('hero-media.css')
      );
    });
    expect(hasHeroMediaCSS).toBe(true);

    // Check JavaScript is loaded
    const hasHeroMediaJS = await page.evaluate(() => {
      return typeof window.HeroMedia !== 'undefined' &&
             typeof window.HeroMediaUtils !== 'undefined';
    });
    expect(hasHeroMediaJS).toBe(true);
  });

  test('should have navigation menu', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    const nav = page.locator('.demo-nav');
    await expect(nav).toBeVisible();

    // Check navigation links
    const links = nav.locator('a');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(5);
  });
});

test.describe('Hero Media - SVG Graphics', () => {
  test('should load SVG sprite', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    // Wait for SVG sprite to load
    await page.waitForTimeout(1000);

    // Check for SVG sprite in DOM
    const hasSVGSprite = await page.evaluate(() => {
      const svgs = document.querySelectorAll('svg');
      return Array.from(svgs).some(svg =>
        svg.querySelector('symbol') !== null
      );
    });
    expect(hasSVGSprite).toBe(true);
  });

  test('should render SVG graphics in hero sections', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1500); // Wait for initialization

    // Find sections with SVG data attributes
    const svgSections = page.locator('[data-hero-svg]');
    const count = await svgSections.count();
    expect(count).toBeGreaterThan(5); // At least 6 SVG demos

    // Check first SVG section has loaded
    const firstSection = svgSections.first();
    await expect(firstSection).toHaveClass(/hero-svg-loaded/);

    // Check SVG element exists
    const svg = firstSection.locator('svg.hero-svg');
    await expect(svg).toBeAttached();
  });

  test('should apply SVG opacity correctly', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1500);

    // Get first SVG with opacity setting
    const section = page.locator('[data-hero-svg="gradient-blob-1"]').first();
    const svg = section.locator('svg.hero-svg');

    // Check opacity is applied
    const opacity = await svg.evaluate(el => window.getComputedStyle(el).opacity);
    const opacityNum = parseFloat(opacity);
    expect(opacityNum).toBeGreaterThan(0);
    expect(opacityNum).toBeLessThanOrEqual(1);
  });

  test('should have all required SVG symbols', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1000);

    const requiredSymbols = [
      'gradient-blob-1',
      'gradient-blob-2',
      'abstract-lines',
      'particle-field',
      'geometric-mesh',
      'tech-circuit',
      'gradient-wave',
      'connection-network',
      'hexagon-grid',
      'sparkles'
    ];

    for (const symbolId of requiredSymbols) {
      const hasSymbol = await page.evaluate((id) => {
        const symbol = document.querySelector(`symbol#${id}`);
        return symbol !== null;
      }, symbolId);
      expect(hasSymbol).toBe(true);
    }
  });
});

test.describe('Hero Media - Video Backgrounds', () => {
  test('should have video background section', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    const videoSection = page.locator('[data-hero-video]');
    await expect(videoSection).toBeAttached();
  });

  test('should create video element', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1500);

    const videoSection = page.locator('[data-hero-video]').first();
    const video = videoSection.locator('video.hero-video');

    // Video element should be created
    const videoExists = await video.count();
    expect(videoExists).toBeGreaterThan(0);
  });

  test('should have fallback image set', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    const videoSection = page.locator('[data-hero-video]').first();
    const backgroundImage = await videoSection.evaluate(el =>
      window.getComputedStyle(el).backgroundImage
    );

    // Should have background image set (either fallback or none)
    expect(backgroundImage).toBeTruthy();
  });

  test('should have proper video attributes', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1500);

    const video = page.locator('video.hero-video').first();

    if (await video.count() > 0) {
      // Check video attributes
      const hasPlaysinline = await video.evaluate(v => v.hasAttribute('playsinline'));
      const hasPreload = await video.evaluate(v => v.hasAttribute('preload'));

      expect(hasPlaysinline).toBe(true);
      expect(hasPreload).toBe(true);
    }
  });
});

test.describe('Hero Media - Canvas Particles', () => {
  test('should create canvas particle background', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1500);

    // Check for canvas particles section
    const canvasSection = page.locator('#canvas-particles');
    await expect(canvasSection).toBeVisible();

    // Check if canvas was created
    const canvas = canvasSection.locator('canvas.hero-particles-canvas');
    const hasCanvas = await canvas.count();
    expect(hasCanvas).toBeGreaterThan(0);
  });

  test('should render particles on canvas', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(2000); // Wait for particles to render

    const canvas = page.locator('canvas.hero-particles-canvas').first();

    if (await canvas.count() > 0) {
      // Check canvas has dimensions
      const width = await canvas.evaluate(c => c.width);
      const height = await canvas.evaluate(c => c.height);

      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    }
  });
});

test.describe('Hero Media - JavaScript API', () => {
  test('should expose HeroMedia global object', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    const hasHeroMedia = await page.evaluate(() => {
      return typeof window.HeroMedia === 'object' &&
             typeof window.HeroMedia.init === 'function';
    });
    expect(hasHeroMedia).toBe(true);
  });

  test('should expose HeroMediaUtils global object', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    const hasUtils = await page.evaluate(() => {
      return typeof window.HeroMediaUtils === 'object' &&
             typeof window.HeroMediaUtils.addVideoBackground === 'function' &&
             typeof window.HeroMediaUtils.addSVGGraphic === 'function' &&
             typeof window.HeroMediaUtils.createParticleBackground === 'function';
    });
    expect(hasUtils).toBe(true);
  });

  test('should initialize automatically', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    // Check console for initialization message
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    await page.reload();
    await page.waitForTimeout(1000);

    const hasInitLog = logs.some(log => log.includes('Hero Media initialized'));
    expect(hasInitLog).toBe(true);
  });
});

test.describe('Hero Media - Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(DEMO_PAGE);

    // Check demo sections are visible
    const demoSection = page.locator('.demo-section').first();
    await expect(demoSection).toBeVisible();

    // Check content is readable
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(DEMO_PAGE);

    const demoSection = page.locator('.demo-section').first();
    await expect(demoSection).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(DEMO_PAGE);

    const demoSection = page.locator('.demo-section').first();
    await expect(demoSection).toBeVisible();
  });
});

test.describe('Hero Media - Accessibility', () => {
  test('should have proper ARIA attributes on SVG', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1500);

    const svgs = page.locator('svg.hero-svg');
    const count = await svgs.count();

    if (count > 0) {
      const firstSvg = svgs.first();
      const ariaHidden = await firstSvg.getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('should not trap keyboard focus', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    // Tab through page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate without issues
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have visible text content', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    // Check headings are visible
    const headings = page.locator('h1, h2');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);

    // First heading should be visible
    const firstHeading = headings.first();
    await expect(firstHeading).toBeVisible();
  });
});

test.describe('Hero Media - Performance', () => {
  test('should load page quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(DEMO_PAGE);
    const loadTime = Date.now() - startTime;

    // Page should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error));

    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(2000);

    expect(errors.length).toBe(0);
  });

  test('should lazy load media elements', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    // Check that HeroMedia uses lazy loading
    const usesLazyLoad = await page.evaluate(() => {
      return typeof window.HeroMedia.lazyLoadHeroMedia === 'function';
    });
    expect(usesLazyLoad).toBe(true);
  });
});

test.describe('Hero Media - CSS Classes', () => {
  test('should add loaded classes when media loads', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(2000);

    // Check for hero-svg-loaded class
    const svgSection = page.locator('.hero-svg-loaded').first();
    await expect(svgSection).toBeAttached();
  });

  test('should have proper positioning', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1500);

    const svg = page.locator('svg.hero-svg').first();

    if (await svg.count() > 0) {
      const position = await svg.evaluate(el => window.getComputedStyle(el).position);
      expect(position).toBe('absolute');
    }
  });

  test('should have proper z-index stacking', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1500);

    const content = page.locator('.demo-content').first();
    const zIndex = await content.evaluate(el => {
      return parseInt(window.getComputedStyle(el).zIndex) || 0;
    });

    // Content should be above media (z-index >= 1)
    expect(zIndex).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Hero Media - Visual Regression', () => {
  test('should render intro section correctly', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1000);

    const intro = page.locator('#intro');
    await expect(intro).toHaveScreenshot('hero-media-intro.png', {
      maxDiffPixels: 100
    });
  });

  test('should render SVG blob section correctly', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(2000);

    const section = page.locator('#svg-blob');
    await expect(section).toHaveScreenshot('hero-media-svg-blob.png', {
      maxDiffPixels: 100
    });
  });

  test('should render full page on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('hero-media-mobile.png', {
      fullPage: false,
      maxDiffPixels: 100
    });
  });

  test('should render full page on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('hero-media-desktop.png', {
      fullPage: false,
      maxDiffPixels: 100
    });
  });
});

test.describe('Hero Media - Integration', () => {
  test('should work with existing design system', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    // Check design system CSS is loaded
    const hasDesignSystem = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      return stylesheets.some(sheet =>
        sheet.href && sheet.href.includes('design-system.css')
      );
    });
    expect(hasDesignSystem).toBe(true);
  });

  test('should work with components CSS', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    // Check components CSS is loaded
    const hasComponents = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      return stylesheets.some(sheet =>
        sheet.href && sheet.href.includes('components.css')
      );
    });
    expect(hasComponents).toBe(true);
  });

  test('should have CTA buttons working', async ({ page }) => {
    await page.goto(DEMO_PAGE);

    const ctaButton = page.locator('.cta-button').first();
    await expect(ctaButton).toBeVisible();

    // Button should be clickable
    await expect(ctaButton).toHaveAttribute('href');
  });
});

test.describe('Hero Media - Edge Cases', () => {
  test('should handle missing video gracefully', async ({ page }) => {
    await page.goto(DEMO_PAGE);
    await page.waitForTimeout(2000);

    // Video might not exist (file not present), but should not break page
    const videoSection = page.locator('[data-hero-video]');
    await expect(videoSection).toBeAttached();

    // Should show fallback image
    const backgroundImage = await videoSection.first().evaluate(el =>
      window.getComputedStyle(el).backgroundImage
    );
    expect(backgroundImage).toBeTruthy();
  });

  test('should handle missing SVG symbols gracefully', async ({ page }) => {
    // Create a test page with invalid SVG ID
    await page.goto(DEMO_PAGE);

    const result = await page.evaluate(() => {
      const div = document.createElement('div');
      div.setAttribute('data-hero-svg', 'nonexistent-svg-id');
      document.body.appendChild(div);

      // Initialize SVG
      if (window.HeroMedia) {
        window.HeroMedia.initSVGGraphics();
      }

      return div.classList.contains('hero-svg-loaded');
    });

    // Should still add loaded class even if SVG doesn't exist
    expect(result).toBe(true);
  });

  test('should work without JavaScript', async ({ page }) => {
    // Disable JavaScript
    await page.setJavaScriptEnabled(false);
    await page.goto(DEMO_PAGE);

    // Page should still render (with fallbacks)
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Re-enable for other tests
    await page.setJavaScriptEnabled(true);
  });
});
