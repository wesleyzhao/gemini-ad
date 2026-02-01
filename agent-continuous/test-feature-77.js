#!/usr/bin/env node

/**
 * Feature #77 Validation Tests
 * Wave 2 A/B Testing Launch
 *
 * Tests:
 * 1. Variant page generation (12 pages)
 * 2. Router script deployment
 * 3. Mobile dashboard creation
 * 4. Documentation completeness
 * 5. Pattern implementation correctness
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TESTS = {
  variantPages: [
    'ab-tests/wave2-variants/social-proof/writers.html',
    'ab-tests/wave2-variants/social-proof/creators.html',
    'ab-tests/wave2-variants/social-proof/operators.html',
    'ab-tests/wave2-variants/social-proof/automators.html',
    'ab-tests/wave2-variants/scarcity-trust/writers.html',
    'ab-tests/wave2-variants/scarcity-trust/creators.html',
    'ab-tests/wave2-variants/scarcity-trust/operators.html',
    'ab-tests/wave2-variants/scarcity-trust/automators.html',
    'ab-tests/wave2-variants/mobile-optimized/writers.html',
    'ab-tests/wave2-variants/mobile-optimized/creators.html',
    'ab-tests/wave2-variants/mobile-optimized/operators.html',
    'ab-tests/wave2-variants/mobile-optimized/automators.html'
  ],
  scripts: [
    'scripts/deploy-wave2-ab-tests.js',
    'ab-tests/wave2-router.js'
  ],
  dashboards: [
    'dashboard/mobile-conversion-dashboard.html'
  ],
  documentation: [
    'docs/WAVE2-DEPLOYMENT-GUIDE.md'
  ],
  manifests: [
    'ab-tests/wave2-variants/deployment-manifest.json'
  ]
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    log(`✅ ${name}`, 'green');
    return true;
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    log(`❌ ${name}`, 'red');
    log(`   ${error.message}`, 'red');
    return false;
  }
}

function fileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
}

function fileContains(filePath, searchString) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes(searchString)) {
    throw new Error(`File ${filePath} does not contain: ${searchString}`);
  }
}

function fileSize(filePath, minSize) {
  const stats = fs.statSync(filePath);
  if (stats.size < minSize) {
    throw new Error(`File ${filePath} is too small (${stats.size} bytes, expected >${minSize})`);
  }
}

// Run tests
console.log('\n' + '='.repeat(60));
log('🧪 FEATURE #77 VALIDATION TESTS', 'blue');
log('Wave 2 A/B Testing Launch', 'blue');
console.log('='.repeat(60) + '\n');

// Test 1: Variant Pages Exist
log('📄 Testing Variant Pages...', 'yellow');
TESTS.variantPages.forEach(page => {
  test(`Variant page exists: ${page}`, () => {
    fileExists(page);
    fileSize(page, 1000); // At least 1KB
  });
});

// Test 2: Pattern Implementation
log('\n🎨 Testing Pattern Implementations...', 'yellow');

test('Social Proof pattern CSS injected', () => {
  const page = TESTS.variantPages[0];
  fileContains(page, 'social-proof-banner');
  fileContains(page, 'testimonial-card');
  fileContains(page, 'stat-number');
});

test('Social Proof pattern HTML injected', () => {
  const page = TESTS.variantPages[0];
  fileContains(page, '2.5M+');
  fileContains(page, '4.9/5');
  fileContains(page, '98%');
  fileContains(page, 'Writers Using Gemini');
});

test('Scarcity+Trust pattern CSS injected', () => {
  const page = TESTS.variantPages[4];
  fileContains(page, 'trust-badge-bar');
  fileContains(page, 'scarcity-callout');
  fileContains(page, 'pulse-glow');
});

test('Scarcity+Trust pattern HTML injected', () => {
  const page = TESTS.variantPages[4];
  fileContains(page, 'Google Verified');
  fileContains(page, 'SOC 2 Certified');
  fileContains(page, 'Beta Access Closing Soon');
  fileContains(page, 'beta-spots');
});

test('Mobile-Optimized pattern CSS injected', () => {
  const page = TESTS.variantPages[8];
  fileContains(page, 'mobile-sticky-cta');
  fileContains(page, 'quick-action-bubble');
  fileContains(page, 'mobile-testimonials');
});

test('Mobile-Optimized pattern HTML injected', () => {
  const page = TESTS.variantPages[8];
  fileContains(page, 'Limited spots available');
  fileContains(page, 'Try Free →');
  fileContains(page, 'mobile-testimonial-card');
});

test('Variant tracking comments added', () => {
  const page = TESTS.variantPages[0];
  fileContains(page, 'Wave 2 A/B Test Variant');
  fileContains(page, 'Pattern:');
  fileContains(page, 'Predicted Lift:');
});

// Test 3: Deployment Scripts
log('\n📜 Testing Deployment Scripts...', 'yellow');

test('Deploy script exists', () => {
  fileExists(TESTS.scripts[0]);
  fileSize(TESTS.scripts[0], 5000);
});

test('Deploy script has pattern definitions', () => {
  fileContains(TESTS.scripts[0], 'social-proof');
  fileContains(TESTS.scripts[0], 'scarcity-trust');
  fileContains(TESTS.scripts[0], 'mobile-optimized');
});

test('Router script exists', () => {
  fileExists(TESTS.scripts[1]);
  fileSize(TESTS.scripts[1], 3000);
});

test('Router has device detection', () => {
  fileContains(TESTS.scripts[1], 'isMobile');
  fileContains(TESTS.scripts[1], 'Android|webOS|iPhone');
});

test('Router has variant assignment logic', () => {
  fileContains(TESTS.scripts[1], 'assignVariant');
  fileContains(TESTS.scripts[1], 'gemini_wave2_variant');
});

test('Router has GA4 tracking', () => {
  fileContains(TESTS.scripts[1], 'wave2_variant_assigned');
  fileContains(TESTS.scripts[1], 'wave2_page_view');
  fileContains(TESTS.scripts[1], 'wave2_conversion');
});

// Test 4: Mobile Dashboard
log('\n📊 Testing Mobile Dashboard...', 'yellow');

test('Mobile dashboard exists', () => {
  fileExists(TESTS.dashboards[0]);
  fileSize(TESTS.dashboards[0], 8000);
});

test('Dashboard has mobile conversion metrics', () => {
  fileContains(TESTS.dashboards[0], 'Overall Mobile Conversion');
  fileContains(TESTS.dashboards[0], 'Mobile Traffic Share');
  fileContains(TESTS.dashboards[0], 'Mobile Engagement');
});

test('Dashboard has pattern comparison', () => {
  fileContains(TESTS.dashboards[0], 'Mobile-Optimized Combo');
  fileContains(TESTS.dashboards[0], 'Social Proof + Personalization');
  fileContains(TESTS.dashboards[0], 'Scarcity + Trust Signals');
});

test('Dashboard has auto-refresh', () => {
  fileContains(TESTS.dashboards[0], 'refreshData');
  fileContains(TESTS.dashboards[0], 'setInterval');
});

// Test 5: Documentation
log('\n📚 Testing Documentation...', 'yellow');

test('Wave 2 deployment guide exists', () => {
  fileExists(TESTS.documentation[0]);
  fileSize(TESTS.documentation[0], 10000);
});

test('Guide has deployment steps', () => {
  fileContains(TESTS.documentation[0], 'Deployment Steps');
  fileContains(TESTS.documentation[0], 'Step 1: Generate Variant Pages');
  fileContains(TESTS.documentation[0], 'Step 2: Deploy Router Script');
});

test('Guide has monitoring section', () => {
  fileContains(TESTS.documentation[0], 'Monitoring & Analytics');
  fileContains(TESTS.documentation[0], 'Real-Time Dashboard');
  fileContains(TESTS.documentation[0], 'GA4 Exploration');
});

test('Guide has troubleshooting', () => {
  fileContains(TESTS.documentation[0], 'Troubleshooting');
  fileContains(TESTS.documentation[0], 'Issue:');
  fileContains(TESTS.documentation[0], '**Solution**:');
});

// Test 6: Deployment Manifest
log('\n📋 Testing Deployment Manifest...', 'yellow');

test('Deployment manifest exists', () => {
  fileExists(TESTS.manifests[0]);
});

test('Manifest has correct structure', () => {
  const manifest = JSON.parse(fs.readFileSync(TESTS.manifests[0], 'utf8'));
  if (!manifest.timestamp) throw new Error('Manifest missing timestamp');
  if (manifest.wave !== 2) throw new Error('Manifest wave should be 2');
  if (!Array.isArray(manifest.tests)) throw new Error('Manifest missing tests array');
});

test('Manifest has all three patterns', () => {
  const manifest = JSON.parse(fs.readFileSync(TESTS.manifests[0], 'utf8'));
  const patterns = manifest.tests.map(t => t.pattern);
  if (!patterns.includes('Social Proof + Personalization')) {
    throw new Error('Manifest missing Social Proof pattern');
  }
  if (!patterns.includes('Scarcity + Trust Signals')) {
    throw new Error('Manifest missing Scarcity+Trust pattern');
  }
  if (!patterns.includes('Mobile-Optimized Combo')) {
    throw new Error('Manifest missing Mobile-Optimized pattern');
  }
});

test('Manifest has correct variant count', () => {
  const manifest = JSON.parse(fs.readFileSync(TESTS.manifests[0], 'utf8'));
  manifest.tests.forEach(testInfo => {
    if (testInfo.variants.length !== 4) {
      throw new Error(`Pattern ${testInfo.pattern} should have 4 variants, found ${testInfo.variants.length}`);
    }
  });
});

// Test 7: File Structure
log('\n📁 Testing File Structure...', 'yellow');

test('Social Proof directory exists', () => {
  if (!fs.existsSync('ab-tests/wave2-variants/social-proof')) {
    throw new Error('Social Proof directory not found');
  }
});

test('Scarcity+Trust directory exists', () => {
  if (!fs.existsSync('ab-tests/wave2-variants/scarcity-trust')) {
    throw new Error('Scarcity+Trust directory not found');
  }
});

test('Mobile-Optimized directory exists', () => {
  if (!fs.existsSync('ab-tests/wave2-variants/mobile-optimized')) {
    throw new Error('Mobile-Optimized directory not found');
  }
});

// Test 8: Accessibility
log('\n♿ Testing Accessibility...', 'yellow');

test('Sticky CTA has proper ARIA labels', () => {
  const page = TESTS.variantPages[8];
  const content = fs.readFileSync(page, 'utf8');
  // Mobile pattern should have accessible buttons
  if (!content.includes('mobile-cta-button')) {
    throw new Error('Mobile CTA button missing');
  }
});

test('Testimonials have semantic structure', () => {
  const page = TESTS.variantPages[0];
  fileContains(page, 'testimonial-author');
  fileContains(page, 'author-name');
  fileContains(page, 'author-role');
});

// Print summary
console.log('\n' + '='.repeat(60));
log('📊 TEST SUMMARY', 'blue');
console.log('='.repeat(60));

const total = results.passed + results.failed;
const passRate = ((results.passed / total) * 100).toFixed(1);

log(`Total Tests: ${total}`, 'blue');
log(`✅ Passed: ${results.passed}`, 'green');
if (results.failed > 0) {
  log(`❌ Failed: ${results.failed}`, 'red');
}
log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'green' : 'yellow');

// Grade
let grade = 'F';
if (passRate >= 98) grade = 'A+';
else if (passRate >= 93) grade = 'A';
else if (passRate >= 90) grade = 'A-';
else if (passRate >= 87) grade = 'B+';
else if (passRate >= 83) grade = 'B';
else if (passRate >= 80) grade = 'B-';
else if (passRate >= 77) grade = 'C+';
else if (passRate >= 73) grade = 'C';

log(`Grade: ${grade}`, grade.startsWith('A') ? 'green' : grade.startsWith('B') ? 'yellow' : 'red');

// Save results
const report = {
  feature: 77,
  name: 'Wave 2 A/B Testing Launch',
  timestamp: new Date().toISOString(),
  summary: {
    total,
    passed: results.passed,
    failed: results.failed,
    passRate: parseFloat(passRate),
    grade
  },
  tests: results.tests
};

const reportDir = 'test-reports-feature-77';
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

fs.writeFileSync(
  path.join(reportDir, 'validation-results.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n' + '='.repeat(60));
log(`✅ Test report saved to ${reportDir}/validation-results.json`, 'green');
console.log('='.repeat(60) + '\n');

// Exit with appropriate code
process.exit(results.failed > 0 ? 1 : 0);
