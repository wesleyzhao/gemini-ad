#!/usr/bin/env node

/**
 * Screenshot Readiness Validator
 * Validates that all landing pages are ready for screenshot generation
 * Checks HTML structure, CSS loading, JavaScript functionality
 */

const fs = require('fs');
const path = require('path');

console.log('\n📸 Screenshot Readiness Validation');
console.log('===================================\n');

// List of all landing pages
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

const projectRoot = path.join(__dirname, '..');
let totalScore = 0;
let maxScore = 0;
const results = [];

// Validation checks
function validatePage(page) {
    const filePath = path.join(projectRoot, page.path);
    let score = 0;
    const checks = [];

    // Check 1: File exists
    if (fs.existsSync(filePath)) {
        score += 10;
        checks.push({ name: 'File exists', passed: true });
    } else {
        checks.push({ name: 'File exists', passed: false });
        return { score: 0, total: 100, checks };
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Check 2: Has DOCTYPE
    if (content.includes('<!DOCTYPE html>')) {
        score += 5;
        checks.push({ name: 'DOCTYPE declared', passed: true });
    } else {
        checks.push({ name: 'DOCTYPE declared', passed: false });
    }

    // Check 3: Has viewport meta tag
    if (content.includes('name="viewport"')) {
        score += 10;
        checks.push({ name: 'Responsive viewport', passed: true });
    } else {
        checks.push({ name: 'Responsive viewport', passed: false });
    }

    // Check 4: Has title
    if (content.match(/<title>(.+)<\/title>/)) {
        score += 5;
        checks.push({ name: 'Page title', passed: true });
    } else {
        checks.push({ name: 'Page title', passed: false });
    }

    // Check 5: Loads CSS (shared or inline)
    const hasCSS = content.includes('shared-styles.css') || content.includes('<style>');
    if (hasCSS) {
        score += 15;
        checks.push({ name: 'CSS loaded', passed: true });
    } else {
        checks.push({ name: 'CSS loaded', passed: false });
    }

    // Check 6: Has hero section
    const hasHero = content.match(/<section[^>]*class="[^"]*hero/i) ||
                   content.match(/<div[^>]*class="[^"]*hero/i) ||
                   content.match(/<header[^>]*>/);
    if (hasHero) {
        score += 15;
        checks.push({ name: 'Hero section', passed: true });
    } else {
        checks.push({ name: 'Hero section', passed: false });
    }

    // Check 7: Has CTA button
    const hasCTA = content.includes('btn-primary') ||
                   content.includes('cta-button') ||
                   content.includes('class="btn"');
    if (hasCTA) {
        score += 10;
        checks.push({ name: 'CTA button', passed: true });
    } else {
        checks.push({ name: 'CTA button', passed: false });
    }

    // Check 8: Loads JavaScript
    const hasJS = content.includes('animations.js') ||
                 content.includes('video-animations.js') ||
                 content.includes('<script>');
    if (hasJS) {
        score += 10;
        checks.push({ name: 'JavaScript loaded', passed: true });
    } else {
        checks.push({ name: 'JavaScript loaded', passed: false });
    }

    // Check 9: Has h1 heading
    if (content.match(/<h1[^>]*>(.+)<\/h1>/s)) {
        score += 10;
        checks.push({ name: 'Main heading (h1)', passed: true });
    } else {
        checks.push({ name: 'Main heading (h1)', passed: false });
    }

    // Check 10: Reasonable file size (not empty, not too large)
    const fileSize = content.length;
    if (fileSize > 500 && fileSize < 100000) {
        score += 10;
        checks.push({ name: 'File size reasonable', passed: true });
    } else if (fileSize <= 500) {
        checks.push({ name: 'File size reasonable (too small)', passed: false });
    } else {
        checks.push({ name: 'File size reasonable (too large)', passed: false });
    }

    return { score, total: 100, checks };
}

// Validate all pages
console.log('Validating landing pages...\n');

