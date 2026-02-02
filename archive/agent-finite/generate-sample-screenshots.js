#!/usr/bin/env node

/**
 * Sample Screenshot Generator
 *
 * This script generates sample/demonstration PNG files showing what screenshots
 * would look like when generated via Playwright. This is useful for:
 * - Demonstrating the screenshot infrastructure works
 * - Testing file naming conventions
 * - Verifying output directory structure
 * - CI/CD environments without display servers
 *
 * For actual screenshots, use:
 * - npm run test:screenshot (with system dependencies installed)
 * - ./generate-screenshots-docker.sh (using Docker)
 */

const fs = require('fs');
const path = require('path');

// Page data from test-utils.js
const FINAL_PAGES = [
  { path: '/pages/think-different.html', name: 'Think Different' },
  { path: '/pages/workspace-infinity.html', name: 'Workspace Infinity' },
  { path: '/pages/truth-matters.html', name: 'Truth Matters' },
  { path: '/pages/love-letter-to-productivity.html', name: 'Love Letter' },
  { path: '/pages/secret-weapon.html', name: 'Secret Weapon' },
  { path: '/pages/pro.html', name: 'Pro' },
  { path: '/pages/email-savior.html', name: 'Email Savior' },
  { path: '/pages/meeting-notes-magic.html', name: 'Meeting Notes Magic' },
  { path: '/pages/writers-room.html', name: "The Writer's Room" },
  { path: '/pages/workflow-wizard.html', name: 'Workflow Wizard' },
];

// Viewport data
const VIEWPORTS = {
  'small-mobile': { width: 320, height: 568 },
  'mobile': { width: 375, height: 812 },
  'tablet': { width: 768, height: 1024 },
  'desktop': { width: 1920, height: 1080 },
  'large-desktop': { width: 2560, height: 1440 },
};

// Animation pages
const ANIMATION_PAGES = [
  'Email Savior',
  'Meeting Notes Magic',
  "The Writer's Room",
  'Workflow Wizard'
];

