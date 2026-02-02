// @ts-check
const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8000/pages/personal-assistant.html';

test.describe('Personal Assistant Landing Page', () => {

    // ====================
    // Page Load Tests
    // ====================

    test('page loads successfully', async ({ page }) => {
        const response = await page.goto(PAGE_URL);
        expect(response?.status()).toBe(200);
    });

    test('page has correct title', async ({ page }) => {
        await page.goto(PAGE_URL);
        await expect(page).toHaveTitle(/Your AI Personal Assistant.*Gemini/i);
    });

    test('page has meta description', async ({ page }) => {
        await page.goto(PAGE_URL);
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
        expect(metaDescription).toBeTruthy();
        expect(metaDescription).toContain('daily tasks');
    });

    test('page content is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const body = page.locator('body');
        await expect(body).toBeVisible();
    });

    // ====================
    // Navigation Tests
    // ====================

    test('smooth scroll works for anchor links', async ({ page }) => {
        await page.goto(PAGE_URL);
        await page.click('a[href="#capabilities"]');
        await page.waitForTimeout(1000);
        const capabilitiesSection = page.locator('#capabilities');
        await expect(capabilitiesSection).toBeInViewport();
    });

    test('all external links have rel="noopener"', async ({ page }) => {
        await page.goto(PAGE_URL);
        const externalLinks = await page.locator('a[href^="http"]').all();
        for (const link of externalLinks) {
            const rel = await link.getAttribute('rel');
            expect(rel).toContain('noopener');
        }
    });

    test('footer links are present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const footerLinks = page.locator('footer a');
        const count = await footerLinks.count();
        expect(count).toBeGreaterThan(0);
    });

    test('navigation to capabilities section works', async ({ page }) => {
        await page.goto(PAGE_URL);
        const capabilitiesLink = page.locator('a[href="#capabilities"]');
        await expect(capabilitiesLink).toBeVisible();
    });

    // ====================
    // Hero Section Tests
    // ====================

    test('hero section is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();
    });

    test('hero has correct badge text', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.hero-badge');
        await expect(badge).toContainText('AI Personal Assistant');
    });

    test('hero has main heading', async ({ page }) => {
        await page.goto(PAGE_URL);
        const heading = page.locator('.hero h1');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/day.*organized/i);
    });

    test('hero has subtitle', async ({ page }) => {
        await page.goto(PAGE_URL);
        const subtitle = page.locator('.hero-subtitle');
        await expect(subtitle).toBeVisible();
        await expect(subtitle).toContainText('tasks');
    });

    test('hero has primary CTA', async ({ page }) => {
        await page.goto(PAGE_URL);
        const primaryCTA = page.locator('.cta-primary');
        await expect(primaryCTA).toBeVisible();
        await expect(primaryCTA).toContainText(/get.*assistant/i);
    });

    test('hero has secondary CTA', async ({ page }) => {
        await page.goto(PAGE_URL);
        const secondaryCTA = page.locator('.cta-secondary');
        await expect(secondaryCTA).toBeVisible();
        await expect(secondaryCTA).toContainText(/see what/i);
    });

    test('hero CTAs link to Gemini', async ({ page }) => {
        await page.goto(PAGE_URL);
        const primaryCTA = page.locator('.cta-primary');
        const href = await primaryCTA.getAttribute('href');
        expect(href).toContain('gemini.google.com');
    });

    // ====================
    // Capabilities Section Tests
    // ====================

    test('capabilities section is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const capabilities = page.locator('.capabilities');
        await expect(capabilities).toBeVisible();
    });

    test('capabilities has section badge', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.capabilities .section-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toContainText(/intelligent automation/i);
    });

    test('capabilities has heading', async ({ page }) => {
        await page.goto(PAGE_URL);
        const heading = page.locator('.capabilities h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/everything.*one place/i);
    });

    test('capabilities grid has 6 cards', async ({ page }) => {
        await page.goto(PAGE_URL);
        const cards = page.locator('.capability-card');
        await expect(cards).toHaveCount(6);
    });

    test('smart inbox capability card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.capability-card:has-text("Smart Inbox Management")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('emails');
    });

    test('intelligent scheduling capability card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.capability-card:has-text("Intelligent Scheduling")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('calendar');
    });

    test('task automation capability card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.capability-card:has-text("Task Automation")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('tasks');
    });

    test('proactive reminders capability card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.capability-card:has-text("Proactive Reminders")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('notifications');
    });

    test('daily briefings capability card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.capability-card:has-text("Daily Briefings")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('summary');
    });

    test('workspace integration capability card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.capability-card:has-text("Workspace Integration")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('Gmail');
    });

    test('all capability cards have icons', async ({ page }) => {
        await page.goto(PAGE_URL);
        const icons = page.locator('.capability-icon');
        await expect(icons).toHaveCount(6);
    });

    // ====================
    // Task Demo Section Tests
    // ====================

    test('task demo section is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const taskDemo = page.locator('.task-demo');
        await expect(taskDemo).toBeVisible();
    });

    test('task demo has section badge', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.task-demo .section-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toContainText(/smart task/i);
    });

    test('task demo has heading', async ({ page }) => {
        await page.goto(PAGE_URL);
        const heading = page.locator('.task-demo h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/intelligently managed/i);
    });

    test('task demo has 3 task cards', async ({ page }) => {
        await page.goto(PAGE_URL);
        const cards = page.locator('.task-card');
        await expect(cards).toHaveCount(3);
    });

    test('morning briefing task card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.task-card:has-text("Morning Briefing Ready")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('9:00 AM');
    });

    test('meeting conflict task card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.task-card:has-text("Meeting Conflict Detected")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('11:30 AM');
    });

    test('action items task card is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.task-card:has-text("Action Items Extracted")');
        await expect(card).toBeVisible();
        await expect(card).toContainText('2:45 PM');
    });

    test('all task cards have time badges', async ({ page }) => {
        await page.goto(PAGE_URL);
        const times = page.locator('.task-time');
        await expect(times).toHaveCount(3);
    });

    test('all task cards have action links', async ({ page }) => {
        await page.goto(PAGE_URL);
        const actions = page.locator('.task-action');
        await expect(actions).toHaveCount(3);
    });

    test('task action links point to Gemini', async ({ page }) => {
        await page.goto(PAGE_URL);
        const action = page.locator('.task-action').first();
        const href = await action.getAttribute('href');
        expect(href).toContain('gemini.google.com');
    });

    // ====================
    // Email Assistant Section Tests
    // ====================

    test('email assistant section is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const emailSection = page.locator('.email-assistant');
        await expect(emailSection).toBeVisible();
    });

    test('email section has badge', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.email-assistant .section-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toContainText(/email intelligence/i);
    });

    test('email section has heading', async ({ page }) => {
        await page.goto(PAGE_URL);
        const heading = page.locator('.email-content h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/inbox zero/i);
    });

    test('email section has 3 feature items', async ({ page }) => {
        await page.goto(PAGE_URL);
        const features = page.locator('.email-feature');
        await expect(features).toHaveCount(3);
    });

    test('smart prioritization feature is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const feature = page.locator('.email-feature:has-text("Smart Prioritization")');
        await expect(feature).toBeVisible();
        await expect(feature).toContainText('urgent emails');
    });

    test('draft responses feature is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const feature = page.locator('.email-feature:has-text("Draft Responses")');
        await expect(feature).toBeVisible();
        await expect(feature).toContainText('AI-powered');
    });

    test('quick summaries feature is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const feature = page.locator('.email-feature:has-text("Quick Summaries")');
        await expect(feature).toBeVisible();
        await expect(feature).toContainText('email threads');
    });

    test('email demo card is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const demo = page.locator('.email-demo');
        await expect(demo).toBeVisible();
    });

    test('email demo has sender info', async ({ page }) => {
        await page.goto(PAGE_URL);
        const sender = page.locator('.email-demo-info h5');
        await expect(sender).toBeVisible();
        await expect(sender).toContainText('Jane Doe');
    });

    test('email demo has subject line', async ({ page }) => {
        await page.goto(PAGE_URL);
        const subject = page.locator('.email-demo-info p');
        await expect(subject).toBeVisible();
        await expect(subject).toContainText('Q4 Planning');
    });

    test('email demo has suggestion', async ({ page }) => {
        await page.goto(PAGE_URL);
        const suggestion = page.locator('.email-suggestion');
        await expect(suggestion).toBeVisible();
    });

    test('email suggestion has label', async ({ page }) => {
        await page.goto(PAGE_URL);
        const label = page.locator('.email-suggestion-label');
        await expect(label).toBeVisible();
        await expect(label).toContainText(/gemini suggestion/i);
    });

    test('email suggestion has text', async ({ page }) => {
        await page.goto(PAGE_URL);
        const text = page.locator('.email-suggestion-text');
        await expect(text).toBeVisible();
        await expect(text).toContainText('Thanks Jane');
    });

    // ====================
    // Calendar Section Tests
    // ====================

    test('calendar section is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const calendar = page.locator('.calendar-section');
        await expect(calendar).toBeVisible();
    });

    test('calendar section has badge', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.calendar-section .section-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toContainText(/smart scheduling/i);
    });

    test('calendar section has heading', async ({ page }) => {
        await page.goto(PAGE_URL);
        const heading = page.locator('.calendar-header h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/calendar.*managed/i);
    });

    test('calendar visual is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const visual = page.locator('.calendar-visual');
        await expect(visual).toBeVisible();
    });

    test('calendar has 7 day headers', async ({ page }) => {
        await page.goto(PAGE_URL);
        const days = page.locator('.calendar-day');
        await expect(days).toHaveCount(7);
    });

    test('calendar has date cells', async ({ page }) => {
        await page.goto(PAGE_URL);
        const dates = page.locator('.calendar-date');
        const count = await dates.count();
        expect(count).toBeGreaterThanOrEqual(28);
    });

    test('calendar has events marked', async ({ page }) => {
        await page.goto(PAGE_URL);
        const events = page.locator('.calendar-date.has-event');
        const count = await events.count();
        expect(count).toBeGreaterThan(0);
    });

    test('calendar events list is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const eventsList = page.locator('.calendar-events');
        await expect(eventsList).toBeVisible();
    });

    test('calendar has 3 event items', async ({ page }) => {
        await page.goto(PAGE_URL);
        const events = page.locator('.calendar-event');
        await expect(events).toHaveCount(3);
    });

    test('team standup event is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const event = page.locator('.calendar-event:has-text("Team Standup")');
        await expect(event).toBeVisible();
        await expect(event).toContainText('10:00 AM');
    });

    test('client presentation event is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const event = page.locator('.calendar-event:has-text("Client Presentation")');
        await expect(event).toBeVisible();
        await expect(event).toContainText('2:00 PM');
    });

    test('1:1 meeting event is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const event = page.locator('.calendar-event:has-text("1:1 with Sarah")');
        await expect(event).toBeVisible();
        await expect(event).toContainText('4:30 PM');
    });

    // ====================
    // Stats Section Tests
    // ====================

    test('stats section is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const stats = page.locator('.stats');
        await expect(stats).toBeVisible();
    });

    test('stats section has 4 stat items', async ({ page }) => {
        await page.goto(PAGE_URL);
        const statItems = page.locator('.stat-item');
        await expect(statItems).toHaveCount(4);
    });

    test('time saved stat is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const stat = page.locator('.stat-item:has-text("Time Saved")');
        await expect(stat).toBeVisible();
        await expect(stat).toContainText('3.5hrs');
    });

    test('task completion stat is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const stat = page.locator('.stat-item:has-text("Task Completion")');
        await expect(stat).toBeVisible();
        await expect(stat).toContainText('95%');
    });

    test('email response stat is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const stat = page.locator('.stat-item:has-text("Email")');
        await expect(stat).toBeVisible();
        await expect(stat).toContainText('40%');
    });

    test('scheduling accuracy stat is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const stat = page.locator('.stat-item:has-text("Scheduling")');
        await expect(stat).toBeVisible();
        await expect(stat).toContainText('99.9%');
    });

    // ====================
    // Testimonials Section Tests
    // ====================

    test('testimonials section is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const testimonials = page.locator('.testimonials');
        await expect(testimonials).toBeVisible();
    });

    test('testimonials has section badge', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.testimonials .section-badge');
        await expect(badge).toBeVisible();
        await expect(badge).toContainText(/user stories/i);
    });

    test('testimonials has heading', async ({ page }) => {
        await page.goto(PAGE_URL);
        const heading = page.locator('.testimonials h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/busy professionals/i);
    });

    test('testimonials section has 3 cards', async ({ page }) => {
        await page.goto(PAGE_URL);
        const cards = page.locator('.testimonial-card');
        await expect(cards).toHaveCount(3);
    });

    test('michael chen testimonial is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const testimonial = page.locator('.testimonial-card:has-text("Michael Chen")');
        await expect(testimonial).toBeVisible();
        await expect(testimonial).toContainText('Salesforce');
    });

    test('sarah rodriguez testimonial is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const testimonial = page.locator('.testimonial-card:has-text("Sarah Rodriguez")');
        await expect(testimonial).toBeVisible();
        await expect(testimonial).toContainText('Netflix');
    });

    test('james wilson testimonial is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const testimonial = page.locator('.testimonial-card:has-text("James Wilson")');
        await expect(testimonial).toBeVisible();
        await expect(testimonial).toContainText('Stanford');
    });

    test('all testimonials have quote marks', async ({ page }) => {
        await page.goto(PAGE_URL);
        const quotes = page.locator('.testimonial-quote');
        await expect(quotes).toHaveCount(3);
    });

    test('all testimonials have avatars', async ({ page }) => {
        await page.goto(PAGE_URL);
        const avatars = page.locator('.testimonial-avatar');
        await expect(avatars).toHaveCount(3);
    });

    test('all testimonials have author info', async ({ page }) => {
        await page.goto(PAGE_URL);
        const authors = page.locator('.testimonial-info');
        await expect(authors).toHaveCount(3);
    });

    // ====================
    // Final CTA Section Tests
    // ====================

    test('final CTA section is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const finalCTA = page.locator('.final-cta');
        await expect(finalCTA).toBeVisible();
    });

    test('final CTA has heading', async ({ page }) => {
        await page.goto(PAGE_URL);
        const heading = page.locator('.final-cta h2');
        await expect(heading).toBeVisible();
        await expect(heading).toContainText(/start organizing/i);
    });

    test('final CTA has description', async ({ page }) => {
        await page.goto(PAGE_URL);
        const description = page.locator('.final-cta p');
        await expect(description).toBeVisible();
        await expect(description).toContainText('millions');
    });

    test('final CTA has button', async ({ page }) => {
        await page.goto(PAGE_URL);
        const button = page.locator('.final-cta-button');
        await expect(button).toBeVisible();
        await expect(button).toContainText(/get started/i);
    });

    test('final CTA button links to Gemini', async ({ page }) => {
        await page.goto(PAGE_URL);
        const button = page.locator('.final-cta-button');
        const href = await button.getAttribute('href');
        expect(href).toContain('gemini.google.com');
    });

    // ====================
    // Footer Tests
    // ====================

    test('footer is visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('footer has logo', async ({ page }) => {
        await page.goto(PAGE_URL);
        const logo = page.locator('.footer-logo');
        await expect(logo).toBeVisible();
        await expect(logo).toContainText('Gemini');
    });

    test('footer has description', async ({ page }) => {
        await page.goto(PAGE_URL);
        const text = page.locator('.footer-text');
        await expect(text).toBeVisible();
        await expect(text).toContainText('AI assistant');
    });

    test('footer has copyright', async ({ page }) => {
        await page.goto(PAGE_URL);
        const copyright = page.locator('.footer-copyright');
        await expect(copyright).toBeVisible();
        await expect(copyright).toContainText('Google LLC');
    });

    // ====================
    // CTA & Links Tests
    // ====================

    test('page has multiple gemini.google.com links', async ({ page }) => {
        await page.goto(PAGE_URL);
        const links = await page.locator('a[href*="gemini.google.com"]').all();
        expect(links.length).toBeGreaterThan(5);
    });

    test('all CTAs are visible and clickable', async ({ page }) => {
        await page.goto(PAGE_URL);
        const ctas = page.locator('.cta-primary, .cta-secondary, .final-cta-button');
        const count = await ctas.count();
        expect(count).toBeGreaterThanOrEqual(3);
        for (let i = 0; i < count; i++) {
            await expect(ctas.nth(i)).toBeVisible();
        }
    });

    // ====================
    // Animation Tests
    // ====================

    test('hero has animated badge', async ({ page }) => {
        await page.goto(PAGE_URL);
        const badge = page.locator('.hero-badge');
        await expect(badge).toBeVisible();
        // Badge should have animation styles
        const animation = await badge.evaluate(el => getComputedStyle(el).animation);
        expect(animation).toBeTruthy();
    });

    test('capability cards have scroll animations', async ({ page }) => {
        await page.goto(PAGE_URL);
        await page.locator('.capabilities').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const card = page.locator('.capability-card').first();
        const opacity = await card.evaluate(el => getComputedStyle(el).opacity);
        expect(parseFloat(opacity)).toBeGreaterThan(0);
    });

    test('task cards have scroll animations', async ({ page }) => {
        await page.goto(PAGE_URL);
        await page.locator('.task-demo').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const card = page.locator('.task-card').first();
        const opacity = await card.evaluate(el => getComputedStyle(el).opacity);
        expect(parseFloat(opacity)).toBeGreaterThan(0);
    });

    test('hero pattern animation is present', async ({ page }) => {
        await page.goto(PAGE_URL);
        const hero = page.locator('.hero');
        const hasPattern = await hero.evaluate(el => {
            const before = window.getComputedStyle(el, ':before');
            return before.animation !== 'none';
        });
        expect(hasPattern).toBeTruthy();
    });

    // ====================
    // Typography Tests
    // ====================

    test('page uses Playfair Display for headings', async ({ page }) => {
        await page.goto(PAGE_URL);
        const h1 = page.locator('h1').first();
        const fontFamily = await h1.evaluate(el => getComputedStyle(el).fontFamily);
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
        expect(h1Count).toBe(1); // Only one h1
        const h2Count = await page.locator('h2').count();
        expect(h2Count).toBeGreaterThan(0);
    });

    // ====================
    // Responsive Design Tests
    // ====================

    test('mobile viewport renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(PAGE_URL);
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();
    });

    test('tablet viewport renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto(PAGE_URL);
        const capabilities = page.locator('.capabilities-grid');
        await expect(capabilities).toBeVisible();
    });

    test('desktop viewport renders correctly', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(PAGE_URL);
        const emailContainer = page.locator('.email-container');
        await expect(emailContainer).toBeVisible();
    });

    test('hero CTAs stack on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(PAGE_URL);
        const ctas = page.locator('.hero-ctas');
        const flexDirection = await ctas.evaluate(el => getComputedStyle(el).flexDirection);
        expect(flexDirection).toBe('column');
    });

    // ====================
    // Accessibility Tests
    // ====================

    test('page has semantic HTML structure', async ({ page }) => {
        await page.goto(PAGE_URL);
        const sections = await page.locator('section').count();
        expect(sections).toBeGreaterThan(5);
    });

    test('all images have alt text or are decorative', async ({ page }) => {
        await page.goto(PAGE_URL);
        const images = await page.locator('img').all();
        // This page uses emoji for decorative elements, no actual images
        expect(images.length).toBe(0);
    });

    test('links have descriptive text', async ({ page }) => {
        await page.goto(PAGE_URL);
        const links = await page.locator('a').all();
        for (const link of links) {
            const text = await link.textContent();
            expect(text?.trim().length).toBeGreaterThan(0);
        }
    });

    test('focus states are visible', async ({ page }) => {
        await page.goto(PAGE_URL);
        const primaryCTA = page.locator('.cta-primary');
        await primaryCTA.focus();
        const outline = await primaryCTA.evaluate(el => getComputedStyle(el).outline);
        expect(outline).toBeTruthy();
    });

    // ====================
    // Design Quality Tests
    // ====================

    test('hero has gradient background', async ({ page }) => {
        await page.goto(PAGE_URL);
        const hero = page.locator('.hero');
        const background = await hero.evaluate(el => getComputedStyle(el).background);
        expect(background).toContain('gradient');
    });

    test('capability cards have hover effects', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.capability-card').first();
        await card.hover();
        await page.waitForTimeout(100);
        const transform = await card.evaluate(el => getComputedStyle(el).transform);
        expect(transform).not.toBe('none');
    });

    test('task cards have colored borders', async ({ page }) => {
        await page.goto(PAGE_URL);
        const card = page.locator('.task-card').first();
        const borderLeft = await card.evaluate(el => getComputedStyle(el).borderLeftWidth);
        expect(borderLeft).toBe('4px');
    });

    test('email demo has white background', async ({ page }) => {
        await page.goto(PAGE_URL);
        const demo = page.locator('.email-demo');
        const bg = await demo.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(bg).toContain('255, 255, 255');
    });

    test('calendar visual has rounded corners', async ({ page }) => {
        await page.goto(PAGE_URL);
        const visual = page.locator('.calendar-visual');
        const borderRadius = await visual.evaluate(el => getComputedStyle(el).borderRadius);
        expect(borderRadius).toBe('24px');
    });

    test('testimonials have quote marks', async ({ page }) => {
        await page.goto(PAGE_URL);
        const quote = page.locator('.testimonial-quote').first();
        await expect(quote).toBeVisible();
        await expect(quote).toContainText('"');
    });

    // ====================
    // Performance Tests
    // ====================

    test('page loads within reasonable time', async ({ page }) => {
        const startTime = Date.now();
        await page.goto(PAGE_URL);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(5000); // Less than 5 seconds
    });

    test('no JavaScript errors on page load', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        await page.goto(PAGE_URL);
        await page.waitForTimeout(2000);
        expect(errors.length).toBe(0);
    });

    // ====================
    // Personal Assistant Specific Tests
    // ====================

    test('page mentions task management', async ({ page }) => {
        await page.goto(PAGE_URL);
        const content = await page.textContent('body');
        expect(content).toContain('task');
    });

    test('page mentions email management', async ({ page }) => {
        await page.goto(PAGE_URL);
        const content = await page.textContent('body');
        expect(content).toContain('email');
    });

    test('page mentions calendar/scheduling', async ({ page }) => {
        await page.goto(PAGE_URL);
        const content = await page.textContent('body');
        expect(content).toContain('calendar');
    });

    test('page mentions daily briefings', async ({ page }) => {
        await page.goto(PAGE_URL);
        const content = await page.textContent('body');
        expect(content).toContain('briefing');
    });

    test('page mentions workspace integration', async ({ page }) => {
        await page.goto(PAGE_URL);
        const content = await page.textContent('body');
        expect(content).toContain('workspace');
    });

    test('email demo shows realistic scenario', async ({ page }) => {
        await page.goto(PAGE_URL);
        const demoBody = page.locator('.email-demo-body');
        await expect(demoBody).toBeVisible();
        const content = await demoBody.textContent();
        expect(content).toContain('Q4');
    });

    test('calendar shows current month structure', async ({ page }) => {
        await page.goto(PAGE_URL);
        const dates = page.locator('.calendar-date');
        const count = await dates.count();
        expect(count).toBeGreaterThanOrEqual(28);
        expect(count).toBeLessThanOrEqual(42);
    });

    test('stats show productivity metrics', async ({ page }) => {
        await page.goto(PAGE_URL);
        const stats = await page.locator('.stat-item h3').allTextContents();
        const hasMetrics = stats.some(stat =>
            stat.includes('hrs') || stat.includes('%')
        );
        expect(hasMetrics).toBeTruthy();
    });

    // ====================
    // Screenshot Tests
    // ====================

    test('capture hero section screenshot', async ({ page }) => {
        await page.goto(PAGE_URL);
        const hero = page.locator('.hero');
        await hero.screenshot({ path: 'screenshots/personal-assistant-hero.png' });
    });

    test('capture capabilities grid screenshot', async ({ page }) => {
        await page.goto(PAGE_URL);
        await page.locator('.capabilities').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const capabilities = page.locator('.capabilities');
        await capabilities.screenshot({ path: 'screenshots/personal-assistant-capabilities.png' });
    });

    test('capture email demo screenshot', async ({ page }) => {
        await page.goto(PAGE_URL);
        await page.locator('.email-assistant').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const emailSection = page.locator('.email-assistant');
        await emailSection.screenshot({ path: 'screenshots/personal-assistant-email.png' });
    });

    test('capture calendar screenshot', async ({ page }) => {
        await page.goto(PAGE_URL);
        await page.locator('.calendar-section').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        const calendar = page.locator('.calendar-section');
        await calendar.screenshot({ path: 'screenshots/personal-assistant-calendar.png' });
    });

    test('capture full page screenshot', async ({ page }) => {
        await page.goto(PAGE_URL);
        await page.screenshot({
            path: 'screenshots/personal-assistant-full.png',
            fullPage: true
        });
    });

    test('capture mobile screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(PAGE_URL);
        await page.screenshot({
            path: 'screenshots/personal-assistant-mobile.png',
            fullPage: true
        });
    });

    // ====================
    // Integration Tests
    // ====================

    test('shared CSS files load correctly', async ({ page }) => {
        await page.goto(PAGE_URL);
        const designSystemLink = page.locator('link[href*="design-system.css"]');
        await expect(designSystemLink).toHaveCount(1);
        const componentsLink = page.locator('link[href*="components.css"]');
        await expect(componentsLink).toHaveCount(1);
    });

    test('shared JavaScript loads correctly', async ({ page }) => {
        await page.goto(PAGE_URL);
        const animationsScript = page.locator('script[src*="animations.js"]');
        await expect(animationsScript).toHaveCount(1);
    });

    test('Google Fonts load correctly', async ({ page }) => {
        await page.goto(PAGE_URL);
        const fontLinks = page.locator('link[href*="fonts.googleapis.com"]');
        const count = await fontLinks.count();
        expect(count).toBeGreaterThan(0);
    });

    // ====================
    // Content Quality Tests
    // ====================

    test('value propositions are clear', async ({ page }) => {
        await page.goto(PAGE_URL);
        const subtitle = await page.locator('.hero-subtitle').textContent();
        expect(subtitle).toContain('task');
        expect(subtitle).toContain('email');
    });

    test('testimonials include company names', async ({ page }) => {
        await page.goto(PAGE_URL);
        const testimonials = await page.locator('.testimonial-info p').allTextContents();
        const hasCompanies = testimonials.some(t =>
            t.includes('Salesforce') || t.includes('Netflix') || t.includes('Stanford')
        );
        expect(hasCompanies).toBeTruthy();
    });

    test('CTAs have action-oriented text', async ({ page }) => {
        await page.goto(PAGE_URL);
        const ctaText = await page.locator('.cta-primary').first().textContent();
        expect(ctaText).toMatch(/get|start|try|begin/i);
    });

    test('feature descriptions are specific', async ({ page }) => {
        await page.goto(PAGE_URL);
        const descriptions = await page.locator('.capability-card p').allTextContents();
        const hasSpecifics = descriptions.some(d => d.length > 50);
        expect(hasSpecifics).toBeTruthy();
    });

});
