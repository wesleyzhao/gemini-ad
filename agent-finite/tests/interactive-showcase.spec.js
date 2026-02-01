const { test, expect } = require('@playwright/test');

const PAGE_URL = 'http://localhost:8080/pages/interactive-showcase.html';

test.describe('Interactive Showcase Page - Panel Switching System', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(PAGE_URL);
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
    });

    // ===========================
    // Page Load Tests
    // ===========================

    test('page loads successfully with correct title', async ({ page }) => {
        await expect(page).toHaveTitle(/See Gemini in Action/);
        const response = await page.goto(PAGE_URL);
        expect(response.status()).toBe(200);
    });

    test('all required assets load correctly', async ({ page }) => {
        // Check for design system CSS
        const designSystemLink = page.locator('link[href*="design-system.css"]');
        await expect(designSystemLink).toHaveCount(1);

        // Check for components CSS
        const componentsLink = page.locator('link[href*="components.css"]');
        await expect(componentsLink).toHaveCount(1);

        // Check for animations CSS
        const animationsLink = page.locator('link[href*="animations.css"]');
        await expect(animationsLink).toHaveCount(1);

        // Check for animations JS
        const animationsScript = page.locator('script[src*="animations.js"]');
        await expect(animationsScript).toHaveCount(1);
    });

    test('Google Fonts load correctly', async ({ page }) => {
        const fontLink = page.locator('link[href*="fonts.googleapis.com"]');
        await expect(fontLink).toHaveCount(2); // preconnect links
    });

    // ===========================
    // Content Verification Tests
    // ===========================

    test('hero section displays correct content', async ({ page }) => {
        const hero = page.locator('.hero');
        await expect(hero).toBeVisible();

        const h1 = hero.locator('h1');
        await expect(h1).toContainText('See Gemini in Action');

        const description = hero.locator('p');
        await expect(description).toContainText('Explore real-world use cases');

        // Check CTA buttons
        const ctaButtons = hero.locator('.hero-cta a');
        await expect(ctaButtons).toHaveCount(2);
        await expect(ctaButtons.first()).toContainText('Try Gemini Free');
        await expect(ctaButtons.nth(1)).toContainText('Explore Demos');
    });

    test('showcase title section displays correctly', async ({ page }) => {
        const showcaseTitle = page.locator('.showcase-title');
        await expect(showcaseTitle).toBeVisible();

        const h2 = showcaseTitle.locator('h2');
        await expect(h2).toContainText('Choose Your Use Case');

        const description = showcaseTitle.locator('p');
        await expect(description).toContainText('See how Gemini adapts');
    });

    test('all 5 panel tabs are present', async ({ page }) => {
        const tabs = page.locator('.panel-tab');
        await expect(tabs).toHaveCount(5);

        // Verify tab labels
        await expect(tabs.nth(0)).toContainText('Content Writing');
        await expect(tabs.nth(1)).toContainText('Research');
        await expect(tabs.nth(2)).toContainText('Code Assistant');
        await expect(tabs.nth(3)).toContainText('Workspace');
        await expect(tabs.nth(4)).toContainText('Creative Studio');
    });

    test('all panel tabs have icons and sublabels', async ({ page }) => {
        const tabs = page.locator('.panel-tab');

        for (let i = 0; i < 5; i++) {
            const tab = tabs.nth(i);
            const icon = tab.locator('.tab-icon');
            const label = tab.locator('.tab-label');
            const sublabel = tab.locator('.tab-sublabel');

            await expect(icon).toBeVisible();
            await expect(label).toBeVisible();
            await expect(sublabel).toBeVisible();
        }
    });

    test('all 5 panel content sections exist', async ({ page }) => {
        const panels = page.locator('.panel-content');
        await expect(panels).toHaveCount(5);

        // Verify each panel has the correct data-panel attribute
        await expect(panels.nth(0)).toHaveAttribute('data-panel', 'writing');
        await expect(panels.nth(1)).toHaveAttribute('data-panel', 'research');
        await expect(panels.nth(2)).toHaveAttribute('data-panel', 'coding');
        await expect(panels.nth(3)).toHaveAttribute('data-panel', 'workspace');
        await expect(panels.nth(4)).toHaveAttribute('data-panel', 'creative');
    });

    // ===========================
    // Panel Switching Functionality
    // ===========================

    test('writing panel is active by default', async ({ page }) => {
        const writingTab = page.locator('.panel-tab[data-panel="writing"]');
        await expect(writingTab).toHaveClass(/active/);

        const writingPanel = page.locator('.panel-content[data-panel="writing"]');
        await expect(writingPanel).toHaveClass(/active/);
    });

    test('clicking research tab switches to research panel', async ({ page }) => {
        const researchTab = page.locator('.panel-tab[data-panel="research"]');
        await researchTab.click();

        // Wait for animation
        await page.waitForTimeout(300);

        // Research tab should be active
        await expect(researchTab).toHaveClass(/active/);

        // Research panel should be active
        const researchPanel = page.locator('.panel-content[data-panel="research"]');
        await expect(researchPanel).toHaveClass(/active/);

        // Writing tab should not be active
        const writingTab = page.locator('.panel-tab[data-panel="writing"]');
        await expect(writingTab).not.toHaveClass(/active/);
    });

    test('clicking coding tab switches to coding panel', async ({ page }) => {
        const codingTab = page.locator('.panel-tab[data-panel="coding"]');
        await codingTab.click();
        await page.waitForTimeout(300);

        await expect(codingTab).toHaveClass(/active/);
        const codingPanel = page.locator('.panel-content[data-panel="coding"]');
        await expect(codingPanel).toHaveClass(/active/);
    });

    test('clicking workspace tab switches to workspace panel', async ({ page }) => {
        const workspaceTab = page.locator('.panel-tab[data-panel="workspace"]');
        await workspaceTab.click();
        await page.waitForTimeout(300);

        await expect(workspaceTab).toHaveClass(/active/);
        const workspacePanel = page.locator('.panel-content[data-panel="workspace"]');
        await expect(workspacePanel).toHaveClass(/active/);
    });

    test('clicking creative tab switches to creative panel', async ({ page }) => {
        const creativeTab = page.locator('.panel-tab[data-panel="creative"]');
        await creativeTab.click();
        await page.waitForTimeout(300);

        await expect(creativeTab).toHaveClass(/active/);
        const creativePanel = page.locator('.panel-content[data-panel="creative"]');
        await expect(creativePanel).toHaveClass(/active/);
    });

    test('switching panels deactivates previous panel', async ({ page }) => {
        // Start at writing (default)
        const writingPanel = page.locator('.panel-content[data-panel="writing"]');
        await expect(writingPanel).toHaveClass(/active/);

        // Switch to research
        const researchTab = page.locator('.panel-tab[data-panel="research"]');
        await researchTab.click();
        await page.waitForTimeout(300);

        // Writing panel should no longer be active
        await expect(writingPanel).not.toHaveClass(/active/);

        // Research panel should be active
        const researchPanel = page.locator('.panel-content[data-panel="research"]');
        await expect(researchPanel).toHaveClass(/active/);
    });

    test('can cycle through all panels', async ({ page }) => {
        const panels = ['writing', 'research', 'coding', 'workspace', 'creative'];

        for (const panelId of panels) {
            const tab = page.locator(`.panel-tab[data-panel="${panelId}"]`);
            await tab.click();
            await page.waitForTimeout(200);

            await expect(tab).toHaveClass(/active/);
            const panel = page.locator(`.panel-content[data-panel="${panelId}"]`);
            await expect(panel).toHaveClass(/active/);
        }
    });

    // ===========================
    // Panel Content Verification
    // ===========================

    test('writing panel contains correct content', async ({ page }) => {
        const writingPanel = page.locator('.panel-content[data-panel="writing"]');

        // Check demo visual
        const demoTitle = writingPanel.locator('.demo-title');
        await expect(demoTitle).toContainText('Blog Writer');

        // Check demo content
        await expect(writingPanel).toContainText('sustainable living');
        await expect(writingPanel).toContainText('Concrete Jungles');

        // Check features
        await expect(writingPanel).toContainText('Tone Control');
        await expect(writingPanel).toContainText('SEO Optimization');
        await expect(writingPanel).toContainText('Multiple Drafts');

        // Check stats
        await expect(writingPanel).toContainText('3x');
        await expect(writingPanel).toContainText('Faster Writing');
    });

    test('research panel contains citations and sources', async ({ page }) => {
        const researchTab = page.locator('.panel-tab[data-panel="research"]');
        await researchTab.click();
        await page.waitForTimeout(300);

        const researchPanel = page.locator('.panel-content[data-panel="research"]');

        // Check for research-specific content
        await expect(researchPanel).toContainText('Research Assistant');
        await expect(researchPanel).toContainText('renewable energy');
        await expect(researchPanel).toContainText('Source Citations');
        await expect(researchPanel).toContainText('Fact Verification');

        // Check for citation markers
        await expect(researchPanel).toContainText('[1]');
        await expect(researchPanel).toContainText('[2]');
        await expect(researchPanel).toContainText('[3]');

        // Check stats
        await expect(researchPanel).toContainText('95%');
        await expect(researchPanel).toContainText('Accuracy Rate');
    });

    test('coding panel contains code example', async ({ page }) => {
        const codingTab = page.locator('.panel-tab[data-panel="coding"]');
        await codingTab.click();
        await page.waitForTimeout(300);

        const codingPanel = page.locator('.panel-content[data-panel="coding"]');

        // Check for code content
        await expect(codingPanel).toContainText('Code Generator');
        await expect(codingPanel).toContainText('validate_email');
        await expect(codingPanel).toContainText('import re');

        // Check features
        await expect(codingPanel).toContainText('Code Generation');
        await expect(codingPanel).toContainText('Debug Assistant');

        // Check code block exists
        const codeBlock = codingPanel.locator('.code-block');
        await expect(codeBlock).toBeVisible();
    });

    test('workspace panel contains Google integration info', async ({ page }) => {
        const workspaceTab = page.locator('.panel-tab[data-panel="workspace"]');
        await workspaceTab.click();
        await page.waitForTimeout(300);

        const workspacePanel = page.locator('.panel-content[data-panel="workspace"]');

        // Check for workspace content
        await expect(workspacePanel).toContainText('Workspace Integration');
        await expect(workspacePanel).toContainText('Gmail');
        await expect(workspacePanel).toContainText('Google Docs');
        await expect(workspacePanel).toContainText('Calendar');
        await expect(workspacePanel).toContainText('Drive');

        // Check example interaction
        await expect(workspacePanel).toContainText('unread emails');
    });

    test('creative panel mentions VO3 and Nano Banana', async ({ page }) => {
        const creativeTab = page.locator('.panel-tab[data-panel="creative"]');
        await creativeTab.click();
        await page.waitForTimeout(300);

        const creativePanel = page.locator('.panel-content[data-panel="creative"]');

        // Check for creative content
        await expect(creativePanel).toContainText('Creative Studio');
        await expect(creativePanel).toContainText('Nano Banana');
        await expect(creativePanel).toContainText('Voice Output 3');

        // Check features
        await expect(creativePanel).toContainText('Rapid Ideation');
        await expect(creativePanel).toContainText('Script Writing');

        // Check stats
        await expect(creativePanel).toContainText('10x');
        await expect(creativePanel).toContainText('2.5s');
    });

    // ===========================
    // Feature List Verification
    // ===========================

    test('each panel has feature list with icons', async ({ page }) => {
        const panels = ['writing', 'research', 'coding', 'workspace', 'creative'];

        for (const panelId of panels) {
            const tab = page.locator(`.panel-tab[data-panel="${panelId}"]`);
            await tab.click();
            await page.waitForTimeout(200);

            const panel = page.locator(`.panel-content[data-panel="${panelId}"]`);
            const featureList = panel.locator('.feature-list');
            await expect(featureList).toBeVisible();

            const features = featureList.locator('li');
            const count = await features.count();
            expect(count).toBeGreaterThanOrEqual(4);

            // Each feature should have an icon
            const firstFeature = features.first();
            const icon = firstFeature.locator('.feature-icon');
            await expect(icon).toBeVisible();
        }
    });

    test('each panel has stats grid with 2 stat cards', async ({ page }) => {
        const panels = ['writing', 'research', 'coding', 'workspace', 'creative'];

        for (const panelId of panels) {
            const tab = page.locator(`.panel-tab[data-panel="${panelId}"]`);
            await tab.click();
            await page.waitForTimeout(200);

            const panel = page.locator(`.panel-content[data-panel="${panelId}"]`);
            const statsGrid = panel.locator('.stats-grid');
            await expect(statsGrid).toBeVisible();

            const statCards = statsGrid.locator('.stat-card');
            await expect(statCards).toHaveCount(2);

            // Each stat card should have number and label
            const firstCard = statCards.first();
            const statNumber = firstCard.locator('.stat-number');
            const statLabel = firstCard.locator('.stat-label');
            await expect(statNumber).toBeVisible();
            await expect(statLabel).toBeVisible();
        }
    });

    // ===========================
    // Demo Visual Verification
    // ===========================

    test('each panel has demo visual with header', async ({ page }) => {
        const panels = ['writing', 'research', 'coding', 'workspace', 'creative'];

        for (const panelId of panels) {
            const tab = page.locator(`.panel-tab[data-panel="${panelId}"]`);
            await tab.click();
            await page.waitForTimeout(200);

            const panel = page.locator(`.panel-content[data-panel="${panelId}"]`);
            const demoVisual = panel.locator('.demo-visual');
            await expect(demoVisual).toBeVisible();

            const demoHeader = demoVisual.locator('.demo-header');
            await expect(demoHeader).toBeVisible();

            const demoIcon = demoHeader.locator('.demo-icon');
            const demoTitle = demoHeader.locator('.demo-title');
            await expect(demoIcon).toBeVisible();
            await expect(demoTitle).toBeVisible();
        }
    });

    test('chat messages display correctly in demo interface', async ({ page }) => {
        const writingPanel = page.locator('.panel-content[data-panel="writing"]');
        const chatMessages = writingPanel.locator('.chat-message');

        const count = await chatMessages.count();
        expect(count).toBeGreaterThanOrEqual(2);

        // Check message structure
        const firstMessage = chatMessages.first();
        const messageLabel = firstMessage.locator('.message-label');
        const messageText = firstMessage.locator('.message-text');

        await expect(messageLabel).toBeVisible();
        await expect(messageText).toBeVisible();
    });

    test('typing indicator animation is present', async ({ page }) => {
        const writingPanel = page.locator('.panel-content[data-panel="writing"]');
        const typingIndicator = writingPanel.locator('.typing-indicator');
        await expect(typingIndicator).toBeVisible();

        const typingDots = typingIndicator.locator('.typing-dot');
        await expect(typingDots).toHaveCount(3);
    });

    // ===========================
    // Keyboard Navigation Tests
    // ===========================

    test('tabs have proper ARIA roles and keyboard support', async ({ page }) => {
        const firstTab = page.locator('.panel-tab').first();

        // Check role attribute
        await expect(firstTab).toHaveAttribute('role', 'tab');

        // Check tabindex
        const tabindex = await firstTab.getAttribute('tabindex');
        expect(tabindex).toBe('0');
    });

    test('arrow keys navigate between tabs', async ({ page }) => {
        const firstTab = page.locator('.panel-tab').first();
        await firstTab.focus();

        // Press ArrowRight to go to next tab
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(200);

        const secondTab = page.locator('.panel-tab').nth(1);
        await expect(secondTab).toHaveClass(/active/);
    });

    test('Enter key activates focused tab', async ({ page }) => {
        const secondTab = page.locator('.panel-tab').nth(1);
        await secondTab.focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(200);

        await expect(secondTab).toHaveClass(/active/);
    });

    // ===========================
    // CTA and Links Tests
    // ===========================

    test('final CTA button is visible and links to Gemini', async ({ page }) => {
        const ctaButton = page.locator('.panel-cta .cta-button');
        await expect(ctaButton).toBeVisible();
        await expect(ctaButton).toContainText('Start Using Gemini');
        await expect(ctaButton).toHaveAttribute('href', 'https://gemini.google.com');
        await expect(ctaButton).toHaveAttribute('target', '_blank');
    });

    test('hero CTA buttons link correctly', async ({ page }) => {
        const primaryCTA = page.locator('.hero-cta .btn-primary');
        await expect(primaryCTA).toHaveAttribute('href', 'https://gemini.google.com');
        await expect(primaryCTA).toHaveAttribute('target', '_blank');

        const secondaryCTA = page.locator('.hero-cta .btn-secondary');
        await expect(secondaryCTA).toHaveAttribute('href', '#showcase');
    });

    // ===========================
    // Responsive Design Tests
    // ===========================

    test('mobile viewport - panel tabs scroll horizontally', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(300);

        const panelTabs = page.locator('.panel-tabs');
        await expect(panelTabs).toBeVisible();

        // Check if tabs container allows horizontal scrolling
        const overflowX = await panelTabs.evaluate(el =>
            window.getComputedStyle(el).overflowX
        );
        expect(overflowX).toBe('auto');
    });

    test('mobile viewport - panel grid becomes single column', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(300);

        const panelGrid = page.locator('.panel-grid').first();
        const gridTemplateColumns = await panelGrid.evaluate(el =>
            window.getComputedStyle(el).gridTemplateColumns
        );

        // Should be single column on mobile
        expect(gridTemplateColumns).toContain('1fr');
    });

    test('tablet viewport - maintains grid layout', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(300);

        const panelGrid = page.locator('.panel-grid').first();
        await expect(panelGrid).toBeVisible();
    });

    test('desktop viewport - full grid layout', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(300);

        const panelGrid = page.locator('.panel-grid').first();
        const gridTemplateColumns = await panelGrid.evaluate(el =>
            window.getComputedStyle(el).gridTemplateColumns
        );

        // Should be two columns on desktop
        expect(gridTemplateColumns).toContain('1fr 1fr');
    });

    // ===========================
    // Animation Tests
    // ===========================

    test('panels have slide-in animation when activated', async ({ page }) => {
        const researchTab = page.locator('.panel-tab[data-panel="research"]');
        await researchTab.click();

        const researchPanel = page.locator('.panel-content[data-panel="research"]');

        // Check for animation class
        await expect(researchPanel).toHaveClass(/active/);

        // Wait for animation to complete
        await page.waitForTimeout(600);

        // Panel should be visible
        await expect(researchPanel).toBeVisible();
    });

    test('chat messages have staggered fade-in animation', async ({ page }) => {
        const chatMessages = page.locator('.chat-message');
        const firstMessage = chatMessages.first();

        // Check for animation style
        const animationName = await firstMessage.evaluate(el =>
            window.getComputedStyle(el).animationName
        );
        expect(animationName).toBe('fadeSlideUp');
    });

    test('hover effects work on panel tabs', async ({ page }) => {
        const secondTab = page.locator('.panel-tab').nth(1);

        // Hover over tab
        await secondTab.hover();
        await page.waitForTimeout(200);

        // Tab should be visible and interactive
        await expect(secondTab).toBeVisible();
    });

    // ===========================
    // Screenshot Tests
    // ===========================

    test('capture desktop screenshots of all panels', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        const panels = ['writing', 'research', 'coding', 'workspace', 'creative'];

        for (const panelId of panels) {
            const tab = page.locator(`.panel-tab[data-panel="${panelId}"]`);
            await tab.click();
            await page.waitForTimeout(600);

            await page.screenshot({
                path: `screenshots/interactive-showcase-${panelId}-desktop.png`,
                fullPage: false
            });
        }
    });

    test('capture mobile screenshots', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(300);

        await page.screenshot({
            path: 'screenshots/interactive-showcase-mobile.png',
            fullPage: true
        });
    });

    test('capture tablet screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.waitForTimeout(300);

        await page.screenshot({
            path: 'screenshots/interactive-showcase-tablet.png',
            fullPage: true
        });
    });

    test('capture hero section screenshot', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });

        const hero = page.locator('.hero');
        await hero.screenshot({
            path: 'screenshots/interactive-showcase-hero.png'
        });
    });

    // ===========================
    // Accessibility Tests
    // ===========================

    test('page has proper heading hierarchy', async ({ page }) => {
        const h1 = page.locator('h1');
        await expect(h1).toHaveCount(1);
        await expect(h1).toContainText('See Gemini in Action');

        const h2 = page.locator('h2');
        const h2Count = await h2.count();
        expect(h2Count).toBeGreaterThanOrEqual(1);

        const h3 = page.locator('h3');
        const h3Count = await h3.count();
        expect(h3Count).toBeGreaterThanOrEqual(5); // One for each panel
    });

    test('all interactive elements are keyboard accessible', async ({ page }) => {
        const tabs = page.locator('.panel-tab');

        for (let i = 0; i < 5; i++) {
            const tab = tabs.nth(i);
            await tab.focus();

            const isFocused = await tab.evaluate(el => el === document.activeElement);
            expect(isFocused).toBe(true);
        }
    });

    test('links open in new tabs with proper attributes', async ({ page }) => {
        const externalLinks = page.locator('a[target="_blank"]');
        const count = await externalLinks.count();

        expect(count).toBeGreaterThanOrEqual(3); // Hero CTA + Final CTA

        // Check for rel="noopener"
        const firstLink = externalLinks.first();
        await expect(firstLink).toHaveAttribute('rel', /noopener/);
    });

    // ===========================
    // Performance Tests
    // ===========================

    test('page loads within performance budget', async ({ page }) => {
        const startTime = Date.now();
        await page.goto(PAGE_URL);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        expect(loadTime).toBeLessThan(3000); // Less than 3 seconds
    });

    test('panel switching is smooth and responsive', async ({ page }) => {
        const tabs = page.locator('.panel-tab');

        for (let i = 0; i < 5; i++) {
            const startTime = Date.now();
            await tabs.nth(i).click();
            await page.waitForTimeout(100);
            const switchTime = Date.now() - startTime;

            expect(switchTime).toBeLessThan(500); // Switch should be fast
        }
    });
});