pages.forEach((page, index) => {
    const result = validatePage(page);
    results.push({ page, ...result });
    totalScore += result.score;
    maxScore += result.total;

    const percentage = Math.round((result.score / result.total) * 100);
    const status = percentage >= 80 ? '✅' : percentage >= 60 ? '⚠️' : '❌';

    console.log(`${status} ${(index + 1).toString().padStart(2)}. ${page.name.padEnd(20)} ${percentage}% (${result.score}/${result.total})`);

    // Show failed checks
    const failedChecks = result.checks.filter(c => !c.passed);
    if (failedChecks.length > 0 && percentage < 80) {
        failedChecks.forEach(check => {
            console.log(`   ❌ ${check.name}`);
        });
    }
});

const overallPercentage = Math.round((totalScore / maxScore) * 100);

console.log('\n' + '='.repeat(50));
console.log(`Overall Score: ${totalScore}/${maxScore} (${overallPercentage}%)`);
console.log('='.repeat(50) + '\n');

// Summary
const readyPages = results.filter(r => (r.score / r.total) >= 0.8).length;
const needsWorkPages = results.filter(r => (r.score / r.total) < 0.8).length;

console.log('📊 Summary:');
console.log(`   ✅ Ready for screenshots: ${readyPages}/${pages.length}`);
if (needsWorkPages > 0) {
    console.log(`   ⚠️  Needs work: ${needsWorkPages}/${pages.length}`);
}
console.log('');

// Check shared resources
console.log('📦 Shared Resources:');
const sharedCSS = path.join(projectRoot, 'assets/css/shared-styles.css');
const animationsJS = path.join(projectRoot, 'assets/js/animations.js');
const videoAnimationsJS = path.join(projectRoot, 'assets/js/video-animations.js');

if (fs.existsSync(sharedCSS)) {
    const cssSize = fs.statSync(sharedCSS).size;
    console.log(`   ✅ shared-styles.css (${(cssSize / 1024).toFixed(1)}KB)`);
} else {
    console.log(`   ❌ shared-styles.css not found`);
}

if (fs.existsSync(animationsJS)) {
    const jsSize = fs.statSync(animationsJS).size;
    console.log(`   ✅ animations.js (${(jsSize / 1024).toFixed(1)}KB)`);
} else {
    console.log(`   ❌ animations.js not found`);
}

if (fs.existsSync(videoAnimationsJS)) {
    const jsSize = fs.statSync(videoAnimationsJS).size;
    console.log(`   ✅ video-animations.js (${(jsSize / 1024).toFixed(1)}KB)`);
} else {
    console.log(`   ⚠️  video-animations.js not found`);
}

console.log('');

// Screenshot directory check
const screenshotsDir = path.join(projectRoot, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    console.log('✅ Created screenshots/ directory');
} else {
    const files = fs.readdirSync(screenshotsDir);
    const pngFiles = files.filter(f => f.endsWith('.png'));
    if (pngFiles.length > 0) {
        console.log(`📸 Found ${pngFiles.length} existing screenshots in screenshots/`);
    } else {
        console.log(`📁 screenshots/ directory exists (empty)`);
    }
}

console.log('');

// Recommendations
console.log('💡 Recommendations:');
if (overallPercentage >= 90) {
    console.log('   🎉 Excellent! All pages are ready for screenshot generation.');
    console.log('   ▶️  Run: npm run serve');
    console.log('   ▶️  Then manually capture screenshots or use CI/CD with Playwright');
} else if (overallPercentage >= 70) {
    console.log('   ✅ Good! Most pages are ready, but some need minor fixes.');
    console.log('   ▶️  Review failed checks above and fix issues');
    console.log('   ▶️  Re-run validation: node tests/validate-screenshot-readiness.js');
} else {
    console.log('   ⚠️  Several pages need attention before screenshots.');
    console.log('   ▶️  Focus on pages scoring below 80%');
    console.log('   ▶️  Ensure all pages have hero sections, CTAs, and proper structure');
}

console.log('');

// Exit with appropriate code
process.exit(overallPercentage >= 80 ? 0 : 1);
