#!/usr/bin/env node

/**
 * Feature #86 Validation Test Suite
 * Tests Quad Threat pattern implementation on 3 new baseline pages
 *
 * Pages tested:
 * - writers.html (Writers segment - VO3 tools)
 * - creators.html (Creators segment - Nano Banana)
 * - valentine.html (Valentine's Day entry hook)
 *
 * Test coverage: 24 tests (3 pages × 8 tests each)
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Test results storage
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test a single page for Quad Threat pattern implementation
 */
function testPage(pagePath, pageName) {
  console.log(`\n${colors.cyan}${colors.bold}Testing: ${pageName}${colors.reset}`);
  console.log(`File: ${pagePath}`);
  console.log('─'.repeat(60));

  const content = fs.readFileSync(pagePath, 'utf8');
  let pageResults = {
    page: pageName,
    path: pagePath,
    tests: []
  };

  // Test 1: Has Quad Threat HTML container
  test(
    'Has Quad Threat HTML container',
    content.includes('<div class="quad-threat-container">'),
    'Missing Quad Threat container div',
    pageResults
  );

  // Test 2: Has sticky CTA button
  test(
    'Has sticky CTA button',
    content.includes('<button class="sticky-cta-quad"'),
    'Missing sticky CTA button element',
    pageResults
  );

  // Test 3: Has social proof banner
  test(
    'Has social proof banner',
    content.includes('<div class="social-proof-banner-quad">'),
    'Missing social proof banner div',
    pageResults
  );

  // Test 4: Has Wave 4 comment marker
  test(
    'Has Wave 4 comment marker',
    content.includes('<!-- Wave 4: Quad Threat'),
    'Missing Wave 4 implementation marker comment',
    pageResults
  );

  // Test 5: Has Quad Threat CSS styles
  test(
    'Has Quad Threat CSS styles',
    content.includes('/* Wave 4: Quad Threat Mega Combo Styles */') &&
    content.includes('.sticky-cta-quad {') &&
    content.includes('.social-proof-banner-quad {'),
    'Missing Quad Threat CSS styles',
    pageResults
  );

  // Test 6: Has social proof avatars
  test(
    'Has social proof avatars',
    content.includes('<div class="social-proof-avatars">') &&
    content.includes('<svg viewBox="0 0 32 32"'),
    'Missing social proof avatar elements',
    pageResults
  );

  // Test 7: CTA button opens Gemini
  test(
    'CTA button opens Gemini',
    content.includes('onclick="window.open(\'https://gemini.google.com\'') ||
    content.includes('onclick="window.open("https://gemini.google.com"'),
    'CTA button does not link to Gemini',
    pageResults
  );

  // Test 8: Has mobile responsive styles
  test(
    'Has mobile responsive styles',
    content.includes('@media (max-width: 768px)') &&
    content.includes('.sticky-cta-quad {') &&
    content.match(/@media.*max-width.*768px.*sticky-cta-quad/s),
    'Missing mobile responsive styles for Quad Threat',
    pageResults
  );

  return pageResults;
}

/**
 * Run a single test
 */
