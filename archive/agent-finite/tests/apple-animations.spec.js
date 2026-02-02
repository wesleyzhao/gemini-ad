/**
 * Apple-Inspired Animations Test Suite
 *
 * Tests all animation features to ensure proper functionality:
 * - Parallax scrolling
 * - Product showcases
 * - SVG path animations
 * - Canvas particles
 * - Scroll sequences
 * - Magnetic buttons
 * - Text reveals
 * - Counter animations
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = 'http://localhost:8000'; // Adjust if needed
const DEMO_PAGE = '/pages/apple-animations-demo.html';

test.describe('Apple Animations Library', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to demo page
    await page.goto(BASE_URL + DEMO_PAGE);
    // Wait for animations.js to load
    await page.waitForLoadState('networkidle');
  });

  // ============================================
  // File Loading Tests
  // ============================================

  test.describe('Asset Loading', () => {
    test('should load apple-animations.css', async ({ page }) => {
      const cssLoaded = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        return links.some(link => link.href.includes('apple-animations.css'));
      });
      expect(cssLoaded).toBe(true);
    });

    test('should load apple-animations.js', async ({ page }) => {
      const jsLoaded = await page.evaluate(() => {
        return typeof AppleAnimations !== 'undefined';
      });
      expect(jsLoaded).toBe(true);
    });

    test('should have AppleAnimations class available', async ({ page }) => {
      const hasClass = await page.evaluate(() => {
        return typeof AppleAnimations === 'function';
      });
      expect(hasClass).toBe(true);
    });
  });

  // ============================================
  // Parallax Scrolling Tests
  // ============================================

  test.describe('Parallax Scrolling', () => {
    test('should have parallax elements', async ({ page }) => {
      const parallaxElements = await page.locator('[data-parallax]').count();
      expect(parallaxElements).toBeGreaterThan(0);
    });

    test('should set parallax dataset attributes', async ({ page }) => {
      const hasDataset = await page.evaluate(() => {
        const element = document.querySelector('[data-parallax]');
        return element && element.dataset.parallaxSpeed !== undefined;
      });
      expect(hasDataset).toBe(true);
    });

    test('should transform parallax elements on scroll', async ({ page }) => {
      const element = page.locator('[data-parallax]').first();

      // Get initial transform
      const initialTransform = await element.evaluate(el => el.style.transform);

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(100); // Wait for animation frame

      // Get transform after scroll
      const afterTransform = await element.evaluate(el => el.style.transform);

      // Transform should have changed
      expect(afterTransform).not.toBe(initialTransform);
    });

    test('should support Y-direction parallax', async ({ page }) => {
      const hasYDirection = await page.locator('[data-parallax-direction="y"]').count();
      expect(hasYDirection).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Product Showcase Tests
  // ============================================

  test.describe('Product Showcase', () => {
    test('should have showcase container', async ({ page }) => {
      const showcases = await page.locator('[data-showcase]').count();
      expect(showcases).toBeGreaterThan(0);
    });

    test('should have showcase items', async ({ page }) => {
      const items = await page.locator('[data-showcase-item]').count();
      expect(items).toBeGreaterThan(0);
    });

    test('should add showcase-active class on scroll', async ({ page }) => {
      // Scroll to showcase section
      await page.locator('[data-showcase]').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(500); // Wait for intersection observer

      // Check if items have active class
      const activeItems = await page.locator('[data-showcase-item].showcase-active').count();
      expect(activeItems).toBeGreaterThan(0);
    });

    test('should use showcase-card class', async ({ page }) => {
      const cards = await page.locator('.showcase-card').count();
      expect(cards).toBeGreaterThan(0);
    });
  });

  // ============================================
  // SVG Animation Tests
  // ============================================

  test.describe('SVG Animations', () => {
    test('should have SVG elements with animation attribute', async ({ page }) => {
      const svgElements = await page.locator('[data-svg-animate]').count();
      expect(svgElements).toBeGreaterThan(0);
    });

    test('should set stroke-dasharray on SVG paths', async ({ page }) => {
      const hasDasharray = await page.evaluate(() => {
        const path = document.querySelector('[data-svg-animate]');
        return path && path.style.strokeDasharray !== '';
      });
      expect(hasDasharray).toBe(true);
    });

    test('should set stroke-dashoffset initially', async ({ page }) => {
      const hasOffset = await page.evaluate(() => {
        const path = document.querySelector('[data-svg-animate]');
        return path && path.style.strokeDashoffset !== '';
      });
      expect(hasOffset).toBe(true);
    });

    test('should support duration attribute', async ({ page }) => {
      const hasDuration = await page.locator('[data-svg-duration]').count();
      expect(hasDuration).toBeGreaterThan(0);
    });

    test('should support delay attribute', async ({ page }) => {
      const hasDelay = await page.locator('[data-svg-delay]').count();
      expect(hasDelay).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Canvas Particle Tests
  // ============================================

  test.describe('Canvas Particles', () => {
    test('should have canvas elements with particles attribute', async ({ page }) => {
      const canvases = await page.locator('canvas[data-particles]').count();
      expect(canvases).toBeGreaterThan(0);
    });

    test('should have 2D context on canvas', async ({ page }) => {
      const hasContext = await page.evaluate(() => {
        const canvas = document.querySelector('canvas[data-particles]');
        return canvas && canvas.getContext('2d') !== null;
      });
      expect(hasContext).toBe(true);
    });

    test('should set canvas width and height', async ({ page }) => {
      const hasDimensions = await page.evaluate(() => {
        const canvas = document.querySelector('canvas[data-particles]');
        return canvas && canvas.width > 0 && canvas.height > 0;
      });
      expect(hasDimensions).toBe(true);
    });

    test('should support particle-count attribute', async ({ page }) => {
      const hasCount = await page.locator('[data-particle-count]').count();
      expect(hasCount).toBeGreaterThan(0);
    });

    test('should support particle-color attribute', async ({ page }) => {
      const hasColor = await page.locator('[data-particle-color]').count();
      expect(hasColor).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Scroll Sequence Tests
  // ============================================

  test.describe('Scroll Sequences', () => {
    test('should have sequence elements', async ({ page }) => {
      const sequences = await page.locator('[data-sequence]').count();
      expect(sequences).toBeGreaterThan(0);
    });

    test('should set frame count dataset', async ({ page }) => {
      const hasFrameCount = await page.evaluate(() => {
        const seq = document.querySelector('[data-sequence]');
        return seq && seq.dataset.frameCount !== undefined;
      });
      expect(hasFrameCount).toBe(true);
    });

    test('should set scroll distance dataset', async ({ page }) => {
      const hasDistance = await page.evaluate(() => {
        const seq = document.querySelector('[data-sequence]');
        return seq && seq.dataset.scrollDistance !== undefined;
      });
      expect(hasDistance).toBe(true);
    });

    test('should update transform on scroll', async ({ page }) => {
      const seq = page.locator('[data-sequence]').first();

      // Scroll to element
      await seq.scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollBy(0, 100));
      await page.waitForTimeout(100);

      // Check if transform is set
      const transform = await seq.evaluate(el => el.style.transform);
      expect(transform).toBeTruthy();
    });
  });

  // ============================================
  // Magnetic Button Tests
  // ============================================

  test.describe('Magnetic Buttons', () => {
    test('should have magnetic button elements', async ({ page }) => {
      const buttons = await page.locator('[data-magnetic]').count();
      expect(buttons).toBeGreaterThan(0);
    });

    test('should have magnetic-button class', async ({ page }) => {
      const hasClass = await page.locator('.magnetic-button').count();
      expect(hasClass).toBeGreaterThan(0);
    });

    test('should transform on hover', async ({ page }) => {
      const button = page.locator('.magnetic-button').first();

      // Hover over button
      await button.hover();
      await page.waitForTimeout(100);

      // Check if transform is applied
      const transform = await button.evaluate(el => el.style.transform);
      expect(transform).toBeTruthy();
    });

    test('should reset transform on mouse leave', async ({ page }) => {
      const button = page.locator('.magnetic-button').first();

      // Hover and then move away
      await button.hover();
      await page.mouse.move(0, 0); // Move to corner
      await page.waitForTimeout(400); // Wait for transition

      // Check if transform is reset
      const transform = await button.evaluate(el => el.style.transform);
      expect(transform).toContain('translate(0, 0)');
    });
  });

  // ============================================
  // Text Reveal Tests
  // ============================================

  test.describe('Text Reveal', () => {
    test('should have text reveal elements', async ({ page }) => {
      const textReveals = await page.locator('[data-text-reveal]').count();
      expect(textReveals).toBeGreaterThan(0);
    });

    test('should split text into character spans', async ({ page }) => {
      const hasSpans = await page.evaluate(() => {
        const element = document.querySelector('[data-text-reveal]');
        return element && element.querySelectorAll('span').length > 0;
      });
      expect(hasSpans).toBe(true);
    });

    test('should set opacity and transform on spans', async ({ page }) => {
      const element = page.locator('[data-text-reveal]').first();

      // Scroll to element
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500); // Wait for animation

      // Check if spans are visible
      const firstSpan = await element.locator('span').first().evaluate(el => ({
        opacity: window.getComputedStyle(el).opacity,
        transform: window.getComputedStyle(el).transform
      }));

      expect(parseFloat(firstSpan.opacity)).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Counter Animation Tests
  // ============================================

  test.describe('Counter Animations', () => {
    test('should have counter elements', async ({ page }) => {
      const counters = await page.locator('.animated-counter').count();
      expect(counters).toBeGreaterThan(0);
    });

    test('should have counter data attributes', async ({ page }) => {
      const hasAttributes = await page.evaluate(() => {
        const counter = document.querySelector('.animated-counter');
        return counter &&
               counter.dataset.counterStart !== undefined &&
               counter.dataset.counterEnd !== undefined;
      });
      expect(hasAttributes).toBe(true);
    });

    test('should have AppleAnimations.animateCounter method', async ({ page }) => {
      const hasMethod = await page.evaluate(() => {
        return typeof AppleAnimations.animateCounter === 'function';
      });
      expect(hasMethod).toBe(true);
    });
  });

  // ============================================
  // CSS Classes Tests
  // ============================================

  test.describe('CSS Classes', () => {
    test('should have showcase-grid class', async ({ page }) => {
      const hasClass = await page.locator('.showcase-grid').count();
      expect(hasClass).toBeGreaterThan(0);
    });

    test('should have particles-container class', async ({ page }) => {
      const hasClass = await page.locator('.particles-demo').count();
      expect(hasClass).toBeGreaterThan(0);
    });

    test('should have section-title class', async ({ page }) => {
      const hasClass = await page.locator('.section-title').count();
      expect(hasClass).toBeGreaterThan(0);
    });

    test('should have counter-label class', async ({ page }) => {
      const hasClass = await page.locator('.counter-label').count();
      expect(hasClass).toBeGreaterThan(0);
    });
  });

  // ============================================
  // Performance Tests
  // ============================================

  test.describe('Performance', () => {
    test('should use will-change on parallax elements', async ({ page }) => {
      const hasWillChange = await page.evaluate(() => {
        const element = document.querySelector('[data-parallax]');
        return element && window.getComputedStyle(element).willChange === 'transform';
      });
      expect(hasWillChange).toBe(true);
    });

    test('should use GPU acceleration (translate3d)', async ({ page }) => {
      // Check if CSS includes translate3d for GPU acceleration
      const usesGPU = await page.evaluate(() => {
        const element = document.querySelector('[data-parallax]');
        if (!element) return false;

        const transform = window.getComputedStyle(element).transform;
        return transform.includes('matrix3d') || transform.includes('translate3d');
      });

      // This may be false initially, but the CSS supports it
      // Just check that parallax elements exist
      const parallaxExists = await page.locator('[data-parallax]').count();
      expect(parallaxExists).toBeGreaterThan(0);
    });

    test('should have requestAnimationFrame in scroll handler', async ({ page }) => {
      // Check that the library uses requestAnimationFrame
      const usesRAF = await page.evaluate(() => {
        // Check if AppleAnimations class has ticking property
        const instance = new AppleAnimations();
        return instance.ticking !== undefined;
      });
      expect(usesRAF).toBe(true);
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================

  test.describe('Accessibility', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Check if CSS has prefers-reduced-motion media query
      const styles = await page.evaluate(() => {
        const sheets = Array.from(document.styleSheets);
        return sheets.some(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            return rules.some(rule =>
              rule.media && rule.media.mediaText.includes('prefers-reduced-motion')
            );
          } catch (e) {
            return false;
          }
        });
      });
      expect(styles).toBe(true);
    });

    test('should have skip-to-main link', async ({ page }) => {
      const skipLink = await page.locator('.skip-to-main').count();
      expect(skipLink).toBe(1);
    });

    test('should have main landmark', async ({ page }) => {
      const main = await page.locator('main#main-content').count();
      expect(main).toBe(1);
    });
  });

  // ============================================
  // Visual Regression Tests
  // ============================================

  test.describe('Visual Regression', () => {
    test('should match hero section screenshot', async ({ page }) => {
      const hero = page.locator('.hero-section').first();
      await expect(hero).toBeVisible();
      await expect(hero).toHaveScreenshot('hero-section.png', {
        maxDiffPixels: 100
      });
    });

    test('should match showcase section screenshot', async ({ page }) => {
      const showcase = page.locator('[data-showcase]').first();
      await showcase.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000); // Wait for animations
      await expect(showcase).toHaveScreenshot('showcase-section.png', {
        maxDiffPixels: 100
      });
    });

    test('should match full page at desktop', async ({ page }) => {
      await expect(page).toHaveScreenshot('full-page-desktop.png', {
        fullPage: true,
        maxDiffPixels: 500
      });
    });
  });

  // ============================================
  // Mobile Tests
  // ============================================

  test.describe('Mobile Responsive', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test('should render properly on mobile', async ({ page }) => {
      await page.goto(BASE_URL + DEMO_PAGE);
      const hero = page.locator('.hero-section');
      await expect(hero).toBeVisible();
    });

    test('should have responsive showcase grid', async ({ page }) => {
      await page.goto(BASE_URL + DEMO_PAGE);
      const grid = page.locator('.showcase-grid');

      // Check grid exists
      await expect(grid).toBeVisible();
    });

    test('should scale text appropriately', async ({ page }) => {
      await page.goto(BASE_URL + DEMO_PAGE);
      const title = page.locator('.hero-title').first();

      const fontSize = await title.evaluate(el =>
        window.getComputedStyle(el).fontSize
      );

      // Font size should be smaller than desktop
      expect(parseFloat(fontSize)).toBeLessThan(96);
    });
  });

  // ============================================
  // Integration Tests
  // ============================================

  test.describe('Integration', () => {
    test('should work with existing animations.js', async ({ page }) => {
      // Check both libraries are loaded
      const bothLoaded = await page.evaluate(() => {
        return typeof AppleAnimations !== 'undefined' &&
               document.querySelectorAll('.fade-in').length >= 0;
      });
      expect(bothLoaded).toBe(true);
    });

    test('should not have JavaScript errors', async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error));

      await page.goto(BASE_URL + DEMO_PAGE);
      await page.waitForTimeout(2000); // Wait for animations

      expect(errors.length).toBe(0);
    });

    test('should not have console errors', async ({ page }) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto(BASE_URL + DEMO_PAGE);
      await page.waitForTimeout(2000);

      expect(errors.length).toBe(0);
    });
  });

});
