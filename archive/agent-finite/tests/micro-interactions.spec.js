/**
 * Micro-Interactions Tests
 *
 * Comprehensive test suite for micro-interactions library.
 * Tests functionality, animations, accessibility, and cross-browser compatibility.
 */

const { test, expect } = require('@playwright/test');

const DEMO_PAGE = '/pages/micro-interactions-demo.html';

test.describe('Micro-Interactions Library', () => {

  // ========================================
  // PAGE LOAD & INITIALIZATION
  // ========================================

  test.describe('Page Load & Initialization', () => {
    test('should load demo page successfully', async ({ page }) => {
      const response = await page.goto(DEMO_PAGE);
      expect(response.status()).toBe(200);
    });

    test('should load CSS file', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const styleSheets = await page.evaluate(() => {
        return Array.from(document.styleSheets)
          .map(sheet => sheet.href)
          .filter(href => href && href.includes('micro-interactions'));
      });
      expect(styleSheets.length).toBeGreaterThan(0);
    });

    test('should load JavaScript file and initialize', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      // Check for global objects
      const hasGlobals = await page.evaluate(() => {
        return typeof window.MicroToast !== 'undefined' &&
               typeof window.MicroInteractions !== 'undefined';
      });

      expect(hasGlobals).toBe(true);
    });

    test('should initialize without errors', async ({ page }) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(1000); // Wait for initialization

      expect(errors).toHaveLength(0);
    });
  });

  // ========================================
  // BUTTON INTERACTIONS
  // ========================================

  test.describe('Button Interactions', () => {
    test('ripple button should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const rippleBtn = await page.locator('.btn-ripple').first();
      await expect(rippleBtn).toBeVisible();
    });

    test('scale button should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const scaleBtn = await page.locator('.btn-scale').first();
      await expect(scaleBtn).toBeVisible();
    });

    test('magnetic button should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const magneticBtn = await page.locator('.btn-magnetic').first();
      await expect(magneticBtn).toBeVisible();
    });

    test('glow button should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const glowBtn = await page.locator('.btn-glow').first();
      await expect(glowBtn).toBeVisible();
    });

    test('shimmer button should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const shimmerBtn = await page.locator('.btn-shimmer').first();
      await expect(shimmerBtn).toBeVisible();
    });

    test('buttons should be clickable', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const rippleBtn = await page.locator('.btn-ripple').first();
      await rippleBtn.click();
      // No errors means click worked
    });

    test('magnetic button should have transform on hover', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const magneticBtn = await page.locator('.btn-magnetic').first();

      await magneticBtn.hover();
      await page.waitForTimeout(300); // Wait for animation

      const transform = await magneticBtn.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      // Should have some transform (not 'none')
      expect(transform).not.toBe('none');
    });
  });

  // ========================================
  // CARD INTERACTIONS
  // ========================================

  test.describe('Card Interactions', () => {
    test('lift card should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const liftCard = await page.locator('.card-lift').first();
      await expect(liftCard).toBeVisible();
    });

    test('tilt card should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const tiltCard = await page.locator('.card-tilt').first();
      await expect(tiltCard).toBeVisible();
    });

    test('glow card should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const glowCard = await page.locator('.card-glow').first();
      await expect(glowCard).toBeVisible();
    });

    test('shine card should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const shineCard = await page.locator('.card-shine').first();
      await expect(shineCard).toBeVisible();
    });

    test('tilt card should have 3D transform on hover', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const tiltCard = await page.locator('.card-tilt').first();

      const box = await tiltCard.boundingBox();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(300);

      const transform = await tiltCard.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      expect(transform).not.toBe('none');
    });
  });

  // ========================================
  // LINK INTERACTIONS
  // ========================================

  test.describe('Link Interactions', () => {
    test('underline link should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const link = await page.locator('.link-underline').first();
      await expect(link).toBeVisible();
    });

    test('slide link should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const link = await page.locator('.link-slide').first();
      await expect(link).toBeVisible();
    });

    test('arrow link should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const link = await page.locator('.link-arrow').first();
      await expect(link).toBeVisible();
    });

    test('links should have text content', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const link = await page.locator('.link-underline').first();
      const text = await link.textContent();
      expect(text.length).toBeGreaterThan(0);
    });
  });

  // ========================================
  // FORM INTERACTIONS
  // ========================================

  test.describe('Form Interactions', () => {
    test('form with validation should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const form = await page.locator('form[data-validate]').first();
      await expect(form).toBeVisible();
    });

    test('float label inputs should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const floatInput = await page.locator('.input-float-label input').first();
      await expect(floatInput).toBeVisible();
    });

    test('input glow class should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const glowInput = await page.locator('.input-glow').first();
      await expect(glowInput).toBeVisible();
    });

    test('float label should move on focus', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const input = await page.locator('.input-float-label input').first();
      const label = await page.locator('.input-float-label label').first();

      const beforeTop = await label.evaluate(el =>
        window.getComputedStyle(el).top
      );

      await input.focus();
      await page.waitForTimeout(300);

      const afterTop = await label.evaluate(el =>
        window.getComputedStyle(el).top
      );

      expect(beforeTop).not.toBe(afterTop);
    });

    test('form submission should trigger validation', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const form = await page.locator('form[data-validate]').first();
      const submitBtn = form.locator('button[type="submit"]');

      // Submit empty form
      await submitBtn.click();

      // Should show error toast (wait for it)
      await page.waitForTimeout(500);

      const toast = await page.locator('.toast').first();
      await expect(toast).toBeVisible();
    });
  });

  // ========================================
  // ICON INTERACTIONS
  // ========================================

  test.describe('Icon Interactions', () => {
    test('rotate icon should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const icon = await page.locator('.icon-rotate').first();
      await expect(icon).toBeVisible();
    });

    test('bounce icon should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const icon = await page.locator('.icon-bounce').first();
      await expect(icon).toBeVisible();
    });

    test('spin icon should exist and animate', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const icon = await page.locator('.icon-spin').first();
      await expect(icon).toBeVisible();

      // Should have animation
      const animationName = await icon.evaluate(el =>
        window.getComputedStyle(el).animationName
      );
      expect(animationName).not.toBe('none');
    });

    test('pulse icon should exist and animate', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const icon = await page.locator('.icon-pulse').first();
      await expect(icon).toBeVisible();

      const animationName = await icon.evaluate(el =>
        window.getComputedStyle(el).animationName
      );
      expect(animationName).not.toBe('none');
    });
  });

  // ========================================
  // SCROLL INTERACTIONS
  // ========================================

  test.describe('Scroll Interactions', () => {
    test('scroll progress bar should be added', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(500);

      const progressBar = await page.locator('.scroll-progress');
      await expect(progressBar).toBeVisible();
    });

    test('back to top button should be added', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(500);

      const backToTop = await page.locator('.back-to-top');
      expect(await backToTop.count()).toBeGreaterThan(0);
    });

    test('back to top should appear after scrolling', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(500);

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(300);

      const backToTop = await page.locator('.back-to-top.visible');
      await expect(backToTop).toBeVisible();
    });

    test('scroll progress should update on scroll', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(500);

      const progressBar = await page.locator('.scroll-progress');

      const initialWidth = await progressBar.evaluate(el => el.style.width);

      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(300);

      const scrolledWidth = await progressBar.evaluate(el => el.style.width);

      expect(scrolledWidth).not.toBe(initialWidth);
    });

    test('scroll animations should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      const scrollAnimElements = await page.locator('[data-scroll-animation]');
      expect(await scrollAnimElements.count()).toBeGreaterThan(0);
    });
  });

  // ========================================
  // LOADING STATES
  // ========================================

  test.describe('Loading States', () => {
    test('shimmer effect should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const shimmer = await page.locator('.shimmer').first();
      await expect(shimmer).toBeVisible();
    });

    test('skeleton effect should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const skeleton = await page.locator('.skeleton').first();
      await expect(skeleton).toBeVisible();
    });

    test('spinner should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const spinner = await page.locator('.spinner').first();
      await expect(spinner).toBeVisible();
    });

    test('dots loading should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const dots = await page.locator('.dots-loading').first();
      await expect(dots).toBeVisible();
    });

    test('spinner should animate', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const spinner = await page.locator('.spinner').first();

      const animationName = await spinner.evaluate(el =>
        window.getComputedStyle(el).animationName
      );
      expect(animationName).not.toBe('none');
    });
  });

  // ========================================
  // TOAST NOTIFICATIONS
  // ========================================

  test.describe('Toast Notifications', () => {
    test('toast container should be created', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(500);

      const container = await page.locator('.toast-container');
      expect(await container.count()).toBeGreaterThan(0);
    });

    test('success toast should appear', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      await page.evaluate(() => {
        window.MicroToast.show('Test success', 'success');
      });

      await page.waitForTimeout(300);

      const toast = await page.locator('.toast-success');
      await expect(toast).toBeVisible();
    });

    test('error toast should appear', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      await page.evaluate(() => {
        window.MicroToast.show('Test error', 'error');
      });

      await page.waitForTimeout(300);

      const toast = await page.locator('.toast-error');
      await expect(toast).toBeVisible();
    });

    test('warning toast should appear', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      await page.evaluate(() => {
        window.MicroToast.show('Test warning', 'warning');
      });

      await page.waitForTimeout(300);

      const toast = await page.locator('.toast-warning');
      await expect(toast).toBeVisible();
    });

    test('info toast should appear', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      await page.evaluate(() => {
        window.MicroToast.show('Test info', 'info');
      });

      await page.waitForTimeout(300);

      const toast = await page.locator('.toast-info');
      await expect(toast).toBeVisible();
    });

    test('toast should auto-dismiss', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      await page.evaluate(() => {
        window.MicroToast.show('Quick message', 'success', 500);
      });

      await page.waitForTimeout(300);
      const toast = await page.locator('.toast-success');
      await expect(toast).toBeVisible();

      await page.waitForTimeout(1000);
      expect(await toast.count()).toBe(0);
    });
  });

  // ========================================
  // TOOLTIPS
  // ========================================

  test.describe('Tooltips', () => {
    test('tooltip should be created', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(500);

      const tooltips = await page.locator('[data-tooltip]');
      expect(await tooltips.count()).toBeGreaterThan(0);
    });

    test('tooltip text should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(500);

      const tooltipElement = await page.locator('[data-tooltip]').first();
      const tooltipText = await tooltipElement.locator('.tooltip-text');

      expect(await tooltipText.count()).toBeGreaterThan(0);
    });
  });

  // ========================================
  // COUNTER ANIMATION
  // ========================================

  test.describe('Counter Animation', () => {
    test('counter elements should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      const counters = await page.locator('[data-counter]');
      expect(await counters.count()).toBeGreaterThan(0);
    });

    test('counter should animate when scrolled into view', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      const counter = await page.locator('[data-counter]').first();
      const targetValue = await counter.getAttribute('data-counter');

      // Scroll counter into view
      await counter.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500); // Wait for animation

      const currentText = await counter.textContent();
      expect(currentText).toBe(targetValue);
    });
  });

  // ========================================
  // IMAGE EFFECTS
  // ========================================

  test.describe('Image Effects', () => {
    test('zoom image container should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const imgZoom = await page.locator('.img-zoom').first();
      await expect(imgZoom).toBeVisible();
    });

    test('grayscale image container should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const imgGray = await page.locator('.img-grayscale').first();
      await expect(imgGray).toBeVisible();
    });
  });

  // ========================================
  // BADGE ANIMATIONS
  // ========================================

  test.describe('Badge Animations', () => {
    test('pulse badge should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const badge = await page.locator('.badge-pulse').first();
      await expect(badge).toBeVisible();
    });

    test('pop badge should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const badge = await page.locator('.badge-pop').first();
      await expect(badge).toBeVisible();
    });
  });

  // ========================================
  // COPY TO CLIPBOARD
  // ========================================

  test.describe('Copy to Clipboard', () => {
    test('copy button should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const copyBtn = await page.locator('[data-copy]').first();
      await expect(copyBtn).toBeVisible();
    });

    test('clicking copy button should show toast', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      const copyBtn = await page.locator('[data-copy]').first();

      await copyBtn.click();
      await page.waitForTimeout(500);

      const toast = await page.locator('.toast');
      await expect(toast).toBeVisible();
    });
  });

  // ========================================
  // ACCESSIBILITY
  // ========================================

  test.describe('Accessibility', () => {
    test('back to top should have aria-label', async ({ page }) => {
      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(500);

      const backToTop = await page.locator('.back-to-top');
      const ariaLabel = await backToTop.getAttribute('aria-label');

      expect(ariaLabel).toBeTruthy();
    });

    test('form inputs should be focusable', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      const input = await page.locator('.input-float-label input').first();
      await input.focus();

      const isFocused = await input.evaluate(el =>
        document.activeElement === el
      );

      expect(isFocused).toBe(true);
    });

    test('buttons should be keyboard accessible', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      const button = await page.locator('.btn').first();
      await button.focus();

      const isFocused = await button.evaluate(el =>
        document.activeElement === el
      );

      expect(isFocused).toBe(true);
    });

    test('reduced motion media query should exist', async ({ page }) => {
      await page.goto(DEMO_PAGE);

      const hasReducedMotion = await page.evaluate(() => {
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            const rules = Array.from(sheet.cssRules || []);
            for (const rule of rules) {
              if (rule.media && rule.media.mediaText.includes('prefers-reduced-motion')) {
                return true;
              }
            }
          } catch (e) {
            // Skip inaccessible stylesheets (CORS)
          }
        }
        return false;
      });

      expect(hasReducedMotion).toBe(true);
    });
  });

  // ========================================
  // RESPONSIVE DESIGN
  // ========================================

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(DEMO_PAGE);

      const container = await page.locator('.demo-container');
      await expect(container).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(DEMO_PAGE);

      const container = await page.locator('.demo-container');
      await expect(container).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(DEMO_PAGE);

      const container = await page.locator('.demo-container');
      await expect(container).toBeVisible();
    });
  });

  // ========================================
  // PERFORMANCE
  // ========================================

  test.describe('Performance', () => {
    test('page should load within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(DEMO_PAGE);
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });

    test('no JavaScript errors on load', async ({ page }) => {
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', error => {
        errors.push(error.message);
      });

      await page.goto(DEMO_PAGE);
      await page.waitForTimeout(2000);

      expect(errors).toHaveLength(0);
    });
  });

});
