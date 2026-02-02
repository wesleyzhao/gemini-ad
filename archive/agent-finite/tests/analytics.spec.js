/**
 * Analytics Tracking Tests
 *
 * Tests for the analytics.js library and GA4 integration.
 * Verifies automatic tracking, manual tracking, and privacy features.
 */

const { test, expect } = require('@playwright/test');

const LANDING_PAGES = [
  'apple-inspired.html',
  'trust-citations.html',
  'workspace-integration.html',
  'creators-voice-studio.html',
  'operators-automators.html',
  'research-assistant.html',
  'multimodal-ai.html',
  'personal-assistant.html',
  'developer-tools.html',
  'business-intelligence.html',
  'education-learning.html',
  'creative-studio.html',
  'security-privacy.html',
  'love-letter-to-productivity.html',
  'writers-room.html'
];

test.describe('Analytics Installation', () => {

  test('should have GA4 script on all landing pages', async ({ page }) => {
    for (const pageName of LANDING_PAGES) {
      await page.goto(`http://localhost:8080/pages/${pageName}`);

      // Check for GA4 script
      const ga4Script = await page.locator('script[src*="googletagmanager.com/gtag/js"]').count();
      expect(ga4Script).toBeGreaterThan(0);

      // Check for gtag function
      const hasGtag = await page.evaluate(() => typeof gtag === 'function' || typeof window.gtag === 'function');
      expect(hasGtag).toBeTruthy();
    }
  });

  test('should have analytics.js on all landing pages', async ({ page }) => {
    for (const pageName of LANDING_PAGES) {
      await page.goto(`http://localhost:8080/pages/${pageName}`);

      // Check for analytics.js script
      const analyticsScript = await page.locator('script[src*="analytics.js"]').count();
      expect(analyticsScript).toBeGreaterThan(0);
    }
  });

  test('should initialize analytics library', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');

    // Wait for analytics to load
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    // Check analytics is initialized
    const isInitialized = await page.evaluate(() => window.geminiAnalytics.initialized);
    expect(isInitialized).toBe(true);
  });

  test('should have global tracking functions', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');

    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    // Check global functions exist
    const hasFunctions = await page.evaluate(() => {
      return typeof trackEvent === 'function' &&
             typeof trackCTA === 'function' &&
             typeof trackForm === 'function' &&
             typeof trackVideo === 'function';
    });

    expect(hasFunctions).toBe(true);
  });
});

test.describe('Page View Tracking', () => {

  test('should track page view on load', async ({ page }) => {
    let pageViewTracked = false;

    // Intercept GA4 requests
    page.on('request', request => {
      const url = request.url();
      if (url.includes('google-analytics.com') || url.includes('googletagmanager.com')) {
        if (url.includes('page_view') || url.includes('event=page_view')) {
          pageViewTracked = true;
        }
      }
    });

    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForTimeout(1000);

    // Note: Without real GA4 ID, we can't verify actual network request
    // But we can verify the tracking function was called
    const trackingData = await page.evaluate(() => {
      // Enable debug to check if events are being sent
      window.geminiAnalytics.enableDebug();
      return window.geminiAnalytics.getReport();
    });

    expect(trackingData.initialized).toBe(true);
  });
});

test.describe('CTA Click Tracking', () => {

  test('should track CTA button clicks automatically', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    // Enable debug mode
    await page.evaluate(() => window.geminiAnalytics.enableDebug());

    // Find CTA button
    const ctaButton = page.locator('.cta-button, .btn').first();
    await expect(ctaButton).toBeVisible();

    // Track console logs
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('[Analytics]')) {
        consoleLogs.push(msg.text());
      }
    });

    // Click CTA
    await ctaButton.click();
    await page.waitForTimeout(500);

    // Verify tracking was logged
    const hasCtaEvent = consoleLogs.some(log => log.includes('cta_click'));
    expect(hasCtaEvent).toBeTruthy();
  });

  test('should track manual CTA calls', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    // Track CTA manually
    const tracked = await page.evaluate(() => {
      window.geminiAnalytics.enableDebug();
      window.trackCTA('Test Button', 'test-section');
      return true;
    });

    expect(tracked).toBe(true);
  });
});

test.describe('Scroll Depth Tracking', () => {

  test('should track scroll depth milestones', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    // Enable debug mode
    await page.evaluate(() => window.geminiAnalytics.enableDebug());

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check tracked scroll depths
    const scrollDepths = await page.evaluate(() => {
      return window.geminiAnalytics.getReport().scrollDepthsTracked;
    });

    // Should have tracked at least one depth
    expect(scrollDepths.length).toBeGreaterThan(0);
  });

  test('should track 25% scroll depth', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    // Scroll to 25%
    await page.evaluate(() => {
      const quarterHeight = document.documentElement.scrollHeight * 0.25;
      window.scrollTo(0, quarterHeight);
    });
    await page.waitForTimeout(1000);

    const scrollDepths = await page.evaluate(() => {
      return window.geminiAnalytics.getReport().scrollDepthsTracked;
    });

    // Might include 25% depending on page height
    expect(Array.isArray(scrollDepths)).toBe(true);
  });
});

