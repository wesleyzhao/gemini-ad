/**
 * Playwright Screenshot Tests
 * Captures screenshots of all landing pages across multiple devices
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// List of all landing pages to test
const pages = [
    { name: 'Valentine\'s Day', path: 'pages/valentine.html' },
    { name: 'Writers', path: 'pages/writers.html' },
    { name: 'Creators', path: 'pages/creators.html' },
    { name: 'Operators', path: 'pages/operators.html' },
    { name: 'Automators', path: 'pages/automators.html' },
    { name: 'Apple Style', path: 'pages/apple-style.html' },
    { name: 'Trust & Citations', path: 'pages/trust.html' },
    { name: 'Research', path: 'pages/research.html' },
    { name: 'Productivity', path: 'pages/productivity.html' },
    { name: 'Workspace', path: 'pages/workspace.html' },
    { name: 'Comparison', path: 'pages/comparison.html' },
    { name: 'Future', path: 'pages/future.html' },
    { name: 'Gallery Index', path: 'pages/index.html' }
];

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Test each page on desktop
test.describe('Desktop Screenshots', () => {
    pages.forEach(page => {
        test(`${page.name} - Desktop`, async ({ page: browserPage }) => {
            // Set viewport to desktop size
            await browserPage.setViewportSize({ width: 1440, height: 900 });

            // Navigate to the page
            await browserPage.goto(`http://localhost:8080/${page.path}`);

            // Wait for page to be fully loaded
            await browserPage.waitForLoadState('networkidle');

            // Wait a bit for animations to settle
            await browserPage.waitForTimeout(1000);

            // Capture full page screenshot
            const fileName = `${page.path.replace('pages/', '').replace('.html', '')}-desktop.png`;
            await browserPage.screenshot({
                path: path.join(screenshotsDir, fileName),
                fullPage: true
            });

            // Basic accessibility check - page should have a title
            const title = await browserPage.title();
            expect(title.length).toBeGreaterThan(0);
        });
    });
});

// Test each page on tablet
test.describe('Tablet Screenshots', () => {
    pages.forEach(page => {
        test(`${page.name} - Tablet`, async ({ page: browserPage }) => {
            // Set viewport to tablet size (iPad)
            await browserPage.setViewportSize({ width: 768, height: 1024 });

            // Navigate to the page
            await browserPage.goto(`http://localhost:8080/${page.path}`);

            // Wait for page to be fully loaded
            await browserPage.waitForLoadState('networkidle');

            // Wait for animations
            await browserPage.waitForTimeout(1000);

            // Capture screenshot
            const fileName = `${page.path.replace('pages/', '').replace('.html', '')}-tablet.png`;
            await browserPage.screenshot({
                path: path.join(screenshotsDir, fileName),
                fullPage: true
            });
        });
    });
});

// Test each page on mobile
test.describe('Mobile Screenshots', () => {
    pages.forEach(page => {
        test(`${page.name} - Mobile`, async ({ page: browserPage }) => {
            // Set viewport to mobile size (iPhone)
            await browserPage.setViewportSize({ width: 375, height: 812 });

            // Navigate to the page
            await browserPage.goto(`http://localhost:8080/${page.path}`);

            // Wait for page to be fully loaded
            await browserPage.waitForLoadState('networkidle');

            // Wait for animations
            await browserPage.waitForTimeout(1000);

            // Capture screenshot
            const fileName = `${page.path.replace('pages/', '').replace('.html', '')}-mobile.png`;
            await browserPage.screenshot({
                path: path.join(screenshotsDir, fileName),
                fullPage: true
            });
        });
    });
});

// Visual regression test - hero sections
test.describe('Hero Section Quality Check', () => {
    pages.forEach(page => {
        test(`${page.name} - Hero Section`, async ({ page: browserPage }) => {
            await browserPage.setViewportSize({ width: 1440, height: 900 });
            await browserPage.goto(`http://localhost:8080/${page.path}`);
            await browserPage.waitForLoadState('networkidle');
            await browserPage.waitForTimeout(1000);

            // Find hero section
            const hero = await browserPage.locator('.hero, .hero-section, section:first-of-type').first();

            if (await hero.count() > 0) {
                const fileName = `${page.path.replace('pages/', '').replace('.html', '')}-hero.png`;
                await hero.screenshot({
                    path: path.join(screenshotsDir, fileName)
                });
            }
        });
    });
});

// Performance check
test.describe('Performance Checks', () => {
    pages.forEach(page => {
        test(`${page.name} - Load Performance`, async ({ page: browserPage }) => {
            const startTime = Date.now();

            await browserPage.goto(`http://localhost:8080/${page.path}`);
            await browserPage.waitForLoadState('networkidle');

            const loadTime = Date.now() - startTime;

            // Page should load in under 3 seconds
            expect(loadTime).toBeLessThan(3000);

            console.log(`${page.name} loaded in ${loadTime}ms`);
        });
    });
});

// CTA Button Check
test.describe('CTA Presence Check', () => {
    pages.forEach(page => {
        test(`${page.name} - Has CTA Buttons`, async ({ page: browserPage }) => {
            await browserPage.goto(`http://localhost:8080/${page.path}`);
            await browserPage.waitForLoadState('networkidle');

            // Check for common CTA button selectors
            const ctaButtons = await browserPage.locator('.btn-primary, .cta-button, button, a.btn').count();

            // Page should have at least one CTA button
            expect(ctaButtons).toBeGreaterThan(0);
        });
    });
});

// Mobile Responsiveness Check
test.describe('Mobile Responsiveness', () => {
    pages.forEach(page => {
        test(`${page.name} - No Horizontal Scroll`, async ({ page: browserPage }) => {
            await browserPage.setViewportSize({ width: 375, height: 812 });
            await browserPage.goto(`http://localhost:8080/${page.path}`);
            await browserPage.waitForLoadState('networkidle');

            // Check that page width doesn't exceed viewport
            const bodyWidth = await browserPage.evaluate(() => document.body.scrollWidth);
            const viewportWidth = 375;

            // Allow 1px tolerance for rounding
            expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
        });
    });
});

// Generate screenshot gallery HTML
test.afterAll(async () => {
    const galleryPath = path.join(screenshotsDir, 'gallery.html');

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gemini Ad Screenshots Gallery</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        h1 {
            font-size: 48px;
            margin-bottom: 40px;
            text-align: center;
        }
        .page-section {
            background: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .page-section h2 {
            font-size: 32px;
            margin-bottom: 20px;
            color: #1a73e8;
        }
        .screenshots {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .screenshot {
            text-align: center;
        }
        .screenshot img {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .screenshot p {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Gemini Ad Campaign Screenshots</h1>
`;

    pages.forEach(page => {
        const baseName = page.path.replace('pages/', '').replace('.html', '');
        html += `
        <div class="page-section">
            <h2>${page.name}</h2>
            <div class="screenshots">
                <div class="screenshot">
                    <img src="${baseName}-desktop.png" alt="${page.name} Desktop">
                    <p>Desktop (1440x900)</p>
                </div>
                <div class="screenshot">
                    <img src="${baseName}-tablet.png" alt="${page.name} Tablet">
                    <p>Tablet (768x1024)</p>
                </div>
                <div class="screenshot">
                    <img src="${baseName}-mobile.png" alt="${page.name} Mobile">
                    <p>Mobile (375x812)</p>
                </div>
            </div>
        </div>
`;
    });

    html += `
    </div>
</body>
</html>
`;

    fs.writeFileSync(galleryPath, html);
    console.log(`\n✅ Screenshot gallery created at: ${galleryPath}`);
});