function test(name, condition, errorMessage, pageResults) {
  results.total++;
  const passed = condition;

  if (passed) {
    results.passed++;
    console.log(`${colors.green}✓${colors.reset} ${name}`);
  } else {
    results.failed++;
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}Error: ${errorMessage}${colors.reset}`);
  }

  pageResults.tests.push({
    name,
    passed,
    error: passed ? null : errorMessage
  });

  results.tests.push({
    page: pageResults.page,
    test: name,
    passed,
    error: passed ? null : errorMessage
  });
}

/**
 * Calculate and display final grade
 */
function calculateGrade(passRate) {
  if (passRate === 100) return 'A+';
  if (passRate >= 95) return 'A';
  if (passRate >= 90) return 'A-';
  if (passRate >= 85) return 'B+';
  if (passRate >= 80) return 'B';
  if (passRate >= 75) return 'B-';
  if (passRate >= 70) return 'C+';
  if (passRate >= 65) return 'C';
  return 'F';
}

/**
 * Print summary report
 */
function printSummary() {
  console.log('\n' + '═'.repeat(60));
  console.log(`${colors.bold}${colors.blue}FEATURE #86 TEST SUMMARY${colors.reset}`);
  console.log('═'.repeat(60));

  const passRate = (results.passed / results.total * 100).toFixed(1);
  const grade = calculateGrade(parseFloat(passRate));

  console.log(`\nTotal Tests:  ${results.total}`);
  console.log(`${colors.green}Passed:       ${results.passed} ✓${colors.reset}`);
  console.log(`${colors.red}Failed:       ${results.failed} ✗${colors.reset}`);
  console.log(`\nPass Rate:    ${passRate}%`);

  const gradeColor = grade.startsWith('A') ? colors.green :
                     grade.startsWith('B') ? colors.yellow : colors.red;
  console.log(`Grade:        ${gradeColor}${colors.bold}${grade}${colors.reset}`);

  if (results.failed > 0) {
    console.log(`\n${colors.yellow}${colors.bold}Failed Tests:${colors.reset}`);
    results.tests
      .filter(t => !t.passed)
      .forEach(t => {
        console.log(`  ${colors.red}✗${colors.reset} ${t.page}: ${t.test}`);
        console.log(`    ${colors.red}${t.error}${colors.reset}`);
      });
  }

  console.log('\n' + '═'.repeat(60));

  if (grade === 'A+') {
    console.log(`${colors.green}${colors.bold}🎉 PERFECT SCORE! Feature #86 is production-ready!${colors.reset}`);
  } else if (grade.startsWith('A') || grade.startsWith('B')) {
    console.log(`${colors.yellow}${colors.bold}⚠️  Good, but some issues need attention.${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}❌ FAILED - Critical issues must be fixed before deployment.${colors.reset}`);
  }

  console.log('═'.repeat(60) + '\n');
}

/**
 * Save results to JSON file
 */
function saveResults() {
  const outputDir = path.join(__dirname, 'test-reports-feature-86');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const reportPath = path.join(outputDir, 'validation-results.json');

  const report = {
    feature: 86,
    timestamp: new Date().toISOString(),
    summary: {
      total: results.total,
      passed: results.passed,
      failed: results.failed,
      passRate: (results.passed / results.total * 100).toFixed(1) + '%',
      grade: calculateGrade(results.passed / results.total * 100)
    },
    tests: results.tests,
    pages: [
      { name: 'writers.html', tests: 8 },
      { name: 'creators.html', tests: 8 },
      { name: 'valentine.html', tests: 8 }
    ]
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`${colors.cyan}Test results saved to: ${reportPath}${colors.reset}\n`);
}

/**
 * Main test execution
 */
function main() {
  console.log(`${colors.bold}${colors.blue}
╔═══════════════════════════════════════════════════════════╗
║          FEATURE #86 VALIDATION TEST SUITE               ║
║   Quad Threat Pattern - Writers, Creators, Valentine     ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  const pagesDir = path.join(__dirname, 'pages');

  // Test the 3 new pages upgraded in Feature #86
  const pages = [
    { path: path.join(pagesDir, 'writers.html'), name: 'Writers Segment (VO3 Tools)' },
    { path: path.join(pagesDir, 'creators.html'), name: 'Creators Segment (Nano Banana)' },
    { path: path.join(pagesDir, 'valentine.html'), name: 'Valentine\'s Day Entry Hook' }
  ];

  pages.forEach(page => {
    if (fs.existsSync(page.path)) {
      testPage(page.path, page.name);
    } else {
      console.log(`${colors.red}✗ File not found: ${page.path}${colors.reset}`);
      results.total += 8; // 8 tests per page
      results.failed += 8;
    }
  });

  printSummary();
  saveResults();

  // Exit with appropriate code
  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
main();
