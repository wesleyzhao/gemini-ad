/**
 * Feature #85 Test Suite
 * Validates Quad Threat Mega Combo pattern implementation on 3 new pages
 *
 * Pages tested:
 * - future.html (Premium Aspirational)
 * - apple-style.html (Apple-Style Minimalist)
 * - index.html (Landing Hub/Index)
 *
 * Test coverage: 24 tests (3 pages × 8 tests each)
 */

const fs = require('fs');
const path = require('path');

// Test results tracking
const results = {
  totalTests: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// Pages to test (newly upgraded in Feature #85)
const pagesToTest = [
  { file: 'pages/future.html', name: 'Premium Aspirational' },
  { file: 'pages/apple-style.html', name: 'Apple-Style Minimalist' },
  { file: 'pages/index.html', name: 'Landing Hub/Index' }
];

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

/**
 * Run a single test
 */
function test(description, testFn) {
  results.totalTests++;
  try {
    testFn();
    results.passed++;
    results.tests.push({ description, status: 'PASS' });
    console.log(`${colors.green}✓${colors.reset} ${description}`);
    return true;
  } catch (error) {
    results.failed++;
    results.tests.push({ description, status: 'FAIL', error: error.message });
    console.log(`${colors.red}✗${colors.reset} ${description}`);
    console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
    return false;
  }
}

/**
 * Assertion helper
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Check if content contains pattern
 */
function contains(content, pattern) {
  return content.includes(pattern);
}

/**
 * Test Quad Threat implementation for a page
 */
function testQuadThreatPattern(filePath, pageName) {
  console.log(`\n${colors.blue}Testing ${pageName} (${filePath})${colors.reset}`);

  const content = fs.readFileSync(filePath, 'utf-8');

  // Test 1: Has Quad Threat HTML container
  test(`${pageName}: Has Quad Threat HTML container`, () => {
    assert(
      contains(content, '<div class="quad-threat-container">'),
      'Missing Quad Threat container div'
    );
  });

  // Test 2: Has sticky CTA button
  test(`${pageName}: Has sticky CTA button`, () => {
    assert(
      contains(content, '<button class="sticky-cta-quad"'),
      'Missing sticky CTA button'
    );
  });

  // Test 3: Has social proof banner
  test(`${pageName}: Has social proof banner`, () => {
    assert(
      contains(content, '<div class="social-proof-banner-quad">'),
      'Missing social proof banner'
    );
  });

  // Test 4: Has Wave 4 comment marker
  test(`${pageName}: Has Wave 4 comment marker`, () => {
    assert(
      contains(content, 'Wave 4: Quad Threat'),
      'Missing Wave 4 comment marker'
    );
  });

  // Test 5: Has Quad Threat CSS styles
  test(`${pageName}: Has Quad Threat CSS styles`, () => {
    assert(
      contains(content, '.sticky-cta-quad {') && contains(content, '.social-proof-banner-quad {'),
      'Missing Quad Threat CSS styles'
    );
  });

  // Test 6: Has social proof avatars
  test(`${pageName}: Has social proof avatars`, () => {
    assert(
      contains(content, '<div class="social-proof-avatars">'),
      'Missing social proof avatars container'
    );
    assert(
      content.match(/data:image\/svg\+xml.*circle.*fill.*4285f4/),
      'Missing first avatar (blue)'
    );
    assert(
      content.match(/data:image\/svg\+xml.*circle.*fill.*34a853/),
      'Missing second avatar (green)'
    );
    assert(
      content.match(/data:image\/svg\+xml.*circle.*fill.*fbbc04/),
      'Missing third avatar (yellow)'
    );
  });

  // Test 7: CTA button opens Gemini
  test(`${pageName}: CTA button opens Gemini`, () => {
    assert(
      contains(content, 'window.open(\'https://gemini.google.com\''),
      'CTA button does not open Gemini URL'
    );
    assert(
      contains(content, 'Try Gemini Free →'),
      'CTA button missing call-to-action text'
    );
  });

  // Test 8: Has mobile responsive styles
  test(`${pageName}: Has mobile responsive styles`, () => {
    assert(
      contains(content, '@media (max-width: 768px)'),
      'Missing mobile responsive media query'
    );
    assert(
      contains(content, '.sticky-cta-quad') && content.indexOf('@media (max-width: 768px)') < content.lastIndexOf('.sticky-cta-quad'),
      'Missing mobile styles for sticky CTA'
    );
  });
}

/**
 * Main test runner
 */
function runTests() {
  console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Feature #85 Test Suite - Quad Threat Pattern Validation${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`Testing ${pagesToTest.length} pages with Quad Threat pattern:\n`);

  // Test each page
  pagesToTest.forEach(page => {
    testQuadThreatPattern(page.file, page.name);
  });

  // Print summary
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Test Summary${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

  const successRate = ((results.passed / results.totalTests) * 100).toFixed(1);
  const grade = successRate === '100.0' ? 'A+' :
                successRate >= 95 ? 'A' :
                successRate >= 90 ? 'A-' :
                successRate >= 85 ? 'B+' :
                successRate >= 80 ? 'B' : 'C';

  console.log(`Total Tests:    ${results.totalTests}`);
  console.log(`${colors.green}Passed:         ${results.passed} ✓${colors.reset}`);
  if (results.failed > 0) {
    console.log(`${colors.red}Failed:         ${results.failed} ✗${colors.reset}`);
  } else {
    console.log(`${colors.green}Failed:         ${results.failed}${colors.reset}`);
  }
  console.log(`Success Rate:   ${successRate}%`);
  console.log(`Grade:          ${grade}\n`);

  // Save results to JSON
  const reportDir = 'test-reports-feature-85';
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    feature: 85,
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.totalTests,
      passed: results.passed,
      failed: results.failed,
      successRate: `${successRate}%`,
      grade: grade
    },
    pages: pagesToTest.map(page => page.name),
    tests: results.tests
  };

  fs.writeFileSync(
    path.join(reportDir, 'validation-results.json'),
    JSON.stringify(report, null, 2)
  );

  console.log(`${colors.green}✓${colors.reset} Test results saved to ${reportDir}/validation-results.json\n`);

  // Exit with appropriate code
  if (results.failed === 0) {
    console.log(`${colors.green}All tests passed! Feature #85 implementation is production-ready. 🎉${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}Some tests failed. Please review and fix issues before deployment.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run the tests
runTests();