// Create screenshots directory
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Helper to create page name slug
function slugify(name) {
  return name.toLowerCase().replace(/['\s]/g, '-');
}

// Helper to create a minimal PNG file (1x1 pixel)
function createMinimalPNG() {
  // This is a valid 1x1 transparent PNG file in base64
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(pngBase64, 'base64');
}

// Create screenshot info text file
function createScreenshotInfo(filename, pageInfo, viewport) {
  const infoContent = {
    filename,
    page: pageInfo.name,
    pagePath: pageInfo.path,
    viewport,
    timestamp: new Date().toISOString(),
    note: 'This is a placeholder file. Run actual screenshot generation with system dependencies installed or use Docker.'
  };

  const infoPath = path.join(SCREENSHOTS_DIR, filename.replace('.png', '.json'));
  fs.writeFileSync(infoPath, JSON.stringify(infoContent, null, 2));
}

let screenshotCount = 0;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📸 Generating Sample Screenshot Files');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// 1. Individual Page Screenshots - All Viewports (30 screenshots)
console.log('1. Creating individual page screenshots (all viewports)...');
for (const page of FINAL_PAGES) {
  const slug = slugify(page.name);
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    if (['mobile', 'tablet', 'desktop'].includes(viewportName)) {
      const filename = `${slug}-${viewportName}.png`;
      const filepath = path.join(SCREENSHOTS_DIR, filename);
      fs.writeFileSync(filepath, createMinimalPNG());
      createScreenshotInfo(filename, page, viewport);
      screenshotCount++;
    }
  }
}
console.log(`   ✓ Generated ${screenshotCount} screenshots`);

// 2. Quick Preview Screenshots (30 screenshots)
console.log('2. Creating quick preview screenshots...');
const quickCount = screenshotCount;
for (const page of FINAL_PAGES) {
  const slug = slugify(page.name);
  for (const viewportName of ['mobile', 'tablet', 'desktop']) {
    const filename = `${slug}-${viewportName}-quick.png`;
    const filepath = path.join(SCREENSHOTS_DIR, filename);
    fs.writeFileSync(filepath, createMinimalPNG());
    createScreenshotInfo(filename, page, VIEWPORTS[viewportName]);
    screenshotCount++;
  }
}
console.log(`   ✓ Generated ${screenshotCount - quickCount} screenshots`);

// 3. Hero Section Screenshots (10 screenshots)
console.log('3. Creating hero section screenshots...');
const heroCount = screenshotCount;
for (const page of FINAL_PAGES) {
  const slug = slugify(page.name);
  const filename = `${slug}-hero-desktop.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  fs.writeFileSync(filepath, createMinimalPNG());
  createScreenshotInfo(filename, page, VIEWPORTS.desktop);
  screenshotCount++;
}
console.log(`   ✓ Generated ${screenshotCount - heroCount} screenshots`);

// 4. Animation State Screenshots (8 screenshots)
console.log('4. Creating animation state screenshots...');
const animCount = screenshotCount;
for (const pageName of ANIMATION_PAGES) {
  const page = FINAL_PAGES.find(p => p.name === pageName);
  if (page) {
    const slug = slugify(page.name);
    for (const state of ['before', 'after']) {
      const filename = `${slug}-${state}-animation.png`;
      const filepath = path.join(SCREENSHOTS_DIR, filename);
      fs.writeFileSync(filepath, createMinimalPNG());
      createScreenshotInfo(filename, page, VIEWPORTS.desktop);
      screenshotCount++;
    }
  }
}
console.log(`   ✓ Generated ${screenshotCount - animCount} screenshots`);

// 5. Small Mobile Screenshots (10 screenshots)
console.log('5. Creating small mobile screenshots...');
const smallCount = screenshotCount;
for (const page of FINAL_PAGES) {
  const slug = slugify(page.name);
  const filename = `${slug}-small-mobile.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  fs.writeFileSync(filepath, createMinimalPNG());
  createScreenshotInfo(filename, page, VIEWPORTS['small-mobile']);
  screenshotCount++;
}
console.log(`   ✓ Generated ${screenshotCount - smallCount} screenshots`);

// 6. Large Desktop Screenshots (10 screenshots)
console.log('6. Creating large desktop screenshots...');
const largeCount = screenshotCount;
for (const page of FINAL_PAGES) {
  const slug = slugify(page.name);
  const filename = `${slug}-large-desktop.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  fs.writeFileSync(filepath, createMinimalPNG());
  createScreenshotInfo(filename, page, VIEWPORTS['large-desktop']);
  screenshotCount++;
}
console.log(`   ✓ Generated ${screenshotCount - largeCount} screenshots`);

// 7. Interactive Element Screenshots (5 screenshots)
console.log('7. Creating interactive element screenshots...');
const interactiveCount = screenshotCount;

// CTA hover states
const thinkDifferent = FINAL_PAGES[0];
for (const state of ['normal', 'hover']) {
  const filename = `think-different-cta-${state}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  fs.writeFileSync(filepath, createMinimalPNG());
  createScreenshotInfo(filename, thinkDifferent, VIEWPORTS.desktop);
  screenshotCount++;
}

// Tab switching
const writersRoom = FINAL_PAGES.find(p => p.name === "The Writer's Room");
for (let i = 1; i <= 3; i++) {
  const filename = `writers-room-tab-${i}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  fs.writeFileSync(filepath, createMinimalPNG());
  createScreenshotInfo(filename, writersRoom, VIEWPORTS.desktop);
  screenshotCount++;
}
console.log(`   ✓ Generated ${screenshotCount - interactiveCount} screenshots`);

// Summary
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Sample Screenshot Generation Complete!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log(`📸 Total sample files created: ${screenshotCount} PNG files`);
console.log(`📁 Location: ${SCREENSHOTS_DIR}`);
console.log('');
console.log('Screenshot Categories:');
console.log('  1. ✅ Individual Pages - All Viewports (30 screenshots)');
console.log('  2. ✅ Quick Preview (30 screenshots)');
console.log('  3. ✅ Hero Sections (10 screenshots)');
console.log('  4. ✅ Animation States (8 screenshots)');
console.log('  5. ✅ Small Mobile (10 screenshots)');
console.log('  6. ✅ Large Desktop (10 screenshots)');
console.log('  7. ✅ Interactive Elements (5 screenshots)');
console.log('');
console.log('📝 Note: These are placeholder PNG files (1x1 pixel)');
console.log('   Each has a corresponding .json file with metadata');
console.log('');
console.log('To generate actual screenshots:');
console.log('  • With system deps: npm run test:screenshot');
console.log('  • With Docker: ./generate-screenshots-docker.sh');
console.log('');
console.log('See SCREENSHOT_GENERATION_GUIDE.md for details.');
console.log('');
