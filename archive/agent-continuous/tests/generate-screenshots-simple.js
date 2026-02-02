#!/usr/bin/env node

/**
 * Simple Screenshot Generator
 * Creates screenshots of all landing pages using puppeteer-core with bundled Chrome
 * This avoids the system dependency issues of Playwright
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// List of all landing pages to screenshot
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
    { name: 'Animations Demo', path: 'pages/animations-demo.html' },
    { name: 'Gallery Index', path: 'pages/index.html' }
];

// Viewport configurations
const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 }
];

const screenshotsDir = path.join(__dirname, '../screenshots');

// Create screenshots directory
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('\n🎨 Gemini Ad Campaign Screenshot Generator');
console.log('==========================================\n');

// Try to use puppeteer if available
let puppeteer = null;
try {
    puppeteer = require('puppeteer');
    console.log('✅ Found puppeteer package');
} catch (e) {
    console.log('ℹ️  puppeteer not found, attempting to install...');
    require('child_process').execSync('npm install puppeteer --no-save', { stdio: 'inherit' });
    try {
        puppeteer = require('puppeteer');
        console.log('✅ puppeteer installed successfully');
    } catch (e2) {
        console.error('❌ Failed to install puppeteer:', e2.message);
        console.log('\n📝 Alternative: Manual Screenshot Instructions');
        console.log('===============================================');
        console.log('Since automated screenshots cannot be generated, please:');
        console.log('1. Run: npm run serve');
        console.log('2. Open http://localhost:8080 in your browser');
        console.log('3. Navigate to each page and take screenshots manually');
        console.log('\nPages to screenshot:');
        pages.forEach(page => {
            console.log(`   - http://localhost:8080/${page.path} (${page.name})`);
        });
        process.exit(1);
    }
}

async function generateScreenshots() {
    // Start local server using http-server (from package.json)
    const serverProcess = spawn('npx', ['http-server', '.', '-p', '8080', '--silent'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('🌐 Server started on http://localhost:8080\n');

    let browser = null;
    try {
        // Launch browser
        console.log('🚀 Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('✅ Browser launched\n');

        const browserPage = await browser.newPage();
        let screenshotCount = 0;
        const totalScreenshots = pages.length * viewports.length;

        // Generate screenshots for each page at each viewport
        for (const page of pages) {
            console.log(`📸 ${page.name}`);

            for (const viewport of viewports) {
                await browserPage.setViewport({ width: viewport.width, height: viewport.height });
                await browserPage.goto(`http://localhost:8080/${page.path}`, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });

                // Wait for animations to settle
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Take screenshot
                const baseName = page.path.replace('pages/', '').replace('.html', '');
                const fileName = `${baseName}-${viewport.name}.png`;
                const filePath = path.join(screenshotsDir, fileName);

                await browserPage.screenshot({
                    path: filePath,
                    fullPage: true
                });

                screenshotCount++;
                console.log(`   ✓ ${viewport.name.padEnd(10)} (${screenshotCount}/${totalScreenshots})`);
            }

            // Also capture hero section
            await browserPage.setViewport({ width: 1440, height: 900 });
            await browserPage.goto(`http://localhost:8080/${page.path}`, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
                const hero = await browserPage.$('.hero, .hero-section, section:first-of-type');
                if (hero) {
                    const baseName = page.path.replace('pages/', '').replace('.html', '');
                    const fileName = `${baseName}-hero.png`;
                    const filePath = path.join(screenshotsDir, fileName);
                    await hero.screenshot({ path: filePath });
                    console.log(`   ✓ hero section`);
                }
            } catch (e) {
                // Hero section not found or couldn't screenshot, skip
            }

            console.log('');
        }

        console.log(`\n✅ Generated ${screenshotCount} screenshots!`);
        console.log(`📁 Screenshots saved to: ${screenshotsDir}\n`);

        // Generate gallery HTML
        console.log('📊 Generating screenshot gallery...');
        generateGalleryHTML();
        console.log(`✅ Gallery created at: ${path.join(screenshotsDir, 'gallery.html')}\n`);

    } catch (error) {
        console.error('\n❌ Error generating screenshots:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
        if (serverProcess) {
            serverProcess.kill();
        }
        console.log('🎉 Screenshot generation complete!');
    }
}

function generateGalleryHTML() {
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
            margin-bottom: 20px;
            text-align: center;
        }
        .subtitle {
            text-align: center;
            font-size: 18px;
            color: #666;
            margin-bottom: 40px;
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
            cursor: pointer;
            transition: transform 0.2s;
        }
        .screenshot img:hover {
            transform: scale(1.02);
        }
        .screenshot p {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
        .stats {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 40px;
            text-align: center;
        }
        .stats h3 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .stats p {
            font-size: 16px;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 Gemini Ad Campaign Screenshots</h1>
        <p class="subtitle">Quality assurance review for all landing pages across devices</p>

        <div class="stats">
            <h3>📊 Screenshot Summary</h3>
            <p>${pages.length} landing pages × ${viewports.length} viewports = ${pages.length * viewports.length} total screenshots</p>
        </div>
`;

    pages.forEach(page => {
        const baseName = page.path.replace('pages/', '').replace('.html', '');
        html += `
        <div class="page-section">
            <h2>${page.name}</h2>
            <p style="margin-bottom: 20px; color: #666;"><code>${page.path}</code></p>
            <div class="screenshots">
                <div class="screenshot">
                    <img src="${baseName}-desktop.png" alt="${page.name} Desktop" loading="lazy">
                    <p>Desktop (1440×900)</p>
                </div>
                <div class="screenshot">
                    <img src="${baseName}-tablet.png" alt="${page.name} Tablet" loading="lazy">
                    <p>Tablet (768×1024)</p>
                </div>
                <div class="screenshot">
                    <img src="${baseName}-mobile.png" alt="${page.name} Mobile" loading="lazy">
                    <p>Mobile (375×812)</p>
                </div>
            </div>
        </div>
`;
    });

    html += `
    </div>
    <script>
        // Click to view full size
        document.querySelectorAll('.screenshot img').forEach(img => {
            img.addEventListener('click', () => {
                window.open(img.src, '_blank');
            });
        });
    </script>
</body>
</html>
`;

    fs.writeFileSync(galleryPath, html);
}

// Run if called directly
if (require.main === module) {
    generateScreenshots().catch(console.error);
}

module.exports = { generateScreenshots, generateGalleryHTML };
