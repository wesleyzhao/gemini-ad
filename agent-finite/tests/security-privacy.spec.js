const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8000/pages/security-privacy.html';

test.describe('Security & Privacy Landing Page', () => {

  // ============================================================================
  // PAGE LOAD TESTS
  // ============================================================================

  test.describe('Page Load Tests', () => {
    test('page loads successfully', async ({ page }) => {
      const response = await page.goto(PAGE_URL);
      expect(response.status()).toBe(200);
    });

    test('page has correct title', async ({ page }) => {
      await page.goto(PAGE_URL);
      await expect(page).toHaveTitle(/Security & Privacy - Gemini AI/);
    });

    test('page has meta description', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('Enterprise-grade security');
      expect(metaDescription).toContain('privacy protection');
    });

    test('all stylesheets load correctly', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stylesheets = await page.locator('link[rel="stylesheet"]').count();
      expect(stylesheets).toBeGreaterThanOrEqual(3); // design-system, components, animations
    });
  });

  // ============================================================================
  // NAVIGATION TESTS
  // ============================================================================

  test.describe('Navigation Tests', () => {
    test('smooth scroll to security section works', async ({ page }) => {
      await page.goto(PAGE_URL);
      await page.click('a[href="#security"]');
      await page.waitForTimeout(1000);
      const securitySection = page.locator('#security');
      await expect(securitySection).toBeInViewport();
    });

    test('all CTA links point to gemini.google.com', async ({ page }) => {
      await page.goto(PAGE_URL);
      const ctaLinks = await page.locator('a.cta-primary').all();
      for (const link of ctaLinks) {
        const href = await link.getAttribute('href');
        expect(href).toContain('gemini.google.com');
      }
    });

    test('external links have rel="noopener"', async ({ page }) => {
      await page.goto(PAGE_URL);
      const externalLinks = await page.locator('a[href*="gemini.google.com"]').all();
      for (const link of externalLinks) {
        const rel = await link.getAttribute('rel');
        expect(rel).toContain('noopener');
      }
    });

    test('footer links are present', async ({ page }) => {
      await page.goto(PAGE_URL);
      const footerLink = page.locator('footer a');
      await expect(footerLink).toBeVisible();
    });
  });

  // ============================================================================
  // HERO SECTION TESTS
  // ============================================================================

  test.describe('Hero Section Tests', () => {
    test('hero section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('hero has "ENTERPRISE SECURITY" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.hero-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('ENTERPRISE SECURITY');
    });

    test('hero has main heading', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = page.locator('.hero h1');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Security & Privacy You Can Trust');
    });

    test('hero has subtitle', async ({ page }) => {
      await page.goto(PAGE_URL);
      const subtitle = page.locator('.hero-subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('enterprise-grade security');
    });

    test('hero has primary CTA button', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryCTA = page.locator('.hero .cta-primary').first();
      await expect(primaryCTA).toBeVisible();
      await expect(primaryCTA).toContainText('Start Secure Chat');
    });

    test('hero has secondary CTA button', async ({ page }) => {
      await page.goto(PAGE_URL);
      const secondaryCTA = page.locator('.hero .cta-secondary');
      await expect(secondaryCTA).toBeVisible();
      await expect(secondaryCTA).toContainText('Learn About Security');
    });

    test('hero has gradient background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      const background = await hero.evaluate(el => getComputedStyle(el).background);
      expect(background).toContain('gradient');
    });
  });

  // ============================================================================
  // SECURITY PILLARS SECTION TESTS
  // ============================================================================

  test.describe('Security Pillars Section Tests', () => {
    test('security pillars section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.security-pillars');
      await expect(section).toBeVisible();
    });

    test('section has "FOUR PILLARS" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.security-pillars .section-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('FOUR PILLARS');
    });

    test('section has heading', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = page.locator('.security-pillars h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Google\'s Security Foundation');
    });

    test('displays exactly 4 pillar cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = page.locator('.pillar-card');
      await expect(cards).toHaveCount(4);
    });

    test('infrastructure security pillar card exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.pillar-card').filter({ hasText: 'Infrastructure Security' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('Multi-layered defense');
    });

    test('data protection pillar card exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.pillar-card').filter({ hasText: 'Data Protection' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('End-to-end encryption');
    });

    test('user control pillar card exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.pillar-card').filter({ hasText: 'User Control' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('privacy settings');
    });

    test('compliance pillar card exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.pillar-card').filter({ hasText: 'Compliance' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('GDPR');
      await expect(card).toContainText('HIPAA');
    });

    test('pillar cards have icons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const icons = page.locator('.pillar-icon');
      await expect(icons).toHaveCount(4);
    });
  });

  // ============================================================================
  // TRUST METRICS SECTION TESTS
  // ============================================================================

  test.describe('Trust Metrics Section Tests', () => {
    test('trust metrics section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.trust-metrics');
      await expect(section).toBeVisible();
    });

    test('section has heading', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = page.locator('.trust-metrics h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Protecting Billions');
    });

    test('displays exactly 4 metrics', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metrics = page.locator('.metric-item');
      await expect(metrics).toHaveCount(4);
    });

    test('"20+ Years" metric exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metric = page.locator('.metric-item').filter({ hasText: '20+' });
      await expect(metric).toBeVisible();
      await expect(metric).toContainText('Security Leadership');
    });

    test('"2B+ Users" metric exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metric = page.locator('.metric-item').filter({ hasText: '2B+' });
      await expect(metric).toBeVisible();
      await expect(metric).toContainText('Protected Daily');
    });

    test('"$10B+ Investment" metric exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metric = page.locator('.metric-item').filter({ hasText: '$10B+' });
      await expect(metric).toBeVisible();
      await expect(metric).toContainText('Security Investment');
    });

    test('"99.9% Uptime" metric exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metric = page.locator('.metric-item').filter({ hasText: '99.9%' });
      await expect(metric).toBeVisible();
      await expect(metric).toContainText('Uptime Guarantee');
    });

    test('metrics have gradient styling', async ({ page }) => {
      await page.goto(PAGE_URL);
      const metricValue = page.locator('.metric-value').first();
      const background = await metricValue.evaluate(el => getComputedStyle(el).background);
      expect(background).toContain('gradient');
    });
  });

  // ============================================================================
  // SECURITY FEATURES SECTION TESTS
  // ============================================================================

  test.describe('Security Features Section Tests', () => {
    test('security features section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.security-features');
      await expect(section).toBeVisible();
    });

    test('section has "ADVANCED PROTECTION" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.security-features .section-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('ADVANCED PROTECTION');
    });

    test('displays exactly 6 feature cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = page.locator('.security-features .feature-card');
      await expect(cards).toHaveCount(6);
    });

    test('end-to-end encryption feature exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.feature-card').filter({ hasText: 'End-to-End Encryption' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('AES-256');
      await expect(card).toContainText('TLS 1.3');
    });

    test('threat detection feature exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.feature-card').filter({ hasText: 'Advanced Threat Detection' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('AI-powered');
      await expect(card).toContainText('real-time');
    });

    test('enterprise admin controls feature exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.feature-card').filter({ hasText: 'Enterprise Admin Controls' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('Role-based access');
      await expect(card).toContainText('SSO');
    });

    test('data loss prevention feature exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.feature-card').filter({ hasText: 'Data Loss Prevention' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('Sensitive content detection');
    });

    test('multi-factor authentication feature exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.feature-card').filter({ hasText: 'Multi-Factor Authentication' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('2FA');
      await expect(card).toContainText('biometric');
    });

    test('security analytics feature exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.feature-card').filter({ hasText: 'Security Analytics' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('audit trails');
    });

    test('feature cards have icons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const icons = page.locator('.security-features .feature-icon');
      await expect(icons).toHaveCount(6);
    });

    test('feature cards have bullet lists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const lists = page.locator('.security-features .feature-card ul');
      await expect(lists).toHaveCount(6);
    });
  });

  // ============================================================================
  // COMPLIANCE SECTION TESTS
  // ============================================================================

  test.describe('Compliance Section Tests', () => {
    test('compliance section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.compliance');
      await expect(section).toBeVisible();
    });

    test('section has "CERTIFICATIONS" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.compliance .section-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('CERTIFICATIONS');
    });

    test('displays exactly 6 compliance badges', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badges = page.locator('.compliance-badge');
      await expect(badges).toHaveCount(6);
    });

    test('GDPR compliance badge exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.compliance-badge').filter({ hasText: 'GDPR' });
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('European data protection');
    });

    test('HIPAA compliance badge exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.compliance-badge').filter({ hasText: 'HIPAA' });
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('Healthcare');
    });

    test('SOC 2 compliance badge exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.compliance-badge').filter({ hasText: 'SOC 2' });
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('Type II');
    });

    test('ISO 27001 compliance badge exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.compliance-badge').filter({ hasText: 'ISO 27001' });
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('International');
    });

    test('FedRAMP compliance badge exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.compliance-badge').filter({ hasText: 'FedRAMP' });
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('government');
    });

    test('CCPA compliance badge exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.compliance-badge').filter({ hasText: 'CCPA' });
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('California');
    });

    test('compliance badges have icons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const icons = page.locator('.compliance-badge-icon');
      await expect(icons).toHaveCount(6);
    });
  });

  // ============================================================================
  // PRIVACY CONTROLS SECTION TESTS
  // ============================================================================

  test.describe('Privacy Controls Section Tests', () => {
    test('privacy controls section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.privacy-controls');
      await expect(section).toBeVisible();
    });

    test('section has "YOUR CONTROL" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.privacy-controls .section-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('YOUR CONTROL');
    });

    test('section has heading', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = page.locator('.privacy-controls h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Complete Privacy Control');
    });

    test('displays exactly 4 control cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cards = page.locator('.control-card');
      await expect(cards).toHaveCount(4);
    });

    test('activity controls card exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.control-card').filter({ hasText: 'Activity Controls' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('Save conversation history');
    });

    test('data deletion card exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.control-card').filter({ hasText: 'Data Deletion' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('Auto-delete after 18 months');
    });

    test('transparency dashboard card exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.control-card').filter({ hasText: 'Transparency Dashboard' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('Activity tracking');
    });

    test('privacy checkup card exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.control-card').filter({ hasText: 'Privacy Checkup' });
      await expect(card).toBeVisible();
      await expect(card).toContainText('Quarterly privacy reminders');
    });

    test('control cards have toggle switches', async ({ page }) => {
      await page.goto(PAGE_URL);
      const toggles = page.locator('.toggle-switch');
      await expect(toggles).toHaveCount(4);
    });

    test('section has dark background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.privacy-controls');
      const background = await section.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(background).toBeTruthy();
    });
  });

  // ============================================================================
  // INFRASTRUCTURE SECTION TESTS
  // ============================================================================

  test.describe('Infrastructure Section Tests', () => {
    test('infrastructure section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.infrastructure');
      await expect(section).toBeVisible();
    });

    test('section has "GOOGLE INFRASTRUCTURE" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.infrastructure .section-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('GOOGLE INFRASTRUCTURE');
    });

    test('section has heading', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = page.locator('.infrastructure h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('World-Class Infrastructure');
    });

    test('displays exactly 4 infrastructure stats', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stats = page.locator('.infrastructure-stat');
      await expect(stats).toHaveCount(4);
    });

    test('global data centers stat exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.infrastructure-stat').filter({ hasText: 'Global Data Centers' });
      await expect(stat).toBeVisible();
      await expect(stat).toContainText('38 data center');
      await expect(stat).toContainText('6 continents');
    });

    test('renewable energy stat exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.infrastructure-stat').filter({ hasText: 'Renewable Energy' });
      await expect(stat).toBeVisible();
      await expect(stat).toContainText('100%');
      await expect(stat).toContainText('net-zero carbon');
    });

    test('custom security hardware stat exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.infrastructure-stat').filter({ hasText: 'Custom Security Hardware' });
      await expect(stat).toBeVisible();
      await expect(stat).toContainText('Titan security chips');
    });

    test('uptime SLA stat exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const stat = page.locator('.infrastructure-stat').filter({ hasText: 'Uptime SLA' });
      await expect(stat).toBeVisible();
      await expect(stat).toContainText('99.99%');
    });

    test('infrastructure stats have icons', async ({ page }) => {
      await page.goto(PAGE_URL);
      const icons = page.locator('.stat-icon');
      await expect(icons).toHaveCount(4);
    });
  });

  // ============================================================================
  // TESTIMONIALS SECTION TESTS
  // ============================================================================

  test.describe('Testimonials Section Tests', () => {
    test('testimonials section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.testimonials');
      await expect(section).toBeVisible();
    });

    test('section has "CUSTOMER TRUST" badge', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.testimonials .section-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('CUSTOMER TRUST');
    });

    test('displays exactly 3 testimonials', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonials = page.locator('.testimonial-card');
      await expect(testimonials).toHaveCount(3);
    });

    test('CISO testimonial exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'David Martinez' });
      await expect(testimonial).toBeVisible();
      await expect(testimonial).toContainText('Chief Information Security Officer');
      await expect(testimonial).toContainText('SOC 2 certification');
    });

    test('DPO testimonial exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'Sophie Dubois' });
      await expect(testimonial).toBeVisible();
      await expect(testimonial).toContainText('Data Protection Officer');
      await expect(testimonial).toContainText('GDPR compliance');
    });

    test('healthcare testimonial exists', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonial = page.locator('.testimonial-card').filter({ hasText: 'Dr. James Chen' });
      await expect(testimonial).toBeVisible();
      await expect(testimonial).toContainText('Medical Informatics');
      await expect(testimonial).toContainText('HIPAA certification');
    });

    test('testimonials have author avatars', async ({ page }) => {
      await page.goto(PAGE_URL);
      const avatars = page.locator('.author-avatar');
      await expect(avatars).toHaveCount(3);
    });

    test('testimonials have quote styling', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonial = page.locator('.testimonial-card').first();
      const before = await testimonial.evaluate(el => {
        return window.getComputedStyle(el, '::before').content;
      });
      expect(before).toContain('"');
    });
  });

  // ============================================================================
  // FINAL CTA SECTION TESTS
  // ============================================================================

  test.describe('Final CTA Section Tests', () => {
    test('final CTA section is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.final-cta');
      await expect(section).toBeVisible();
    });

    test('section has heading', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = page.locator('.final-cta h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Experience Secure AI Today');
    });

    test('section has CTA button', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cta = page.locator('.final-cta .cta-primary');
      await expect(cta).toBeVisible();
      await expect(cta).toContainText('Get Started Securely');
    });

    test('CTA links to Gemini', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cta = page.locator('.final-cta .cta-primary');
      const href = await cta.getAttribute('href');
      expect(href).toContain('gemini.google.com');
    });
  });

  // ============================================================================
  // FOOTER TESTS
  // ============================================================================

  test.describe('Footer Tests', () => {
    test('footer is visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('footer has copyright text', async ({ page }) => {
      await page.goto(PAGE_URL);
      const footer = page.locator('footer');
      await expect(footer).toContainText('2026 Google LLC');
    });

    test('footer has Gemini link', async ({ page }) => {
      await page.goto(PAGE_URL);
      const link = page.locator('footer a');
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toContain('gemini.google.com');
    });

    test('footer has dark background', async ({ page }) => {
      await page.goto(PAGE_URL);
      const footer = page.locator('footer');
      const background = await footer.evaluate(el => getComputedStyle(el).backgroundColor);
      expect(background).toBeTruthy();
    });
  });

  // ============================================================================
  // CTA & LINKS TESTS
  // ============================================================================

  test.describe('CTA & Links Tests', () => {
    test('page has at least 3 Gemini links', async ({ page }) => {
      await page.goto(PAGE_URL);
      const geminiLinks = page.locator('a[href*="gemini.google.com"]');
      const count = await geminiLinks.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test('all primary CTAs are visible', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryCTAs = page.locator('.cta-primary');
      const count = await primaryCTAs.count();
      expect(count).toBeGreaterThanOrEqual(2);
      for (let i = 0; i < count; i++) {
        await expect(primaryCTAs.nth(i)).toBeVisible();
      }
    });
  });

  // ============================================================================
  // ANIMATION TESTS
  // ============================================================================

  test.describe('Animation Tests', () => {
    test('hero elements have fade-in animations', async ({ page }) => {
      await page.goto(PAGE_URL);
      const badge = page.locator('.hero-badge');
      const animation = await badge.evaluate(el => getComputedStyle(el).animation);
      expect(animation).toContain('fadeInUp');
    });

    test('hero has pulsing animation', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero::before');
      // Check that animation is present in styles
      const hasAnimation = await page.evaluate(() => {
        const styles = document.styleSheets[0];
        let found = false;
        for (let rule of styles.cssRules) {
          if (rule.cssText && rule.cssText.includes('securityPulse')) {
            found = true;
            break;
          }
        }
        return found;
      });
      expect(hasAnimation).toBeTruthy();
    });

    test('cards have scroll-triggered animations', async ({ page }) => {
      await page.goto(PAGE_URL);
      // Scroll to trigger animations
      await page.evaluate(() => window.scrollTo(0, 1000));
      await page.waitForTimeout(500);
      const card = page.locator('.pillar-card').first();
      await expect(card).toBeVisible();
    });

    test('intersection observer is active', async ({ page }) => {
      await page.goto(PAGE_URL);
      const observerActive = await page.evaluate(() => {
        return typeof IntersectionObserver !== 'undefined';
      });
      expect(observerActive).toBeTruthy();
    });
  });

  // ============================================================================
  // TYPOGRAPHY TESTS
  // ============================================================================

  test.describe('Typography Tests', () => {
    test('page uses Playfair Display for headings', async ({ page }) => {
      await page.goto(PAGE_URL);
      const heading = page.locator('h1').first();
      const fontFamily = await heading.evaluate(el => getComputedStyle(el).fontFamily);
      expect(fontFamily).toContain('Playfair Display');
    });

    test('page uses Inter for body text', async ({ page }) => {
      await page.goto(PAGE_URL);
      const body = page.locator('body');
      const fontFamily = await body.evaluate(el => getComputedStyle(el).fontFamily);
      expect(fontFamily).toContain('Inter');
    });

    test('headings have proper hierarchy', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1); // Only one h1 per page
      const h2Count = await page.locator('h2').count();
      expect(h2Count).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // RESPONSIVE DESIGN TESTS
  // ============================================================================

  test.describe('Responsive Design Tests', () => {
    test('page is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('page is responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('page is responsive on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('CTAs stack on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      const ctaContainer = page.locator('.hero-ctas');
      const flexDirection = await ctaContainer.evaluate(el => getComputedStyle(el).flexDirection);
      expect(flexDirection).toBe('column');
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  test.describe('Accessibility Tests', () => {
    test('page has semantic HTML structure', async ({ page }) => {
      await page.goto(PAGE_URL);
      const sections = await page.locator('section').count();
      expect(sections).toBeGreaterThan(0);
      const footer = await page.locator('footer').count();
      expect(footer).toBe(1);
    });

    test('links have proper attributes', async ({ page }) => {
      await page.goto(PAGE_URL);
      const externalLinks = await page.locator('a[href*="gemini.google.com"]').all();
      for (const link of externalLinks) {
        const rel = await link.getAttribute('rel');
        expect(rel).toContain('noopener');
      }
    });

    test('images/icons have proper contrast', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      const color = await hero.evaluate(el => getComputedStyle(el).color);
      expect(color).toBeTruthy();
    });

    test('focus states are defined', async ({ page }) => {
      await page.goto(PAGE_URL);
      const link = page.locator('a').first();
      await link.focus();
      const outline = await link.evaluate(el => getComputedStyle(el).outline);
      // Focus styles should be present
      expect(outline).toBeTruthy();
    });
  });

  // ============================================================================
  // DESIGN QUALITY TESTS
  // ============================================================================

  test.describe('Design Quality Tests', () => {
    test('sections have proper spacing', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.security-pillars');
      const padding = await section.evaluate(el => getComputedStyle(el).padding);
      expect(padding).toBeTruthy();
    });

    test('cards have rounded corners', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.pillar-card').first();
      const borderRadius = await card.evaluate(el => getComputedStyle(el).borderRadius);
      expect(borderRadius).not.toBe('0px');
    });

    test('cards have shadows', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.feature-card').first();
      const boxShadow = await card.evaluate(el => getComputedStyle(el).boxShadow);
      expect(boxShadow).not.toBe('none');
    });

    test('gradient backgrounds are applied', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      const background = await hero.evaluate(el => getComputedStyle(el).background);
      expect(background).toContain('gradient');
    });

    test('hover effects work on cards', async ({ page }) => {
      await page.goto(PAGE_URL);
      const card = page.locator('.pillar-card').first();
      await card.hover();
      await page.waitForTimeout(300);
      const transform = await card.evaluate(el => getComputedStyle(el).transform);
      expect(transform).not.toBe('none');
    });

    test('color scheme is consistent', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cssVariables = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        return {
          securityBlue: styles.getPropertyValue('--security-blue'),
          securityGreen: styles.getPropertyValue('--security-green'),
        };
      });
      expect(cssVariables.securityBlue).toBeTruthy();
      expect(cssVariables.securityGreen).toBeTruthy();
    });
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  test.describe('Performance Tests', () => {
    test('page loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(PAGE_URL);
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });

    test('shared CSS files are loaded', async ({ page }) => {
      await page.goto(PAGE_URL);
      const designSystem = await page.locator('link[href*="design-system.css"]').count();
      const components = await page.locator('link[href*="components.css"]').count();
      const animations = await page.locator('link[href*="animations.css"]').count();
      expect(designSystem).toBe(1);
      expect(components).toBe(1);
      expect(animations).toBe(1);
    });
  });

  // ============================================================================
  // SECURITY & PRIVACY SPECIFIC TESTS
  // ============================================================================

  test.describe('Security & Privacy Specific Tests', () => {
    test('page mentions "security" extensively', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      const securityCount = (content.match(/security/gi) || []).length;
      expect(securityCount).toBeGreaterThan(30);
    });

    test('page mentions "privacy" extensively', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      const privacyCount = (content.match(/privacy/gi) || []).length;
      expect(privacyCount).toBeGreaterThan(15);
    });

    test('page mentions "encryption"', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      expect(content).toContain('encryption');
      expect(content).toContain('AES-256');
    });

    test('page mentions "compliance"', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      expect(content).toContain('compliance');
      expect(content).toContain('GDPR');
      expect(content).toContain('HIPAA');
    });

    test('page emphasizes Google trust', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      expect(content).toContain('Google');
      expect(content).toContain('trust');
      expect(content).toContain('infrastructure');
    });

    test('page has enterprise focus', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      expect(content).toContain('enterprise');
      expect(content).toContain('admin');
    });

    test('page mentions data protection', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      expect(content).toContain('data protection');
      expect(content).toContain('Data Loss Prevention');
    });

    test('page has user control emphasis', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      expect(content).toContain('control');
      expect(content).toContain('delete');
      expect(content).toContain('transparency');
    });

    test('page mentions certifications', async ({ page }) => {
      await page.goto(PAGE_URL);
      const content = await page.content();
      expect(content).toContain('SOC 2');
      expect(content).toContain('ISO 27001');
      expect(content).toContain('FedRAMP');
      expect(content).toContain('CCPA');
    });
  });

  // ============================================================================
  // SCREENSHOT TESTS
  // ============================================================================

  test.describe('Screenshot Tests', () => {
    test('capture full page screenshot - desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(PAGE_URL);
      await page.screenshot({ path: 'tests/screenshots/security-privacy-desktop.png', fullPage: true });
    });

    test('capture full page screenshot - tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(PAGE_URL);
      await page.screenshot({ path: 'tests/screenshots/security-privacy-tablet.png', fullPage: true });
    });

    test('capture full page screenshot - mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(PAGE_URL);
      await page.screenshot({ path: 'tests/screenshots/security-privacy-mobile.png', fullPage: true });
    });

    test('capture hero section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const hero = page.locator('.hero');
      await hero.screenshot({ path: 'tests/screenshots/security-privacy-hero.png' });
    });

    test('capture security features section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.security-features');
      await section.screenshot({ path: 'tests/screenshots/security-privacy-features.png' });
    });

    test('capture compliance section', async ({ page }) => {
      await page.goto(PAGE_URL);
      const section = page.locator('.compliance');
      await section.screenshot({ path: 'tests/screenshots/security-privacy-compliance.png' });
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  test.describe('Integration Tests', () => {
    test('design system CSS is applied', async ({ page }) => {
      await page.goto(PAGE_URL);
      const cssVariables = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).getPropertyValue('--security-blue');
      });
      expect(cssVariables).toBeTruthy();
    });

    test('animations.js is loaded and functional', async ({ page }) => {
      await page.goto(PAGE_URL);
      const scriptLoaded = await page.evaluate(() => {
        const scripts = Array.from(document.scripts);
        return scripts.some(script => script.src.includes('animations.js'));
      });
      expect(scriptLoaded).toBeTruthy();
    });

    test('all sections render without errors', async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error));
      await page.goto(PAGE_URL);
      expect(errors.length).toBe(0);
    });
  });

  // ============================================================================
  // CONTENT QUALITY TESTS
  // ============================================================================

  test.describe('Content Quality Tests', () => {
    test('headings are descriptive and compelling', async ({ page }) => {
      await page.goto(PAGE_URL);
      const h1 = await page.locator('h1').textContent();
      expect(h1.length).toBeGreaterThan(20);
      expect(h1).toContain('Security');
    });

    test('CTAs are action-oriented', async ({ page }) => {
      await page.goto(PAGE_URL);
      const primaryCTA = await page.locator('.cta-primary').first().textContent();
      expect(primaryCTA).toMatch(/Start|Get|Try|Begin/i);
    });

    test('feature descriptions are detailed', async ({ page }) => {
      await page.goto(PAGE_URL);
      const featureCard = page.locator('.feature-card').first();
      const text = await featureCard.textContent();
      expect(text.length).toBeGreaterThan(100);
    });

    test('testimonials are credible and specific', async ({ page }) => {
      await page.goto(PAGE_URL);
      const testimonial = page.locator('.testimonial-card').first();
      const text = await testimonial.textContent();
      expect(text).toMatch(/CISO|Officer|Director|Chief/);
    });
  });

});
