/**
 * Feature #87 Validation Tests
 * Apply Quad Threat Mega Combo to Final 3 Baseline Pages
 * Target: Exceed $200M revenue goal
 *
 * Tests: 24 total (3 pages × 8 tests each)
 * Pages: trust.html, operators.html, automators.html
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const PAGES_TO_TEST = [
  {
    file: './pages/trust.html',
    name: 'Trust Page',
    expectedElements: {
      stickyCTA: true,
      socialProof: true,
      ctaText: 'Try Gemini Free',
      socialProofText: '2.5M+ professionals'
    }
  },
  {
    file: './pages/operators.html',
    name: 'Operators Page',
    expectedElements: {
      stickyCTA: true,
      socialProof: true,
      ctaText: 'Try Gemini Free',
      socialProofText: '2.5M+ professionals'
    }
  },
  {
    file: './pages/automators.html',
    name: 'Automators Page',
    expectedElements: {
      stickyCTA: true,
      socialProof: true,
      ctaText: 'Try Gemini Free',
      socialProofText: '2.5M+ professionals'
    }
  }
];

// Test results storage
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(testName, passed, message = '') {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    results.failed++;
    console.log(`❌ FAIL: ${testName}`);
    if (message) console.log(`   ${message}`);
  }
  results.tests.push({ testName, passed, message });
}

// Test Suite
console.log('================================================================================');
console.log('FEATURE #87 VALIDATION TEST SUITE');
console.log('================================================================================\n');
console.log('Testing Quad Threat Mega Combo Pattern on Final 3 Baseline Pages');
console.log('Target: Exceed $200M Annual Revenue Goal\n');

PAGES_TO_TEST.forEach((page, index) => {
  console.log(`\n--- Testing ${page.name} (${index + 1}/3) ---\n`);

  // Read file
  let content;
  try {
    content = fs.readFileSync(page.file, 'utf8');
  } catch (error) {
    logTest(`${page.name}: File Exists`, false, `Could not read file: ${error.message}`);
    // Skip remaining tests for this page
    for (let i = 1; i < 8; i++) {
      logTest(`${page.name}: Test ${i + 1}`, false, 'Skipped - file not found');
    }
    return;
  }

  // Test 1: File exists and is readable
  logTest(`${page.name}: File Exists`, true);

  // Test 2: Sticky CTA button class exists
  const hasStickyCTAClass = content.includes('quad-sticky-cta');
  logTest(
    `${page.name}: Sticky CTA Class`,
    hasStickyCTAClass,
    hasStickyCTAClass ? '' : 'Missing .quad-sticky-cta class'
  );

  // Test 3: Social proof banner class exists
  const hasSocialProofClass = content.includes('quad-social-proof');
  logTest(
    `${page.name}: Social Proof Class`,
    hasSocialProofClass,
    hasSocialProofClass ? '' : 'Missing .quad-social-proof class'
  );

  // Test 4: CTA button element exists
  const hasCTAButton = content.includes('quad-cta-button');
  logTest(
    `${page.name}: CTA Button Element`,
    hasCTAButton,
    hasCTAButton ? '' : 'Missing CTA button element'
  );

  // Test 5: CTA text is correct
  const hasCTAText = content.includes(page.expectedElements.ctaText);
  logTest(
    `${page.name}: CTA Text`,
    hasCTAText,
    hasCTAText ? '' : `Expected "${page.expectedElements.ctaText}" not found`
  );

  // Test 6: Social proof text exists
  const hasSocialProofText = content.includes(page.expectedElements.socialProofText);
  logTest(
    `${page.name}: Social Proof Text`,
    hasSocialProofText,
    hasSocialProofText ? '' : `Expected "${page.expectedElements.socialProofText}" not found`
  );

  // Test 7: Avatar elements exist
  const hasAvatars = content.includes('quad-avatars') && content.includes('quad-avatar');
  logTest(
    `${page.name}: Avatar Elements`,
    hasAvatars,
    hasAvatars ? '' : 'Missing avatar elements'
  );

  // Test 8: Mobile responsive styles exist
  const hasMobileStyles = content.includes('@media (max-width: 768px)');
  logTest(
    `${page.name}: Mobile Responsive Styles`,
    hasMobileStyles,
    hasMobileStyles ? '' : 'Missing mobile responsive styles'
  );
});

// Print summary
console.log('\n================================================================================');
console.log('TEST SUMMARY');
console.log('================================================================================\n');
console.log(`Total Tests: ${results.total}`);
console.log(`Passed: ${results.passed} ✅`);
console.log(`Failed: ${results.failed} ❌`);
console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

// Calculate grade
let grade;
const successRate = (results.passed / results.total) * 100;
if (successRate === 100) grade = 'A+';
else if (successRate >= 95) grade = 'A';
else if (successRate >= 90) grade = 'A-';
else if (successRate >= 85) grade = 'B+';
else if (successRate >= 80) grade = 'B';
else grade = 'C or lower';

console.log(`Grade: ${grade}\n`);

// Save results to JSON
const reportDir = './test-reports-feature-87';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const report = {
  feature: 87,
  description: 'Apply Quad Threat to Final 3 Baseline Pages (trust, operators, automators)',
  timestamp: new Date().toISOString(),
  summary: {
    total: results.total,
    passed: results.passed,
    failed: results.failed,
    successRate: `${successRate.toFixed(1)}%`,
    grade: grade
  },
  pages: PAGES_TO_TEST.map(p => p.name),
  tests: results.tests
};

fs.writeFileSync(
  path.join(reportDir, 'validation-results.json'),
  JSON.stringify(report, null, 2)
);

console.log(`Report saved to: ${reportDir}/validation-results.json\n`);

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