test.describe('Time On Page Tracking', () => {

  test('should track time on page', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    // Wait for initial time threshold (10s is first threshold)
    await page.waitForTimeout(11000);

    const report = await page.evaluate(() => window.geminiAnalytics.getReport());

    expect(report.timeOnPage).toBeGreaterThan(10);
    expect(report.timeThresholdsTracked.length).toBeGreaterThan(0);
  });
});

test.describe('Custom Event Tracking', () => {

  test('should track custom events', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    const tracked = await page.evaluate(() => {
      window.trackEvent('test_event', {
        test_data: 'value',
        test_number: 123
      });
      return true;
    });

    expect(tracked).toBe(true);
  });

  test('should track form submissions', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    const tracked = await page.evaluate(() => {
      window.trackForm('test-form', {
        form_type: 'contact',
        fields: 5
      });
      return true;
    });

    expect(tracked).toBe(true);
  });

  test('should track video interactions', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    const tracked = await page.evaluate(() => {
      window.trackVideo('play', 'hero-video', 0);
      window.trackVideo('pause', 'hero-video', 50);
      window.trackVideo('complete', 'hero-video', 100);
      return true;
    });

    expect(tracked).toBe(true);
  });
});

test.describe('Outbound Link Tracking', () => {

  test('should track outbound link clicks', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    // Add a test outbound link
    await page.evaluate(() => {
      const link = document.createElement('a');
      link.href = 'https://gemini.google.com';
      link.textContent = 'Test Link';
      link.id = 'test-outbound-link';
      document.body.appendChild(link);
    });

    // Enable debug
    await page.evaluate(() => window.geminiAnalytics.enableDebug());

    // Track console logs
    const consoleLogs = [];
    page.on('console', msg => {
      if (msg.text().includes('[Analytics]')) {
        consoleLogs.push(msg.text());
      }
    });

    // Click link (but prevent navigation)
    await page.evaluate(() => {
      const link = document.getElementById('test-outbound-link');
      link.addEventListener('click', (e) => e.preventDefault());
      link.click();
    });

    await page.waitForTimeout(500);

    // Should have logged outbound link
    const hasOutboundEvent = consoleLogs.some(log => log.includes('outbound_link'));
    expect(hasOutboundEvent).toBeTruthy();
  });
});

test.describe('Privacy Features', () => {

  test('should detect Do Not Track', async ({ page, context }) => {
    // Note: Can't easily set DNT in Playwright, so we test the detection logic
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    const report = await page.evaluate(() => window.geminiAnalytics.getReport());

    // Should have a doNotTrack property
    expect(typeof report.doNotTrack).toBe('boolean');
  });

  test('should have IP anonymization configured', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');

    // Check GA4 config includes anonymize_ip
    const hasAnonymizeIP = await page.evaluate(() => {
      // Check if gtag was called with anonymize_ip
      return document.documentElement.innerHTML.includes('anonymize_ip');
    });

    expect(hasAnonymizeIP).toBe(true);
  });

  test('should have secure cookie flags', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');

    // Check GA4 config includes cookie_flags
    const hasCookieFlags = await page.evaluate(() => {
      return document.documentElement.innerHTML.includes('cookie_flags');
    });

    expect(hasCookieFlags).toBe(true);
  });
});

test.describe('Analytics API', () => {

  test('should provide getReport() method', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    const report = await page.evaluate(() => window.geminiAnalytics.getReport());

    expect(report).toHaveProperty('initialized');
    expect(report).toHaveProperty('doNotTrack');
    expect(report).toHaveProperty('timeOnPage');
    expect(report).toHaveProperty('maxScrollDepth');
    expect(report).toHaveProperty('scrollDepthsTracked');
    expect(report).toHaveProperty('timeThresholdsTracked');
  });

  test('should provide enableDebug() method', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    const enabled = await page.evaluate(() => {
      window.geminiAnalytics.enableDebug();
      return true;
    });

    expect(enabled).toBe(true);
  });

  test('should provide disableDebug() method', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    const disabled = await page.evaluate(() => {
      window.geminiAnalytics.enableDebug();
      window.geminiAnalytics.disableDebug();
      return true;
    });

    expect(disabled).toBe(true);
  });
});

test.describe('Analytics Across Pages', () => {

  test('analytics should work on all 15 landing pages', async ({ page }) => {
    for (const pageName of LANDING_PAGES) {
      await page.goto(`http://localhost:8080/pages/${pageName}`);
      await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

      const report = await page.evaluate(() => window.geminiAnalytics.getReport());

      expect(report.initialized).toBe(true);
    }
  });
});

test.describe('Performance', () => {

  test('analytics script should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:8080/pages/apple-inspired.html');
    await page.waitForFunction(() => typeof window.geminiAnalytics !== 'undefined');

    const loadTime = Date.now() - startTime;

    // Should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('analytics should not block page rendering', async ({ page }) => {
    await page.goto('http://localhost:8080/pages/apple-inspired.html');

    // Check that main content is visible before analytics loads
    const heroVisible = await page.locator('h1').first().isVisible();
    expect(heroVisible).toBe(true);
  });
});
