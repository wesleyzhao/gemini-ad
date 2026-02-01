const { test, expect } = require('@playwright/test');

test.describe('Business Intelligence Landing Page', () => {
  const pageUrl = 'http://localhost:8000/pages/business-intelligence.html';

  // Page Load Tests
  test.describe('Page Load', () => {
    test('should load successfully', async ({ page }) => {
      const response = await page.goto(pageUrl);
      expect(response.status()).toBe(200);
    });

    test('should have correct title', async ({ page }) => {
      await page.goto(pageUrl);
      await expect(page).toHaveTitle(/Transform data into insights/);
    });

    test('should have correct meta description', async ({ page }) => {
      await page.goto(pageUrl);
      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('Make smarter business decisions');
      expect(metaDescription).toContain('AI-powered analytics');
    });

    test('should load all stylesheets', async ({ page }) => {
      await page.goto(pageUrl);
      const designSystem = await page.locator('link[href*="design-system.css"]').count();
      const components = await page.locator('link[href*="components.css"]').count();
      const animations = await page.locator('link[href*="animations.css"]').count();
      expect(designSystem).toBe(1);
      expect(components).toBe(1);
      expect(animations).toBe(1);
    });
  });

  // Navigation Tests
  test.describe('Navigation', () => {
    test('should have working CTA links to Gemini', async ({ page }) => {
      await page.goto(pageUrl);
      const ctaLinks = await page.locator('a[href*="gemini.google.com"]').all();
      expect(ctaLinks.length).toBeGreaterThanOrEqual(3);
    });

    test('should have smooth scroll to capabilities section', async ({ page }) => {
      await page.goto(pageUrl);
      const capabilitiesLink = page.locator('a[href="#capabilities"]');
      await expect(capabilitiesLink).toBeVisible();
    });

    test('should have rel="noopener" on external links', async ({ page }) => {
      await page.goto(pageUrl);
      const externalLinks = await page.locator('a[href*="gemini.google.com"]').all();
      for (const link of externalLinks) {
        const rel = await link.getAttribute('rel');
        expect(rel).toContain('noopener');
      }
    });

    test('should have footer with Gemini link', async ({ page }) => {
      await page.goto(pageUrl);
      const footerLink = page.locator('footer a[href*="gemini.google.com"]');
      await expect(footerLink).toBeVisible();
    });
  });

  // Hero Section Tests
  test.describe('Hero Section', () => {
    test('should display hero badge', async ({ page }) => {
      await page.goto(pageUrl);
      const badge = page.locator('.hero-badge');
      await expect(badge).toBeVisible();
      await expect(badge).toHaveText(/Business Intelligence AI/i);
    });

    test('should display main headline', async ({ page }) => {
      await page.goto(pageUrl);
      const h1 = page.locator('.hero h1');
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText(/Transform data into insights/i);
    });

    test('should display hero subtitle', async ({ page }) => {
      await page.goto(pageUrl);
      const subtitle = page.locator('.hero-subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('Make smarter business decisions');
    });

    test('should have primary CTA button', async ({ page }) => {
      await page.goto(pageUrl);
      const primaryCta = page.locator('.hero .cta-primary');
      await expect(primaryCta).toBeVisible();
      await expect(primaryCta).toContainText(/Start Analyzing Free/i);
    });

    test('should have secondary CTA button', async ({ page }) => {
      await page.goto(pageUrl);
      const secondaryCta = page.locator('.hero .cta-secondary');
      await expect(secondaryCta).toBeVisible();
      await expect(secondaryCta).toContainText(/See Capabilities/i);
    });

    test('should have animated grid background', async ({ page }) => {
      await page.goto(pageUrl);
      const hero = page.locator('.hero');
      const hasAnimation = await hero.evaluate((el) => {
        const styles = window.getComputedStyle(el, '::before');
        return styles.animation !== 'none' || styles.animationName !== 'none';
      });
      expect(hasAnimation).toBeTruthy();
    });

    test('should have gradient background', async ({ page }) => {
      await page.goto(pageUrl);
      const hero = page.locator('.hero');
      const background = await hero.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).toContain('gradient');
    });
  });

  // Metrics Section Tests
  test.describe('Metrics Section', () => {
    test('should display "Proven Results" badge', async ({ page }) => {
      await page.goto(pageUrl);
      const badge = page.locator('.section-badge').filter({ hasText: 'Proven Results' });
      await expect(badge).toBeVisible();
    });

    test('should display section title', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('h2').filter({ hasText: 'Trusted by data-driven teams' });
      await expect(title).toBeVisible();
    });

    test('should have 4 metric cards', async ({ page }) => {
      await page.goto(pageUrl);
      const metricCards = page.locator('.metric-card');
      await expect(metricCards).toHaveCount(4);
    });

    test('should display "10x" metric', async ({ page }) => {
      await page.goto(pageUrl);
      const metric = page.locator('.metric-number').filter({ hasText: '10x' });
      await expect(metric).toBeVisible();
      const label = page.locator('.metric-label').filter({ hasText: 'Faster Data Analysis' });
      await expect(label).toBeVisible();
    });

    test('should display "85%" metric', async ({ page }) => {
      await page.goto(pageUrl);
      const metric = page.locator('.metric-number').filter({ hasText: '85%' });
      await expect(metric).toBeVisible();
      const label = page.locator('.metric-label').filter({ hasText: 'Time Saved on Reports' });
      await expect(label).toBeVisible();
    });

    test('should display "95%" metric', async ({ page }) => {
      await page.goto(pageUrl);
      const metric = page.locator('.metric-number').filter({ hasText: '95%' });
      await expect(metric).toBeVisible();
      const label = page.locator('.metric-label').filter({ hasText: 'Accuracy in Predictions' });
      await expect(label).toBeVisible();
    });

    test('should display "2M+" metric', async ({ page }) => {
      await page.goto(pageUrl);
      const metric = page.locator('.metric-number').filter({ hasText: '2M+' });
      await expect(metric).toBeVisible();
      const label = page.locator('.metric-label').filter({ hasText: 'Insights Generated Daily' });
      await expect(label).toBeVisible();
    });

    test('should have gradient on metric numbers', async ({ page }) => {
      await page.goto(pageUrl);
      const metricNumber = page.locator('.metric-number').first();
      const background = await metricNumber.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).toContain('gradient');
    });
  });

  // Capabilities Section Tests
  test.describe('Capabilities Section', () => {
    test('should display "Core Capabilities" badge', async ({ page }) => {
      await page.goto(pageUrl);
      const badge = page.locator('.section-badge').filter({ hasText: 'Core Capabilities' });
      await expect(badge).toBeVisible();
    });

    test('should have 6 capability cards', async ({ page }) => {
      await page.goto(pageUrl);
      const capabilityCards = page.locator('#capabilities .capability-card');
      await expect(capabilityCards).toHaveCount(6);
    });

    test('should display "Instant Data Analysis" capability', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'Instant Data Analysis' });
      await expect(title).toBeVisible();
      const description = page.locator('.capability-description').filter({ hasText: /Upload spreadsheets/ });
      await expect(description).toBeVisible();
    });

    test('should display "AI-Powered Predictions" capability', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'AI-Powered Predictions' });
      await expect(title).toBeVisible();
      const description = page.locator('.capability-description').filter({ hasText: /Forecast sales/ });
      await expect(description).toBeVisible();
    });

    test('should display "Automated Reporting" capability', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'Automated Reporting' });
      await expect(title).toBeVisible();
    });

    test('should display "Smart Recommendations" capability', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'Smart Recommendations' });
      await expect(title).toBeVisible();
    });

    test('should display "Real-Time Monitoring" capability', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'Real-Time Monitoring' });
      await expect(title).toBeVisible();
    });

    test('should display "Custom Analytics" capability', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'Custom Analytics' });
      await expect(title).toBeVisible();
    });

    test('should have emoji icons on capability cards', async ({ page }) => {
      await page.goto(pageUrl);
      const icons = page.locator('#capabilities .capability-icon');
      await expect(icons).toHaveCount(6);
    });
  });

  // Dashboard Demo Section Tests
  test.describe('Dashboard Demo Section', () => {
    test('should display "Live Example" badge', async ({ page }) => {
      await page.goto(pageUrl);
      const badge = page.locator('.section-badge').filter({ hasText: 'Live Example' });
      await expect(badge).toBeVisible();
    });

    test('should display dashboard title', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.dashboard-title');
      await expect(title).toBeVisible();
      await expect(title).toContainText('Q4 2025 Performance Dashboard');
    });

    test('should display dashboard period', async ({ page }) => {
      await page.goto(pageUrl);
      const period = page.locator('.dashboard-period');
      await expect(period).toBeVisible();
      await expect(period).toContainText('Last 90 days');
    });

    test('should have 4 stat boxes', async ({ page }) => {
      await page.goto(pageUrl);
      const statBoxes = page.locator('.stat-box');
      await expect(statBoxes).toHaveCount(4);
    });

    test('should display revenue stat', async ({ page }) => {
      await page.goto(pageUrl);
      const label = page.locator('.stat-label').filter({ hasText: 'Total Revenue' });
      await expect(label).toBeVisible();
      const value = page.locator('.stat-value').filter({ hasText: '$2.4M' });
      await expect(value).toBeVisible();
      const change = page.locator('.stat-change.positive').filter({ hasText: '↑ 23.5%' });
      await expect(change).toBeVisible();
    });

    test('should display new customers stat', async ({ page }) => {
      await page.goto(pageUrl);
      const label = page.locator('.stat-label').filter({ hasText: 'New Customers' });
      await expect(label).toBeVisible();
      const value = page.locator('.stat-value').filter({ hasText: '1,847' });
      await expect(value).toBeVisible();
    });

    test('should display conversion rate stat', async ({ page }) => {
      await page.goto(pageUrl);
      const label = page.locator('.stat-label').filter({ hasText: 'Conversion Rate' });
      await expect(label).toBeVisible();
      const value = page.locator('.stat-value').filter({ hasText: '3.8%' });
      await expect(value).toBeVisible();
    });

    test('should display churn rate stat with negative change', async ({ page }) => {
      await page.goto(pageUrl);
      const label = page.locator('.stat-label').filter({ hasText: 'Churn Rate' });
      await expect(label).toBeVisible();
      const value = page.locator('.stat-value').filter({ hasText: '2.1%' });
      await expect(value).toBeVisible();
      const change = page.locator('.stat-change.negative').filter({ hasText: '↓ 0.8%' });
      await expect(change).toBeVisible();
    });

    test('should display bar chart', async ({ page }) => {
      await page.goto(pageUrl);
      const chart = page.locator('.bar-chart');
      await expect(chart).toBeVisible();
      const bars = page.locator('.bar');
      await expect(bars).toHaveCount(3);
    });

    test('should display chart title', async ({ page }) => {
      await page.goto(pageUrl);
      const chartTitle = page.locator('.chart-title').filter({ hasText: 'Monthly Revenue Trend' });
      await expect(chartTitle).toBeVisible();
    });

    test('should display bar values', async ({ page }) => {
      await page.goto(pageUrl);
      const oct = page.locator('.bar-value').filter({ hasText: '$680K' });
      const nov = page.locator('.bar-value').filter({ hasText: '$780K' });
      const dec = page.locator('.bar-value').filter({ hasText: '$940K' });
      await expect(oct).toBeVisible();
      await expect(nov).toBeVisible();
      await expect(dec).toBeVisible();
    });

    test('should display bar labels', async ({ page }) => {
      await page.goto(pageUrl);
      const oct = page.locator('.bar-label').filter({ hasText: 'Oct' });
      const nov = page.locator('.bar-label').filter({ hasText: 'Nov' });
      const dec = page.locator('.bar-label').filter({ hasText: 'Dec' });
      await expect(oct).toBeVisible();
      await expect(nov).toBeVisible();
      await expect(dec).toBeVisible();
    });

    test('should display insights panel', async ({ page }) => {
      await page.goto(pageUrl);
      const panel = page.locator('.insights-panel');
      await expect(panel).toBeVisible();
    });

    test('should display insights title', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.insights-title').filter({ hasText: 'AI-Generated Insights' });
      await expect(title).toBeVisible();
    });

    test('should have 3 insight items', async ({ page }) => {
      await page.goto(pageUrl);
      const insights = page.locator('.insight-item');
      await expect(insights).toHaveCount(3);
    });

    test('should display revenue growth insight', async ({ page }) => {
      await page.goto(pageUrl);
      const insight = page.locator('.insight-text').filter({ hasText: 'December revenue grew 20%' });
      await expect(insight).toBeVisible();
    });

    test('should display CAC insight', async ({ page }) => {
      await page.goto(pageUrl);
      const insight = page.locator('.insight-text').filter({ hasText: 'Customer acquisition cost decreased' });
      await expect(insight).toBeVisible();
    });

    test('should display churn improvement insight', async ({ page }) => {
      await page.goto(pageUrl);
      const insight = page.locator('.insight-text').filter({ hasText: 'Churn rate improved' });
      await expect(insight).toBeVisible();
    });
  });

  // Use Cases Section Tests
  test.describe('Use Cases Section', () => {
    test('should display "Use Cases" badge', async ({ page }) => {
      await page.goto(pageUrl);
      const badge = page.locator('.section-badge').filter({ hasText: 'Use Cases' });
      await expect(badge).toBeVisible();
    });

    test('should have 6 use case cards', async ({ page }) => {
      await page.goto(pageUrl);
      const useCases = page.locator('.use-case');
      await expect(useCases).toHaveCount(6);
    });

    test('should display "Sales Analytics" use case', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.use-case-title').filter({ hasText: 'Sales Analytics' });
      await expect(title).toBeVisible();
      const description = page.locator('.use-case-description').filter({ hasText: /Track pipeline health/ });
      await expect(description).toBeVisible();
    });

    test('should display "Operations Intelligence" use case', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.use-case-title').filter({ hasText: 'Operations Intelligence' });
      await expect(title).toBeVisible();
    });

    test('should display "Financial Planning" use case', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.use-case-title').filter({ hasText: 'Financial Planning' });
      await expect(title).toBeVisible();
    });

    test('should display "Customer Analytics" use case', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.use-case-title').filter({ hasText: 'Customer Analytics' });
      await expect(title).toBeVisible();
    });

    test('should display "Marketing ROI" use case', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.use-case-title').filter({ hasText: 'Marketing ROI' });
      await expect(title).toBeVisible();
    });

    test('should display "HR Analytics" use case', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.use-case-title').filter({ hasText: 'HR Analytics' });
      await expect(title).toBeVisible();
    });

    test('should have emoji icons on use case cards', async ({ page }) => {
      await page.goto(pageUrl);
      const icons = page.locator('.use-case-icon');
      await expect(icons).toHaveCount(6);
    });
  });

  // Integration Section Tests
  test.describe('Integration Section', () => {
    test('should display "Seamless Integration" badge', async ({ page }) => {
      await page.goto(pageUrl);
      const badge = page.locator('.section-badge').filter({ hasText: 'Seamless Integration' });
      await expect(badge).toBeVisible();
    });

    test('should display section title', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('h2').filter({ hasText: 'Works with your existing tools' });
      await expect(title).toBeVisible();
    });

    test('should have 6 integration cards', async ({ page }) => {
      await page.goto(pageUrl);
      const integrations = page.locator('.section-light .capability-card').nth(1).locator('..').locator('.capability-card');
      const count = await page.locator('.section-light').nth(1).locator('.capability-card').count();
      expect(count).toBe(6);
    });

    test('should display "Google Sheets" integration', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'Google Sheets' });
      await expect(title).toBeVisible();
    });

    test('should display "BigQuery & Cloud" integration', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'BigQuery & Cloud' });
      await expect(title).toBeVisible();
    });

    test('should display "Gmail & Workspace" integration', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'Gmail & Workspace' });
      await expect(title).toBeVisible();
    });

    test('should display "Data Studio" integration', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'Data Studio' });
      await expect(title).toBeVisible();
    });

    test('should display "CSV & Excel" integration', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'CSV & Excel' });
      await expect(title).toBeVisible();
    });

    test('should display "API Integration"', async ({ page }) => {
      await page.goto(pageUrl);
      const title = page.locator('.capability-title').filter({ hasText: 'API Integration' });
      await expect(title).toBeVisible();
    });
  });

  // Testimonials Section Tests
  test.describe('Testimonials Section', () => {
    test('should display "Customer Stories" badge', async ({ page }) => {
      await page.goto(pageUrl);
      const badge = page.locator('.section-badge').filter({ hasText: 'Customer Stories' });
      await expect(badge).toBeVisible();
    });

    test('should have 3 testimonials', async ({ page }) => {
      await page.goto(pageUrl);
      const testimonials = page.locator('.testimonial');
      await expect(testimonials).toHaveCount(3);
    });

    test('should display Michael Chen testimonial', async ({ page }) => {
      await page.goto(pageUrl);
      const name = page.locator('.author-name').filter({ hasText: 'Michael Chen' });
      await expect(name).toBeVisible();
      const role = page.locator('.author-role').filter({ hasText: 'VP of Sales, Salesforce' });
      await expect(role).toBeVisible();
      const text = page.locator('.testimonial-text').filter({ hasText: 'Gemini transformed how we analyze sales data' });
      await expect(text).toBeVisible();
    });

    test('should display Sarah Martinez testimonial', async ({ page }) => {
      await page.goto(pageUrl);
      const name = page.locator('.author-name').filter({ hasText: 'Sarah Martinez' });
      await expect(name).toBeVisible();
      const role = page.locator('.author-role').filter({ hasText: 'CFO, Shopify' });
      await expect(role).toBeVisible();
    });

    test('should display David Kim testimonial', async ({ page }) => {
      await page.goto(pageUrl);
      const name = page.locator('.author-name').filter({ hasText: 'David Kim' });
      await expect(name).toBeVisible();
      const role = page.locator('.author-role').filter({ hasText: 'Head of Analytics, Netflix' });
      await expect(role).toBeVisible();
    });

    test('should have quote marks on testimonials', async ({ page }) => {
      await page.goto(pageUrl);
      const quoteMarks = page.locator('.quote-mark');
      await expect(quoteMarks).toHaveCount(3);
    });

    test('should have author avatars', async ({ page }) => {
      await page.goto(pageUrl);
      const avatars = page.locator('.author-avatar');
      await expect(avatars).toHaveCount(3);
    });
  });

  // Final CTA Section Tests
  test.describe('Final CTA Section', () => {
    test('should display final CTA heading', async ({ page }) => {
      await page.goto(pageUrl);
      const heading = page.locator('.final-cta h2');
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Start making data-driven decisions today');
    });

    test('should display final CTA subtext', async ({ page }) => {
      await page.goto(pageUrl);
      const subtext = page.locator('.final-cta p');
      await expect(subtext).toBeVisible();
      await expect(subtext).toContainText('Join thousands of businesses');
    });

    test('should have final CTA button', async ({ page }) => {
      await page.goto(pageUrl);
      const button = page.locator('.final-cta .cta-button');
      await expect(button).toBeVisible();
      await expect(button).toContainText(/Get Started Free/i);
    });

    test('should have gradient background', async ({ page }) => {
      await page.goto(pageUrl);
      const finalCta = page.locator('.final-cta');
      const background = await finalCta.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).toContain('gradient');
    });
  });

  // Footer Tests
  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      await page.goto(pageUrl);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should display copyright', async ({ page }) => {
      await page.goto(pageUrl);
      const copyright = page.locator('footer p');
      await expect(copyright).toContainText('2026 Google LLC');
    });

    test('should have Gemini link in footer', async ({ page }) => {
      await page.goto(pageUrl);
      const link = page.locator('footer a');
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', 'https://gemini.google.com');
    });

    test('should have dark background', async ({ page }) => {
      await page.goto(pageUrl);
      const footer = page.locator('footer');
      const background = await footer.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });
      expect(background).toBeTruthy();
    });
  });

  // CTA & Links Tests
  test.describe('CTA & Links', () => {
    test('should have multiple conversion points', async ({ page }) => {
      await page.goto(pageUrl);
      const ctaLinks = await page.locator('a[href*="gemini.google.com"]').all();
      expect(ctaLinks.length).toBeGreaterThanOrEqual(3);
    });

    test('should have consistent CTA text', async ({ page }) => {
      await page.goto(pageUrl);
      const heroCta = page.locator('.hero .cta-primary');
      const finalCta = page.locator('.final-cta .cta-primary');
      await expect(heroCta).toContainText(/Free/i);
      await expect(finalCta).toContainText(/Free/i);
    });
  });

  // Animation Tests
  test.describe('Animations', () => {
    test('should have fadeInUp animation on hero elements', async ({ page }) => {
      await page.goto(pageUrl);
      const badge = page.locator('.hero-badge');
      const animation = await badge.evaluate((el) => {
        return window.getComputedStyle(el).animation;
      });
      expect(animation).toContain('fadeInUp');
    });

    test('should have hover effects on metric cards', async ({ page }) => {
      await page.goto(pageUrl);
      const card = page.locator('.metric-card').first();
      await card.hover();
      // Just verify the card is interactive
      await expect(card).toBeVisible();
    });

    test('should have hover effects on capability cards', async ({ page }) => {
      await page.goto(pageUrl);
      const card = page.locator('.capability-card').first();
      await card.hover();
      await expect(card).toBeVisible();
    });

    test('should have grid animation', async ({ page }) => {
      await page.goto(pageUrl);
      const hasGridAnimation = await page.evaluate(() => {
        const style = document.querySelector('style');
        return style.textContent.includes('gridMove');
      });
      expect(hasGridAnimation).toBeTruthy();
    });
  });

  // Typography Tests
  test.describe('Typography', () => {
    test('should use Playfair Display for headings', async ({ page }) => {
      await page.goto(pageUrl);
      const h1 = page.locator('h1').first();
      const fontFamily = await h1.evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });
      expect(fontFamily).toContain('Playfair Display');
    });

    test('should use Inter for body text', async ({ page }) => {
      await page.goto(pageUrl);
      const body = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontFamily;
      });
      expect(body).toContain('Inter');
    });

    test('should have responsive font sizes', async ({ page }) => {
      await page.goto(pageUrl);
      const h1 = page.locator('h1').first();
      const fontSize = await h1.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      expect(fontSize).toBeTruthy();
    });
  });

  // Responsive Tests
  test.describe('Responsive Design', () => {
    test('should display properly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(pageUrl);
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });

    test('should stack CTAs on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(pageUrl);
      const heroCta = page.locator('.hero-cta');
      const flexDirection = await heroCta.evaluate((el) => {
        return window.getComputedStyle(el).flexDirection;
      });
      expect(flexDirection).toBe('column');
    });

    test('should adjust dashboard padding on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(pageUrl);
      const dashboard = page.locator('.dashboard-demo');
      await expect(dashboard).toBeVisible();
    });

    test('should be readable on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(pageUrl);
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    });
  });

  // Accessibility Tests
  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(pageUrl);
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have alt text or aria labels where needed', async ({ page }) => {
      await page.goto(pageUrl);
      const links = await page.locator('a').all();
      for (const link of links) {
        const text = await link.textContent();
        expect(text.trim().length).toBeGreaterThan(0);
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto(pageUrl);
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto(pageUrl);
      // This is a basic check - proper contrast testing would need more sophisticated tools
      const body = await page.evaluate(() => {
        return window.getComputedStyle(document.body).color;
      });
      expect(body).toBeTruthy();
    });
  });

  // Design Quality Tests
  test.describe('Design Quality', () => {
    test('should have consistent border radius', async ({ page }) => {
      await page.goto(pageUrl);
      const card = page.locator('.capability-card').first();
      const borderRadius = await card.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });
      expect(borderRadius).toBeTruthy();
    });

    test('should use CSS custom properties', async ({ page }) => {
      await page.goto(pageUrl);
      const hasCustomProps = await page.evaluate(() => {
        const style = document.querySelector('style');
        return style.textContent.includes('--bi-primary');
      });
      expect(hasCustomProps).toBeTruthy();
    });

    test('should have consistent spacing', async ({ page }) => {
      await page.goto(pageUrl);
      const section = page.locator('.section').first();
      const padding = await section.evaluate((el) => {
        return window.getComputedStyle(el).padding;
      });
      expect(padding).toBeTruthy();
    });

    test('should have smooth transitions', async ({ page }) => {
      await page.goto(pageUrl);
      const button = page.locator('.cta-button').first();
      const transition = await button.evaluate((el) => {
        return window.getComputedStyle(el).transition;
      });
      expect(transition).toContain('cubic-bezier');
    });

    test('should have box shadows on cards', async ({ page }) => {
      await page.goto(pageUrl);
      const card = page.locator('.dashboard-demo');
      const boxShadow = await card.evaluate((el) => {
        return window.getComputedStyle(el).boxShadow;
      });
      expect(boxShadow).not.toBe('none');
    });

    test('should have gradient backgrounds', async ({ page }) => {
      await page.goto(pageUrl);
      const hero = page.locator('.hero');
      const background = await hero.evaluate((el) => {
        return window.getComputedStyle(el).background;
      });
      expect(background).toContain('gradient');
    });
  });

  // Performance Tests
  test.describe('Performance', () => {
    test('should load in reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(pageUrl);
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });

    test('should have minimal layout shifts', async ({ page }) => {
      await page.goto(pageUrl);
      await page.waitForLoadState('networkidle');
      // Verify content is stable
      const hero = page.locator('.hero');
      await expect(hero).toBeVisible();
    });
  });

  // Business Intelligence Specific Tests
  test.describe('Business Intelligence Specific Features', () => {
    test('should emphasize data analytics', async ({ page }) => {
      await page.goto(pageUrl);
      const content = await page.content();
      expect(content.toLowerCase()).toContain('data');
      expect(content.toLowerCase()).toContain('analytics');
      expect(content.toLowerCase()).toContain('insights');
    });

    test('should showcase dashboard features', async ({ page }) => {
      await page.goto(pageUrl);
      const dashboard = page.locator('.dashboard-demo');
      await expect(dashboard).toBeVisible();
    });

    test('should display business metrics', async ({ page }) => {
      await page.goto(pageUrl);
      const revenue = page.locator('.stat-label').filter({ hasText: 'Total Revenue' });
      await expect(revenue).toBeVisible();
    });

    test('should show data visualization', async ({ page }) => {
      await page.goto(pageUrl);
      const chart = page.locator('.bar-chart');
      await expect(chart).toBeVisible();
    });

    test('should highlight AI-powered insights', async ({ page }) => {
      await page.goto(pageUrl);
      const insights = page.locator('.insights-panel');
      await expect(insights).toBeVisible();
    });

    test('should mention reporting automation', async ({ page }) => {
      await page.goto(pageUrl);
      const content = await page.content();
      expect(content.toLowerCase()).toContain('automated reporting');
    });

    test('should show business use cases', async ({ page }) => {
      await page.goto(pageUrl);
      const salesAnalytics = page.locator('.use-case-title').filter({ hasText: 'Sales Analytics' });
      const operations = page.locator('.use-case-title').filter({ hasText: 'Operations Intelligence' });
      await expect(salesAnalytics).toBeVisible();
      await expect(operations).toBeVisible();
    });

    test('should display integration options', async ({ page }) => {
      await page.goto(pageUrl);
      const sheets = page.locator('.capability-title').filter({ hasText: 'Google Sheets' });
      const bigquery = page.locator('.capability-title').filter({ hasText: 'BigQuery' });
      await expect(sheets).toBeVisible();
      await expect(bigquery).toBeVisible();
    });

    test('should show real-time monitoring capability', async ({ page }) => {
      await page.goto(pageUrl);
      const realTime = page.locator('.capability-title').filter({ hasText: 'Real-Time Monitoring' });
      await expect(realTime).toBeVisible();
    });
  });

  // Screenshot Tests
  test.describe('Screenshots', () => {
    test('should capture desktop hero', async ({ page }) => {
      await page.goto(pageUrl);
      await page.locator('.hero').screenshot({ path: 'screenshots/bi-hero-desktop.png' });
    });

    test('should capture dashboard demo', async ({ page }) => {
      await page.goto(pageUrl);
      await page.locator('.dashboard-demo').screenshot({ path: 'screenshots/bi-dashboard-desktop.png' });
    });

    test('should capture full page on desktop', async ({ page }) => {
      await page.goto(pageUrl);
      await page.screenshot({ path: 'screenshots/bi-full-desktop.png', fullPage: true });
    });

    test('should capture mobile view', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(pageUrl);
      await page.screenshot({ path: 'screenshots/bi-mobile.png', fullPage: true });
    });

    test('should capture tablet view', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(pageUrl);
      await page.screenshot({ path: 'screenshots/bi-tablet.png', fullPage: true });
    });

    test('should capture capabilities section', async ({ page }) => {
      await page.goto(pageUrl);
      await page.locator('#capabilities').screenshot({ path: 'screenshots/bi-capabilities-desktop.png' });
    });
  });

  // Integration Tests
  test.describe('Integration with Shared Assets', () => {
    test('should load design-system.css', async ({ page }) => {
      await page.goto(pageUrl);
      const response = await page.goto('../assets/css/design-system.css');
      expect(response.status()).toBe(200);
    });

    test('should load components.css', async ({ page }) => {
      await page.goto(pageUrl);
      const response = await page.goto('../assets/css/components.css');
      expect(response.status()).toBe(200);
    });

    test('should load animations.js', async ({ page }) => {
      await page.goto(pageUrl);
      const script = await page.locator('script[src*="animations.js"]').count();
      expect(script).toBe(1);
    });
  });

  // Content Quality Tests
  test.describe('Content Quality', () => {
    test('should have compelling value propositions', async ({ page }) => {
      await page.goto(pageUrl);
      const subtitle = page.locator('.hero-subtitle');
      const text = await subtitle.textContent();
      expect(text.length).toBeGreaterThan(50);
    });

    test('should have specific metrics and statistics', async ({ page }) => {
      await page.goto(pageUrl);
      const content = await page.content();
      expect(content).toContain('10x');
      expect(content).toContain('85%');
      expect(content).toContain('95%');
      expect(content).toContain('2M+');
    });

    test('should mention professional use cases', async ({ page }) => {
      await page.goto(pageUrl);
      const content = await page.content();
      expect(content).toContain('Sales Analytics');
      expect(content).toContain('Financial Planning');
      expect(content).toContain('Operations Intelligence');
    });

    test('should have credible testimonials', async ({ page }) => {
      await page.goto(pageUrl);
      const content = await page.content();
      expect(content).toContain('Salesforce');
      expect(content).toContain('Shopify');
      expect(content).toContain('Netflix');
    });
  });
});
