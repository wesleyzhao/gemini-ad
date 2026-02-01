/**
 * Core Web Vitals Optimization Validation Suite
 * Tests that all optimizations have been properly applied
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PAGES_DIR = path.join(__dirname, '..', 'pages');
const BUDGETS_FILE = path.join(__dirname, '..', 'performance-budgets.json');

// Load performance budgets
const budgets = JSON.parse(fs.readFileSync(BUDGETS_FILE, 'utf8'));

// Test suite
const tests = [];
let passed = 0;
let failed = 0;

// Helper function to add test result
function test(name, condition, details = '') {
  const result = {
    name,
    passed: condition,
    details
  };
  tests.push(result);

  if (condition) {
    passed++;
    console.log(`  ✅ ${name}`);
  } else {
    failed++;
    console.log(`  ❌ ${name}`);
    if (details) console.log(`     ${details}`);
  }

  return condition;
}

// Main validation function
function validateCoreWebVitals() {
  console.log('Core Web Vitals Optimization Validation');
  console.log('='.repeat(80));
  console.log('');

  // Test 1: Check that optimization script exists
  console.log('📋 Core Files:');
  test(
    'Core Web Vitals script exists',
    fs.existsSync(path.join(__dirname, '..', 'scripts', 'core-web-vitals.js')),
    'scripts/core-web-vitals.js should exist'
  );

  test(
    'Performance budgets config exists',
    fs.existsSync(BUDGETS_FILE),
    'performance-budgets.json should exist'
  );

  test(
    'Fix optimizations script exists',
    fs.existsSync(path.join(__dirname, '..', 'scripts', 'fix-optimizations.js')),
    'scripts/fix-optimizations.js should exist'
  );

  test(
    'Core Web Vitals report exists',
    fs.existsSync(path.join(__dirname, '..', 'reports', 'core-web-vitals-report.json')),
    'reports/core-web-vitals-report.json should exist'
  );

  console.log('');

  // Test 2: Validate performance budgets structure
  console.log('📊 Performance Budgets Configuration:');
  test(
    'Core Web Vitals budgets defined',
    budgets.coreWebVitals && Object.keys(budgets.coreWebVitals).length >= 4,
    'Should have LCP, FID, INP, CLS budgets'
  );

  test(
    'Resource budgets defined',
    budgets.resourceBudgets && budgets.resourceBudgets.totalPageWeight,
    'Should have resource size budgets'
  );

  test(
    'Lighthouse score targets defined',
    budgets.lighthouseScores && budgets.lighthouseScores.performance.target >= 90,
    'Performance score target should be ≥90'
  );

  console.log('');

  // Test 3: Validate all pages have optimizations
  console.log('🔍 Page-Level Optimizations:');

  const htmlFiles = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));

  console.log(`   Checking ${htmlFiles.length} HTML files...`);

  let pagesWithPreconnect = 0;
  let pagesWithFontDisplay = 0;
  let pagesWithPreload = 0;
  let pagesWithDeferJS = 0;
  let pagesWithWebVitalsMonitoring = 0;
  let pagesWithCriticalCSS = 0;
  let pagesWithoutDuplicates = 0;

  htmlFiles.forEach(file => {
    const filePath = path.join(PAGES_DIR, file);
    const html = fs.readFileSync(filePath, 'utf8');

    // Check for preconnect hints
    if (html.includes('rel="preconnect"') || html.includes('rel="dns-prefetch"')) {
      pagesWithPreconnect++;
    }

    // Check for font-display swap
    if (html.includes('display=swap')) {
      pagesWithFontDisplay++;
    }

    // Check for preload hints
    if (html.includes('rel="preload"')) {
      pagesWithPreload++;
    }

    // Check for deferred JavaScript
    if (html.includes('defer') || html.includes('async')) {
      pagesWithDeferJS++;
    }

    // Check for Core Web Vitals monitoring
    if (html.includes('__webVitals') || html.includes('web-vitals') || html.includes('onLCP')) {
      pagesWithWebVitalsMonitoring++;
    }

    // Check for critical CSS inlining
    if (html.includes('critical-css') || html.includes('onload="this.onload=null;this.rel=\'stylesheet\'"')) {
      pagesWithCriticalCSS++;
    }

    // Check for duplicate meta tags
    const perfOptCount = (html.match(/<!-- Performance optimizations -->/g) || []).length;
    if (perfOptCount <= 1) {
      pagesWithoutDuplicates++;
    }
  });

  test(
    'All pages have preconnect/dns-prefetch hints',
    pagesWithPreconnect === htmlFiles.length,
    `${pagesWithPreconnect}/${htmlFiles.length} pages have preconnect hints`
  );

  test(
    'All pages use font-display:swap',
    pagesWithFontDisplay === htmlFiles.length,
    `${pagesWithFontDisplay}/${htmlFiles.length} pages use font-display:swap`
  );

  test(
    'All pages have resource preload hints',
    pagesWithPreload === htmlFiles.length,
    `${pagesWithPreload}/${htmlFiles.length} pages have preload hints`
  );

  test(
    'All pages defer non-critical JavaScript',
    pagesWithDeferJS === htmlFiles.length,
    `${pagesWithDeferJS}/${htmlFiles.length} pages defer JavaScript`
  );

  test(
    'All pages have Core Web Vitals monitoring',
    pagesWithWebVitalsMonitoring === htmlFiles.length,
    `${pagesWithWebVitalsMonitoring}/${htmlFiles.length} pages have monitoring`
  );

  test(
    'All pages use critical CSS optimization',
    pagesWithCriticalCSS === htmlFiles.length,
    `${pagesWithCriticalCSS}/${htmlFiles.length} pages use critical CSS`
  );

  test(
    'No duplicate optimization elements',
    pagesWithoutDuplicates === htmlFiles.length,
    `${pagesWithoutDuplicates}/${htmlFiles.length} pages have no duplicates`
  );

  console.log('');

  // Test 4: Validate specific optimization patterns
  console.log('🎯 Optimization Patterns:');

  // Sample a couple of pages for detailed checks
  const samplePages = htmlFiles.slice(0, 3);
  let correctPreconnectPattern = 0;
  let correctAsyncCSSPattern = 0;
  let correctDeferPattern = 0;

  samplePages.forEach(file => {
    const filePath = path.join(PAGES_DIR, file);
    const html = fs.readFileSync(filePath, 'utf8');

    // Check preconnect to fonts.googleapis.com and fonts.gstatic.com
    if (html.includes('preconnect" href="https://fonts.googleapis.com"') &&
        html.includes('preconnect" href="https://fonts.gstatic.com"')) {
      correctPreconnectPattern++;
    }

    // Check async CSS loading pattern
    if (html.includes('onload="this.onload=null;this.rel=\'stylesheet\'"')) {
      correctAsyncCSSPattern++;
    }

    // Check defer attribute on scripts
    if (html.match(/<script[^>]+defer[^>]*>/)) {
      correctDeferPattern++;
    }
  });

  test(
    'Correct preconnect pattern for Google Fonts',
    correctPreconnectPattern === samplePages.length,
    `${correctPreconnectPattern}/${samplePages.length} sample pages have correct preconnect`
  );

  test(
    'Correct async CSS loading pattern',
    correctAsyncCSSPattern === samplePages.length,
    `${correctAsyncCSSPattern}/${samplePages.length} sample pages use async CSS`
  );

  test(
    'Correct defer pattern for scripts',
    correctDeferPattern === samplePages.length,
    `${correctDeferPattern}/${samplePages.length} sample pages defer scripts`
  );

  console.log('');

  // Test 5: Check for common anti-patterns
  console.log('⚠️  Anti-Pattern Detection:');

  let pagesWithRenderBlockingCSS = 0;
  let pagesWithInlineScripts = 0;
  let pagesWithMissingDimensions = 0;

  htmlFiles.forEach(file => {
    const filePath = path.join(PAGES_DIR, file);
    const html = fs.readFileSync(filePath, 'utf8');

    // Check for render-blocking CSS (not using async loading)
    const regularStylesheetLinks = html.match(/<link rel="stylesheet" href="[^"]+shared-styles\.css"(?! onload)/g);
    if (regularStylesheetLinks && regularStylesheetLinks.length > 0) {
      pagesWithRenderBlockingCSS++;
    }

    // Check for large inline scripts (>5KB)
    const inlineScripts = html.match(/<script(?! src)[^>]*>[\s\S]*?<\/script>/g) || [];
    const totalInlineScriptSize = inlineScripts.reduce((sum, script) => sum + script.length, 0);
    if (totalInlineScriptSize > 5000) {
      pagesWithInlineScripts++;
    }

    // Check if images have dimensions (when present)
    const images = html.match(/<img[^>]+>/g) || [];
    images.forEach(img => {
      if (!img.includes('width=') || !img.includes('height=')) {
        pagesWithMissingDimensions++;
      }
    });
  });

  test(
    'No render-blocking CSS',
    pagesWithRenderBlockingCSS === 0,
    pagesWithRenderBlockingCSS > 0 ? `${pagesWithRenderBlockingCSS} pages have render-blocking CSS` : 'All pages use async CSS loading'
  );

  test(
    'No excessive inline scripts',
    pagesWithInlineScripts === 0,
    pagesWithInlineScripts > 0 ? `${pagesWithInlineScripts} pages have large inline scripts` : 'All pages have reasonable inline script sizes'
  );

  test(
    'Images have dimensions (CLS prevention)',
    pagesWithMissingDimensions === 0,
    pagesWithMissingDimensions > 0 ? `${pagesWithMissingDimensions} images missing dimensions` : 'All images have width/height attributes'
  );

  console.log('');

  // Test 6: Performance budget compliance
  console.log('💰 Performance Budget Compliance:');

  // Calculate approximate sizes
  let totalJSSize = 0;
  let totalCSSSize = 0;

  // Check animations.js
  const animationsPath = path.join(__dirname, '..', 'assets', 'js', 'animations.js');
  if (fs.existsSync(animationsPath)) {
    totalJSSize += fs.statSync(animationsPath).size;
  }

  // Check lazy-loading.js
  const lazyLoadingPath = path.join(__dirname, '..', 'assets', 'js', 'lazy-loading.min.js');
  if (fs.existsSync(lazyLoadingPath)) {
    totalJSSize += fs.statSync(lazyLoadingPath).size;
  }

  // Check shared-styles.css
  const sharedStylesPath = path.join(__dirname, '..', 'assets', 'css', 'shared-styles.css');
  if (fs.existsSync(sharedStylesPath)) {
    totalCSSSize += fs.statSync(sharedStylesPath).size;
  }

  totalJSSize = Math.round(totalJSSize / 1024); // Convert to KB
  totalCSSSize = Math.round(totalCSSSize / 1024);

  test(
    'JavaScript within budget',
    totalJSSize <= budgets.resourceBudgets.javascript.budget,
    `Total JS: ${totalJSSize}KB / Budget: ${budgets.resourceBudgets.javascript.budget}KB`
  );

  test(
    'CSS within budget',
    totalCSSSize <= budgets.resourceBudgets.css.budget,
    `Total CSS: ${totalCSSSize}KB / Budget: ${budgets.resourceBudgets.css.budget}KB`
  );

  console.log('');

  // Test 7: Documentation
  console.log('📚 Documentation:');

  const docsPath = path.join(__dirname, '..', 'docs', 'CORE_WEB_VITALS.md');
  test(
    'Core Web Vitals documentation exists',
    fs.existsSync(docsPath) || fs.existsSync(path.join(__dirname, '..', 'docs', 'core-web-vitals.md')),
    'Should have documentation for Core Web Vitals optimizations'
  );

  console.log('');

  // Final summary
  console.log('='.repeat(80));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${Math.round((passed / tests.length) * 100)}%`);

  // Grade
  const successRate = (passed / tests.length) * 100;
  let grade;
  if (successRate >= 95) grade = 'A+ (Excellent)';
  else if (successRate >= 90) grade = 'A (Very Good)';
  else if (successRate >= 85) grade = 'B+ (Good)';
  else if (successRate >= 80) grade = 'B (Acceptable)';
  else if (successRate >= 70) grade = 'C (Needs Work)';
  else grade = 'D (Poor)';

  console.log(`Grade: ${grade}`);
  console.log('');

  if (failed === 0) {
    console.log('🎉 All Core Web Vitals optimizations validated successfully!');
  } else {
    console.log('⚠️  Some optimizations need attention. Review failed tests above.');
  }

  console.log('');

  // Return results
  return {
    total: tests.length,
    passed,
    failed,
    successRate,
    grade,
    tests
  };
}

// Run validation
if (require.main === module) {
  const results = validateCoreWebVitals();
  process.exit(results.failed > 0 ? 1 : 0);
}

module.exports = { validateCoreWebVitals };
